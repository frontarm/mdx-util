import MarkdownIt from 'markdown-it'
import Renderer from './jsxRenderer'


const DEFAULT_FACTORIES = {
  'codeBlock': '(props, children) => <pre {...props}><code dangerouslySetInnerHTML={{ __html: children || props.children }} /></pre>'
}


function mdJSX(md) {
  // JSX should entirely replace embedded HTML.
  md.inline.ruler.before('html_inline', 'jsx_inline', require('./jsx_inline'));
  md.block.ruler.before('html_block', 'jsx_block', require('./jsx_block'), [ 'paragraph', 'reference', 'blockquote', 'list' ]);

  md.disable('html_inline');
  md.disable('html_block');
}


module.exports = class MDXIt extends MarkdownIt {
  constructor (options={}) {
    if (options.initialIndent === undefined) {
      options.initialIndent = 6
    }

    super(options)

    this.use(mdJSX)

    // Make our factories available externally so the consuming applicaiton
    // can add different factories
    this.factories = DEFAULT_FACTORIES

    // Use our JSX renderer instead of the default HTML renderer
    this.renderer = new Renderer()
  }

  getFactoryForTag(tag) {
    return this.factories[tag] || `createFactory('${tag}')`
  }

  parse(content, env) {
    const importLines = []
    const bodyLines = content.split("\n")
    const props = ['factories={}']
    while (bodyLines[0]) {
      const line = bodyLines.shift()
      const match = line.match(/^(import|prop)\s+(.*)$/)

      if (!match) {
        break
      }
      else if (match[1] == 'import') {
        importLines.push(line)
      }
      else {
        const prop = match[2].trim()

        if (prop === 'factories') {
          throw new Error('mdx: You cannot define an `factories` prop, as it is reserved.')
        }

        props.push(prop)
      }
    }

    this.imports = importLines.join('\n')
    this.props = props
    this.body = bodyLines.join('\n')

    return super.parse(this.body, env)
  }

  render(body, env) {
    env = env || {};

    const rendered = this.renderer.render(this.parse(body, env), this.options, env);

    const output =
`import React, { createFactory } from 'react'
${this.imports}

module.exports = function({ ${this.props.join(', ') } }) {
  const {
    wrapper = createFactory('div'),
`+Array.from(this.renderer.tags.values()).sort().map(tag =>
`    ${tag} = ${this.getFactoryForTag(tag)},`
).join('\n') +`
  } = factories

  return (
    wrapper({}, 
${rendered}
    )
  )
}
`
    return output
  }
}
