import React from 'react';
import { Account, AccountCreateInput, RecurringExpense, RecurringExpenseCreateInput } from '../types';
interface SetupPanelProps {
    accounts: Account[];
    recurring: RecurringExpense[];
    onCreateAccount: (payload: AccountCreateInput) => Promise<void>;
    onCreateRecurring: (payload: RecurringExpenseCreateInput) => Promise<void>;
    showAccounts?: boolean;
    showRecurring?: boolean;
}
declare const SetupPanel: React.FC<SetupPanelProps>;
export default SetupPanel;
