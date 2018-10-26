'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = jsx_inline;

var _jsxParser = require('./jsxParser');

var _transformJSX = require('./transformJSX');

var _transformJSX2 = _interopRequireDefault(_transformJSX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Iterate through a JSX tag's content until the closing tag is found, making
// sure to skip nested JSX and to not match closing tags in code blocks.
// Process JSX tags.
// Based on https://github.com/osnr/markdown-it-jsx/blob/8182cd42db551b03f0f73653a4fbee0948807dd4/lib/jsx_inline.js

function parseJSXContent(state, start, type) {
  var text,
      result,
      max = state.posMax,
      prevPos,
      oldPos = state.pos;

  state.pos = start;

  while (state.pos < max) {
    text = state.src.slice(state.pos);
    result = _jsxParser.JSX_INLINE_CLOSE_TAG_PARSER.parse(text);

    prevPos = state.pos;
    state.md.inline.skipToken(state);

    if (result.status && result.value.value === type && prevPos === state.pos - 1) {
      // restore old state
      state.pos = oldPos;
      return { contentEnd: prevPos, closeEnd: prevPos + result.value.end.offset };
    }
  }

  // restore old state
  state.pos = oldPos;
};

function isLetter(ch) {
  var lc = ch | 0x20; // to lower case
  return lc >= 0x61 /* a */ && lc <= 0x7a /* z */;
}

function jsx_inline(state, silent) {
  var result,
      max,
      token,
      pos = state.pos;

  // Check start
  max = state.posMax;
  var firstCh = state.src.charCodeAt(pos);
  if (firstCh !== 0x3C /* < */ && firstCh !== 0x7B /* { */ || pos + 2 >= max) {
    return false;
  }

  // Quick fail on second char if < was first char
  var secondCh = state.src.charCodeAt(pos + 1);
  if (secondCh === 0x3C /* < */ && secondCh !== 0x21 /* ! */ && secondCh !== 0x3F /* ? */ && secondCh !== 0x2F /* / */ && !isLetter(secondCh)) {
    return false;
  }

  var text = state.src.slice(pos);

  result = _jsxParser.JSX_INLINE_OPEN_TAG_PARSER.parse(text);

  if (!result.status) {
    return false;
  }

  var selfClosing = _jsxParser.JSX_INLINE_SELF_CLOSE_TAG_PARSER.parse(text);

  if (selfClosing.status) {
    var _content = state.src.slice(pos, pos + selfClosing.value.end.offset);
    var _js = (0, _transformJSX2.default)(_content, state.md.options.pragma);

    if (!_js) {
      return false;
    }

    if (!silent) {
      token = state.push('jsx', '', 0);
      token.content = _js;
    }

    state.pos += selfClosing.value.end.offset;
    return true;
  }

  var contentStart = state.pos + result.value.end.offset;
  var contentObj = parseJSXContent(state, contentStart, result.value.value);
  if (!contentObj) {
    return false;
  }
  var contentEnd = contentObj.contentEnd,
      closeEnd = contentObj.closeEnd;


  var tag = state.src.slice(pos, contentStart).replace(/>$/, '/>');
  var js = (0, _transformJSX2.default)(tag, state.md.options.pragma);
  if (!js) {
    return false;
  }

  var content = state.src.slice(contentStart, contentEnd).trim();

  if (!silent) {
    if (content.length === 0) {
      token = state.push('jsx', '', 0);
      token.content = js;
    } else {
      state.pos = contentStart;
      state.posMax = contentEnd;

      token = state.push('jsx', '', 1);
      token.content = js.slice(0, js.length - 1);

      state.md.inline.tokenize(state);

      token = state.push('jsx', '', -1);
      token.content = ')';
    }
  }

  state.pos = closeEnd;
  state.posMax = max;
  return true;
};