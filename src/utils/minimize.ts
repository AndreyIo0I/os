import {Automaton, QTransitions} from '../types/types'
import {reverse} from './reverse'
import {determine} from './determine'

type EquivalenceClass = Array<[QTransitions, Array<string>]>

function equals(a: EquivalenceClass, b: EquivalenceClass, xArray: Array<string>): boolean {
	let result = true

	if (a.length !== b.length) {
		return false
	}
	a.forEach((equivalence, index) => {
		xArray.forEach(x => {
			if (equivalence[0][x][0].y !== b[index][0][x][0].y) {
				result = false
				return
			}
		})
		if (!result) {
			return
		}
	})

	return result
}

function hopcraftMinimization(automaton: Automaton): Automaton {
	let notMinimized = true
	let equivalenceClasses: EquivalenceClass = []
	let lastEquivalenceClasses: EquivalenceClass = []

	while (notMinimized) {
		notMinimized = false

		automaton.Q.forEach(q => {
			let equivalenceClassFound = false
			for (const equivalenceClass of equivalenceClasses) {
				automaton.X.forEach(x => {
					if (equivalenceClass[0][x][0].y === automaton.fn[q][x][0].y) {
						equivalenceClassFound = true
						equivalenceClass[1].push(q)
					}
				})
				if (equivalenceClassFound) {
					break
				}
			}
			if (!equivalenceClassFound) {
				equivalenceClasses.push([automaton.fn[q], [q]])
			}
		})

		if (!equals(equivalenceClasses, lastEquivalenceClasses, automaton.X)) {
			lastEquivalenceClasses = equivalenceClasses
			equivalenceClasses = []
			notMinimized = true
		}
	}
	console.log(equivalenceClasses)
	return automaton
}

function brzozowskiMinimization(automaton: Automaton): Automaton {
	return determine(reverse(determine(reverse(automaton))))
}

export {
	brzozowskiMinimization,
	hopcraftMinimization,
}