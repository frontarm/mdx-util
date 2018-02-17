import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import ExecutionEnvironment from 'exenv'
import PropTypes from 'prop-types'
import hoistNonReactStatics from 'hoist-non-react-statics'


let breadboardResizeObserver
if (ExecutionEnvironment.canUseDOM) {
  const ResizeObserver = require('resize-observer-polyfill').default

  class BreadboardResizeObserver {
    constructor() {
      this.callbacks = new Map
      this.observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const callback = this.callbacks.get(entry.target)

          if (callback) {
            callback({
              height: entry.contentRect.height,
              width: entry.contentRect.width,
            })
          }
        }
      })
    }

    observe(target, callback) {
      this.observer.observe(target)
      this.callbacks.set(target, callback)
    }

    unobserve(target, callback) {
      this.observer.unobserve(target)
      this.callbacks.delete(target, callback)
    }
  }

  breadboardResizeObserver = new BreadboardResizeObserver
}


/**
 * Inject the child element's width and height, as computed by a
 * ResizeObserver.
 */
export class InjectDimensions extends Component {
  static propTypes = {
    /**
     * The value to use for `height` before we are able to make a measurement.
     */
    defaultHeight: PropTypes.number,

    /**
     * The value to use for `width` before we are able to make a measurement.
     */
    defaultWidth: PropTypes.number,

    /**
     * If a number or `null`, the height will be passed directly to the child
     * element instead of being observed.
     */
    height: PropTypes.number,

    /**
     * If a number or `null`, the width will be passed directly to the child
     * element instead of being observed.
     */
    width: PropTypes.number,

    /**
     * This component expects a single child that is a React Element.
     */
    children: PropTypes.element.isRequired,
  }

  constructor(props) {
    super(props)

    // The dimensions are not defined until we can measure them, or unless
    // a fixed value is provided.
    this.state = {
      observed: false,
      height: undefined,
      width: undefined,
    }
  }

  componentDidMount() {
    const shouldObserve = this.props.width === undefined || this.props.height === undefined

    if (shouldObserve) {
      this.observe()
    }
  }

  componentWillReceiveProps(nextProps) {
    const shouldObserve = nextProps.width === undefined || nextProps.height === undefined

    if (shouldObserve && !this.state.observed) {
      this.observe()
    }
    else if (!shouldObserve && this.state.observed) {
      this.unobserve()
      this.setState({
        observed: false,
      })
    }
  }
  componentDidUpdate(prevProps, prevState) {
    const shouldObserve = this.props.width === undefined || this.props.height === undefined

    if (this.domNode !== this.state.observed) {
      this.unobserve()
      if (this.domNode && shouldObserve) {
        this.observe()
      }
    }
  }
  componentWillUnmount() {
    this.unobserve()
  }

  shouldComponentUpdate(nextProps, nextState) {
    const measuredHeightChanged = nextState.height !== this.state.height
    const measuredWidthChanged = nextState.width !== this.state.width

    // don't cause an update when it originated from a resize observation,
    // but that observation is overriden by a forced width/height
    const insignificantMeasurementOccured =
      nextState.observed && this.state.observed &&
      (measuredHeightChanged || measuredWidthChanged) &&
      !(
        (measuredHeightChanged && nextProps.height === undefined) ||
        (measuredWidthChanged && nextProps.width === undefined)
      )

    return !insignificantMeasurementOccured
  }

  render() {
    const props = this.props
    const state = this.state

    return React.cloneElement(
      React.Children.only(props.children),
      {
        width: state.width === undefined ? props.defaultWidth : state.width,
        height: state.height === undefined ? props.defaultHeight : state.height,
        ref: this.receiveRef,
      }
    )
  }

  receiveRef = (x) => {
    this.domNode = x && ReactDOM.findDOMNode(x)
  }

  handleResize = (measured) => {
    this.setState({
      height: measured.height,
      width: measured.width,
    })
  }

  observe() {
    breadboardResizeObserver.observe(this.domNode, this.handleResize)
    const measured = this.domNode.getBoundingClientRect()
    this.setState({
      observed: this.domNode,
      height: measured.height,
      width: measured.width,
    })
  }

  unobserve() {
    if (this.state.observed) {
      breadboardResizeObserver.unobserve(this.state.observed, this.handleResize)
    }
  }
}

export function injectDimensions(WrappedComponent) {
  function InjectDimensionsWrapper ({ defaultHeight, defaultWidth, height, width, ...other }) {
    return React.createElement(InjectDimensions, { defaultHeight, defaultWidth, height, width },
      React.createElement(WrappedComponent, other)
    )
  }

  hoistNonReactStatics(InjectDimensionsWrapper, WrappedComponent)

  return InjectDimensionsWrapper
}

injectDimensions.withConfiguration = function(forceProps) {
  return function injectDimensions(WrappedComponent) {
    function InjectDimensionsWrapper (props) {
      const { defaultHeight, defaultWidth, height, width, ...other } = Object.assign({}, props, forceProps)

      return React.createElement(InjectDimensions, { defaultHeight, defaultWidth, height, width },
        React.createElement(WrappedComponent, other)
      )
    }

    hoistNonReactStatics(InjectDimensionsWrapper, WrappedComponent)

    return InjectDimensionsWrapper
  }
}