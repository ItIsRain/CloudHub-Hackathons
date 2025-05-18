"use client"

import { useRef, useEffect, useState, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Rocket, Zap, CheckCircle } from "lucide-react"

// Define fixed particle values to avoid hydration mismatch
// Reduced number of particles from 15 to 8 for performance
const particles = [
  { width: 2.7, height: 3.3, top: 19.6, left: 50.1, opacity: 0.30, duration: 11.2, delay: 4.41 },
  { width: 7.9, height: 6.9, top: 45.5, left: 20.4, opacity: 0.69, duration: 13.1, delay: 1.15 },
  { width: 7.4, height: 5.9, top: 82.8, left: 88.7, opacity: 0.20, duration: 19.6, delay: 3.30 },
  { width: 4.7, height: 6.6, top: 77.6, left: 60.4, opacity: 0.68, duration: 18.4, delay: 1.83 },
  { width: 7.1, height: 6.3, top: 73.5, left: 28.0, opacity: 0.39, duration: 12.3, delay: 1.82 },
  { width: 3.7, height: 7.6, top: 85.6, left: 6.5, opacity: 0.48, duration: 17.3, delay: 2.96 },
  { width: 5.2, height: 3.7, top: 61.8, left: 85.7, opacity: 0.33, duration: 15.1, delay: 0.65 },
  { width: 6.6, height: 4.5, top: 60.1, left: 42.6, opacity: 0.57, duration: 10.3, delay: 3.63 }
];

// Precomputed benefit items for performance
const benefits = [
  "One-click hackathon creation",
  "Built-in mentorship marketplace",
  "Secure escrow payment system"
];

// Precomputed stats for performance
const stats = [
  { label: "Community Members", value: "Active" },
  { label: "AI Tools Available", value: "15+" },
  { label: "Success Rate", value: "98%" },
  { label: "Innovation Score", value: "+42%" }
];

export default function CtaSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 }) // Default center position
  const rafRef = useRef<number | null>(null)
  
  // Use IntersectionObserver for efficient visibility tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Once visible, no need to keep observing
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: "100px" },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Optimized mouse move handler with debouncing via requestAnimationFrame
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!sectionRef.current || !isVisible) return
    
    // Cancel any pending animation frame
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
    }
    
    // Schedule new position calculation
    rafRef.current = requestAnimationFrame(() => {
      const rect = sectionRef.current?.getBoundingClientRect()
      if (!rect) return
      
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      setMousePosition({ x, y })
      rafRef.current = null
    })
  }, [isVisible])

  // Attach/detach mouse move listener with passive option for better performance
  useEffect(() => {
    if (!isVisible) return
    
    document.addEventListener("mousemove", handleMouseMove, { passive: true })
    
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      // Clean up any pending animation frame on unmount
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [isVisible, handleMouseMove])

  // Memoize transform values to avoid recalculations
  const calcTransform = useMemo(() => {
    const factor = 15
    const moveX = (mousePosition.x - 0.5) * factor
    const moveY = (mousePosition.y - 0.5) * factor
    return {
      transform: `translate(${moveX}px, ${moveY}px)`,
    }
  }, [mousePosition])

  // Optimization: Only render particles when section is visible
  const renderParticles = isVisible && (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {particles.map((particle, i) => (
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
      ))}
    </div>
  )

  return (
    <section className="py-20 sm:py-28 bg-white relative">
      {/* Simplified decorative elements - reduced for performance */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-b from-violet-50 to-transparent rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-t from-indigo-50 to-transparent rounded-full blur-3xl opacity-60"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6">
        <div 
          ref={sectionRef} 
          className={`relative rounded-3xl overflow-hidden transform transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Gradient background with glass effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/80 to-indigo-600/75 z-0"></div>
          
          {/* Frosted glass overlay */}
          <div className="absolute inset-0 backdrop-filter backdrop-blur-sm bg-white/10 z-0"></div>
          
          {/* Mesh grid pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] z-0"></div>
          
          {/* Light reflection effects */}
          <div className="absolute top-[15%] left-[30%] w-80 h-20 bg-white/20 blur-xl rounded-full rotate-45 z-0"></div>
          <div className="absolute bottom-[20%] right-[20%] w-60 h-16 bg-white/15 blur-xl rounded-full -rotate-45 z-0"></div>

          {/* Conditionally rendered particles only when visible */}
          {renderParticles}

          {/* Glass elements */}
          {isVisible && (
            <>
              <div
                className="absolute top-1/4 right-1/4 h-24 w-24 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 z-0"
                style={calcTransform}
              ></div>
              <div
                className="absolute bottom-1/4 left-1/4 h-32 w-32 rounded-full bg-white/5 backdrop-blur-sm border border-white/20 z-0"
                style={calcTransform}
              ></div>
            </>
          )}

          <div className="relative px-6 py-16 sm:px-12 sm:py-20 md:py-24 z-[1]">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div
                  className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                >
                  <div className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-white mb-6 border border-white/10">
                    <Rocket className="h-4 w-4 text-white mr-2" />
                    Launch Your Hackathon
                  </div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 sm:mb-6">
                    Ready to Create Your Next Hackathon?
                  </h2>
                  <p className="text-base sm:text-xl text-white/90 mb-8 sm:mb-10">
                    Join CloudHub today and be part of the future of hackathons. Everything you need in one platform.
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    {benefits.map((item, i) => (
                      <div 
                        key={i} 
                        className={`flex items-center transition-all duration-700 delay-${i * 100} ${
                          isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                        }`}
                      >
                        <CheckCircle className="h-5 w-5 text-emerald-400 mr-3 flex-shrink-0" />
                        <span className="text-white/95">{item}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-4">
                    <Button
                      className="group bg-white text-violet-900 hover:bg-white/90 px-6 sm:px-6 py-3 sm:py-3 h-auto text-base font-medium rounded-xl shadow-lg shadow-violet-950/20 hover:shadow-violet-950/30 transition-all duration-300"
                    >
                      Create a Hackathon
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                    <Button
                      className="group bg-transparent border border-white/30 text-white hover:bg-white/10 px-6 sm:px-6 py-3 sm:py-3 h-auto text-base font-medium rounded-xl transition-all duration-300"
                    >
                      Learn More
                    </Button>
                  </div>
                </div>

                <div 
                  className={`relative transition-all duration-700 delay-200 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  }`}
                >
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl p-6 transform transition-all duration-500 hover:scale-[1.02]">
                    <div className="space-y-4">
                      <div className="flex items-center mb-3">
                        <div className="h-11 w-11 rounded-full bg-white/10 flex items-center justify-center mr-3 border border-white/20">
                          <Zap className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">CloudHub Advantage</h3>
                          <p className="text-white/70 text-sm">All-in-one hackathon platform</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3.5">
                        {stats.map((stat, i) => (
                          <div 
                            key={i} 
                            className={`flex justify-between items-center py-2.5 border-b border-white/10 transition-all duration-700 delay-${200 + i * 100} ${
                              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                            }`}
                          >
                            <span className="text-white/70">{stat.label}</span>
                            <span className="text-base font-semibold text-white">{stat.value}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="pt-3">
                        <div className="bg-gradient-to-r from-violet-500/20 to-indigo-500/20 rounded-xl p-3.5 backdrop-blur-sm border border-white/10">
                          <div className="flex items-center">
                            <Sparkles className="h-4 w-4 text-white mr-2" />
                            <span className="text-sm font-medium text-white">
                              Launch your hackathon in under 10 minutes
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Simplified pulse effects - reduced opacity and size for performance */}
                  {isVisible && (
                    <>
                      <div 
                        className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-gradient-to-br from-indigo-400 to-violet-400 blur-xl opacity-20 animate-pulse"
                        style={{animationDuration: '4s'}}
                      ></div>
                      <div 
                        className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 blur-xl opacity-15 animate-pulse"
                        style={{animationDuration: '6s'}}
                      ></div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
