import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import Footer from "@/components/footer"

// Dynamically import non-critical components with loading fallbacks
const FeaturesSection = dynamic(() => import("@/components/features-section"), {
  loading: () => <div className="min-h-[40vh] bg-slate-100/50 animate-pulse"></div>,
  ssr: true
})

const MentorSection = dynamic(() => import("@/components/mentor-section"), {
  loading: () => <div className="min-h-[40vh] bg-slate-100/50 animate-pulse"></div>,
  ssr: true
})

const CtaSection = dynamic(() => import("@/components/cta-section"), {
  loading: () => <div className="min-h-[20vh] bg-slate-100/50 animate-pulse"></div>,
  ssr: true
})

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main>
        {/* Critical content loaded immediately */}
        <HeroSection />
        
        {/* Non-critical content loaded dynamically */}
        <Suspense fallback={<div className="min-h-[40vh] bg-slate-100/50 animate-pulse"></div>}>
          <FeaturesSection />
        </Suspense>
        
        <Suspense fallback={<div className="min-h-[40vh] bg-slate-100/50 animate-pulse"></div>}>
          <MentorSection />
        </Suspense>
        
        <Suspense fallback={<div className="min-h-[20vh] bg-slate-100/50 animate-pulse"></div>}>
          <CtaSection />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
