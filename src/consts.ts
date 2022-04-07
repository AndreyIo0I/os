const EPSILON = 'ε'

const RESERVED_WORDS = new Set(['abstract', 'any', 'as', 'asserts', 'assert', 'bigint', 'boolean', 'break', 'case', 'catch', 'class', 'continue', 'const', 'debugger', 'declare', 'default', 'delete', 'do', 'else', 'enum', 'export', 'extends', 'false', 'finally', 'for', 'from', 'function', 'get', 'if', 'implements', 'import', 'in', 'infer', 'instanceof', 'interface', 'intrinsic', 'is', 'keyof', 'let', 'module', 'namespace', 'never', 'new', 'null', 'number', 'object', 'package', 'private', 'protected', 'public', 'override', 'out', 'readonly', 'require', 'global', 'return', 'set', 'static', 'string', 'super', 'switch', 'symbol', 'this', 'throw', 'true', 'try', 'type', 'typeof', 'undefined', 'unique', 'unknown', 'var', 'void', 'while', 'with', 'yield', 'async', 'await', 'of'])

export {
	EPSILON,
	RESERVED_WORDS,
}