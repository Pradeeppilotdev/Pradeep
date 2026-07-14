'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function VerifySeal() {
  const ringRef = useRef(null)
  const checkRef = useRef(null)
  const wrapRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    gsap.registerPlugin(ScrollTrigger)

    const ring = ringRef.current
    const check = checkRef.current
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ringLen = ring.getTotalLength()
    const checkLen = check.getTotalLength()
    gsap.set(ring, { strokeDasharray: ringLen, strokeDashoffset: reduceMotion ? 0 : ringLen })
    gsap.set(check, { strokeDasharray: checkLen, strokeDashoffset: reduceMotion ? 0 : checkLen })

    if (reduceMotion) {
      gsap.set(wrapRef.current, { opacity: 1 })
      return
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapRef.current,
        start: 'top 75%',
        end: 'top 20%',
        scrub: 0.5,
      },
    })
    tl
      .to(ring, { strokeDashoffset: 0, duration: 1, ease: 'none' })
      .to(check, { strokeDashoffset: 0, duration: 0.6, ease: 'none' }, '-=0.15')

    gsap.to(wrapRef.current, {
      opacity: 1, duration: 0.6, ease: 'power2.out',
      scrollTrigger: { trigger: wrapRef.current, start: 'top 90%', once: true },
    })

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [])

  return (
    <div className="verify-seal" ref={wrapRef} aria-hidden="true">
      <svg viewBox="0 0 120 120" width="72" height="72">
        <circle
          ref={ringRef}
          cx="60" cy="60" r="46"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />
        <path
          ref={checkRef}
          d="M40 61 L54 75 L82 45"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="verify-seal-label">Verified<br />on-chain</span>
    </div>
  )
}
