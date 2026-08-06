from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Alert
from app.schemas import Alert as AlertSchema, AlertCreate
from app.auth import get_current_user

router = APIRouter()

MOCK_ALERTS = [
    {
        "alert_type": "warning",
        "message": "Grant application deadline for Department of Energy (DOE) Clean Energy Fund is in 2 weeks."
    },
    {
        "alert_type": "info",
        "message": "Collaboration request from Dr. Aris Thorne (MIT CSAIL) regarding superconducting cubits."
    },
    {
        "alert_type": "success",
        "message": "Patent 'Fault-Tolerant Quantum Circuit Mapping' has been officially GRANTED."
    }
]

@router.get("/", response_model=List[AlertSchema])
def list_alerts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve list of alerts/notifications for the current user."""
    alerts = db.query(Alert).filter(Alert.user_id == current_user.id).all()
    if not alerts:
        for a in MOCK_ALERTS:
            new_a = Alert(
                user_id=current_user.id,
                alert_type=a["alert_type"],
                message=a["message"]
            )
            db.add(new_a)
        db.commit()
        alerts = db.query(Alert).filter(Alert.user_id == current_user.id).all()
    return alerts

@router.put("/{alert_id}/read", response_model=AlertSchema)
def mark_alert_read(
    alert_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark a notification as read."""
    alert = db.query(Alert).filter(Alert.id == alert_id, Alert.user_id == current_user.id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.is_read = True
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return alert
