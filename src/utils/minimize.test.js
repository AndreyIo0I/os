"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const minimize_1 = require("./minimize");
describe('test minimization', () => {
    test('without start state', () => {
        const automaton = {
            fn: {
                's0': {
                    'a': [{ q: 's1s7', y: '' }],
                },
                's11': {},
                's7': {
                    'b': [{ q: 's11', y: '' }],
                },
                's1': {
                    'b': [{ q: 's11', y: '' }],
                },
                's1s7': {},
            },
        };
        const minimized = {
            fn: {
                's0': {
                    'a': [{ q: 's11', y: '' }],
                },
                's11': {},
                's7': {
                    'b': [{ q: 's11', y: '' }],
                },
            },
        };
        (0, minimize_1.minimize)(automaton);
        expect(automaton).toStrictEqual(minimized);
    });
    test('with start state', () => {
        const automaton = {
            fn: {
                's0': {
                    'a': [{ q: 's1s7', y: '' }],
                },
                's11': {},
                's7': {
                    'b': [{ q: 's11', y: '' }],
                },
                's1': {
                    'b': [{ q: 's11', y: '' }],
                },
                's1s7': {},
            },
            qs: 's0',
        };
        const minimized = {
            fn: {
                's0': {
                    'a': [{ q: 's1s7', y: '' }],
                },
                's1s7': {},
            },
            qs: 's0',
        };
        (0, minimize_1.minimize)(automaton);
        expect(automaton).toStrictEqual(minimized);
    });
});
