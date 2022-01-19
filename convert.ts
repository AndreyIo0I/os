import {readAutomaton} from './src/utils/read'
import * as process from 'process'
import {convertToMoore} from './src/utils/convert'
import {isMoore} from './src/utils/utils'
import {printAutomaton} from './src/utils/print'

const file = process.argv[2] || 'moore.txt'

const automaton = readAutomaton(file)

if (isMoore(automaton)) {
	printAutomaton(automaton)
}
else {
	convertToMoore(automaton)
	printAutomaton(automaton)
}
