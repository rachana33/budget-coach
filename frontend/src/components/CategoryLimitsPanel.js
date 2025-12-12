import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import SectionCard from './SectionCard';
import { formatCurrency } from '../utils/format';
var CategoryLimitsPanel = function (_a) {
    var categories = _a.categories, limits = _a.limits, onSaveLimit = _a.onSaveLimit, onRemoveLimit = _a.onRemoveLimit;
    var _b = useState(''), label = _b[0], setLabel = _b[1];
    var _c = useState(''), amount = _c[0], setAmount = _c[1];
    var sortedLimits = useMemo(function () {
        return Object.entries(limits).sort(function (_a, _b) {
            var a = _a[1];
            var b = _b[1];
            return a.label.localeCompare(b.label, undefined, { sensitivity: 'base' });
        });
    }, [limits]);
    var handleSubmit = function (event) {
        event.preventDefault();
        var trimmed = label.trim();
        if (!trimmed || amount === '' || amount < 0)
            return;
        onSaveLimit(trimmed, Number(amount));
        setLabel('');
        setAmount('');
    };
    return (_jsxs(SectionCard, { title: "Category limits", subtitle: "Set a ceiling for the categories you care about most", children: [_jsxs("form", { className: "grid gap-3", onSubmit: handleSubmit, children: [_jsxs("label", { className: "flex flex-col gap-1", children: [_jsx("span", { className: "text-xs font-semibold uppercase tracking-[0.25em] text-slate-400", children: "Category" }), _jsx("input", { list: "category-limit-suggestions", placeholder: "e.g., Dining Out", value: label, onChange: function (event) { return setLabel(event.target.value); }, className: "rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30", required: true }), _jsx("datalist", { id: "category-limit-suggestions", children: categories.map(function (category) { return (_jsx("option", { value: category }, category)); }) })] }), _jsxs("label", { className: "flex flex-col gap-1", children: [_jsx("span", { className: "text-xs font-semibold uppercase tracking-[0.25em] text-slate-400", children: "Monthly limit (USD)" }), _jsx("input", { type: "number", min: 0, step: "0.01", value: amount, onChange: function (event) { return setAmount(event.target.value === '' ? '' : Number(event.target.value)); }, className: "rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30", required: true })] }), _jsx("div", { className: "flex justify-end", children: _jsx("button", { type: "submit", className: "rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-400", children: "Save limit" }) })] }), sortedLimits.length > 0 && (_jsx("div", { className: "mt-4 space-y-2", children: sortedLimits.map(function (_a) {
                    var key = _a[0], limit = _a[1];
                    return (_jsxs("div", { className: "flex items-center justify-between rounded-lg border border-slate-800/80 bg-slate-900/60 px-3 py-2 text-sm text-slate-200", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-slate-100", children: limit.label }), _jsxs("p", { className: "text-xs uppercase tracking-[0.2em] text-slate-400", children: ["Limit ", formatCurrency(limit.amount)] })] }), _jsx("button", { type: "button", onClick: function () { return onRemoveLimit(key); }, className: "rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-300 transition hover:border-rose-400 hover:text-rose-300", children: "Remove" })] }, key));
                }) }))] }));
};
export default CategoryLimitsPanel;
