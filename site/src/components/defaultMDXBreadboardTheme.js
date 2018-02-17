import './defaultMDXBreadboardTheme.css'
import React, { Component, PropTypes } from 'react'
import Textarea from 'react-textarea-autosize'
import HighlightedCodeBlock from './HighlightedCodeBlock'
import createClassNamePrefixer from '../utils/createClassNamePrefixer'


const cx = createClassNamePrefixer('defaultMDXBreadboardTheme')


let defaultMDXBreadboardTheme = {
  maxSinglePaneWidth: 800,

  renderBreadboard: function(props) {
    const {
      consoleMessages,
      transformedSource,
      transformError,
      executionError,

      defaultMode,

      renderEditorElement,
      renderMountElement,

      modes,
      modeActions,

      unwrapped,
      onToggleWrapped,
    } = props

    const isStatic = process.env.IS_STATIC
    const singleMode = Object.values(modes).reduce((acc, x) => acc + x || 0, 0) === 1 || isStatic

    const sourceLayout = {
      position: 'relative',
      flexBasis: 500,
      flexGrow: 0,
      flexShrink: 0,
    }
    if (singleMode) {
      sourceLayout.flexShrink = 1
    }

    const secondaryLayout = {
      position: 'relative',
      flexBasis: 500,
      flexGrow: 0,
      flexShrink: 1,
      overflow: 'auto',
    }

    return (
      <div className={cx.root(null, singleMode ? 'single' : null, isStatic ? 'static' : 'loaded')}>
        <nav>
          { modes.transformed &&
            <span className={cx('wrapper', { active: !unwrapped })} onClick={onToggleWrapped}>Wrap</span>
          }
          <span className={cx('modes')}>
            { singleMode &&
              <span className={cx('mode', { active: modes.source })} onClick={modeActions.selectSource}>Source</span>
            }
            <span className={cx('mode', { active: modes.transformed })} onClick={modeActions.selectTransformed}>Output</span>
            <span className={cx('mode', { active: modes.view })} onClick={modeActions.selectView}>Preview</span>
          </span>
        </nav>
        { modes.source &&
          (!isStatic || defaultMode === 'source') &&
          renderEditorElement({ layout: sourceLayout })
        }
        { (!singleMode || !modes.source) &&
          (transformError || (modes.view && executionError)) &&
          (!isStatic || defaultMode === 'view' || defaultMode === 'transformed') &&
          <div className={cx('error')} style={secondaryLayout}>
            <pre>
              <span className={cx('error-title')}>Failed to Compile</span>
              {(transformError || executionError).toString()}
            </pre>
          </div>
        }
        { modes.view && !transformError && !executionError &&
          (!isStatic || defaultMode === 'view') &&
          <div className={cx('preview')} style={secondaryLayout}>
            {renderMountElement()}
          </div>
        }
        { modes.transformed && !transformError &&
          (!isStatic || defaultMode === 'transformed') &&
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

  renderEditor: function({ layout, value, onChange }) {
    return (
      <Textarea
        className={cx('editor', { 'editor-static': process.env.IS_STATIC })}
        value={value}
        onChange={onChange}
        style={layout}
      />
    )
  },
}


export default defaultMDXBreadboardTheme