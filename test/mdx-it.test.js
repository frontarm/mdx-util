var path = require('path');
var generate = require('markdown-it-testgen');
var MDXIt = require('../lib/MDXIt')


describe('mdx-it', function () {
  var mdx = new MDXIt({
    linkify: true,
    typographer: true,
    unwrapped: true,
  })

  generate(path.join(__dirname, 'fixtures/mdx-it'), mdx);
});
