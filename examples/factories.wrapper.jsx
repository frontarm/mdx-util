/**
 * factories
 * ---------
 *
 * Components created with MDX allow you to specify the functions used to
 * render each HTML element by passing a `factories` prop.
 *
 * MDX provides sane defaults for your factories, so you can always use your
 * components without passing *any* props.
 *
 * Some common uses for factories include:
 * 
 * - replacing the default `<a>` element with a react-router or react-junctions
 *   `<Link>` element to add support for push-state navigation within MDX
 *   components
 * - augmenting the default header elements (like `<h1>`, `<h2>`, etc.) with
 *   links that let you navigate back to them in the future
 * - replacing code blocks with an editable preview
 */

import React from 'react'
import Props from '!!babel!mdx-loader!./factories.content.mdx'


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


console.log(Props)


export default function FactoriesExample() {
  // Render the content of our `props` example, but replacing h1, h2 and h3
  // elements with the result of our `headingFactory` function.
  return (
    <Props
      factories={{
        h1: (props, children) => headingFactory('h1', props, children),
        h2: (props, children) => headingFactory('h2', props, children),
        h3: (props, children) => headingFactory('h3', props, children),
      }}
    />
  )
}
