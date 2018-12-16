const textr = require('textr')
const apostrophes = require('typographic-apostrophes')
const quotes = require('typographic-quotes')
const apostrophesForPlurals = require('typographic-apostrophes-for-possessive-plurals')
const ellipses = require('typographic-ellipses')
const emDashes = require('typographic-em-dashes')
const enDashes = require('typographic-en-dashes')

module.exports = textr()
  .use(
    apostrophes,
    quotes,
    apostrophesForPlurals,
    ellipses,
    emDashes,
    enDashes
  );
