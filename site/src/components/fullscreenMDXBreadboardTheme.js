import './fullscreenMDXBreadboardTheme.css'
import React, { Component, PropTypes } from 'react'
import Textarea from 'react-textarea-autosize'
import defaultMDXBreadboardTheme from './defaultMDXBreadboardTheme'
import HighlightedCodeBlock from './HighlightedCodeBlock'
import createClassNamePrefixer from '../utils/createClassNamePrefixer'


const cx = createClassNamePrefixer('fullscreenMDXBreadboardTheme')


class Editor extends Component {
  handleClick = () => {
    this.refs.textarea.focus()
  }

  render() {
    const props = this.props
    const isServer = process.env.IS_STATIC

    return (
      <div className={cx('editor')} onClick={this.handleClick} style={props.layout}>
        <Textarea
          ref='textarea'
          className={cx('editor-textarea', { 'editor-server': isServer })}
          value={props.value}
          onChange={props.onChange}
          disabled={isServer}
        />
      </div>
    )
  }
}


export default {
  maxSinglePaneWidth: 800,

  renderBreadboard: function(props) {
    const {
      consoleMessages,
      transformedSource,
      transformError,
      executionError,

      defaultMode,
      defaultSecondary,

      renderEditorElement,
      renderMountElement,

      modes,
      modeActions,

      unwrapped,
      onToggleWrapped,
    } = props

    const singleMode = Object.values(modes).reduce((acc, x) => acc + x || 0, 0) === 1

    return (
      <div className={cx.root(null, process.env.IS_STATIC ? 'static' : 'loaded')}>
        <div className={cx('loading-bar')} />
        <nav>
          <span className={cx('modes')}>
            { singleMode &&
              <span className={cx('mode', { active: modes.source })} onClick={modeActions.selectSource}>Source</span>
            }
            <span className={cx('mode', { active: modes.transformed })} onClick={modeActions.selectTransformed}>Output</span>
            <span className={cx('mode', { active: modes.view })} onClick={modeActions.selectView}>Preview</span>
          </span>
          { modes.transformed &&
            <span className={cx('wrapper', { active: !unwrapped })} onClick={onToggleWrapped}>Wrap</span>
          }
        </nav>

        { modes.source &&
          <div className={cx('editor-wrapper', defaultMode === 'source' ? 'default-primary' : 'default-secondary', { expand: singleMode })}>
            {
              renderEditorElement({ layout: { width: '100%', height: '100%' } })
            }
          </div>
        }
        { (!singleMode || !modes.source) && (transformError || (modes.view && executionError)) &&
          <div className={cx('error', 'secondary', (defaultMode === 'view' || defaultMode === 'transformed') ? 'default-primary' : 'default-secondary')}>
            <pre>
              <span className={cx('error-title')}>Failed to Compile</span>
              {(transformError || executionError).toString()}
            </pre>
          </div>
        }
        { modes.view && !transformError && !executionError &&
          <div className={cx('preview', 'secondary', defaultMode === 'view' ? 'default-primary' : 'default-secondary')}>
            {renderMountElement()}
          </div>
        }
        { modes.transformed && !transformError &&
          <HighlightedCodeBlock
            className={cx('transformed', 'secondary', defaultMode === 'transformed' ? 'default-primary' : 'default-secondary')}
            language="javascript"
            source={transformedSource}
          />
        }
      </div>
    )
  },

  renderCode: function({ language, renderBreadboard, source }) {
    if (renderBreadboard) {
      return (
        <div style={{ maxWidth: 'none', width: '100%' }}>
          {renderBreadboard({theme: defaultMDXBreadboardTheme})}
        </div>
      )
    }
    else {
      return (
        <HighlightedCodeBlock
          language={language}
          source={source}
        />
      )
    }
  },

  renderEditor: function(props) {
    return <Editor {...props} />
  },
}
