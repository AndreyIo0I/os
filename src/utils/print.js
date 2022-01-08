"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printAutomaton = void 0;
const utils_1 = require("./utils");
function printAutomaton(automaton, asMealy = false) {
    if (!asMealy && (0, utils_1.isMoore)(automaton)) {
        const stateToValue = {};
        automaton.Q.forEach(q => {
            automaton.X.forEach(x => {
                stateToValue[automaton.fn[q][x][0].q] = automaton.fn[q][x][0].y;
            });
        });
        process.stdout.write('Mr\n');
        process.stdout.write('    ' + automaton.Q.join(' ') + '\n');
        process.stdout.write('    ' + automaton.Q.map(q => stateToValue[q]).join(' ') + '\n');
        automaton.X.forEach(x => {
            process.stdout.write(x + ': ');
            process.stdout.write(automaton.Q.map(q => automaton.fn[q][x][0].q).join(' ') + '\n');
        });
    }
    else {
        process.stdout.write('Ml\n');
        process.stdout.write('    ' + automaton.Q.join(' ') + '\n');
        automaton.X.forEach(x => {
            process.stdout.write(x + ': ');
            process.stdout.write(automaton.Q.map(q => automaton.fn[q][x][0].q).join(' ') + '\n');
            process.stdout.write('    ' + automaton.Q.map(q => automaton.fn[q][x][0].y).join(' ') + '\n');
        });
    }
}
exports.printAutomaton = printAutomaton;
