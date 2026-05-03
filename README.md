# EduSync - Predictive Classroom Resource Optimization

EduSync is an AI-driven system designed to help educational institutions manage classroom resources efficiently and generate AI insights from usage data.

## Features
- **User Authentication**: JWT-based secure authorization with Role-based Access Control (Admin, Faculty, Student)
- **Classroom Management**: Add and manage classrooms and resources.
- **Booking Engine**: Sophisticated booking system to prevent conflicts and track history.
- **AI Analytics**: Uses usage log data to predict demand and offer actionable recommendations.
- **Generative Dashboard**: Modern, dark-themed UI built with React, Tailwind CSS, and Chart.js.

## Tech Stack
- Frontend: React (Vite), Tailwind CSS, Chart.js
- Backend: FastAPI, SQLAlchemy, Pydantic, SQLite,MySQL
- AI Module: Pandas, Scikit-learn, Numpy

---

## 🚀 Setup Instructions

### 1. Database Setup
We are using SQLite! No installations or configurations are required. The database file will automatically be created when you start the server.

### 2. Backend Setup
1. Open a terminal in the `backend/` directory.
2. Create a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Seed the initial data into the SQLite database:
   ```bash
   python seed.py
   ```
5. Run the FastAPI Server:
   ```bash
   uvicorn main:app --reload
   ```
   *The server runs at http://127.0.0.1:8000*
   *Visit http://127.0.0.1:8000/docs for Swagger UI API docs.*

### 3. Frontend Setup
1. Open another terminal in the `frontend/` directory.
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The app runs at http://localhost:5173*

## AI Analytics Overview
The system tracks all bookings via the `UsageLogs` and `Bookings` tables.
The AI engine computes:
- `usage_analysis.py`: Aggregates the most and least utilized rooms and temporal demand peaks.
- `prediction_model.py`: Runs a lightweight Scikit-learn `LinearRegression` over booking frequency based on days of the week to predict upcoming demand per room.
- `recommendations.py`: Translates raw AI signals into actionable, descriptive statements exposed to the Generative UI dashboard.

## Project Structure
```
c:\sem4project_anti\
├── database/
│   └── schema.sql        # MySQL schemas
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js    # React + Tailwind Dashboard
├── backend/
│   ├── main.py           # FastAPI entry
│   ├── database.py       
│   ├── models.py         # SQLAlchemy ORM
│   ├── schemas.py        # Pydantic validation
│   ├── auth.py           # JWT rules
│   ├── routes/
│   └── ai_module/        # Machine Learning pipelines
└── README.md
```
