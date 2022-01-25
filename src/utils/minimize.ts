import {Automaton} from '../types/types'
import {reverse} from './reverse'
import {determine} from './determine'
import {deepCopy} from './utils'
import {EPSILON} from '../consts'

type EquivalenceClasses = { [equivalence: string]: Array<string> }
type StateToEquivalence = { [state: string]: string }

function removeDisconnectedNodes(automaton: Automaton): void {
	if (!automaton.qs) {
		return
	}

	const stack: Array<string> = [automaton.qs]
	const visited: Set<string> = new Set(stack)
	while (stack.length) {
		const head = stack.pop()!
		Object.keys(automaton.fn[head]).forEach(x => {
			automaton.fn[head][x].forEach(t => {
				if (!visited.has(t.q)) {
					visited.add(t.q)
					stack.push(t.q)
				}
			})
		})
	}

	Object.keys(automaton.fn).forEach(q => {
		if (!visited.has(q)) {
			delete automaton.fn[q]
		}
	})
}

function removeEpsilons(automaton: Automaton): void {
	// const newFn = {}
	// Object.keys(automaton.fn).forEach(q => {
	// 	Object.keys(automaton.fn[q]).forEach(x => {
	// 		if (x === EPSILON) {
	//
	// 		}
	// 	})
	// })
	// automaton.fn = newFn
}

function minimize(automaton: Automaton): void {
	removeDisconnectedNodes(automaton)
	removeEpsilons(automaton)

	let equivalences: EquivalenceClasses = {}
	let stateToEquivalence: StateToEquivalence = {}

	automaton.Q.forEach(q => {
		const equivalence = automaton.X.map(x => automaton.fn[q][x][0].y).join(' ')
		if (!equivalences[equivalence]) {
			equivalences[equivalence] = []
		}
		equivalences[equivalence].push(q)
		stateToEquivalence[q] = equivalence
	})

	let smashed = true
	while (smashed) {
		smashed = false
		let newEquivalences: EquivalenceClasses = {}
		let newStateToEquivalence: StateToEquivalence = {}
		for (const equivalenceName in equivalences) {
			const equivalence = equivalences[equivalenceName]
			equivalence.forEach(q => {
				const vectorOfEquivalences = automaton.X.map(x => stateToEquivalence[automaton.fn[q][x][0].q])
				const newEquivalenceName = equivalenceName + '->' + vectorOfEquivalences.join(' ')
				if (!newEquivalences[newEquivalenceName]) {
					newEquivalences[newEquivalenceName] = []
				}
				newEquivalences[newEquivalenceName].push(q)
			})
		}

		if (Object.keys(newEquivalences).length !== Object.keys(equivalences).length) {
			smashed = true
		}
		equivalences = deepCopy(newEquivalences)
		newStateToEquivalence = deepCopy(stateToEquivalence)
	}

	const duplicates = Object.keys(equivalences).flatMap(key => equivalences[key].slice(1))
	automaton.Q = automaton.Q.filter(v => !duplicates.includes(v))
	duplicates.forEach(duplicate => {
		delete automaton.fn[duplicate]
	})
	Object.keys(automaton.fn).forEach(q => {
		Object.keys(automaton.fn[q]).forEach(x => {
			if (duplicates.includes(automaton.fn[q][x][0].q)) {
				automaton.fn[q][x][0].q = equivalences[stateToEquivalence[automaton.fn[q][x][0].q]][0]
			}
		})
	})
	if (automaton.qs && duplicates.includes(automaton.qs)) {
		automaton.qs = equivalences[stateToEquivalence[automaton.qs]][0]
	}
}

function brzozowskiMinimization(automaton: Automaton): Automaton {
	return determine(reverse(determine(reverse(automaton))))
}

export {
	brzozowskiMinimization,
	minimize,
}