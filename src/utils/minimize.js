"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hopcraftMinimization = exports.brzozowskiMinimization = void 0;
const reverse_1 = require("./reverse");
const determine_1 = require("./determine");
function equals(a, b, xArray) {
    let result = true;
    if (a.length !== b.length) {
        return false;
    }
    a.forEach((equivalence, index) => {
        xArray.forEach(x => {
            if (equivalence[0][x][0].y !== b[index][0][x][0].y) {
                result = false;
                return;
            }
        });
        if (!result) {
            return;
        }
    });
    return result;
}
function hopcraftMinimization(automaton) {
    let notMinimized = true;
    let equivalenceClasses = [];
    let lastEquivalenceClasses = [];
    while (notMinimized) {
        notMinimized = false;
        automaton.Q.forEach(q => {
            let equivalenceClassFound = false;
            for (const equivalenceClass of equivalenceClasses) {
                automaton.X.forEach(x => {
                    if (equivalenceClass[0][x][0].y === automaton.fn[q][x][0].y) {
                        equivalenceClassFound = true;
                        equivalenceClass[1].push(q);
                    }
                });
                if (equivalenceClassFound) {
                    break;
                }
            }
            if (!equivalenceClassFound) {
                equivalenceClasses.push([automaton.fn[q], [q]]);
            }
        });
        if (!equals(equivalenceClasses, lastEquivalenceClasses, automaton.X)) {
            lastEquivalenceClasses = equivalenceClasses;
            equivalenceClasses = [];
            notMinimized = true;
        }
    }
    console.log(equivalenceClasses);
    return automaton;
}
exports.hopcraftMinimization = hopcraftMinimization;
function brzozowskiMinimization(automaton) {
    return (0, determine_1.determine)((0, reverse_1.reverse)((0, determine_1.determine)((0, reverse_1.reverse)(automaton))));
}
exports.brzozowskiMinimization = brzozowskiMinimization;
