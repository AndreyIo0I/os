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
exports.reverseAutomaton = void 0;
function reverseAutomaton(automaton) {
    var newAutomaton = __assign({}, automaton);
    newAutomaton.fn = {};
    automaton.Q.forEach(function (q) {
        automaton.X.forEach(function (x) {
            //todo доработать для нка
            newAutomaton.fn[q][x].push(automaton.fn[automaton.fn[q][x][0].q][x][0]);
        });
    });
    return newAutomaton;
}
exports.reverseAutomaton = reverseAutomaton;
