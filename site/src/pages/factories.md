Factories
=========

Components produced by MDXC can be configured to render custom components instead of standard HTML elements. This allows for tighter integration between your document components and React. For example:

- You add `#` anchors to your titles
- You could replace your code blocks with live examples
- You can replace `<a>` tags with react-router `<Link>` elements

To configure how HTML elements should be rendered, you pass factory functions to the special `factories` prop of your document components. For example, you could confuse your users by reversing how your headings are rendered:






```jsx
<Document
  factories={{
    h1: (props, children) => React.createFactory('h6'),
    h2: (props, children) => React.createFactory('h5'),
    h3: (props, children) => React.createFactory('h4'),
    h4: (props, children) => React.createFactory('h3'),
    h5: (props, children) => React.createFactory('h2'),
    h6: (props, children) => React.createFactory('h1'),
  }}
/>
```





Factory functions are expected to take two arguments (`props` and `children`), and return a React element -- just like the functions returned by [React.createFactory](https://facebook.github.io/react/docs/react-api.html#createfactory).

Each available key of the `factories` object corresponds to a HTML tag, with one exception --- `codeBlock` corresponds to a fenced block of code, and by default is rendered with `<pre><code>`.



Heading anchors
---------------

The MDXC website uses `h1`, `h2` and `h3` factories to add `#` anchors to titles. Hover over one of the titles to try it out.

```jsx
function headingFactory(type, props, ...children) {
  // Render the same props and children that were passed in, but prepend a
  // link to this title with the text '#'.
  return React.createElement(
    type,
    props,
    <a href={'#'+props.id}>#</a>,
    ...children
  )
}

<Document
  factories={{
    h1: (props, children) => headingFactory('h1', props, children),
    h2: (props, children) => headingFactory('h2', props, children),
    h3: (props, children) => headingFactory('h3', props, children),
  }}
/>
```






Live examples
-------------

The `mdx-breadboard` package uses a `codeBlock` factory to provide live examples for code blocks fenced with the `mdx` language.

```jsx
<Document
  factories={{
    codeBlock: (props, children) => {
      const language = props.className.replace(/^language-/, '')
      if (language.slice(0, 3) === 'mdx') {
        return <MDXBreadboard defaultSource={children} />
      }
      else {
        return <pre {...props}><code dangerouslySetInnerHTML={{ __html: children }} /</pre>
      }
    }
  }}
/>
```

The MDXC website website uses `mdx-breadboard`, so you can use it test out MDX!

```mdx
*So this will render a live MDX code example*
```





HTML5 History Links
-------------------

Navigation libraries like [react-router](https://reacttraining.com/react-router/web/api/Link) and [junctions](https://junctions.js.org/api/react-junctions/Link) often provide a Link component that supports `pushState`. To tell your document component to use this instead of a standard `<a>` tag, you can specify the `a` factory. Make sure to pass `<Link>` a `to` prop instead of a `href` prop.

```jsx
import { Link } from 'react-router'

<Document
  factories={{
    a: ({ href, ...other }, ...children) =>
      React.createElement(Link, {
        to: href,
        ...other
      }, ...children)
  }}
/>
```
