const parser = require('./jsxParser')

const {
  JSX_INLINE_PARSER,
  JSX_OPEN_TAG_PARSER,
  JSX_CLOSE_TAG_PARSER,
  JSX_SELF_CLOSE_TAG_PARSER
} = parser;


module.exports = function jsx_block(state, startLine, endLine, silent) {
  var i, nextLine, token, lineText, result, type,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

  if (state.src.charCodeAt(pos) !== 0x3C/* < */) { return false; }

  lineText = state.src.slice(pos, max);

  result = JSX_OPEN_TAG_PARSER.parse(lineText.trim());

  if (!result.status) { return false; }

  type = result.value.value

  if (silent) {
    // true if this sequence can be a terminator, false otherwise
    return true;
  }

  nextLine = startLine + 1;

  // If we are here - we detected HTML block.
  // Let's roll down till block end.
  const isSingleLine =
    new RegExp('</\\s*'+type+'\\s*>$').test(lineText) ||
    JSX_SELF_CLOSE_TAG_PARSER.parse(lineText.trim()).status

  if (!isSingleLine) {
    for (; nextLine < endLine; nextLine++) {
      if (state.sCount[nextLine] < state.blkIndent) { break; }

      pos = state.bMarks[nextLine] + state.tShift[nextLine];
      max = state.eMarks[nextLine];
      lineText = state.src.slice(pos, max);
      result = JSX_CLOSE_TAG_PARSER.parse(lineText)
      if (result.value === type) {
        if (lineText.length !== 0) { nextLine++; }
        break;
      }
    }
  }

  state.line = nextLine;

  token         = state.push('jsx_block', '', 0);
  token.map     = [ startLine, nextLine ];
  token.content = state.getLines(startLine, nextLine, state.blkIndent, true);

  return true;
};
