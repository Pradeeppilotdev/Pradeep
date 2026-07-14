'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTheme } from './ThemeProvider'
import { getVelocity } from '@/lib/scrollStore'

const ACCENT = { light: '#3E7A4F', dark: '#5FCB7C' }

function TorusKnot({ radius = 0.3, tube = 0.1, position: pos, color }) {
  const mesh = useRef()
  const basePos = useMemo(() => pos, [])
  const isTouch = useRef(
    typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
  )
  const spin = useRef(0)

  useFrame(({ clock, pointer }) => {
    if (!mesh.current) return
    const t = clock.getElapsedTime()
    // Scroll speed gives the knots a little extra spin as you move through
    // the page, instead of sitting there as static wallpaper.
    const boost = Math.min(Math.abs(getVelocity()) * 0.015, 0.6)
    spin.current += 0.01 + boost

    mesh.current.position.x = basePos[0] + (!isTouch.current ? pointer.x * 0.3 : 0)
    mesh.current.position.y = basePos[1] + Math.sin(t * 0.2) * 0.2
    mesh.current.rotation.x = spin.current * 0.4
    mesh.current.rotation.y = spin.current * 0.5
  })

  return (
    <mesh ref={mesh} position={basePos}>
      <torusKnotGeometry args={[radius, tube, 64, 8]} />
      <meshStandardMaterial
        color={color}
        wireframe
        transparent
        opacity={0.3}
      />
    </mesh>
  )
}

export default function SceneContent() {
  const { theme } = useTheme()
  const color = ACCENT[theme] || ACCENT.light

  return (
    <group>
      <TorusKnot radius={0.5} tube={0.15} position={[0, 0, -4]} color={color} />
      <TorusKnot radius={0.2} tube={0.07} position={[-5, -4, -6]} color={color} />
      <TorusKnot radius={0.2} tube={0.07} position={[5, 3, -8]} color={color} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 3, 4]} intensity={0.8} />
    </group>
  )
}
