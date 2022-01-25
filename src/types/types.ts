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
