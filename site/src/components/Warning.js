import './Warning.css'
import React from 'react'

export default function Warning({ children }) {
  return (
    <section className='Warning'>
      <h5>Warning</h5>
      <div className='Warning-content'>
        {children}
      </div>
    </section>
  )
}
