import {Automaton} from '../types/types'

function deepCopy<T>(value: T): T {
	return JSON.parse(JSON.stringify(value))
}

function isMoore(automaton: Automaton): boolean {
	for (const q of Object.keys(automaton.fn)) {
		let valueOfState
		for (const x of Object.keys(automaton.fn[q])) {
			for (const transition of automaton.fn[q][x]) {
				if (valueOfState === undefined)
					valueOfState = transition.y
				if (valueOfState !== transition.y)
					return false
			}
		}
	}
	return true
}

export {
	deepCopy,
	isMoore,
}