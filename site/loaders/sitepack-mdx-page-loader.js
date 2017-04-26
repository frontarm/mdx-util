const url = require('url')
const path = require('path')
const loaderUtils = require('loader-utils')
const frontMatter = require('front-matter')
const Prism = require('prismjs')
const MDXC = require('../../lib/mdxc')
const { loadPageWithContent } = require('sitepack/lib/loaderUtils')


const env = {};


const codeBlockAliases = {
  'js': 'jsx',
  'html': 'markup',
  'mdx': 'markdown',
  'md': 'markdown',
}
function highlight(str, lang) {
  if (!lang || lang == 'mdx') {
    return str
  }
  else {
    const language = codeBlockAliases[lang] || lang
    require(`prismjs/components/prism-${language}.js`)
    if (Prism.languages[language]) {
      return Prism.highlight(str, Prism.languages[language])
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


module.exports = function markdownLoader(content) {
  const loaderOptions = loaderUtils.getOptions(this) || {};

  loaderOptions.commonJS = true

  if (loaderOptions.linkify === undefined) loaderOptions.linkify = true;
  if (loaderOptions.typographer === undefined) loaderOptions.typographer = true;
  if (loaderOptions.highlight === undefined) loaderOptions.highlight = highlight;

  let mdxc = new MDXC(loaderOptions) .use(mdImageReplacer)

  const data = frontMatter(content);
  const body = mdxc.render(data.body, env);

  return loadPageWithContent(this, loaderOptions, data.attributes, body)
}
