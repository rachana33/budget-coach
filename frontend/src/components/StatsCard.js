import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import clsx from 'clsx';
var intentClasses = {
    default: 'text-slate-200',
    positive: 'text-emerald-400',
    negative: 'text-rose-400',
};
var StatsCard = function (_a) {
    var label = _a.label, value = _a.value, sublabel = _a.sublabel, _b = _a.intent, intent = _b === void 0 ? 'default' : _b, className = _a.className;
    return (_jsxs("div", { className: clsx('rounded-xl border border-slate-800/70 bg-slate-900/80 p-4 shadow-inner shadow-slate-950/40', className), children: [_jsx("p", { className: "text-xs uppercase tracking-[0.2em] text-slate-400", children: label }), _jsx("p", { className: clsx('mt-2 text-2xl font-semibold', intentClasses[intent]), children: value }), sublabel && _jsx("p", { className: "mt-1 text-xs text-slate-400", children: sublabel })] }));
};
export default StatsCard;
