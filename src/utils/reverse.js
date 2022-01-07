"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reverse = void 0;
function reverse(automaton) {
    const newAutomaton = { ...automaton };
    newAutomaton.fn = {};
    automaton.Q.forEach(q => {
        automaton.X.forEach(x => {
            //todo доработать для нка
            newAutomaton.fn[q][x].push(automaton.fn[automaton.fn[q][x][0].q][x][0]);
        });
    });
    return newAutomaton;
}
exports.reverse = reverse;
