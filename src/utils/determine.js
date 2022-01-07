"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.determine = void 0;
function determine(automaton) {
    const newAutomaton = { ...automaton };
    automaton.Q.forEach(q => {
        automaton.X.forEach(x => {
            if (automaton.fn[q][x].length > 1) {
                //todo determine
            }
        });
    });
    return newAutomaton;
}
exports.determine = determine;
