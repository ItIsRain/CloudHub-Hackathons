"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Clock, DollarSign, Star, Briefcase, Calendar, Users, Sparkles, ArrowRight } from "lucide-react"
import { useRef, useEffect, useState, useMemo } from "react"

// Define fixed particle values to avoid hydration mismatch
// Reduced particle count for better performance
const particles = [
  { width: 3.1, height: 5.8, top: 10.4, left: 25.1, opacity: 0.30, duration: 13.2, delay: 2.41 },
  { width: 5.2, height: 5.3, top: 60.5, left: 15.4, opacity: 0.40, duration: 14.1, delay: 0.95 },
  { width: 4.9, height: 3.2, top: 75.8, left: 60.1, opacity: 0.30, duration: 15.1, delay: 1.61 },
  { width: 3.5, height: 4.8, top: 85.8, left: 80.7, opacity: 0.35, duration: 16.6, delay: 2.30 },
  { width: 4.3, height: 5.6, top: 50.6, left: 70.4, opacity: 0.40, duration: 15.4, delay: 0.83 },
  { width: 5.1, height: 3.7, top: 20.5, left: 30.2, opacity: 0.30, duration: 14.3, delay: 1.82 }
];

// Define types for social proof items
type SocialProofItem = 
  | { type: "avatars"; content: string[]; label: string }
  | { type: "rating"; label: string };

export default function MentorSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Use IntersectionObserver with rootMargin for earlier loading
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  // Memoize social proof content
  const socialProofItems = useMemo<SocialProofItem[]>(() => [
    { type: "avatars", content: ["AJ", "SC", "MO"], label: "Joined this month" },
    { type: "rating", label: "4.9/5 average rating" }
  ], []);

  const mentors = [
    {
      name: "Alex Johnson",
      role: "Full Stack Developer",
      rating: 4.9,
      hourlyRate: 120,
      expertise: ["React", "Node.js", "AWS"],
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Sarah Chen",
      role: "UX/UI Designer",
      rating: 4.8,
      hourlyRate: 100,
      expertise: ["Figma", "User Research", "Prototyping"],
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Michael Okonjo",
      role: "AI Specialist",
      rating: 5.0,
      hourlyRate: 150,
      expertise: ["Machine Learning", "Python", "TensorFlow"],
      image: "/placeholder.svg?height=200&width=200",
    },
  ]

  return (
    <section 
      id="mentors" 
      ref={sectionRef} 
      className="py-12 sm:py-16 bg-white relative overflow-hidden"
    >
      {/* Decorative elements - reduced blur intensity for better performance */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-b from-violet-50 to-transparent rounded-full blur-2xl opacity-60 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-t from-indigo-50 to-transparent rounded-full blur-2xl opacity-60 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative">
        <div 
          className={`text-center max-w-3xl mx-auto mb-8 sm:mb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-100 to-indigo-100 px-4 py-2 text-sm font-medium text-violet-800 mb-5 shadow-sm hardware-accelerated">
            <Sparkles className="h-4 w-4 text-violet-600 mr-2" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 font-semibold">Mentorship Marketplace</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
            Become a <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">Mentor</span> & Get Paid
          </h2>
          
          <div className="relative">
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Share your expertise with hackathon teams while earning competitive rates you control.
              <span className="block mt-2 text-violet-600 font-medium">Join over 2,000+ expert mentors on CloudHub.</span>
            </p>
            {/* Simplified pulse animations - reduced size and opacity */}
            <div className="absolute -right-10 top-1/2 transform -translate-y-1/2 hidden lg:block">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-violet-500/20 to-indigo-500/20 blur-xl animate-pulse"></div>
            </div>
            <div className="absolute -left-10 top-1/2 transform -translate-y-1/2 hidden lg:block">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-500/20 to-violet-500/20 blur-xl animate-pulse" style={{animationDuration: '1s'}}></div>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {socialProofItems.map((item, i) => (
              <div key={i} className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm border border-slate-100">
                {item.type === "avatars" ? (
                  <div className="flex -space-x-2 mr-3">
                    {item.content.map((initial, j) => (
                      <div key={j} className="h-8 w-8 rounded-full bg-gradient-to-r from-violet-400 to-indigo-400 flex items-center justify-center text-white text-xs font-medium border-2 border-white">
                        {initial}
                      </div>
                    ))}
                  </div>
                ) : (
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1.5" />
                )}
                <span className="text-sm text-slate-600">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reduced spacing */}
        <div className="h-8 sm:h-12"></div>
        
        <div 
          ref={ctaRef}
          className={`relative rounded-2xl overflow-hidden backdrop-blur-optimized p-8 sm:p-10 md:p-12 shadow-xl transform transition-all duration-700 delay-300 z-10 hardware-accelerated ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Gradient background with glass effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/80 via-indigo-500/70 to-purple-600/75 z-[-1]"></div>
          
          {/* Frosted glass overlay */}
          <div className="absolute inset-0 backdrop-filter backdrop-blur-sm bg-white/10 z-[-1]"></div>
          
          {/* Mesh grid pattern - simplified */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_2px,transparent_2px)] [background-size:24px_24px] z-[-1]"></div>
          
          {/* Glass elements - reduced for better performance */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 backdrop-blur-sm rounded-full -translate-y-1/2 translate-x-1/2 border border-white/20 z-[0]"></div>
          
          {/* Light reflection effects - consolidated */}
          <div className="absolute top-[10%] left-[20%] w-80 h-20 bg-white/20 blur-xl rounded-full rotate-45 z-[-1]"></div>
          
          {/* Animated particles with pre-defined values - reduced count */}
          <div className="absolute inset-0 z-[0] pointer-events-none">
            {particles.map((particle, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white/30 blur-sm animate-float"
                style={{
                  width: `${particle.width}px`,
                  height: `${particle.height}px`,
                  top: `${particle.top}%`,
                  left: `${particle.left}%`,
                  opacity: particle.opacity,
                  animationDuration: `${particle.duration}s`,
                  animationDelay: `${particle.delay}s`
                }}
              ></div>
            ))}
          </div>
          
          <div className="relative max-w-4xl mx-auto z-[1]">
            <div className="grid md:grid-cols-5 gap-8 items-center">
              <div className="md:col-span-3">
                <div className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white mb-6 border border-white/10">
                  <Sparkles className="h-4 w-4 text-white mr-2" />
                  Join Our Expert Network
                </div>
                
                <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
                  Ready to share your expertise and get paid?
                </h3>
                
                <p className="text-white/90 text-lg mb-8 leading-relaxed">
                  Join our global network of mentors helping hackathon teams build amazing projects while earning competitive rates. Our top mentors earn over $5,000 monthly!
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <Button className="group bg-white text-violet-900 hover:bg-white/90 px-8 py-6 h-auto text-base font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    Apply as Mentor Today
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                  
                  <Button className="group bg-transparent border border-white/30 text-white hover:bg-white/10 px-6 py-6 h-auto text-base font-medium rounded-xl transition-all duration-300">
                    Learn More
                  </Button>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl p-6 transform transition-all duration-500 hover:scale-[1.02] hardware-accelerated">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-white/10">
                      <div>
                        <p className="text-sm text-white/70">Average Hourly Rate</p>
                        <p className="text-3xl font-bold text-white">$135</p>
                      </div>
                      <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                        <DollarSign className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        { label: "Technical Mentors", value: "$100-180" },
                        { label: "Design Mentors", value: "$90-150" },
                        { label: "Business Mentors", value: "$120-200" }
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between">
                          <span className="text-white/70">{item.label}</span>
                          <span className="font-medium text-white">{item.value}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-4 bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10 mt-4">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-white mr-2" />
                        <span className="text-sm font-medium text-white">Most mentors work 5-15 hours per event</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
