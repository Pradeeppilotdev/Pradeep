'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const springValues = {
  damping: 30,
  stiffness: 100,
  mass: 2
}

export default function TiltCard({
  children,
  className = '',
  rotateAmplitude = 6,
  scaleOnHover = 1.02,
  style
}) {
  const ref = useRef(null)
  const rotateX = useSpring(useMotionValue(0), springValues)
  const rotateY = useSpring(useMotionValue(0), springValues)
  const scale = useSpring(1, springValues)
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsTouch(window.matchMedia('(hover: none)').matches)
    }
  }, [])

  useEffect(() => {
    const reset = () => {
      const apply = (v, to) => (typeof v.jump === 'function' ? v.jump(to) : v.set(to))
      apply(rotateX, 0)
      apply(rotateY, 0)
      apply(scale, 1)
    }
    window.addEventListener('tilt:reset', reset)
    return () => window.removeEventListener('tilt:reset', reset)
  }, [rotateX, rotateY, scale])

  function handleMouse(e) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const offsetX = e.clientX - rect.left - rect.width / 2
    const offsetY = e.clientY - rect.top - rect.height / 2
    rotateX.set((offsetY / (rect.height / 2)) * -rotateAmplitude)
    rotateY.set((offsetX / (rect.width / 2)) * rotateAmplitude)
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover)
  }

  function handleMouseLeave() {
    scale.set(1)
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX, rotateY, scale, transformPerspective: 800, transformStyle: 'preserve-3d', ...style }}
      onMouseMove={isTouch ? undefined : handleMouse}
      onMouseEnter={isTouch ? undefined : handleMouseEnter}
      onMouseLeave={isTouch ? undefined : handleMouseLeave}
    >
      {children}
    </motion.div>
  )
}
