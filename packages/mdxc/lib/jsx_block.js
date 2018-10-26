'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = jsx_block;

var _jsxParser = require('./jsxParser');

var _transformJSX = require('./transformJSX');

var _transformJSX2 = _interopRequireDefault(_transformJSX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parseMarkdownContent(state, startIndent, startLine, maxLine) {
  var pos, max, lineText, blkIndent, indent;
  var nextLine = startLine;

  for (; nextLine < maxLine; nextLine++) {
    indent = state.sCount[nextLine];
    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];
    lineText = state.src.slice(pos, max);

    if (lineText === '') continue;
    if (indent < startIndent) return;
    if (blkIndent === undefined) {
      blkIndent = indent;
    } else if (lineText.slice(0, '</markdown>'.length) === '</markdown>' && state.sCount[nextLine] === startIndent) {
      return {
        key: '$$mdx_block_' + Math.random().toString(36).substring(7),
        contentStart: startLine,
        contentEnd: nextLine,
        blkIndent: blkIndent || 0
      };
    } else if (indent < blkIndent) {
      return;
    }
  }
}

function jsx_block(state, startLine, endLine, silent) {
  var i,
      nextLine,
      token,
      lineText,
      result,
      type,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

  if (state.src.charCodeAt(pos) !== 0x3C /* < */) {
      return false;
    }

  lineText = state.src.slice(pos, max);

  result = _jsxParser.JSX_OPEN_TAG_PARSER.parse(lineText.trim());

  if (!result.status) {
    return false;
  }

  type = result.value.value;

  if (silent) {
    // true if this sequence can be a terminator, false otherwise
    return true;
  }

  nextLine = startLine + 1;

  // If we are here - we detected HTML block.
  // Let's roll down till block end.
  var isSingleLine = _jsxParser.JSX_SELF_CLOSE_TAG_PARSER.parse(lineText).status || _jsxParser.JSX_CLOSE_TAG_PARSER.parse(lineText.slice(1)).status;

  var content = void 0;
  var js = void 0;
  var cumulative = lineText;
  var markdownContents = [];

  if (!isSingleLine) {
    for (; nextLine < endLine; nextLine++) {
      if (state.sCount[nextLine] < state.blkIndent) {
        break;
      }

      pos = state.bMarks[nextLine] + state.tShift[nextLine];
      max = state.eMarks[nextLine];
      lineText = state.src.slice(pos, max);

      if (lineText === '<markdown>') {
        var markdownContent = parseMarkdownContent(state, state.sCount[nextLine], nextLine + 1, endLine);
        if (markdownContent) {
          markdownContents.push(markdownContent);
          nextLine = markdownContent.contentEnd;
          continue;
        }
      }

      cumulative += lineText;
      var closeResult = _jsxParser.JSX_CLOSE_TAG_PARSER.parse(lineText);
      var selfCloseResult = _jsxParser.JSX_SELF_CLOSE_TAG_PARSER.parse(cumulative);

      if (selfCloseResult || closeResult.value === type) {
        var line = startLine;
        var codes = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = markdownContents[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _ref = _step.value;
            var key = _ref.key;
            var contentStart = _ref.contentStart;
            var contentEnd = _ref.contentEnd;
            var blkIndent = _ref.blkIndent;

            codes.push(state.getLines(line, contentStart - 1, state.blkIndent, true).trim(), '{' + key + '}');
            line = contentEnd + 1;
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        codes.push(state.getLines(line, nextLine + 1, state.blkIndent, true).trim());
        var code = codes.join('\n');

        js = (0, _transformJSX2.default)(code, state.md.options.pragma);

        if (js) {
          nextLine++;
          break;
        }
      }
    }
  }

  if (!js) {
    markdownContents = [];
    content = state.getLines(startLine, nextLine, state.blkIndent, true);
    js = (0, _transformJSX2.default)(content, state.md.options.pragma);
  }

  if (!js) {
    return false;
  }

  state.line = nextLine;

  var oldParentType = state.parentType;
  state.parentType = 'jsx';

  if (!silent) {
    if (markdownContents.length === 0) {
      token = state.push('jsx', '', 0);
      token.map = [startLine, nextLine];
      token.content = js;
    } else {
      var _line = 0;
      var jsLines = js.split('\n');
      var first = 1;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = markdownContents[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _ref2 = _step2.value;
          var _key = _ref2.key;
          var _contentStart = _ref2.contentStart;
          var _contentEnd = _ref2.contentEnd;
          var _blkIndent = _ref2.blkIndent;

          var _startLine = _line;
          while (jsLines[_line].indexOf(_key) === -1) {
            _line++;
          }

          if (_startLine !== _line) {
            token = state.push('jsx', '', first);
            token.content = jsLines.slice(_startLine, _line).join('\n').replace(/,$/, '');
          }

          first = 0;
          _line++;

          token = state.push('jsx', '', 1);
          token.content = 'wrapper({}';

          var originalLineMax = state.lineMax;
          var originalBlkIndent = state.blkIndent;
          state.blkIndent = _blkIndent;
          state.lineMax = _contentEnd;
          state.md.block.tokenize(state, _contentStart, _contentEnd);
          state.blkIndent = originalBlkIndent;
          state.lineMax = originalLineMax;

          token = state.push('jsx', '', -1);
          token.content = ')';
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      token = state.push('jsx', '', first - 1);
      token.content = jsLines.slice(_line).join('\n');
    }
  }

  state.line = nextLine;
  state.parentType = oldParentType;

  return true;
};