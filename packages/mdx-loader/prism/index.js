/*
Code used under license from mapbox and Gatsby
https://github.com/mapbox/rehype-prism
https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-remark-prismjs/src/
*/

const visit = require('unist-util-visit');
const nodeToString = require('hast-util-to-string');
const getCodeBlockOptions = require('./getCodeBlockOptions');
const highlightCode = require(`./highlightCode`)

const defaultAliases = {
  'js': 'jsx',
  'html': 'markup',
}

module.exports = options => {
  options = options || {};

  return tree => {
    visit(tree, 'element', visitor);
  };

  function visitor(node, index, parent) {
    if (!parent || parent.tagName !== 'pre' || node.tagName !== 'code') {
      return;
    }

    let fenceString
    const className = node.properties.className || [];
    for (const classListItem of className) {
      if (classListItem.slice(0, 9) === 'language-') {
        fenceString = classListItem.slice(9);
      }
    }

    const {
      language,
      normalizedLanguage,
      highlightedLineNumbers = [],
    } = getCodeBlockOptions(fenceString, options.aliases || defaultAliases);

    if (language === null) {
      return;
    }

    let code = nodeToString(node);
    try {
      node.properties.className = (parent.properties.className || [])
        .concat('language-' + normalizedLanguage);

      node.properties['data-language'] = normalizedLanguage
      node.properties['data-highlighted-line-numbers'] = highlightedLineNumbers.join(',')

      node.children = []
      node.properties.dangerouslySetInnerHTML = {
        __html: highlightCode(language, code, highlightedLineNumbers),
      }
    } catch (err) {
      if (/Unknown language/.test(err.message)) {
        return;
      }
      throw err;
    }
  }
};
