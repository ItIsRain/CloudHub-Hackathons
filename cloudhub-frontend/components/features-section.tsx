"use client"

import { useRef, useEffect, useState } from "react"
import { Users, Award, Shield, Zap, Code, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

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

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [isVisible])

  const features = [
    {
      icon: <Users className="h-6 w-6 text-violet-600" />,
      title: "Community Marketplace",
      description: "Connect with a global community of innovators, creators, and problem-solvers.",
    },
    {
      icon: <Award className="h-6 w-6 text-violet-600" />,
      title: "Hackathon Infrastructure",
      description: "Everything you need to run successful hackathons, from registration to judging.",
    },
    {
      icon: <Shield className="h-6 w-6 text-violet-600" />,
      title: "Secure Escrow Services",
      description: "Guaranteed, transparent prize distribution with our trusted escrow system.",
    },
    {
      icon: <Zap className="h-6 w-6 text-violet-600" />,
      title: "AI-Powered Tools",
      description: "Boost productivity with our suite of AI tools designed for hackathon participants.",
    },
    {
      icon: <Code className="h-6 w-6 text-violet-600" />,
      title: "Expert Mentorship",
      description: "Connect with industry experts who can help take your project to the next level.",
    },
    {
      icon: <DollarSign className="h-6 w-6 text-violet-600" />,
      title: "CloudHub Credits",
      description: "Flexible credit system for accessing premium features and services.",
    },
  ]

  return (
    <section id="features" ref={sectionRef} className="py-16 sm:py-24 bg-white relative">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-b from-violet-50 to-transparent rounded-full blur-3xl opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-t from-indigo-50 to-transparent rounded-full blur-3xl opacity-60"></div>

      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-sm font-medium text-violet-800 mb-4">
            <span className="flex h-2 w-2 rounded-full bg-violet-600 mr-2"></span>
            Features
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
            Everything You Need for Successful Hackathons
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            CloudHub provides all the tools and services to create, manage, and participate in hackathons of any size.
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                "group relative p-6 sm:p-8 bg-white rounded-2xl border transition-all duration-500",
                index === activeFeature
                  ? "border-violet-200 shadow-lg shadow-violet-100/50 scale-[1.02] z-10"
                  : "border-slate-100 shadow-sm hover:shadow-md hover:border-violet-100",
              )}
            >
              <div
                className={cn(
                  "absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-50 to-indigo-50 opacity-0 transition-opacity duration-500",
                  index === activeFeature ? "opacity-100" : "group-hover:opacity-100",
                )}
              ></div>
              <div className="relative">
                <div
                  className={cn(
                    "flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl mb-4 sm:mb-5 transition-all duration-300",
                    index === activeFeature
                      ? "bg-gradient-to-r from-violet-500 to-indigo-500 text-white scale-110"
                      : "bg-violet-100 group-hover:bg-violet-200",
                  )}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-sm sm:text-base text-slate-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 sm:mt-24 relative">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-violet-50 to-indigo-50 opacity-50"></div>
          <div className="relative rounded-3xl overflow-hidden">
            <div className="grid gap-8 lg:grid-cols-2 items-center">
              <div className="p-6 sm:p-8 lg:p-12">
                <div className="inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-sm font-medium text-violet-800 mb-4">
                  <Shield className="h-4 w-4 text-violet-600 mr-2" />
                  Secure Escrow
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Trusted Escrow & Payment System</h3>
                <p className="text-base sm:text-lg text-slate-600 mb-6 sm:mb-8">
                  CloudHub acts as the escrow agent for prize money and sponsorships, ensuring fair and transparent
                  distribution to winners.
                </p>
                <ul className="space-y-4">
                  {[
                    "Secure deposit of prize funds before the event",
                    "Transparent fee structure with no hidden costs",
                    "Automated prize distribution to winners",
                    "Support for multiple payment methods and currencies",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 flex items-center justify-center mr-3 mt-0.5 shadow-sm">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative lg:h-full bg-gradient-to-r from-violet-600 to-indigo-600 p-6 sm:p-8 lg:p-0">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div className="relative lg:absolute lg:inset-0 flex items-center justify-center py-8">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl p-6 sm:p-8 max-w-md w-full mx-4 sm:mx-auto transform transition-transform duration-700 hover:scale-105">
                    <div className="space-y-6">
                      <div className="flex justify-between items-center pb-4 border-b border-white/10">
                        <div>
                          <p className="text-sm text-white/70">Total Prize Pool</p>
                          <p className="text-3xl font-bold text-white">25,000 AED</p>
                        </div>
                        <div className="h-14 w-14 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                          <DollarSign className="h-7 w-7 text-white" />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-white/70">Escrow Fee (5%)</span>
                          <span className="font-medium text-white">1,250 AED</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Processing Fee (2.5%)</span>
                          <span className="font-medium text-white">625 AED</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Available for Winners</span>
                          <span className="font-medium text-white">23,125 AED</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/10">
                        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
                          <div className="flex items-center">
                            <Shield className="h-5 w-5 text-white mr-2" />
                            <span className="text-sm font-medium text-white">
                              Funds securely held in escrow until hackathon completion
                            </span>
                          </div>
                        </div>
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
