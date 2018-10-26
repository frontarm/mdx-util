# MDXC has been deprecated in favor of [mdx-js/mdx](https://github.com/mdx-js/mdx).

MDXC is a tool to convert Markdown into React Components. *It lets you import and use other React Components within your Markdown.* [Try it yourself](http://mdxc.reactarmory.com/) with the MDXC Playground.

[![npm version](https://img.shields.io/npm/v/mdxc.svg)](https://www.npmjs.com/package/mdxc)

MDX is a simpler way to write content for your React applications. While standard Markdown compiles to a string of HTML, MDX compiles directly to JavaScript. **If you're writing a React app, MDX is both easier to use *and* more flexible than standard Markdown.**

Writing with MDX let's you use the full power of React, even when writing content.

- You can import and use custom components within your content
- You can replace Markdown's default elements with your own, allowing you to add custom behavior to links, headings, etc.
- You can nest Markdown-formatted content within JSX elements

## Try it yourself

You can try your hand at MDX using the [online demo](http://mdxc.reactarmory.com/), or the old fashioned way:

```bash
# Install the `mdxc` command line tool using npm
npm install -g mdxc

# Create a file with a single heading
echo '# Hello, World' > example.mdx

# Output the compiled component to your console
mdxc example.mdx
```

Other ways to use MDX include:

- Use it with [create-react-app](#create-react-app) to build static websites
- Use it with [Webpack](#webpack-with-mdx-loader)
- Use the [API](#api) directly

For details, jump to the [usage](#using-mdx) section

## Examples

Let's go over some of the basics -- we'll leave out the boilerplate on the JavaScript output. For more detailed examples or examples which can be run locally, see the `examples` directory.

### Tags

MDX, like JSX, requires all tags to be closed. This means that unclosed tags like `<br>` are just treated as plain text, while properly closed tags result in React elements.

```markdown
The tag <br> is not closed. The tag <br /> is closed.

Mixing <span>unclosed and <span>closed</span> treats the outermost tags as text.
```
```js
// Output
p({},
  "The tag <br> is not closed. The tag ",
  createElement("br", null),
  " is closed.",
),
p({},
  "Mixing <span>unclosed and ",
  createElement("span", null,
    "closed",
  ),
  " treats the outermost tags as text.",
)
```

### Attributes

Because an MDX file compiles to a React Component, you'll need to use React-style attributes like `className` (as opposed to `class`).

```markdown
<div className='super-classy' style={{textTransform: 'uppercase'}}>classy</div>
```
```js
// Output
createElement(
  'div',
  { className: 'super-classy', style: { textTransform: 'uppercase' } },
  'classy'
)
```

### Children

For tags which are "inline" -- i.e. within a paragraph of text, the tag's content is treated as Markdown -- you can use \`backticks\`, \*asterisks\*\*, etc. Inline tags can also contain nested tags, but unlike JSX, `{braces}` are treated as text.

```markdown
Within inline tags, <sup>{braces} are **text** and <sub>nested elements are ok</sub></sup>.
```
```js
// Output
p({},
  "Within inline tags, ",
  createElement("sup", null,
    "{braces} are ",
    strong({},
      "text",
    ),
    " and ",
    createElement("sub", null,
      "nested elements are ok",
    ),
  ),
  ".",
)
```

For tag "blocks" -- where a paragraph starts and ends with the same tag -- the content is treated as it would be in a JSX document. This means that whitespace is ignored, `backticks` are plain text and `{braces}` can be used to break out to JavaScript. If you'd like to pass Markdown-formatted text as children, wrap it in the special `<markdown>` tag.

```markdown
<div>
  # Markdown {"doesn't".toUpperCase()} work here.
  <markdown>
    *But does work here*.
  </markdown>
</div>
```
```js
// Output
createElement(
  "div",
  null,
  "# Markdown ",
  "doesn't".toUpperCase(),
  " work here.",
  wrapper({},
    p({},
      em({},
        "But does work here",
      ),
      ".",
    ),
  ),
)
```

### Imports

Markdown is limited in functionality by design, and MDX is no different. When you want to do something complex, you'll need to delegate to an old fashioned React component. And to access custom React components, you'll need to use `import`.

The syntax for MDX `import` is identical to ES2015 `import`. The only difference is that `import` statements must come before any whitespace or blank lines.

Say you have a `<Playground>` component that compiles and runs some example code on the fly. You might use it like this:

```markdown
import Example from './components/Example'

<Example>{`
console.log('Hello, World!')
`}</Example>
```
```js
import React, { createElement, createFactory } from 'react'
import Example from './components/Example'

export default function({ factories={} }) {
  const {
    wrapper = createFactory('div'),
  } = factories

  return wrapper({},

createElement(
  Example,
  null,
  `
console.log('Hello, World!')
`
)

  )
}
```

Notice how your content in the generated code uses a different indentation level to the wrapper code. This ensures that any strings within your MDX do not have unwanted spaces inserted at the start of each line.

### Props

You can declare that your generated component accepts a prop by adding a `prop [propname]` at the top of your file, after any imports. This variable can then be used within your embedded elements. Remember that `{braces}` are treated as strings within inline tags; if you want to interpolate a prop within your text, you'll need to do it within a JSX block!

```markdown
prop value
prop onChange

<h1>Hello{value ? ', '+value : ''}!</h1>

<input
  placeholder='What is your name?'
  value={value}
  onChange={onChange}
/>
```
```js
// Output
import React, { createElement, createFactory } from 'react'

export default function({ factories={}, value, onChange }) {
  const {
    wrapper = createFactory('div'),
  } = factories

  return wrapper({},

createElement(
  'h1',
  null,
  'Hello',
  value ? ', ' + value : '',
  '!'
),
createElement('input', {
  placeholder: 'What is your name?',
  value: value,
  onChange: onChange
})

  )
}
```

### Factories

When MDX generates code for your Markdown, it doesn't directly generate a JSX `<tag />` (or its JavaScript equivalent `React.createElement('tag')`). Instead, it calls a *factory function* with the tag's props and children.

Generally, you don't need to worry about factories. MDX provides default factories that just render the tag -- as expected. But variety is the spice of life, so in all likelihood you'll sometimes want to customize the behavior of certain tags. And doing so is as simple as passing an object to your generated component's `factories` prop!

#### Adding `pushState` support to links

If you're loading content within a React app, then in all likelihood your app is using HTML5 history through a library like [react-router](https://reacttraining.com/react-router/web/guides/quick-start) or [react-junctions](https://junctions.js.org/guide).

The great thing about HTML5 history is that it provides a way to navigate without reloading the page. The crap thing about it is that *good-ol' `<a>` tags will still reload the page*. So if you want your content to feel snappy and not out of place, you'll want it to use a `<Link>` component instead.

```js
// Assume './content' is a file generated by mdxc
import Content from './content'
import { Link } from 'react-router'

export default function ContentWrapper(props) {
  return (
    <Content
      {...props}
      factories={{ a: Link }}
    />
  )
}
```

#### Adding anchor links to headings

Another use for factories is to add "anchor links" to your headings. To do so, you'd pass in custom factories for tags like `h1` and `h2`.

```js
// Assume './content' is a file generated by mdxc
import Content from './content'

function headingFactory(type, props, ...children) {
  // Render the same props and children that were passed in, but prepend a
  // link to this title with the text '#'. Note that MDX already adds a slug
  // to each title under its `id` attribute.
  return React.createElement(
    type,
    props,
    <a href={'#'+props.id}>#</a>,
    ...children
  )
}

export default function ContentWrapper(props) {
  return (
    <Content
      {...props}
      factories={{
        h1: (props, children) => headingFactory('h1', props, children),
        h2: (props, children) => headingFactory('h2', props, children),
        h3: (props, children) => headingFactory('h3', props, children),
      }}
    />
  )
}
```

## Using MDX

### Videos
[Create and import React components with Markdown using MDXC](https://egghead.io/lessons/react-create-and-import-react-components-with-markdown-using-mdxc) by [@andrewdelprete](https://twitter.com/andrewdelprete)

### Command line

A tool wouldn't be a tool without a good old CLI. It probably isn't that useful, but hey. It's the vibe, and all that. What I mean is, if you must, you may use the CLI to create `js` files from `mdx` files by hand.

```
# Install the `mdxc` command line tool using npm
> npm install -g mdxc

# Then call `mdxc --help` to see how to use it
> mdxc --help

Usage: mdxc [options] <file>

Compile mdx to js

Options:

  -h, --help           output usage information
  -V, --version        output the version number
  -c, --common         use commonJS modules (i.e. module.exports and require)
  -p, --pragma         set the JSX pragma (defaults to React.createElement)
  -o, --output <file>  output to file instead of console
  -u, --unwrapped      don't wrap the content in a React component
```

### create-react-app

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

You can also import documents dynamically using the proposed `import()` syntax.

For an example of a statically rendered site using create-react-site and MDX, see [the source](https://github.com/jamesknelson/junctions/tree/master/site) for the [Junctions router site](https://junctions.js.org/tutorial/#Markdown-Components).

### Webpack with mdx-loader

If you'd like to use MDX within an existing react app, chances are you'll want to use [mdx-loader](http://github.com/jamesknelson/mdx-loader). To do so, just add it to your project and then update your `webpack.config.js`. Bear in mind that MDXC outputs ES2015, so you'll need to run the output through Babel if you want to support older browsers.

```bash
# Add mdx-loader to your project
npm install --save-dev mdx-loader
```

Assuming you're using Webpack 2, you'll need to add an entry to your `module.rules` array:

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

Then import and use your components as you'd do with standard JavaScript!

You may also specify options in Webpack config:

```js
module: {
  rules: [
    { test: /\.mdx?$/,
      use: [
        'babel-loader',
        {
          loader: 'mdx-loader',
          options: {
            pragma: 'h',
            imports: [
              'import h from \'h\''
            ]
          }
      ]
    }
  ]
}
```

### API

At its core, MDXC is just a wrapper around the excellent and highly configurable [markdown-it](https://github.com/markdown-it/markdown-it) project. This means that its API is mostly the same.

The major difference is that the default renderer from markdown-it has been replaced with a non-configurable renderer. Existing markdown-it plugins will work, but any hooks on the renderer will silently fail. This is the behavior you want, as these hooks transform HTML strings, and MDXC doesn't use any HTML strings. If you need to transform the output, use factories instead.

To transform MDX into JavaScript, create an instance of the `MDXC` class and then call its `render` method. If you'd like to load any markdown-it plugins, call the `use` method on your `MDXC` instance before calling `render`.

```js
import MDXC from 'mdxc'

var mdxc = new MDXC({
  linkify: true,
  typographer: true,
})

var js = mdxc.render('# This is a heading')
```

The options to `mdxc` are mostly the same as the options for markdown-it. For details, see the [markdown-it](https://markdown-it.github.io/markdown-it/) API docs. 

MDXC also provides a few extra options.

- `commonJS` *bool* If true, your imports/exports will be transformed to use `require()` and `module.exports`
- `unwrapped` *bool* If true, the component definition boilerplate will be omitted
- `pragma` *string* Allows you to set the JSX pragma to something other than the default of `React.createElement`. Setting the pragma will stop mdxc from importing `React` by default.

To see this all in use, here is a slimmed-down version of the `mdx-loader` package:

```js
const url = require('url')
const path = require('path')
const loaderUtils = require('loader-utils')
const Prism = require('prismjs')
const MDXC = require('mdxc')

// Set up syntax highlighting for code blocks with PrismJS
const aliases = {
  'js': 'jsx',
  'html': 'markup'
}
function highlight(str, lang) {
  if (!lang) {
    return str
  }
  else {
    lang = aliases[lang] || lang
    require(`prismjs/components/prism-${lang}.js`)
    if (Prism.languages[lang]) {
      return Prism.highlight(str, Prism.languages[lang])
    } else {
      return str
    }
  }
}

// A markdown-it plugin that requires your images with Webpack
function mdImageReplacer(md) {
  md.core.ruler.push('imageReplacer', function(state) {
    function applyFilterToTokenHierarchy(token) {
      if (token.children) {
        token.children.map(applyFilterToTokenHierarchy);
      }
      if (token.type === 'image') {
        const src = token.attrGet('src')
        if(!loaderUtils.isUrlRequest(src)) return;
        const uri = url.parse(src);
        uri.hash = null;
        token.attrSet('src', { __jsx: 'require("'+uri.format()+'")' });
      }
    }
    state.tokens.map(applyFilterToTokenHierarchy);
  })
}

module.exports = function mdxLoader(content) {
  const mdxc =
    new MDXC({
      commonJS: true,
      linkify: true,
      typographer: true,
      highlight: highlight,
    })
      .use(mdImageReplacer)

  return mdxc.render(content);
}
```

## MDX in the wild

- [junctions](https://junctions.js.org), a router for React ([website source](https://github.com/jamesknelson/junctions/tree/master/docs))
- [React Armory](https://reactarmory.com)
- *create a PR to add your own site!*

## Acknowledgments

Mad props to [markdown-it](https://github.com/markdown-it/markdown-it) for doing the hard yards which make MDXC possible. Also, [markdown-it-jsx](https://github.com/osnr/markdown-it-jsx) provided the base for parsing JSX tags out of Markdown files. Finally, there would be no use making MDXC unless React, Webpack and Babel already existed.

## Contributing

Help is muchly appreciated! In particular, PRs for the following would be super duper great:

- Improved tests
- Refactoring existing code to be prettier and faster
- Generating more concise JavaScript

