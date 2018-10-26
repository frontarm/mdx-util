import { transform } from 'babel-standalone'

export default function transformJSX(code, pragma='createElement') {
  try {
    return transform(code, {
      plugins: [['transform-react-jsx', { pragma }]],
    }).code.replace(/;$/, '')
  }
  catch (e) {
    return
  }
}
