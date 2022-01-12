import {Automaton} from '../types/types'
import {isMoore} from './utils'

function printAutomaton(automaton: Automaton, asMealy = false): void {
	if (!asMealy && isMoore(automaton)) {
		const stateToValue: { [q: string]: string } = {}
		automaton.Q.forEach(q => {
			automaton.X.forEach(x => {
				stateToValue[automaton.fn[q][x][0].q] = automaton.fn[q][x][0].y
			})
		})

		process.stdout.write('Mr\n')
		process.stdout.write('    ' + automaton.Q.join(' ') + '\n')
		/*
		 * '__' используется для неопределённого значения,
		 * когда в форме милли в это состояние нельзя было попасть из другого
		 */
		process.stdout.write('    ' + automaton.Q.map(q => stateToValue[q] || '__').join(' ') + '\n')
		automaton.X.forEach(x => {
			process.stdout.write(x + ': ')
			process.stdout.write(automaton.Q.map(q => automaton.fn[q][x].map(t => t.q).join(',')).join(' ') + '\n')
		})
	}
	else {
		process.stdout.write('Ml\n')
		process.stdout.write('    ' + automaton.Q.join(' ') + '\n')
		automaton.X.forEach(x => {
			process.stdout.write(x + ': ')
			process.stdout.write(automaton.Q.map(q => automaton.fn[q][x].map(t => t.q).join(',')).join(' ') + '\n')
			process.stdout.write('    ' + automaton.Q.map(q => automaton.fn[q][x].map(t => t.y).join(',')).join(' ') + '\n')
		})
	}
}

export {
	printAutomaton,
}