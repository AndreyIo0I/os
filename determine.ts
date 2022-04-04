import {readAutomaton} from './src/utils/read'
import * as process from 'process'
import {printAutomaton} from './src/utils/print'
import {determine} from './src/utils/determine'
import {runServer} from './src/utils/server'

const file = process.argv[2] || 'determine.txt'

let automaton = readAutomaton(file)

automaton = determine(automaton)

printAutomaton(automaton)

runServer()