import {Automaton} from '../types/types'
import {reverse} from './reverse'
import {determine} from './determine'
import {deepCopy} from './utils'
import {addToVisualize} from './server'

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

	addToVisualize(automaton, 'remove disconnected nodes')
}

type EquivalenceClasses = { [equivalence: string]: Array<string> }
type StateToEquivalence = { [state: string]: string }

//автомат должен быть уже детерминизирован
function minimize(automaton: Automaton): void {
	removeDisconnectedNodes(automaton)

	let equivalences: EquivalenceClasses = {}
	let stateToEquivalence: StateToEquivalence = {}

	//разбиваем на 0-эквивалентности, склеивая выходные значения
	Object.keys(automaton.fn).forEach(q => {
		const equivalence = Object.keys(automaton.fn[q]).map(x => x + automaton.fn[q][x][0].y).join(' ')
		if (!equivalences[equivalence])
			equivalences[equivalence] = []
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
				const vectorOfEquivalences = Object.keys(automaton.fn[q]).map(x => stateToEquivalence[automaton.fn[q][x][0].q])
				const newEquivalenceName = equivalenceName + '->' + vectorOfEquivalences.join(' ')
				if (!newEquivalences[newEquivalenceName]) {
					newEquivalences[newEquivalenceName] = []
				}
				newEquivalences[newEquivalenceName].push(q)
				newStateToEquivalence[q] = newEquivalenceName
			})
		}

		if (Object.keys(newEquivalences).length !== Object.keys(equivalences).length) {
			smashed = true
		}
		console.log('=====equivalences=====')
		console.log(equivalences)
		equivalences = deepCopy(newEquivalences)
		stateToEquivalence = deepCopy(newStateToEquivalence)
	}

	const duplicates = Object.keys(equivalences).flatMap(key => equivalences[key].slice(1))

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

	addToVisualize(automaton, 'minimize')
}

function brzozowskiMinimization(automaton: Automaton): Automaton {
	return determine(reverse(determine(reverse(automaton))))
}

export {
	brzozowskiMinimization,
	minimize,
	removeDisconnectedNodes,
}