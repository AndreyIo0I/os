"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenize = void 0;
const consts_1 = require("../consts");
function isIdentifierStart(ch) {
    const chCode = ch.charCodeAt(0);
    return chCode >= 65 && chCode <= 90 || chCode >= 97 && chCode <= 122 || chCode === 36 || chCode === 95;
}
function isIdentifierPart(ch) {
    if (isIdentifierStart(ch))
        return true;
    const chCode = ch.charCodeAt(0);
    return chCode >= 48 && chCode <= 57;
}
function tokenize(file) {
    const tokens = [];
    let pos = 0;
    let startPos = 0;
    let line = 1;
    let linePos = 0;
    function incLine() {
        ++line;
        linePos = pos;
    }
    function addToken(name) {
        tokens.push([name, file.substring(startPos, pos), line, startPos - linePos + 1]);
    }
    while (pos < file.length) {
        startPos = pos;
        let ch = file.charAt(startPos);
        if ([' ', '\t'].includes(ch)) {
            ++pos;
            continue;
        }
        if ('\r\n'.includes(ch)) {
            if (file.substring(pos, pos + 2) === '\r\n')
                ++pos;
            ++pos;
            incLine();
            continue;
        }
        if (file.substring(pos, pos + 3) === '===') {
            pos += 3;
            addToken('Equality');
            continue;
        }
        if (file.substring(pos, pos + 2) === '==') {
            pos += 2;
            addToken('StrictEquality');
            continue;
        }
        if (file.substring(pos, pos + 2) === '=>') {
            pos += 2;
            addToken('FunctionArrow');
            continue;
        }
        if (file.substring(pos, pos + 2) === '+=') {
            pos += 2;
            addToken('AdditionAssignment');
            continue;
        }
        if (file.substring(pos, pos + 2) === '&=') {
            pos += 2;
            addToken('BitwiseAndAssignment');
            continue;
        }
        if (file.substring(pos, pos + 2) === '++') {
            pos += 2;
            addToken('Increment');
            continue;
        }
        if (file.substring(pos, pos + 2) === '--') {
            pos += 2;
            addToken('Decrement');
            continue;
        }
        if (file.substring(pos, pos + 2) === '||') {
            pos += 2;
            addToken('LogicalOr');
            continue;
        }
        if (file.substring(pos, pos + 1) === '|') {
            pos += 1;
            addToken('BitwiseOr');
            continue;
        }
        if (ch === '=') {
            ++pos;
            addToken('Assignment');
            continue;
        }
        if (file.substring(pos, pos + 2) === '//') {
            pos += 2;
            while (!['\n', '\r'].includes(file.charAt(pos)))
                ++pos;
            addToken('LineComment');
            if (file.substring(pos, pos + 2) === '\r\n')
                ++pos;
            continue;
        }
        if (file.substring(pos, pos + 2) === '/*') {
            pos += 2;
            while (file.charAt(pos - 1) !== '*' && file.charAt(pos) !== '/')
                ++pos;
            addToken('MultilineComment');
            continue;
        }
        if (ch === '*') {
            ++pos;
            addToken('Asterisk');
            continue;
        }
        if (ch === '/') {
            ++pos;
            while (['\n', '\r'].includes(file.charAt(pos)))
                ++pos;
            addToken('Regexp');
            continue;
        }
        if ('.,:;?!'.includes(ch)) {
            ++pos;
            addToken('Separator');
            continue;
        }
        if (ch.match(/\d/)) {
            ++pos;
            while (file.charAt(pos).match(/\d/))
                ++pos;
            addToken('Number');
            continue;
        }
        if ('()[]{}'.includes(ch)) {
            ++pos;
            addToken('Bracket');
            continue;
        }
        if ('\'\"\`'.includes(ch)) {
            ++pos;
            while (file.charAt(pos) !== ch || (file.charAt(pos) === ch && file.charAt(pos - 1) === '\\')) {
                if (ch !== '\`' && '\r\n'.includes(file.charAt(pos)))
                    throw Error(`unexpected ${JSON.stringify(file.charAt(pos))} in string at ${line}:${startPos - linePos + 1}`);
                ++pos;
            }
            ++startPos;
            addToken('String');
            ++pos;
            continue;
        }
        if (isIdentifierStart(ch)) {
            ++pos;
            while (isIdentifierPart(file.charAt(pos)))
                ++pos;
            const identifier = file.substring(startPos, pos);
            if (consts_1.RESERVED_WORDS.has(identifier))
                addToken('ReservedWord');
            else
                addToken('Identifier');
            continue;
        }
        throw Error(`unexpected ${JSON.stringify(ch)} at ${line}:${startPos - linePos + 1}`);
    }
    return tokens;
}
exports.tokenize = tokenize;
