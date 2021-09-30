type Transition = {
	q: string
	y: string
}

type QTransitions = {
	[x: string]: Array<Transition>
}

interface Automaton {
	Q: Array<string>
	X: Array<string>
	Y: Array<string>
	fn: {
		[q: string]: QTransitions
	}
	q0?: string
	qf?: Array<string>
}

export {
	Automaton,
	Transition,
	QTransitions,
}
