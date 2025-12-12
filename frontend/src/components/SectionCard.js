import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import clsx from 'clsx';
var SectionCard = function (_a) {
    var title = _a.title, subtitle = _a.subtitle, actions = _a.actions, children = _a.children, className = _a.className;
    return (_jsxs("section", { className: clsx('rounded-2xl border border-slate-800/80 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/40 backdrop-blur', className), children: [(title || subtitle || actions) && (_jsxs("header", { className: "mb-4 flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between", children: [_jsxs("div", { children: [typeof title === 'string' ? (_jsx("h2", { className: "text-lg font-semibold text-slate-50", children: title })) : (title), subtitle && (_jsx("p", { className: "mt-1 text-sm text-slate-400", children: subtitle }))] }), actions && _jsx("div", { className: "flex items-center gap-2", children: actions })] })), _jsx("div", { className: "space-y-4 lg:space-y-6", children: children })] }));
};
export default SectionCard;
