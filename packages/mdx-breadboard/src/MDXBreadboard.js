import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Controller, createController } from 'hatt'
import frontMatter from 'front-matter'
import MDXC from 'mdxc'
import { transform } from 'babel-standalone'
import compose from './compose'
import ResponsiveDualModeController from './ResponsiveDualModeController'
import Breadboard from './Breadboard'


const wrappedMDXC = new MDXC({
  linkify: true,
  typographer: true,
  highlight: false,
})
const unwrappedMDXC = new MDXC({
  linkify: true,
  typographer: true,
  highlight: false,
  unwrapped: true,
})


class ViewController extends Controller {
  static actions = {
    setValue(e) {
      this.setState({
        value: e.target.value,
      })
    },
  }

  static initialState = {
    value: null,
  }

  output() {
    return {
      ...this.env,
      value: this.state.value,
      onChange: this.actions.setValue,
    }
  }
}


export default class MDXBreadboard extends Component {
  static propTypes = {
    /**
     * The default mode to display upon load when the screen only contains
     * space for a single pane.
     */
    defaultMode: PropTypes.oneOf(['source', 'view', 'transformed', 'console']),

    /**
     * Selects the secondary pane to display in the case that the user is
     * viewing the source pane on a small screen, and then the screen
     * expands to allow a second pane.
     */
    defaultSecondary: PropTypes.oneOf(['view', 'transformed', 'console']).isRequired,

    /**
     * Configures whether the wrapper code will be displayed within the
     * transformed view.
     */
    defaultUnwrapped: PropTypes.bool,

    /**
     * Allows you to configure the factories of the rendered MDXDocument
     * object.
     */
    factories: PropTypes.object,

    /**
     * A function that renders the breadboard given a set of state and
     * event handlers.
     */
    theme: PropTypes.shape({
      renderBreadboard: PropTypes.func,
      renderCode: PropTypes.func,
      renderEditor: PropTypes.func,
    }),
  }

  static defaultProps = {
    defaultMode: 'source',
    defaultSecondary: 'view',
    defaultUnwrapped: false,
  }

  constructor(props) {
    super(props)

    this.modesController = new ResponsiveDualModeController({
      maxSinglePaneWidth: props.theme.maxSinglePaneWidth,
      defaultSecondary: props.defaultSecondary,
      defaultMode: props.defaultMode,
    })

    this.viewController = createController(ViewController, {
        factories: {
          ...this.props.factories,
          codeBlock: this.renderCodeBlock,
        },
      })

    this.state = {
      unwrapped: this.props.defaultUnwrapped,
      transform: this.transform.bind(this, this.props.defaultUnwrapped)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.theme.maxSinglePaneWidth !== this.props.theme.maxSinglePaneWidth) {
      this.modesController.environmentDidChange({
          maxSinglePaneWidth: nextProps.theme.maxSinglePaneWidth,
      })
    }
    if (nextProps.factories !== this.props.factories) {
      this.viewController.setEnv({
        factories: {
          ...this.props.factories,
          codeBlock: this.renderCodeBlock,
        },
      })
    }
  }

  componentWillUnmount() {
    this.viewController.destroy()
  }

  renderCodeBlock = (props, children) => {
    const language = props.className.replace(/^language-/, '')
    let renderBreadboard

    if (language.slice(0, 3) === 'mdx') {
      const optionStrings = language.slice(4).replace(/^\{|\s|\}$/g, '').split(',')
      const options = {}
      for (let str of optionStrings) {
        if (str.indexOf('=') === -1) {
          options[str] = true
        }
        else {
          const parts = str.split('=')
          options[parts[0]] = parts[1]
        }
      }
      renderBreadboard = (themeProps) =>
        <MDXBreadboard
          {...themeProps}
          require={this.props.require}
          defaultSource={children}
          defaultUnwrapped={!!options.unwrapped}
          defaultMode={options.mode || 'source'}
          defaultSecondary={options.secondary || 'view'}
        />
    }

    return this.props.theme.renderCode({ language, renderBreadboard, source: children })
  }

  renderTheme = (props) => {
    return this.props.theme.renderBreadboard(Object.assign({}, props, {
      defaultMode: this.props.defaultMode,
      defaultSecondary: this.props.defaultSecondary,

      unwrapped: this.state.unwrapped,
      onToggleWrapped: this.toggleWrapped,
    }))
  }

  render() {
    const { factories, defaultUnwrapped, ...other } = this.props

    return (
      <Breadboard
        {...other}
        viewController={this.viewController}
        modesController={this.modesController}
        theme={this.renderTheme}
        transform={this.state.transform}
        renderEditorElement={this.props.theme.renderEditor}
      />
    )
  }

  toggleWrapped = () => {
    const newUnwrapped = !this.state.unwrapped

    this.setState({
      unwrapped: newUnwrapped,
      transform: this.transform.bind(this, newUnwrapped)
    })
  }

  transform = (unwrapped, source) => {
    const result = {}
    const data = frontMatter(source)
    const es6 = wrappedMDXC.render(data.body)
    const pretty = unwrapped ? unwrappedMDXC.render(data.body) : es6
    let runnableCode
    let error = null
    try {
      runnableCode = transform(es6, { presets: ['latest'] }).code
    }
    catch (e) {
      error = e
    }

    return {
      transformedSource: pretty,
      executableSource: runnableCode,
      error,
    }
  }
}
