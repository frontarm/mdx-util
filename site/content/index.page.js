export default {
  wrapper: 'SiteWrapper',
  title: "MDXC",
  content: require('./home.md'),
  children: [
    require('../../examples/props.mdx'),
    require('../../examples/import.mdx'),
    require('../../examples/basics.mdx'),
    require('../../examples/factories.mdx'),
  ]
}
