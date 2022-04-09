import {Automaton, Transition} from '../types/types'
import {deepCopy} from './utils'

function printAutomaton(automaton: Automaton, asMealy: boolean = true): void {
	const table = deepCopy(automaton.fn) as any
	Object.keys(table).forEach(q => {
		Object.keys(table[q]).forEach(x => {
			table[q][x] = table[q][x].map((t: Transition) => t.y && asMealy ? `${t.q}/${t.y}` : t.q).join(',')
		})
	})
	console.table(table)
}

export {
	printAutomaton,
}