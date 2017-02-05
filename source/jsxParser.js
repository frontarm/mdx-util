// Parser to match JSX tags.
// Based on https://github.com/osnr/markdown-it-jsx
// Based on https://github.com/markdown-it/markdown-it/blob/9074242bdd6b25abf0b8bfe432f152e7b409b8e1/lib/common/html_re.js
// Extended to use parsimmon parser generator instead of regexes so we can do
// balanced-brace matching to consume JSX attribute values (which are arbitrary JS expressions).

'use strict';

var parsimmon = require('parsimmon');
var regex = parsimmon.regex;
var string = parsimmon.string;
var whitespace = parsimmon.whitespace;
var optWhitespace = parsimmon.optWhitespace;
var lazy = parsimmon.lazy;
var alt = parsimmon.alt;
var all = parsimmon.all;
var takeWhile = parsimmon.takeWhile;

var attr_name     = regex(/[a-zA-Z_:][a-zA-Z0-9:._-]*/);

var unquoted      = regex(/[^"'=<>`\x00-\x20]+/);
var single_quoted = regex(/'[^']*'/);
var double_quoted = regex(/"[^"]*"/);

// FIXME Hack: won't deal with braces inside a string or something
// inside the JS expression, if they're mismatched.
// (But you really shouldn't have complex JS in the JSX attribute value, anyway.)
var braced_expression = lazy(function() {
  return string('{').then(
    alt(braced_expression, regex(/[^{}]+/)).many()
  ).skip(string('}'));
});

var attr_value  = alt(braced_expression, unquoted, single_quoted, double_quoted);

var attribute   = whitespace.then(attr_name).then(regex(/\s*=\s*/).then(attr_value).atMost(1));

var open_tag    = regex(/<([_A-Za-z][_A-Za-z0-9.\-]*)/, 1);

var close_tag   = regex(/<\/([_A-Za-z][_A-Za-z0-9.\-]*)\s*>/, 1);
var self_close_tag = regex(/<([_A-Za-z][_A-Za-z0-9.\-]*)/, 1).then(attribute.many()).skip(regex(/\s*\/>/));

var comment     = regex(/<!---->|<!--(?:-?[^>-])(?:-?[^-])*-->/);
var processing  = regex(/<[?].*?[?]>/);
var declaration = regex(/<![A-Z]+\s+[^>]*>/);
var cdata       = regex(/<!\[CDATA\[[\s\S]*?\]\]>/);

exports.JSX_OPEN_TAG_PARSER = open_tag.mark().skip(all);
exports.JSX_SELF_CLOSE_TAG_PARSER = self_close_tag;
exports.JSX_CLOSE_TAG_PARSER = takeWhile(c => c !== '<').then(alt(close_tag, self_close_tag));

exports.JSX_INLINE_PARSER = alt(
  open_tag.then(attribute.many()).skip(regex(/\s*\/?>/)),
  close_tag,
  comment,
  processing,
  declaration,
  cdata
).mark().skip(all);
