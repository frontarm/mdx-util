mdx-loader
==========

[![npm version](https://img.shields.io/npm/v/mdx-loader.svg)](https://www.npmjs.com/package/mdx-loader)

A webpack loader to convert Markdown files into React components.

**mdx-loader** uses [MDXC](https://github.com/jamesknelson/mdxc#using-mdx) under the hood. MDXC was created to allow for markdown-based documentation pages that can embed live examples using JSX. If you'd like a full static-website generation solution using MDX, see [junctions](https://junctions.js.org).

This loader adds markup for syntax highlighting using [Prism.js](http://prismjs.com/), but styles are not included automatically.

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
import DocumentComponent from '!babel-loader!mdx-loader!../pages/index.md'
```

You can also import documents dynamically using the proposed `import()` syntax. For an example of a statically rendered site using create-react-site and MDX, see [the source](https://github.com/jamesknelson/junctions/tree/master/site) for the [Junctions router site](https://junctions.js.org/tutorial/#Markdown-Components).

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

You can `import` and use your Markdown files like standard components. You can also import a `meta` object that contains your document's front matter. For example:

```jsx
import React, { Component } from 'react'
import Document, { meta } from './document.md'

export default class Something extends Component {
  render() {
    return (
      <div>
        <h1>{meta.title}</h1>
        <Document />
      </div>
    )
  }
}
```

You can also pass props to your component, and configure how the various Markdown elements are rendered. For more details, see the [MDXC documentation](http://mdxc.reactarmory.com/examples/props).

## Syntax Highlighting

If you'd like to add styles for the syntax highlighting, include a Prism.js stylesheet somewhere within your application:

```js
require('prismjs/themes/prism-tomorrow.css');
```

