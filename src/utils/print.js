"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printAutomaton = void 0;
const utils_1 = require("./utils");
function printAutomaton(automaton) {
    const table = (0, utils_1.deepCopy)(automaton.fn);
    Object.keys(table).forEach(q => {
        Object.keys(table[q]).forEach(x => {
            table[q][x] = table[q][x].map((t) => t.y ? `${t.q}/${t.y}` : t.q).join(',');
        });
    });
    console.table(table);
}
exports.printAutomaton = printAutomaton;
