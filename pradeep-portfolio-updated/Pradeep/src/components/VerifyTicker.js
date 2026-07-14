'use client'

import { useEffect, useRef, useState } from 'react'

const STEPS = [
  { cmd: true, text: 'verify --proof arczk/settlement.groth16' },
  { text: 'loading verification key…', delay: 250 },
  { text: 'poseidon hash matches on-chain commitment', ok: true, delay: 550 },
  { text: 'groth16 proof valid', ok: true, delay: 500 },
  { text: 'settlement authorized — no trusted third party', ok: true, delay: 550 },
]

export default function VerifyTicker() {
  const [visible, setVisible] = useState(0)
  const timers = useRef([])

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      setVisible(STEPS.length)
      return
    }

    function run() {
      timers.current.forEach(clearTimeout)
      timers.current = []
      setVisible(0)
      let elapsed = 600
      STEPS.forEach((step, i) => {
        elapsed += step.delay || 0
        const t = setTimeout(() => setVisible(i + 1), elapsed)
        timers.current.push(t)
      })
      const loop = setTimeout(run, elapsed + 3200)
      timers.current.push(loop)
    }

    const start = setTimeout(run, 900)
    timers.current.push(start)

    return () => timers.current.forEach(clearTimeout)
  }, [])

  return (
    <div className="verify-ticker" aria-hidden="true">
      <div className="verify-ticker-bar">
        <span /><span /><span />
      </div>
      <div className="verify-ticker-body">
        {STEPS.slice(0, visible).map((step, i) => (
          <div key={i} className={`verify-line${step.cmd ? ' cmd' : ''}`}>
            {step.cmd ? <span className="prompt">$</span> : step.ok ? <span className="check">✓</span> : null}
            <span>{step.text}</span>
          </div>
        ))}
        {visible > 0 && visible < STEPS.length && <span className="verify-cursor" />}
      </div>
    </div>
  )
}
