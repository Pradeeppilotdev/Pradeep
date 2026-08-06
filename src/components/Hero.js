'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useLenis } from 'lenis/react'
import ParticleText from '@/components/ParticleText'
import RotatingText from '@/components/RotatingText'
import { useTheme } from '@/components/ThemeProvider'

const PARTICLE_COLORS = {
  light: { color: '#111111', highlightColor: '#3E7A4F' },
  dark: { color: '#F2F2F0', highlightColor: '#5FCB7C' },
}

export default function Hero() {
  const tlRef = useRef(null)
  const lenis = useLenis()
  const { theme } = useTheme()
  const particleColors = PARTICLE_COLORS[theme] || PARTICLE_COLORS.light

  function smoothTo(e, id) {
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
          {/* <span className="avail"><span className="dot"></span>Available now</span>
          <span className="sep">·</span> */}
          <span>CS Grad</span>
          <span className="sep">·</span>
          <RotatingText
            texts={['Web3 + Agentic AI', 'ZK proofs', 'On-chain agents', 'Solidity']}
            splitBy="words"
            rotationInterval={2400}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            mainClassName="meta-rotate"
          />
        </div>
        <div className="statement-row">
          <div className="statement">
            <span className="mask"><span className="mask-inner">I build systems that</span></span>
            <span className="mask"><span className="mask-inner"><span className="accent-word">verify themselves</span></span></span>
            <span className="mask"><span className="mask-inner">ZK proofs, on-chain agents,</span></span>
            <span className="mask"><span className="mask-inner">and Web3 infrastructure.</span></span>
          </div>
          <ParticleText
            className="hero-name"
            text="PRADEEP"
            particleSize={2}
            density={5}
            color={particleColors.color}
            highlightColor={particleColors.highlightColor}
            fontSize="clamp(72px, 16vw, 230px)"
            fontWeight={800}
            fontFamily="inherit"
            align="center"
            scatter={220}
            stagger={200}
            idleDrift={0.4}
            style={{ height: 'clamp(84px, 20vw, 300px)' }}
          />
        </div>
        <div className="intro-links">
          <a className="view-work" href="#work" onClick={e => smoothTo(e, 'work')}>
            View my work<span className="arrow">&rarr;</span>
          </a>
          <a href="mailto:chandrapradeepr@gmail.com">Email</a>
          <a href="https://github.com/Pradeeppilotdev" target="_blank" rel="noopener">GitHub</a>
          <a href="https://x.com/pradeeppilot2k5" target="_blank" rel="noopener">X</a>
          <a href="https://t.me/pradeeppilot" target="_blank" rel="noopener">Telegram</a>
        </div>
      </div>
    </div>
  )
}
