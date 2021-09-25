import {Automaton} from '../types/types'

function determine(automaton: Automaton): Automaton {
	const newAutomaton = {...automaton}

	automaton.Q.forEach(q => {
		automaton.X.forEach(x => {
			if (automaton.fn[q][x].length > 1) {
				//todo determine
			}
		})
	})

	return newAutomaton
}

export {
	determine,
}