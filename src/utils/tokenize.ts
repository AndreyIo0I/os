const RESERVED_WORDS = new Set(['abstract', 'any', 'as', 'asserts', 'assert', 'bigint', 'boolean', 'break', 'case', 'catch', 'class', 'continue', 'const', 'debugger', 'declare', 'default', 'delete', 'do', 'else', 'enum', 'export', 'extends', 'false', 'finally', 'for', 'from', 'function', 'get', 'if', 'implements', 'import', 'in', 'infer', 'instanceof', 'interface', 'intrinsic', 'is', 'keyof', 'let', 'module', 'namespace', 'never', 'new', 'null', 'number', 'object', 'package', 'private', 'protected', 'public', 'override', 'out', 'readonly', 'require', 'global', 'return', 'set', 'static', 'string', 'super', 'switch', 'symbol', 'this', 'throw', 'true', 'try', 'type', 'typeof', 'undefined', 'unique', 'unknown', 'var', 'void', 'while', 'with', 'yield', 'async', 'await', 'of'])

function isDigit(ch: string) {
	const chCode = ch.charCodeAt(0)
	return chCode >= 48 && chCode <= 57
}

function isIdentifierStart(ch: string) {
	const chCode = ch.charCodeAt(0)
	return chCode >= 65 && chCode <= 90 || chCode >= 97 && chCode <= 122 || chCode === 36 || chCode === 95
}

function isIdentifierPart(ch: string) {
	if (isIdentifierStart(ch))
		return true
	return isDigit(ch)
}

const trivialTokens = [
	['{', 'OpenBraceToken'],
	['}', 'CloseBraceToken'],
	['(', 'OpenParenToken'],
	[')', 'CloseParenToken'],
	['[', 'OpenBracketToken'],
	[']', 'CloseBracketToken'],
	['.', 'DotToken'],
	['...', 'DotDotDotToken'],
	[';', 'SemicolonToken'],
	[',', 'CommaToken'],
	['<', 'LessThanToken'],
	['>', 'GreaterThanToken'],
	['<=', 'LessThanEqualsToken'],
	['>=', 'GreaterThanEqualsToken'],
	['==', 'EqualsEqualsToken'],
	['!=', 'ExclamationEqualsToken'],
	['===', 'EqualsEqualsEqualsToken'],
	['!==', 'ExclamationEqualsEqualsToken'],
	['=>', 'EqualsGreaterThanToken'],
	['+', 'PlusToken'],
	['-', 'MinusToken'],
	['**', 'AsteriskAsteriskToken'],
	['*', 'AsteriskToken'],
	['/', 'SlashToken'],
	['%', 'PercentToken'],
	['++', 'PlusPlusToken'],
	['--', 'MinusMinusToken'],
	['<<', 'LessThanLessThanToken'],
	['>>', 'GreaterThanGreaterThanToken'],
	['>>>', 'GreaterThanGreaterThanGreaterThanToken'],
	['&', 'AmpersandToken'],
	['|', 'BarToken'],
	['^', 'CaretToken'],
	['!', 'ExclamationToken'],
	['~', 'TildeToken'],
	['&&', 'AmpersandAmpersandToken'],
	['||', 'BarBarToken'],
	['?', 'QuestionToken'],
	['??', 'QuestionQuestionToken'],
	['?.', 'QuestionDotToken'],
	[':', 'ColonToken'],
	['=', 'EqualsToken'],
	['+=', 'PlusEqualsToken'],
	['-=', 'MinusEqualsToken'],
	['*=', 'AsteriskEqualsToken'],
	['**=', 'AsteriskAsteriskEqualsToken'],
	['/=', 'SlashEqualsToken'],
	['%=', 'PercentEqualsToken'],
	['<<=', 'LessThanLessThanEqualsToken'],
	['>>=', 'GreaterThanGreaterThanEqualsToken'],
	['>>>=', 'GreaterThanGreaterThanGreaterThanEqualsToken'],
	['&=', 'AmpersandEqualsToken'],
	['|=', 'BarEqualsToken'],
	['^=', 'CaretEqualsToken'],
	['||=', 'BarBarEqualsToken'],
	['&&=', 'AmpersandAmpersandEqualsToken'],
	['??=', 'QuestionQuestionEqualsToken'],
].sort((a, b) => {
	if (a[0].length < b[0].length)
		return 1
	else if (a[0].length === b[0].length)
		return 0
	return -1
})

type TokenInfo = {
	token: string,
	value: string,
	line: number,
	position: number,
}

function tokenize(file: string): Array<TokenInfo> {
	const tokens: Array<TokenInfo> = []
	let pos = 0
	let startPos = 0
	let line = 1
	let linePos = 0
	let lastToken = ''

	function incLine() {
		++line
		linePos = pos
	}

	function addToken(name: string) {
		lastToken = name
		tokens.push({
			token: name,
			value: file.substring(startPos, pos),
			line: line,
			position: startPos - linePos + 1,
		})
	}

	while (pos < file.length) {
		startPos = pos
		let ch = file.charAt(startPos)

		if ([' ', '\t'].includes(ch)) {
			++pos
			continue
		}
		if ('\r\n'.includes(ch)) {
			if (file.substring(pos, pos + 2) === '\r\n')
				++pos
			++pos
			incLine()
			continue
		}

		if (file.substring(pos, pos + 2) === '//') {
			pos += 2
			while (!'\n\r'.includes(file.charAt(pos)))
				++pos
			addToken('LineComment')
			continue
		}
		if (file.substring(pos, pos + 2) === '/*') {
			pos += 2
			while (file.charAt(pos - 1) !== '*' && file.charAt(pos) !== '/')
				++pos
			addToken('MultilineComment')
			continue
		}

		if (isDigit(ch)) {
			++pos
			while (isDigit(file.charAt(pos)))
				++pos
			addToken('Number')
			continue
		}
		if ('\'\"\`'.includes(ch)) {
			++pos
			while (file.charAt(pos) !== ch) {
				if (ch !== '\`' && '\r\n'.includes(file.charAt(pos)))
					throw Error(`unexpected end of line at ${line}:${pos - linePos + 1}`)
				if (file.charAt(pos) === '\\')
					++pos
				++pos
			}
			++startPos
			addToken('String')
			++pos
			continue
		}

		if (isIdentifierStart(ch)) {
			++pos
			while (isIdentifierPart(file.charAt(pos)))
				++pos
			const identifier = file.substring(startPos, pos)
			if (RESERVED_WORDS.has(identifier))
				addToken('ReservedWord')
			else
				addToken('Identifier')
			continue
		}

		let trivialFounded = false
		trivialTokens.some(token => {
			if (token[0] === file.substring(pos, pos + token[0].length)) {
				trivialFounded = true
				pos += token[0].length
				addToken(token[1])
				return true
			}
			return false
		})
		if (trivialFounded)
			continue

		throw Error(`unexpected ${JSON.stringify(ch)} at ${line}:${startPos - linePos + 1}`)
	}

	return tokens
}

export {
	tokenize,
}