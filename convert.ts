import {readAutomaton} from './src/utils/read'
import * as process from 'process'
import {convertToMoore} from './src/utils/convert'
import {isMoore} from './src/utils/utils'
import {printAutomaton} from './src/utils/print'
import {runServer} from './src/utils/server'

const file = process.argv[2] || 'test_data/mealy-moore/1/input.txt'

const automaton = readAutomaton(file)

if (isMoore(automaton)) {
	printAutomaton(automaton)
}
else {
	convertToMoore(automaton)
	printAutomaton(automaton, false)
}

runServer()
