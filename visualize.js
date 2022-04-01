fetch('visualize.json').then(async response => {
	const info = await response.json()

	info.forEach(({automaton, text}) => {
		const description = document.createElement('h3')
		description.innerHTML = text

		const container = document.createElement('div')
		container.classList.add('container')

		document.body.append(document.createElement('hr'))
		document.body.append(description)
		document.body.append(container)

		const nodes = new vis.DataSet(Object.keys(automaton.fn).map(q => ({
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

		const data = {
			nodes: nodes,
			edges: edges,
		}
		const options = {
			layout: {
				randomSeed: 64,
			},
			clickToUse: true,
		}

		const network = new vis.Network(container, data, options)
	})
})