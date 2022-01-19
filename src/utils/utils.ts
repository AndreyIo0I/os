import {Automaton} from '../types/types'

function deepCopy<T>(value: T): T {
	return JSON.parse(JSON.stringify(value))
}

function isMoore(automaton: Automaton): boolean {
	const stateToValue: { [q: string]: string } = {}
	for (const q of automaton.Q) {
		for (const x of automaton.X) {
			for (const transition of automaton.fn[q][x] || []) {
				if (stateToValue[transition.q] && stateToValue[transition.q] !== transition.y) {
					return false
				}
				else {
					stateToValue[transition.q] = transition.y
				}
			}
		}
	}
	return true
}

export {
	deepCopy,
	isMoore,
}