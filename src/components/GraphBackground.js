'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from './ThemeProvider'

const COLORS = {
  light: {
    dot: 'rgba(17,17,17,0.22)',
    line: 'rgba(17,17,17,0.10)',
    lineActive: 'rgba(17,17,17,0.28)',
    active: '#3E7A4F',
  },
  dark: {
    dot: 'rgba(242,242,240,0.20)',
    line: 'rgba(242,242,240,0.10)',
    lineActive: 'rgba(242,242,240,0.26)',
    active: '#5FCB7C',
  },
}

export default function GraphBackground() {
  const canvasRef = useRef(null)
  const { theme } = useTheme()
  const colorsRef = useRef(null)
  colorsRef.current = {
    dot: 'rgba(128,128,128,0.28)',
    line: 'rgba(128,128,128,0.12)',
    lineActive: 'rgba(128,128,128,0.30)',
    active: COLORS[theme]?.active || '#3E7A4F',
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || typeof window === 'undefined') return undefined

    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

    let raf = 0
    let disposed = false
    let width = 0
    let height = 0
    let dpr = 1
    let nodes = []
    let edges = []
    let activations = []
    let nextPulseAt = 0
    let reconnectAt = 0
    let pointer = { x: -9999, y: -9999 }

    const build = () => {
      const count = width < 768 ? 34 : 56
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.05,
        vy: (Math.random() - 0.5) * 0.05,
        r: 1 + Math.random() * 1.2,
      }))
      reconnect()
    }

    const distSq = (a, b) => {
      const dx = a.x - b.x
      const dy = a.y - b.y
      return dx * dx + dy * dy
    }

    const reconnect = () => {
      const maxDist = (Math.min(width, height) * 0.16) ** 2
      const next = []
      const seen = new Set()
      nodes.forEach((node, i) => {
        let bestDist = Infinity
        let bestJ = -1
        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue
          const dd = distSq(node, nodes[j])
          if (dd < maxDist && dd < bestDist) {
            bestDist = dd
            bestJ = j
          }
        }
        if (bestJ === -1) return
        const key = i < bestJ ? `${i}-${bestJ}` : `${bestJ}-${i}`
        if (!seen.has(key)) {
          seen.add(key)
          next.push({ a: i, b: bestJ })
        }
      })
      edges = next
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

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      const c = colorsRef.current

      // edges
      ctx.lineWidth = 1
      edges.forEach(({ a, b }) => {
        const na = nodes[a]
        const nb = nodes[b]
        ctx.strokeStyle = c.line
        ctx.beginPath()
        ctx.moveTo(na.x, na.y)
        ctx.lineTo(nb.x, nb.y)
        ctx.stroke()
      })

      // pulse "verification" travels
      ctx.lineWidth = 1.5
      activations = activations.filter(p => p.progress < 1)
      activations.forEach(p => {
        const na = nodes[p.a]
        const nb = nodes[p.b]
        const hx = na.x + (nb.x - na.x) * p.progress
        const hy = na.y + (nb.y - na.y) * p.progress
        ctx.strokeStyle = c.active
        ctx.beginPath()
        ctx.moveTo(na.x, na.y)
        ctx.lineTo(hx, hy)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(hx, hy, 2.2, 0, Math.PI * 2)
        ctx.fillStyle = c.active
        ctx.fill()
      })

      // nodes (with gentle idle drift + cursor attraction)
      nodes.forEach(n => {
        n.x += n.vx
        n.y += n.vy
        if (n.x < -10) n.x = width + 10
        if (n.x > width + 10) n.x = -10
        if (n.y < -10) n.y = height + 10
        if (n.y > height + 10) n.y = -10

        let drawX = n.x
        let drawY = n.y
        const dx = pointer.x - n.x
        const dy = pointer.y - n.y
        const dd = dx * dx + dy * dy
        if (dd < 16900) {
          const d = Math.sqrt(dd) || 1
          const pull = (1 - d / 130) * 0.3
          drawX += (dx / d) * pull
          drawY += (dy / d) * pull
        }

        ctx.beginPath()
        ctx.arc(drawX, drawY, n.r, 0, Math.PI * 2)
        ctx.fillStyle = c.dot
        ctx.fill()
      })
    }

    const loop = now => {
      if (disposed) return

      if (now > reconnectAt) {
        reconnect()
        reconnectAt = now + 4000
      }

      if (edges.length > 0 && activations.length < 2 && now > nextPulseAt) {
        const e = edges[Math.floor(Math.random() * edges.length)]
        activations.push({ a: e.a, b: e.b, progress: 0 })
        nextPulseAt = now + 2000 + Math.random() * 2200
      }

      activations.forEach(p => {
        p.progress += 0.016 / 1.4
      })

      draw()
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

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', pointerMove)
    document.addEventListener('visibilitychange', onVisibility)

    function pointerMove(e) {
      pointer.x = e.clientX
      pointer.y = e.clientY
    }
    function onVisibility() {
      if (document.hidden) stop()
      else start()
    }

    resize()
    if (reduceMotion) {
      draw()
    } else {
      start()
    }

    return () => {
      disposed = true
      stop()
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', pointerMove)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

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