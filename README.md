# Research Funding & Innovation Intelligence Platform

A production-grade intelligence suite using **FastAPI (Python)**, **SQLAlchemy ORM (MySQL)**, and **React.js** for mapping and indexing researchers' profiles, publications portfolio, and patented IP.

---

## 1. Project Directory Structure

```text
infosys/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   └── config.py             # App environment variables & variables loaders
│   │   ├── models/
│   │   │   └── __init__.py           # Declarative DB collections
│   │   ├── routes/
│   │   │   ├── auth.py               # Session register, login, logout, password recovery
│   │   │   ├── users.py              # Profile CRUD controls
│   │   │   ├── publications.py       # Publications portfolio CRUD controls
│   │   │   └── patents.py            # Patents catalog CRUD controls
│   │   ├── schemas/
│   │   │   └── user.py               # Pydantic schemas declarations
│   │   ├── auth.py                   # JWT decoding, encryption, and blacklisting
│   │   ├── database.py               # SQLAlchemy database session setup
│   │   ├── models.py                 # Core ORM definitions
│   │   ├── schemas.py                # Core validated inputs/responses Pydantic specs
│   │   └── main.py                   # FastAPI starter, routers, and CORS middleware configuration
│   └── requirements.txt              # Backend prerequisites
├── database/
│   └── schema.sql                    # MySQL Table initializers and sample values
└── frontend/
    ├── index.html                    # Root index HTML markup
    ├── package.json                  # Frontend packaging description
    ├── vite.config.js                # Vite build router mappings
    └── src/
        ├── index.css                 # Theme guidelines and class properties
        ├── main.jsx                  # React component bootstrapping
        ├── App.jsx                   # Layout structure wrapping AuthProvider
        ├── components/common/
        │   └── Navbar.jsx            # Header navigation bar anchor tags
        ├── context/
        │   └── AuthContext.jsx       # Auth providers, logins state, and storage
        ├── routes/
        │   └── AppRoutes.jsx         # Browser redirects & protected route wraps
        ├── services/
        │   ├── api.js                # Axios pre-loaded context middleware
        │   ├── auth.js               # Authentication triggers
        │   ├── profile.js            # Profile queries mappings
        │   ├── publications.js       # Publications services
        │   └── patents.js            # Patents services
        └── pages/
            ├── Login.jsx             # Credentials login portal
            ├── Register.jsx          # Accounts sign-up window
            ├── Dashboard.jsx         # Metrics landing summary page
            ├── Profile.jsx           # Research profile CRUD view
            ├── Publications.jsx      # Authored papers CRUD view
            └── Patents.jsx           # Patented inventions CRUD view
```

---

## 2. MySQL Database Setup

1. **Start MySQL Server** (local or container-based).
2. **Access MySQL Shell**:
   ```bash
   mysql -u root -p
   ```
3. **Initialize Database and Load Tables**:
   Create the database schema and insert demo values:
   ```sql
   CREATE DATABASE IF NOT EXISTS research_platform;
   USE research_platform;
   ```
   Deploy the tables by feeding the contents of `database/schema.sql`:
   ```bash
   mysql -u root -p research_platform < database/schema.sql
   ```

---

## 3. Installation Guide & Running Applications

### Backend Setup
1. Open a terminal path in the `backend/` subdirectory.
2. Create and start a Python Virtual Environment:
   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the `backend/` directory from `.env.example`:
   ```ini
   DATABASE_URL=mysql+pymysql://root:password@localhost:3306/research_platform
   SECRET_KEY=yoursecretkeyforjwtcreation
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```
5. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```
   The backend API will serve on `http://127.0.0.1:8000`. Test endpoints interactively via Swagger docs at `http://127.0.0.1:8000/docs`.

### Frontend Setup
1. Open a terminal path in the `frontend/` subdirectory.
2. Install NodeJS modules:
   ```bash
   npm install
   ```
3. Launch development server:
   ```bash
   npm run dev
   ```
   The frontend UI will run on `http://localhost:5173`.

---

## 4. Platform API Documentation

### Authentication Module
- `POST /api/v1/auth/register`: Create user account.
- `POST /api/v1/auth/login`: Checks credentials and returns JWT `access_token` in response.
- `POST /api/v1/auth/logout`: Invalidates the token by blacklisting it on the backend server.
- `POST /api/v1/auth/forgot-password`: Generates a mock recovery ticket for account lockouts.
- `GET /api/v1/users/me`: Read profile data for the active user context.

### Research Profile CRUD
- `GET /api/v1/users/me/profile`: Retrieve user's research details.
- `POST /api/v1/users/me/profile`: Initialize research profile parameters.
- `PUT /api/v1/users/me/profile`: Change profile details.
- `DELETE /api/v1/users/me/profile`: Wipe research profile details.

### Publications Portfolio CRUD (Scoped)
- `GET /api/v1/publications/`: Get logged-in user's papers.
- `POST /api/v1/publications/`: Authors details submission.
- `PUT /api/v1/publications/{id}`: Modify a specific publication record.
- `DELETE /api/v1/publications/{id}`: Delete a specific publication record.

### Patents Registry CRUD (Scoped)
- `GET /api/v1/patents/`: Get logged-in user's patents.
- `POST /api/v1/patents/`: Register a new patent.
- `PUT /api/v1/patents/{id}`: Modify a specific patent record.
- `DELETE /api/v1/patents/{id}`: Delete a specific patent record.

---

## 5. Common Errors & Fixes
* **Error**: `CORS Policy Blocked Request`
  * *Fix*: Ensure frontend origin `http://localhost:5173` is listed inside the backend `main.py` CORS whitelist.
* **Error**: `Signature Has Expired` or `Could Not Validate Credentials`
  * *Fix*: The user's token session has expired (30-minute JWT duration). The user is routed back to `/login` to acquire a new token.
* **Error**: `Can't connect to MySQL server on 'localhost'`
  * *Fix*: Verify MySQL Service is running, and match credential details in the backend `.env` variables loader.
