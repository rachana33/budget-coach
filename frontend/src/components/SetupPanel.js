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
var ACCOUNT_TYPES = ['card', 'bank', 'loan'];
var DEFAULT_CATEGORIES = ['Housing', 'Utilities', 'Food', 'Transport', 'Shopping', 'Subscriptions'];
var SetupPanel = function (_a) {
    var _b, _c, _d, _e, _f;
    var accounts = _a.accounts, recurring = _a.recurring, onCreateAccount = _a.onCreateAccount, onCreateRecurring = _a.onCreateRecurring, _g = _a.showAccounts, showAccounts = _g === void 0 ? true : _g, _h = _a.showRecurring, showRecurring = _h === void 0 ? true : _h;
    var _j = useState({
        name: '',
        type: 'card',
        issuer: '',
        credit_limit: undefined,
        loan_principal: undefined,
        loan_interest_rate: undefined,
        emi_amount: undefined,
    }), accountForm = _j[0], setAccountForm = _j[1];
    var _k = useState({
        name: '',
        amount: 0,
        billing_cycle: 'monthly',
        category: 'Housing',
    }), recurringForm = _k[0], setRecurringForm = _k[1];
    var _l = useState(false), loadingAccount = _l[0], setLoadingAccount = _l[1];
    var _m = useState(false), loadingRecurring = _m[0], setLoadingRecurring = _m[1];
    var loanFieldsVisible = accountForm.type === 'loan';
    var creditFieldsVisible = accountForm.type === 'card';
    var monthlyRecurringTotal = useMemo(function () {
        if (!showRecurring)
            return 0;
        return recurring.reduce(function (sum, item) { return sum + item.amount; }, 0);
    }, [recurring, showRecurring]);
    var resetAccountForm = function () {
        setAccountForm({
            name: '',
            type: 'card',
            issuer: '',
            credit_limit: undefined,
            loan_principal: undefined,
            loan_interest_rate: undefined,
            emi_amount: undefined,
        });
    };
    var resetRecurringForm = function () {
        setRecurringForm({
            name: '',
            amount: 0,
            billing_cycle: 'monthly',
            category: 'Housing',
        });
    };
    var handleAccountSubmit = function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var payload;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    event.preventDefault();
                    setLoadingAccount(true);
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, , 3, 4]);
                    payload = __assign(__assign({}, accountForm), { issuer: ((_a = accountForm.issuer) === null || _a === void 0 ? void 0 : _a.trim()) || undefined, credit_limit: creditFieldsVisible ? (_b = accountForm.credit_limit) !== null && _b !== void 0 ? _b : undefined : undefined, loan_principal: loanFieldsVisible ? (_c = accountForm.loan_principal) !== null && _c !== void 0 ? _c : undefined : undefined, loan_interest_rate: loanFieldsVisible ? (_d = accountForm.loan_interest_rate) !== null && _d !== void 0 ? _d : undefined : undefined, emi_amount: loanFieldsVisible ? (_e = accountForm.emi_amount) !== null && _e !== void 0 ? _e : undefined : undefined });
                    return [4 /*yield*/, onCreateAccount(payload)];
                case 2:
                    _f.sent();
                    resetAccountForm();
                    return [3 /*break*/, 4];
                case 3:
                    setLoadingAccount(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleRecurringSubmit = function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var payload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event.preventDefault();
                    if (!recurringForm.name.trim())
                        return [2 /*return*/];
                    setLoadingRecurring(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    payload = __assign(__assign({}, recurringForm), { name: recurringForm.name.trim(), amount: Number(recurringForm.amount) || 0 });
                    return [4 /*yield*/, onCreateRecurring(payload)];
                case 2:
                    _a.sent();
                    resetRecurringForm();
                    return [3 /*break*/, 4];
                case 3:
                    setLoadingRecurring(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (_jsxs("div", { className: "flex flex-col gap-6", children: [showAccounts && (_jsxs(SectionCard, { title: "Accounts", subtitle: "Cards, loans, and bank accounts you track", actions: _jsxs("span", { className: "text-xs text-slate-400", children: [accounts.length, " linked"] }), children: [_jsxs("form", { className: "space-y-4", onSubmit: handleAccountSubmit, children: [_jsxs("div", { className: "grid grid-cols-1 gap-3", children: [_jsxs("label", { className: "flex flex-col gap-1", children: [_jsx("span", { className: "text-xs font-medium uppercase tracking-[0.2em] text-slate-400", children: "Name" }), _jsx("input", { required: true, type: "text", className: "rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30", placeholder: "Chase Sapphire", value: accountForm.name, onChange: function (event) { return setAccountForm(function (prev) { return (__assign(__assign({}, prev), { name: event.target.value })); }); } })] }), _jsxs("label", { className: "flex flex-col gap-1", children: [_jsx("span", { className: "text-xs font-medium uppercase tracking-[0.2em] text-slate-400", children: "Type" }), _jsx("select", { className: "rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30", value: accountForm.type, onChange: function (event) {
                                                    return setAccountForm(function (prev) { return (__assign(__assign({}, prev), { type: event.target.value })); });
                                                }, children: ACCOUNT_TYPES.map(function (type) { return (_jsx("option", { value: type, children: type }, type)); }) })] }), _jsxs("label", { className: "flex flex-col gap-1", children: [_jsx("span", { className: "text-xs font-medium uppercase tracking-[0.2em] text-slate-400", children: "Issuer" }), _jsx("input", { type: "text", className: "rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30", placeholder: "Bank or provider", value: (_b = accountForm.issuer) !== null && _b !== void 0 ? _b : '', onChange: function (event) { return setAccountForm(function (prev) { return (__assign(__assign({}, prev), { issuer: event.target.value })); }); } })] })] }), creditFieldsVisible && (_jsx("div", { className: "grid grid-cols-1 gap-3", children: _jsxs("label", { className: "flex flex-col gap-1", children: [_jsx("span", { className: "text-xs font-medium uppercase tracking-[0.2em] text-slate-400", children: "Credit limit" }), _jsx("input", { type: "number", min: 0, className: "rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30", value: (_c = accountForm.credit_limit) !== null && _c !== void 0 ? _c : '', onChange: function (event) {
                                                return setAccountForm(function (prev) { return (__assign(__assign({}, prev), { credit_limit: Number(event.target.value) })); });
                                            } })] }) })), loanFieldsVisible && (_jsxs("div", { className: "grid grid-cols-1 gap-3", children: [_jsxs("label", { className: "flex flex-col gap-1", children: [_jsx("span", { className: "text-xs font-medium uppercase tracking-[0.2em] text-slate-400", children: "Principal" }), _jsx("input", { type: "number", min: 0, className: "rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30", value: (_d = accountForm.loan_principal) !== null && _d !== void 0 ? _d : '', onChange: function (event) {
                                                    return setAccountForm(function (prev) { return (__assign(__assign({}, prev), { loan_principal: Number(event.target.value) })); });
                                                } })] }), _jsxs("label", { className: "flex flex-col gap-1", children: [_jsx("span", { className: "text-xs font-medium uppercase tracking-[0.2em] text-slate-400", children: "Interest (%)" }), _jsx("input", { type: "number", min: 0, step: "0.01", className: "rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30", value: (_e = accountForm.loan_interest_rate) !== null && _e !== void 0 ? _e : '', onChange: function (event) {
                                                    return setAccountForm(function (prev) { return (__assign(__assign({}, prev), { loan_interest_rate: Number(event.target.value) })); });
                                                } })] }), _jsxs("label", { className: "flex flex-col gap-1", children: [_jsx("span", { className: "text-xs font-medium uppercase tracking-[0.2em] text-slate-400", children: "Monthly payment" }), _jsx("input", { type: "number", min: 0, className: "rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30", value: (_f = accountForm.emi_amount) !== null && _f !== void 0 ? _f : '', onChange: function (event) {
                                                    return setAccountForm(function (prev) { return (__assign(__assign({}, prev), { emi_amount: Number(event.target.value) })); });
                                                } })] })] })), _jsx("div", { className: "flex justify-end", children: _jsx("button", { type: "submit", disabled: loadingAccount, className: "rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:bg-brand-500/40", children: loadingAccount ? 'Saving...' : 'Add account' }) })] }), _jsx("div", { className: "space-y-2 text-sm text-slate-300", children: accounts.length === 0 ? (_jsx("p", { className: "text-sm text-slate-500", children: "No accounts yet. Add one above." })) : (accounts.map(function (account) {
                            var _a;
                            return (_jsxs("div", { className: "flex items-center justify-between rounded-lg border border-slate-800/80 bg-slate-900/70 px-3 py-2", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-slate-100", children: account.name }), _jsxs("p", { className: "text-xs uppercase tracking-[0.2em] text-slate-400", children: [account.type, account.issuer ? " \u00B7 ".concat(account.issuer) : ''] })] }), account.emi_amount ? (_jsxs("span", { className: "text-xs text-slate-400", children: ["Payment $", (_a = account.emi_amount) === null || _a === void 0 ? void 0 : _a.toLocaleString('en-US')] })) : null] }, account.id));
                        })) })] })), showRecurring && (_jsxs(SectionCard, { title: "Recurring commitments", subtitle: "Rent, utilities, subscriptions", actions: _jsxs("span", { className: "text-xs text-slate-400", children: ["$", monthlyRecurringTotal.toLocaleString('en-US'), " per month"] }), children: [_jsxs("form", { className: "space-y-4", onSubmit: handleRecurringSubmit, children: [_jsxs("div", { className: "grid grid-cols-1 gap-3", children: [_jsxs("label", { className: "flex flex-col gap-1", children: [_jsx("span", { className: "text-xs font-medium uppercase tracking-[0.2em] text-slate-400", children: "Name" }), _jsx("input", { required: true, type: "text", className: "rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30", placeholder: "Rent", value: recurringForm.name, onChange: function (event) { return setRecurringForm(function (prev) { return (__assign(__assign({}, prev), { name: event.target.value })); }); } })] }), _jsxs("label", { className: "flex flex-col gap-1", children: [_jsx("span", { className: "text-xs font-medium uppercase tracking-[0.2em] text-slate-400", children: "Amount (monthly)" }), _jsx("input", { required: true, type: "number", min: 0, className: "rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30", value: recurringForm.amount, onChange: function (event) {
                                                    return setRecurringForm(function (prev) { return (__assign(__assign({}, prev), { amount: Number(event.target.value) })); });
                                                } })] }), _jsxs("label", { className: "flex flex-col gap-1", children: [_jsx("span", { className: "text-xs font-medium uppercase tracking-[0.2em] text-slate-400", children: "Category" }), _jsx("select", { className: "rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30", value: recurringForm.category, onChange: function (event) {
                                                    return setRecurringForm(function (prev) { return (__assign(__assign({}, prev), { category: event.target.value })); });
                                                }, children: DEFAULT_CATEGORIES.map(function (category) { return (_jsx("option", { value: category, children: category }, category)); }) })] })] }), _jsx("div", { className: "flex justify-end", children: _jsx("button", { type: "submit", disabled: loadingRecurring, className: "rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:bg-brand-500/40", children: loadingRecurring ? 'Saving...' : 'Add recurring expense' }) })] }), _jsx("div", { className: "space-y-2 text-sm text-slate-300", children: recurring.length === 0 ? (_jsx("p", { className: "text-sm text-slate-500", children: "No recurring commitments logged yet." })) : (recurring.map(function (item) { return (_jsxs("div", { className: "flex items-center justify-between rounded-lg border border-slate-800/80 bg-slate-900/70 px-3 py-2", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-slate-100", children: item.name }), _jsx("p", { className: "text-xs uppercase tracking-[0.2em] text-slate-400", children: item.category })] }), _jsxs("span", { className: "text-xs text-slate-300", children: ["$", item.amount.toLocaleString('en-US')] })] }, item.id)); })) })] }))] }));
};
export default SetupPanel;
