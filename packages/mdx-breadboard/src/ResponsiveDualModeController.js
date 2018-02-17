function modesAreEqual(oldModes, newModes) {
  return Object.keys(oldModes).sort().join(',') === Object.keys(newModes).sort().join(',')
}


export default class ResponsiveDualModeController {
  constructor(env) {
    const {
      /**
       * Selects the secondary pane to display in the case that the user is
       * viewing the source pane on a small screen, and then the screen
       * expands to allow a second pane.
       */
      defaultSecondary='view',

      /**
       * The default mode to display upon load when the screen only contains
       * space for a single pane.
       */
      defaultMode='source',

      /**
       * The maximum width for which only a single pane will be used.
       */
      maxSinglePaneWidth=999,
    } = env

    this.defaultSecondary = defaultSecondary
    this.defaultMode = defaultMode
    this.maxSinglePaneWidth = maxSinglePaneWidth
    this.modes = {}
    this.primary = defaultMode
    this.listeners = []
  }

  subscribe(callback) {
    this.listeners.push(callback)
  }
  unsubscribe(callback) {
    this.listeners.splice(this.listeners.indexOf(callback), 1)
  }

  environmentDidChange(newEnv) {
    if (newEnv.maxSinglePaneWidth !== this.maxSinglePaneWidth) {
      this.maxSinglePaneWidth = newEnv.maxSinglePaneWidth
      this._recalc()
    }
  }

  actions = {
    selectMode: this.setMode.bind(this),

    selectTransformed: () => {
      this.setMode('transformed')
    },
    selectView: () => {
      this.setMode('view')
    },
    selectConsole: () => {
      this.setMode('console')
    },
    selectSource: () => {
      this.setMode('source')
    },
  }

  setMode(newMode) {
    this.primary = newMode
    this._recalc()
  }

  setDimensions({ width }) {
    this.width = width
    this._recalc()
  }

  _recalc() {
    const oldModes = this.modes
    const newModes = {}

    if (this.width !== undefined && this.width <= this.maxSinglePaneWidth) {
      newModes[this.primary] = true
    }
    else {
      newModes['source'] = true
      newModes[this.primary === 'source' ? this.defaultSecondary : this.primary] = true
    }

    if (!modesAreEqual(newModes, oldModes)) {
      this.modes = newModes

      for (let listener of this.listeners) {
        listener(this.modes)
      }
    }
  }
}