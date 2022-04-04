import {Automaton} from '../types/types'
import {minimize} from './minimize'

describe('test minimization', () => {
	test('without start state', () => {
		const automaton: Automaton = {
			fn: {
				's0': {
					'a': [{q: 's1s7', y: ''}],
				},
				's11': {},
				's7': {
					'b': [{q: 's11', y: ''}],
				},
				's1': {
					'b': [{q: 's11', y: ''}],
				},
				's1s7': {},
			},
		}
		const minimized: Automaton = {
			fn: {
				's0': {
					'a': [{q: 's11', y: ''}],
				},
				's11': {},
				's7': {
					'b': [{q: 's11', y: ''}],
				},
			},
		}
		minimize(automaton)
		expect(automaton).toStrictEqual(minimized)
	})

	test('with start state', () => {
		const automaton: Automaton = {
			fn: {
				's0': {
					'a': [{q: 's1s7', y: ''}],
				},
				's11': {},
				's7': {
					'b': [{q: 's11', y: ''}],
				},
				's1': {
					'b': [{q: 's11', y: ''}],
				},
				's1s7': {},
			},
			qs: 's0',
		}
		const minimized: Automaton = {
			fn: {
				's0': {
					'a': [{q: 's1s7', y: ''}],
				},
				's1s7': {},
			},
			qs: 's0',
		}
		minimize(automaton)
		expect(automaton).toStrictEqual(minimized)
	})
})