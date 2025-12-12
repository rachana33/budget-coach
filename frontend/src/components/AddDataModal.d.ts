import React from 'react';
import { type Goal, type GoalCreateInput } from './GoalsPanel';
import { Account, AccountCreateInput, RecurringExpense, RecurringExpenseCreateInput, Transaction, TransactionCreateInput } from '../types';
export interface CategoryLimitMap {
    [key: string]: {
        label: string;
        amount: number;
    };
}
interface AddDataModalProps {
    open: boolean;
    onClose: () => void;
    modalType?: 'account' | 'recurring' | 'transaction' | 'limit' | 'goals' | null;
    month: string;
    monthLabel: string;
    accounts: Account[];
    recurring: RecurringExpense[];
    transactions: Transaction[];
    categories: string[];
    limits: CategoryLimitMap;
    goals?: Goal[];
    goalTransactions?: Record<number, number>;
    monthlySurplus?: number;
    onCreateAccount: (payload: AccountCreateInput) => Promise<void>;
    onCreateRecurring: (payload: RecurringExpenseCreateInput) => Promise<void>;
    onCreateTransaction: (payload: TransactionCreateInput) => Promise<void>;
    onSaveLimit: (label: string, amount: number) => void;
    onRemoveLimit: (key: string) => void;
    onCreateGoal?: (payload: GoalCreateInput) => Promise<void>;
    onDeleteGoal?: (id: number) => Promise<void>;
    onViewProjection?: (id: number) => void;
}
declare const AddDataModal: React.FC<AddDataModalProps>;
export default AddDataModal;
