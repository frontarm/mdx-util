import './MDXWrapper.less'
import React, { Component, PropTypes } from 'react'
import { Link } from 'sitepack-react'
import { MDXBreadboard } from 'armo-breadboard'
import fullscreenMDXBreadboardTheme from '../themes/fullscreenMDXBreadboardTheme'
import defaultMDXBreadboardTheme from '../themes/defaultMDXBreadboardTheme'
import createClassNamePrefixer from '../utils/createClassNamePrefixer'


const cx = createClassNamePrefixer('MDXWrapper')


function ThemedMDXBreadboard({ defaultSource }) {
  return (
    <MDXBreadboard
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
    return { MDXBreadboard: ThemedMDXBreadboard }
  }
}


export default class MDXWrapper extends Component {
  static propTypes = {
    page: PropTypes.object.isRequired,
  }

  render() {
    const { page, hash } = this.props

    // TODO:
    // - handle 404
    // - "preview" link does not load
    // - scroll to hash on load

    return (
      <div className={cx.root()}>
        <nav>
          <Link page='/site/index.page.js'>MDXC</Link>
          <span className={cx('heading')}>Examples</span>
          <Link page='/examples/props.mdx'>Props</Link>
        </nav>
        <main className={cx('main')}>
          <MDXBreadboard
            defaultSource={page.content}
            theme={fullscreenMDXBreadboardTheme}
            require={breadboardRequire}
          />
        </main>
        <footer className={cx('footer')}>
          Copyright &copy; 2017 James K Nelson. Documentation powered by <a href="https://github.com/jamesknelson/sitepack">Sitepack</a>.
        </footer>
      </div>
    )
  }
}
