import {Automaton} from '../types/types'
import {determine} from './determine'

describe('test determination', () => {
	test('one transition, no changes', () => {
		const automaton: Automaton = {
			fn: {
				's0': {
					'x1': [{q: 's1', y: '1'}],
				},
				's1': {},
			},
		}
		const determined: Automaton = {
			fn: {
				's0': {
					'x1': [{q: 's1', y: '1'}],
				},
				's1': {},
			},
		}
		expect(determine(automaton)).toStrictEqual(determined)
	})

	test('simple with one x', () => {
		const automaton: Automaton = {
			fn: {
				's0': {
					'x1': [{q: 's1', y: '1'}, {q: 's2', y: '2'}],
				},
				's1': {},
				's2': {},
			},
		}
		const determined: Automaton = {
			fn: {
				's0': {
					'x1': [{q: 's1s2', y: '12'}],
				},
				's1': {},
				's2': {},
				's1s2': {},
			},
		}
		expect(determine(automaton)).toStrictEqual(determined)
	})

	test('save transitions', () => {
		const automaton: Automaton = {
			fn: {
				's0': {
					'x1': [{q: 's1', y: ''}, {q: 's2', y: ''}],
				},
				's1': {
					'x1': [{q: 's2', y: ''}],
				},
				's2': {
					'x1': [{q: 's3', y: ''}],
				},
				's3': {},
			},
		}
		const determined: Automaton = {
			fn: {
				's0': {
					'x1': [{q: 's1s2', y: ''}],
				},
				's1': {
					'x1': [{q: 's2', y: ''}],
				},
				's2': {
					'x1': [{q: 's3', y: ''}],
				},
				's3': {},
				's1s2': {
					'x1': [{q: 's2s3', y: ''}],
				},
				's2s3': {
					'x1': [{q: 's3', y: ''}],
				},
			},
		}
		expect(determine(automaton)).toStrictEqual(determined)
	})

	test('different inputs', () => {
		const automaton: Automaton = {
			fn: {
				's0': {
					'a': [{q: 's1', y: ''}, {q: 's2', y: ''}],
				},
				's1': {
					'b': [{q: 's2', y: ''}],
				},
				's2': {
					'b': [{q: 's3', y: ''}],
				},
				's3': {},
			},
		}
		const determined: Automaton = {
			fn: {
				's0': {
					'a': [{q: 's1s2', y: ''}],
				},
				's1': {
					'b': [{q: 's2', y: ''}],
				},
				's2': {
					'b': [{q: 's3', y: ''}],
				},
				's3': {},
				's1s2': {
						'b': [{q: 's2s3', y: ''}],
				},
				's2s3': {
					'b': [{q: 's3', y: ''}],
				},
			},
		}
		expect(determine(automaton)).toStrictEqual(determined)
	})

	test('simple with two x', () => {
		const automaton: Automaton = {
			fn: {
				's0': {
					'x1': [{q: 's1', y: ''}, {q: 's2', y: ''}],
					'x2': [{q: 's2', y: ''}, {q: 's3', y: ''}],
				},
				's1': {},
				's2': {},
				's3': {},
			},
		}
		const determined: Automaton = {
			fn: {
				's0': {
					'x1': [{q: 's1s2', y: ''}],
					'x2': [{q: 's2s3', y: ''}],
				},
				's1': {},
				's2': {},
				's3': {},
				's1s2': {},
				's2s3': {},
			},
		}
		expect(determine(automaton)).toStrictEqual(determined)
	})
})