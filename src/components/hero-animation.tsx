"use client"

import { useEffect, useRef } from "react"

export default function HeroAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const container = canvas.parentElement
      if (container) {
        canvas.width = container.clientWidth
        canvas.height = container.clientHeight
      }
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Particle class with gravity and click interaction
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      isClicked: boolean

      constructor(x: number, y: number, size: number, speedX: number, speedY: number, color: string) {
        this.x = x
        this.y = y
        this.size = size
        this.speedX = speedX
        this.speedY = speedY
        this.color = color
        this.isClicked = false
      }

      update(particles: Particle[]) {
        // Apply gravitational force with reduced intensity
        particles.forEach(particle => {
          if (particle !== this) {
            const dx = particle.x - this.x
            const dy = particle.y - this.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            if (distance < 100) {
              const force = (100 - distance) / 300  // Reduced the force by dividing by a larger number
              this.speedX += force * (dx / distance) * 0.01  // Lower multiplier for slower speed
              this.speedY += force * (dy / distance) * 0.01  // Lower multiplier for slower speed
            }
          }
        })

        this.x += this.speedX
        this.y += this.speedY

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) {
          this.speedX *= -0.9  // Slightly dampen the bounce speed
        }
        if (this.y < 0 || this.y > canvas.height) {
          this.speedY *= -0.9  // Slightly dampen the bounce speed
        }
      }

      draw() {
        if (!ctx) return
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
      }

      // Detect click to throw the particle
      handleClick(mouseX: number, mouseY: number) {
        const dx = mouseX - this.x
        const dy = mouseY - this.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < this.size) {
          this.isClicked = true
          const angle = Math.atan2(dy, dx)
          const speed = 5  // Lower speed for throwing
          this.speedX = -Math.cos(angle) * speed
          this.speedY = -Math.sin(angle) * speed
        }
      }
    }

    // Create particles
    const particles: Particle[] = []
    const particleCount = 50
    const colors = ["#3b82f6", "#10b981", "#8b5cf6", "#f97316"]

    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 5 + 1
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const speedX = (Math.random() - 0.5) * 1  // Reduced initial speed
      const speedY = (Math.random() - 0.5) * 1  // Reduced initial speed
      const color = colors[Math.floor(Math.random() * colors.length)]

      particles.push(new Particle(x, y, size, speedX, speedY, color))
    }

    // Draw connections between particles
    function drawConnections() {
      if (!ctx) return
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(150, 150, 150, ${0.8 - distance / 100})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    // Animation loop
    function animate() {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach(particle => {
        particle.update(particles)
        particle.draw()
      })

      drawConnections()
      requestAnimationFrame(animate)
    }

    // Handle click event
    const handleClick = (e: MouseEvent) => {
      const mouseX = e.clientX - canvas.offsetLeft
      const mouseY = e.clientY - canvas.offsetTop
      particles.forEach(particle => {
        particle.handleClick(mouseX, mouseY)
      })
    }

    canvas.addEventListener("click", handleClick)

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      canvas.removeEventListener("click", handleClick)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />
}
