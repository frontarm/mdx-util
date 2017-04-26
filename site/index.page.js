export default {
  wrapper: 'MDXWrapper',
  title: "MDXC",
  content: require('!!raw!../docs/index.md'),
  children: [
    require('../examples/props.mdx'),
  ]
}
