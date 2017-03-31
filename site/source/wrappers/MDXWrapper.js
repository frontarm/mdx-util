import './MDXWrapper.less'
import React, { Component, PropTypes } from 'react'
import { Link, PageContentLoader } from 'sitepack-react'

export default class MDXWrapper extends Component {
  static propTypes = {
    page: PropTypes.object.isRequired,
  }

  state = {
    value: '',
  }

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    })
  }

  renderPageContent = ({ page, errorMessage, isLoading, content }) =>
    <div>
      { errorMessage &&
        <div style={{color: 'red'}}>{errorMessage}</div>
      }
      { content &&
        <div className='MDXWrapper-content'>
          {React.createElement(content, {
            /**
             *  MDX components allow you to configure how each HTML element
             *  will be rendered by passing in factory functions.
             *  
             *  We use this here to replace `<a>` elements with the `<Link>`
             *  element experted by `sitepack-react`. This provides us with
             *  push-state navigation even within Markdown components.
             */
            value: this.state.value,
            onChange: this.onChange,
            factories: {
              a: React.createFactory(Link)
            }
          })}
        </div>
      }
    </div>

  render() {
    const { page, hash } = this.props

    /**
     * A Sitepack Page will not always have its content available immediately.
     * 
     * In order to reduce the bundle size of your application, Sitepack will
     * sometimes replace the `content` property of a Page object with a
     * function that returns a Promise to your content.
     *
     * While it is possible to handle these promises yourself, the
     * <PageContentLoader /> element from the `sitepack-react` package is the
     * recommended way of accessing your Page content in a React app.
     */
    return (
      <PageContentLoader
        page={page}
        render={this.renderPageContent}
      />
    )
  }
}
