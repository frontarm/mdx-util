import { Controller } from 'hatt'

export default class ConsoleController extends Controller {
  static actions = {
    log(...args) {
      this.logMessage('log', ...args)
    },
    error(...args) {
      this.logMessage('error', ...args)
    },
    warn(...args) {
      this.logMessage('warn', ...args)
    },

    clear() {
      this.setState({ messages: [] })
    }
  }

  static initialState = {
    messages: [],
  }

  logMessage(type, ...args) {
    this.setState({
      messages: this.state.messages.concat({ type, args })
    })
  }

  output() {
    return {
      actions: this.actions,
      messages: this.state.messages,
    }
  }
}
