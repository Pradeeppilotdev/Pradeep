'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from './ThemeProvider'

const LAYERS = [
  { weight: 0.5, rMin: 0.4, rMax: 0.9, alpha: 0.5, drift: 0.008 },
  { weight: 0.35, rMin: 0.7, rMax: 1.3, alpha: 0.8, drift: 0.016 },
  { weight: 0.15, rMin: 1.1, rMax: 1.8, alpha: 1.0, drift: 0.03 },
]

export default function CelestialBackground() {
  const canvasRef = useRef(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || typeof window === 'undefined') return undefined
    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    const isDark = theme === 'dark'
    const reduceMotion =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

    let raf = 0
    let disposed = false
    let width = 0
    let height = 0
    let dpr = 1
    let stars = []
    let lightDots = []
    let vignette = null
    let shootingStars = []
    let nextShootAt = 3000

    const random = (a, b) => a + Math.random() * (b - a)

    const build = () => {
      const count = Math.max(90, Math.min(260, Math.floor((width * height) / 6000)))
      stars = []
      let gi = 0
      for (let i = 0; i < count; i++) {
        let layer = LAYERS[0]
        const roll = Math.random()
        let acc = LAYERS[0].weight
        for (const l of LAYERS) {
          if (roll < acc) {
            layer = l
            break
          }
          acc += l.weight
        }
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: random(layer.rMin, layer.rMax),
          base: layer.alpha * random(0.5, 1),
          tw: random(0.6, 2.2),
          ph: random(0, Math.PI * 2),
          drift: layer.drift,
          gi: gi++,
        })
      }

      lightDots = Array.from({ length: 16 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: random(1, 2),
        base: random(0.12, 0.3),
        tw: random(0.6, 1.6),
        ph: random(0, Math.PI * 2),
      }))

      if (isDark) {
        const vg = ctx.createRadialGradient(
          width / 2, height / 2, Math.min(width, height) * 0.3,
          width / 2, height / 2, Math.max(width, height) * 0.75
        )
        vg.addColorStop(0, 'rgba(0,0,0,0)')
        vg.addColorStop(1, 'rgba(0,0,0,0.42)')
        vignette = vg
      } else {
        vignette = null
      }
    }

    const spawnShootingStar = () => {
      const angle = random(Math.PI * 0.75, Math.PI * 1.25)
      const speed = random(3.5, 6)
      shootingStars.push({
        x: random(0, width),
        y: random(-height * 0.2, height * 0.3),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        len: random(70, 140),
        life: 0,
        max: random(0.8, 1.2),
      })
    }

    const drawLight = (t) => {
      const ink = 'rgba(17,17,17,'

      // scattered constellation dots
      lightDots.forEach(d => {
        const tw = 0.7 + 0.3 * Math.sin(t * d.tw + d.ph)
        ctx.fillStyle = `${ink}${(d.base * tw).toFixed(3)})`
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fill()
      })

      // celestial orbit motif
      const s = Math.min(width, height)
      const cx = width * 0.5
      const cy = height * 0.5
      const tilt = -0.24
      const radii = [s * 0.09, s * 0.13, s * 0.17]
      const rot = t * 0.05
      const cosT = Math.cos(tilt + rot)
      const sinT = Math.sin(tilt + rot)

      ctx.lineWidth = 1
      radii.forEach((r, i) => {
        ctx.strokeStyle = `${ink}${i === 2 ? 0.16 : 0.11})`
        ctx.beginPath()
        ctx.ellipse(cx, cy, r, r * 0.32, tilt + rot, 0, Math.PI * 2)
        ctx.stroke()
      })

      // planets tracing the rings
      const outer = radii[2]
      const outerA = t * 0.45
      ctx.fillStyle = `${ink}0.5)`
      ctx.beginPath()
      ctx.arc(
        cx + Math.cos(outerA) * outer * cosT - Math.sin(outerA) * outer * sinT,
        cy + Math.cos(outerA) * outer * sinT + Math.sin(outerA) * outer * cosT * 0.32,
        2.4, 0, Math.PI * 2
      )
      ctx.fill()

      const mid = radii[1]
      const midA = -t * 0.7
      ctx.fillStyle = `${ink}0.35)`
      ctx.beginPath()
      ctx.arc(
        cx + Math.cos(midA) * mid * cosT - Math.sin(midA) * mid * sinT,
        cy + Math.cos(midA) * mid * sinT + Math.sin(midA) * mid * cosT * 0.32,
        1.6, 0, Math.PI * 2
      )
      ctx.fill()

      // central body
      ctx.fillStyle = `${ink}0.55)`
      ctx.beginPath()
      ctx.arc(cx, cy, 3.4, 0, Math.PI * 2)
      ctx.fill()
    }

    const draw = (t) => {
      ctx.clearRect(0, 0, width, height)

      if (!isDark) {
        drawLight(t)
        return
      }

      // shooting stars
      const streak = isDark ? '255,255,255' : '17,17,17'
      shootingStars = shootingStars.filter(s => s.life < s.max)
      shootingStars.forEach(s => {
        s.life += reduceMotion ? 0 : 0.016
        s.x += s.vx
        s.y += s.vy
        const p = s.life / s.max
        const a = Math.sin(p * Math.PI) * 0.85
        const tx = s.x - s.vx * s.len
        const ty = s.y - s.vy * s.len
        const grad = ctx.createLinearGradient(s.x, s.y, tx, ty)
        grad.addColorStop(0, `rgba(${streak},${a})`)
        grad.addColorStop(1, `rgba(${streak},0)`)
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.4
        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(tx, ty)
        ctx.stroke()
        ctx.fillStyle = `rgba(${streak},${a})`
        ctx.beginPath()
        ctx.arc(s.x, s.y, 1.4, 0, Math.PI * 2)
        ctx.fill()
      })

      // stars
      const ink = isDark ? '242,242,240' : '20,20,20'
      const vis = isDark ? 1 : 2.4
      stars.forEach(s => {
        s.x += s.drift * (reduceMotion ? 0 : 1)
        if (s.x > width + 2) s.x = -2
        if (s.x < -2) s.x = width + 2
        const tw = 0.55 + 0.45 * Math.sin(t * s.tw + s.ph)
        const alpha = Math.min(1, s.base * tw * vis)
        ctx.fillStyle = `rgba(${ink},${alpha.toFixed(3)})`
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      })

      // vignette
      if (vignette) {
        ctx.fillStyle = vignette
        ctx.fillRect(0, 0, width, height)
      }
    }

    const loop = now => {
      if (disposed) return
      const t = now / 1000

      if (!reduceMotion && now > nextShootAt) {
        spawnShootingStar()
        nextShootAt = now + random(3500, 7000)
      }

      draw(t)
      raf = window.requestAnimationFrame(loop)
    }

    const start = () => {
      if (!raf) raf = window.requestAnimationFrame(loop)
    }
    const stop = () => {
      if (raf) {
        cancelAnimationFrame(raf)
        raf = 0
      }
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      if (width <= 0 || height <= 0) return
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      build()
    }

    function onVisibility() {
      if (document.hidden) stop()
      else start()
    }

    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibility)

    resize()
    if (reduceMotion) {
      draw(0)
    } else {
      start()
    }

    return () => {
      disposed = true
      stop()
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [theme])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100lvh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  )
}
