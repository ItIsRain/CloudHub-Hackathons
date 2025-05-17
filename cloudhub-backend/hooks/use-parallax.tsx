"use client"

import { useState, useEffect, useRef, type RefObject } from "react"

interface UseParallaxOptions {
  speed?: number
  direction?: "horizontal" | "vertical" | "both"
}

export default function useParallax<T extends HTMLElement>(
  options: UseParallaxOptions = {},
): [RefObject<T>, { x: number; y: number }] {
  const { speed = 0.1, direction = "both" } = options
  const ref = useRef<T>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!ref.current) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      // Calculate distance from center
      const distanceX = (e.clientX - centerX) * speed
      const distanceY = (e.clientY - centerY) * speed

      // Update position based on direction
      setPosition({
        x: direction === "vertical" ? 0 : distanceX,
        y: direction === "horizontal" ? 0 : distanceY,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [speed, direction])

  return [ref, position]
}
