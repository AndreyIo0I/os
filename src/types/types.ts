interface Automaton {
	Q: Array<string>
	X: Array<string>
	Y: Array<string>
	fn: {
		[q: string]: {
			[x: string]: Array<{
				q: string
				y: string
			}>
		}
	}
	q0?: string
	qf?: Array<string>
}

export {
	Automaton,
}
