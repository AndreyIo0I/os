"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const read_1 = require("./src/utils/read");
const minimize_1 = require("./src/utils/minimize");
(0, minimize_1.hopcraftMinimization)((0, read_1.readAutomaton)());
