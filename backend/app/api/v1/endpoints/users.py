from fastapi import APIRouter
from app.schemas.user import User

router = APIRouter()

@router.get("/me", response_model=User)
def read_current_user_me():
    """Retrieve logged-in user profile info."""
    # Placeholder profile
    return {
        "id": 1,
        "email": "user@example.com",
        "full_name": "Default User",
        "role": "researcher",
        "is_active": True
    }
