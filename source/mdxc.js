import MarkdownIt from 'markdown-it'
import slugify from 'slugify'
import Renderer from './jsxRenderer'
import importsToCommonJS from './importsToCommonJS'
import jsx_inline from './jsx_inline'
import jsx_block from './jsx_block'


slugify.extend({
  '>': '',
  '<': '',
  '`': '',
})


const DEFAULT_FACTORIES = {
  'codeBlock': '(props, children) => createElement("pre", props, createElement("code", { dangerouslySetInnerHTML: { __html: children || props.children } }))'
}


function mdJSX(md) {
  // JSX should entirely replace embedded HTML.
  md.inline.ruler.before('html_inline', 'jsx_inline', jsx_inline);
  md.block.ruler.before('html_block', 'jsx_block', jsx_block, [ 'paragraph', 'reference', 'blockquote', 'list' ]);

  md.disable('html_inline');
  md.disable('html_block');
}

function mdAnchor(md) {
  const hasProp = ({}).hasOwnProperty

  const uniqueSlug = (slug, slugs) => {
    // Mark this slug as used in the environment.
    slugs[slug] = (hasProp.call(slugs, slug) ? slugs[slug] : 0) + 1

    // First slug, return as is.
    if (slugs[slug] === 1) {
      return slug
    }

    // Duplicate slug, add a `-2`, `-3`, etc. to keep ID unique.
    return slug + '-' + slugs[slug]
  }

  md.core.ruler.push('anchor', state => {
    const slugs = {}
    const tokens = state.tokens

    tokens
      .filter(token => token.type === 'heading_open')
      .forEach(token => {
        // Aggregate the next token children text.
        const title = tokens[tokens.indexOf(token) + 1].children
          .filter(token => token.type === 'text' || token.type === 'code_inline')
          .reduce((acc, t) => acc + t.content, '')

        let slug = token.attrGet('id')

        if (slug == null) {
          slug = uniqueSlug(slugify(title), slugs)
          token.attrPush(['id', slug])
        }
      })
  })
}


module.exports = class MDXC extends MarkdownIt {
  constructor (options={}) {
    if (options.initialIndent === undefined) {
      options.initialIndent = 0
    }

    super(options)

    this.use(mdJSX)
    this.use(mdAnchor)

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
      const importMatch = line.match(/^import\s+.*\s+from\s+['"].*['"];?\s*$/)
      const propMatch = line.match(/^prop\s+([$_a-zA-Z][$_a-zA-Z0-9]*)\s*$/)

      if (importMatch) {
        importLines.push(line)
      }
      else if (propMatch) {
        const prop = propMatch[1]

        if (prop === 'factories') {
          throw new Error('mdx: You cannot define an `factories` prop, as it is reserved.')
        }

        props.push(prop)
      }
      else {
        bodyLines.unshift(line)
        break
      }
    }

    this.imports = importLines.join('\n')
    this.props = props
    this.body = bodyLines.join('\n')

    return super.parse(this.body, env)
  }

  render(body, env) {
    env = env || {};

    let importsSource = [`import React, { createElement, createFactory } from 'react'`]
    const optionImports = Array.isArray(this.options.imports) ? this.options.imports : [this.options.imports]
    if (this.options.imports) {
      importsSource = importsSource.concat(this.options.imports)
    }

    const rendered = this.renderer.render(this.parse(body, env), this.options, env).trim();
    const result = rendered === '' ? 'wrapper({})' : `wrapper({},\n\n${rendered}\n\n  )`
    importsSource = importsSource.concat(this.imports.split('\n'))

    const isCommonJS = !!this.options.commonJS
    const imports =
      !isCommonJS
        ? importsSource.join('\n')
        : importsToCommonJS(importsSource.join('\n'))
    const tags = Array.from(this.renderer.tags.values()).sort()
    
    return this.options.unwrapped ? rendered+'\n' : `${imports}
${isCommonJS ? 'module.exports =' : 'export default'} function({ ${this.props.join(', ') } }) {
  const {
    wrapper = createFactory('div'),
`+(tags.length == 0 ? '' : tags.map(tag =>
`    ${tag} = ${this.getFactoryForTag(tag)},`
).join('\n')+'\n')+`  } = factories

  return ${result}
}
`
  }
}
