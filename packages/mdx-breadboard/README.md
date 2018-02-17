mdx-breadboard
===============

[![npm version](https://img.shields.io/npm/v/mdx-breadboard.svg)](https://www.npmjs.com/package/mdx-breadboard)

A themeable React component. Use it to edit an MDX file's source in real time.

**Only use this component to display your own code -- it is not safe for use with publicly submitted code. For public code, use a service like [codepen.io](http://codepen.io).**

Installation
------------

```bash
yarn add mdx-breadboard
```

Usage
-----

There are currently three Breadboard components:

-   `RawBreadboard`

    Expects that the code will call `ReactDOM.render()` itself, with the result placed in `document.getElementById('app')`. Provides global `React` and `ReactDOM` objects.

-   `ComponentBreadboard`

    Expects that a script will import `React`, and export a default Component. Imports and renders the component.

-   `MDXBreadboard`

    Expects a Markdown document and compiles it to a React Component with [mdxc](https://github.com/jamesknelson/mdxc).

### Props

Here is an overview of the props available for all Breadboard components. For full details on each component's available props, see the `propTypes` definition in the source.

-   `defaultSource` ***required***

    The source to execute. Breadboards are uncontrolled; they currently do not emit events when the code updates/renders. PRs to add this functionality would be welcome.

-   `theme` ***required***

    The theme object that actually renders the Breadboard. This is required as the Breadboard components themselves do not generate any HTML. For an example of a Breadboard theme, see the [theme](#themes) section.

-   `require` 

    The `require` function that will be used when executing the Breadboard's source. Use this to configure how `import` statements work.

    By default, Breadboard provides a `require` function that just makes `react` available.

-   `defaultMode`

    Specifies the mode that the Breadboard will be in when loaded. Available options are:

    * `source`
    * `transformed`
    * `view`
    * `console`

-   `defaultSecondary`

    If your Breadboard element has enough space, it will split the view into two panels. In this case, the `source` panel will always be displayed. This option chooses a default for the second panel. All options from above are available -- except `source`.

### Themes

Different websites call for default themes. Of course, CSS isn't always sufficient to make the theming changes that you'd like. Because of this, Breadboards do not generate *any* Markup themselves. Instead, they leave the markup generation to you, via *theme objects*.

For an example of how theming can be used in practice, see [MDXC Playground](dump.jamesknelson.com/mdxc-playground.html). This page uses two Breadboard themes:

- The "fullscreen" theme renders the document's source on the left, and the full document on the right. *([source](https://github.com/jamesknelson/mdxc-playground/blob/8924c21913ed568fbef8867463af3c10f6230422/source/fullscreenMDXBreadboardTheme.js))*
- The "default" theme is used for embedded examples within the right pane. *([source](https://github.com/jamesknelson/mdxc-playground/blob/8924c21913ed568fbef8867463af3c10f6230422/source/defaultMDXBreadboardTheme.js))*

The actual options available on a theme object differ between breadboards. For details, you'll currently need to view the source.

#### Example

This is an example of a theme for `RawBreadboard` and `ComponentBreadboard` that renders the editor using CodeMirror. This is used on [reactarmory.com](https://reactarmory.com)

```jsx
import './defaultBreadboardTheme.less'
import React, { Component, PropTypes } from 'react'
import debounce from 'lodash.debounce'
import codeMirror from 'codemirror'
import createClassNamePrefixer from '../utils/createClassNamePrefixer'

require("codemirror/mode/jsx/jsx")


const cx = createClassNamePrefixer('defaultBreadboardTheme')


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

      reactVersion,
      appId
    } = props

    const activeModeCount = Object.values(modes).reduce((acc, x) => acc + x || 0, 0)

    const sourceLayout = {
      position: 'relative',
      flexBasis: 600,
      flexGrow: 0,
      flexShrink: 0,
    }
    if (activeModeCount === 1) {
      sourceLayout.flexShrink = 1
    }

    const secondaryLayout = {
      position: 'relative',
      flexBasis: 600,
      flexGrow: 0,
      flexShrink: 1,
      overflow: 'auto',
    }
      
    return (
      <div className={cx.root(null, activeModeCount == 1 ? 'single' : null)}>
        { (consoleMessages.length || activeModeCount == 1) &&
          <nav>
            <span className={cx('modes')}>
              { activeModeCount === 1 &&
                <span className={cx('mode', { active: modes.source })} onClick={modeActions.selectSource}>Source</span>
              }
              <span className={cx('mode', { active: modes.view })} onClick={modeActions.selectView}>Preview</span>
              <span className={cx('mode', { active: modes.console })} onClick={modeActions.selectConsole}>Console</span>
            </span>
          </nav>
        }
        { modes.source &&
          renderEditorElement({ layout: sourceLayout })
        }
        { // Always render the preview element, as the user's code may depend
          // on it being available. Hide it if it isn't selected.
          <div className={cx('preview', { 'preview-visible': modes.view && !transformError && !executionError })} style={secondaryLayout}>
            {renderMountElement()}
          </div>
        }
        { modes.console && !transformError && !executionError &&
          <BreadboardConsole
            className={cx('console')}
            style={secondaryLayout}
            messages={consoleMessages}
          />
        }
        { (transformError || executionError) && 
          <div className={cx('error')} style={secondaryLayout}>
            <pre>
              <span className={cx('error-title')}>Failed to Compile</span>
              {(transformError || executionError).toString()}
            </pre>
          </div>
        }
      </div>
    )
  },

  renderEditor: function({ layout, value, onChange }) {
    return (
      <JSXEditor
        className={cx('editor')}
        value={value}
        onChange={onChange}
        style={layout}
      />
    )
  },
}

const getType = function (el) {
  let t = typeof el;

  if (Array.isArray(el)) {
    t = "array";
  } else if (el === null) {
    t = "null";
  }

  return t;
};

// Based on react-playground by Formidable Labs
// See: https://github.com/FormidableLabs/component-playground/blob/master/src/components/es6-preview.jsx
const wrapMap = {
  wrapnumber(num) {
    return <span style={{color: "#6170d5"}}>{num}</span>;
  },

  wrapstring(str) {
    return <span style={{color: "#F2777A"}}>{"'" + str + "'"}</span>;
  },

  wrapboolean(bool) {
    return <span style={{color: "#48A1CF"}}>{bool ? "true" : "false"}</span>;
  },

  wraparray(arr) {
    return (
      <span>
        {"["}
        {arr.map((entry, i) => {
          return (
            <span key={i}>
              {wrapMap["wrap" + getType(entry)](entry)}
              {i !== arr.length - 1 ? ", " : ""}
            </span>
          );
        })}
        {"]"}
      </span>
    );
  },

  wrapobject(obj) {
    const pairs = [];
    let first = true;

    for (const key in obj) {
      pairs.push(
        <span key={key}>
          <span style={{color: "#8A6BA1"}}>
            {(first ? "" : ", ") + key}
          </span>
          {": "}
          {wrapMap["wrap" + getType(obj[key])](obj[key])}
        </span>
      );

      first = false;
    }

    return <i>{"Object {"}{pairs}{"}"}</i>;
  },

  wrapfunction() {
    return <i style={{color: "#48A1CF"}}>{"function"}</i>;
  },

  wrapnull() {
    return <span style={{color: "#777"}}>{"null"}</span>;
  },

  wrapundefined() {
    return <span style={{color: "#777"}}>{"undefined"}</span>;
  }
}


function BreadboardConsole({ className, messages, style }) {
  return (
    <div className={cx('console')} style={style}>
      {messages.map(({ type, args }, i) =>
        <div key={'message'+i} className={cx('messages')}>
          {args.map((arg, i) =>
            <div key={'arg'+i} className={cx('arg')}>{wrapMap["wrap" + getType(arg)](arg)}</div>
          )}
        </div>
      )}
    </div>
  )
}


function normalizeLineEndings (str) {
  if (!str) return str;
  return str.replace(/\r\n|\r/g, '\n');
}

// Based on these two files:
// https://github.com/JedWatson/react-codemirror/blob/master/src/Codemirror.js
// https://github.com/FormidableLabs/component-playground/blob/master/src/components/editor.jsx
class JSXEditor extends Component {
  static propTypes = {
    theme: PropTypes.string,
    readOnly: PropTypes.bool,
    value: PropTypes.string,
    selectedLines: PropTypes.array,
    onChange: PropTypes.func,
    style: PropTypes.object,
    className: PropTypes.string
  }

  static defaultProps = {
    theme: "monokai",
  }

  state = {
    isFocused: false,
  }

  constructor(props) {
    super(props)

    this.componentWillReceiveProps = debounce(this.componentWillReceiveProps, 0)
  }

  componentDidMount() {
    const textareaNode = ReactDOM.findDOMNode(this.refs.textarea);
    const options = {
      mode: "jsx",
      lineNumbers: false,
      lineWrapping: false,
      smartIndent: false,
      matchBrackets: true,
      theme: this.props.theme,
      readOnly: this.props.readOnly,
      viewportMargin: Infinity,
    }

    this.codeMirror = codeMirror.fromTextArea(textareaNode, options);
    this.codeMirror.on('change', this.handleChange);
    this.codeMirror.on('focus', this.handleFocus.bind(this, true));
    this.codeMirror.on('blur', this.handleFocus.bind(this, false));
    this.codeMirror.on('scroll', this.handleScroll);
    this.codeMirror.setValue(this.props.defaultValue || this.props.value || '');
  }

  componentWillReceiveProps(nextProps) {
    if (this.codeMirror && nextProps.value !== undefined && normalizeLineEndings(this.codeMirror.getValue()) !== normalizeLineEndings(nextProps.value)) {
      if (this.props.preserveScrollPosition) {
        var prevScrollPosition = this.codeMirror.getScrollInfo();
        this.codeMirror.setValue(nextProps.value);
        this.codeMirror.scrollTo(prevScrollPosition.left, prevScrollPosition.top);
      } else {
        this.codeMirror.setValue(nextProps.value);
      }
    }
  }

  componentWillUnmount() {
    // is there a lighter-weight way to remove the cm instance?
    if (this.codeMirror) {
      this.codeMirror.toTextArea();
    }
  }

  highlightSelectedLines = () => {
    if (Array.isArray(this.props.selectedLines)) {
      this.props.selectedLines.forEach(lineNumber =>
        this.codeMirror.addLineClass(lineNumber, "wrap", "CodeMirror-activeline-background"))
    }
  }

  focus() {
    if (this.codeMirror) {
      this.codeMirror.focus()
    }
  }

  render() {
    return (
      <div className={cx(this.props.className, 'jsx-editor', { focused: this.state.isFocused })} style={this.props.style}>
        <textarea
          ref="textarea"
          defaultValue={this.props.value}
          autoComplete="off"
        />
      </div>
    )
  }

  handleFocus(isFocused) {
    this.setState({ isFocused })
  }

  handleChange = (doc, change) => {
    if (!this.props.readOnly && this.props.onChange && change.origin !== 'setValue') {
      this.props.onChange(doc.getValue())
    }
  }

  handleScroll = (codeMirror) => {
    this.props.onScroll && this.props.onScroll(codeMirror.getScrollInfo())
  }
}
```
