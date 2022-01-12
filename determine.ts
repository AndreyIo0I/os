import {readAutomaton} from './src/utils/read'
import * as process from 'process'
import {convertToMoore} from './src/utils/convert'
import {isMoore} from './src/utils/utils'
import {printAutomaton} from './src/utils/print'
import {determine} from './src/utils/determine'
import * as util from 'util'

const file = process.argv[2] || 'moore.txt'

let automaton = readAutomaton(file)

automaton = determine(automaton)

console.log(util.inspect(automaton, {
	depth: 5,
	colors: true,
}))

printAutomaton(automaton)
