from pathlib import Path
import os
from urllib.parse import quote_plus
BASE_DIR = Path(__file__).resolve().parents[2]
ENV_FILE = BASE_DIR / ".env"
def _load_env_file() -> None:
    """Load environment variables from the .env file if it exists."""
    if not ENV_FILE.exists():
        return
    for line in ENV_FILE.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        os.environ.setdefault(key, value)
_load_env_file()
class Settings:
    """Application settings loaded from environment variables."""
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "Research Funding & Innovation Intelligence Platform")
    API_V1_STR: str = os.getenv("API_V1_STR", "/api/v1")
    DB_HOST: str = os.getenv("DB_HOST", "localhost")
    DB_PORT: str = os.getenv("DB_PORT", "3306")
    DB_USER: str = os.getenv("DB_USER", "root")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD", "")
    DB_NAME: str = os.getenv("DB_NAME", "research_platform")
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        f"mysql+pymysql://{DB_USER}:{quote_plus(DB_PASSWORD)}@{DB_HOST}:{DB_PORT}/{DB_NAME}",
    )
    SECRET_KEY: str = os.getenv("SECRET_KEY", "change-me")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
settings = Settings()
