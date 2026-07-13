'use client'

import { Canvas } from '@react-three/fiber'
import SceneContent from './SceneContent'

export default function Scene3D() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 0,
      pointerEvents: 'none',
    }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ alpha: true, antialias: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <SceneContent />
      </Canvas>
    </div>
  )
}
