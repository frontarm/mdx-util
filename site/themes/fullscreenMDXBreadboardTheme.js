import './fullscreenMDXBreadboardTheme.less'
import ExecutionEnvironment from 'exenv'
import React, { Component, PropTypes } from 'react'
import { MDXBreadboard } from 'armo-breadboard'
import Textarea from 'react-textarea-autosize'
import defaultMDXBreadboardTheme from './defaultMDXBreadboardTheme'
import createClassNamePrefixer from '../utils/createClassNamePrefixer'
import HighlightedCodeBlock from '../controls/HighlightedCodeBlock'


const cx = createClassNamePrefixer('fullscreenMDXBreadboardTheme')


class Editor extends Component {
  handleClick = () => {
    this.refs.textarea.focus()
  }

  render() {
    const props = this.props
    const isServer = !ExecutionEnvironment.canUseDOM

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

      renderEditorElement,
      renderMountElement,

      modes,
      modeActions,

      unwrapped,
      onToggleWrapped,
    } = props

    const activeModeCount = Object.values(modes).reduce((acc, x) => acc + x || 0, 0)

    let sourceLayout = {
      position: 'relative',
      flexBasis: 600,
      flexGrow: 0,
      flexShrink: 1,
    }
    if (activeModeCount === 1) {
      sourceLayout = {
        position: 'relative',
        flexBasis: 600,
        flexGrow: 1,
        flexShrink: 1,
        overflow: 'auto',
      }
    }

    const secondaryLayout = {
      position: 'relative',
      flexBasis: 600,
      flexGrow: 1,
      flexShrink: 1,
      overflow: 'auto',
    }

    return (
      <div className={cx.root()}>
        <div className={cx(!ExecutionEnvironment.canUseDOM ? 'loading' : 'loaded')} />
        <nav>
          { modes.transformed &&
            <span className={cx('wrapper', { active: !unwrapped })} onClick={onToggleWrapped}>Wrap</span>
          }
          <span className={cx('modes')}>
            { activeModeCount === 1 &&
              <span className={cx('mode', { active: modes.source })} onClick={modeActions.selectSource}>Source</span>
            }
            <span className={cx('mode', { active: modes.transformed })} onClick={modeActions.selectTransformed}>Output</span>
            <span className={cx('mode', { active: modes.view })} onClick={modeActions.selectView}>Preview</span>
          </span>
        </nav>
        { modes.source &&
          renderEditorElement({ layout: sourceLayout })
        }
        { (activeModeCount > 1 || !modes.source) && (transformError || (modes.view && executionError)) &&
          <div className={cx('error')} style={secondaryLayout}>
            <pre>
              <span className={cx('error-title')}>Failed to Compile</span>
              {(transformError || executionError).toString()}
            </pre>
          </div>
        }
        { modes.view && !transformError && !executionError &&
          <div className={cx('preview')} style={secondaryLayout}>
            {renderMountElement()}
          </div>
        }
        { modes.transformed && !transformError &&
          <HighlightedCodeBlock
            className={cx('transformed')}
            language="javascript"
            source={transformedSource}
            style={secondaryLayout}
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
      return <pre className={'language-'+language}><code dangerouslySetInnerHTML={{ __html: source }} /></pre>
    }
  },

  renderEditor: function(props) {
    return <Editor {...props} />
  },
}
