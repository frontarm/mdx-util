/**
 * This file is used to tell Sitepack how to render the HTML content for each
 * Page which is statically rendered.
 *
 * Sitepack will call the default export, passing in an object with `history`
 * and `site` keys. These two arguments are also passed to the function
 * exported by `main.js`, allowing re-use of the `Application` component
 * between both files.
 *
 * - `history` is a History object, produced by the history package. It
 *   contains the URL for your application, and can be used with routers
 *   like react-router and junctions.
 *   
 *   See https://github.com/mjackson/history for more details.
 *
 * - `site` contains a Site object. This object has two properties:
 * 
 *   + `rootPage` points to the root Page for your site
 *   + `pages` contains an object with all pages in your site, keyed by
 *     page ID.
 */

import React from 'react'
import ReactDOMServer from 'react-dom/server'
import Application from './Application'

export default function renderToString({ history, site }) {
  return ReactDOMServer.renderToString(
    React.createElement(Application, {
      environment: 'static',
      history: history,
      site: site,
    })
  )
}
