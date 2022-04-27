import {Automaton} from './src/types/types'
import {readAutomaton} from './src/utils/read'
import {PathLike, readdirSync} from 'fs'
import {minimize} from './src/utils/minimize'

const getDirectories = (source: PathLike) =>
	readdirSync(source, { withFileTypes: true })
		.filter(dirent => dirent.isDirectory())
		.map(dirent => dirent.name)

const TEST_DIR = 'test_data/'

describe('all tests', () => { //not all, надо тогда будет чтение автомата дорабатывать до нка с состояниями без переходов
	getDirectories(TEST_DIR + 'mealy-moore/').forEach(dir => {
		test('mealy-moore ' + dir, () => {
			const automaton: Automaton = readAutomaton(TEST_DIR + 'mealy-moore/' + dir + '/input.txt')
			const minimized: Automaton = readAutomaton(TEST_DIR + 'mealy-moore/' + dir + '/output.txt')
			expect(automaton).toStrictEqual(minimized)
		})
	})

	getDirectories(TEST_DIR + 'minimize/').forEach(dir => {
		test('minimization ' + dir, () => {
			const automaton: Automaton = readAutomaton(TEST_DIR + 'minimize/' + dir + '/input.txt')
			const minimized: Automaton = readAutomaton(TEST_DIR + 'minimize/' + dir + '/output.txt')
			minimize(automaton)
			expect(automaton).toStrictEqual(minimized)
		})
	})

})