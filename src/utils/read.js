"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readAutomaton = void 0;
const process = require('process');
const file = process.argv[2];
const fs = require('fs');
function getStates(rawData) {
    return [
        rawData.split(':')[0].trim(),
        rawData.split(':')[1].trim().split(/\s+/),
    ];
}
function readAutomaton() {
    const lines = fs.readFileSync(file, 'utf-8').trim().split(/(?:\r\n)+/);
    const automaton = {
        Q: [],
        X: [],
        Y: [],
        fn: {},
    };
    if (lines[0] === 'Mr') {
        automaton.Q = lines[4].trim().split(/\s+/);
        automaton.Y = lines[5].trim().split(/\s+/);
        for (let i = 6; i < lines.length; ++i) {
            const [x, newStates] = getStates(lines[i]);
            automaton.X.push(x);
            automaton.Q.forEach(q => {
                automaton.fn[q] = automaton.fn[q] || {};
                automaton.fn[q][x] = [];
                const newQ = newStates.shift();
                automaton.fn[q][x].push({
                    q: newQ,
                    y: automaton.Y[automaton.Q.indexOf(newQ)],
                });
            });
        }
    }
    else if (lines[0] === 'Ml') {
        automaton.Q = lines[4].trim().split(/\s+/);
        for (let i = 5; i <= lines.length - 1; i += 2) {
            const [x, newStates] = getStates(lines[i]);
            const outputSignals = lines[i + 1].trim().split(/\s+/);
            automaton.X.push(x);
            automaton.Q.forEach(q => {
                automaton.fn[q] = automaton.fn[q] || {};
                automaton.fn[q][x] = [];
                automaton.fn[q][x].push({
                    q: newStates.shift(),
                    y: outputSignals.shift(),
                });
            });
            automaton.Y.push(...lines[i + 1].trim().split(/\s+/));
        }
        automaton.Y = [...new Set(automaton.Y)];
    }
    return automaton;
}
exports.readAutomaton = readAutomaton;
