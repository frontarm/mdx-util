const url = require('url')
const path = require('path')
const loaderUtils = require('loader-utils')
const frontMatter = require('front-matter')
const { loadPageWithContent } = require('sitepack/lib/loaderUtils')


module.exports = function rawPageLoader(content) {
  const loaderOptions = loaderUtils.getOptions(this) || {};
  const data = frontMatter(content);
  return loadPageWithContent(this, loaderOptions, data.attributes, 'module.exports = '+JSON.stringify(data.body))
}
