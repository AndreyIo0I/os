"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.minimize = exports.brzozowskiMinimization = void 0;
const reverse_1 = require("./reverse");
const determine_1 = require("./determine");
const utils_1 = require("./utils");
function minimize(automaton) {
    let equivalences = {};
    let stateToEquivalence = {};
    automaton.Q.forEach(q => {
        const equivalence = automaton.X.map(x => automaton.fn[q][x][0].y).join(' ');
        if (!equivalences[equivalence]) {
            equivalences[equivalence] = [];
        }
        equivalences[equivalence].push(q);
        stateToEquivalence[q] = equivalence;
    });
    let smashed = true;
    while (smashed) {
        smashed = false;
        let newEquivalences = {};
        let newStateToEquivalence = {};
        for (const equivalenceName in equivalences) {
            const equivalence = equivalences[equivalenceName];
            equivalence.forEach(q => {
                const vectorOfEquivalences = automaton.X.map(x => stateToEquivalence[automaton.fn[q][x][0].q]);
                const newEquivalenceName = equivalenceName + '->' + vectorOfEquivalences.join(' ');
                if (!newEquivalences[newEquivalenceName]) {
                    newEquivalences[newEquivalenceName] = [];
                }
                newEquivalences[newEquivalenceName].push(q);
            });
        }
        if (Object.keys(newEquivalences).length !== Object.keys(equivalences).length) {
            smashed = true;
        }
        equivalences = (0, utils_1.deepCopy)(newEquivalences);
        newStateToEquivalence = (0, utils_1.deepCopy)(stateToEquivalence);
    }
    const duplicates = Object.keys(equivalences).flatMap(key => equivalences[key].slice(1));
    automaton.Q = automaton.Q.filter(v => !duplicates.includes(v));
    duplicates.forEach(duplicate => {
        delete automaton.fn[duplicate];
    });
    Object.keys(automaton.fn).forEach(q => {
        Object.keys(automaton.fn[q]).forEach(x => {
            if (duplicates.includes(automaton.fn[q][x][0].q)) {
                automaton.fn[q][x][0].q = equivalences[stateToEquivalence[automaton.fn[q][x][0].q]][0];
            }
        });
    });
    if (automaton.qs && duplicates.includes(automaton.qs)) {
        automaton.qs = equivalences[stateToEquivalence[automaton.qs]][0];
    }
}
exports.minimize = minimize;
function brzozowskiMinimization(automaton) {
    return (0, determine_1.determine)((0, reverse_1.reverse)((0, determine_1.determine)((0, reverse_1.reverse)(automaton))));
}
exports.brzozowskiMinimization = brzozowskiMinimization;
