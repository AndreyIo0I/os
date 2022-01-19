type Transition = {
	q: string
	y: string
}

type QTransitions = {
	[x: string]: Array<Transition>
}

type Transitions = {
	[q: string]: QTransitions
}

interface Automaton {
	Q: Array<string>
	X: Array<string>
	Y: Array<string>
	fn: Transitions
	qs?: string
	qf?: string
}

export {
	Automaton,
	Transition,
	Transitions,
	QTransitions,
}
