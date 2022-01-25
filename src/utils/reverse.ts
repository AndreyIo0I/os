import {Automaton} from '../types/types'

function reverse(automaton: Automaton): Automaton {
	const newAutomaton = {...automaton}

	newAutomaton.fn = {}
	Object.keys(automaton.fn).forEach(q => {
		Object.keys(automaton.fn[q]).forEach(x => {
			//todo доработать для нка
			newAutomaton.fn[q][x].push(automaton.fn[automaton.fn[q][x][0].q][x][0])
		})
	})

	return newAutomaton
}

export {
	reverse,
}