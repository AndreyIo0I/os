"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToMoore = void 0;
const utils_1 = require("./utils");
const STATE_VALUE_SEPARATOR = '#';
function convertToMoore(automaton) {
    const outdatedStates = new Set();
    const newStates = new Set();
    automaton.Q.forEach(q => {
        automaton.X.forEach(x => {
            outdatedStates.add(automaton.fn[q][x][0].q);
            const newState = automaton.fn[q][x][0].q + STATE_VALUE_SEPARATOR + automaton.fn[q][x][0].y;
            automaton.fn[q][x][0].q = newState;
            newStates.add(newState);
        });
    });
    newStates.forEach(q => {
        automaton.fn[q] = (0, utils_1.deepCopy)(automaton.fn[q.split(STATE_VALUE_SEPARATOR)[0]]);
    });
    outdatedStates.forEach(q => delete automaton.fn[q]);
    automaton.Q = Object.keys(automaton.fn);
}
exports.convertToMoore = convertToMoore;
