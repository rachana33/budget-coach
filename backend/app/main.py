from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routers import accounts, recurring_expenses, transactions, analytics, coach, goals

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Budget Coach & Tracker")

# CORS configuration for production
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
