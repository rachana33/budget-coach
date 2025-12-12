var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import SectionCard from './SectionCard';
import { formatCurrency } from '../utils/format';
var ProfilePanel = function (_a) {
    var accounts = _a.accounts, recurringExpenses = _a.recurringExpenses, onDeleteAccount = _a.onDeleteAccount, onDeleteRecurring = _a.onDeleteRecurring, onExportData = _a.onExportData;
    var _b = useState(null), deleteAccountId = _b[0], setDeleteAccountId = _b[1];
    var _c = useState(null), deleteRecurringId = _c[0], setDeleteRecurringId = _c[1];
    var handleDeleteAccount = function (id) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, onDeleteAccount(id)];
                case 1:
                    _a.sent();
                    setDeleteAccountId(null);
                    return [2 /*return*/];
            }
        });
    }); };
    var handleDeleteRecurring = function (id) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, onDeleteRecurring(id)];
                case 1:
                    _a.sent();
                    setDeleteRecurringId(null);
                    return [2 /*return*/];
            }
        });
    }); };
    var totalMonthlyIncome = accounts
        .filter(function (acc) { return acc.type === 'bank'; })
        .reduce(function (sum, acc) { return sum + (acc.credit_limit || 0); }, 0);
    return (_jsxs("div", { className: "flex flex-col gap-6", children: [_jsx(SectionCard, { title: "Profile & settings", subtitle: "Manage your accounts, income, and data", actions: _jsx("button", { onClick: onExportData, className: "rounded-md border border-brand-500/60 px-3 py-1.5 text-xs font-semibold text-brand-200 transition hover:bg-brand-500/20", children: "Export data" }), children: _jsx("div", { className: "space-y-6", children: _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold uppercase tracking-[0.2em] text-slate-300", children: "Monthly income" }), _jsx("p", { className: "mt-2 text-3xl font-bold text-emerald-400", children: formatCurrency(totalMonthlyIncome) }), _jsx("p", { className: "mt-1 text-xs text-slate-400", children: "Total expected monthly income from all sources" })] }) }) }), _jsx(SectionCard, { title: "Accounts", subtitle: "Manage your bank accounts, credit cards, and loans", children: accounts.length === 0 ? (_jsx("p", { className: "text-sm text-slate-400", children: "No accounts added yet." })) : (_jsx("div", { className: "space-y-3", children: accounts.map(function (account) {
                        var isDeleting = deleteAccountId === account.id;
                        return (_jsxs("div", { className: "flex items-center justify-between rounded-xl border border-slate-800/70 bg-slate-900/60 p-4", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("h4", { className: "text-sm font-semibold text-slate-100", children: account.name }), _jsx("span", { className: "rounded bg-slate-800/60 px-2 py-0.5 text-xs uppercase tracking-[0.2em] text-slate-400", children: account.type })] }), account.issuer && (_jsxs("p", { className: "mt-1 text-xs text-slate-400", children: ["Issuer: ", account.issuer] })), account.credit_limit && (_jsxs("p", { className: "mt-1 text-xs text-slate-300", children: [account.type === 'card' ? 'Credit limit' : 'Balance', ":", ' ', formatCurrency(account.credit_limit)] })), account.loan_principal && (_jsxs("div", { className: "mt-2 space-y-1 text-xs text-slate-300", children: [_jsxs("p", { children: ["Principal: ", formatCurrency(account.loan_principal)] }), _jsxs("p", { children: ["Interest rate: ", account.loan_interest_rate, "%"] }), account.emi_amount && _jsxs("p", { children: ["EMI: ", formatCurrency(account.emi_amount)] })] }))] }), _jsx("div", { className: "ml-4", children: isDeleting ? (_jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: function () { return handleDeleteAccount(account.id); }, className: "rounded border border-rose-500/60 px-3 py-1 text-xs text-rose-300 transition hover:bg-rose-500/20", children: "Confirm" }), _jsx("button", { onClick: function () { return setDeleteAccountId(null); }, className: "rounded border border-slate-700 px-3 py-1 text-xs text-slate-300 transition hover:bg-slate-800", children: "Cancel" })] })) : (_jsx("button", { onClick: function () { return setDeleteAccountId(account.id); }, className: "rounded border border-slate-700 px-3 py-1 text-xs text-slate-400 transition hover:border-rose-400 hover:text-rose-300", children: "Delete" })) })] }, account.id));
                    }) })) }), _jsx(SectionCard, { title: "Recurring expenses", subtitle: "Manage your subscriptions and fixed monthly costs", children: recurringExpenses.length === 0 ? (_jsx("p", { className: "text-sm text-slate-400", children: "No recurring expenses added yet." })) : (_jsx("div", { className: "space-y-3", children: recurringExpenses.map(function (expense) {
                        var isDeleting = deleteRecurringId === expense.id;
                        return (_jsxs("div", { className: "flex items-center justify-between rounded-xl border border-slate-800/70 bg-slate-900/60 p-4", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("h4", { className: "text-sm font-semibold text-slate-100", children: expense.name }), _jsx("span", { className: "rounded bg-slate-800/60 px-2 py-0.5 text-xs uppercase tracking-[0.2em] text-slate-400", children: expense.category })] }), _jsx("div", { className: "mt-2 flex items-center gap-4 text-xs", children: _jsxs("span", { className: "text-slate-300", children: [formatCurrency(expense.amount), " / ", expense.billing_cycle] }) })] }), _jsx("div", { className: "ml-4", children: isDeleting ? (_jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: function () { return handleDeleteRecurring(expense.id); }, className: "rounded border border-rose-500/60 px-3 py-1 text-xs text-rose-300 transition hover:bg-rose-500/20", children: "Confirm" }), _jsx("button", { onClick: function () { return setDeleteRecurringId(null); }, className: "rounded border border-slate-700 px-3 py-1 text-xs text-slate-300 transition hover:bg-slate-800", children: "Cancel" })] })) : (_jsx("button", { onClick: function () { return setDeleteRecurringId(expense.id); }, className: "rounded border border-slate-700 px-3 py-1 text-xs text-slate-400 transition hover:border-rose-400 hover:text-rose-300", children: "Delete" })) })] }, expense.id));
                    }) })) })] }));
};
export default ProfilePanel;
