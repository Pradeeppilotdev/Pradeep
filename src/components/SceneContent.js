'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'

function TorusKnot({ radius = 0.3, tube = 0.1, position: pos }) {
  const mesh = useRef()
  const basePos = useMemo(() => pos, [])

  useFrame(({ clock, pointer }) => {
    if (!mesh.current) return
    const t = clock.getElapsedTime()
    mesh.current.position.x = basePos[0] + pointer.x * 0.3
    mesh.current.position.y = basePos[1] + Math.sin(t * 0.2) * 0.2
    mesh.current.rotation.x = t * 0.08
    mesh.current.rotation.y = t * 0.1
  })

  return (
    <mesh ref={mesh} position={basePos}>
      <torusKnotGeometry args={[radius, tube, 64, 8]} />
      <meshStandardMaterial
        color="#3E7A4F"
        wireframe
        transparent
        opacity={0.3}
      />
    </mesh>
  )
}

export default function SceneContent() {
  return (
    <group>
      <TorusKnot radius={0.5} tube={0.15} position={[0, 0, -4]} />
      <TorusKnot radius={0.2} tube={0.07} position={[-5, -4, -6]} />
      <TorusKnot radius={0.2} tube={0.07} position={[5, 3, -8]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 3, 4]} intensity={0.8} />
    </group>
  )
}
