"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import AnimatedGradientText from "./animated-gradient-text"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)

      // Update active section based on scroll position
      const sections = ["home", "features", "pricing", "mentors"]
      const currentSection = sections.find((section) => {
        if (section === "home" && window.scrollY < 300) return true
        const element = document.getElementById(section)
        if (!element) return false
        const rect = element.getBoundingClientRect()
        return rect.top <= 100 && rect.bottom >= 100
      })

      if (currentSection) {
        setActiveSection(currentSection)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-slate-200/50" : "bg-transparent",
      )}
    >
      <div className="container mx-auto flex h-16 sm:h-20 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="group">
            <Image
              src={scrolled ? "/CloudHub.svg" : "/CloudHubDark.svg"}
              alt="CloudHub Logo"
              width={150}
              height={40}
              className="transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
        </div>

        {/* Desktop Navigation - Centered */}
        <nav className="hidden md:flex items-center absolute left-1/2 transform -translate-x-1/2 space-x-8">
          {[
            { name: "Home", href: "#home" },
            { name: "Features", href: "#features" },
            { name: "Mentors", href: "#mentors" },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "relative px-1 py-2 text-sm font-medium transition-all duration-300",
                activeSection === item.href.substring(1)
                  ? scrolled
                    ? "text-violet-700"
                    : "text-white"
                  : scrolled
                    ? "text-slate-600 hover:text-violet-700"
                    : "text-white/80 hover:text-white",
              )}
            >
              {item.name}
              {activeSection === item.href.substring(1) && (
                <span
                  className={cn(
                    "absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-all duration-300",
                    scrolled ? "bg-violet-600" : "bg-white",
                  )}
                ></span>
              )}
            </Link>
          ))}
        </nav>

        {/* Right Side Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className={cn(
              "rounded-full px-5 transition-all duration-300",
              scrolled
                ? "text-violet-600 hover:text-white hover:bg-violet-600"
                : "text-white/90 hover:text-white hover:bg-white/20",
            )}
          >
            <Link href="/dashboard/marketplace">
              Explore Hackathons
            </Link>
          </Button>
          <Button
            size="sm"
            asChild
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-full px-5 shadow-md shadow-violet-600/20 hover:shadow-violet-600/40 transition-all duration-300"
          >
            <Link href="/dashboard">
              Dashboard
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center justify-center h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X size={20} className={scrolled ? "text-slate-900" : "text-white"} />
          ) : (
            <Menu size={20} className={scrolled ? "text-slate-900" : "text-white"} />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200/50 shadow-lg">
          <div className="container mx-auto px-4 py-6 space-y-1">
            {[
              { name: "Home", href: "#home" },
              { name: "Features", href: "#features" },
              { name: "Pricing", href: "#pricing" },
              { name: "Mentors", href: "#mentors" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center justify-center py-3 px-4 rounded-xl text-base font-medium transition-colors",
                  activeSection === item.href.substring(1)
                    ? "bg-violet-50 text-violet-700"
                    : "text-slate-700 hover:bg-slate-50 hover:text-violet-600",
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 space-y-3">
              <Button
                variant="outline"
                asChild
                className="w-full py-6 h-auto text-base rounded-xl border-slate-200 text-violet-600 hover:text-white hover:bg-violet-600 hover:border-violet-600"
              >
                <Link href="/dashboard/marketplace">
                  Explore Hackathons
                </Link>
              </Button>
              <Button 
                asChild
                className="w-full py-6 h-auto text-base bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-xl shadow-md shadow-violet-600/20"
              >
                <Link href="/dashboard">
                  Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}