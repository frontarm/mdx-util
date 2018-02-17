import React from 'react'
import { createJunctionTemplate, createPageTemplate, JunctionActiveChild } from 'react-junctions'
import { MDXWrapper } from './MDXWrapper'
import { Navbar } from './Navbar'
import './App.css'


export const App = ({ env, junction }) =>
  <div className='App'>
    <a
      className='App-github-ribbon'
      href="https://github.com/jamesknelson/mdxc"
      title="Fork me on GitHub">
      Fork me on GitHub
    </a>

    <Navbar
      env={env}
      className='App-nav'
    />

    <main className='App-content'>
      <JunctionActiveChild
        env={env}
        junction={junction}
        notFoundElement={
          <div className='App-notfound'>
            <h1>404</h1>
          </div>
        }
      />
    </main>

    <footer className='App-footer'>
      <a className='App-footer-author' href='https://twitter.com/james_k_nelson'>By @james_k_nelson</a>
    </footer>
  </div>


export const AppJunctionTemplate = createJunctionTemplate({
  children: {
    '/': createPageTemplate({
      title: 'MDXC',
      component: MDXWrapper,
      getContent: () => import('!raw-loader!../pages/index.md'),
      meta: {
        socialTitle: 'Junctions',
        socialDescription: 'A batteries-included router for React.',
      },
    }),

    '/examples/basics': createPageTemplate({
      title: 'MDXC: Basics',
      component: MDXWrapper,
      getContent: () => import('!raw-loader!../pages/basics.md'),
      meta: {
        socialTitle: 'MDXC: Basics',
        socialDescription: "Learn how JSX interacts with standard Markdown in documents compiled with MDXC.",
      },
    }),

    '/examples/factories': createPageTemplate({
      title: 'MDXC: Factories',
      component: MDXWrapper,
      getContent: () => import('!raw-loader!../pages/factories.md'),
      meta: {
        socialTitle: 'MDXC: Factories',
        socialDescription: "Learn how to configure your Markdown with custom React Components instead of standard HTML elements",
      },
    }),

    '/examples/import': createPageTemplate({
      title: 'MDXC: Import',
      component: MDXWrapper,
      getContent: () => import('!raw-loader!../pages/import.md'),
      meta: {
        socialTitle: 'MDXC: Import',
        socialDescription: "Learn how to extend your Markdown documents with React Components using MDXC.",
      },
    }),

    '/examples/props': createPageTemplate({
      title: 'MDXC: Props',
      component: MDXWrapper,
      getContent: () => import('!raw-loader!../pages/props.md'),
      meta: {
        socialTitle: 'MDXC: Props',
        socialDescription: "Learn how to substitute data into your Markdown documents using React and MDXC.",
      },
    }),
  },

  component: App,
})
