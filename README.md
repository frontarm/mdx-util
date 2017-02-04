mdx-it
======

[![npm version](https://img.shields.io/npm/v/mdx-it.svg)](https://www.npmjs.com/package/mdx-it)

Convert MDX files (i.e. JSX-infused Markdown files) into standard JSX files.

This package is a wrapper around the excellent [markdown-it](https://github.com/markdown-it/markdown-it) project. The major differences from __markdown-it__ are:

- __mdx-it__ outputs a React component<br />
  __markdown-it__ outputs a HTML file

- __mdx-it__ only supports markdown-it plugins that modify the parser<br />
  __markdown-it__ supports all markdown-it plugins (that is kind of the point)

- __mdx-it__ treats JSX tags as raw JavaScript, letting you add live code<br />
  __markdown-it__ treats HTML tags as strings

- __mdx-it__ supports theming by letting you override components at run-time<br />
  __markdown-it__ only supports theming via CSS

MDX was created so that live examples can be embedded in markdown-based documentation using JSX. It was first used in the website for the [junctions](https://github.com/jamesknelson/junctions) router for React, and the [sitepack](https://github.com/jamesknelson/sitepack) static website generator.

## Try It Yourself

The quickest way to try MDX is to use the included command line utility.

You can test with a standard markdown file, or you can copy-paste the example from the next section into a new file.

```bash
npm install -g mdx-it
mdx -o example-output.jsx example.mdx
```

If you're using webpack, you can use the [mdx-loader](https://github.com/jamesknelson/mdx-loader).

## MDX

The MDX format is almost identical to Markdown. The are two main differences:

- You may specify imports at the top of your file using ES6 modules syntax
- You may specify meta information at the top of your file using the [front-matter](https://jekyllrb.com/docs/frontmatter/) format

The output JSX will contain two exports:

- The main export will be a React stateless component that renders your content
- A `meta` object will contain the information in your front-matter

### Example

```markdown
---
description: junctions.js lets you add routes to your React components.
---
import Tab from './controls/Tab'
import ComponentExample from './controls/ComponentExample'
import GistVanillaExample from '../examples/GistVanilla.example'
import GistSugarFreeExample from '../examples/GistSugarFree.example'

# Junctions

Add routes to your reusable components.

## The Gist

<Tab.Group>
  <Tab.Item title='Vanilla React'>
      <ComponentExample example={GistVanillaExample} />
  </Tab.Item>
  <Tab.Item title='Sugar Free'>
      <ComponentExample example={GistSugarFreeExample} />
  </Tab.Item>
</Tab.Group>

## What about react-router 4?

The main difference between junctions.js and react-router is this: **junctions puts components first, react-router puts URLs first**.

This means that if you're building an application, junctions will probably solve your problem better. And while some people are still building websites, most people are building applications.

> Do not divide the web into documents and applications. Documents are dead.

- [@thejameskyle](https://twitter.com/thejameskyle/status/824790686822129665)
```

### Example Output

```jsx
import React, { createFactory } from 'react'
import Tab from './controls/Tab'
import ComponentExample from './controls/ComponentExample'
import GistVanillaExample from '../examples/GistVanilla.example'
import GistSugarFreeExample from '../examples/GistSugarFree.example'

module.exports = function({ factories={} }) {
  const {
    wrapper = createFactory('div'),
    a = createFactory('a'),
    blockquote = createFactory('blockquote'),
    h1 = createFactory('h1'),
    h2 = createFactory('h2'),
    li = createFactory('li'),
    p = createFactory('p'),
    strong = createFactory('strong'),
    ul = createFactory('ul'),
  } = factories

  return (
    wrapper({},
      h1({"id": "junctions"},
        "Junctions",
      ),
      p({},
        "Add routes to your reusable components.",
      ),
      h2({"id": "the-gist"},
        "The Gist",
      ),
      <Tab.Group>
        <Tab.Item title='Vanilla React'>
            <ComponentExample example={GistVanillaExample} />
        </Tab.Item>
        <Tab.Item title='Sugar Free'>
            <ComponentExample example={GistSugarFreeExample} />
        </Tab.Item>
      </Tab.Group>,
      h2({"id": "what-about-react-router-4"},
        "What about react-router 4?",
      ),
      p({},
        "The main difference between junctions.js and react-router is this: ",
        strong({},
          "junctions puts components first, react-router puts URLs first",
        ),
        ".",
      ),
      p({},
        "This means that if you’re building an application, junctions will probably solve your problem better. And while some people are still building websites, most people are building applications.",
      ),
      blockquote({},
        p({},
          "Do not divide the web into documents and applications. Documents are dead.",
        ),
      ),
      ul({},
        li({},
          a({"href": "https://twitter.com/thejameskyle/status/824790686822129665"},
            "@thejameskyle",
          ),
        ),
      )
    )
  )
}

module.exports.meta = {
  "description": "junctions.js lets you add routes to your React components."
}
```

## API

__mdx-it__ attempts to mimic the API of [markdown-it](https://github.com/markdown-it/markdown-it) where possible. In fact, the main export of __mdx-it__ inherits from the main export of __markdown-it__. Because of this, the __markdown-it__ documentation is your best friend.

### Example

This example is based on the [mdx-loader](https://github.com/jamesknelson/mdx-loader) package. It renders a string of MDX content, replacing image `src` attributes with `require` statements.

```js
var MDXIt = require('mdx-it')
var url = require('url')
var loaderUtils = require('loader-utils')
var frontMatter = require('front-matter')

function mdImageReplacer(md) {
  md.core.ruler.push('imageReplacer', function(state) {
    function applyFilterToTokenHierarchy(token) {
      if (token.children) {
        token.children.map(applyFilterToTokenHierarchy);
      }

      if (token.type === 'image') {
        var src = token.attrGet('src')
        if(!loaderUtils.isUrlRequest(src)) return;
        var uri = url.parse(src);
        uri.hash = null;
        token.attrSet('src', 'require("'+uri.format()+'")');
      }
    }

    state.tokens.map(applyFilterToTokenHierarchy);
  })
}

function renderMDX(content) {
  var md =
    new MDXIt({ linkify: true, typographer: true })
      .use(mdImageReplacer)
      .use(mdAnchor);

  var data = frontMatter(content);

  return md.render(data.body)
}
```

## Acknowledgements

- This wouldn't be possible without [markdown-it](https://github.com/markdown-it/markdown-it). A bit thanks to the team behind that project.

- This project also uses code from the JSX parser in the [markdown-it-jsx](https://www.npmjs.com/package/markdown-it-jsx) project.
