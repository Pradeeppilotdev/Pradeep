'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Hero() {
  const tlRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      document.querySelectorAll('.mask-inner').forEach(el => {
        el.style.transform = 'none'
        el.style.opacity = '1'
      })
      return
    }

    gsap.set('.statement .mask-inner', { yPercent: 110, opacity: 0 })
    gsap.set('.meta-row, .intro-links', { opacity: 0, y: 12 })

    const tl = gsap.timeline({ delay: 0.15 })
    tl
      .to('.meta-row', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
      .to('.statement .mask-inner', {
        yPercent: 0, opacity: 1, duration: 0.85, ease: 'power4.out', stagger: 0.09
      }, '-=0.35')
      .to('.intro-links', { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3')

    tlRef.current = tl

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <div className="wrap">
      <div className="intro">
        <div className="meta-row">
          <span className="avail"><span className="dot"></span>Available now</span>
          <span className="sep">·</span>
          <span>Final-year CS Engineer</span>
          <span className="sep">·</span>
          <span>Web3 + Agentic AI</span>
          <span className="sep">·</span>
          <span>India</span>
        </div>
        <div className="statement">
          <span className="mask"><span className="mask-inner">I build systems that</span></span>
          <span className="mask"><span className="mask-inner"><span className="accent-word">verify themselves</span></span></span>
          <span className="mask"><span className="mask-inner">ZK proofs, on-chain agents,</span></span>
          <span className="mask"><span className="mask-inner">and Web3 infrastructure.</span></span>
        </div>
        <div className="intro-links">
          <a href="mailto:chandrapradeepr@gmail.com">Email</a>
          <a href="https://github.com/Pradeeppilotdev" target="_blank" rel="noopener">GitHub</a>
          <a href="https://x.com/pradeeppilot2k5" target="_blank" rel="noopener">X</a>
          <a href="https://t.me/pradeeppilot" target="_blank" rel="noopener">Telegram</a>
        </div>
      </div>
    </div>
  )
}
