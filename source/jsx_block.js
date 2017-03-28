import { JSX_OPEN_TAG_PARSER, JSX_CLOSE_TAG_PARSER, JSX_SELF_CLOSE_TAG_PARSER } from './jsxParser'
import transformJSX from './transformJSX'


export default function jsx_block(state, startLine, endLine, silent) {
  var i, nextLine, token, lineText, result, type,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

  if (state.src.charCodeAt(pos) !== 0x3C/* < */) { return false; }

  lineText = state.src.slice(pos, max);

  result = JSX_OPEN_TAG_PARSER.parse(lineText.trim());

  if (!result.status) { return false; }

  type = result.value

  if (silent) {
    // true if this sequence can be a terminator, false otherwise
    return true;
  }

  nextLine = startLine + 1;

  // If we are here - we detected HTML block.
  // Let's roll down till block end.
  const isSelfClosing =
    JSX_SELF_CLOSE_TAG_PARSER.parse(lineText.trim()).status

  let content
  let js

  if (!isSelfClosing) {
    for (; nextLine < endLine; nextLine++) {
      if (state.sCount[nextLine] < state.blkIndent) { break; }

      pos = state.bMarks[nextLine] + state.tShift[nextLine];
      max = state.eMarks[nextLine];
      lineText = state.src.slice(pos, max);
      result = JSX_CLOSE_TAG_PARSER.parse(lineText)
      if (result.value === type) {
        content = state.getLines(startLine, nextLine + 1, state.blkIndent, true)

        js = transformJSX(content)

        if (js) {
          nextLine++
          break;
        }
      }
    }
  }

  if (!js) {
     content = state.getLines(startLine, nextLine, state.blkIndent, true)
     js = transformJSX(content)
  }

  if (!js) {
    return false
  }

  state.line = nextLine;

  token         = state.push('jsx_block', '', 0);
  token.map     = [ startLine, nextLine ];
  token.content = js;

  return true;
};
