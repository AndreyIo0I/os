import {Automaton} from '../types/types'

function reverse(automaton: Automaton): Automaton {
	const newAutomaton = {...automaton}

	newAutomaton.fn = {}
	automaton.Q.forEach(q => {
		automaton.X.forEach(x => {
			//todo доработать для нка
			newAutomaton.fn[q][x].push(automaton.fn[automaton.fn[q][x][0].q][x][0])
		})
	})

	return newAutomaton
}

export {
	reverse,
}