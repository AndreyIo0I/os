import {Automaton} from '../types/types'
const process = require('process')
const file = process.argv[2]
const fs = require('fs')

function readAutomaton(): Automaton {
	const lines = fs.readFileSync(file, 'utf-8').trim().split(/(?:\r\n)+/)
	const automaton : Automaton = {
		Q: [],
		X: [],
		Y: [],
		fn: {},
	}

	if (lines[0] === 'Mr') {
		automaton.Q = lines[4].trim().split(/\s+/)
		automaton.Y = lines[5].trim().split(/\s+/)
		for (let i = 6; i < lines.length; ++i) {
			const x = lines[i].split(':')[0].trim()
			const newStates = lines[i].split(':')[1].trim().split(/\s+/)
			automaton.X.push(x)
			automaton.Q.forEach(q => {
				automaton.fn[q] = automaton.fn[q] || {}
				automaton.fn[q][x] = newStates.shift()
			})
		}
	}
	else if (lines[0] === 'Ml') {

	}

	return automaton
}

export {
	readAutomaton,
}