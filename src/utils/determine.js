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
    const states = [...automaton.Q];
    while (states.length > 0) {
        const q = states.pop();
        automaton.X.forEach(x => {
            if (automaton.fn[q][x].length > 1) {
                automaton.fn[q][x].sort(sortTransitions);
                let newQ = automaton.fn[q][x].map(t => t.q).join('');
                let newY = automaton.fn[q][x].map(t => t.y).join('');
                if (!automaton.fn[newQ]) {
                    automaton.fn[newQ] = {};
                }
                automaton.X.forEach(x => {
                    automaton.fn[q][x].forEach(t => {
                        if (!automaton.fn[newQ][x]) {
                            automaton.fn[newQ][x] = [];
                        }
                        automaton.fn[t.q][x].forEach(t => {
                            if (newQ === 's1s2') {
                                console.log(t);
                            }
                            if (automaton.fn[newQ][x].every(v => v.q !== t.q && v.y !== t.y)) {
                                automaton.fn[newQ][x].push(t); // надо сортировать
                            }
                        });
                    });
                });
                if (!automaton.Q.includes(newQ)) {
                    automaton.Q.push(newQ);
                    automaton.Y.push(newY);
                    states.push(newQ);
                }
            }
        });
    }
    automaton.Q.forEach(q => {
        automaton.X.forEach(x => {
            automaton.fn[q][x] = [{
                    q: automaton.fn[q][x].map(t => t.q).join(''),
                    y: automaton.fn[q][x].map(t => t.y).join(''),
                }];
        });
    });
    return automaton;
}
exports.determine = determine;
