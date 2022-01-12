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
const read_1 = require("./src/utils/read");
const process = __importStar(require("process"));
const print_1 = require("./src/utils/print");
const determine_1 = require("./src/utils/determine");
const util = __importStar(require("util"));
const file = process.argv[2] || 'moore.txt';
let automaton = (0, read_1.readAutomaton)(file);
automaton = (0, determine_1.determine)(automaton);
console.log(util.inspect(automaton, {
    depth: 5,
    colors: true,
}));
(0, print_1.printAutomaton)(automaton);
