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
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, } from 'chart.js';
import SectionCard from './SectionCard';
import StatsCard from './StatsCard';
import { formatCurrency, formatNumber } from '../utils/format';
import { normalizeCategoryKey } from '../utils/categories';
var COLORS = ['#4c6ef5', '#4263eb', '#364fc7', '#748ffc', '#5c7cfa', '#3b5bdb'];
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);
var Dashboard = function (_a) {
    var _b;
    var monthLabel = _a.monthLabel, month = _a.month, overview = _a.overview, microHabits = _a.microHabits, transactions = _a.transactions, _c = _a.limits, limits = _c === void 0 ? {} : _c, coach = _a.coach, _d = _a.loadingCoach, loadingCoach = _d === void 0 ? false : _d, onRangeChange = _a.onRangeChange, onMonthChange = _a.onMonthChange, onAddAccount = _a.onAddAccount, onAddRecurring = _a.onAddRecurring, onAddTransaction = _a.onAddTransaction, onManageLimits = _a.onManageLimits, onManageGoals = _a.onManageGoals, onViewTrends = _a.onViewTrends, onToggleCoach = _a.onToggleCoach, _e = _a.coachVisible, coachVisible = _e === void 0 ? false : _e;
    var _f = useState(false), rangeMode = _f[0], setRangeMode = _f[1];
    var _g = useState(''), startMonth = _g[0], setStartMonth = _g[1];
    var _h = useState(''), endMonth = _h[0], setEndMonth = _h[1];
    var categoryData = useMemo(function () {
        if (!overview)
            return [];
        return Object.entries(overview.category_breakdown).map(function (_a) {
            var category = _a[0], value = _a[1];
            return ({
                category: category,
                value: value,
                key: normalizeCategoryKey(category),
            });
        });
    }, [overview]);
    var categorySeries = useMemo(function () {
        return categoryData
            .map(function (item) {
            var _a;
            var limitEntry = limits[item.key];
            var limit = (_a = limitEntry === null || limitEntry === void 0 ? void 0 : limitEntry.amount) !== null && _a !== void 0 ? _a : null;
            var overLimit = limit !== null && item.value > limit;
            return __assign(__assign({}, item), { limit: limit, overLimit: overLimit });
        })
            .sort(function (a, b) { return b.value - a.value; });
    }, [categoryData, limits]);
    var categoryChartData = useMemo(function () {
        return {
            labels: categorySeries.map(function (item) { return item.category; }),
            datasets: [
                {
                    label: 'Spending',
                    data: categorySeries.map(function (item) { return item.value; }),
                    borderRadius: {
                        topLeft: 16,
                        topRight: 16,
                        bottomLeft: 4,
                        bottomRight: 4,
                    },
                    borderSkipped: false,
                    barPercentage: 0.75,
                    categoryPercentage: 0.85,
                    backgroundColor: categorySeries.map(function (item, index) {
                        return item.overLimit ? '#f87171' : COLORS[index % COLORS.length];
                    }),
                    hoverBackgroundColor: categorySeries.map(function (item, index) {
                        return item.overLimit ? '#fca5a5' : COLORS[index % COLORS.length];
                    }),
                    borderWidth: 0,
                },
            ],
        };
    }, [categorySeries]);
    var categoryLimitPlugin = useMemo(function () { return ({
        id: 'categoryLimitLabels',
        afterDatasetsDraw: function (chart) {
            var ctx = chart.ctx;
            var dataset = chart.data.datasets[0];
            if (!dataset)
                return;
            var meta = chart.getDatasetMeta(0);
            ctx.save();
            meta.data.forEach(function (barElement, index) {
                var _a, _b;
                var rawValue = dataset.data[index];
                if (rawValue == null)
                    return;
                var dataValue = Array.isArray(rawValue) ? rawValue[0] : Number(rawValue);
                var valueLabel = formatCurrency(dataValue);
                var entry = categorySeries[index];
                var limit = (_a = entry === null || entry === void 0 ? void 0 : entry.limit) !== null && _a !== void 0 ? _a : null;
                var overLimit = (_b = entry === null || entry === void 0 ? void 0 : entry.overLimit) !== null && _b !== void 0 ? _b : false;
                var props = barElement.getProps(['x', 'y', 'base', 'height'], true);
                var base = Number(props.base);
                var x = Number(props.x);
                var y = Number(props.y);
                var height = Number(props.height);
                var isZero = dataValue === 0;
                var textY = isZero ? base - 12 : y - 12;
                ctx.textBaseline = 'middle';
                ctx.textAlign = 'center';
                ctx.font = '600 12px "Inter", system-ui';
                ctx.fillStyle = '#f8fafc';
                ctx.fillText(valueLabel, x, textY);
                if (limit !== null) {
                    ctx.font = '500 11px "Inter", system-ui';
                    ctx.fillStyle = overLimit ? '#f87171' : '#94a3b8';
                    ctx.fillText("".concat(overLimit ? 'Over' : 'Limit', " ").concat(formatCurrency(limit)), x, textY - 16);
                }
            });
            ctx.restore();
        },
    }); }, [categorySeries]);
    var categoryChartOptions = useMemo(function () { return ({
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'x',
        animation: {
            duration: 800,
            easing: 'easeInOutQuart',
            delay: function (context) {
                var delay = 0;
                if (context.type === 'data' && context.mode === 'default') {
                    delay = context.dataIndex * 80;
                }
                return delay;
            },
        },
        layout: {
            padding: {
                right: 16,
                left: 16,
                top: 48,
                bottom: 8,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                    drawBorder: false,
                },
                ticks: {
                    color: '#e2e8f0',
                    font: {
                        size: 13,
                        family: 'Inter, system-ui, sans-serif',
                    },
                    padding: 8,
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(148, 163, 184, 0.15)',
                    drawBorder: false,
                    lineWidth: 1,
                },
                border: {
                    display: false,
                },
                ticks: {
                    color: '#94a3b8',
                    callback: function (value) { return "$".concat(formatNumber(Number(value))); },
                    font: {
                        size: 11,
                        family: 'Inter, system-ui, sans-serif',
                    },
                    padding: 12,
                },
            },
        },
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                borderColor: 'rgba(148, 163, 184, 0.3)',
                borderWidth: 1,
                padding: 14,
                cornerRadius: 8,
                titleFont: {
                    size: 13,
                    family: 'Inter, system-ui, sans-serif',
                },
                bodyFont: {
                    size: 12,
                    family: 'Inter, system-ui, sans-serif',
                },
                titleColor: '#f8fafc',
                bodyColor: '#e2e8f0',
                displayColors: true,
                boxWidth: 12,
                boxHeight: 12,
                boxPadding: 6,
                callbacks: {
                    label: function (context) {
                        var _a, _b;
                        var limit = (_b = (_a = categorySeries[context.dataIndex]) === null || _a === void 0 ? void 0 : _a.limit) !== null && _b !== void 0 ? _b : null;
                        var parts = ["Spent: ".concat(formatCurrency(Number(context.parsed.y)))];
                        if (limit !== null) {
                            parts.push("Limit: ".concat(formatCurrency(limit)));
                            var remaining = limit - Number(context.parsed.y);
                            if (remaining < 0) {
                                parts.push("\u26A0\uFE0F Over by ".concat(formatCurrency(Math.abs(remaining))));
                            }
                            else {
                                parts.push("\u2713 ".concat(formatCurrency(remaining), " remaining"));
                            }
                        }
                        return parts;
                    },
                },
            },
        },
    }); }, [categorySeries]);
    var categoryLimitStatus = useMemo(function () {
        if (!overview)
            return [];
        return Object.entries(limits).map(function (_a) {
            var _b;
            var key = _a[0], limit = _a[1];
            var spent = (_b = overview.category_breakdown[limit.label]) !== null && _b !== void 0 ? _b : 0;
            var delta = spent - limit.amount;
            return {
                key: key,
                label: limit.label,
                limit: limit.amount,
                spent: spent,
                delta: delta,
                isOver: delta > 0,
            };
        });
    }, [limits, overview]);
    var microHabitItems = (_b = microHabits === null || microHabits === void 0 ? void 0 : microHabits.micro_habits) !== null && _b !== void 0 ? _b : [];
    var handleApplyRange = function () {
        if (onRangeChange && startMonth && endMonth) {
            onRangeChange(startMonth, endMonth);
        }
    };
    return (_jsxs("div", { className: "flex flex-col gap-6", children: [onRangeChange && (_jsx("div", { className: "rounded-xl border border-slate-800 bg-slate-900/60 p-4", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: rangeMode, onChange: function (e) { return setRangeMode(e.target.checked); }, className: "rounded border-slate-700 bg-slate-900 text-brand-500 focus:ring-2 focus:ring-brand-500/30" }), _jsx("span", { className: "text-sm font-medium text-slate-300", children: "Multi-month insights" })] }), rangeMode && (_jsxs(_Fragment, { children: [_jsxs("label", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-xs text-slate-400", children: "From" }), _jsx("input", { type: "month", value: startMonth, onChange: function (e) { return setStartMonth(e.target.value); }, className: "rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30" })] }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-xs text-slate-400", children: "To" }), _jsx("input", { type: "month", value: endMonth, onChange: function (e) { return setEndMonth(e.target.value); }, className: "rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30" })] }), _jsx("button", { onClick: handleApplyRange, disabled: !startMonth || !endMonth, className: "rounded-md bg-brand-500 px-3 py-1 text-xs font-semibold text-white transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:bg-brand-500/40", children: "Apply range" })] }))] }) })), _jsxs("div", { className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4", children: [_jsx(StatsCard, { label: "Monthly income", value: overview ? formatCurrency(overview.income) : '—', sublabel: "Expected inflow for ".concat(monthLabel) }), _jsx(StatsCard, { label: "Total spend", value: overview ? formatCurrency(overview.expenses) : '—', intent: "negative", sublabel: "Includes fixed + variable" }), _jsx(StatsCard, { label: "Fixed commitments", value: overview ? formatCurrency(overview.fixed_expenses) : '—', sublabel: "Recurring + EMIs" }), _jsx(StatsCard, { label: "Savings potential", value: overview ? formatCurrency(overview.savings) : '—', intent: overview && overview.savings >= 0 ? 'positive' : 'negative', sublabel: "Income minus expenses" })] }), _jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("label", { className: "text-sm font-medium text-slate-300", children: "Focus month" }), onMonthChange && (_jsx("select", { value: month, onChange: function (e) { return onMonthChange(e.target.value); }, className: "rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30", children: Array.from({ length: 24 }, function (_, i) {
                                    var date = new Date();
                                    date.setMonth(date.getMonth() - (23 - i));
                                    var value = date.toISOString().slice(0, 7);
                                    var label = date.toLocaleDateString(undefined, { year: 'numeric', month: 'long' });
                                    return (_jsx("option", { value: value, children: label }, value));
                                }) }))] }), _jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [onAddAccount && (_jsx("button", { onClick: onAddAccount, className: "rounded-md border border-emerald-500/60 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/20", children: "\uFF0B Account" })), onAddRecurring && (_jsx("button", { onClick: onAddRecurring, className: "rounded-md border border-amber-500/60 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-200 transition hover:bg-amber-500/20", children: "\uFF0B Recurring" })), onAddTransaction && (_jsx("button", { onClick: onAddTransaction, className: "rounded-md border border-brand-500/60 bg-brand-500/10 px-3 py-1.5 text-xs font-semibold text-brand-200 transition hover:bg-brand-500/20", children: "\uFF0B Transaction" })), onManageLimits && (_jsx("button", { onClick: onManageLimits, className: "rounded-md border border-rose-500/60 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-200 transition hover:bg-rose-500/20", children: "Category Limits" })), onManageGoals && (_jsx("button", { onClick: onManageGoals, className: "rounded-md border border-purple-500/60 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-200 transition hover:bg-purple-500/20", children: "Financial Goals" })), onViewTrends && (_jsx("button", { onClick: onViewTrends, className: "rounded-md border border-cyan-500/60 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-500/20", children: "\uD83D\uDCC8 View Trends" }))] })] }), _jsx(SectionCard, { title: "Spending distribution", subtitle: "What ".concat(monthLabel, " looks like by category"), children: overview ? (_jsx("div", { className: "w-full", style: { height: '420px' }, children: categorySeries.length === 0 ? (_jsx("p", { className: "text-sm text-slate-400", children: "Add transactions to see category level breakdown." })) : (_jsx(Bar, { data: categoryChartData, options: categoryChartOptions, plugins: [categoryLimitPlugin] })) })) : (_jsx("p", { className: "text-sm text-slate-400", children: "Loading overview\u2026" })) }), onToggleCoach && (_jsx("div", { className: "flex justify-center", children: _jsx("button", { onClick: onToggleCoach, className: "rounded-lg border border-brand-500/60 bg-brand-500/10 px-6 py-3 text-sm font-semibold text-brand-200 transition hover:bg-brand-500/20", children: coachVisible ? '✕ Hide AI Coach' : '✨ Show AI Coach' }) })), coachVisible && (_jsx(SectionCard, { title: "AI Coach Insights", subtitle: "Personalized guidance for ".concat(monthLabel), children: loadingCoach ? (_jsx("div", { className: "flex items-center justify-center py-8", children: _jsx("div", { className: "text-sm text-slate-400", children: "Analyzing your finances..." }) })) : coach ? (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "rounded-xl border border-slate-800/70 bg-slate-900/60 p-6", children: [_jsx("h3", { className: "text-sm font-semibold uppercase tracking-[0.2em] text-slate-300", children: "Summary" }), _jsx("p", { className: "mt-3 text-sm leading-relaxed text-slate-200", children: coach.summary })] }), coach.insights && coach.insights.length > 0 && (_jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-sm font-semibold uppercase tracking-[0.2em] text-slate-300", children: "Key Insights" }), coach.insights.map(function (insight, idx) { return (_jsxs("div", { className: "rounded-xl border border-slate-800/70 bg-slate-900/60 p-4", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsx("h4", { className: "text-sm font-semibold text-slate-100", children: insight.title }), insight.estimated_monthly_savings && (_jsxs("span", { className: "rounded bg-emerald-500/20 px-2 py-1 text-xs font-semibold text-emerald-300", children: ["Save $", insight.estimated_monthly_savings.toFixed(0), "/mo"] }))] }), _jsx("p", { className: "mt-2 text-sm text-slate-300", children: insight.detail })] }, idx)); })] })), coach.action_items && coach.action_items.length > 0 && (_jsxs("div", { className: "space-y-3", children: [_jsx("h3", { className: "text-sm font-semibold uppercase tracking-[0.2em] text-slate-300", children: "Action Items" }), _jsx("ul", { className: "space-y-2", children: coach.action_items.map(function (item, idx) { return (_jsxs("li", { className: "flex items-start gap-3 text-sm text-slate-300", children: [_jsx("span", { className: "mt-0.5 text-brand-400", children: "\u2022" }), _jsx("span", { children: item })] }, idx)); }) })] }))] })) : (_jsx("p", { className: "text-sm text-slate-400", children: "Click the button above to get AI-powered insights." })) })), categoryLimitStatus.length > 0 && (_jsx(SectionCard, { title: "Category limits watchlist", subtitle: "Compare your actual spend with the limits you've set", children: _jsx("div", { className: "grid gap-3 md:grid-cols-2", children: categoryLimitStatus.map(function (item) { return (_jsxs("div", { className: "rounded-xl border px-4 py-3 ".concat(item.isOver
                            ? 'border-rose-500/50 bg-rose-500/10'
                            : 'border-slate-800/70 bg-slate-900/60'), children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("p", { className: "text-sm font-semibold text-slate-100", children: item.label }), _jsx("span", { className: "text-xs font-semibold uppercase tracking-[0.25em] ".concat(item.isOver ? 'text-rose-300' : 'text-emerald-300'), children: item.isOver ? 'Over' : 'On track' })] }), _jsxs("div", { className: "mt-3 flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-slate-400", children: "Spent" }), _jsx("span", { className: item.isOver ? 'text-rose-300' : 'text-slate-100', children: formatCurrency(item.spent) })] }), _jsxs("div", { className: "mt-1 flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-slate-400", children: "Limit" }), _jsx("span", { className: "text-slate-100", children: formatCurrency(item.limit) })] }), _jsx("div", { className: "mt-3 text-xs text-slate-400", children: item.isOver ? (_jsxs("span", { children: ["Over by ", _jsx("span", { className: "font-semibold text-rose-300", children: formatCurrency(item.delta) })] })) : (_jsxs("span", { children: [formatCurrency(Math.abs(item.delta)), " remaining this month."] })) })] }, item.key)); }) }) })), _jsx(SectionCard, { title: "Micro habit leaks", subtitle: "Places to trim without feeling deprived", children: microHabitItems.length === 0 ? (_jsx("p", { className: "text-sm text-slate-400", children: "No micro habits detected yet. Log more day-to-day purchases to help the coach identify patterns." })) : (_jsx("div", { className: "grid gap-4 xl:grid-cols-2", children: microHabitItems.map(function (habit) { return (_jsxs("div", { className: "rounded-xl border border-slate-800/70 bg-slate-900/70 p-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-slate-100", children: habit.category }), _jsxs("p", { className: "mt-1 text-xs uppercase tracking-[0.2em] text-slate-400", children: [habit.transaction_count, " purchases \u00B7 avg ", formatCurrency(habit.average_amount)] })] }), _jsxs("span", { className: "rounded-md bg-brand-500/20 px-3 py-1 text-xs font-semibold text-brand-200", children: [habit.suggested_reduction_percent, "% trim"] })] }), _jsxs("div", { className: "mt-3 flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-slate-400", children: "Total spend" }), _jsx("span", { className: "font-medium text-slate-100", children: formatCurrency(habit.total_spent) })] }), _jsxs("div", { className: "mt-2 flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-slate-400", children: "Potential save" }), _jsx("span", { className: "font-medium text-emerald-400", children: formatCurrency(habit.estimated_savings) })] })] }, habit.category)); }) })) })] }));
};
export default Dashboard;
