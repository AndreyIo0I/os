import {Automaton, Transition} from '../types/types'
import * as fs from 'fs'

function getStates(rawData: string): [string, Array<string>] {
	return [
		rawData.split(':')[0].trim(),
		rawData.split(':')[1].trim().split(/\s+/),
	]
}

function readAutomaton(file: string): Automaton {
	const lines = fs.readFileSync(file, 'utf-8').trim().split(/(?:\r\n)+/)
	const automaton : Automaton = {
		Q: [],
		X: [],
		Y: [],
		fn: {},
	}

	if (lines[0] === 'Mr') {
		automaton.Q = lines[1].trim().split(/\s+/)
		automaton.Y = lines[2].trim().split(/\s+/)
		for (let i = 3; i < lines.length; ++i) {
			const [x, newStates] = getStates(lines[i])
			automaton.X.push(x)
			automaton.Q.forEach(q => {
				automaton.fn[q] = automaton.fn[q] || {}
				automaton.fn[q][x] = []
				const newQ = newStates.shift()
				automaton.fn[q][x].push(<Transition>{
					q: newQ,
					y: automaton.Y[automaton.Q.indexOf(<string>newQ)],
				})
			})
		}
	}
	else if (lines[0] === 'Ml') {
		automaton.Q = lines[1].trim().split(/\s+/)
		for (let i = 2; i <= lines.length - 1; i += 2) {
			const [x, newStates] = getStates(lines[i])
			const outputSignals = lines[i + 1].trim().split(/\s+/)
			automaton.X.push(x)
			automaton.Q.forEach(q => {
				automaton.fn[q] = automaton.fn[q] || {}
				automaton.fn[q][x] = []
				const transitionNewStates = newStates.shift()!.split(',')
				const transitionOutputSignals = outputSignals.shift()!.split(',')
				if (transitionNewStates.length !== transitionOutputSignals.length) {
					throw Error(`Number of new states and signals doesn't match`)
				}
				for (let i = 0; i < transitionNewStates.length; ++i) {
					automaton.fn[q][x].push({
						q: transitionNewStates[i],
						y: transitionOutputSignals[i],
					})
				}
			})
			automaton.Y.push(...lines[i + 1].trim().split(/\s+/))
		}
	}
	automaton.Y = [...new Set(automaton.Y)]

	return automaton
}

export {
	readAutomaton,
}