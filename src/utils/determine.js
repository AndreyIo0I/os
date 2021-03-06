"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.determine = void 0;
const utils_1 = require("./utils");
const consts_1 = require("../consts");
const server_1 = require("./server");
const util_1 = __importDefault(require("util"));
function sortTransitions(a, b) {
    if (a.q > b.q) {
        return 1;
    }
    if (a.q < b.q) {
        return -1;
    }
    return 0;
}
function removeEpsilons(automaton) {
    if (!automaton.qs) {
        return automaton;
    }
    //get all epsilon transitions
    const epsilonTransitions = [];
    Object.keys(automaton.fn).forEach(q => {
        if (automaton.fn[q][consts_1.EPSILON])
            automaton.fn[q][consts_1.EPSILON].map(t => [q, t.q])
                .forEach(epsilonTransition => epsilonTransitions.push(epsilonTransition));
    });
    //create closures
    const epsilonClosures = [];
    epsilonTransitions.forEach(t => {
        let closureFound = false;
        epsilonClosures.forEach(closure => {
            if (closure.has(t[0]) || closure.has(t[1])) {
                closure.add(t[0]);
                closure.add(t[1]);
                closureFound = true;
            }
        });
        if (!closureFound)
            epsilonClosures.push(new Set(t));
    });
    const statesWithoutEpsilons = new Set(Object.keys(automaton.fn));
    epsilonClosures.forEach(closure => {
        closure.forEach(q => statesWithoutEpsilons.delete(q));
    });
    statesWithoutEpsilons.forEach(q => epsilonClosures.push(new Set([q])));
    //create state map
    const stateMap = {};
    Object.keys(automaton.fn).forEach(q => stateMap[q] = '');
    epsilonClosures.forEach(closure => {
        const newQName = Array.from(closure).reduce((min, v) => v < min ? v : min);
        Array.from(closure).forEach(q => {
            stateMap[q] = newQName;
        });
    });
    const newAutomaton = {
        fn: {},
        qs: stateMap[automaton.qs],
        qf: automaton.qf && stateMap[automaton.qf],
    };
    epsilonClosures.forEach(closure => {
        const closureArray = Array.from(closure);
        closureArray.forEach(q => {
            const newQ = stateMap[q];
            if (!newAutomaton.fn[newQ])
                newAutomaton.fn[newQ] = {};
            Object.keys(automaton.fn[q]).forEach(x => {
                if (x !== consts_1.EPSILON) {
                    if (!newAutomaton.fn[newQ][x])
                        newAutomaton.fn[newQ][x] = [];
                    automaton.fn[q][x].map(t => ({
                        q: stateMap[t.q],
                        y: t.y,
                    }))
                        .forEach(t => newAutomaton.fn[newQ][x].push(t));
                }
            });
        });
    });
    console.log('==========remove epsilons==========\n'
        + util_1.default.inspect(newAutomaton, {
            depth: 5,
            colors: true,
        }));
    (0, server_1.addToVisualize)(newAutomaton, 'remove epsilons');
    return newAutomaton;
}
function determine(originalAutomaton) {
    const automaton = removeEpsilons((0, utils_1.deepCopy)(originalAutomaton));
    const states = [...Object.keys(automaton.fn)];
    while (states.length) {
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
                        Object.keys(automaton.fn[t.q]).forEach(tX => {
                            automaton.fn[t.q][tX].forEach(tT => {
                                if (!automaton.fn[newQ][tX])
                                    automaton.fn[newQ][tX] = [];
                                if (automaton.fn[newQ][tX].every(v => !(v.q === tT.q && v.y === tT.y))) {
                                    automaton.fn[newQ][tX].push(tT);
                                    automaton.fn[newQ][tX].sort(sortTransitions);
                                }
                            });
                        });
                    });
                });
            }
        });
    }
    //?????????????? ?????????????????? ?? ?????????????????? ????????????????????
    Object.keys(automaton.fn).forEach(q => {
        Object.keys(automaton.fn[q]).forEach(x => {
            if (automaton.fn[q][x].length) {
                automaton.fn[q][x] = [{
                        q: automaton.fn[q][x].map(t => t.q).join(''),
                        y: automaton.fn[q][x].map(t => t.y).join(''),
                    }];
            }
        });
    });
    console.log('==========determine==========\n'
        + util_1.default.inspect(automaton, {
            depth: 5,
            colors: true,
        }));
    (0, server_1.addToVisualize)(automaton, 'determined');
    return automaton;
}
exports.determine = determine;
