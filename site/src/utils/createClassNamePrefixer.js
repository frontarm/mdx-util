import classNames from 'classnames'

function prefixedClassNames(prefix, ...args) {
  return (
    classNames(...args)
      .split(/\s+/)
      .filter(name => name !== "")
      .map(name => `${prefix}-${name}`)
      .join(' ')
  )
}

export default function createClassNamePrefixer(prefix) {
  const prefixer = (...args) => prefixedClassNames(prefix, ...args)
  prefixer.root = (raw, ...args) => prefix + ' ' + prefixedClassNames(prefix, ...args) + ' ' + (raw || '')
  return prefixer
}
