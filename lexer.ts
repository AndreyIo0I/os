import * as process from 'process'
import fs from 'fs'
import {tokenize} from './src/utils/tokenize'

const fileName = process.argv[2] || 'lexer.ts'
const file = fs.readFileSync(fileName, 'utf-8')

try {
	const tokens = tokenize(file)

	console.table(tokens, ['token', 'value', 'line', 'position'])
}
catch (e) {
	console.log(e)
}
