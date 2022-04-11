import {Automaton} from '../types/types'
import * as fs from 'fs'
import {addToVisualize} from './server'

function getStates(rawData: string): [string, Array<string>] {
	return [
		rawData.split(':')[0].trim(),
		rawData.split(':')[1].trim().split(/\s+/),
	]
}

function readAutomaton(file: string): Automaton {
	const lines = fs.readFileSync(file, 'utf-8').trim().split(/(?:\r\n)+/)
	const automaton: Automaton = {
		fn: {},
	}

	if (lines[0] === 'Mr') {
		const states = lines[1].trim().split(/\s+/)
		const outputs = lines[2].trim().split(/\s+/)
		for (let i = 3; i < lines.length; ++i) {
			const [x, newStates] = getStates(lines[i])
			for (let j = 0; j < states.length; ++j) {
				const q = states[j]
				const y = outputs[j]
				automaton.fn[q] = automaton.fn[q] || {}
				automaton.fn[q][x] = []
				const newQ = newStates.shift()!
				if (!states.includes(newQ))
					automaton.fn[newQ] = {}
				automaton.fn[q][x].push({
					q: newQ,
					y: y,
				})
			}
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
					if (!automaton.fn[transitionNewStates[i]])
						automaton.fn[transitionNewStates[i]] = {}
					automaton.fn[q][x].push({
						q: transitionNewStates[i],
						y: transitionOutputSignals[i],
					})
				}
			})
		}
	}

	addToVisualize(automaton, 'read from file')
	return automaton
}

function readRightRegularGrammar(file: string): Automaton {
	const lines = fs.readFileSync(file, 'utf-8').trim().split(/(?:\r\n)+/)
	const leftRegular = lines.shift() === 'L'
	const automaton: Automaton = {
		fn: {},
		qs: lines[0][0],
	}

	let endStateCount = 0

	function createNewState(base: string) {
		const newStateName = base + (endStateCount ? endStateCount : '')
		++endStateCount
		automaton.fn[newStateName] = {}
		return newStateName
	}

	lines.forEach(line => {
		const state = line[0]
		const transitions = line.substring(5).trim().split(/\s*\|\s*/)

		if (leftRegular) {
			transitions.forEach(t => {
				const x = t.length == 2 ? t[1] : t[0]
				const q = t.length == 2 ? t[0] : '_S'

				if (t.length == 1 && automaton.qs === state)
					automaton.qs = q
				if (!automaton.fn[q])
					automaton.fn[q] = {}
				if (!automaton.fn[q][x])
					automaton.fn[q][x] = []

				automaton.fn[q][x].push({
					q: state,
					y: '',
				})

				if (!automaton.fn[state])
					automaton.fn[state] = {}
			})
		}
		else {
			if (!automaton.fn[state])
				automaton.fn[state] = {}

			transitions.forEach(t => {
				const x = t[0]
				const q = t[1] ?? createNewState('_F')

				if (!automaton.fn[state][x])
					automaton.fn[state][x] = []

				automaton.fn[state][x].push({
					q: q,
					y: '',
				})

				if (!automaton.fn[q])
					automaton.fn[q] = {}
			})
		}
	})

	addToVisualize(automaton, 'read from right regular grammar')
	return automaton
}

export {
	readAutomaton,
	readRightRegularGrammar,
}