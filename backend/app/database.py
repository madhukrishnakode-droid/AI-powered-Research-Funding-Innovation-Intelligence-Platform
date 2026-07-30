from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

from urllib.parse import quote_plus

# Load environmental configs from file
load_dotenv()

DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_NAME = os.getenv("DB_NAME", "research_platform")

# mysql+pymysql connects via pymysql driver
DATABASE_URL = f"mysql+pymysql://{DB_USER}:{quote_plus(DB_PASSWORD)}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=3600
)

# Open local active DB sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declarative entity base
Base = declarative_base()

def get_db():
    """Dependency helper providing session context to routers."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
