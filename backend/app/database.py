import os
from pathlib import Path

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base

# Use PostgreSQL in production (Render), SQLite for local development
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    # Render provides DATABASE_URL starting with postgres://, but SQLAlchemy needs postgresql://
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    engine = create_engine(DATABASE_URL)
else:
    # Local development with SQLite
    BASE_DIR = Path(__file__).resolve().parent.parent
    DB_PATH = BASE_DIR / "budget.db"
    DATABASE_URL = f"sqlite:///{DB_PATH}"
    engine = create_engine(
        DATABASE_URL, connect_args={"check_same_thread": False}
    )


def _ensure_schema() -> None:
    # Only run PRAGMA for SQLite
    is_sqlite = "sqlite" in str(engine.url)
    
    statements = [
        "ALTER TABLE goals ADD COLUMN priority INTEGER DEFAULT 1",
        "ALTER TABLE goals ADD COLUMN desired_monthly FLOAT",
        "ALTER TABLE transactions ADD COLUMN goal_id INTEGER",
    ]
    with engine.connect() as conn:
        if is_sqlite:
            conn.exec_driver_sql("PRAGMA foreign_keys=ON")
        for stmt in statements:
            try:
                conn.exec_driver_sql(stmt)
            except Exception:
                # Column likely already exists; ignore errors to keep startup resilient
                pass


_ensure_schema()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
