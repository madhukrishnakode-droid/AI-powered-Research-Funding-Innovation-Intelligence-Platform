from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, declarative_base, sessionmaker
from app.core.config import settings
SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL
engine = create_engine(SQLALCHEMY_DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)
Base = declarative_base()
def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency that provides a database session.
    This generator yields a SQLAlchemy session and closes it after the request.
    Use it in path operations with `Depends(get_db)`.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
