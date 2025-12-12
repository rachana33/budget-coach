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
import { formatCurrency } from '../utils/format';
var GoalsPanel = function (_a) {
    var _b, _c;
    var goals = _a.goals, accounts = _a.accounts, _d = _a.goalTransactions, goalTransactions = _d === void 0 ? {} : _d, _e = _a.monthlySurplus, monthlySurplus = _e === void 0 ? 0 : _e, onCreateGoal = _a.onCreateGoal, onDeleteGoal = _a.onDeleteGoal, onViewProjection = _a.onViewProjection;
    var _f = useState({
        title: '',
        target_amount: 0,
        goal_type: 'purchase',
        target_date: null,
        monthly_contribution: null,
        loan_account_id: null,
    }), form = _f[0], setForm = _f[1];
    var _g = useState(false), loading = _g[0], setLoading = _g[1];
    var loanAccounts = accounts.filter(function (acc) { return acc.type === 'loan'; });
    var totalTargeted = useMemo(function () { return goals.reduce(function (sum, goal) { var _a; return sum + ((_a = goal.desired_monthly) !== null && _a !== void 0 ? _a : 0); }, 0); }, [goals]);
    var handleSubmit = function (event) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event.preventDefault();
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, onCreateGoal(form)];
                case 2:
                    _a.sent();
                    setForm({
                        title: '',
                        target_amount: 0,
                        goal_type: 'purchase',
                        target_date: null,
                        monthly_contribution: null,
                        loan_account_id: null,
                    });
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var suggestedAllocations = useMemo(function () {
        if (!monthlySurplus || monthlySurplus <= 0)
            return [];
        var totalDesired = goals.reduce(function (sum, goal) { var _a; return sum + ((_a = goal.desired_monthly) !== null && _a !== void 0 ? _a : 0); }, 0);
        if (totalDesired === 0)
            return goals.map(function (goal) { return ({ goal: goal, allocation: monthlySurplus / goals.length }); });
        return goals.map(function (goal) {
            var _a;
            var desired = (_a = goal.desired_monthly) !== null && _a !== void 0 ? _a : 0;
            var ratio = desired / totalDesired;
            return { goal: goal, allocation: monthlySurplus * ratio };
        });
    }, [goals, monthlySurplus]);
    return (_jsxs(SectionCard, { title: "Financial goals", subtitle: "Track savings targets and loan payoff plans", children: [_jsxs("form", { className: "space-y-4", onSubmit: handleSubmit, children: [_jsxs("div", { className: "grid gap-3 md:grid-cols-2", children: [_jsxs("label", { className: "flex flex-col gap-1", children: [_jsx("span", { className: "text-xs font-medium uppercase tracking-[0.2em] text-slate-400", children: "Goal title" }), _jsx("input", { required: true, type: "text", placeholder: "e.g., New laptop", value: form.title, onChange: function (e) { return setForm(function (prev) { return (__assign(__assign({}, prev), { title: e.target.value })); }); }, className: "rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30" })] }), _jsxs("label", { className: "flex flex-col gap-1", children: [_jsx("span", { className: "text-xs font-medium uppercase tracking-[0.2em] text-slate-400", children: "Type" }), _jsxs("select", { value: form.goal_type, onChange: function (e) {
                                            return setForm(function (prev) { return (__assign(__assign({}, prev), { goal_type: e.target.value })); });
                                        }, className: "rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30", children: [_jsx("option", { value: "purchase", children: "Purchase / Savings" }), _jsx("option", { value: "loan_payoff", children: "Loan Payoff" })] })] })] }), _jsxs("div", { className: "grid gap-3 md:grid-cols-2", children: [_jsxs("label", { className: "flex flex-col gap-1", children: [_jsx("span", { className: "text-xs font-medium uppercase tracking-[0.2em] text-slate-400", children: "Target amount (USD)" }), _jsx("input", { required: true, type: "number", min: 0, step: "0.01", value: form.target_amount, onChange: function (e) {
                                            return setForm(function (prev) { return (__assign(__assign({}, prev), { target_amount: Number(e.target.value) })); });
                                        }, className: "rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30" })] }), _jsxs("label", { className: "flex flex-col gap-1", children: [_jsx("span", { className: "text-xs font-medium uppercase tracking-[0.2em] text-slate-400", children: "Monthly contribution" }), _jsx("input", { type: "number", min: 0, step: "0.01", value: (_b = form.monthly_contribution) !== null && _b !== void 0 ? _b : '', onChange: function (e) {
                                            return setForm(function (prev) { return (__assign(__assign({}, prev), { monthly_contribution: e.target.value ? Number(e.target.value) : null })); });
                                        }, className: "rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30" })] })] }), form.goal_type === 'loan_payoff' && (_jsxs("label", { className: "flex flex-col gap-1", children: [_jsx("span", { className: "text-xs font-medium uppercase tracking-[0.2em] text-slate-400", children: "Loan account" }), _jsxs("select", { value: (_c = form.loan_account_id) !== null && _c !== void 0 ? _c : '', onChange: function (e) {
                                    return setForm(function (prev) { return (__assign(__assign({}, prev), { loan_account_id: e.target.value ? Number(e.target.value) : null })); });
                                }, className: "rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30", children: [_jsx("option", { value: "", children: "Select loan account" }), loanAccounts.map(function (acc) { return (_jsx("option", { value: acc.id, children: acc.name }, acc.id)); })] })] })), _jsx("div", { className: "flex justify-end", children: _jsx("button", { type: "submit", disabled: loading, className: "rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:bg-brand-500/40", children: loading ? 'Creating...' : 'Add goal' }) })] }), monthlySurplus > 0 && goals.length > 0 && (_jsxs("div", { className: "mt-6 rounded-xl border border-brand-600/40 bg-brand-500/10 p-4", children: [_jsxs("p", { className: "text-sm font-semibold text-brand-100", children: ["Suggested allocation for $", formatCurrency(monthlySurplus), " surplus this month"] }), _jsx("div", { className: "mt-3 space-y-2 text-sm text-slate-200", children: suggestedAllocations.map(function (_a) {
                            var goal = _a.goal, allocation = _a.allocation;
                            return (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { children: goal.title }), _jsx("span", { children: formatCurrency(allocation) })] }, goal.id));
                        }) }), totalTargeted > 0 && (_jsxs("p", { className: "mt-2 text-xs text-brand-200", children: ["Based on desired contributions totaling ", formatCurrency(totalTargeted), " across goals."] }))] })), _jsx("div", { className: "mt-6 space-y-3", children: goals.length === 0 ? (_jsx("p", { className: "text-sm text-slate-400", children: "No goals yet. Add one above to start tracking." })) : (goals.map(function (goal) {
                    var _a, _b, _c;
                    var progress = (goal.current_progress / goal.target_amount) * 100;
                    var monthlyContribution = (_b = (_a = goal.desired_monthly) !== null && _a !== void 0 ? _a : goal.monthly_contribution) !== null && _b !== void 0 ? _b : null;
                    var transactionContribution = (_c = goalTransactions[goal.id]) !== null && _c !== void 0 ? _c : 0;
                    var effectiveMonthly = monthlyContribution || transactionContribution || null;
                    return (_jsxs("div", { className: "rounded-xl border border-slate-800/70 bg-slate-900/60 p-4", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "text-sm font-semibold text-slate-100", children: goal.title }), _jsx("p", { className: "mt-1 text-xs uppercase tracking-[0.2em] text-slate-400", children: goal.goal_type === 'purchase' ? 'Savings goal' : 'Loan payoff' }), goal.target_date && (_jsxs("p", { className: "mt-1 text-xs text-slate-400", children: ["Target date: ", new Date(goal.target_date).toLocaleDateString()] })), effectiveMonthly && (_jsxs("p", { className: "mt-1 text-xs text-slate-400", children: ["Monthly plan: ", formatCurrency(effectiveMonthly), transactionContribution && !monthlyContribution ? ' (tracked from transactions)' : ''] }))] }), _jsxs("div", { className: "ml-4 flex flex-col gap-2", children: [onViewProjection && (_jsx("button", { onClick: function () { return onViewProjection(goal.id); }, className: "rounded border border-brand-500/60 px-3 py-1 text-xs text-brand-200 transition hover:bg-brand-500/20", children: "View projection" })), _jsx("button", { onClick: function () { return onDeleteGoal(goal.id); }, className: "rounded border border-slate-700 px-3 py-1 text-xs text-slate-400 transition hover:border-rose-400 hover:text-rose-300", children: "Delete" })] })] }), _jsxs("div", { className: "mt-3", children: [_jsxs("div", { className: "flex items-center justify-between text-xs text-slate-400", children: [_jsx("span", { children: "Progress" }), _jsxs("span", { className: "font-medium text-slate-300", children: [formatCurrency(goal.current_progress), " / ", formatCurrency(goal.target_amount)] })] }), _jsx("div", { className: "mt-2 h-2 overflow-hidden rounded-full bg-slate-800", children: _jsx("div", { className: "h-full rounded-full bg-brand-500 transition-all", style: { width: "".concat(Math.min(progress, 100), "%") } }) })] }), goal.goal_type === 'loan_payoff' && goal.loan_account_id && (_jsxs("p", { className: "mt-3 text-xs text-slate-400", children: ["Linked loan account ID: ", goal.loan_account_id] })), transactionContribution > 0 && (_jsxs("p", { className: "mt-1 text-xs text-slate-400", children: ["This month\u2019s contributions from transactions: ", formatCurrency(transactionContribution)] }))] }, goal.id));
                })) })] }));
};
export default GoalsPanel;
