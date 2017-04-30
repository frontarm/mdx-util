export default {
  wrapper: 'SiteWrapper',
  title: "MDXC",
  metaTitle: "MDXC: Use React Components from Markdown",
  metaDescription: "MDXC is a tool to convert Markdown into React Components, making it possible to import and use React Components within your Markdown!",
  content: require('./home.md'),
  children: [
    require('../../examples/props.mdx'),
    require('../../examples/import.mdx'),
    require('../../examples/basics.mdx'),
    require('../../examples/factories.mdx'),
  ]
}
