"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Code, Award, Shield, Sparkles } from "lucide-react"

export default function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setMounted(true)

    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return
      const rect = heroRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      setMousePosition({ x, y })
    }

    const heroElement = heroRef.current
    if (heroElement) {
      heroElement.addEventListener("mousemove", handleMouseMove)
    }

    return () => {
      if (heroElement) {
        heroElement.removeEventListener("mousemove", handleMouseMove)
      }
    }
  }, [])

  // Calculate transform values based on mouse position
  const calcTransform = (factor = 1) => {
    if (!mounted) return {}
    const moveX = (mousePosition.x - 0.5) * factor
    const moveY = (mousePosition.y - 0.5) * factor
    return {
      transform: `translate(${moveX}px, ${moveY}px)`,
    }
  }

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative pt-24 sm:pt-32 pb-16 sm:pb-20 overflow-hidden bg-gradient-to-b from-violet-950 to-slate-900 text-white"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-600/20 via-transparent to-transparent"></div>
        <div
          className="absolute top-0 right-0 w-1/2 h-1/2 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-600/20 via-transparent to-transparent blur-2xl"
          style={calcTransform(20)}
        ></div>
        <div
          className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-600/10 via-transparent to-transparent blur-2xl"
          style={calcTransform(15)}
        ></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

        {/* Animated Particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => {
            // Fixed values for each particle
            const particles = [
              { width: 4.4, height: 6.0, top: 34.5, left: 77.4, opacity: 0.39, duration: 14.5, delay: 0.06 },
              { width: 3.7, height: 2.2, top: 70.7, left: 51.3, opacity: 0.31, duration: 13.5, delay: 1.42 },
              { width: 5.2, height: 3.0, top: 32.0, left: 9.4, opacity: 0.35, duration: 10.3, delay: 4.27 },
              { width: 4.0, height: 2.3, top: 22.8, left: 29.9, opacity: 0.44, duration: 19.8, delay: 1.61 },
              { width: 2.6, height: 5.7, top: 86.3, left: 76.8, opacity: 0.42, duration: 19.3, delay: 4.10 },
              { width: 4.8, height: 3.5, top: 43.5, left: 91.8, opacity: 0.47, duration: 16.9, delay: 2.55 },
              { width: 4.3, height: 2.6, top: 78.9, left: 56.7, opacity: 0.59, duration: 11.8, delay: 2.92 },
              { width: 2.5, height: 5.5, top: 18.0, left: 85.8, opacity: 0.66, duration: 14.0, delay: 3.87 },
              { width: 4.8, height: 2.1, top: 15.1, left: 62.6, opacity: 0.62, duration: 14.3, delay: 4.86 },
              { width: 2.8, height: 5.9, top: 1.2, left: 93.0, opacity: 0.57, duration: 12.9, delay: 0.20 },
              { width: 5.6, height: 4.6, top: 15.7, left: 63.5, opacity: 0.23, duration: 12.0, delay: 1.94 },
              { width: 4.5, height: 4.4, top: 61.8, left: 62.2, opacity: 0.42, duration: 20.0, delay: 3.81 },
              { width: 5.8, height: 5.6, top: 45.4, left: 17.0, opacity: 0.45, duration: 17.3, delay: 3.11 },
              { width: 2.3, height: 4.9, top: 25.9, left: 41.7, opacity: 0.69, duration: 19.7, delay: 1.10 },
              { width: 2.9, height: 5.6, top: 35.5, left: 85.9, opacity: 0.46, duration: 16.3, delay: 1.26 },
              { width: 4.6, height: 3.7, top: 40.8, left: 62.1, opacity: 0.38, duration: 17.0, delay: 2.80 },
              { width: 3.1, height: 2.7, top: 74.6, left: 59.5, opacity: 0.52, duration: 12.2, delay: 2.73 },
              { width: 3.9, height: 4.5, top: 100.0, left: 3.2, opacity: 0.35, duration: 17.4, delay: 3.29 },
              { width: 5.3, height: 6.0, top: 82.0, left: 63.3, opacity: 0.34, duration: 13.5, delay: 0.87 },
              { width: 2.9, height: 3.5, top: 7.0, left: 64.9, opacity: 0.58, duration: 13.6, delay: 1.02 }
            ];
            const particle = particles[i];
            return (
              <div
                key={i}
                className="absolute rounded-full bg-white/20 blur-sm"
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
      </div>

      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <div className="max-w-xl">
            <div className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-sm px-3 py-1 text-sm font-medium text-white mb-6 border border-white/10 shadow-xl shadow-violet-950/20">
              <span className="relative overflow-hidden">
                <span className="animate-marquee whitespace-nowrap">
                  The Future of Hackathons
                </span>
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-4 sm:mb-6 leading-tight">
              Create Epic{" "}
              <span className="relative inline-block">
                <span className="relative z-10">Hackathons</span>
                <span className="absolute bottom-1 sm:bottom-2 left-0 w-full h-2 sm:h-3 bg-gradient-to-r from-violet-600 to-indigo-600 opacity-50 rounded animate-pulse"></span>
              </span>{" "}
              with CloudHub
            </h1>
            <p className="text-lg sm:text-xl text-white/80 mb-6 sm:mb-8 leading-relaxed">
              The premier platform where anyone can create or join hackathons with all the tools you need for success.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button 
                className="group bg-violet-600/10 border border-violet-600/40 text-violet-100 hover:bg-white hover:text-violet-900 px-6 sm:px-8 py-5 sm:py-6 h-auto text-base font-medium rounded-xl shadow-lg shadow-violet-950/20 hover:shadow-violet-950/30 transition-all duration-300"
              >
                Explore Hackathons
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </div>

            <div className="mt-10 sm:mt-12 grid grid-cols-3 gap-2 sm:gap-4">
              <div className="group flex flex-col items-center text-center">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm mb-2 sm:mb-3 border border-white/10 transition-transform duration-300 group-hover:scale-110 group-hover:bg-white/20">
                  <Code className="h-5 w-5 sm:h-6 sm:w-6 text-violet-300" />
                </div>
                <p className="text-xs sm:text-sm font-medium text-white">100+ Active Hackathons</p>
              </div>
              <div className="group flex flex-col items-center text-center">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm mb-2 sm:mb-3 border border-white/10 transition-transform duration-300 group-hover:scale-110 group-hover:bg-white/20">
                  <Award className="h-5 w-5 sm:h-6 sm:w-6 text-violet-300" />
                </div>
                <p className="text-xs sm:text-sm font-medium text-white">2M+ AED Prize Money</p>
              </div>
              <div className="group flex flex-col items-center text-center">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm mb-2 sm:mb-3 border border-white/10 transition-transform duration-300 group-hover:scale-110 group-hover:bg-white/20">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-violet-300" />
                </div>
                <p className="text-xs sm:text-sm font-medium text-white">Secure Escrow</p>
              </div>
            </div>
          </div>

          <div className="relative lg:ml-auto">
            {mounted && (
              <div className="relative mx-auto w-full max-w-lg mt-12 lg:mt-0">
                <div
                  className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 opacity-30 blur-xl"
                  style={calcTransform(10)}
                ></div>
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
                  <div className="absolute top-0 left-0 right-0 h-10 sm:h-14 bg-gradient-to-r from-violet-950/80 to-slate-900/80 backdrop-blur-sm border-b border-white/10 flex items-center px-4">
                    <div className="flex space-x-1.5 sm:space-x-2">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="absolute left-0 right-0 text-center text-xs font-medium text-white/70">CloudHub Dashboard</div>
                  </div>
                  <div className="pt-10 sm:pt-14">
                    <Image
                      src="/placeholder.svg?height=600&width=800"
                      alt="CloudHub Platform Dashboard"
                      width={800}
                      height={600}
                      className="w-full h-auto"
                    />
                  </div>

                  {/* Floating Elements */}
                  <div
                    className="absolute top-1/4 right-8 h-16 w-16 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 shadow-lg opacity-80 blur-[1px]"
                    style={calcTransform(-15)}
                  ></div>
                  <div
                    className="absolute bottom-1/4 left-8 h-12 w-12 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 shadow-lg opacity-60 blur-[1px]"
                    style={calcTransform(-10)}
                  ></div>
                </div>

                {/* Decorative Elements */}
                <div
                  className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 opacity-20 blur-xl"
                  style={calcTransform(5)}
                ></div>
                <div
                  className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 opacity-10 blur-xl"
                  style={calcTransform(8)}
                ></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Animated Wave */}
      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24">
        <svg className="absolute bottom-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#f8fafc"
            fillOpacity="1"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  )
}
