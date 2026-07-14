'use client'

import { useLenis } from 'lenis/react'
import { useTheme } from './ThemeProvider'

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const lenis = useLenis()

  function handleClick(e, id) {
    e.preventDefault()
    const target = document.getElementById(id)
    if (!target) return
    if (lenis) {
      lenis.scrollTo(target, { offset: -70 })
    } else {
      const y = target.getBoundingClientRect().top + window.scrollY - 70
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <nav>
      <div className="wrap inner">
        <div className="logo">Pradeep</div>
        <div className="nav-right">
          <div className="nav-links">
            <a href="#work" onClick={e => handleClick(e, 'work')}>Work</a>
            <a href="#about" onClick={e => handleClick(e, 'about')}>About</a>
            <a href="#contact" onClick={e => handleClick(e, 'contact')}>Contact</a>
          </div>
          <button className="theme-btn" onClick={toggleTheme}>
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>
    </nav>
  )
}
