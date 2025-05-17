"use client"

import { useState, useEffect } from "react"

interface ScrollHandlerProps {
  isSticky: boolean
  scrollY: number
}

export function useScrollHandler(): ScrollHandlerProps {
  const [scrollY, setScrollY] = useState(0)
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      setIsSticky(window.scrollY > 0)
    }

    // Add event listener
    window.addEventListener("scroll", handleScroll, { passive: true })
    
    // Call handler right away to set initial state
    handleScroll()
    
    // Remove event listener on cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return { isSticky, scrollY }
} 