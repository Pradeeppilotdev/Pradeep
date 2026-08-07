'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export default function MediaGallery({ images }) {
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    window.dispatchEvent(new Event('tilt:reset'))
  }, [open])

  useEffect(() => {
    if (open || hovering) return undefined
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) return undefined
    const id = window.setInterval(() => setIndex(i => (i + 1) % images.length), 3000)
    return () => window.clearInterval(id)
  }, [open, hovering, images.length])

  useEffect(() => {
    if (!open) return undefined
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = e => {
      if (e.key === 'Escape') setOpen(false)
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  function openModal() {
    setOpen(true)
  }

  function prev() {
    setIndex(i => (i - 1 + images.length) % images.length)
  }
  function next() {
    setIndex(i => (i + 1) % images.length)
  }

  return (
    <>
      <div
        className="carousel"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <div
          className="carousel-frame"
          onClick={() => openModal()}
          role="button"
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') openModal()
          }}
          aria-label="Open screenshots"
        >
          <img key={index} src={images[index]} alt={`Screenshot ${index + 1}`} loading="lazy" />
        </div>
        <div className="carousel-dots">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              className={`carousel-dot${i === index ? ' active' : ''}`}
              onClick={() => setIndex(i)}
              aria-label={`Go to screenshot ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {open &&
        createPortal(
          <div className="arc-modal" onClick={() => setOpen(false)}>
            <div className="arc-modal-gallery" onClick={e => e.stopPropagation()}>
              <button className="arc-modal-close" onClick={() => setOpen(false)} aria-label="Close">
                Close &times;
              </button>
              <button className="arc-nav prev" onClick={prev} aria-label="Previous">&larr;</button>
              <img className="arc-gallery-img" src={images[index]} alt={`Screenshot ${index + 1}`} />
              <button className="arc-nav next" onClick={next} aria-label="Next">&rarr;</button>
              <span className="arc-count">{index + 1} / {images.length}</span>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}