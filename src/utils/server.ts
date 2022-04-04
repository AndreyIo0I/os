import express from 'express'
import {Automaton} from '../types/types'
import fs from 'fs'
import {deepCopy} from './utils'

type Info = Array<{
	text: string,
	automaton: Automaton,
}>

let info: Info = []

function addToVisualize(automaton: Automaton, text = ''): void {
	info.push(deepCopy({
		text,
		automaton,
	}))
}

function runServer(): void {
	fs.writeFileSync('visualize.json', JSON.stringify(info.reverse()))

	const app = express()
	const port = 3000

	app.use(express.static(__dirname + '\\..\\..'))

	app.listen(port, () => {
		console.log('see http://localhost:3000')
	})
}

export {
	runServer,
	addToVisualize,
}