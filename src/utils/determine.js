"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.determine = void 0;
const utils_1 = require("./utils");
function sortTransitions(a, b) {
    if (a.q > b.q) {
        return 1;
    }
    if (a.q < b.q) {
        return -1;
    }
    return 0;
}
function determine(originalAutomaton) {
    const automaton = (0, utils_1.deepCopy)(originalAutomaton);
    const states = [...Object.keys(automaton.fn)];
    while (states.length > 0) {
        const q = states.pop();
        Object.keys(automaton.fn[q]).forEach(x => {
            if (automaton.fn[q][x].length > 1) {
                automaton.fn[q][x].sort(sortTransitions);
                let newQ = automaton.fn[q][x].map(t => t.q).join('');
                if (!automaton.fn[newQ]) {
                    automaton.fn[newQ] = {};
                    states.push(newQ);
                }
                Object.keys(automaton.fn[q]).forEach(x => {
                    automaton.fn[q][x].forEach(t => {
                        if (!automaton.fn[newQ][x]) {
                            automaton.fn[newQ][x] = [];
                        }
                        automaton.fn[t.q][x].forEach(innerT => {
                            if (automaton.fn[newQ][x].every(v => v.q !== innerT.q && v.y !== innerT.y)) {
                                automaton.fn[newQ][x].push(innerT);
                                automaton.fn[newQ][x].sort(sortTransitions);
                            }
                        });
                    });
                });
            }
        });
    }
    Object.keys(automaton.fn).forEach(q => {
        Object.keys(automaton.fn[q]).forEach(x => {
            automaton.fn[q][x] = [{
                    q: automaton.fn[q][x].map(t => t.q).join(''),
                    y: automaton.fn[q][x].map(t => t.y).join(''),
                }];
        });
    });
    return automaton;
}
exports.determine = determine;
