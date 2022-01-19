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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const process = __importStar(require("process"));
const print_1 = require("./src/utils/print");
const util = __importStar(require("util"));
const fs_1 = __importDefault(require("fs"));
const regexpToAutomaton_1 = require("./src/utils/regexpToAutomaton");
const file = process.argv[2] || 'regex.txt';
let regexp = fs_1.default.readFileSync(file, 'utf-8').trim();
const automaton = (0, regexpToAutomaton_1.regexToAutomaton)(regexp);
fs_1.default.writeFileSync('automaton.json', JSON.stringify(automaton));
console.log(util.inspect(automaton, {
    depth: 5,
    colors: true,
}));
(0, print_1.printAutomaton)(automaton);
