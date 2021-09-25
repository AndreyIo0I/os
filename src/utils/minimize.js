"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.brzozowskiMinimization = void 0;
var reverse_1 = require("./reverse");
var determine_1 = require("./determine");
function brzozowskiMinimization(automaton) {
    return (0, determine_1.determine)((0, reverse_1.reverse)((0, determine_1.determine)((0, reverse_1.reverse)(automaton))));
}
exports.brzozowskiMinimization = brzozowskiMinimization;
