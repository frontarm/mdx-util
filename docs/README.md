import { MDXBreadboard } from 'armo-breadboard'

MDXC
====

MDXC is a tool to convert Markdown into React Components. It lets you `import` and use other Components within your Markdown. Like so:

<MDXBreadboard defaultMode='view' defaultSource={`
import { MDXBreadboard } from 'armo-breadboard'
_Turtles?_
<MDXBreadboard defaultSource='**Turtles!**' />
`} />


MDXC also lets you:

- Use custom components to render code blocks, headings, etc.
- Integrate Markdown links with react-router
- Nest Markdown within JSX
- `import` Markdown using Webpack
- Use React `props` within Markdown
- Use [markdown-it](https://github.com/markdown-it/markdown-it) parser plugins




Usage
-----

To start using MDX documents, you can either use the supplied command-line tool, or you can configure Webpack with mdx-loader.


### Command Line

Test


### Webpack

Test


API
---

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



MDX in the wild
---------------

- [Junctions](https://junctions.js.org), a tool for handling navigation history within React applications
- *Add your site via PR!*


Acknowledgments
---------------

Mad props to [markdown-it](https://github.com/markdown-it/markdown-it) for doing the hard yards which make MDXC possible. Also, [markdown-it-jsx](https://github.com/osnr/markdown-it-jsx) provided the base for parsing JSX tags out of Markdown files. Finally, there would be no use making MDXC unless React, Webpack and Babel already existed.


Contributing
------------

Help is muchly appreciated! In particular, PRs for the following would be super duper great:

- Improved tests
- Refactoring existing code to be prettier and faster
- Generating more concise JavaScript