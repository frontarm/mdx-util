'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _markdownIt = require('markdown-it');

var _markdownIt2 = _interopRequireDefault(_markdownIt);

var _slugify = require('slugify');

var _slugify2 = _interopRequireDefault(_slugify);

var _jsxRenderer = require('./jsxRenderer');

var _jsxRenderer2 = _interopRequireDefault(_jsxRenderer);

var _importsToCommonJS = require('./importsToCommonJS');

var _importsToCommonJS2 = _interopRequireDefault(_importsToCommonJS);

var _jsx_inline = require('./jsx_inline');

var _jsx_inline2 = _interopRequireDefault(_jsx_inline);

var _jsx_block = require('./jsx_block');

var _jsx_block2 = _interopRequireDefault(_jsx_block);

var _text_with_newline = require('./text_with_newline');

var _text_with_newline2 = _interopRequireDefault(_text_with_newline);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

_slugify2.default.extend({
  '>': '',
  '<': '',
  '`': ''
});

var DEFAULT_FACTORIES = {
  'wrapper': 'createFactory(\'div\')',
  'codeBlock': '(props, children) => createElement("pre", props, createElement("code", { dangerouslySetInnerHTML: { __html: children || props.children } }))'
};

function mdJSX(md) {
  // JSX should entirely replace embedded HTML.
  md.inline.ruler.before('text', 'text_with_newline', _text_with_newline2.default);
  md.inline.ruler.before('html_inline', 'jsx_inline', _jsx_inline2.default);
  md.block.ruler.before('html_block', 'jsx_block', _jsx_block2.default, ['paragraph', 'reference', 'blockquote', 'list']);

  md.disable('html_inline');
  md.disable('text');
  md.disable('html_block');
}

function mdAnchor(md) {
  var hasProp = {}.hasOwnProperty;

  var uniqueSlug = function uniqueSlug(slug, slugs) {
    // Mark this slug as used in the environment.
    slugs[slug] = (hasProp.call(slugs, slug) ? slugs[slug] : 0) + 1;

    // First slug, return as is.
    if (slugs[slug] === 1) {
      return slug;
    }

    // Duplicate slug, add a `-2`, `-3`, etc. to keep ID unique.
    return slug + '-' + slugs[slug];
  };

  md.core.ruler.push('anchor', function (state) {
    var slugs = {};
    var tokens = state.tokens;

    tokens.filter(function (token) {
      return token.type === 'heading_open';
    }).forEach(function (token) {
      // Aggregate the next token children text.
      var title = tokens[tokens.indexOf(token) + 1].children.filter(function (token) {
        return token.type === 'text' || token.type === 'code_inline';
      }).reduce(function (acc, t) {
        return acc + t.content;
      }, '');

      var slug = token.attrGet('id');

      if (slug == null) {
        slug = uniqueSlug((0, _slugify2.default)(title), slugs);
        token.attrPush(['id', slug]);
      }
    });
  });
}

function makeArray(stringOrArray) {
  return Array.isArray(stringOrArray) ? stringOrArray : [stringOrArray];
}

module.exports = function (_MarkdownIt) {
  _inherits(MDXC, _MarkdownIt);

  function MDXC() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, MDXC);

    if (options.initialIndent === undefined) {
      options.initialIndent = 0;
    }

    var _this = _possibleConstructorReturn(this, (MDXC.__proto__ || Object.getPrototypeOf(MDXC)).call(this, options));

    _this.use(mdJSX);
    _this.use(mdAnchor);

    // Make our factories available externally so the consuming applicaiton
    // can add different factories
    _this.factories = DEFAULT_FACTORIES;

    // Use our JSX renderer instead of the default HTML renderer
    _this.renderer = new _jsxRenderer2.default();
    return _this;
  }

  _createClass(MDXC, [{
    key: 'getFactoryForTag',
    value: function getFactoryForTag(tag) {
      return this.factories[tag] || 'createFactory(\'' + tag + '\')';
    }
  }, {
    key: 'parse',
    value: function parse(content, env) {
      var importLines = [];
      var bodyLines = content.split("\n");
      var props = ['factories={}'];
      while (bodyLines[0]) {
        var line = bodyLines.shift();
        var importMatch = line.match(/^(import|export)\s+.*\s+from\s+['"].*['"];?\s*$/);
        var propMatch = line.match(/^prop\s+([$_a-zA-Z][$_a-zA-Z0-9]*)\s*$/);

        if (importMatch) {
          importLines.push(line);
        } else if (propMatch) {
          var prop = propMatch[1];

          if (prop === 'factories') {
            throw new Error('mdx: You cannot define an `factories` prop, as it is reserved.');
          }

          props.push(prop);
        } else {
          bodyLines.unshift(line);
          break;
        }
      }

      this.imports = importLines.join('\n');
      this.props = props;
      this.body = bodyLines.join('\n');

      return _get(MDXC.prototype.__proto__ || Object.getPrototypeOf(MDXC.prototype), 'parse', this).call(this, this.body, env);
    }
  }, {
    key: 'render',
    value: function render(body, env) {
      var _this2 = this;

      env = env || {};

      var importsSource = [];
      if (!this.options.pragma) {
        importsSource.push('import React, { createElement, createFactory } from \'react\'');
      }

      if (this.options.imports) {
        importsSource = importsSource.concat(makeArray(this.options.imports));
      }

      var rendered = this.renderer.render(this.parse(body, env), this.options, env).trim();
      var result = rendered === '' ? 'wrapper({})' : 'wrapper({},\n\n' + rendered + '\n\n  )';
      importsSource = importsSource.concat(this.imports.split('\n'));

      var isCommonJS = !!this.options.commonJS;
      var imports = !isCommonJS ? importsSource.join('\n') : (0, _importsToCommonJS2.default)(importsSource.join('\n'));
      var tags = Array.from(this.renderer.tags.values()).sort();

      return this.options.unwrapped ? rendered + '\n' : imports + '\n' + (isCommonJS ? 'module.exports =' : 'export default') + ' function({ ' + this.props.join(', ') + ' }) {\n  const {\n' + tags.concat('wrapper').map(function (tag) {
        return '    ' + tag + ' = ' + _this2.getFactoryForTag(tag) + ',';
      }).join('\n') + ('\n  } = factories\n\n  return ' + result + '\n}\n');
    }
  }]);

  return MDXC;
}(_markdownIt2.default);