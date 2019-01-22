/*
Code used under license from Gatsby
https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-remark-prismjs/src/
*/

const rangeParser = require(`parse-numeric-range`)

module.exports = function getCodeBlockDetails(fenceString, aliases={}) {
  function addNormalizedLanguage(options) {
    // PrismJS's theme styles are targeting pre[class*="language-"]
    // to apply its styles. We do the same here so that users
    // can apply a PrismJS theme and get the expected, ready-to-use
    // outcome without any additional CSS.
    //
    // @see https://github.com/PrismJS/prism/blob/1d5047df37aacc900f8270b1c6215028f6988eb1/themes/prism.css#L49-L54
    let language = options.language || 'text'

    options.normalizedLanguage = aliases[language.toLowerCase()] || language

    return options
  }

  if (!fenceString) {
    return addNormalizedLanguage({ language: null })
  }
  if (fenceString.split(`{`).length > 1) {
    let [language, ...options] = fenceString.split(`{`)
    let highlightedLineNumbers = []
    // Options can be given in any order and are optional
    options.forEach(option => {
      option = option.slice(0, -1)
      // Test if the option is for line hightlighting
      if (rangeParser.parse(option).length > 0) {
        highlightedLineNumbers = rangeParser.parse(option).filter(n => n > 0)
      }
      option = option.split(`:`)
    })

    return addNormalizedLanguage({
      language: language,
      highlightedLineNumbers,
    })
  }

  return addNormalizedLanguage({
    language: fenceString,
  })
}
