"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readAutomaton = void 0;
const fs = __importStar(require("fs"));
function getStates(rawData) {
    return [
        rawData.split(':')[0].trim(),
        rawData.split(':')[1].trim().split(/\s+/),
    ];
}
function readAutomaton(file) {
    const lines = fs.readFileSync(file, 'utf-8').trim().split(/(?:\r\n)+/);
    const automaton = {
        Q: [],
        X: [],
        Y: [],
        fn: {},
    };
    if (lines[0] === 'Mr') {
        automaton.Q = lines[1].trim().split(/\s+/);
        automaton.Y = lines[2].trim().split(/\s+/);
        for (let i = 3; i < lines.length; ++i) {
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
        automaton.Q = lines[1].trim().split(/\s+/);
        for (let i = 2; i <= lines.length - 1; i += 2) {
            const [x, newStates] = getStates(lines[i]);
            const outputSignals = lines[i + 1].trim().split(/\s+/);
            automaton.X.push(x);
            automaton.Q.forEach(q => {
                automaton.fn[q] = automaton.fn[q] || {};
                automaton.fn[q][x] = [];
                const transitionNewStates = newStates.shift().split(',');
                const transitionOutputSignals = outputSignals.shift().split(',');
                if (transitionNewStates.length !== transitionOutputSignals.length) {
                    throw Error(`Number of new states and signals doesn't match`);
                }
                for (let i = 0; i < transitionNewStates.length; ++i) {
                    automaton.fn[q][x].push({
                        q: transitionNewStates[i],
                        y: transitionOutputSignals[i],
                    });
                }
            });
            automaton.Y.push(...lines[i + 1].trim().split(/\s+/));
        }
    }
    automaton.Y = [...new Set(automaton.Y)];
    return automaton;
}
exports.readAutomaton = readAutomaton;
