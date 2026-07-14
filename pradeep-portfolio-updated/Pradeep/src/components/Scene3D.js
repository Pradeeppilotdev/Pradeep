'use client'

import { memo, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import SceneContent from './SceneContent'

function Scene3D() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) setShow(false)
  }, [])

  if (!show) return null

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
        resize={{ scroll: false, debounce: { scroll: 0, resize: 200 } }}
      >
        <SceneContent />
      </Canvas>
    </div>
  )
}

export default memo(Scene3D)
