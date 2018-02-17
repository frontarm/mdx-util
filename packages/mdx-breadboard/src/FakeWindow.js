export default class FakeWindow {
  constructor(console) {
    this.seq = 1

    this.timeouts = []
    this.intervals = []
    this.frames = []

    this.actions = {
      console: console,

      setTimeout: (cb, ms) => {
        const id = window.setTimeout(cb, ms)
        this.timeouts.push(id)
        return id
      },

      setInterval: (cb, ms) => {
        const id = window.setInterval(cb, ms)
        this.intervals.push(id)
        return id
      },

      requestAnimationFrame: (cb) => {
        const id = window.requestAnimationFrame(cb)
        this.frames.push(id)
        return id
      },

      fetch: (...args) => {
        const seq = this.seq
        return new Promise((resolve, reject) =>
          window.fetch(...args).then(
            (...success) => {
              if (seq === this.seq) {
                resolve(...success)
              }
            },
            (...failure) => {
              if (seq === this.seq) {
                reject(...failure)
              }
            }
          )
        )
      },

      History: {},
    }
  }

  reset() {
    for (let timeout of this.timeouts) {
      window.clearTimeout(timeout)
    }
    for (let interval of this.intervals) {
      window.clearInterval(interval)
    }
    for (let frame of this.frames) {
      window.cancelAnimationFrame(frame)
    }

    this.timeouts.length = 0
    this.intervals.length = 0
    this.frames.length = 0

    this.actions.console.clear()
    this.seq++
  }

  destroy() {
    this.reset()
    this.actions.console = null
  }
}
