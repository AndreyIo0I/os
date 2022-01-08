import {readAutomaton} from './src/utils/read'
import * as process from 'process'
import * as util from 'util'
import fs from 'fs'
import {convertToMoore} from './src/utils/convert'

const file = process.argv[2] || 'moore.txt'

const automaton = readAutomaton(file)
const fileData = fs.readFileSync(file, 'utf-8')

if (fileData.startsWith('Ml')) {
	convertToMoore(automaton)

	console.log(util.inspect(automaton, {
		depth: 5,
		colors: true,
	}))
}
else {
	console.log(util.inspect(automaton, {
		depth: 5,
		colors: true,
	}))
}
