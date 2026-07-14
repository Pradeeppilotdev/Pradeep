'use client'

import { ReactLenis, useLenis } from 'lenis/react'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { setVelocity } from '@/lib/scrollStore'

gsap.registerPlugin(ScrollTrigger)

function VelocityTracker() {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return
    const handler = (e) => setVelocity(e.velocity)
    lenis.on('scroll', handler)
    return () => lenis.off('scroll', handler)
  }, [lenis])

  return null
}

function GsapSync() {
  const lenis = useLenis()
  const tickerRef = useRef(null)

  useEffect(() => {
    if (!lenis) return

    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.off('scroll', ScrollTrigger.update)
    }
  }, [lenis])

  return null
}

export default function SmoothScroll({ children }) {
  return (
    <ReactLenis root options={{ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), touchMultiplier: 2 }}>
      <VelocityTracker />
      <GsapSync />
      {children}
    </ReactLenis>
  )
}
