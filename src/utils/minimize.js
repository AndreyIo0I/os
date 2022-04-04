"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeDisconnectedNodes = exports.minimize = exports.brzozowskiMinimization = void 0;
const reverse_1 = require("./reverse");
const determine_1 = require("./determine");
const utils_1 = require("./utils");
const server_1 = require("./server");
function removeDisconnectedNodes(automaton) {
    if (!automaton.qs) {
        return;
    }
    const stack = [automaton.qs];
    const visited = new Set(stack);
    while (stack.length) {
        const head = stack.pop();
        Object.keys(automaton.fn[head]).forEach(x => {
            automaton.fn[head][x].forEach(t => {
                if (!visited.has(t.q)) {
                    visited.add(t.q);
                    stack.push(t.q);
                }
            });
        });
    }
    Object.keys(automaton.fn).forEach(q => {
        if (!visited.has(q)) {
            delete automaton.fn[q];
        }
    });
    (0, server_1.addToVisualize)(automaton, 'remove disconnected nodes');
}
exports.removeDisconnectedNodes = removeDisconnectedNodes;
//автомат должен быть уже детерминизирован
function minimize(automaton) {
    removeDisconnectedNodes(automaton);
    let equivalences = {};
    let stateToEquivalence = {};
    //разбиваем на 0-эквивалентности, склеивая выходные значения
    Object.keys(automaton.fn).forEach(q => {
        const equivalence = Object.keys(automaton.fn[q]).map(x => x + automaton.fn[q][x][0].y).join(' ');
        if (!equivalences[equivalence])
            equivalences[equivalence] = [];
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
                const vectorOfEquivalences = Object.keys(automaton.fn[q]).map(x => stateToEquivalence[automaton.fn[q][x][0].q]);
                const newEquivalenceName = equivalenceName + '->' + vectorOfEquivalences.join(' ');
                if (!newEquivalences[newEquivalenceName]) {
                    newEquivalences[newEquivalenceName] = [];
                }
                newEquivalences[newEquivalenceName].push(q);
                newStateToEquivalence[q] = newEquivalenceName;
            });
        }
        if (Object.keys(newEquivalences).length !== Object.keys(equivalences).length) {
            smashed = true;
        }
        equivalences = (0, utils_1.deepCopy)(newEquivalences);
        stateToEquivalence = (0, utils_1.deepCopy)(newStateToEquivalence);
    }
    const duplicates = Object.keys(equivalences).flatMap(key => equivalences[key].slice(1));
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
    (0, server_1.addToVisualize)(automaton, 'minimize');
}
exports.minimize = minimize;
function brzozowskiMinimization(automaton) {
    return (0, determine_1.determine)((0, reverse_1.reverse)((0, determine_1.determine)((0, reverse_1.reverse)(automaton))));
}
exports.brzozowskiMinimization = brzozowskiMinimization;
