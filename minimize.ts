import {readAutomaton} from './src/utils/read'
import {minimize} from './src/utils/minimize'
import * as process from 'process'
import * as util from 'util'
import {runServer} from './src/utils/server'
import {printAutomaton} from './src/utils/print'

const filePath = process.argv[2] || 'minimize.txt'
const automaton = readAutomaton(filePath)

minimize(automaton)

console.log('==========minimized==========')
console.log(util.inspect(automaton, {
	depth: 5,
	colors: true,
}))
printAutomaton(automaton)

runServer()
