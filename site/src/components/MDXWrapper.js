import './MDXWrapper.css'
import React, { Component, PropTypes } from 'react'
import { Link } from 'react-junctions'
import { MDXBreadboard } from 'mdx-breadboard'
import fullscreenMDXBreadboardTheme from './fullscreenMDXBreadboardTheme'
import defaultMDXBreadboardTheme from './defaultMDXBreadboardTheme'
import createClassNamePrefixer from '../utils/createClassNamePrefixer'


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

    case 'mdx-breadboard':
      return { MDXBreadboard: ThemedMDXBreadboard }

    case './Warning':
      return require('./Warning')

    default:
      console.warn('Breadboard tried to import unknown module ', name)
  }
}


function createHeadingFactory(type, env) {
  return ({ id, ...other }, ...children) => {
    // Change MDX's heading ids by removing anything in parens, and removing
    // any <> characters, as otherwise the API Reference's ids can get a
    // little weird.
    let simpleId = id.replace(/\(.*/, '').replace(/[<>]/g, '')

    return React.createElement(
      type,
      {
        id: simpleId,
        className: 'MDXWrapper-heading',
        ...other,
      },
      ...children,

      // Append a hash link to each heading, which will be hidden via
      // CSS until he mouse hovers over the heading.
      <Link env={env} className='MDXWrapper-heading-hash' href={'#'+simpleId}>#</Link>
    )
  }
}


export class MDXWrapper extends Component {
  factories = {
    a: (props, ...children) =>
        React.createElement(Link, {
            ...props,
            env: this.props.env
        }, ...children),

    h1: createHeadingFactory('h1', this.props.env),
    h2: createHeadingFactory('h2', this.props.env),
    h3: createHeadingFactory('h3', this.props.env),
    h4: createHeadingFactory('h4', this.props.env),
    h5: createHeadingFactory('h5', this.props.env),
    h6: createHeadingFactory('h6', this.props.env),
  }

  render() {
    let { env, page } = this.props

    return (
      <div className='MDXWrapper'>
        <LoadingIndicator isLoading={page.contentStatus === 'busy'} />

        { page.contentStatus === 'ready' &&
          <div className='MDXWrapper-ready'>
            <MDXBreadboard
              key={page.url}
              defaultMode='view'
              defaultSource={page.content}
              theme={fullscreenMDXBreadboardTheme}
              require={breadboardRequire}
              factories={this.factories}
            />
          </div>
        }
        { page.contentStatus === 'error' &&
          <div className='MDXWrapper-error'>
            <h1>Gosh darn it.</h1>
            <p>Something went wrong while loading the page.</p>
          </div>
        }
      </div>
    )
  }
}

const LoadingIndicator = ({ isLoading }) =>
  <div className={`
    MDXWrapper-LoadingIndicator
    MDXWrapper-LoadingIndicator-${isLoading ? 'loading' : 'done'}
  `} />