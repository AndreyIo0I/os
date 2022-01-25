import * as process from 'process'
import {printAutomaton} from './src/utils/print'
import * as util from 'util'
import fs from 'fs'
import {regexToAutomaton} from './src/utils/regexpToAutomaton'
import {minimize} from './src/utils/minimize'

const file = process.argv[2] || 'regex.txt'
let regexp = fs.readFileSync(file, 'utf-8').trim()

const automaton = regexToAutomaton(regexp)

minimize(automaton)

fs.writeFileSync('automaton.json', JSON.stringify(automaton))
console.log(util.inspect(automaton, {
	depth: 5,
	colors: true,
}))
printAutomaton(automaton)
