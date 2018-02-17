import { MDXBreadboard } from 'mdx-breadboard'
import Warning from './Warning'

Imports
=======

MDX is a tool for creating *simple* React components with Markdown; it is limited in functionality by design. When you want to do something complex, you'll need to delegate to an old fashioned React component. And to access external components, you'll need to use `import`.

If you're familiar with the JavaScript `import` statement then you already know how to use `import` in MDX; the syntax is identical.

The only difference between MDX and ES2015 `import` is MDX imports **must** appear before the first empty line, and must not contain any leading whitespace.

So for example, this MDX document starts with a valid `import` statement:

<MDXBreadboard defaultSource={`
import { MDXBreadboard } from 'mdx-breadboard'

*The import statement at the top of this example will be extracted from your content.*
`} />

<Warning>
Import statements cannot have leading space!
</Warning>

<Warning>
Import statements must appear at the top of the file. Any leading empty lines will cause the import to be treated as text.
</Warning>

Finally, all import statements must follow the form `import ... from "..."` or `import ... from '...'`. For example, the following *is not* an MDX import statement, as it does not contain any quotes:

<MDXBreadboard defaultSource={`
import a moose from tasmania

*The line at the top of this example will be part of your content.*
`} />
