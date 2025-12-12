import React from 'react';
import { Account, RecurringExpense } from '../types';
interface ProfilePanelProps {
    accounts: Account[];
    recurringExpenses: RecurringExpense[];
    onDeleteAccount: (id: number) => Promise<void>;
    onDeleteRecurring: (id: number) => Promise<void>;
    onExportData: () => void;
}
declare const ProfilePanel: React.FC<ProfilePanelProps>;
export default ProfilePanel;
