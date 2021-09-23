import {Automaton} from '../types/types'

function determineAutomaton(automaton: Automaton): Automaton {
	const newAutomaton = {...automaton}
	newAutomaton.fn = automaton.fn
	return newAutomaton
}

export {
	determineAutomaton,
}