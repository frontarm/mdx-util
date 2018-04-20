"use strict";

const url = require('url')
const path = require('path')
const loaderUtils = require('loader-utils')
const frontMatter = require('front-matter')
const Prism = require('prismjs')
const MDXC = require('mdxc')


const env = {};


const aliases = {
  'js': 'jsx',
  'html': 'markup',
  'mdx': 'markdown',
  'md': 'markdown'
}
function highlight(str, lang) {
  if (!lang) {
    return str
  } else {
    lang = aliases[lang] || lang
    if (Prism.languages[lang]) {
      require(`prismjs/components/prism-${lang}.js`)
      return Prism.highlight(str, Prism.languages[lang])
    } else {
      return str
    }
  }
}


function mdImageReplacer(md) {
  md.core.ruler.push('imageReplacer', function(state) {
    function applyFilterToTokenHierarchy(token) {
      if (token.children) {
        token.children.map(applyFilterToTokenHierarchy);
      }

      if (token.type === 'image') {
        const src = token.attrGet('src')

        if(!loaderUtils.isUrlRequest(src)) return;

        const uri = url.parse(src);
        uri.hash = null;
        token.attrSet('src', { __jsx: 'require("'+uri.format()+'")' });
      }
    }

    state.tokens.map(applyFilterToTokenHierarchy);
  })
}


module.exports = function mdxLoader(content) {
  const loaderOptions = loaderUtils.getOptions(this) || {};

  if (loaderOptions.linkify === undefined) loaderOptions.linkify = true;
  if (loaderOptions.typographer === undefined) loaderOptions.typographer = true;
  if (loaderOptions.highlight === undefined) loaderOptions.highlight = highlight;

  let md = new MDXC(loaderOptions).use(mdImageReplacer)

  if (loaderOptions.pragma) {
    Object.assign(md.factories, {
      codeBlock: '(props, children) => '+loaderOptions.pragma+'("pre", props, '+loaderOptions.pragma+'("code", { dangerouslySetInnerHTML: { __html: children || props.children } }))'
    })
  }

  const data = frontMatter(content);
  const body = md.render(data.body, env);
  return body + `\n${loaderOptions.commonJS ? 'module.exports.meta' : 'export const meta'} = ${JSON.stringify(data.attributes, null, 2)}`
}
