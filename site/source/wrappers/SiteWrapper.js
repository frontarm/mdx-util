import './SiteWrapper.less'
import React, { PropTypes } from 'react'
import { Link } from 'sitepack-react'
import createClassNamePrefixer from '../utils/createClassNamePrefixer'


const cx = createClassNamePrefixer('RA-SiteWrapper')

function HomeLinkTheme({ factory, active, children }) {
  return factory({ className: cx.childRoot('HomeLinkTheme') }, 'MDX')
}

function NavLinkTheme({ factory, active, children }) {
  return factory({ className: cx.childRoot('NavLinkTheme', { active }) }, children)
}


SiteWrapper.propTypes = {
  page: PropTypes.object.isRequired,
  children: PropTypes.node,
}
export default function SiteWrapper({ page, children }) {
  return (
    <div className={cx.root()}>
      <nav>
        <Link page='/site/index.page.js' theme={<HomeLinkTheme />} />
        <Link page='/examples/tags.mdx' theme={<NavLinkTheme />}>tags</Link>
        <Link page='/examples/props.mdx' theme={<NavLinkTheme />}>props</Link>
        <Link page='/examples/import.mdx' theme={<NavLinkTheme />}>import</Link>
        <Link page='/examples/factories.page.js' theme={<NavLinkTheme />}>factories</Link>
      </nav>
      <main>
        {
          /* `children` will be `undefined` on 404 */
          children || '404'
        }
      </main>
      <footer className={cx('footer')}>
        Copyright &copy; 2017 James K Nelson. Powered by <a href="https://github.com/jamesknelson/sitepack">Sitepack</a> and <a href="https://github.com/jamesknelson/mdxc">mdxc</a>.
      </footer>
    </div>
  )
}
