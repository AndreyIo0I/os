"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMoore = exports.deepCopy = void 0;
function deepCopy(value) {
    return JSON.parse(JSON.stringify(value));
}
exports.deepCopy = deepCopy;
function isMoore(automaton) {
    for (const q of Object.keys(automaton.fn)) {
        let valueOfState;
        for (const x of Object.keys(automaton.fn[q])) {
            for (const transition of automaton.fn[q][x]) {
                if (valueOfState === undefined)
                    valueOfState = transition.y;
                if (valueOfState !== transition.y)
                    return false;
            }
        }
    }
    return true;
}
exports.isMoore = isMoore;
