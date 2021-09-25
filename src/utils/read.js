"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readAutomaton = void 0;
var process = require('process');
var file = process.argv[2];
var fs = require('fs');
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
            var x = lines[i].split(':')[0].trim();
            var newStates = lines[i].split(':')[1].trim().split(/\s+/);
            automaton.X.push(x);
            automaton.Q.forEach(function (q) {
                automaton.fn[q] = automaton.fn[q] || {};
                automaton.fn[q][x] = newStates.shift();
            });
        };
        for (var i = 6; i < lines.length; ++i) {
            _loop_1(i);
        }
    }
    else if (lines[0] === 'Ml') {
    }
    return automaton;
}
exports.readAutomaton = readAutomaton;
