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
import { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, } from 'chart.js';
import { formatCurrency } from '../utils/format';
import { api } from '../lib/api';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);
var RangeInsightsModal = function (_a) {
    var open = _a.open, onClose = _a.onClose;
    var _b = useState(''), startMonth = _b[0], setStartMonth = _b[1];
    var _c = useState(''), endMonth = _c[0], setEndMonth = _c[1];
    var _d = useState(null), rangeData = _d[0], setRangeData = _d[1];
    var _e = useState(false), loading = _e[0], setLoading = _e[1];
    var _f = useState(null), error = _f[0], setError = _f[1];
    var invalidRange = Boolean(startMonth && endMonth && endMonth < startMonth);
    var handleStartMonthChange = function (value) {
        setStartMonth(value);
        if (value && endMonth && endMonth < value) {
            setEndMonth(value);
        }
        setError(null);
    };
    var handleEndMonthChange = function (value) {
        setEndMonth(value);
        if (startMonth && value && value < startMonth) {
            setError('End month cannot be before the start month.');
        }
        else {
            setError(null);
        }
    };
    useEffect(function () {
        if (!open)
            return;
        var previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return function () {
            document.body.style.overflow = previous;
        };
    }, [open]);
    var fetchRangeData = function () { return __awaiter(void 0, void 0, void 0, function () {
        var res, err_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!startMonth || !endMonth) {
                        setError('Please select both start and end months');
                        return [2 /*return*/];
                    }
                    if (invalidRange) {
                        setError('End month must be the same as or after the start month.');
                        return [2 /*return*/];
                    }
                    setLoading(true);
                    setError(null);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, api.get('/analytics/range', {
                            params: {
                                start_month: startMonth,
                                end_month: endMonth,
                            },
                        })];
                case 2:
                    res = _c.sent();
                    setRangeData(res.data);
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _c.sent();
                    setError(((_b = (_a = err_1.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.detail) || err_1.message || 'Unknown error');
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    if (!open)
        return null;
    var trendChartData = rangeData
        ? {
            labels: rangeData.monthly_trend.map(function (m) { return m.month; }),
            datasets: [
                {
                    label: 'Income',
                    data: rangeData.monthly_trend.map(function (m) { return m.income; }),
                    borderColor: '#34d399',
                    backgroundColor: 'rgba(52, 211, 153, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    fill: true,
                },
                {
                    label: 'Expenses',
                    data: rangeData.monthly_trend.map(function (m) { return m.expenses; }),
                    borderColor: '#f87171',
                    backgroundColor: 'rgba(248, 113, 113, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    fill: true,
                },
            ],
        }
        : null;
    var categoryChartData = rangeData
        ? {
            labels: Object.keys(rangeData.category_breakdown).sort(function (a, b) { return rangeData.category_breakdown[b] - rangeData.category_breakdown[a]; }),
            datasets: [
                {
                    label: 'Total Spending',
                    data: Object.keys(rangeData.category_breakdown)
                        .sort(function (a, b) { return rangeData.category_breakdown[b] - rangeData.category_breakdown[a]; })
                        .map(function (cat) { return rangeData.category_breakdown[cat]; }),
                    backgroundColor: [
                        '#4c6ef5',
                        '#4263eb',
                        '#364fc7',
                        '#748ffc',
                        '#5c7cfa',
                        '#3b5bdb',
                        '#7950f2',
                        '#9775fa',
                    ],
                    borderRadius: 8,
                    borderSkipped: false,
                },
            ],
        }
        : null;
    var trendChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 1000,
            easing: 'easeInOutQuart',
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: '#e2e8f0',
                    font: {
                        size: 13,
                        family: 'Inter, system-ui, sans-serif',
                    },
                    padding: 16,
                    usePointStyle: true,
                },
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                borderColor: 'rgba(148, 163, 184, 0.3)',
                borderWidth: 1,
                padding: 14,
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
                    color: 'rgba(148, 163, 184, 0.1)',
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
                    color: 'rgba(148, 163, 184, 0.1)',
                },
                border: {
                    display: false,
                },
                ticks: {
                    color: '#94a3b8',
                    callback: function (value) { return formatCurrency(Number(value)); },
                    font: {
                        size: 11,
                        family: 'Inter, system-ui, sans-serif',
                    },
                },
            },
        },
    };
    var categoryChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        animation: {
            duration: 800,
            easing: 'easeInOutQuart',
            delay: function (context) {
                return context.dataIndex * 60;
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                borderColor: 'rgba(148, 163, 184, 0.3)',
                borderWidth: 1,
                padding: 14,
                cornerRadius: 8,
                titleColor: '#f8fafc',
                bodyColor: '#e2e8f0',
                callbacks: {
                    label: function (context) {
                        var _a;
                        var value = (_a = context.parsed.x) !== null && _a !== void 0 ? _a : 0;
                        return "Total: ".concat(formatCurrency(value));
                    },
                },
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(148, 163, 184, 0.1)',
                },
                border: {
                    display: false,
                },
                ticks: {
                    color: '#94a3b8',
                    callback: function (value) { return formatCurrency(Number(value)); },
                    font: {
                        size: 11,
                        family: 'Inter, system-ui, sans-serif',
                    },
                },
            },
            y: {
                grid: {
                    display: false,
                },
                border: {
                    display: false,
                },
                ticks: {
                    color: '#e2e8f0',
                    font: {
                        size: 12,
                        family: 'Inter, system-ui, sans-serif',
                    },
                },
            },
        },
    };
    return (_jsx("div", { className: "fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur", onClick: onClose, children: _jsxs("div", { className: "relative flex h-[90vh] w-full max-w-7xl flex-col overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/95 shadow-[0_40px_120px_rgba(15,23,42,0.6)]", onClick: function (e) { return e.stopPropagation(); }, children: [_jsxs("header", { className: "flex items-center justify-between border-b border-slate-800/80 px-8 py-6", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.35em] text-brand-300/80", children: "Range insights" }), _jsx("h2", { className: "mt-2 text-2xl font-semibold text-slate-50", children: "Multi-month spending trends & analysis" })] }), _jsx("button", { type: "button", onClick: onClose, className: "inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700/70 text-lg text-slate-300 transition hover:border-slate-500 hover:text-slate-100", "aria-label": "Close range insights modal", children: "\u00D7" })] }), _jsxs("div", { className: "flex-1 overflow-y-auto px-8 pb-8 pt-6", children: [_jsxs("div", { className: "mb-6 flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4", children: [_jsxs("label", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-sm font-medium text-slate-300", children: "From" }), _jsxs("select", { value: startMonth, onChange: function (e) { return handleStartMonthChange(e.target.value); }, className: "rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30", children: [_jsx("option", { value: "", children: "Select month" }), Array.from({ length: 24 }, function (_, i) {
                                                    var date = new Date();
                                                    date.setMonth(date.getMonth() - (23 - i));
                                                    var value = date.toISOString().slice(0, 7);
                                                    var label = date.toLocaleDateString(undefined, { year: 'numeric', month: 'long' });
                                                    return (_jsx("option", { value: value, children: label }, value));
                                                })] })] }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-sm font-medium text-slate-300", children: "To" }), _jsxs("select", { value: endMonth, onChange: function (e) { return handleEndMonthChange(e.target.value); }, className: "rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30", children: [_jsx("option", { value: "", children: "Select month" }), Array.from({ length: 24 }, function (_, i) {
                                                    var date = new Date();
                                                    date.setMonth(date.getMonth() - (23 - i));
                                                    var value = date.toISOString().slice(0, 7);
                                                    var label = date.toLocaleDateString(undefined, { year: 'numeric', month: 'long' });
                                                    return (_jsx("option", { value: value, children: label }, value));
                                                })] })] }), _jsx("button", { onClick: fetchRangeData, disabled: loading || !startMonth || !endMonth || invalidRange, className: "rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:bg-brand-500/40", children: loading ? 'Loading...' : 'Analyze range' })] }), invalidRange && (_jsx("div", { className: "mb-4 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-xs text-amber-200", children: "End month must be the same as or after the start month." })), error && (_jsx("div", { className: "mb-6 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200", children: error })), rangeData && rangeData.monthly_trend.length === 0 && (_jsx("div", { className: "flex flex-col items-center justify-center py-12", children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-lg font-semibold text-slate-300", children: "No data found for this period" }), _jsxs("p", { className: "mt-2 text-sm text-slate-400", children: ["There are no transactions between ", rangeData.start_date, " and ", rangeData.end_date, "."] }), _jsx("p", { className: "mt-4 text-sm text-slate-400", children: "Try selecting a different date range or add some transactions first." })] }) })), rangeData && rangeData.monthly_trend.length > 0 && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [_jsxs("div", { className: "rounded-xl border border-slate-800 bg-slate-900/60 p-4", children: [_jsx("p", { className: "text-xs uppercase tracking-[0.2em] text-slate-400", children: "Total income" }), _jsx("p", { className: "mt-2 text-2xl font-bold text-emerald-400", children: formatCurrency(rangeData.total_income) })] }), _jsxs("div", { className: "rounded-xl border border-slate-800 bg-slate-900/60 p-4", children: [_jsx("p", { className: "text-xs uppercase tracking-[0.2em] text-slate-400", children: "Total expenses" }), _jsx("p", { className: "mt-2 text-2xl font-bold text-rose-400", children: formatCurrency(rangeData.total_expenses) })] }), _jsxs("div", { className: "rounded-xl border border-slate-800 bg-slate-900/60 p-4", children: [_jsx("p", { className: "text-xs uppercase tracking-[0.2em] text-slate-400", children: "Net savings" }), _jsx("p", { className: "mt-2 text-2xl font-bold ".concat(rangeData.net_savings >= 0 ? 'text-emerald-400' : 'text-rose-400'), children: formatCurrency(rangeData.net_savings) })] })] }), _jsxs("div", { className: "rounded-xl border border-slate-800 bg-slate-900/60 p-6", children: [_jsx("h3", { className: "mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-300", children: "Income vs Expenses trend" }), _jsx("div", { style: { height: '320px' }, children: trendChartData && _jsx(Line, { data: trendChartData, options: trendChartOptions }) })] }), _jsxs("div", { className: "rounded-xl border border-slate-800 bg-slate-900/60 p-6", children: [_jsx("h3", { className: "mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-300", children: "Category breakdown" }), _jsx("div", { style: { height: '400px' }, children: categoryChartData && (_jsx(Bar, { data: categoryChartData, options: categoryChartOptions })) })] })] })), !rangeData && !loading && !error && (_jsx("div", { className: "flex h-64 items-center justify-center", children: _jsx("p", { className: "text-sm text-slate-400", children: "Select a date range and click \"Analyze range\" to view insights" }) }))] })] }) }));
};
export default RangeInsightsModal;
