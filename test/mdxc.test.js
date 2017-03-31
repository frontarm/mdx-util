var path = require('path');
var generate = require('markdown-it-testgen');
var MDXC = require('../lib/mdxc')


describe('mdxc', function () {
  var mdxUnwrapped = new MDXC({
    linkify: true,
    typographer: true,
    unwrapped: true,
  })

  generate(path.join(__dirname, 'fixtures/unwrapped'), mdxUnwrapped);

  var mdxWrapped = new MDXC({
    linkify: true,
    typographer: true,
  })

  generate(path.join(__dirname, 'fixtures/wrapped'), mdxWrapped);
});
