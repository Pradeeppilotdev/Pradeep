'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useLenis } from 'lenis/react'
import ParticleText from '@/components/ParticleText'
import RotatingText from '@/components/RotatingText'
import SpecularButton from '@/components/SpecularButton'
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
          <div className="intro-links-row">
            <SpecularButton
              className="hire-me"
              size="sm"
              radius={20}
              tint={theme === 'dark' ? '#ffffff' : '#111111'}
              tintOpacity={theme === 'dark' ? 0.06 : 0.04}
              textColor={theme === 'dark' ? '#f5f5f5' : '#111111'}
              lineColor={theme === 'dark' ? '#ffffff' : '#111111'}
              baseColor={theme === 'dark' ? '#ffffff' : '#111111'}
              intensity={1.1}
              shineSize={12}
              shineFade={55}
              thickness={1}
              proximity={180}
              onClick={() => {
                window.location.href = 'mailto:chandrapradeepr@gmail.com?subject=Hiring%20inquiry'
              }}
            >
              Hire me<span className="arrow">&rarr;</span>
            </SpecularButton>
            <a className="view-work" href="#work" onClick={e => smoothTo(e, 'work')}>
              <span className="view-work-full">View </span>my work<span className="arrow">&rarr;</span>
            </a>
            <a href="https://github.com/Pradeeppilotdev" target="_blank" rel="noopener">GitHub</a>
            <a href="https://x.com/pradeeppilot2k5" target="_blank" rel="noopener">X</a>
            <a className="telegram" href="https://t.me/pradeeppilot" target="_blank" rel="noopener" aria-label="Telegram">
              <span className="telegram-text">Telegram</span>
              <svg className="telegram-icon" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <path fill="currentColor" d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
