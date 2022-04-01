import * as process from 'process'
import {printAutomaton} from './src/utils/print'
import * as util from 'util'
import fs from 'fs'
import {regexToAutomaton} from './src/utils/regexpToAutomaton'
import {minimize} from './src/utils/minimize'
import {addToVisualize, runServer} from './src/utils/server'
import {determine} from './src/utils/determine'

const file = process.argv[2] || 'regex.txt'
let regexp = fs.readFileSync(file, 'utf-8').trim()

let automaton = regexToAutomaton(regexp)
addToVisualize(automaton, 'regex')

automaton = determine(automaton)
minimize(automaton)

console.log(util.inspect(automaton, {
	depth: 5,
	colors: true,
}))
printAutomaton(automaton)

runServer()
