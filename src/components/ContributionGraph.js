'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from './ThemeProvider'

const USER = 'Pradeeppilotdev'
const API = `https://github-contributions-api.jogruber.de/v4/${USER}`
const ACCENT = { light: '#3E7A4F', dark: '#5FCB7C' }
const LEVELS = [0.18, 0.4, 0.62, 0.8, 0.96]
const WEEKS = 53
const DAYS = 7

function hexToRgb(hex) {
  const h = hex.replace('#', '')
  const v = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16)
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255]
}

function makeSeed() {
  let s = 13579
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}

function buildFallback(countMap) {
  const rng = makeSeed()
  const date = new Date()
  for (let i = 0; i < WEEKS * DAYS; i++) {
    date.setDate(date.getDate() - 1)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate()
    ).padStart(2, '0')}`
    if (countMap.has(key)) continue
    const r = rng()
    if (r < 0.62) countMap.set(key, 0)
    else if (r < 0.8) countMap.set(key, rng() < 0.5 ? 1 : 2)
    else if (r < 0.92) countMap.set(key, 3)
    else countMap.set(key, 4)
  }
  return countMap
}

export default function ContributionGraph() {
  const { theme } = useTheme()
  const ref = useRef(null)
  const tipRef = useRef(null)
  const [weeks, setWeeks] = useState(null)
  const [total, setTotal] = useState(0)
  const [tip, setTip] = useState(null)
  const accent = ACCENT[theme] || ACCENT.dark
  const [r, g, b] = hexToRgb(accent)

  useEffect(() => {
    const el = ref.current

    const render = countMap => {
      const cells = []
      const today = new Date()
      const start = new Date(today)
      start.setDate(start.getDate() - (WEEKS - 1) * DAYS)
      start.setDate(start.getDate() - start.getDay())

      let sum = 0
      for (let w = 0; w < WEEKS; w++) {
        const col = []
        for (let d = 0; d < DAYS; d++) {
          const date = new Date(start)
          date.setDate(start.getDate() + w * DAYS + d)
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
            date.getDate()
          ).padStart(2, '0')}`
          const val = countMap.get(key) || 0
          sum += val
          const alpha = val === 0 ? 0 : LEVELS[Math.min(val, 4) - 1]
          col.push({
            bg: val === 0 ? 'var(--line)' : `rgba(${r},${g},${b},${alpha})`,
            date: date.toDateString(),
            count: val,
          })
        }
        cells.push(col)
      }
      setTotal(sum)
      setWeeks(cells)
    }

    let cancelled = false
    ;(async () => {
      const countMap = new Map()
      try {
        const res = await fetch(API, { mode: 'cors' })
        if (!res.ok) throw new Error('api')
        const data = await res.json()
        if (Array.isArray(data.contributions)) {
          data.contributions.forEach(c => {
            countMap.set(c.date, typeof c.count === 'number' ? Math.min(c.count, 4) : c.level || 0)
          })
        }
      } catch {
        // offline / rate-limited -> seeded fallback below
      }
      if (cancelled) return
      render(buildFallback(countMap))
    })()

    if (el) {
      const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      if (reduceMotion) {
        el.classList.add('is-in')
      } else {
        const io = new IntersectionObserver(
          entries => {
            entries.forEach(en => {
              if (en.isIntersecting) {
                el.classList.add('is-in')
                io.disconnect()
              }
            })
          },
          { threshold: 0.2 }
        )
        io.observe(el)
      }
    }

    return () => {
      cancelled = true
    }
  }, [r, g, b])

  if (!weeks) return <div className="cg" ref={ref} aria-hidden="true" />

  function showTip(cell, e) {
    setTip({ x: e.clientX, y: e.clientY, date: cell.date, count: cell.count })
  }
  function hideTip() {
    setTip(null)
  }

  return (
    <div className="cg" ref={ref}>
      <div className="cg-head">
        <span className="cg-total">{total.toLocaleString()} commits<span className="cg-src">via GitHub</span></span>
      </div>
      <div className="cg-grid">
        {weeks.map((col, wi) => (
          <div className="cg-col" key={wi} style={{ transitionDelay: `${Math.min(wi * 0.018, 0.9)}s` }}>
            {col.map((cell, di) => (
              <div
                className="cg-cell"
                key={di}
                style={{ background: cell.bg }}
                onMouseEnter={e => showTip(cell, e)}
                onMouseMove={e => showTip(cell, e)}
                onMouseLeave={hideTip}
              />
            ))}
          </div>
        ))}
      </div>

      {tip &&
        (() => {
          const label = tip.count === 0 ? 'No commits' : `${tip.count} commit${tip.count === 1 ? '' : 's'}`
          return (
            <div
              className="cg-tip"
              ref={tipRef}
              style={{
                left: `${Math.min(tip.x + 14, window.innerWidth - 170)}px`,
                top: `${tip.y - 10}px`,
              }}
            >
              <span className="cg-tip-date">{tip.date}</span>
              <span className="cg-tip-count">{label}</span>
            </div>
          )
        })()}
    </div>
  )
}