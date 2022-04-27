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
Object.defineProperty(exports, "__esModule", { value: true });
const read_1 = require("./src/utils/read");
const process = __importStar(require("process"));
const convert_1 = require("./src/utils/convert");
const utils_1 = require("./src/utils/utils");
const print_1 = require("./src/utils/print");
const server_1 = require("./src/utils/server");
const file = process.argv[2] || 'test_data/mealy-moore/1/input.txt';
const automaton = (0, read_1.readAutomaton)(file);
if ((0, utils_1.isMoore)(automaton)) {
    (0, print_1.printAutomaton)(automaton);
}
else {
    (0, convert_1.convertToMoore)(automaton);
    (0, print_1.printAutomaton)(automaton, false);
}
(0, server_1.runServer)();
