import {Automaton, Transition} from '../types/types'
import {deepCopy} from './utils'
import {EPSILON} from '../consts'
import {addToVisualize, runServer} from './server'
import util from 'util'

function sortTransitions(a: Transition, b: Transition): number {
	if (a.q > b.q) {
		return 1
	}
	if (a.q < b.q) {
		return -1
	}
	return 0
}

function removeEpsilons(automaton: Automaton): Automaton {
	if (!automaton.qs) {
		return automaton
	}

	//get all epsilon transitions
	const epsilonTransitions: Array<[string, string]> = []
	Object.keys(automaton.fn).forEach(q => {
		if (automaton.fn[q][EPSILON])
			automaton.fn[q][EPSILON].map(t => [q, t.q] as [string, string])
				.forEach(epsilonTransition => epsilonTransitions.push(epsilonTransition))
	})

	//create closures
	const epsilonClosures: Array<Set<string>> = []
	epsilonTransitions.forEach(t => {
		let closureFinded = false
		epsilonClosures.forEach(closure => {
			if (closure.has(t[0]) || closure.has(t[1])) {
				closure.add(t[0])
				closure.add(t[1])
				closureFinded = true
			}
		})
		if (!closureFinded)
			epsilonClosures.push(new Set(t))
	})

	//create state map
	const stateMap: { [q: string]: string } = {}
	Object.keys(automaton.fn).forEach(q => stateMap[q] = '')
	epsilonClosures.forEach(closure => {
		const newQName = Array.from(closure).reduce((min, v) => v < min ? v : min)
		Array.from(closure).forEach(q => {
			stateMap[q] = newQName
		})
	})

	const newAutomaton: Automaton = {
		fn: {},
		qs: stateMap[automaton.qs],
		qf: automaton.qf && stateMap[automaton.qf],
	}
	epsilonClosures.forEach(closure => {
		const closureArray = Array.from(closure)
		closureArray.forEach(q => {
			const newQ = stateMap[q]
			if (!newAutomaton.fn[newQ])
				newAutomaton.fn[newQ] = {}

			Object.keys(automaton.fn[q]).forEach(x => {
				if (x !== EPSILON) {
					if (!newAutomaton.fn[newQ][x])
						newAutomaton.fn[newQ][x] = []

					automaton.fn[q][x].map(t => ({
						q: stateMap[t.q],
						y: t.y,
					}))
						.forEach(t => newAutomaton.fn[newQ][x].push(t))
				}
			})
		})
	})

	console.log(
		'==========removed epsilons==========\n'
		+ util.inspect(newAutomaton, {
			depth: 5,
			colors: true,
		})
	)
	addToVisualize(newAutomaton, 'removed epsilons')

	return newAutomaton
}

function determine(originalAutomaton: Automaton): Automaton {
	const automaton = removeEpsilons(deepCopy(originalAutomaton))
	const states = [...Object.keys(automaton.fn)]

	while (states.length > 0) {
		const q = states.pop()!
		Object.keys(automaton.fn[q]).forEach(x => {
			if (automaton.fn[q][x].length > 1) {
				automaton.fn[q][x].sort(sortTransitions)
				let newQ = automaton.fn[q][x].map(t => t.q).join('')

				if (!automaton.fn[newQ]) {
					automaton.fn[newQ] = {}
					states.push(newQ)
				}

				Object.keys(automaton.fn[q]).forEach(x => {
					automaton.fn[q][x].forEach(t => {
						if (!automaton.fn[newQ][x])
							automaton.fn[newQ][x] = []
						automaton.fn[t.q][x].forEach(innerT => {
							if (automaton.fn[newQ][x].every(v => v.q !== innerT.q && v.y !== innerT.y)) {
								automaton.fn[newQ][x].push(innerT)
								automaton.fn[newQ][x].sort(sortTransitions)
							}
						})
					})
				})
			}
		})
	}

	Object.keys(automaton.fn).forEach(q => {
		Object.keys(automaton.fn[q]).forEach(x => {
			automaton.fn[q][x] = [{
				q: automaton.fn[q][x].map(t => t.q).join(''),
				y: automaton.fn[q][x].map(t => t.y).join(''),
			}]
		})
	})

	console.log('==========determined==========\n'
		+ util.inspect(automaton, {
		depth: 5,
		colors: true,
	}))
	addToVisualize(automaton, 'determined')

	return automaton
}

export {
	determine,
}