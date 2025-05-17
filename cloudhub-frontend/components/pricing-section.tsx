"use client"

import { useState, useRef, useEffect } from "react"
import { Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function PricingSection() {
  const [selectedPlan, setSelectedPlan] = useState(1)
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

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

  const plans = [
    {
      name: "Starter Plan",
      price: "AED 2,500",
      usdPrice: "USD 680",
      description: "Perfect for small hackathons and first-time organizers",
      features: [
        "Up to 100 participants",
        "Standard hackathon management tools",
        "Basic branding customization",
        "500 CloudHub Credits included",
        "Core AI tools access",
        "Community support",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Growth Plan",
      price: "AED 7,500",
      usdPrice: "USD 2,040",
      description: "Ideal for medium-sized hackathons with more customization needs",
      features: [
        "Up to 300 participants",
        "Advanced hackathon features",
        "Custom branding options",
        "1,500 CloudHub Credits included",
        "Full AI tools suite",
        "Priority support (12-hour response)",
      ],
      cta: "Choose Growth",
      popular: true,
    },
    {
      name: "Scale Plan",
      price: "AED 20,000",
      usdPrice: "USD 5,450",
      description: "For large-scale hackathons requiring premium features",
      features: [
        "Up to 1,000 participants",
        "Premium features and customization",
        "White-label options",
        "5,000 CloudHub Credits included",
        "Unlimited AI tools access",
        "Dedicated support (4-hour response)",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ]

  return (
    <section id="pricing" ref={sectionRef} className="py-16 sm:py-24 bg-slate-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-violet-100/50 blur-3xl"></div>
        <div className="absolute bottom-0 -left-40 h-[400px] w-[400px] rounded-full bg-indigo-100/50 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-sm font-medium text-violet-800 mb-4">
            <span className="flex h-2 w-2 rounded-full bg-violet-600 mr-2"></span>
            Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
            Transparent Pricing for Every Hackathon
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Choose the plan that fits your hackathon size and needs. All plans include our core platform features.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={cn(
                "relative rounded-2xl border p-6 sm:p-8 transition-all duration-500",
                selectedPlan === index
                  ? "bg-gradient-to-b from-white to-violet-50 border-violet-200 shadow-lg shadow-violet-100/50 scale-[1.02] z-10"
                  : "bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-violet-200",
                isVisible && `animate-fade-in-${index + 1}`,
              )}
              onClick={() => setSelectedPlan(index)}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 mx-auto w-32 sm:w-36 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-1 sm:py-2 text-center text-xs sm:text-sm font-semibold text-white shadow-md">
                  <Sparkles className="inline-block h-3 w-3 mr-1" />
                  Most Popular
                </div>
              )}
              <div className="mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">{plan.name}</h3>
                <div className="mt-3 sm:mt-4 flex items-baseline">
                  <span className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">{plan.price}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">{plan.usdPrice} per hackathon</p>
                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-600">{plan.description}</p>
              </div>
              <ul className="mb-8 space-y-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <div
                      className={cn(
                        "flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center mr-3 mt-0.5",
                        selectedPlan === index || plan.popular
                          ? "bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-sm"
                          : "bg-violet-100",
                      )}
                    >
                      <Check className="h-4 w-4" />
                    </div>
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={cn(
                  "w-full h-12 rounded-xl text-base transition-all duration-300",
                  selectedPlan === index || plan.popular
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-md"
                    : "bg-white text-slate-900 border border-slate-200 hover:border-violet-300 hover:bg-violet-50",
                )}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-16 sm:mt-20 max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transform transition-all duration-700 hover:shadow-lg hover:border-violet-200">
          <div className="p-6 sm:p-8 bg-gradient-to-r from-violet-600 to-indigo-600 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMzAgMzBhMTUgMTUgMCAxIDAgMC0zMCAxNSAxNSAwIDAgMCAwIDMwem0wLTVhMTAgMTAgMCAxIDAgMC0yMCAxMCAxMCAwIDAgMCAwIDIweiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIuMSIvPjwvZz48L3N2Zz4=')] bg-center opacity-10"></div>
            <div className="relative">
              <h3 className="text-xl sm:text-2xl font-bold mb-2 flex items-center">
                <Sparkles className="h-5 w-5 mr-2" />
                CloudHub Credits
              </h3>
              <p className="text-sm sm:text-base text-white/90">
                Purchase credits to access additional features and services on the platform.
              </p>
            </div>
          </div>
          <div className="p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="group p-4 rounded-xl border border-slate-200 text-center hover:border-violet-200 hover:bg-violet-50 transition-all duration-300 hover:shadow-sm">
                <div className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">500 Credits</div>
                <div className="text-base sm:text-lg font-semibold text-violet-600 mb-2">AED 450</div>
                <div className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  10% discount
                </div>
              </div>
              <div className="group p-4 rounded-xl border border-violet-200 bg-violet-50 text-center shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105">
                <div className="text-2xl font-bold text-slate-900 mb-1">1,000 Credits</div>
                <div className="text-lg font-semibold text-violet-600 mb-2">AED 850</div>
                <div className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  15% discount
                </div>
              </div>
              <div className="group p-4 rounded-xl border border-slate-200 text-center hover:border-violet-200 hover:bg-violet-50 transition-all duration-300 hover:shadow-sm">
                <div className="text-2xl font-bold text-slate-900 mb-1">5,000 Credits</div>
                <div className="text-lg font-semibold text-violet-600 mb-2">AED 4,000</div>
                <div className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  20% discount
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
