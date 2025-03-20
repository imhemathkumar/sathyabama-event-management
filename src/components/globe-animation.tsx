"use client"

import { useEffect, useRef } from "react"

export function GlobeAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = (canvas.width = canvas.offsetWidth)
    let height = (canvas.height = canvas.offsetHeight)
    let globeRadius = height / 3
    const rotationX = 0
    const rotationY = 0
    const lastX = 0
    const lastY = 0
    const mouseDown = false

    const stars: { x: number; y: number; z: number }[] = []
    const numStars = 200
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        z: Math.random() * 2 - 1,
      })
    }

    function project(x: number, y: number, z: number) {
      const perspective = globeRadius * 3
      const scale = perspective / (perspective + z)
      const x2d = (x * scale * width) / 2 + width / 2
      const y2d = (y * scale * height) / 2 + height / 2
      return { x: x2d, y: y2d, scale }
    }

    function drawStar(x: number, y: number, z: number) {
      const { x: x2d, y: y2d, scale } = project(x, y, z)
      const size = scale * 2
      if (ctx) {
        ctx.beginPath()
        ctx.arc(x2d, y2d, size, 0, Math.PI * 2)
        ctx.fillStyle = "white"
        ctx.fill()
      }
    }
    function rotateX(y: number, z: number, angle: number) {
      const rotatedY = y * Math.cos(angle) - z * Math.sin(angle)
      const rotatedZ = y * Math.sin(angle) + z * Math.cos(angle)
      return { y: rotatedY, z: rotatedZ }
    }

    function rotateY(x: number, z: number, angle: number) {
      const rotatedX = x * Math.cos(angle) + z * Math.sin(angle)
      const rotatedZ = -x * Math.sin(angle) + z * Math.cos(angle)
      return { x: rotatedX, z: rotatedZ }
    }

    function drawGlobe() {
      if (ctx) {
        ctx.clearRect(0, 0, width, height)

        for (const star of stars) {
          const { y, z } = rotateX(star.y, star.z, rotationX)
          const { x, z: z2 } = rotateY(star.x, z, rotationY)
          drawStar(x, y, z2)
        }

        requestAnimationFrame(drawGlobe)
      }
    }

    drawGlobe()

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
      globeRadius = height / 3
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-full" />
}

