"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import DashboardSidebar from "@/components/dashboard/sidebar"
import DashboardHeader from "@/components/dashboard/header"
import { UserRoleProvider } from "@/components/dashboard/user-role-context"
import { Toaster } from "@/components/ui/toaster"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export default function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mounted, setMounted] = useState(false)
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Fix for initial scroll position
    window.scrollTo(0, 0)
    setMounted(true)
  }, [])

  // Auth guard - redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && (!user || !isAuthenticated)) {
      console.log('🔒 Dashboard: User not authenticated, redirecting to login')
      router.push('/login')
      return
    }
  }, [user, isAuthenticated, authLoading, router])

  // Show loading while checking auth
  if (authLoading || !mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Don't render dashboard if not authenticated
  if (!user || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <UserRoleProvider>
      <SidebarProvider defaultOpen={true} open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <div className="relative w-full min-h-screen bg-white">
          {/* Simplified background without animations */}
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-violet-100/10 to-indigo-100/10 rounded-full -z-10"></div>
          <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-gradient-to-tr from-indigo-100/10 to-violet-100/10 rounded-full -z-10"></div>
          
          <div className="flex w-full min-h-screen">
            <DashboardSidebar />
            <div className="flex flex-col flex-1 relative">
              <DashboardHeader />
              <main className="flex-1 w-full bg-white">
                <div className="min-h-full">
                  <div className="min-h-full rounded-xl">
                    {children}
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
        <Toaster />
      </SidebarProvider>
    </UserRoleProvider>
  )
} 