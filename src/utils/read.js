"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readAutomaton = void 0;
var process = require('process');
var file = process.argv[2];
var fs = require('fs');
function getStates(rawData) {
    return [
        rawData.split(':')[0].trim(),
        rawData.split(':')[1].trim().split(/\s+/),
    ];
}
function readAutomaton() {
    var lines = fs.readFileSync(file, 'utf-8').trim().split(/(?:\r\n)+/);
    var automaton = {
        Q: [],
        X: [],
        Y: [],
        fn: {},
    };
    if (lines[0] === 'Mr') {
        automaton.Q = lines[4].trim().split(/\s+/);
        automaton.Y = lines[5].trim().split(/\s+/);
        var _loop_1 = function (i) {
            var _a = getStates(lines[i]), x = _a[0], newStates = _a[1];
            automaton.X.push(x);
            automaton.Q.forEach(function (q) {
                automaton.fn[q] = {};
                automaton.fn[q][x] = [];
                var newQ = newStates.shift();
                automaton.fn[q][x].push({
                    q: newQ,
                    y: automaton.Y[automaton.Q.indexOf(newQ)],
                });
            });
        };
        for (var i = 6; i < lines.length; ++i) {
            _loop_1(i);
        }
    }
    else if (lines[0] === 'Ml') {
        automaton.Q = lines[4].trim().split(/\s+/);
        var _loop_2 = function (i) {
            var _b = getStates(lines[i]), x = _b[0], newStates = _b[1];
            var outputSignals = lines[i + 1].trim().split(/\s+/);
            automaton.X.push(x);
            automaton.Q.forEach(function (q) {
                automaton.fn[q] = {};
                automaton.fn[q][x] = [];
                automaton.fn[q][x].push({
                    q: newStates.shift(),
                    y: outputSignals.shift(),
                });
            });
            automaton.Y.push(lines[i + 1].trim().split(/\s+/));
        };
        for (var i = 5; i <= lines.length - 1; i += 2) {
            _loop_2(i);
        }
    }
    return automaton;
}
exports.readAutomaton = readAutomaton;
