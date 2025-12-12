import React from 'react';
import { Transaction, Goal } from '../types';
interface TransactionListPanelProps {
    transactions: Transaction[];
    limits?: Record<string, {
        label: string;
        amount: number;
    }>;
    goals?: Goal[];
    onUpdate?: (id: number, payload: Partial<Transaction>) => Promise<void>;
    onDelete?: (id: number) => Promise<void>;
}
declare const TransactionListPanel: React.FC<TransactionListPanelProps>;
export default TransactionListPanel;
