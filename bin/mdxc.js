#!/usr/bin/env node

var path = require('path')
var fs = require('fs')
var program = require('commander')
var frontMatter = require('front-matter')
var MDXC = require('../lib/mdxc')
var packageJSON = require('../package.json')


program
  .version(packageJSON.version)
  .description('Compile mdx to js')
  .usage('[options] <file>')
  .option('-c, --common', 'use commonJS modules (i.e. module.exports and require)')
  .option('-p, --pragma', 'set the JSX pragma (defaults to React.createElement)')
  .option('-o, --output <file>', 'output to file instead of console')
  .option('-u, --unwrapped', "don't wrap the content in a React component")

program.parse(process.argv)


if (program.args.length !== 1) {
  program.help()
  process.exit(1)
}


var md = new MDXC({
  linkify: true,
  typographer: true,
  commonJS: program.common,
  unwrapped: program.unwrapped,
  pragma: program.pragma,
})

var content = fs.readFileSync(program.args[0]).toString('utf8')
var data = frontMatter(content)
var env = {}
var rendered = md.render(data.body, env)

if (!program.unwrapped) {
  rendered += `
${program.common ? 'module.exports.meta' : 'export const meta'} = ${JSON.stringify(data.attributes, null, 2)}
`
}

if (program.output) {
  fs.writeFileSync(program.output, rendered)
}
else {
  console.log(rendered)
}
