# EduSync - Predictive Classroom Resource Optimization

EduSync is an AI-enabled resource management platform for educational institutions. It combines a React/Tailwind dashboard with a FastAPI backend and analytics pipelines to manage classrooms, resources, bookings, and demand forecasting.

## Key Features
- **User authentication** with JWT and role-based access control.
- **Classroom and resource management** for creating, updating, and listing campus assets.
- **Booking engine** with conflict checking, booking history, and availability tracking.
- **AI analytics** for usage patterns, demand prediction, and recommendations.
- **Modern UI** built with React, Vite, Tailwind CSS, and Chart.js.

## Tech Stack
- Frontend: React, Vite, Tailwind CSS, Chart.js
- Backend: FastAPI, SQLAlchemy, Pydantic
- Database: local SQLite fallback for development, Docker Compose MySQL for containerized setup
- AI / analytics: Pandas, NumPy, Scikit-learn

## Repository Layout
```
c:\sem4project_anti\
├── backend/              # FastAPI application and API routes
│   ├── ai_module/        # ML pipelines and analytics logic
│   ├── database.py       # SQLAlchemy engine and session setup
│   ├── Dockerfile        # Backend Docker image definition
│   ├── main.py           # FastAPI application entrypoint
│   ├── models.py         # DB model definitions
│   ├── requirements.txt  # Python dependencies
│   ├── routes/           # API route modules
│   ├── schemas.py        # Pydantic request/response models
│   └── seed.py           # Local data seeding script
├── database/             # SQL initialization scripts for Docker MySQL
│   ├── schema.sql
│   └── seed.sql
├── frontend/             # React frontend application
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── docker-compose.yml    # Optional Docker Compose orchestration
└── README.md
```

## Local Development
### Backend
1. Open a terminal in `backend/`.
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   .venv\Scripts\activate
   ```
3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. (Optional) Seed the local database:
   ```bash
   python seed.py
   ```
5. Run the backend:
   ```bash
   uvicorn main:app --reload
   ```
6. Open the API docs at `http://127.0.0.1:8000/docs`.

#### Notes
- If `DATABASE_URL` is not set, the backend uses a local SQLite file at `./edusync.db`.
- You can add a `.env` file in `backend/` to configure `DATABASE_URL`, `SECRET_KEY`, `ALGORITHM`, and `ACCESS_TOKEN_EXPIRE_MINUTES`.

### Frontend
1. Open a terminal in `frontend/`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite app:
   ```bash
   npm run dev
   ```
4. Visit the app at the URL shown in the terminal (typically `http://localhost:5173`).

## Docker Compose (Optional)
The repository includes `docker-compose.yml` for a containerized MySQL + backend + frontend stack.

```bash
docker compose up --build
```

> Note: The current repository includes a backend Dockerfile, but the frontend service build in `docker-compose.yml` expects a `frontend/Dockerfile` that is not present. Use the local frontend dev server if you do not have that Dockerfile.

### Environment Variables
- `MYSQL_ROOT_PASSWORD`: MySQL root password (default: `rootpassword`)
- `MYSQL_DATABASE`: Database name (default: `edusync`)
- `MYSQL_USER`: MySQL user (default: `edusync_user`)
- `MYSQL_PASSWORD`: MySQL user password (default: `edusync_pass`)
- `DATABASE_URL`: Backend SQLAlchemy connection string
- `SECRET_KEY`: JWT secret key
- `ALGORITHM`: JWT algorithm (default: `HS256`)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiry minutes (default: `60`)

## Dependencies
### Backend
- `fastapi`
- `uvicorn`
- `sqlalchemy`
- `psycopg2-binary`
- `python-dotenv`
- `pydantic`
- `pydantic-settings`
- `passlib[bcrypt]`
- `python-jose[cryptography]`
- `python-multipart`

### Frontend
- `react`
- `react-dom`
- `react-router-dom`
- `chart.js`
- `react-chartjs-2`
- `axios`
- `@supabase/supabase-js`
- `framer-motion`
- `lucide-react`
- `tailwind-merge`
- `@lottiefiles/dotlottie-react`

## AI Analytics
- `backend/ai_module/usage_analysis.py`: usage trends and demand aggregation
- `backend/ai_module/prediction_model.py`: demand forecasting model
- `backend/ai_module/recommendations.py`: recommendation generation from analytics signals

## Getting Help
If you need to configure a different database backend, set `DATABASE_URL` in `backend/.env` or your shell environment before starting the server.
