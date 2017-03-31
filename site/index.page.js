module.exports = {
  wrapper: 'SiteWrapper',
  title: "mdxc",
  description: "mdxc - A tool to convert Markdown into React components",
  content: require('./index.mdx'),
  children: [
    require('../examples/factories.page.js'),
    require('../examples/import.mdx'),
    require('../examples/props.mdx'),
    require('../examples/tags.mdx'),
  ]
}
