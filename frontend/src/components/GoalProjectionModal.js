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
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, } from 'chart.js';
import { formatCurrency } from '../utils/format';
import { api } from '../lib/api';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
var GoalProjectionModal = function (_a) {
    var _b, _c, _d, _e;
    var goalId = _a.goalId, onClose = _a.onClose;
    var _f = useState(null), projection = _f[0], setProjection = _f[1];
    var _g = useState(false), loading = _g[0], setLoading = _g[1];
    var _h = useState(null), error = _h[0], setError = _h[1];
    useEffect(function () {
        if (!goalId)
            return;
        var fetchProjection = function () { return __awaiter(void 0, void 0, void 0, function () {
            var res, err_1;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        setLoading(true);
                        setError(null);
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, api.get("/goals/".concat(goalId, "/projection"))];
                    case 2:
                        res = _c.sent();
                        setProjection(res.data);
                        return [3 /*break*/, 5];
                    case 3:
                        err_1 = _c.sent();
                        setError(((_b = (_a = err_1 === null || err_1 === void 0 ? void 0 : err_1.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.detail) || err_1.message || 'Unknown error');
                        return [3 /*break*/, 5];
                    case 4:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        fetchProjection();
    }, [goalId]);
    if (!goalId)
        return null;
    var chartData = projection && projection.schedule.length > 0
        ? {
            labels: projection.schedule.map(function (s) { return "Month ".concat(s.month); }),
            datasets: [
                {
                    label: projection.goal_type === 'loan_payoff' ? 'Remaining balance' : 'Accumulated savings',
                    data: projection.schedule.map(function (s) { var _a, _b; return projection.goal_type === 'loan_payoff' ? (_a = s.balance) !== null && _a !== void 0 ? _a : 0 : (_b = s.accumulated) !== null && _b !== void 0 ? _b : 0; }),
                    borderColor: projection.goal_type === 'loan_payoff' ? '#f87171' : '#34d399',
                    backgroundColor: projection.goal_type === 'loan_payoff'
                        ? 'rgba(248, 113, 113, 0.1)'
                        : 'rgba(52, 211, 153, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                },
            ],
        }
        : null;
    var chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: '#e2e8f0',
                    font: {
                        size: 12,
                        family: 'Inter, system-ui, sans-serif',
                    },
                },
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                borderColor: 'rgba(148, 163, 184, 0.3)',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                titleColor: '#f8fafc',
                bodyColor: '#e2e8f0',
                titleFont: {
                    size: 13,
                    family: 'Inter, system-ui, sans-serif',
                },
                bodyFont: {
                    size: 12,
                    family: 'Inter, system-ui, sans-serif',
                },
                callbacks: {
                    label: function (context) {
                        var _a;
                        var value = (_a = context.parsed.y) !== null && _a !== void 0 ? _a : 0;
                        return "".concat(context.dataset.label, ": ").concat(formatCurrency(value));
                    },
                },
            },
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(148, 163, 184, 0.15)',
                },
                border: {
                    display: false,
                },
                ticks: {
                    color: '#94a3b8',
                    font: {
                        size: 11,
                        family: 'Inter, system-ui, sans-serif',
                    },
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(148, 163, 184, 0.15)',
                },
                border: {
                    display: false,
                },
                ticks: {
                    color: '#94a3b8',
                    callback: function (value) { return "$".concat(Number(value).toLocaleString()); },
                    font: {
                        size: 11,
                        family: 'Inter, system-ui, sans-serif',
                    },
                },
            },
        },
    };
    return (_jsx("div", { className: "fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm", onClick: onClose, children: _jsxs("div", { className: "relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl", onClick: function (e) { return e.stopPropagation(); }, children: [_jsx("button", { onClick: onClose, className: "absolute right-6 top-6 rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-slate-200", children: "Close" }), _jsx("h2", { className: "text-2xl font-bold text-slate-100", children: "Goal projection" }), _jsx("p", { className: "mt-1 text-sm text-slate-400", children: (projection === null || projection === void 0 ? void 0 : projection.goal_type) === 'loan_payoff'
                        ? 'Loan payoff timeline and interest breakdown'
                        : 'Savings accumulation timeline' }), loading && _jsx("p", { className: "mt-6 text-sm text-slate-400", children: "Loading projection..." }), error && _jsxs("p", { className: "mt-6 text-sm text-rose-400", children: ["Error: ", error] }), projection && (_jsxs("div", { className: "mt-6 space-y-6", children: [_jsx("div", { className: "grid gap-4 md:grid-cols-3", children: projection.goal_type === 'loan_payoff' ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "rounded-xl border border-slate-800 bg-slate-900/60 p-4", children: [_jsx("p", { className: "text-xs uppercase tracking-[0.2em] text-slate-400", children: "Total months" }), _jsx("p", { className: "mt-2 text-2xl font-bold text-slate-100", children: projection.total_months })] }), _jsxs("div", { className: "rounded-xl border border-slate-800 bg-slate-900/60 p-4", children: [_jsx("p", { className: "text-xs uppercase tracking-[0.2em] text-slate-400", children: "Total interest" }), _jsx("p", { className: "mt-2 text-2xl font-bold text-rose-400", children: formatCurrency((_b = projection.total_interest) !== null && _b !== void 0 ? _b : 0) })] }), _jsxs("div", { className: "rounded-xl border border-slate-800 bg-slate-900/60 p-4", children: [_jsx("p", { className: "text-xs uppercase tracking-[0.2em] text-slate-400", children: "Total paid" }), _jsx("p", { className: "mt-2 text-2xl font-bold text-slate-100", children: formatCurrency((_c = projection.total_paid) !== null && _c !== void 0 ? _c : 0) })] })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "rounded-xl border border-slate-800 bg-slate-900/60 p-4", children: [_jsx("p", { className: "text-xs uppercase tracking-[0.2em] text-slate-400", children: "Months needed" }), _jsx("p", { className: "mt-2 text-2xl font-bold text-slate-100", children: projection.months_needed })] }), _jsxs("div", { className: "rounded-xl border border-slate-800 bg-slate-900/60 p-4", children: [_jsx("p", { className: "text-xs uppercase tracking-[0.2em] text-slate-400", children: "Current progress" }), _jsx("p", { className: "mt-2 text-2xl font-bold text-emerald-400", children: formatCurrency((_d = projection.current_progress) !== null && _d !== void 0 ? _d : 0) })] }), _jsxs("div", { className: "rounded-xl border border-slate-800 bg-slate-900/60 p-4", children: [_jsx("p", { className: "text-xs uppercase tracking-[0.2em] text-slate-400", children: "Remaining" }), _jsx("p", { className: "mt-2 text-2xl font-bold text-slate-100", children: formatCurrency((_e = projection.remaining) !== null && _e !== void 0 ? _e : 0) })] })] })) }), chartData && (_jsxs("div", { className: "rounded-xl border border-slate-800 bg-slate-900/60 p-6", children: [_jsx("h3", { className: "mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-300", children: "Projection timeline" }), _jsx("div", { style: { height: '320px' }, children: _jsx(Line, { data: chartData, options: chartOptions }) })] })), projection.goal_type === 'loan_payoff' && projection.payoff_date && (_jsx("div", { className: "rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4", children: _jsxs("p", { className: "text-sm text-emerald-200", children: [_jsx("strong", { children: "Projected payoff date:" }), ' ', new Date(projection.payoff_date).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })] }) })), projection.goal_type === 'purchase' && projection.target_date && (_jsx("div", { className: "rounded-xl border border-brand-500/30 bg-brand-500/10 p-4", children: _jsxs("p", { className: "text-sm text-brand-200", children: [_jsx("strong", { children: "Target date:" }), ' ', new Date(projection.target_date).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })] }) }))] }))] }) }));
};
export default GoalProjectionModal;
