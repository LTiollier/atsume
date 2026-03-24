'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function createGlowTexture(): THREE.Texture {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.15, 'rgba(255,255,255,0.85)')
  gradient.addColorStop(0.4, 'rgba(200,220,255,0.3)')
  gradient.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(canvas)
}

const COLORS = [
  new THREE.Color(1, 1, 1),         // blanc chaud
  new THREE.Color(0.7, 0.88, 1),    // bleu-cyan pâle
  new THREE.Color(0.82, 0.72, 1),   // violet doux
  new THREE.Color(0.88, 1, 0.94),   // vert-blanc pâle
]

type Firefly = {
  sprite: THREE.Sprite
  baseX: number
  baseY: number
  speedX: number
  speedY: number
  phase: number
  pulseSpeed: number
  baseOpacity: number
  amplitude: number
}

export default function FirefliesBackground() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const W = window.innerWidth
    const H = window.innerHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100)
    camera.position.z = 10

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const texture = createGlowTexture()
    const fireflies: Firefly[] = []

    // Grandes lueurs diffuses en arrière-plan
    for (let i = 0; i < 6; i++) {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)]
      const mat = new THREE.SpriteMaterial({
        map: texture,
        color,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: 0,
      })
      const sprite = new THREE.Sprite(mat)
      const size = 2.5 + Math.random() * 3
      sprite.scale.set(size, size, 1)
      const x = (Math.random() - 0.5) * 18
      const y = (Math.random() - 0.5) * 12
      sprite.position.set(x, y, -4)
      scene.add(sprite)
      fireflies.push({
        sprite,
        baseX: x,
        baseY: y,
        speedX: 0,
        speedY: 0,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.1 + Math.random() * 0.15,
        baseOpacity: 0.04 + Math.random() * 0.06,
        amplitude: 0.4 + Math.random() * 0.6,
      })
    }

    // Lucioles principales
    for (let i = 0; i < 90; i++) {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)]
      const mat = new THREE.SpriteMaterial({
        map: texture,
        color,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: 0,
      })
      const sprite = new THREE.Sprite(mat)
      const size = 0.06 + Math.random() * 0.28
      sprite.scale.set(size, size, 1)
      const x = (Math.random() - 0.5) * 22
      const y = (Math.random() - 0.5) * 16
      const z = (Math.random() - 0.5) * 5
      sprite.position.set(x, y, z)
      scene.add(sprite)
      fireflies.push({
        sprite,
        baseX: x,
        baseY: y,
        speedX: (Math.random() - 0.5) * 0.003,
        speedY: (Math.random() - 0.5) * 0.002,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.25 + Math.random() * 0.8,
        baseOpacity: 0.15 + Math.random() * 0.55,
        amplitude: 0.2 + Math.random() * 1.0,
      })
    }

    const clock = new THREE.Clock()
    let animId: number

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      for (const f of fireflies) {
        // Dérive organique (Lissajous lent)
        f.sprite.position.x = f.baseX + Math.sin(t * f.pulseSpeed * 0.4 + f.phase) * f.amplitude
        f.sprite.position.y = f.baseY + Math.cos(t * f.pulseSpeed * 0.25 + f.phase * 1.7) * f.amplitude * 0.7

        // Pulsation d'opacité douce
        const pulse = (Math.sin(t * f.pulseSpeed + f.phase) + 1) / 2
        ;(f.sprite.material as THREE.SpriteMaterial).opacity = f.baseOpacity * (0.3 + pulse * 0.7)
      }

      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      texture.dispose()
      for (const f of fireflies) {
        f.sprite.material.dispose()
        scene.remove(f.sprite)
      }
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  )
}
