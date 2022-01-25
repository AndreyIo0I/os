"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reverse = void 0;
function reverse(automaton) {
    const newAutomaton = Object.assign({}, automaton);
    newAutomaton.fn = {};
    Object.keys(automaton.fn).forEach(q => {
        Object.keys(automaton.fn[q]).forEach(x => {
            //todo доработать для нка
            newAutomaton.fn[q][x].push(automaton.fn[automaton.fn[q][x][0].q][x][0]);
        });
    });
    return newAutomaton;
}
exports.reverse = reverse;
