import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Fetch DATABASE_URL from .env
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

if not SQLALCHEMY_DATABASE_URL:
    raise ValueError(
        "DATABASE_URL must be set to your Supabase PostgreSQL connection string."
    )

# Create engine with PostgreSQL optimizations
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        pool_pre_ping=True
    )

# Establish sessionmaker and Base
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

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
        print("[EduSync] Supabase PostgreSQL database connection test successful!")
    except Exception as e:
        print(f"[EduSync] Supabase PostgreSQL database connection test failed: {e}")
        raise e

# DB tables initialization
def init_db():
    import models
    Base.metadata.create_all(bind=engine)
    print("[EduSync] Database tables initialized successfully!")
