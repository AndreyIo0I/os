"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regexToAutomaton = void 0;
const consts_1 = require("../consts");
function* nameGenerator(base) {
    for (let i = 0;; ++i) {
        yield base + i;
    }
}
const OPERATOR_PRIORITY = {
    '|': 1,
    '&': 2,
    '*': 3,
};
function regexToPostfix(originRegex) {
    const regexArray = [];
    originRegex.split('').forEach((v, i) => {
        var _a;
        regexArray.push(v);
        const nextV = (_a = originRegex[i + 1]) !== null && _a !== void 0 ? _a : '';
        if ((v + nextV).match(/([a-z\d)*][a-z\d(])/)) {
            regexArray.push('&');
        }
    });
    const output = [];
    const operatorStack = [];
    regexArray.forEach(v => {
        if (v.match(/[a-z\d]/)) {
            output.push(v);
        }
        else if (v === '(') {
            operatorStack.push(v);
        }
        else if (v === ')') {
            let closed = false;
            while (operatorStack.length > 0) {
                const topElement = operatorStack.pop();
                if (topElement !== '(') {
                    output.push(topElement);
                }
                else {
                    closed = true;
                    break;
                }
            }
            if (!closed) {
                throw Error('unclosed parentheses');
            }
        }
        else if (v === '&' || v === '|' || v === '*') {
            let topOperator = operatorStack[operatorStack.length - 1];
            while (operatorStack.length && topOperator !== '(' && OPERATOR_PRIORITY[topOperator] >= OPERATOR_PRIORITY[v]) {
                output.push(operatorStack.pop());
                topOperator = operatorStack[operatorStack.length - 1];
            }
            operatorStack.push(v);
        }
        else {
            throw Error('unhandled symbol');
        }
    });
    output.push(...operatorStack.reverse());
    return output;
}
function createValueNfa(value, stateNameGenerator) {
    const qs = stateNameGenerator.next().value;
    const qf = stateNameGenerator.next().value;
    return {
        fn: {
            [qs]: {
                [value]: [
                    {
                        q: qf,
                        y: '',
                    },
                ],
            },
            [qf]: {},
        },
        qs: qs,
        qf: qf,
    };
}
function createOnionNfa(nfa1, nfa2, stateNameGenerator) {
    const qs = stateNameGenerator.next().value;
    const qf = stateNameGenerator.next().value;
    const fn = {
        [qs]: {
            [consts_1.EPSILON]: [
                {
                    q: nfa1.qs,
                    y: '',
                },
                {
                    q: nfa2.qs,
                    y: '',
                },
            ],
        },
        [qf]: {},
    };
    Object.keys(nfa1.fn).forEach(q => {
        fn[q] = nfa1.fn[q];
    });
    Object.keys(nfa2.fn).forEach(q => {
        fn[q] = nfa2.fn[q];
    });
    fn[nfa1.qf] = {
        [consts_1.EPSILON]: [
            {
                q: qf,
                y: '',
            },
        ],
    };
    fn[nfa2.qf] = {
        [consts_1.EPSILON]: [
            {
                q: qf,
                y: '',
            },
        ],
    };
    return {
        fn,
        qs,
        qf,
    };
}
function createConcatNfa(nfa1, nfa2, stateNameGenerator) {
    const qs = stateNameGenerator.next().value;
    const qf = stateNameGenerator.next().value;
    nfa1.fn[nfa1.qf] = {
        [consts_1.EPSILON]: [{
                q: nfa2.qs,
                y: '',
            }],
    };
    nfa2.fn[nfa2.qf] = {
        [consts_1.EPSILON]: [{
                q: qf,
                y: '',
            }],
    };
    const fn = {
        [qs]: {
            [consts_1.EPSILON]: [
                {
                    q: nfa1.qs,
                    y: '',
                },
            ],
        },
        [qf]: {},
    };
    Object.keys(nfa2.fn).forEach(q => {
        fn[q] = nfa2.fn[q];
    });
    Object.keys(nfa1.fn).forEach(q => {
        fn[q] = nfa1.fn[q];
    });
    return {
        fn,
        qs,
        qf,
    };
}
function createStarNfa(nfa1, stateNameGenerator) {
    const qs = stateNameGenerator.next().value;
    const qf = stateNameGenerator.next().value;
    const fn = {
        [qs]: {
            [consts_1.EPSILON]: [
                {
                    q: nfa1.qs,
                    y: '',
                },
                {
                    q: qf,
                    y: '',
                },
            ],
        },
        [qf]: {},
    };
    fn[nfa1.qf] = {
        [consts_1.EPSILON]: [
            {
                q: qf,
                y: '',
            },
        ],
    };
    Object.keys(nfa1.fn).forEach(q => {
        fn[q] = nfa1.fn[q];
    });
    return {
        fn,
        qs,
        qf,
    };
}
function regexToAutomaton(regex) {
    const postfixRegex = regexToPostfix(regex);
    const stateNameGenerator = nameGenerator('s');
    const nfaStack = [];
    postfixRegex.forEach(v => {
        if (v.match(/[a-z\d]/)) {
            nfaStack.push(createValueNfa(v, stateNameGenerator));
        }
        else if (v === '|') {
            nfaStack.push(createOnionNfa(nfaStack.pop(), nfaStack.pop(), stateNameGenerator));
        }
        else if (v === '&') {
            const nfa1 = nfaStack.pop();
            const nfa2 = nfaStack.pop();
            nfaStack.push(createConcatNfa(nfa2, nfa1, stateNameGenerator));
        }
        else if (v === '*') {
            nfaStack.push(createStarNfa(nfaStack.pop(), stateNameGenerator));
        }
    });
    return nfaStack.pop();
}
exports.regexToAutomaton = regexToAutomaton;