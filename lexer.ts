import * as process from 'process'
import fs from 'fs'
import {tokenize} from './src/utils/tokenize'

const fileName = process.argv[2] || 'lexer.ts'
const file = fs.readFileSync(fileName, 'utf-8')

try {
	// if (a > b)
	const tokens = tokenize(file)

	tokens.forEach(v => {
		console.log(`Token: ${v[0]}, value: ${JSON.stringify(v[1])}, line: ${v[2]}, position: ${v[3]}`)
	})
}
catch (e) {
	console.log(e)
}
