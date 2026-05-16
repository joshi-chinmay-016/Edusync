from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import auth_routes, classroom_routes, resource_routes, booking_routes, analytics_routes
import models
from database import engine, test_connection, init_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="EduSync API")

@app.on_event("startup")
async def startup():
    print("[EduSync] Starting EduSync Backend...")
    test_connection()
    init_db()

# Configure CORS
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router, prefix="/auth", tags=["auth"])
app.include_router(classroom_routes.router, prefix="/classrooms", tags=["classrooms"])
app.include_router(resource_routes.router, prefix="/resources", tags=["resources"])
app.include_router(booking_routes.router, prefix="/bookings", tags=["bookings"])
app.include_router(analytics_routes.router, prefix="/analytics", tags=["analytics"])

@app.get("/")
def root():
    return {"message": "Welcome to EduSync API"}
