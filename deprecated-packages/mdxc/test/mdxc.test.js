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

  var mdxPragma = new MDXC({
    linkify: true,
    typographer: true,
    pragma: 'h',
  })

  generate(path.join(__dirname, 'fixtures/pragma'), mdxPragma);

  var mdxImports = new MDXC({
    linkify: true,
    typographer: true,
    pragma: 'h',
    imports: 'import h from \'h\''
  })

  generate(path.join(__dirname, 'fixtures/imports'), mdxImports);

  var mdxImportsArray = new MDXC({
    linkify: true,
    typographer: true,
    pragma: 'h',
    imports: [
      'import h from \'h\'',
      'import bar from \'bar\''
    ]
  })

  generate(path.join(__dirname, 'fixtures/importsArray'), mdxImportsArray);
});
