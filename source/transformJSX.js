import { transform } from 'babel-core'


export default function transformJSX(code) {
  try {
    return transform(code, {
      babelrc: false,
      plugins: [
        'babel-plugin-syntax-jsx',
        ['babel-plugin-transform-react-jsx', { pragma: 'createElement' }]]
      }).code.replace(/;$/, '')
  }
  catch (e) {
    return
  }
}
