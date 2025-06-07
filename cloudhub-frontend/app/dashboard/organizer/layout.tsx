"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUserRole } from "@/components/dashboard/user-role-context"
import { useAuth } from "@/contexts/auth-context"

export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isOrganizer, isLoading: roleLoading } = useUserRole()
  const { user, isLoading: authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading && !roleLoading) {
      if (!user) {
        router.push("/login")
      } else if (!isOrganizer) {
        router.push("/dashboard")
      }
    }
  }, [user, isOrganizer, authLoading, roleLoading, router])

  // Show loading state while checking auth and role
  if (authLoading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Show nothing while redirecting
  if (!user || !isOrganizer) {
    return null
  }

  return <>{children}</>
} 