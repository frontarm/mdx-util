const toJSX = require('@mdx-js/mdx/mdx-hast-to-jsx').toJSX

function mdxTableOfContents(options = {}) {
  let OldCompiler = this.Compiler
  let info

  this.Compiler = tree => {
    let code = OldCompiler(tree, {}, options)
    
    if (!info.hasTableOfContentsExport) {
      code += `\nexport const tableOfContents = (components={}) => ${tableOfContentsListSerializer(info.tableOfContents)}\n`
    }

    return code
  }

  return function transformer(node) {
    info = getInfo(node, options)
  }
}

function getInfo(root, { minTableOfContentsLevel = 2, maxTableOfContentsLevel = 3 } = {}) {
  let info = {
    hasFrontMatterExport: false,
    hasTableOfContentsExport: false,
    tableOfContents: []
  }

  let levelIds = []
  let tableOfContentsIds = {}

  for (let i = 0; i < root.children.length; i++) {
    let node = root.children[i]

    if (node.type === 'export' && node.value.indexOf('tableOfContents') !== -1) {
      info.hasTableOfContentsExport = true
    }
          
    if (node.type === 'element' && /^h\d$/.test(node.tagName)) {
      let level = parseInt(node.tagName[1])
      if (level >= minTableOfContentsLevel && level <= maxTableOfContentsLevel) {
        let id = node.properties.id
        levelIds[level - 1] = id
        let parent = tableOfContentsIds[levelIds[level - 2]]
        let item = {
          id,
          level,
          title: toFragment(node.children),
          children: [],
        }
        if (parent) {
          parent.children.push(item)
        }
        else {
          info.tableOfContents.push(item)
        }
        tableOfContentsIds[id] = item
      }
    }
  }

  return info
}

function toFragment(nodes) {
  if (nodes.length === 1 && nodes[0].type === 'text') {
    return JSON.stringify(nodes[0].value)
  }
  else {
    return '<React.Fragment>'+nodes.map(toJSX).join('')+'</React.Fragment>'
  }
}

function tableOfContentsListSerializer(nodes, indent = 0) {
  return indentString(indent, `[
  ${nodes.map(node => tableOfContentsNodeSerializer(node, indent + 2)).join(',\n')}
]`)
}

function tableOfContentsNodeSerializer(node, indent = 0) {
  return indentString(indent, `{
  id: ${JSON.stringify(node.id)},
  level: ${node.level},
  title: ${node.title},
  children: ${tableOfContentsListSerializer(node.children, indent + 2)}
}`)
}

function indentString(size, string) {
  return string.split('\n').map(x => ' '.repeat(size)+x).join('\n').trim()
}

module.exports = mdxTableOfContents