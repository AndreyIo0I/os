"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hopcraftMinimization = exports.brzozowskiMinimization = void 0;
const reverse_1 = require("./reverse");
const determine_1 = require("./determine");
function hopcraftMinimization(automaton) {
    const QtoEquivalence = {};
    const equivalenceClasses = {};
    // определить классы эквивалентности
    automaton.Q.forEach(q => {
        let equivalence = '';
        automaton.X.forEach(x => {
            equivalence += automaton.fn[q][x][0].y;
        });
        QtoEquivalence[q] = equivalence;
        equivalenceClasses[equivalence] = [...equivalenceClasses[equivalence], q];
    });
    // разбить классы эквивалентности
    let newEquivalenceClasses = {};
    automaton.Q.forEach(q => {
        if (equivalenceClasses[QtoEquivalence[q]].length > 1) {
            let equivalence = '';
            automaton.X.forEach(x => {
                equivalence += automaton.fn[q][x][0].y;
            });
        }
    });
    return automaton;
}
exports.hopcraftMinimization = hopcraftMinimization;
function brzozowskiMinimization(automaton) {
    return (0, determine_1.determine)((0, reverse_1.reverse)((0, determine_1.determine)((0, reverse_1.reverse)(automaton))));
}
exports.brzozowskiMinimization = brzozowskiMinimization;
