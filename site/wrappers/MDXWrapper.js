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
  switch (name) {
    case 'react':
      return require('react')

    case 'armo-breadboard':
      return { MDXBreadboard: ThemedMDXBreadboard }

    case './components/Warning':
      return require('../../examples/components/Warning')

    default:
      console.warn('Breadboard tried to import unknown module ', name)
  }
}


function headingFactory(type, props, ...children) {
  // Render the same props and children that were passed in, but append a
  // link to this title with the text '#'.
  return React.createElement(
    type,
    {
      ...props,
      className: cx('hash-heading'),
    },
    ...children,
    <a href={'#'+props.id} className={cx('hash')}>#</a>
  )
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
          factories={{
            h1: (props, children) => headingFactory('h1', props, children),
            h2: (props, children) => headingFactory('h2', props, children),
            h3: (props, children) => headingFactory('h3', props, children),
          }}
        />
      </div>
    )
  }
}
