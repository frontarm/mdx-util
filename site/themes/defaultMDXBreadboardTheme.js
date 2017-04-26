import './defaultMDXBreadboardTheme.less'
import React, { Component, PropTypes } from 'react'
import Textarea from 'react-textarea-autosize'
import { MDXBreadboard } from 'armo-breadboard'
import createClassNamePrefixer from '../utils/createClassNamePrefixer'
import HighlightedCodeBlock from '../controls/HighlightedCodeBlock'


const cx = createClassNamePrefixer('defaultMDXBreadboardTheme')


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

    const sourceLayout = {
      position: 'relative',
      flexBasis: 500,
      flexGrow: 0,
      flexShrink: 0,
    }
    if (activeModeCount === 1) {
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
      <div className={cx.root(null, activeModeCount == 1 ? 'single' : null)}>
        <nav>
          { modes.transformed &&
            <span className={cx('wrapper', { active: !unwrapped })} onClick={onToggleWrapped}>Wrap</span>
          }
          <span className={cx('modes')}>
            <span className={cx('mode', { active: modes.transformed })} onClick={modeActions.selectTransformed}>Output</span>
            <span className={cx('mode', { active: modes.view })} onClick={modeActions.selectComponent}>Preview</span>
            { activeModeCount === 1 &&
              <span className={cx('mode', { active: modes.source })} onClick={modeActions.selectSource}>Source</span>
            }
          </span>
        </nav>
        { modes.source &&
          renderEditorElement({ layout: sourceLayout })
        }
        { modes.view &&
          <div className={cx('preview')} style={secondaryLayout}>
            {renderMountElement()}
          </div>
        }
        { modes.transformed &&
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
          {renderBreadboard({theme: defaultMDXBreadboardtheme})}
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
        className={cx('editor')}
        value={value}
        onChange={onChange}
        style={layout}
      />
    )
  },
}
