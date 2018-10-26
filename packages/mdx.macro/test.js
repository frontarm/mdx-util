const path = require('path')
const pluginTester = require('babel-plugin-tester')
const plugin = require('babel-plugin-macros')

pluginTester({
  plugin,
  snapshot: true,
  fixtures: path.join(__dirname, '__fixtures__'),
})