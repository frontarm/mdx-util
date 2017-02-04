#!/usr/bin/env node

var path = require('path')
var fs = require('fs')
var program = require('commander')
var frontMatter = require('front-matter')
var mdAnchor = require('markdown-it-anchor')
var Prism = require('prismjs')
var MDXIt = require('../lib/MDXIt')
var packageJSON = require('../package.json')


program
  .version(packageJSON.version)
  .description('Compile jsx-infused markdown (mdx) to jsx')
  .usage('[options] <file>')
  .option('-o, --output <file>', 'Output file')

program.parse(process.argv)


if (program.args.length !== 1) {
  console.error('You must specify exactly one input file.')
  process.exit(1)
}


var aliases = {
  'js': 'jsx',
  'html': 'markup'
}
function highlight(str, lang) {
  if (!lang) {
    return str
  } else {
    lang = aliases[lang] || lang
    require(`prismjs/components/prism-${lang}.js`)
    if (Prism.languages[lang]) {
      return Prism.highlight(str, Prism.languages[lang])
    } else {
      return str
    }
  }
}
var md = new MDXIt({
  linkify: true,
  typographer: true,
  highlight,
})
  .use(mdAnchor)


var content = fs.readFileSync(program.args[0]).toString('utf8')
var data = frontMatter(content)
var env = {}
var rendered = md.render(data.body, env)


rendered += `
module.exports.meta = ${JSON.stringify(data.attributes, null, 2)}
`


if (program.output) {
  fs.writeFileSync(program.output, rendered)
}
else {
  console.log(rendered)
}
