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
import { useEffect, useMemo, useState } from 'react';
import { api } from './lib/api';
import Dashboard from './components/Dashboard';
import { normalizeCategoryKey } from './utils/categories';
import AddDataModal from './components/AddDataModal';
import TransactionListPanel from './components/TransactionListPanel';
import GoalProjectionModal from './components/GoalProjectionModal';
import ProfilePanel from './components/ProfilePanel';
import RangeInsightsModal from './components/RangeInsightsModal';
var DEFAULT_MONTH = '2025-11';
var App = function () {
    var _a = useState(DEFAULT_MONTH), month = _a[0], setMonth = _a[1];
    var _b = useState([]), accounts = _b[0], setAccounts = _b[1];
    var _c = useState([]), recurringExpenses = _c[0], setRecurringExpenses = _c[1];
    var _d = useState([]), transactions = _d[0], setTransactions = _d[1];
    var _e = useState(null), overview = _e[0], setOverview = _e[1];
    var _f = useState(null), microHabits = _f[0], setMicroHabits = _f[1];
    var _g = useState(null), coach = _g[0], setCoach = _g[1];
    var _h = useState(false), loadingCoach = _h[0], setLoadingCoach = _h[1];
    var _j = useState(null), error = _j[0], setError = _j[1];
    var _k = useState(false), coachVisible = _k[0], setCoachVisible = _k[1];
    var _l = useState({}), categoryLimits = _l[0], setCategoryLimits = _l[1];
    var _m = useState(false), addDataOpen = _m[0], setAddDataOpen = _m[1];
    var _o = useState(null), modalType = _o[0], setModalType = _o[1];
    var _p = useState([]), goals = _p[0], setGoals = _p[1];
    var _q = useState(null), projectionGoalId = _q[0], setProjectionGoalId = _q[1];
    var _r = useState(false), rangeInsightsOpen = _r[0], setRangeInsightsOpen = _r[1];
    var _s = useState('dashboard'), activeTab = _s[0], setActiveTab = _s[1];
    var monthLabel = useMemo(function () {
        var date = new Date("".concat(month, "-01T00:00:00"));
        return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
        });
    }, [month]);
    useEffect(function () {
        if (typeof window === 'undefined')
            return;
        try {
            var stored = window.localStorage.getItem('budget-coach-category-limits');
            if (stored) {
                setCategoryLimits(JSON.parse(stored));
            }
        }
        catch (err) {
            console.warn('Failed to load saved limits', err);
        }
    }, []);
    useEffect(function () {
        if (typeof window === 'undefined')
            return;
        try {
            window.localStorage.setItem('budget-coach-category-limits', JSON.stringify(categoryLimits));
        }
        catch (err) {
            console.warn('Failed to persist category limits', err);
        }
    }, [categoryLimits]);
    var fetchAccounts = function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.get('/accounts/')];
                case 1:
                    res = _a.sent();
                    setAccounts(res.data);
                    return [2 /*return*/];
            }
        });
    }); };
    var fetchRecurring = function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.get('/recurring-expenses/')];
                case 1:
                    res = _a.sent();
                    setRecurringExpenses(res.data);
                    return [2 /*return*/];
            }
        });
    }); };
    var fetchTransactions = function (targetMonth) { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.get('/transactions/', {
                        params: { month: targetMonth },
                    })];
                case 1:
                    res = _a.sent();
                    setTransactions(res.data);
                    return [2 /*return*/];
            }
        });
    }); };
    var fetchOverview = function (targetMonth) { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.get('/analytics/overview', {
                        params: { month: targetMonth },
                    })];
                case 1:
                    res = _a.sent();
                    setOverview(res.data);
                    return [2 /*return*/];
            }
        });
    }); };
    var fetchMicroHabits = function (targetMonth) { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.get('/analytics/micro-habits', {
                        params: { month: targetMonth },
                    })];
                case 1:
                    res = _a.sent();
                    setMicroHabits(res.data);
                    return [2 /*return*/];
            }
        });
    }); };
    var fetchGoals = function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.get('/goals/')];
                case 1:
                    res = _a.sent();
                    setGoals(res.data);
                    return [2 /*return*/];
            }
        });
    }); };
    var fetchCoach = function (targetMonth) { return __awaiter(void 0, void 0, void 0, function () {
        var res, err_1;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    setLoadingCoach(true);
                    setError(null);
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, api.post('/coach/', null, {
                            params: { month: targetMonth },
                        })];
                case 2:
                    res = _d.sent();
                    setCoach(res.data);
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _d.sent();
                    console.error('coach error', err_1);
                    setError((_c = (_b = (_a = err_1 === null || err_1 === void 0 ? void 0 : err_1.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.detail) !== null && _c !== void 0 ? _c : 'Failed to fetch coach response');
                    setCoach(null);
                    return [3 /*break*/, 5];
                case 4:
                    setLoadingCoach(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var refreshAll = function (targetMonth) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        fetchAccounts(),
                        fetchRecurring(),
                        fetchTransactions(targetMonth),
                        fetchOverview(targetMonth),
                        fetchMicroHabits(targetMonth),
                    ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    useEffect(function () {
        Promise.all([refreshAll(month), fetchGoals()])
            .then(function () {
            setError(null);
        })
            .catch(function (err) {
            console.error('month change failed', err);
            setError('Failed to load data');
        });
    }, [month]);
    useEffect(function () {
        if (!coachVisible) {
            setCoach(null);
            return;
        }
        fetchCoach(month).catch(function (err) {
            console.error('coach fetch failed', err);
        });
    }, [coachVisible, month]);
    var handleCreateAccount = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.post('/accounts/', payload)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, fetchAccounts()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleCreateRecurring = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.post('/recurring-expenses/', payload)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, fetchRecurring()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, fetchOverview(month)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleCreateTransaction = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.post('/transactions/', payload)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, refreshAll(month)];
                case 2:
                    _a.sent();
                    if (!coachVisible) return [3 /*break*/, 4];
                    return [4 /*yield*/, fetchCoach(month)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleDeleteTransaction = function (id) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.delete("/transactions/".concat(id))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, refreshAll(month)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleCreateGoal = function (payload) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.post('/goals/', payload)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, fetchGoals()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleDeleteGoal = function (id) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.delete("/goals/".concat(id))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, fetchGoals()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleDeleteAccount = function (id) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.delete("/accounts/".concat(id))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, fetchAccounts()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleDeleteRecurring = function (id) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, api.delete("/recurring-expenses/".concat(id))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, fetchRecurring()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var handleExportData = function () {
        var data = {
            accounts: accounts,
            recurringExpenses: recurringExpenses,
            transactions: transactions,
            categoryLimits: categoryLimits,
            goals: goals,
            exportDate: new Date().toISOString(),
        };
        var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = "budget-coach-export-".concat(new Date().toISOString().slice(0, 10), ".json");
        a.click();
        URL.revokeObjectURL(url);
    };
    var handleSaveLimit = function (label, amount) {
        var key = normalizeCategoryKey(label);
        setCategoryLimits(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[key] = {
                label: label.trim(),
                amount: amount,
            }, _a)));
        });
    };
    var handleRemoveLimit = function (key) {
        setCategoryLimits(function (prev) {
            var next = __assign({}, prev);
            delete next[key];
            return next;
        });
    };
    var availableCategories = useMemo(function () {
        var set = new Set();
        if (overview) {
            Object.keys(overview.category_breakdown).forEach(function (category) { return set.add(category); });
        }
        transactions.forEach(function (transaction) { return set.add(transaction.category); });
        Object.values(categoryLimits).forEach(function (limit) { return set.add(limit.label); });
        return Array.from(set).sort(function (a, b) { return a.localeCompare(b, undefined, { sensitivity: 'base' }); });
    }, [overview, transactions, categoryLimits]);
    var handleAskCoach = function () {
        setCoachVisible(true);
    };
    var handleHideCoach = function () {
        setCoachVisible(false);
        setCoach(null);
    };
    return (_jsxs("div", { className: "min-h-screen bg-slate-950 text-slate-100", children: [_jsx("header", { className: "border-b border-slate-800 bg-slate-950/80 backdrop-blur", children: _jsxs("div", { className: "mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 lg:flex-row lg:items-center lg:justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm uppercase tracking-[0.3em] text-brand-300/80", children: "Your AI-powered spending guide" }), _jsx("h1", { className: "mt-2 text-3xl font-semibold text-slate-50 lg:text-4xl", children: "Budget Coach" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: function () { return setActiveTab('dashboard'); }, className: "rounded-md px-4 py-2 text-sm font-semibold transition ".concat(activeTab === 'dashboard'
                                        ? 'bg-brand-500 text-white'
                                        : 'border border-slate-700 text-slate-300 hover:bg-slate-800'), children: "Dashboard" }), _jsx("button", { onClick: function () { return setActiveTab('profile'); }, className: "rounded-md px-4 py-2 text-sm font-semibold transition ".concat(activeTab === 'profile'
                                        ? 'bg-brand-500 text-white'
                                        : 'border border-slate-700 text-slate-300 hover:bg-slate-800'), children: "Profile" })] })] }) }), error && (_jsx("div", { className: "mx-auto mt-4 max-w-7xl px-6", children: _jsx("div", { className: "rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200", children: error }) })), _jsxs("main", { className: "mx-auto max-w-7xl space-y-6 px-6 py-8", children: [activeTab === 'dashboard' && (_jsx(Dashboard, { monthLabel: monthLabel, month: month, overview: overview, microHabits: microHabits, transactions: transactions, limits: categoryLimits, coach: coach, loadingCoach: loadingCoach, onMonthChange: setMonth, onAddAccount: function () {
                            setModalType('account');
                            setAddDataOpen(true);
                        }, onAddRecurring: function () {
                            setModalType('recurring');
                            setAddDataOpen(true);
                        }, onAddTransaction: function () {
                            setModalType('transaction');
                            setAddDataOpen(true);
                        }, onManageLimits: function () {
                            setModalType('limit');
                            setAddDataOpen(true);
                        }, onManageGoals: function () {
                            setModalType('goals');
                            setAddDataOpen(true);
                        }, onViewTrends: function () { return setRangeInsightsOpen(true); }, onToggleCoach: function () { return setCoachVisible(function (prev) { return !prev; }); }, coachVisible: coachVisible })), activeTab === 'profile' && (_jsx(ProfilePanel, { accounts: accounts, recurringExpenses: recurringExpenses, onDeleteAccount: handleDeleteAccount, onDeleteRecurring: handleDeleteRecurring, onExportData: handleExportData })), activeTab === 'dashboard' && (_jsx(TransactionListPanel, { transactions: transactions, limits: categoryLimits, goals: goals, onDelete: handleDeleteTransaction }))] }), _jsx(AddDataModal, { open: addDataOpen, onClose: function () {
                    setAddDataOpen(false);
                    setModalType(null);
                }, modalType: modalType, month: month, monthLabel: monthLabel, accounts: accounts, recurring: recurringExpenses, transactions: transactions, categories: availableCategories, limits: categoryLimits, goals: goals, onCreateAccount: handleCreateAccount, onCreateRecurring: handleCreateRecurring, onCreateTransaction: handleCreateTransaction, onSaveLimit: handleSaveLimit, onRemoveLimit: handleRemoveLimit, onCreateGoal: handleCreateGoal, onDeleteGoal: handleDeleteGoal, onViewProjection: function (id) { return setProjectionGoalId(id); } }), _jsx(GoalProjectionModal, { goalId: projectionGoalId, onClose: function () { return setProjectionGoalId(null); } }), _jsx(RangeInsightsModal, { open: rangeInsightsOpen, onClose: function () { return setRangeInsightsOpen(false); } })] }));
};
export default App;
