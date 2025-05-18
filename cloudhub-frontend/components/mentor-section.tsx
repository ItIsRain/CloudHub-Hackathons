"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Star, Calendar, Sparkles, ArrowRight } from "lucide-react"
import { useRef, useEffect, useState, useMemo } from "react"

// Define types for social proof items
type SocialProofItem = 
  | { type: "avatars"; content: string[]; label: string }
  | { type: "rating"; label: string };

export default function MentorSection() {
  const sectionRef = useRef<HTMLElement>(null)
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

  return (
    <section 
      id="mentors" 
      ref={sectionRef} 
      className="py-12 sm:py-16 bg-white relative overflow-hidden"
    >
      {/* Removed decorative elements that were creating the light blue effect */}
      
      <div className="container mx-auto px-4 sm:px-6 relative">
        <div 
          className={`text-center max-w-3xl mx-auto transition-all duration-700 ${
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
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
              Share your expertise with hackathon teams while earning competitive rates you control.
              <span className="block mt-2 text-violet-600 font-medium">Join over 2,000+ expert mentors on CloudHub.</span>
            </p>
            {/* Removed the pulse animations that added colored background effects */}
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-4 mt-8">
            <div className="flex items-center md:order-1 order-2 md:ml-4">
              <Button 
                className="group relative overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 px-8 py-3 h-auto text-base font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span className="relative z-10 flex items-center">
                  Become a Mentor
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-violet-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></span>
                <span className="absolute top-0 left-0 w-full h-full bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              </Button>
            </div>
            
            <div className="space-y-2 md:space-y-0 md:space-x-4 flex flex-col md:flex-row md:items-center md:order-2 order-1">
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
          
        </div>
      </div>
    </section>
  )
}
