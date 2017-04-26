/**
 * Your Application component is the top-level component of your React
 * application. It is used by both `main.js` and `renderToString.js`.
 *
 * The `<Router>` component that is provided by sitepack-react will
 * use the `history` object to select the current page from the `site` object.
 *
 * As the `site` object contains a tree of Pages, the selected Page will
 * likely have a number of ancestors. The Router will iterate through these
 * ancestors, rendering any `wrapper` component that is specified.
 *
 * For example, if the current Page is a direct child of the root page, the
 * Router will render a tree of components that looks like so:
 *
 * +-------------------------+
 * | Root Page Wrapper       |
 * | +---------------------+ |
 * | | Contet Page Wrapper | |
 * | +---------------------+ |
 * +-------------------------+
 *
 * The Root Page Wrapper will be rendered for every page, so it is a good
 * place to put your site's header/footer.
 *
 * If you'd like to make navigation menus specific to one section, a Wrapper
 * is a good place to put them.
 *
 * Finally, the Wrapper for the selected page can render content-specific
 * elements like titles, metadata and loading spinners.
 */

import React, { Component, PropTypes } from 'react'
import { Router } from 'sitepack-react'

const Application = ({ site, history }) =>
  <Router site={site} history={history} />

export default Application
