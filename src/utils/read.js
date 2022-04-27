"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
exports.readRightRegularGrammar = exports.readAutomaton = void 0;
const fs = __importStar(require("fs"));
const server_1 = require("./server");
const print_1 = require("./print");
function getStates(rawData) {
    return [
        rawData.split(':')[0].trim(),
        rawData.split(':')[1].trim().split(/\s+/),
    ];
}
function readAutomaton(file) {
    const lines = fs.readFileSync(file, 'utf-8').trim().split(/(?:\r\n)+/);
    const automaton = {
        fn: {},
    };
    if (lines[0] === 'Mr') {
        const states = lines[1].trim().split(/\s+/);
        const outputs = lines[2].trim().split(/\s+/);
        for (let i = 3; i < lines.length; ++i) {
            const [x, newStates] = getStates(lines[i]);
            for (let j = 0; j < states.length; ++j) {
                const q = states[j];
                const y = outputs[j];
                automaton.fn[q] = automaton.fn[q] || {};
                automaton.fn[q][x] = [];
                const newQ = newStates.shift();
                if (!states.includes(newQ))
                    automaton.fn[newQ] = {};
                automaton.fn[q][x].push({
                    q: newQ,
                    y: y,
                });
            }
        }
    }
    else if (lines[0] === 'Ml') {
        const states = lines[1].trim().split(/\s+/);
        for (let i = 2; i <= lines.length - 1; i += 2) {
            const [x, newStates] = getStates(lines[i]);
            const outputSignals = lines[i + 1].trim().split(/\s+/);
            states.forEach(q => {
                automaton.fn[q] = automaton.fn[q] || {};
                automaton.fn[q][x] = [];
                const transitionNewStates = newStates.shift().split(',');
                const transitionOutputSignals = outputSignals.shift().split(',');
                if (transitionNewStates.length !== transitionOutputSignals.length) {
                    throw Error(`Number of new states and signals doesn't match`);
                }
                for (let i = 0; i < transitionNewStates.length; ++i) {
                    if (!automaton.fn[transitionNewStates[i]])
                        automaton.fn[transitionNewStates[i]] = {};
                    automaton.fn[q][x].push({
                        q: transitionNewStates[i],
                        y: transitionOutputSignals[i],
                    });
                }
            });
        }
    }
    (0, server_1.addToVisualize)(automaton, 'read from file');
    console.log('==========read==========');
    (0, print_1.printAutomaton)(automaton);
    return automaton;
}
exports.readAutomaton = readAutomaton;
function readRightRegularGrammar(file) {
    const lines = fs.readFileSync(file, 'utf-8').trim().split(/(?:\r\n)+/);
    const leftRegular = lines.shift() === 'L';
    const automaton = {
        fn: {},
        qs: lines[0][0],
    };
    let endStateCount = 0;
    function createNewState(base) {
        const newStateName = base + (endStateCount ? endStateCount : '');
        ++endStateCount;
        automaton.fn[newStateName] = {};
        return newStateName;
    }
    lines.forEach(line => {
        const state = line[0];
        const transitions = line.substring(5).trim().split(/\s*\|\s*/);
        if (leftRegular) {
            transitions.forEach(t => {
                const x = t.length == 2 ? t[1] : t[0];
                const q = t.length == 2 ? t[0] : '_S';
                if (t.length == 1 && automaton.qs === state)
                    automaton.qs = q;
                if (!automaton.fn[q])
                    automaton.fn[q] = {};
                if (!automaton.fn[q][x])
                    automaton.fn[q][x] = [];
                automaton.fn[q][x].push({
                    q: state,
                    y: '',
                });
                if (!automaton.fn[state])
                    automaton.fn[state] = {};
            });
        }
        else {
            if (!automaton.fn[state])
                automaton.fn[state] = {};
            transitions.forEach(t => {
                var _a;
                const x = t[0];
                const q = (_a = t[1]) !== null && _a !== void 0 ? _a : createNewState('_F');
                if (!automaton.fn[state][x])
                    automaton.fn[state][x] = [];
                automaton.fn[state][x].push({
                    q: q,
                    y: '',
                });
                if (!automaton.fn[q])
                    automaton.fn[q] = {};
            });
        }
    });
    (0, server_1.addToVisualize)(automaton, 'read from right regular grammar');
    return automaton;
}
exports.readRightRegularGrammar = readRightRegularGrammar;
