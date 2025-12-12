#!/usr/bin/env python3
"""
Create sample data for Budget Coach app - 2 months of transactions
"""
import sys
sys.path.insert(0, '.')

from app import models
from app.database import SessionLocal, engine
from datetime import datetime, timedelta
import random

# Create tables
models.Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    # Clear existing data
    db.query(models.Transaction).delete()
    db.query(models.RecurringExpense).delete()
    db.query(models.Account).delete()
    db.commit()
    
    # Create sample accounts
    checking = models.Account(
        name='Chase Checking',
        type='bank',
        credit_limit=5000.0
    )
    credit_card = models.Account(
        name='Visa Credit Card',
        type='card',
        issuer='Chase',
        credit_limit=10000.0
    )
    db.add(checking)
    db.add(credit_card)
    db.commit()
    
    # Categories and typical amounts
    expense_categories = {
        'Groceries': (50, 150),
        'Dining': (20, 80),
        'Transportation': (30, 100),
        'Entertainment': (15, 60),
        'Utilities': (80, 200),
        'Shopping': (40, 200),
        'Healthcare': (50, 300),
        'Gas': (40, 80),
    }
    
    # Create transactions for November and December 2024
    current_date = datetime.now()
    
    # November 2024
    nov_start = datetime(2024, 11, 1)
    for day in range(1, 31):
        tx_date = nov_start + timedelta(days=day-1)
        
        # Add 2-4 transactions per day
        num_transactions = random.randint(2, 4)
        for _ in range(num_transactions):
            category = random.choice(list(expense_categories.keys()))
            min_amt, max_amt = expense_categories[category]
            amount = -round(random.uniform(min_amt, max_amt), 2)
            
            tx = models.Transaction(
                account_id=random.choice([checking.id, credit_card.id]),
                date=tx_date + timedelta(hours=random.randint(8, 20)),
                amount=amount,
                category=category,
                description=f'{category} purchase'
            )
            db.add(tx)
    
    # Add November income
    nov_income = models.Transaction(
        account_id=checking.id,
        date=datetime(2024, 11, 1, 9, 0),
        amount=5000.0,
        category='Salary',
        description='Monthly salary'
    )
    db.add(nov_income)
    
    # December 2024
    dec_start = datetime(2024, 12, 1)
    for day in range(1, min(current_date.day if current_date.month == 12 else 31, 31)):
        tx_date = dec_start + timedelta(days=day-1)
        
        # Add 2-4 transactions per day
        num_transactions = random.randint(2, 4)
        for _ in range(num_transactions):
            category = random.choice(list(expense_categories.keys()))
            min_amt, max_amt = expense_categories[category]
            amount = -round(random.uniform(min_amt, max_amt), 2)
            
            tx = models.Transaction(
                account_id=random.choice([checking.id, credit_card.id]),
                date=tx_date + timedelta(hours=random.randint(8, 20)),
                amount=amount,
                category=category,
                description=f'{category} purchase'
            )
            db.add(tx)
    
    # Add December income
    dec_income = models.Transaction(
        account_id=checking.id,
        date=datetime(2024, 12, 1, 9, 0),
        amount=5000.0,
        category='Salary',
        description='Monthly salary'
    )
    db.add(dec_income)
    
    # Add recurring expenses
    recurring_items = [
        ('Netflix', 15.99, 'monthly', 'Entertainment'),
        ('Spotify', 9.99, 'monthly', 'Entertainment'),
        ('Internet', 79.99, 'monthly', 'Utilities'),
        ('Gym Membership', 49.99, 'monthly', 'Healthcare'),
    ]
    
    for name, amount, cycle, category in recurring_items:
        recurring = models.RecurringExpense(
            name=name,
            amount=amount,
            billing_cycle=cycle,
            category=category
        )
        db.add(recurring)
    
    db.commit()
    
    # Count transactions
    nov_count = db.query(models.Transaction).filter(
        models.Transaction.date >= datetime(2024, 11, 1),
        models.Transaction.date < datetime(2024, 12, 1)
    ).count()
    
    dec_count = db.query(models.Transaction).filter(
        models.Transaction.date >= datetime(2024, 12, 1),
        models.Transaction.date < datetime(2025, 1, 1)
    ).count()
    
    print("✅ Sample data created successfully!")
    print(f"📊 Created {nov_count} transactions for November 2024")
    print(f"📊 Created {dec_count} transactions for December 2024")
    print(f"💳 Created 2 accounts")
    print(f"🔄 Created {len(recurring_items)} recurring expenses")
    print("\n🎯 You can now test:")
    print("   - View November or December data")
    print("   - Use 'View Trends' with range 2024-11 to 2024-12")
    print("   - Click 'Show AI Coach' for insights")
    
except Exception as e:
    print(f"❌ Error: {e}")
    db.rollback()
finally:
    db.close()
