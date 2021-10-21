import {Automaton, QTransitions} from '../types/types'
import {reverse} from './reverse'
import {determine} from './determine'

type EquivalenceClasses = { [equivalence: string]: Array<string> }

function hopcraftMinimization(automaton: Automaton): Automaton {
	const QtoEquivalence : { [q: string]: string } = {}
	const equivalenceClasses : EquivalenceClasses = {}

	// определить классы эквивалентности
	automaton.Q.forEach(q => {
		let equivalence = ''
		automaton.X.forEach(x => {
			equivalence += automaton.fn[q][x][0].y
		})
		QtoEquivalence[q] = equivalence
		equivalenceClasses[equivalence] = [...equivalenceClasses[equivalence], q]
	})

	// разбить классы эквивалентности
	let newEquivalenceClasses : EquivalenceClasses = {}
	automaton.Q.forEach(q => {
		if (equivalenceClasses[QtoEquivalence[q]].length > 1) {
			let equivalence = ''
			automaton.X.forEach(x => {
				equivalence += automaton.fn[q][x][0].y
			})
		}
	})

	return automaton
}

function brzozowskiMinimization(automaton: Automaton): Automaton {
	return determine(reverse(determine(reverse(automaton))))
}

export {
	brzozowskiMinimization,
	hopcraftMinimization,
}