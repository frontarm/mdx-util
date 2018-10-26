# `mdx.macro`

[![Babel Macro](https://img.shields.io/badge/babel--macro-%F0%9F%8E%A3-f5da55.svg?style=flat-square)](https://github.com/kentcdodds/babel-plugin-macros)

[![npm version](https://img.shields.io/npm/v/mdx.macro.svg)](https://www.npmjs.com/package/mdx.macro)

A babel macro for converting mdx into components, using the [@mdx-js/mdx](https://github.com/mdx-js/mdx#readme) package.

## Installation

Just install `mdx.macro`. It includes @mdx-js/mdx and @mdx-js/tag as dependencies.

```bash
npm install mdx.macro --save
```

## Usage

You have three options for importing your MDX:

- Dynamic import: `importMDX('./document.mdx')`
- Synchronous import: `importMDX.sync('./document.mdx')`
- The `mdx` tag: <code>mdx\`Create a \*\*component\*\* from a template literal\`</code>

### Dynamic import

Returns a promise to a component, which can be used with [React.lazy()](https://reactjs.org/docs/code-splitting.html#reactlazy)

```js
import { importMDX } from './mdx.macro'

const MyDocument = React.lazy(() => importMDX('./my-document.mdx'))

ReactDOM.render(
  <React.Suspense fallback={<div>Loading...</div>}>
    <MyDocument />
  </React.Suspense>,
  document.getElementById('root')
)
```

Works by creating a temporary file under your project's `node_modules/.cache/mdx.macro` directory, and importing that.

```js
import { importMDX } from './mdx.macro'

const promiseToMyDocument = importMDX('./my-document.mdx')

      ↓ ↓ ↓ ↓ ↓ ↓

const promiseToMyDocument = import('.cache/mdx.macro/my-document.hash1234.mdx.js')
```


### Synchronous import

Returns a component that can be used directly.

```js
import { importMDX } from './mdx.macro'

const MyDocument = importMDX.sync('./my-document.mdx')

ReactDOM.render(
  <MyDocument />,
  document.getElementById('root')
)
```

Works by creating a temporary file under your project's `node_modules/.cache/mdx.macro` directory, and importing that.

```js
import { importMDX } from './mdx.macro'

const MyDocument = importMDX.sync('./my-document.mdx')

      ↓ ↓ ↓ ↓ ↓ ↓

import _MyDocument from '.cache/mdx.macro/my-document.hash1234.mdx.js'

const MyDocument = _MyDocument
```


### Tagged Template Literals

Replaces an `mdx` tagged template literal with a document component. It also adds an `import` for `MDXTag`, but *doesn't* add an import for `React`.

```js
import { mdx } from './mdx.macro'

const MyDocument = mdx`
# Don't Panic

Since we decided a few weeks ago to adopt the leaf as legal tender, we have, of course, all become immensely rich.
`

      ↓ ↓ ↓ ↓ ↓ ↓

import { MDXTag } from '@mdx-js/tag'

const MyDocument = ({ components, ...props }) => (
  <MDXTag name="wrapper" components={components}>
    <MDXTag name="h1" components={components}>{`Don't Panic`}</MDXTag>
    <MDXTag name="p" components={components}>
      <MDXTag
        name="em"
        components={components}
        parentName="p"
      >{`Since we decided a few weeks ago to adopt the leaf as legal tender, we have, of course, all become immensely rich.`}</MDXTag>
    </MDXTag>
  </MDXTag>
)
```

## Caveats

Currently, changes to imported files aren't detected, even within create-react-app. Any PR that fixes this would be welcome!

## License

MIT