fetch('automaton.json').then(response => {
	response.json().then(automaton => {
		const nodes = new vis.DataSet(automaton.Q.map(q => ({
			id: q,
			label: q,
		})))

		const edges = new vis.DataSet(Object.keys(automaton.fn).flatMap(q =>
			Object.keys(automaton.fn[q]).flatMap(x =>
				automaton.fn[q][x].map(t => ({
					from: q,
					to: t.q,
					label: t.y ? `${x}/${t.y}` : x,
					arrows: 'to',
				}))
			)
		))

		const container = document.getElementById('automaton')
		const data = {
			nodes: nodes,
			edges: edges,
		}
		const options = {
			layout: {
				randomSeed: 64,
			}
		}
		const network = new vis.Network(container, data, options)
	})
})