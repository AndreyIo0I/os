"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.determine = void 0;
function determine(automaton) {
    var newAutomaton = __assign({}, automaton);
    automaton.Q.forEach(function (q) {
        automaton.X.forEach(function (x) {
            if (automaton.fn[q][x].length > 1) {
                //todo determine
            }
        });
    });
    return newAutomaton;
}
exports.determine = determine;
