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
		fn: {},
	}

	if (lines[0] === 'Mr') {
		const states = lines[1].trim().split(/\s+/)
		const outputs = lines[2].trim().split(/\s+/)
		for (let i = 3; i < lines.length; ++i) {
			const [x, newStates] = getStates(lines[i])
			states.forEach(q => {
				automaton.fn[q] = automaton.fn[q] || {}
				automaton.fn[q][x] = []
				const newQ = newStates.shift()
				automaton.fn[q][x].push(<Transition>{
					q: newQ,
					y: outputs[states.indexOf(<string>newQ)],
				})
			})
		}
	}
	else if (lines[0] === 'Ml') {
		const states = lines[1].trim().split(/\s+/)
		for (let i = 2; i <= lines.length - 1; i += 2) {
			const [x, newStates] = getStates(lines[i])
			const outputSignals = lines[i + 1].trim().split(/\s+/)
			states.forEach(q => {
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
		}
	}

	return automaton
}

export {
	readAutomaton,
}