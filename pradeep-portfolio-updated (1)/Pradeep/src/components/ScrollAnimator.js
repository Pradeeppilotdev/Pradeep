'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function ScrollAnimator() {
  const initialized = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion) {
      document.querySelectorAll('.work-line').forEach(el => { el.style.width = '100%' })
      document.querySelectorAll('.mask-inner').forEach(el => {
        el.style.transform = 'none'
        el.style.opacity = '1'
      })
      document.querySelectorAll('.feat-card').forEach(el => { el.style.opacity = '1' })
      initialized.current = true
      return
    }

    if (initialized.current) return
    initialized.current = true

    // Inject work border lines
    document.querySelectorAll('.work-item').forEach(item => {
      if (!item.querySelector('.work-line')) {
        const line = document.createElement('span')
        line.className = 'work-line'
        line.setAttribute('aria-hidden', 'true')
        item.appendChild(line)
      }
    })

    // Work list rows
    gsap.utils.toArray('.work-item').forEach(item => {
      const name = item.querySelector('.work-name')
      const index = item.querySelector('.work-index')
      const context = item.querySelector('.work-context')
      const line = item.querySelector('.work-line')

      gsap.set([index, context], { opacity: 0, y: 10 })
      gsap.set(name, { yPercent: 100 })

      const tl = gsap.timeline({
        scrollTrigger: { trigger: item, start: 'top 88%', once: true }
      })
      tl.to(line, { width: '100%', duration: 0.6, ease: 'power3.inOut' }, 0)
        .to(name, { yPercent: 0, duration: 0.75, ease: 'power4.out' }, 0.05)
        .to(index, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 0.1)
        .to(context, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 0.15)
    })

    // Featured project cards
    gsap.utils.toArray('.feat-card').forEach((card, i) => {
      gsap.fromTo(card, { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: i * 0.08,
        scrollTrigger: { trigger: card, start: 'top 90%', once: true }
      })
    })

    // Section labels
    gsap.utils.toArray('.section-label').forEach(label => {
      gsap.fromTo(label, { opacity: 0 }, {
        opacity: 1, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: label, start: 'top 90%', once: true }
      })
    })

    // About paragraphs
    gsap.utils.toArray('.about p, .stack-row').forEach((el, i) => {
      gsap.fromTo(el, { opacity: 0, y: 16 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: i * 0.05,
        scrollTrigger: { trigger: el, start: 'top 90%', once: true }
      })
    })

    // Contact
    gsap.set('.contact-big', { yPercent: 100 })
    gsap.set('.contact-sub, .contact-socials', { opacity: 0, y: 14 })
    ScrollTrigger.create({
      trigger: '#contact',
      start: 'top 75%',
      once: true,
      onEnter: () => {
        gsap.timeline()
          .to('.contact-big', { yPercent: 0, duration: 0.85, ease: 'power4.out' })
          .to('.contact-sub', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
          .to('.contact-socials', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
      }
    })

    ScrollTrigger.refresh()

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill())
      initialized.current = false
    }
  }, [])

  return null
}
