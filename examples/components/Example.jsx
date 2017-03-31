import './Example.less'
import React, { Component, PropTypes } from 'react'
import frontMatter from 'front-matter'
import MDXC from '../../lib/mdxc'

var md = new MDXC({
  linkify: true,
  typographer: true,
})
var mdCommonJS = new MDXC({
  linkify: true,
  typographer: true,
  commonJS: true
})

export default class Example extends Component {
  static propTypes = {
    children: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props)

    let source = props.children
    if (source[0] === '\n') source = source.slice(1)
    this.state = { source }
  }

  handleChangeSource = (e) => {
    this.setState({ source: e.target.value })
  }

  render() {
    var data = frontMatter(this.state.source)
    var env = {}
    var compiled = md.render(data.body, env)

    return (
      <div className='Example'>
        <textarea value={this.state.source} onChange={this.handleChangeSource} />
        <pre className='Example-compiled'><code>{compiled}</code></pre>
      </div>
    )
  }
}
