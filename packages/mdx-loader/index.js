const { getOptions } = require('loader-utils')
const emoji = require('remark-emoji')
const images = require('remark-images')
const textr = require('remark-textr')
const slug = require('remark-slug')
const mdx = require('@mdx-js/mdx')
const mdxTableOfContents = require('mdx-table-of-contents')
const mdxExportJSONByDefault = require('mdx-constant')
const grayMatter = require('gray-matter')
const typographicBase = require('typographic-base')
const rehypePrism = require('./rehype-prism')

module.exports = async function(source) {
  let result
  const { data, content: mdxContent } = grayMatter(source);
  const callback = this.async()
  const options = Object.assign(
    {
      mdPlugins: [
        slug,
        images, 
        emoji,
        [textr, { plugins: [typographicBase] }]
      ],
      hastPlugins: [
        rehypePrism,
      ],
      compilers: [
        mdxTableOfContents,
        mdxExportJSONByDefault('frontMatter', data)
      ]
    },
    getOptions(this),
    {filepath: this.resourcePath}
  );

  try {
    result = await mdx(mdxContent, options)
  } catch(err) {
    return callback(err)
  }

  let code = `
import React from 'react'
import { MDXTag } from '@mdx-js/tag'
${result}
`

  return callback(null, code)
}
