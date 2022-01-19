"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMoore = exports.deepCopy = void 0;
function deepCopy(value) {
    return JSON.parse(JSON.stringify(value));
}
exports.deepCopy = deepCopy;
function isMoore(automaton) {
    const stateToValue = {};
    for (const q of automaton.Q) {
        for (const x of automaton.X) {
            for (const transition of automaton.fn[q][x] || []) {
                if (stateToValue[transition.q] && stateToValue[transition.q] !== transition.y) {
                    return false;
                }
                else {
                    stateToValue[transition.q] = transition.y;
                }
            }
        }
    }
    return true;
}
exports.isMoore = isMoore;
