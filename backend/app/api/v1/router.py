from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, funding, innovation

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(funding.router, prefix="/funding", tags=["funding"])
api_router.include_router(innovation.router, prefix="/innovation", tags=["innovation"])
