"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
const minimize_1 = require("./src/utils/minimize");
const server_1 = require("./src/utils/server");
const determine_1 = require("./src/utils/determine");
const file = process.argv[2] || 'regex.txt';
let regexp = fs_1.default.readFileSync(file, 'utf-8').trim();
let automaton = (0, regexpToAutomaton_1.regexToAutomaton)(regexp);
automaton = (0, determine_1.determine)(automaton);
(0, minimize_1.minimize)(automaton);
console.log(util.inspect(automaton, {
    depth: 5,
    colors: true,
}));
(0, print_1.printAutomaton)(automaton);
(0, server_1.runServer)();
