import './MDXWrapper.less'
import React, { Component, PropTypes } from 'react'
import { Link } from 'sitepack-react'
import { MDXBreadboard } from 'armo-breadboard'
import fullscreenMDXBreadboardTheme from '../themes/fullscreenMDXBreadboardTheme'
import defaultMDXBreadboardTheme from '../themes/defaultMDXBreadboardTheme'
import createClassNamePrefixer from '../utils/createClassNamePrefixer'


const cx = createClassNamePrefixer('MDXWrapper')


function ThemedMDXBreadboard({ defaultSource, ...other }) {
  return (
    <MDXBreadboard
      {...other}
      defaultSource={defaultSource}
      theme={defaultMDXBreadboardTheme}
      require={breadboardRequire}
    />
  )
}


function breadboardRequire(name) {
  if (name === 'react') {
    return require('react')
  }
  else if (name === 'armo-breadboard') {
    return { a: 1, MDXBreadboard: ThemedMDXBreadboard }
  }
}


export default class MDXWrapper extends Component {
  static propTypes = {
    page: PropTypes.object.isRequired,
  }

  render() {
    const { page, hash } = this.props

    // TODO:
    // - scroll to hash on load

    return (
      <div className={cx.root()}>
        <MDXBreadboard
          key={page.id}
          defaultMode='view'
          defaultSource={page.content}
          theme={fullscreenMDXBreadboardTheme}
          require={breadboardRequire}
        />
      </div>
    )
  }
}
