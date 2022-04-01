"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToVisualize = exports.runServer = void 0;
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("./utils");
let info = [];
function addToVisualize(automaton, text = '') {
    info.push((0, utils_1.deepCopy)({
        text,
        automaton,
    }));
}
exports.addToVisualize = addToVisualize;
function runServer() {
    fs_1.default.writeFileSync('visualize.json', JSON.stringify(info));
    const app = (0, express_1.default)();
    const port = 3000;
    app.use(express_1.default.static(__dirname + '\\..\\..'));
    app.listen(port, () => {
        console.log('see http://localhost:3000');
    });
}
exports.runServer = runServer;
