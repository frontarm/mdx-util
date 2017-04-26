import React, { PureComponent, PropTypes } from "react"
import Prism from 'prismjs'


const codeBlockAliases = {
  'js': 'jsx',
  'html': 'markup',
  'mdx': 'markdown',
  'md': 'markdown',
}
function highlight(str, lang) {
  if (!lang) {
    return str
  } else {
    lang = codeBlockAliases[lang] || lang
    require(`prismjs/components/prism-${lang}.js`)
    if (Prism.languages[lang]) {
      return Prism.highlight(str, Prism.languages[lang])
    } else {
      return str
    }
  }
}


export default class HighlightedCodeBlock extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    language: PropTypes.string,
    source: PropTypes.string,
  }

  render() {
    const language = this.props.language
    const className = this.props.className + ' language-'+(language === 'mdx' ? 'markdown' : language)
    const highlighted = highlight(this.props.source, language)

    return (
      <pre className={className} style={this.props.style}>
        <code dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
    )
  }
}
