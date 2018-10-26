'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JSX_INLINE_CLOSE_TAG_PARSER = exports.JSX_CLOSE_TAG_PARSER = exports.JSX_INLINE_SELF_CLOSE_TAG_PARSER = exports.JSX_SELF_CLOSE_TAG_PARSER = exports.JSX_INLINE_OPEN_TAG_PARSER = exports.JSX_OPEN_TAG_PARSER = undefined;

var _parsimmon = require('parsimmon');

var _parsimmon2 = _interopRequireDefault(_parsimmon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var regex = _parsimmon2.default.regex; // Parser to match JSX tags.
// Based on https://github.com/osnr/markdown-it-jsx
// Based on https://github.com/markdown-it/markdown-it/blob/9074242bdd6b25abf0b8bfe432f152e7b409b8e1/lib/common/html_re.js
// Extended to use parsimmon parser generator instead of regexes so we can do
// balanced-brace matching to consume JSX attribute values (which are arbitrary JS expressions).

var string = _parsimmon2.default.string;
var whitespace = _parsimmon2.default.whitespace;
var optWhitespace = _parsimmon2.default.optWhitespace;
var lazy = _parsimmon2.default.lazy;
var alt = _parsimmon2.default.alt;
var all = _parsimmon2.default.all;
var takeWhile = _parsimmon2.default.takeWhile;

var attr_name = regex(/[a-zA-Z_:][a-zA-Z0-9:._-]*/);

var unquoted = regex(/[^"'=<>`\x00-\x20]+/);
var single_quoted = regex(/'[^']*'/);
var double_quoted = regex(/"[^"]*"/);

// FIXME Hack: won't deal with braces inside a string or something
// inside the JS expression, if they're mismatched.
// (But you really shouldn't have complex JS in the JSX attribute value, anyway.)
var braced_expression = lazy(function () {
  return string('{').then(alt(braced_expression, regex(/[^{}]+/)).many()).skip(string('}'));
});

var attr_value = alt(braced_expression, unquoted, single_quoted, double_quoted);

var attribute = whitespace.then(attr_name).then(regex(/\s*=\s*/).then(attr_value).atMost(1));

var open_tag = regex(/<([_A-Za-z][_A-Za-z0-9.\-]*)/, 1);
var close_tag = regex(/<\/([_A-Za-z][_A-Za-z0-9.\-]*)\s*>/, 1);
var self_close_tag = regex(/<([_A-Za-z][_A-Za-z0-9.\-]*)/, 1).then(attribute.many()).skip(regex(/\s*\/>/));

var JSX_OPEN_TAG_PARSER = exports.JSX_OPEN_TAG_PARSER = open_tag.mark().skip(all);
var JSX_INLINE_OPEN_TAG_PARSER = exports.JSX_INLINE_OPEN_TAG_PARSER = open_tag.skip(attribute.many()).skip(regex(/\s*\/?>/)).mark().skip(all);
var JSX_SELF_CLOSE_TAG_PARSER = exports.JSX_SELF_CLOSE_TAG_PARSER = self_close_tag;
var JSX_INLINE_SELF_CLOSE_TAG_PARSER = exports.JSX_INLINE_SELF_CLOSE_TAG_PARSER = self_close_tag.mark().skip(all);
var JSX_CLOSE_TAG_PARSER = exports.JSX_CLOSE_TAG_PARSER = takeWhile(function (c) {
  return c !== '<';
}).then(alt(close_tag, self_close_tag));
var JSX_INLINE_CLOSE_TAG_PARSER = exports.JSX_INLINE_CLOSE_TAG_PARSER = close_tag.mark().skip(all);