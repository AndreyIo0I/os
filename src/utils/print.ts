import {Automaton, Transition} from '../types/types'
import {deepCopy} from './utils'

function printAutomaton(automaton: Automaton): void {
	const table = deepCopy(automaton.fn) as any
	Object.keys(table).forEach(q => {
		Object.keys(table[q]).forEach(x => {
			table[q][x] = table[q][x].map((t: Transition) => t.y ? `${t.q}/${t.y}` : t.q).join(',')
		})
	})
	console.table(table)
}

export {
	printAutomaton,
}