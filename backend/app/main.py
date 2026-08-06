from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from starlette.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth
from app.database import engine, Base, SessionLocal
from app.routes import auth, users, publications, patents, funding, innovation, reports, collaborations, lab_resources, alerts, settings as settings_router
from app.core.config import settings
from sqlalchemy import text
import os
from dotenv import load_dotenv

load_dotenv()

# Build database tables if they do not exist
Base.metadata.create_all(bind=engine)

# Dynamic Migration Helper to update existing Users table
def run_migrations():
    db = SessionLocal()
    try:
        # Check current columns on Users table
        result = db.execute(text("SHOW COLUMNS FROM Users"))
        columns = [row[0] for row in result.fetchall()]
        
        # Add google_id if missing
        if "google_id" not in columns:
            db.execute(text("ALTER TABLE Users ADD COLUMN google_id VARCHAR(255) UNIQUE DEFAULT NULL"))
            print("Migration: Added google_id column to Users.")
            
        # Add profile_picture if missing
        if "profile_picture" not in columns:
            db.execute(text("ALTER TABLE Users ADD COLUMN profile_picture VARCHAR(500) DEFAULT NULL"))
            print("Migration: Added profile_picture column to Users.")
            
        # Add auth_provider if missing
        if "auth_provider" not in columns:
            db.execute(text("ALTER TABLE Users ADD COLUMN auth_provider VARCHAR(50) NOT NULL DEFAULT 'email'"))
            print("Migration: Added auth_provider column to Users.")
            
        # Make password nullable for OAuth users
        db.execute(text("ALTER TABLE Users MODIFY COLUMN password VARCHAR(255) NULL"))
        print("Migration: Modified password column of Users to be nullable.")
        
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Migration Error: {e}")
    finally:
        db.close()

run_migrations()

app = FastAPI(
    title="Research Funding & Innovation Intelligence Platform API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Setup CORS Origins list
# Fallback to local react client
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000"
]

# Sessions required by Authlib for security checks
app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SECRET_KEY
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authlib OAuth client registration
oauth = OAuth()
oauth.register(
    name='google',
    client_id=settings.GOOGLE_CLIENT_ID,
    client_secret=settings.GOOGLE_CLIENT_SECRET,
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={
        'scope': 'openid email profile'
    }
)

# Connect Route handlers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users & Profiles"])
app.include_router(publications.router, prefix="/api/v1/publications", tags=["Publications"])
app.include_router(patents.router, prefix="/api/v1/patents", tags=["Patents"])
app.include_router(funding.router, prefix="/api/v1/funding", tags=["Funding Recommendations"])
app.include_router(innovation.router, prefix="/api/v1/innovation-score", tags=["Innovation Score"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["Reports"])
app.include_router(collaborations.router, prefix="/api/v1/collaborations", tags=["Collaborations"])
app.include_router(lab_resources.router, prefix="/api/v1/lab-resources", tags=["Lab Resources"])
app.include_router(alerts.router, prefix="/api/v1/alerts", tags=["Alerts"])
app.include_router(settings_router.router, prefix="/api/v1/settings", tags=["Settings"])

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Research Funding & Innovation Intelligence Platform Backend",
        "docs": "/docs"
    }

@app.get("/auth/google")
async def login_google(request: Request):
    """Initiates Google OAuth 2.0 flow, redirecting client browser to Google accounts page."""
    referer = request.headers.get("referer")
    if referer:
        from urllib.parse import urlparse
        parsed = urlparse(referer)
        frontend_origin = f"{parsed.scheme}://{parsed.netloc}"
    else:
        frontend_origin = "http://localhost:3000"
    request.session["frontend_origin"] = frontend_origin
    
    redirect_uri = "http://localhost:8000/auth/google/callback"
    return await oauth.google.authorize_redirect(request, redirect_uri)

@app.get("/auth/google/callback")
async def auth_google_callback(request: Request):
    """Processes successful OAuth 2.0 authorization, upserts user profile, signs and returns JWT."""
    from urllib.parse import quote_plus
    from app.models import User
    from app.auth import create_access_token
    from app.database import get_db
    try:
        token = await oauth.google.authorize_access_token(request)
        user_info = token.get('userinfo')
        if not user_info:
            raise Exception("Failed to retrieve user info from Google token.")
            
        email = user_info.get("email")
        name = user_info.get("name") or user_info.get("given_name", "")
        picture = user_info.get("picture", "")
        google_id = user_info.get("sub")
        
        if not email:
            raise Exception("No email matching user profile found from Google.")
            
        db = next(get_db())
        try:
            # Query by email to avoid duplicate user accounts
            user = db.query(User).filter(User.email == email).first()
            if not user:
                user = User(
                    full_name=name,
                    email=email,
                    google_id=google_id,
                    profile_picture=picture,
                    auth_provider="google",
                    role="researcher",
                    password=None
                )
                db.add(user)
            else:
                # Link Google ID and profile picture to existing email record if not already set
                user.google_id = google_id
                user.profile_picture = picture
                user.auth_provider = "google"
            db.commit()
            db.refresh(user)
        finally:
            db.close()
            
        frontend_origin = request.session.pop("frontend_origin", "http://localhost:3000")
        access_token = create_access_token(data={"sub": user.email})
        redirect_url = f"{frontend_origin}/login?token={access_token}"
        return RedirectResponse(url=redirect_url)
    except Exception as e:
        import traceback
        traceback.print_exc()
        error_msg = quote_plus(str(e))
        frontend_origin = request.session.pop("frontend_origin", "http://localhost:3000")
        return RedirectResponse(url=f"{frontend_origin}/login?error={error_msg}")
