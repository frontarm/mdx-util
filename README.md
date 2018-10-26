mdx-util
========

**A collection of utilities for working with MDX**

-   [mdx-constant](./packages/mdx-constant)

    Exports a constant from MDX files that don't explicitly define it. Useful for implementing front matter with [gray-matter](https://github.com/jonschlinkert/gray-matter).

-   [mdx-loader](./packages/mdx-loader)

    A batteries included loader for MDX.

    * Emoji support via [remark-emoji](https://www.npmjs.com/package/remark-emoji)
    * Image urls are automatically embedded as images via [remark-images](https://www.npmjs.com/package/remark-images)
    * All headings have `id` slugs added via [remark-slug](https://github.com/remarkjs/remark-slug)
    * Code blocks have markup for syntax highlighting via [prismjs](https://prismjs.com/) and [rehype-prism](https://github.com/mapbox/rehype-prism). *Note: you'll still need to import the prism stylesheet yourself.*
    * Front matter is exported on a `frontMatter` object via [gray-matter](https://github.com/jonschlinkert/gray-matter).
    * A table of contents object is exported on the `tableOfContents` object via [mdx-table-of-contents](./packages/mdx-table-of-contents).

-   [mdx-table-of-contents](./packages/mdx-table-of-contents)

    An MDX plugin that exports a `tableOfContents` object, along with the exported component.

-   [mdx.macro](./packages/mdx.macro)

    An MDX macro to facilitate usage of MDX with [create-react-app](https://facebook.github.io/create-react-app/), *without* ejecting.