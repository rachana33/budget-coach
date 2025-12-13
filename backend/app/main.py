from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine, SessionLocal
from .routers import accounts, recurring_expenses, transactions, analytics, coach, goals


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables and seed data if needed
    Base.metadata.create_all(bind=engine)
    
    # Auto-seed database if empty
    try:
        from . import models
        db = SessionLocal()
        try:
            existing_accounts = db.query(models.Account).count()
            if existing_accounts == 0:
                print("🌱 Database is empty, seeding with sample data...")
                # Import and run seed function
                import sys
                from pathlib import Path
                sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))
                from backend.seed_data import seed_database
                seed_database()
                print("✅ Database seeded successfully!")
        finally:
            db.close()
    except Exception as e:
        print(f"⚠️  Seeding skipped or failed: {e}")
    
    yield
    # Shutdown: cleanup if needed


app = FastAPI(title="Budget Coach & Tracker", lifespan=lifespan)

# CORS configuration - allows all origins for demo purposes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    return {"status": "ok"}


app.include_router(accounts.router)
app.include_router(recurring_expenses.router)
app.include_router(transactions.router)
app.include_router(analytics.router)
app.include_router(coach.router)
app.include_router(goals.router)
