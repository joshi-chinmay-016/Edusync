import os
from sqlalchemy import text
from app.db.session import SessionLocal, engine
from app.db.base import Base
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Database session dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Connection check
def test_connection():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        print("[EduSync] PostgreSQL database connection test successful!")
    except Exception as e:
        print(f"[EduSync] PostgreSQL database connection test failed: {e}")
        raise e

# DB tables initialization (for backward compatibility if something calls it)
def init_db():
    import models
    Base.metadata.create_all(bind=engine)
    print("[EduSync] Database tables initialized successfully!")
