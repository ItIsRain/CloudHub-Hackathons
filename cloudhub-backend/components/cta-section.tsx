"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export default function CtaSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      setMousePosition({ x, y })
    }

    document.addEventListener("mousemove", handleMouseMove)

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
      document.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  // Calculate transform values based on mouse position
  const calcTransform = (factor = 1) => {
    const moveX = (mousePosition.x - 0.5) * factor
    const moveY = (mousePosition.y - 0.5) * factor
    return {
      transform: `translate(${moveX}px, ${moveY}px)`,
    }
  }

  return (
    <section className="py-16 sm:py-24 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div ref={sectionRef} className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAwIDEwMGw1MC01MHY1MEgxMDBtMCAwTDUwIDUwdjUwaDUwbTAgMGw1MCA1MEgxMDBtMCAwbC01MCA1MEgxMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2Utb3BhY2l0eT0iLjEiLz48L3N2Zz4=')] bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-violet-900/50"></div>

          {/* Animated Particles */}
          <div className="absolute inset-0">
            {Array.from({ length: 15 }).map((_, i) => {
              // Fixed values for each particle
              const particles = [
                { width: 2.7, height: 3.3, top: 19.6, left: 50.1, opacity: 0.30, duration: 11.2, delay: 4.41 },
                { width: 2.9, height: 4.7, top: 51.6, left: 53.0, opacity: 0.43, duration: 11.9, delay: 2.74 },
                { width: 7.9, height: 6.9, top: 45.5, left: 20.4, opacity: 0.69, duration: 13.1, delay: 1.15 },
                { width: 7.6, height: 2.1, top: 55.5, left: 93.1, opacity: 0.49, duration: 17.1, delay: 0.61 },
                { width: 7.4, height: 5.9, top: 82.8, left: 88.7, opacity: 0.20, duration: 19.6, delay: 3.30 },
                { width: 4.7, height: 6.6, top: 77.6, left: 60.4, opacity: 0.68, duration: 18.4, delay: 1.83 },
                { width: 7.1, height: 6.3, top: 73.5, left: 28.0, opacity: 0.39, duration: 12.3, delay: 1.82 },
                { width: 6.8, height: 4.5, top: 88.5, left: 17.3, opacity: 0.46, duration: 15.8, delay: 1.67 },
                { width: 3.7, height: 7.6, top: 85.6, left: 6.5, opacity: 0.48, duration: 17.3, delay: 2.96 },
                { width: 2.1, height: 6.0, top: 77.2, left: 16.6, opacity: 0.68, duration: 18.9, delay: 4.15 },
                { width: 4.7, height: 3.7, top: 64.1, left: 8.2, opacity: 0.31, duration: 18.7, delay: 1.07 },
                { width: 2.5, height: 7.6, top: 99.2, left: 21.8, opacity: 0.24, duration: 18.7, delay: 4.32 },
                { width: 5.2, height: 3.7, top: 61.8, left: 85.7, opacity: 0.33, duration: 15.1, delay: 0.65 },
                { width: 6.6, height: 4.5, top: 60.1, left: 42.6, opacity: 0.57, duration: 10.3, delay: 3.63 },
                { width: 6.6, height: 4.8, top: 11.6, left: 81.9, opacity: 0.53, duration: 10.7, delay: 2.41 }
              ];
              const particle = particles[i];
              return (
                <div
                  key={i}
                  className="absolute rounded-full bg-white/30 blur-sm"
                  style={{
                    width: `${particle.width}px`,
                    height: `${particle.height}px`,
                    top: `${particle.top}%`,
                    left: `${particle.left}%`,
                    opacity: particle.opacity,
                    animation: `float ${particle.duration}s linear infinite`,
                    animationDelay: `${particle.delay}s`
                  }}
                ></div>
              );
            })}
          </div>

          {/* Floating Elements */}
          <div
            className="absolute top-1/4 right-1/4 h-24 w-24 rounded-full bg-white/10 backdrop-blur-sm"
            style={calcTransform(-15)}
          ></div>
          <div
            className="absolute bottom-1/4 left-1/4 h-32 w-32 rounded-full bg-white/5 backdrop-blur-sm"
            style={calcTransform(-10)}
          ></div>

          <div className="relative px-6 py-16 sm:px-12 sm:py-24 text-center">
            <div
              className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <div className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-white mb-6 border border-white/10">
                <Sparkles className="h-4 w-4 text-white mr-2" />
                Join the Future of Hackathons
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 sm:mb-6 max-w-3xl mx-auto">
                Ready to Create Your Next Hackathon?
              </h2>
              <p className="text-base sm:text-xl text-white/90 max-w-2xl mx-auto mb-8 sm:mb-10">
                Join CloudHub today and be part of the future of hackathons. Everything you need in one platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-xs sm:max-w-md mx-auto">
                <Button
                  size="lg"
                  className="group bg-white text-violet-900 hover:bg-white/90 px-6 sm:px-8 py-6 sm:py-7 h-auto text-base sm:text-lg font-medium rounded-xl shadow-lg shadow-violet-950/20 hover:shadow-violet-950/30 transition-all duration-300"
                >
                  Create a Hackathon
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </div>
            </div>

            <div
              className={`mt-12 sm:mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-xs sm:max-w-3xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <div className="flex flex-col items-center">
                <div className="text-2xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">100+</div>
                <p className="text-xs sm:text-base text-white/80">Active Hackathons</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-2xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">10K+</div>
                <p className="text-xs sm:text-base text-white/80">Community Members</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-2xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">2M+ AED</div>
                <p className="text-xs sm:text-base text-white/80">Prize Money</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
