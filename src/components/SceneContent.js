'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTheme } from './ThemeProvider'

const ACCENT = { light: '#3E7A4F', dark: '#5FCB7C' }

function TorusKnot({ radius = 0.3, tube = 0.1, position: pos, color }) {
  const mesh = useRef()
  const basePos = useMemo(() => pos, [])
  const isTouch = useRef(
    typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
  )

  useFrame(({ clock, pointer }) => {
    if (!mesh.current) return
    const t = clock.getElapsedTime()
    mesh.current.position.x = basePos[0] + (!isTouch.current ? pointer.x * 0.3 : 0)
    mesh.current.position.y = basePos[1] + Math.sin(t * 0.2) * 0.2
    mesh.current.rotation.x = t * 0.12
    mesh.current.rotation.y = t * 0.15
  })

  return (
    <mesh ref={mesh} position={basePos}>
      <torusKnotGeometry args={[radius, tube, 128, 16]} />
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
      <TorusKnot radius={0.8} tube={0.24} position={[0, 0, -4]} color={color} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 3, 4]} intensity={0.8} />
    </group>
  )
}
