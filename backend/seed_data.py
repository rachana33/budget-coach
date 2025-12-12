"""
Script to seed the database with sample data for demo purposes.
Run this after deploying to production to populate the database.

Usage:
    python -m backend.seed_data
"""

import os
import sys
from datetime import datetime, timedelta
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from backend.app.database import SessionLocal, Base, engine
from backend.app import models

# Create tables
Base.metadata.create_all(bind=engine)

def seed_database():
    db = SessionLocal()
    
    try:
        # Check if data already exists
        existing_accounts = db.query(models.Account).count()
        if existing_accounts > 0:
            print("Database already has data. Skipping seed.")
            return
        
        print("Seeding database with sample data...")
        
        # Create accounts
        checking = models.Account(name="Chase Checking", balance=3500.00, account_type="checking")
        savings = models.Account(name="Ally Savings", balance=15000.00, account_type="savings")
        credit = models.Account(name="Chase Sapphire", balance=-850.00, account_type="credit")
        
        db.add_all([checking, savings, credit])
        db.commit()
        
        # Create recurring expenses
        recurring = [
            models.RecurringExpense(name="Netflix", amount=15.99, frequency="monthly", category="entertainment"),
            models.RecurringExpense(name="Spotify", amount=10.99, frequency="monthly", category="entertainment"),
            models.RecurringExpense(name="Gym Membership", amount=45.00, frequency="monthly", category="health"),
            models.RecurringExpense(name="Internet", amount=79.99, frequency="monthly", category="utilities"),
            models.RecurringExpense(name="Phone Bill", amount=65.00, frequency="monthly", category="utilities"),
        ]
        db.add_all(recurring)
        db.commit()
        
        # Create transactions for November 2025
        base_date = datetime(2025, 11, 1)
        transactions = [
            # Income
            models.Transaction(date=base_date + timedelta(days=1), description="Salary Deposit", amount=4500.00, 
                             category="income", account_id=checking.id, transaction_type="income"),
            models.Transaction(date=base_date + timedelta(days=15), description="Freelance Project", amount=800.00, 
                             category="income", account_id=checking.id, transaction_type="income"),
            
            # Groceries
            models.Transaction(date=base_date + timedelta(days=2), description="Whole Foods", amount=-125.50, 
                             category="groceries", account_id=credit.id, transaction_type="expense"),
            models.Transaction(date=base_date + timedelta(days=9), description="Trader Joe's", amount=-87.25, 
                             category="groceries", account_id=credit.id, transaction_type="expense"),
            models.Transaction(date=base_date + timedelta(days=16), description="Safeway", amount=-102.80, 
                             category="groceries", account_id=credit.id, transaction_type="expense"),
            models.Transaction(date=base_date + timedelta(days=23), description="Whole Foods", amount=-134.20, 
                             category="groceries", account_id=credit.id, transaction_type="expense"),
            
            # Dining
            models.Transaction(date=base_date + timedelta(days=3), description="Starbucks", amount=-6.50, 
                             category="dining", account_id=credit.id, transaction_type="expense"),
            models.Transaction(date=base_date + timedelta(days=5), description="Chipotle", amount=-12.75, 
                             category="dining", account_id=credit.id, transaction_type="expense"),
            models.Transaction(date=base_date + timedelta(days=7), description="Starbucks", amount=-7.25, 
                             category="dining", account_id=credit.id, transaction_type="expense"),
            models.Transaction(date=base_date + timedelta(days=10), description="Local Restaurant", amount=-45.80, 
                             category="dining", account_id=credit.id, transaction_type="expense"),
            models.Transaction(date=base_date + timedelta(days=12), description="Starbucks", amount=-6.50, 
                             category="dining", account_id=credit.id, transaction_type="expense"),
            models.Transaction(date=base_date + timedelta(days=14), description="Pizza Place", amount=-28.50, 
                             category="dining", account_id=credit.id, transaction_type="expense"),
            models.Transaction(date=base_date + timedelta(days=17), description="Starbucks", amount=-8.00, 
                             category="dining", account_id=credit.id, transaction_type="expense"),
            models.Transaction(date=base_date + timedelta(days=20), description="Sushi Restaurant", amount=-52.30, 
                             category="dining", account_id=credit.id, transaction_type="expense"),
            
            # Transportation
            models.Transaction(date=base_date + timedelta(days=4), description="Gas Station", amount=-45.00, 
                             category="transportation", account_id=credit.id, transaction_type="expense"),
            models.Transaction(date=base_date + timedelta(days=11), description="Uber", amount=-18.50, 
                             category="transportation", account_id=credit.id, transaction_type="expense"),
            models.Transaction(date=base_date + timedelta(days=18), description="Gas Station", amount=-48.75, 
                             category="transportation", account_id=credit.id, transaction_type="expense"),
            
            # Entertainment
            models.Transaction(date=base_date + timedelta(days=6), description="Movie Tickets", amount=-32.00, 
                             category="entertainment", account_id=credit.id, transaction_type="expense"),
            models.Transaction(date=base_date + timedelta(days=13), description="Concert Tickets", amount=-85.00, 
                             category="entertainment", account_id=credit.id, transaction_type="expense"),
            models.Transaction(date=base_date + timedelta(days=8), description="Netflix", amount=-15.99, 
                             category="entertainment", account_id=credit.id, transaction_type="expense"),
            models.Transaction(date=base_date + timedelta(days=8), description="Spotify", amount=-10.99, 
                             category="entertainment", account_id=credit.id, transaction_type="expense"),
            
            # Utilities
            models.Transaction(date=base_date + timedelta(days=1), description="Electric Bill", amount=-120.50, 
                             category="utilities", account_id=checking.id, transaction_type="expense"),
            models.Transaction(date=base_date + timedelta(days=5), description="Internet", amount=-79.99, 
                             category="utilities", account_id=checking.id, transaction_type="expense"),
            models.Transaction(date=base_date + timedelta(days=10), description="Phone Bill", amount=-65.00, 
                             category="utilities", account_id=checking.id, transaction_type="expense"),
            
            # Health
            models.Transaction(date=base_date + timedelta(days=15), description="Gym Membership", amount=-45.00, 
                             category="health", account_id=checking.id, transaction_type="expense"),
            models.Transaction(date=base_date + timedelta(days=22), description="Pharmacy", amount=-25.80, 
                             category="health", account_id=credit.id, transaction_type="expense"),
            
            # Shopping
            models.Transaction(date=base_date + timedelta(days=19), description="Amazon", amount=-67.45, 
                             category="shopping", account_id=credit.id, transaction_type="expense"),
            models.Transaction(date=base_date + timedelta(days=21), description="Target", amount=-89.20, 
                             category="shopping", account_id=credit.id, transaction_type="expense"),
        ]
        
        db.add_all(transactions)
        db.commit()
        
        # Create goals
        goals = [
            models.Goal(name="Emergency Fund", target_amount=10000.00, current_amount=5000.00, 
                       target_date=datetime(2026, 6, 1), priority=1, desired_monthly=500.00),
            models.Goal(name="Vacation to Japan", target_amount=5000.00, current_amount=1200.00, 
                       target_date=datetime(2026, 3, 1), priority=2, desired_monthly=400.00),
            models.Goal(name="New Laptop", target_amount=2000.00, current_amount=800.00, 
                       target_date=datetime(2025, 12, 31), priority=3, desired_monthly=300.00),
        ]
        
        db.add_all(goals)
        db.commit()
        
        print("✅ Database seeded successfully!")
        print(f"   - Created {len([checking, savings, credit])} accounts")
        print(f"   - Created {len(recurring)} recurring expenses")
        print(f"   - Created {len(transactions)} transactions")
        print(f"   - Created {len(goals)} goals")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
