'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transformJSX;

var _babelStandalone = require('babel-standalone');

function transformJSX(code) {
  var pragma = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'createElement';

  try {
    return (0, _babelStandalone.transform)(code, {
      plugins: [['transform-react-jsx', { pragma: pragma }]]
    }).code.replace(/;$/, '');
  } catch (e) {
    return;
  }
}