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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import SectionCard from './SectionCard';
import { formatCurrency } from '../utils/format';
import { normalizeCategoryKey } from '../utils/categories';
var TransactionListPanel = function (_a) {
    var transactions = _a.transactions, _b = _a.limits, limits = _b === void 0 ? {} : _b, _c = _a.goals, goals = _c === void 0 ? [] : _c, onUpdate = _a.onUpdate, onDelete = _a.onDelete;
    var goalMap = useMemo(function () {
        var map = new Map();
        goals.forEach(function (goal) { return map.set(goal.id, goal.title); });
        return map;
    }, [goals]);
    var _d = useState(null), editingId = _d[0], setEditingId = _d[1];
    var _e = useState(null), deleteConfirmId = _e[0], setDeleteConfirmId = _e[1];
    var _f = useState('all'), filterCategory = _f[0], setFilterCategory = _f[1];
    var categories = useMemo(function () {
        var set = new Set();
        transactions.forEach(function (tx) { return set.add(tx.category); });
        return __spreadArray(['all'], Array.from(set).sort(), true);
    }, [transactions]);
    var sortedTransactions = useMemo(function () {
        return __spreadArray([], transactions, true).sort(function (a, b) { return (a.date < b.date ? 1 : -1); });
    }, [transactions]);
    var groupedTransactions = useMemo(function () {
        var filtered = filterCategory === 'all'
            ? sortedTransactions
            : sortedTransactions.filter(function (tx) { return tx.category === filterCategory; });
        var grouped = new Map();
        filtered.forEach(function (tx) {
            var key = tx.category;
            if (!grouped.has(key)) {
                grouped.set(key, []);
            }
            grouped.get(key).push(tx);
        });
        return Array.from(grouped.entries())
            .map(function (_a) {
            var category = _a[0], txs = _a[1];
            return ({
                category: category,
                transactions: txs,
                total: txs.reduce(function (sum, tx) { return sum + Math.abs(tx.amount); }, 0),
            });
        })
            .sort(function (a, b) { return b.total - a.total; });
    }, [sortedTransactions, filterCategory]);
    var handleDelete = function (id) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!onDelete) return [3 /*break*/, 2];
                    return [4 /*yield*/, onDelete(id)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    setDeleteConfirmId(null);
                    return [2 /*return*/];
            }
        });
    }); };
    return (_jsx(SectionCard, { title: "All transactions", subtitle: "View, edit, and manage your transaction history by category", actions: _jsx("select", { value: filterCategory, onChange: function (e) { return setFilterCategory(e.target.value); }, className: "rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-100 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30", children: categories.map(function (cat) { return (_jsx("option", { value: cat, children: cat === 'all' ? 'All categories' : cat }, cat)); }) }), children: groupedTransactions.length === 0 ? (_jsx("p", { className: "text-sm text-slate-400", children: "No transactions found." })) : (_jsx("div", { className: "max-h-[600px] space-y-6 overflow-y-auto pr-2", children: groupedTransactions.map(function (_a) {
                var category = _a.category, txs = _a.transactions, total = _a.total;
                var categoryKey = normalizeCategoryKey(category);
                var limit = limits[categoryKey];
                var isOver = limit && total > limit.amount;
                return (_jsxs("div", { className: "space-y-3", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { children: [_jsx("h3", { className: "text-base font-semibold text-slate-100", children: category }), _jsxs("p", { className: "mt-0.5 text-xs text-slate-400", children: [txs.length, " transaction", txs.length !== 1 ? 's' : '', " \u00B7 Total", ' ', _jsx("span", { className: isOver ? 'font-semibold text-rose-300' : 'text-slate-300', children: formatCurrency(total) }), limit && (_jsxs("span", { className: "ml-2 text-slate-500", children: ["/ ", formatCurrency(limit.amount), " limit"] }))] })] }) }), _jsx("div", { className: "space-y-2", children: txs.map(function (tx) {
                                var isExpense = tx.amount < 0;
                                var isDeleting = deleteConfirmId === tx.id;
                                return (_jsxs("div", { className: "flex items-center justify-between rounded-lg border border-slate-800/70 bg-slate-900/60 px-4 py-3 text-sm", children: [_jsx("div", { className: "flex-1", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "text-xs text-slate-500", children: new Date(tx.date).toLocaleDateString() }), _jsx("span", { className: "text-slate-200", children: tx.description || '—' }), tx.goal_id && goalMap.has(tx.goal_id) && (_jsxs("span", { className: "rounded bg-purple-500/20 px-2 py-0.5 text-xs font-semibold text-purple-300", children: ["\uD83C\uDFAF ", goalMap.get(tx.goal_id)] })), tx.tags && (_jsx("span", { className: "rounded bg-slate-800/60 px-2 py-0.5 text-xs text-slate-400", children: tx.tags }))] }) }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("span", { className: "font-semibold ".concat(isExpense ? 'text-rose-400' : 'text-emerald-400'), children: formatCurrency(Math.abs(tx.amount)) }), onDelete && (_jsx("div", { className: "flex items-center gap-2", children: isDeleting ? (_jsxs(_Fragment, { children: [_jsx("button", { onClick: function () { return handleDelete(tx.id); }, className: "rounded border border-rose-500/60 px-2 py-1 text-xs text-rose-300 transition hover:bg-rose-500/20", children: "Confirm" }), _jsx("button", { onClick: function () { return setDeleteConfirmId(null); }, className: "rounded border border-slate-700 px-2 py-1 text-xs text-slate-300 transition hover:bg-slate-800", children: "Cancel" })] })) : (_jsx("button", { onClick: function () { return setDeleteConfirmId(tx.id); }, className: "rounded border border-slate-700 px-2 py-1 text-xs text-slate-400 transition hover:border-rose-400 hover:text-rose-300", children: "Delete" })) }))] })] }, tx.id));
                            }) })] }, category));
            }) })) }));
};
export default TransactionListPanel;
