'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export default function ArcZKDemo() {
  const hoverRef = useRef(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    window.dispatchEvent(new Event('tilt:reset'))
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = e => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  function play() {
    hoverRef.current?.play().catch(() => {})
  }
  function pause() {
    hoverRef.current?.pause()
  }

  function openModal() {
    setOpen(true)
  }

  return (
    <>
      <div
        className="arc-demo"
        onClick={() => openModal()}
        onMouseEnter={play}
        onMouseLeave={pause}
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') openModal()
        }}
        aria-label="Play ArcZK demo"
      >
        <video
          ref={hoverRef}
          src="/arczkscreenrecord.mp4"
          poster="/arczk-preview.png"
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="arc-demo-overlay">
          <span className="arc-demo-play">hover or click to watch</span>
        </div>
      </div>

      {open &&
        createPortal(
          <div className="arc-modal" onClick={() => setOpen(false)}>
            <div className="arc-modal-body" onClick={e => e.stopPropagation()}>
              <button className="arc-modal-close" onClick={() => setOpen(false)} aria-label="Close">
                Close &times;
              </button>
              <video src="/arczkscreenrecord.mp4" controls autoPlay playsInline />
            </div>
          </div>,
          document.body
        )}
    </>
  )
}