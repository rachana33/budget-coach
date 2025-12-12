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
export var formatCurrency = function (value, currency, options) {
    if (currency === void 0) { currency = 'USD'; }
    if (options === void 0) { options = {}; }
    return new Intl.NumberFormat('en-US', __assign({ style: 'currency', currency: currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }, options)).format(value);
};
export var formatNumber = function (value, fractionDigits) {
    if (fractionDigits === void 0) { fractionDigits = 0; }
    return new Intl.NumberFormat('en-US', {
        maximumFractionDigits: fractionDigits,
    }).format(value);
};
