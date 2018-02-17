import React from 'react'
import { Link } from 'react-junctions'
import './Navbar.css'


export const Navbar = ({ className='', env }) =>
  <nav className={'Navbar '+className}>
    <Link
      env={env}
      href='/'
      className='Navbar-brand'
      activeClassName='Navbar-brand-active'
      exact>
      <img src='/logo-white.png' />
    </Link>
    <p className='Navbar-description'>React Components within Markdown</p>
    <span className='Navbar-heading'>Examples</span>
    <NavLink env={env} href='/examples/basics'>Basics</NavLink>
    <NavLink env={env} href='/examples/import'>Imports</NavLink>
    <NavLink env={env} href='/examples/props'>Props</NavLink>
    <NavLink env={env} href='/examples/factories'>Factories</NavLink>

    <div className={'Navbar-github-stars'}>
      <a className='github-button' href='https://github.com/jamesknelson/mdxc' data-icon='octicon-star' data-show-count='true' aria-label='Star jamesknelson/mdxc on GitHub'>Star</a>
    </div>
  </nav>


const NavLink = ({ children, className='', env, href }) =>
  <Link
    activeClassName='Navbar-link-active'
    className={'Navbar-link '+className}
    env={env}
    href={href}
    exact>
    {children}
  </Link>