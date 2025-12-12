"""Seed the SQLite database with rich sample data covering multiple months."""
from __future__ import annotations

import random
from datetime import datetime

from backend.app import models
from backend.app.database import Base, SessionLocal, engine


def reset_database() -> None:
    """Drop existing rows so the sample data is deterministic."""
    session = SessionLocal()
    try:
        session.query(models.Transaction).delete()
        session.query(models.RecurringExpense).delete()
        session.query(models.Account).delete()
        session.commit()
    finally:
        session.close()


def seed_accounts(session: SessionLocal) -> dict[str, models.Account]:
    accounts_payload = [
        {
            "name": "Primary Checking",
            "type": "bank",
            "issuer": "Chase",
        },
        {
            "name": "Daily Rewards Card",
            "type": "card",
            "issuer": "Chase Sapphire",
            "credit_limit": 18000,
        },
        {
            "name": "Travel Miles Card",
            "type": "card",
            "issuer": "Amex Gold",
            "credit_limit": 25000,
        },
        {
            "name": "Mortgage",
            "type": "loan",
            "issuer": "Wells Fargo",
            "loan_principal": 325000,
            "loan_interest_rate": 5.6,
            "emi_amount": 1850,
        },
    ]

    accounts: dict[str, models.Account] = {}
    for payload in accounts_payload:
        account = models.Account(**payload)
        session.add(account)
        session.flush()
        accounts[payload["name"]] = account

    return accounts


def seed_recurring(session: SessionLocal) -> None:
    recurring_payload = [
        {"name": "Mortgage", "amount": 1850, "billing_cycle": "monthly", "category": "Housing"},
        {"name": "Electric Utility", "amount": 120, "billing_cycle": "monthly", "category": "Utilities"},
        {"name": "Fiber Internet", "amount": 65, "billing_cycle": "monthly", "category": "Utilities"},
        {"name": "Cell Plans", "amount": 90, "billing_cycle": "monthly", "category": "Utilities"},
        {"name": "Streaming Bundle", "amount": 38, "billing_cycle": "monthly", "category": "Subscriptions"},
        {"name": "Gym Membership", "amount": 62, "billing_cycle": "monthly", "category": "Health"},
    ]

    for payload in recurring_payload:
        session.add(models.RecurringExpense(**payload))


def _dt(year: int, month: int, day: int, hour: int = 10) -> datetime:
    return datetime(year, month, day, hour, 0, 0)


def seed_transactions(session: SessionLocal, accounts: dict[str, models.Account]) -> None:
    months = [
        (2025, 8, "August"),
        (2025, 9, "September"),
        (2025, 10, "October"),
        (2025, 11, "November"),
    ]

    for year, month, month_name in months:
        # Salary credits
        session.add(
            models.Transaction(
                account_id=accounts["Primary Checking"].id,
                date=_dt(year, month, 1, 9),
                amount=8200.0,
                category="Salary",
                description=f"Monthly salary - {month_name}",
                tags="salary,primary",
            )
        )

        # EMI payment
        session.add(
            models.Transaction(
                account_id=accounts["Primary Checking"].id,
                date=_dt(year, month, 5),
                amount=-1850.0,
                category="Mortgage",
                description="Mortgage payment",
                tags="mortgage",
            )
        )

        # Transfer to credit cards to settle previous month
        session.add(
            models.Transaction(
                account_id=accounts["Primary Checking"].id,
                date=_dt(year, month, 6),
                amount=-1250.0,
                category="Card Payment",
                description="Chase card payment",
                tags="settlement",
            )
        )

        session.add(
            models.Transaction(
                account_id=accounts["Primary Checking"].id,
                date=_dt(year, month, 7),
                amount=-860.0,
                category="Card Payment",
                description="Amex card payment",
                tags="settlement",
            )
        )

        # Groceries & essentials spread across the month
        for week in range(4):
            day = 3 + week * 7
            session.add(
                models.Transaction(
                    account_id=accounts["Daily Rewards Card"].id,
                    date=_dt(year, month, day, 18),
                    amount=-185.0,
                    category="Groceries",
                    description="Weekly groceries - Trader Joe's",
                    tags="food,household",
                )
            )

        # Micro habit: daily coffee runs (targeted for micro-habit detection)
        for day in range(1, 29, 2):
            session.add(
                models.Transaction(
                    account_id=accounts["Daily Rewards Card"].id,
                    date=_dt(year, month, day, 8),
                    amount=-6.25,
                    category="Coffee Runs",
                    description="Blue Bottle cappuccino",
                    tags="coffee,habit",
                )
            )

        # Eating out on weekends
        for weekend in [6, 13, 20, 27]:
            session.add(
                models.Transaction(
                    account_id=accounts["Travel Miles Card"].id,
                    date=_dt(year, month, weekend, 21),
                    amount=-85.0,
                    category="Dining Out",
                    description="Dinner with friends",
                    tags="dining",
                )
            )

        # Transport
        for week in range(4):
            day = 2 + week * 7
            session.add(
                models.Transaction(
                    account_id=accounts["Daily Rewards Card"].id,
                    date=_dt(year, month, day, 9),
                    amount=-38.0,
                    category="Transport",
                    description="Uber commute",
                    tags="transport",
                )
            )

        # Shopping bursts unique per month
        shopping_spends = [
            (12, -420.0, "Electronics upgrade"),
            (18, -240.0, "Wardrobe refresh"),
            (24, -165.0, "Home decor"),
        ]
        for day, amount, desc in shopping_spends:
            session.add(
                models.Transaction(
                    account_id=accounts["Travel Miles Card"].id,
                    date=_dt(year, month, day, 19),
                    amount=amount,
                    category="Shopping",
                    description=desc,
                    tags="shopping",
                )
            )

        # Occasional reimbursements / freelance income
        if month % 2 == 0:
            session.add(
                models.Transaction(
                    account_id=accounts["Primary Checking"].id,
                    date=_dt(year, month, 15, 11),
                    amount=650.0,
                    category="Side Income",
                    description="Freelance consulting",
                    tags="income,side",
                )
            )

        # Health and fitness spread out
        session.add(
            models.Transaction(
                account_id=accounts["Daily Rewards Card"].id,
                date=_dt(year, month, 9, 17),
                amount=-95.0,
                category="Health",
                description="Pharmacy + supplements",
                tags="health",
            )
        )

        session.add(
            models.Transaction(
                account_id=accounts["Daily Rewards Card"].id,
                date=_dt(year, month, 16, 17),
                amount=-72.0,
                category="Fitness",
                description="Yoga classes",
                tags="fitness",
            )
        )

        # Random cash withdrawals or transfers
        session.add(
            models.Transaction(
                account_id=accounts["Primary Checking"].id,
                date=_dt(year, month, 11, 12),
                amount=-200.0,
                category="Cash Withdrawal",
                description="ATM cash for misc",
                tags="cash",
            )
        )

        # Travel bursts (only some months)
        if month in (9, 11):
            session.add(
                models.Transaction(
                    account_id=accounts["Travel Miles Card"].id,
                    date=_dt(year, month, 22, 6),
                    amount=-760.0,
                    category="Travel",
                    description="Flight + hotel weekend getaway",
                    tags="travel",
                )
            )

        # Utilities paid through bank account
        for day, amount, desc, category in [
            (4, -120.0, "Electric bill", "Utilities"),
            (10, -65.0, "Fiber internet", "Utilities"),
            (14, -90.0, "Cell plans", "Utilities"),
            (25, -38.0, "Streaming bundle", "Subscriptions"),
        ]:
            session.add(
                models.Transaction(
                    account_id=accounts["Primary Checking"].id,
                    date=_dt(year, month, day, 13),
                    amount=amount,
                    category=category,
                    description=desc,
                    tags="recurring",
                )
            )

        # Monthly investments / SIPs
        session.add(
            models.Transaction(
                account_id=accounts["Primary Checking"].id,
                date=_dt(year, month, 3, 10),
                amount=-420.0,
                category="Investments",
                description="Index fund contribution",
                tags="investment",
            )
        )

        # Refunds to create positive small entries
        session.add(
            models.Transaction(
                account_id=accounts["Daily Rewards Card"].id,
                date=_dt(year, month, 28, 15),
                amount=32.0,
                category="Refund",
                description="Refund - order returned",
                tags="refund",
            )
        )

        # Add some random snack spends to diversify micro habits
        for _ in range(6):
            day = random.randint(1, 27)
            session.add(
                models.Transaction(
                    account_id=accounts["Daily Rewards Card"].id,
                    date=_dt(year, month, day, 16),
                    amount=-7.25,
                    category="Snacks",
                    description="Afternoon snack",
                    tags="snack",
                )
            )


def seed() -> None:
    Base.metadata.create_all(bind=engine)
    reset_database()

    session = SessionLocal()
    try:
        accounts = seed_accounts(session)
        seed_recurring(session)
        seed_transactions(session, accounts)
        session.commit()
        print("Seeded sample data for 4 months successfully!")
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


if __name__ == "__main__":
    seed()
