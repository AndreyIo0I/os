import {Automaton} from '../types/types'
import {deepCopy} from './utils'

const STATE_VALUE_SEPARATOR = '#'

function convertToMoore(automaton: Automaton): void {
	const outdatedStates: Set<string> = new Set()
	const newStates: Set<string> = new Set()

	automaton.Q.forEach(q => {
		automaton.X.forEach(x => {
			outdatedStates.add(automaton.fn[q][x][0].q)
			const newState = automaton.fn[q][x][0].q + STATE_VALUE_SEPARATOR + automaton.fn[q][x][0].y
			automaton.fn[q][x][0].q = newState
			newStates.add(newState)
		})
	})

	newStates.forEach(q => {
		automaton.fn[q] = deepCopy(automaton.fn[q.split(STATE_VALUE_SEPARATOR)[0]])
	})

	outdatedStates.forEach(q => delete automaton.fn[q])
	automaton.Q = Object.keys(automaton.fn)
}

export {
	convertToMoore,
}