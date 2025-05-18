"use client"

import { useRef, useEffect, useState } from "react"
import { Users, Award, Shield, Zap, Code, DollarSign, ShieldCheck, BarChart3, Trophy, ClipboardCheck, Laptop, UserPlus, Lock as LockIcon, Check as CheckIcon, ShieldCheck as ShieldCheckIcon, ArrowRight as ArrowRightIcon } from "lucide-react"
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
    }, 4000)

    return () => clearInterval(interval)
  }, [isVisible])

  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Community Marketplace",
      description: "Connect with a global community of innovators, creators, and problem-solvers.",
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "End-to-End Hackathon Platform",
      description: "One command to launch your entire hackathon with registration, project submissions, judging, and prize distribution.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure Escrow Services",
      description: "Bank-grade security with blockchain verification ensures transparent and guaranteed prize distribution.",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "AI-Powered Tools",
      description: "Our proprietary AI assistant helps teams brainstorm, debug code, and optimize projects in real-time.",
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: "Expert Mentorship",
      description: "Connect with industry experts who can help take your project to the next level.",
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "CloudHub Credits",
      description: "Flexible credit system for accessing premium features and services.",
    },
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: "Real-time Collaboration",
      description: "Built-in tools for team formation, video meetings, and code collaboration.",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Analytics Dashboard",
      description: "Track participation, engagement, and project metrics with our powerful analytics suite.",
    },
    {
      icon: <Trophy className="h-6 w-6" />,
      title: "Project Showcase",
      description: "Stunning galleries to showcase winning projects and attract future sponsors.",
    },
    {
      icon: <ClipboardCheck className="h-6 w-6" />,
      title: "Smart Judging System",
      description: "Streamlined judging with custom criteria, blind reviews, and automated scoring.",
    },
    {
      icon: <Laptop className="h-6 w-6" />,
      title: "Virtual Event Spaces",
      description: "Immersive virtual environments for remote hackathons with networking lounges.",
    },
    {
      icon: <UserPlus className="h-6 w-6" />,
      title: "Team Formation Tools",
      description: "Find the perfect teammates with skill matching and project interest algorithms.",
    },
  ]

  return (
    <section id="features" ref={sectionRef} className="py-16 sm:py-24 bg-white relative">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-b from-violet-50 to-transparent rounded-full blur-3xl opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-t from-indigo-50 to-transparent rounded-full blur-3xl opacity-60"></div>

      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-sm font-medium text-violet-800 mb-4">
            <span className="flex h-2 w-2 rounded-full bg-violet-600 mr-2"></span>
            Features
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
            The Ultimate All-in-One Hackathon Platform
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            CloudHub provides a complete ecosystem to create, manage, and participate in world-class hackathons with zero hassle.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
                      : "bg-violet-100 group-hover:bg-violet-200 text-violet-600",
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
          {/* Trusted Escrow & Payment System */}
          <div className="relative bg-gradient-to-br from-slate-900 to-violet-950 rounded-3xl overflow-hidden transform transition-all duration-500 hover:scale-[1.02] border border-white/10 shadow-xl">
            {/* Background effects - optimized for performance */}
            <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(131,56,236,0.03)_0%,rgba(131,56,236,0)_40%,rgba(131,56,236,0)_60%,rgba(131,56,236,0.03)_100%)] z-0"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(203,213,225,0.08)_0%,rgba(203,213,225,0)_60%)] z-0"></div>
            
            {/* Grid pattern - simplified for performance */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 z-0"></div>
            
            <div className="relative z-10 p-8 sm:p-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600/20 backdrop-blur-sm text-white">
                    <LockIcon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">Trusted Escrow & Payment System</h3>
                </div>
                <div className="hidden sm:flex items-center space-x-2">
                  <div className="flex h-8 items-center rounded-full bg-violet-600/10 px-3 text-xs font-semibold text-violet-200 backdrop-blur-sm border border-violet-600/20">
                    Enterprise-grade Security
                  </div>
                  <div className="flex h-8 items-center rounded-full bg-amber-500/10 px-3 text-xs font-semibold text-amber-200 backdrop-blur-sm border border-amber-500/20">
                    Optional Feature
                  </div>
                </div>
              </div>
              
              <p className="mt-4 text-slate-200 leading-relaxed">
                CloudHub handles all financial aspects of your hackathon with bank-level security, ensuring fair and transparent prize distribution while eliminating payment headaches.
              </p>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600/20 backdrop-blur-sm border border-emerald-600/30">
                      <CheckIcon className="h-4 w-4 text-emerald-400" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Secure Prize Fund Deposits</h4>
                    <p className="mt-1 text-sm text-slate-300">Protected escrow before events start</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600/20 backdrop-blur-sm border border-emerald-600/30">
                      <CheckIcon className="h-4 w-4 text-emerald-400" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Transparent Fee Structure</h4>
                    <p className="mt-1 text-sm text-slate-300">No hidden costs or surprise charges</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600/20 backdrop-blur-sm border border-emerald-600/30">
                      <CheckIcon className="h-4 w-4 text-emerald-400" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Automated Prize Distribution</h4>
                    <p className="mt-1 text-sm text-slate-300">Instant payments to verified winners</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600/20 backdrop-blur-sm border border-emerald-600/30">
                      <CheckIcon className="h-4 w-4 text-emerald-400" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Multiple Payment Methods</h4>
                    <p className="mt-1 text-sm text-slate-300">Support for global currencies & methods</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600/20 backdrop-blur-sm border border-emerald-600/30">
                      <CheckIcon className="h-4 w-4 text-emerald-400" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Smart Contracts</h4>
                    <p className="mt-1 text-sm text-slate-300">Conditional prize releases with guarantees</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600/20 backdrop-blur-sm border border-emerald-600/30">
                      <CheckIcon className="h-4 w-4 text-emerald-400" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Financial Dashboard</h4>
                    <p className="mt-1 text-sm text-slate-300">Real-time monitoring for organizers</p>
                  </div>
                </div>
              </div>
              
              {/* Visual element for added interest */}
              <div className="mt-8 relative">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-violet-600/10 blur-2xl rounded-full"></div>
                <div className="relative overflow-hidden h-20 rounded-xl bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur border border-white/5">
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(56,189,248,0)_0%,rgba(56,189,248,0.1)_20%,rgba(56,189,248,0)_40%)] animate-shimmer"></div>
                  <div className="h-full flex items-center justify-between px-6">
                    <div className="flex items-center space-x-4">
                      <ShieldCheckIcon className="h-8 w-8 text-violet-400" />
                      <div>
                        <div className="text-sm font-medium text-white">CloudHub Vault Protection</div>
                        <div className="text-xs text-slate-400">Enterprise-grade encryption with multi-layer security guarantees</div>
                      </div>
                    </div>
                    <ArrowRightIcon className="h-5 w-5 text-violet-400" />
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
