'use client'

import { memo } from 'react'
import { Canvas } from '@react-three/fiber'
import SceneContent from './SceneContent'

function Scene3D() {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100vw',
      height: '100lvh',
      zIndex: 0,
      pointerEvents: 'none',
    }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ alpha: true, antialias: true }}
        style={{ width: '100%', height: '100%' }}
        resize={{ scroll: false }}
      >
        <SceneContent />
      </Canvas>
    </div>
  )
}

export default memo(Scene3D)
