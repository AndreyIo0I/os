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
			color: automaton.qs === q ? '#a9e085' : '#9ecbff',
		})))

		const edges = new vis.DataSet(Object.keys(automaton.fn).flatMap(q => {
			const edges = Object.keys(automaton.fn[q]).flatMap(x =>
				automaton.fn[q][x].map(t => ({
					from: q,
					to: t.q,
					label: t.y ? `${x}/${t.y}` : x,
					arrows: 'to',
					color: '#9ecbff',
				})),
			)
			const groupedEdges = []
			edges.forEach(edge => {
				const group = groupedEdges.find(group => group.from === edge.from && group.to === edge.to)
				if (group)
					group.label += ', ' + edge.label
				else
					groupedEdges.push(edge)
			})

			return groupedEdges
		}))

		const data = {
			nodes,
			edges,
		}
		const options = {
			layout: {
				randomSeed: 64,
			},
			clickToUse: true,
		}

		new vis.Network(container, data, options)
	})
})