interface Automaton {
	Q: Array<string>
	X: Array<string>
	Y?: Array<string>
	fn: {
		[q: string]: {
			[x: string]: string
		}
	}
	q0?: string
	qf?: Array<string>
}

export {
	Automaton,
}
