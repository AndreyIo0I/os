import {Automaton, Transitions} from '../types/types'

type NameGenerator = Generator<string, string>

function* nameGenerator(base: string): NameGenerator {
	for (let i = 0;; ++i) {
		yield base + i
	}
}

const OPERATOR_PRIORITY = {
	'|': 1,
	'&': 2,
	'*': 3,
}

function regexToPostfix(originRegex: string): Array<string> {
	const regexArray: Array<string> = []

	originRegex.split('').forEach((v, i) => {
		regexArray.push(v)
		const nextV = originRegex[i + 1] ?? ''
		if ((v + nextV).match(/([a-z\d)*][a-z\d(])/)) {
			regexArray.push('&')
		}
	})

	const output: Array<string> = []
	const operatorStack: Array<'*'|'|'|'&'|'('> = []
	regexArray.forEach(v => {
		if (v.match(/[a-z\d]/)) {
			output.push(v)
		}
		else if (v === '(') {
			operatorStack.push(v)
		}
		else if (v === ')') {
			let closed = false
			while (operatorStack.length > 0) {
				const topElement = operatorStack.pop()!
				if (topElement !== '(') {
					output.push(topElement)
				}
				else {
					closed = true
					break
				}
			}
			if (!closed) {
				throw Error('unclosed parentheses')
			}
		}
		else if (v === '&' || v === '|' || v === '*') {
			let topOperator = operatorStack[operatorStack.length - 1]
			while (operatorStack.length && topOperator !== '(' && OPERATOR_PRIORITY[topOperator] >= OPERATOR_PRIORITY[v]) {
				output.push(operatorStack.pop()!)
				topOperator = operatorStack[operatorStack.length - 1]
			}
			operatorStack.push(v)
		}
		else {
			throw Error('unhandled symbol')
		}
	})

	output.push(...operatorStack.reverse())

	return output
}

function createValueNfa(value: string, stateNameGenerator: NameGenerator): Automaton {
	const qs = stateNameGenerator.next().value
	const qf = stateNameGenerator.next().value
	return {
		Q: [qs, qf],
		X: [value],
		Y: [],
		fn: {
			[qs]: {
				[value]: [
					{
						q: qf,
						y: '',
					},
				],
			},
			[qf]: {},
		},
		qs: qs,
		qf: qf,
	}
}

function createOnionNfa(nfa1: Automaton, nfa2: Automaton, stateNameGenerator: NameGenerator): Automaton {
	const qs = stateNameGenerator.next().value
	const qf = stateNameGenerator.next().value

	const fn: Transitions = {
		[qs]: {
			'@': [
				{
					q: nfa1.qs!,
					y: '',
				},
				{
					q: nfa2.qs!,
					y: '',
				},
			],
		},
		[qf]: {},
	}
	Object.keys(nfa1.fn).forEach(q => {
		fn[q] = nfa1.fn[q]
	})
	Object.keys(nfa2.fn).forEach(q => {
		fn[q] = nfa2.fn[q]
	})
	fn[nfa1.qf!] = {
		'@': [
			{
				q: qf,
				y: '',
			}
		]
	}
	fn[nfa2.qf!] = {
		'@': [
			{
				q: qf,
				y: '',
			}
		]
	}

	return {
		Q: [qs, qf, ...nfa1.Q, ...nfa2.Q],
		X: [...new Set([...nfa1.X, ...nfa2.X, '@'])],
		Y: [],
		fn,
		qs,
		qf,
	}
}

function createConcatNfa(nfa1: Automaton, nfa2: Automaton, stateNameGenerator: NameGenerator): Automaton {
	const qs = stateNameGenerator.next().value
	const qf = stateNameGenerator.next().value

	nfa1.fn[nfa1.qf!] = {
		'@': [{
			q: nfa2.qs!,
			y: '',
		}]
	}
	nfa2.fn[nfa2.qf!] = {
		'@': [{
			q: qf,
			y: '',
		}]
	}

	const fn: Transitions = {
		[qs]: {
			'@': [
				{
					q: nfa1.qs!,
					y: '',
				},
			],
		},
		[qf]: {},
	}
	Object.keys(nfa2.fn).forEach(q => {
		fn[q] = nfa2.fn[q]
	})
	Object.keys(nfa1.fn).forEach(q => {
		fn[q] = nfa1.fn[q]
	})

	return {
		Q: [qs, qf, ...nfa1.Q, ...nfa2.Q],
		X: [...new Set([...nfa1.X, ...nfa2.X, '@'])],
		Y: [],
		fn,
		qs,
		qf,
	}
}

function createStarNfa(nfa1: Automaton, stateNameGenerator: NameGenerator): Automaton {
	const qs = stateNameGenerator.next().value
	const qf = stateNameGenerator.next().value

	const fn: Transitions = {
		[qs]: {
			'@': [
				{
					q: nfa1.qs!,
					y: '',
				},
				{
					q: qf,
					y: '',
				},
			],
		},
		[qf]: {},
	}
	fn[nfa1.qf!] = {
		'@': [
			{
				q: qf,
				y: '',
			}
		]
	}
	Object.keys(nfa1.fn).forEach(q => {
		fn[q] = nfa1.fn[q]
	})

	return {
		Q: [qs, qf, ...nfa1.Q],
		X: [...new Set([...nfa1.X, '@'])],
		Y: [],
		fn,
		qs,
		qf,
	}
}

// @ - epsilon
function regexToAutomaton(regex: string): Automaton {
	const postfixRegex = regexToPostfix(regex)

	const stateNameGenerator = nameGenerator('s')

	const nfaStack: Array<Automaton> = []
	postfixRegex.forEach(v => {
		if (v.match(/[a-z\d]/)) {
			nfaStack.push(createValueNfa(v, stateNameGenerator))
		}
		else if (v === '|') {
			nfaStack.push(createOnionNfa(nfaStack.pop()!, nfaStack.pop()!, stateNameGenerator))
		}
		else if (v === '&') {
			const nfa1 = nfaStack.pop()!
			const nfa2 = nfaStack.pop()!
			nfaStack.push(createConcatNfa(nfa2, nfa1, stateNameGenerator))
		}
		else if (v === '*') {
			nfaStack.push(createStarNfa(nfaStack.pop()!, stateNameGenerator))
		}
	})

	return nfaStack.pop()!
}

export {
	regexToAutomaton,
}