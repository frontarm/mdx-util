const fs = require('fs-extra')
const path = require('path')
const { createMacro } = require('babel-plugin-macros')
const babelPresetReactApp = require('babel-preset-react-app')
const findCacheDir = require('find-cache-dir')
const revHash = require('rev-hash')
const mdx = require('@mdx-js/mdx')
const parse = require('@babel/parser').parse
const traverse = require('babel-traverse').default

const cacheDir = findCacheDir({name: 'mdx.macro'})
const renamedSymbol = Symbol('renamed')

function writeTempFile(name, content) {
  let nameParts = path.basename(name).split('.')
  nameParts.splice(1, 0, revHash(content))
  nameParts.push('js')
  let pathname = path.resolve(cacheDir, nameParts.join('.'))
  fs.ensureDirSync(cacheDir)
  fs.writeFileSync(pathname, content)

  // Remove the path up to and including `node_modules`, so that
  // create-react-app won't complain about the file being somewhere else.
  return pathname.replace(/^.*\/node_modules\//, '')
}

function mdxMacro({ babel, references, state }) {
  let { importMDX = [], mdx = [] } = references

  importMDX.forEach(referencePath => {
    if (referencePath.parentPath.type === 'CallExpression') {
      importAsync({referencePath, state, babel})
    } else if (
      referencePath.parentPath.type === 'MemberExpression' &&
      referencePath.parentPath.node.property.name === 'sync'
    ) {
      hasSyncReferences = true
      importSync({referencePath, state, babel})
    } else {
      throw new Error(
        `This is not supported: \`${referencePath
          .findParent(babel.types.isExpression)
          .getSource()}\`. Please see the mdx.macro documentation`,
      )
    }
  })

  let hasInlineMDX = false
  mdx.forEach(referencePath => {
    hasInlineMDX = true
    inlineMDX({referencePath, state, babel})
  })

  if (hasInlineMDX) {
    let program = state.file.path
    let mdxTagImport = babel.transformSync(
      `import { MDXTag } from '@mdx-js/tag'`,
      {
        ast: true,
        filename: "mdx.macro/mdxTagImport.js"
      }
    )
    program.node.body.unshift(mdxTagImport.ast.program.body[0])
  }
}

function importAsync({
  babel,
  referencePath,
  state,
}) {
  let { types: t } = babel
  let { file: { opts: { filename } } } = state
  let documentFilename = referencePath.parentPath.node.arguments[0].value

  let pathname = transform({ babel, filename, documentFilename })

  // Replace the `importMDX.async()` call with a dynamic import()
  referencePath.parentPath.replaceWith(
    t.callExpression(t.import(), [t.stringLiteral(pathname)])
  )
}

function importSync({
  babel,
  referencePath,
  state,
}) {
  let { types: t } = babel
  let { file: { opts: { filename } } } = state
  let documentFilename = referencePath.parentPath.parentPath.node.arguments[0].value

  let pathname = transform({ babel, filename, documentFilename })
  let id = referencePath.scope.generateUidIdentifier(pathname)

  // Add an import statement
  let program = state.file.path
  program.node.body.unshift(
    t.importDeclaration(
      [t.importDefaultSpecifier(id)],
      t.stringLiteral(pathname),
    )
  )

  // Replace the `importMDX.sync()` call with the imported binding
  referencePath.parentPath.parentPath.replaceWith(id)
}

// Find the import filename,
function transform({ babel, filename, documentFilename }) {
  if (!filename) {
    throw new Error(
      `You must pass a filename to importMDX(). Please see the mdx.macro documentation`,
    )
  }
  let documentPath = path.join(filename, '..', documentFilename);
  let imports = `import React from 'react'\nimport { MDXTag } from '@mdx-js/tag'\n`

  // In development mode, we want to import the original document so that
  // changes will be picked up and cause a re-build.
  // Note: this relies on files with macros *not* being cached by babel.
  if (process.env.NODE_ENV === "development") {
    imports += `import '${documentPath}'\n`
  }

  let source = fs.readFileSync(documentPath, 'utf8');
  let transformedSource =
    babel.transformSync(
      imports+mdx.sync(source),
      {
        presets: [babelPresetReactApp],
        filename: documentPath,
      },
    ).code

  return writeTempFile(documentPath, transformedSource)
}

function inlineMDX({
  babel,
  referencePath,
  state,
}) {
  let { file: { opts: { filename } } } = state
  let program = state.file.path

  let rawCode = referencePath.parent.quasi.quasis[0].value.raw
  let transformedSource = mdx.sync(rawCode).replace('export default', '')

  // Need to parse the transformed source this way instead of
  // with babel.parse or babel.transform, as otherwise the
  // generated code has errors. I'm not sure why.
  let ast = parse(
    transformedSource,
    {
      plugins: ['jsx', 'objectRestSpread'],
      sourceType: "module",
      sourceFilename: filename,
    },
  )

  function visitImport(path) {
    let name = path.node.local.name
    var binding = path.scope.getBinding(name)
    if (!binding) {
      return
    }
    if (binding[renamedSymbol]) {
      return
    }

    path.scope.rename(name, referencePath.scope.generateUidIdentifier(name).name)
    binding[renamedSymbol] = true
  }

  // Rename any imports to unique identifiers to prevent
  // collisions between import names across multiple mdx tags
  traverse(ast, {
    ImportNamespaceSpecifier: visitImport,
    ImportDefaultSpecifier: visitImport,
    ImportSpecifier: visitImport,
  })

  ast.program.body.slice(0, -1).forEach(node => program.node.body.unshift(node))
  referencePath.parentPath.replaceWith(
    ast.program.body[ast.program.body.length - 1],
  )
}

module.exports = createMacro(mdxMacro)
