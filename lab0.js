const process = require('process')
const file = process.argv[2] || 'moore.txt'

const fs = require('fs')
const rawTable = fs.readFileSync(file, 'utf-8').split(/(?:\r\n)+/)
	.map(row => row.trim().split(/\s+/))

const table = {}
const states = rawTable[0]
const inputs = rawTable.slice(1).map(row => {
	const transitions = row.slice(1)
	table[row[0]] = {}
	for (let i = 0; i < transitions.length; ++i) {
		table[row[0]][states[i]] = transitions[i]
	}
	return row[0]
})

const machineType = rawTable[1][1].includes('/') ? 'mealy' : 'moore'
if (machineType === 'moore') {
	const newTable = [
		rawTable[0],
		...rawTable.slice(1).map(row => [
			row[0],
			...row.slice(1).map(state => state + '/y' + state.match(/\d+/)[0]),
		]),
	]
	console.log(newTable)
}
else {
	const newStates = [...new Set(rawTable.slice(1).map(row => row.slice(1)).flat())].sort()
	const newTable = [newStates]
	for (let i = 0; i < inputs.length; ++i) {
		newTable[i + 1] = [
			inputs[i],
			...newStates.map(state => {
				return table[inputs[i]][state.split(/\//)[0]]
			}),
		]
	}
	console.log(newTable)
}
