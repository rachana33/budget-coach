import React from 'react';
import { Account, Goal, Transaction, TransactionCreateInput } from '../types';
interface TransactionPanelProps {
    monthLabel: string;
    month: string;
    accounts: Account[];
    transactions: Transaction[];
    onCreateTransaction: (payload: TransactionCreateInput) => Promise<void>;
    limits?: Record<string, {
        label: string;
        amount: number;
    }>;
    goals?: Goal[];
}
declare const TransactionPanel: React.FC<TransactionPanelProps>;
export default TransactionPanel;
