/**
 * Handle the process of turning sources into a `render` function, memoizing
 * transforms and packed strings where appropriate to ensure that things aren't
 * needlessly rebuilt.
 *
 * A single Breadboard contains a single BreadboardBuild object.
 */
class BreadboardBuild {
  construtor(transforms, require, packer, renderToString) {

  }

  run(sources, shouldPack=true) {
    // - if sources are identical to previous sources, and a cached result
    //   exists, just use it

    // - run transforms on source files based on patterns, memoizing a single
    //   previous value per file. invalidate any cached packer result

    // - turn the transformed sources into a `render` file using the packer,
    //   so long as shouldPack is true

    return {
      // A `(mountpoint, props) => void` function that renders one frame of
      // the app with the given props. This function may be called without
      // cleaning up previous frames if the props change.
      render,

      // A single string that includes all transformed sources
      packedSource,

      // A paused FakeWindow object
      fakeWindow,
    }
  }

  renderToString(sources) {

  }
}



function defaultPack(source, require, window) {
  try {
    const exports = {}
    const module = { exports: exports }

    const execute = new Function(
      'window',
      'setTimeout',
      'setInterval',
      'requestAnimationFrame',
      'fetch',
      'History',
      'console',
      'module',
      'exports',
      'require',
      source
    )
    execute(
      window,
      window.setTimeout,
      window.setInterval,
      window.requestAnimationFrame,
      window.fetch,
      window.History,
      window.console,
      module,
      exports,
      require,
    )

    const component = exports.default

    return (mount, props={}) => {
      if (component) {
        try {
          ReactDOM.render(
            React.createElement(component, props),
            mount
          )
        }
        catch (err) {
          return err
        }
      }
    }
  }
  catch (err) {
    return () => err
  }
}
