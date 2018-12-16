mdx-loader
==========

[![npm version](https://img.shields.io/npm/v/mdx-loader.svg)](https://www.npmjs.com/package/mdx-loader)

A webpack loader to convert Markdown files into React components.

**mdx-loader** uses [mdx-js/mdx](https://github.com/mdx-js/mdx) under the hood, and follows a batteries-included philosophy, adding a number of super awesome features:

* Emoji support via [remark-emoji](https://www.npmjs.com/package/remark-emoji) (e.g. \:+1\: -> :+1:)
* Image urls are automatically embedded as images via [remark-images](https://www.npmjs.com/package/remark-images)
* All headings have `id` slugs added via [remark-slug](https://github.com/remarkjs/remark-slug)
* Code blocks have markup for syntax highlighting via [prismjs](https://prismjs.com/) and [rehype-prism](https://github.com/mapbox/rehype-prism). *Note: you'll still need to import the prism stylesheet yourself.*
* Front matter is exported on a `frontMatter` object via [gray-matter](https://github.com/jonschlinkert/gray-matter).
* A table of contents object is exported on the `tableOfContents` object via [mdx-table-of-contents](./packages/mdx-table-of-contents).
* Pretty typograhy via [remark-textr](https://github.com/remarkjs/remark-textr).

## Usage

```
npm install --save-dev mdx-loader
```

### With create-react-app

MDX can be used with unejected create-react-app projects! To start, you'll need to add a `.babelrc` file to the root level of your project:

```
{
    "presets": ["babel-preset-react-app"]
}
```

Then, you can import a component from any Markdown file by prepending the filename with `!babel-loader!mdx-loader!`. For example:

```
/* eslint-disable import/no-webpack-loader-syntax */
import MyDocument from '!babel-loader!mdx-loader!../pages/index.md'
```

You can also import documents dynamically using the proposed `import()` syntax and [React.lazy()](https://reactjs.org/docs/code-splitting.html#reactlazy), without messing with linter config:

```
const MyDocument = React.lazy(() => import('!babel-loader!mdx-loader!../pages/index.md'))
```

### With Webpack

Start by adding an entry to your `module.rules` array:

```js
module: {
  rules: [
    /**
     * MDX is a tool that converts Markdown files to React components. This
     * loader uses MDX to create Page objects for Markdown files. As it
     * produces ES2015, the result is then passed through babel.
     */
    { test: /\.mdx?$/,
      use: [
        'babel-loader',
        'mdx-loader',
      ]
    },

    // ...
  ]
},
```

This assumes you've already got Babel set up with your Webpack project.

## Using your Markdown components

You can `import` and use your Markdown files like standard components. You can also import a `frontMatter` object that contains your document's front matter, and a `tableOfContents` object that contains a tree of your document's headings. For example:

```jsx
import React, { Component } from 'react'
import Document, { frontMatter, tableOfContents } from './document.md'

export default class Something extends Component {
  render() {
    return (
      <div>
        <h1>{frontMatter.title}</h1>
        <Document />
      </div>
    )
  }
}
```

## Syntax Highlighting

If you'd like to add styles for the syntax highlighting, include a Prism.js stylesheet somewhere within your application:

```js
import 'prismjs/themes/prism-tomorrow.css'
```
