import {readRightRegularGrammar} from './src/utils/read'
import * as process from 'process'
import {printAutomaton} from './src/utils/print'
import {determine} from './src/utils/determine'
import {runServer} from './src/utils/server'
import {minimize} from './src/utils/minimize'

const file = process.argv[2] || 'determine.txt'

let automaton = readRightRegularGrammar(file)

automaton = determine(automaton)
minimize(automaton)

printAutomaton(automaton)

runServer()