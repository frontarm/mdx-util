function mdxConstant(key, value) {
  return function (options) {
    let OldCompiler = this.Compiler
    let hasExport = false

    this.Compiler = tree => {
      let code = OldCompiler(tree, {}, options)

      if (!hasExport) {
        code += `\nexport const ${key} = ${JSON.stringify(value, null, 2)}\n`
      }

      return code
    }

    return function transformer(root) {
      for (let i = 0; i < root.children.length; i++) {
        let node = root.children[i]

        if (node.type === 'export' && node.value.indexOf(key) !== -1) {
          hasExport = true
        }
      }
    }
  }
}

module.exports = mdxConstant