from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Report
from app.schemas import Report as ReportSchema, ReportCreate
from app.auth import get_current_user
from datetime import datetime

router = APIRouter()

MOCK_REPORTS = [
    {
        "title": "Q3 Innovation Assessment & Competitor Intellectual Property Report",
        "report_type": "PDF",
        "file_size": "2.4 MB",
        "preview_snippet": "This report details comparative patent dynamics in quantum annealing architectures, tracking filing velocities of top institutions."
    },
    {
        "title": "Federal Funding Landscape Analysis for Emerging Quantum Research",
        "report_type": "PDF",
        "file_size": "1.8 MB",
        "preview_snippet": "A comprehensive review of cross-agency research grants spanning DOE, NSF, and DARPA allocations for the fiscal year 2026."
    },
    {
        "title": "Pre-clinical Research Summary: Neural Network Therapeutics Integration",
        "report_type": "DOCX",
        "file_size": "850 KB",
        "preview_snippet": "Draft summary of neural target mappings and computer-aided diagnostics framework for preclinical validation trials."
    }
]

@router.get("/", response_model=List[ReportSchema])
def list_reports(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetch all research reports for the current user."""
    reports = db.query(Report).filter(Report.user_id == current_user.id).all()
    if not reports:
        for r in MOCK_REPORTS:
            new_r = Report(
                user_id=current_user.id,
                title=r["title"],
                report_type=r["report_type"],
                file_size=r["file_size"],
                preview_snippet=r["preview_snippet"]
            )
            db.add(new_r)
        db.commit()
        reports = db.query(Report).filter(Report.user_id == current_user.id).all()
    return reports

@router.post("/", response_model=ReportSchema, status_code=status.HTTP_201_CREATED)
def create_report(
    report_in: ReportCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Instantiate a new report."""
    report = Report(**report_in.model_dump(), user_id=current_user.id)
    db.add(report)
    db.commit()
    db.refresh(report)
    return report

@router.delete("/{report_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_report(
    report_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a report from the user's library."""
    report = db.query(Report).filter(Report.id == report_id, Report.user_id == current_user.id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    db.delete(report)
    db.commit()
    return
