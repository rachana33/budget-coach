var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import { useMemo, useState } from 'react';
import SectionCard from './SectionCard';
import { normalizeCategoryKey } from '../utils/categories';
import { formatCurrency } from '../utils/format';
var EXPENSE_CATEGORIES = [
    'Rent & Housing',
    'Utilities',
    'Groceries',
    'Eating Out',
    'Transport',
    'Shopping',
    'Subscriptions',
    'Health',
    'Travel',
    'Miscellaneous',
];
var INCOME_CATEGORIES = [
    'Salary',
    'Freelance',
    'Investment',
    'Gift',
    'Refund',
    'Other Income',
];
var TransactionPanel = function (_a) {
    var _b, _c, _d, _e, _f;
    var monthLabel = _a.monthLabel, month = _a.month, accounts = _a.accounts, transactions = _a.transactions, onCreateTransaction = _a.onCreateTransaction, _g = _a.limits, limits = _g === void 0 ? {} : _g, _h = _a.goals, goals = _h === void 0 ? [] : _h;
    var _j = useState({
        account_id: undefined,
        date: new Date().toISOString().slice(0, 10),
        amount: 0,
        category: 'Eating Out',
        description: '',
        tags: '',
        goal_id: undefined,
    }), form = _j[0], setForm = _j[1];
    var _k = useState(false), loading = _k[0], setLoading = _k[1];
    var _l = useState('expense'), kind = _l[0], setKind = _l[1];
    var handleKindChange = function (newKind) {
        setKind(newKind);
        setForm(function (prev) { return (__assign(__assign({}, prev), { category: newKind === 'income' ? 'Salary' : 'Eating Out' })); });
    };
    var monthTransactions = useMemo(function () {
        return transactions.filter(function (transaction) { return transaction.date.startsWith(month); });
    }, [transactions, month]);
    var totalSpend = monthTransactions
        .filter(function (transaction) { return transaction.amount < 0; })
        .reduce(function (sum, transaction) { return sum + Math.abs(transaction.amount); }, 0);
    var totalIncome = monthTransactions
        .filter(function (transaction) { return transaction.amount >= 0; })
        .reduce(function (sum, transaction) { return sum + transaction.amount; }, 0);
    var spendByCategory = useMemo(function () {
        var map = new Map();
        monthTransactions.forEach(function (transaction) {
            var _a;
            if (transaction.amount < 0) {
                var key = normalizeCategoryKey(transaction.category);
                map.set(key, ((_a = map.get(key)) !== null && _a !== void 0 ? _a : 0) + Math.abs(transaction.amount));
            }
        });
        return map;
    }, [monthTransactions]);
    var currentCategoryKey = normalizeCategoryKey(form.category);
    var categoryLimit = limits[currentCategoryKey];
    var categorySpent = categoryLimit ? (_b = spendByCategory.get(currentCategoryKey)) !== null && _b !== void 0 ? _b : 0 : 0;
    var categoryRemaining = categoryLimit ? categoryLimit.amount - categorySpent : null;
    var categoryOver = categoryRemaining !== null && categoryRemaining < 0;
    var handleSubmit = function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var payload;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    event.preventDefault();
                    setLoading(true);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, , 3, 4]);
                    payload = __assign(__assign({}, form), { amount: (function () {
                            var raw = Number(form.amount) || 0;
                            if (raw === 0)
                                return 0;
                            return kind === 'expense' ? -Math.abs(raw) : Math.abs(raw);
                        })(), account_id: form.account_id || undefined, description: ((_a = form.description) === null || _a === void 0 ? void 0 : _a.trim()) || undefined, tags: ((_b = form.tags) === null || _b === void 0 ? void 0 : _b.trim()) || undefined, goal_id: form.goal_id || undefined });
                    return [4 /*yield*/, onCreateTransaction(payload)];
                case 2:
                    _c.sent();
                    setForm(function (prev) { return (__assign(__assign({}, prev), { amount: 0, description: '', tags: '', goal_id: undefined })); });
                    setKind('expense');
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (_jsx(SectionCard, { title: "Quick log", subtitle: "Capture ".concat(monthLabel, " transactions and cash flow"), actions: _jsxs("div", { className: "flex flex-col gap-1 text-xs text-slate-400 sm:flex-row sm:gap-4", children: [_jsxs("span", { children: ["Income: ", formatCurrency(totalIncome)] }), _jsxs("span", { children: ["Spend: ", formatCurrency(totalSpend)] }), categoryLimit && (_jsx("span", { className: categoryOver ? 'text-rose-300 font-semibold' : 'text-emerald-300', children: categoryOver
                        ? "Over ".concat(formatCurrency(Math.abs(categoryRemaining)), " in ").concat(categoryLimit.label)
                        : "".concat(formatCurrency(categoryRemaining !== null && categoryRemaining !== void 0 ? categoryRemaining : 0), " remaining in ").concat(categoryLimit.label) }))] }), children: _jsxs("form", { className: "space-y-4", onSubmit: handleSubmit, children: [_jsxs("div", { className: "grid gap-3", children: [_jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("label", { className: "flex flex-col gap-1", children: [_jsx("span", { className: "text-xs font-medium uppercase tracking-[0.2em] text-slate-400", children: "Amount" }), _jsx("input", { type: "number", step: "0.01", className: "rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30", value: form.amount, onChange: function (event) {
                                                return setForm(function (prev) { return (__assign(__assign({}, prev), { amount: Number(event.target.value) })); });
                                            }, required: true }), _jsxs("div", { className: "mt-2 flex gap-2 text-xs text-slate-400", children: [_jsx("button", { type: "button", onClick: function () { return handleKindChange('expense'); }, className: "rounded-md px-2 py-1 font-semibold transition ".concat(kind === 'expense'
                                                        ? 'bg-rose-500/20 text-rose-200 border border-rose-400/60'
                                                        : 'border border-slate-700 text-slate-400 hover:bg-slate-800'), children: "Expense" }), _jsx("button", { type: "button", onClick: function () { return handleKindChange('income'); }, className: "rounded-md px-2 py-1 font-semibold transition ".concat(kind === 'income'
                                                        ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/60'
                                                        : 'border border-slate-700 text-slate-400 hover:bg-slate-800'), children: "Income" })] })] }), _jsxs("label", { className: "flex flex-col gap-1", children: [_jsx("span", { className: "text-xs font-medium uppercase tracking-[0.2em] text-slate-400", children: "Date" }), _jsx("input", { type: "date", className: "rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30", value: form.date, onChange: function (event) { return setForm(function (prev) { return (__assign(__assign({}, prev), { date: event.target.value })); }); }, required: true })] })] }), _jsxs("label", { className: "flex flex-col gap-1", children: [_jsx("span", { className: "text-xs font-medium uppercase tracking-[0.2em] text-slate-400", children: "Category" }), _jsx("select", { className: "rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30", value: form.category, onChange: function (event) { return setForm(function (prev) { return (__assign(__assign({}, prev), { category: event.target.value })); }); }, children: (kind === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(function (category) { return (_jsx("option", { value: category, children: category }, category)); }) })] }), _jsxs("label", { className: "flex flex-col gap-1", children: [_jsx("span", { className: "text-xs font-medium uppercase tracking-[0.2em] text-slate-400", children: "Account" }), _jsxs("select", { className: "rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30", value: (_c = form.account_id) !== null && _c !== void 0 ? _c : '', onChange: function (event) {
                                        return setForm(function (prev) { return (__assign(__assign({}, prev), { account_id: event.target.value ? Number(event.target.value) : undefined })); });
                                    }, children: [_jsx("option", { value: "", children: "Cash / unspecified" }), accounts.map(function (account) { return (_jsx("option", { value: account.id, children: account.name }, account.id)); })] })] }), goals.length > 0 && (_jsxs("label", { className: "flex flex-col gap-1", children: [_jsx("span", { className: "text-xs font-medium uppercase tracking-[0.2em] text-slate-400", children: "Goal (optional)" }), _jsxs("select", { className: "rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30", value: (_d = form.goal_id) !== null && _d !== void 0 ? _d : '', onChange: function (event) {
                                        return setForm(function (prev) { return (__assign(__assign({}, prev), { goal_id: event.target.value ? Number(event.target.value) : undefined })); });
                                    }, children: [_jsx("option", { value: "", children: "Unassigned" }), goals.map(function (goal) { return (_jsx("option", { value: goal.id, children: goal.title }, goal.id)); })] }), _jsx("span", { className: "text-xs text-slate-500", children: "Tag income or savings deposits to track goal progress automatically" })] })), _jsxs("label", { className: "flex flex-col gap-1", children: [_jsx("span", { className: "text-xs font-medium uppercase tracking-[0.2em] text-slate-400", children: "Description" }), _jsx("input", { type: "text", className: "rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30", placeholder: "e.g., Zomato lunch", value: (_e = form.description) !== null && _e !== void 0 ? _e : '', onChange: function (event) { return setForm(function (prev) { return (__assign(__assign({}, prev), { description: event.target.value })); }); } })] }), _jsxs("label", { className: "flex flex-col gap-1", children: [_jsx("span", { className: "text-xs font-medium uppercase tracking-[0.2em] text-slate-400", children: "Tags" }), _jsx("input", { type: "text", className: "rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30", placeholder: "food, weekend", value: (_f = form.tags) !== null && _f !== void 0 ? _f : '', onChange: function (event) { return setForm(function (prev) { return (__assign(__assign({}, prev), { tags: event.target.value })); }); } })] })] }), _jsx("div", { className: "flex justify-end", children: _jsx("button", { type: "submit", disabled: loading, className: "rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:bg-brand-500/40", children: loading ? 'Logging…' : 'Log transaction' }) })] }) }));
};
export default TransactionPanel;
