"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const read_1 = require("./src/utils/read");
const fs_1 = require("fs");
const minimize_1 = require("./src/utils/minimize");
const getDirectories = (source) => (0, fs_1.readdirSync)(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
const TEST_DIR = 'test_data/';
describe('all tests', () => {
    getDirectories(TEST_DIR + 'mealy-moore/').forEach(dir => {
        test('mealy-moore ' + dir, () => {
            const automaton = (0, read_1.readAutomaton)(TEST_DIR + 'mealy-moore/' + dir + '/input.txt');
            const minimized = (0, read_1.readAutomaton)(TEST_DIR + 'mealy-moore/' + dir + '/output.txt');
            expect(automaton).toStrictEqual(minimized);
        });
    });
    getDirectories(TEST_DIR + 'minimize/').forEach(dir => {
        test('minimization ' + dir, () => {
            const automaton = (0, read_1.readAutomaton)(TEST_DIR + 'minimize/' + dir + '/input.txt');
            const minimized = (0, read_1.readAutomaton)(TEST_DIR + 'minimize/' + dir + '/output.txt');
            (0, minimize_1.minimize)(automaton);
            expect(automaton).toStrictEqual(minimized);
        });
    });
});
