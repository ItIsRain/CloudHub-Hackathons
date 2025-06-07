"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"

type UserRoleContextType = {
  isOrganizer: boolean
  isLoading: boolean
}

const UserRoleContext = createContext<UserRoleContextType>({
  isOrganizer: false,
  isLoading: true
})

export function UserRoleProvider({ children }: { children: React.ReactNode }) {
  const [isOrganizer, setIsOrganizer] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    const checkRole = async () => {
      // If no user or not authenticated, don't make API calls
      if (!user || !isAuthenticated) {
        setIsOrganizer(false)
        setIsLoading(false)
        return
      }

      // Check if we have a valid token before making the API call
      const token = localStorage.getItem("access_token")
      if (!token) {
        setIsOrganizer(false)
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch("http://localhost:8000/api/auth/check-role", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setIsOrganizer(data.role === "organizer")
        } else if (response.status === 401) {
          // Token is invalid, don't retry and clear state
          console.log("🔒 Role check failed: Token invalid")
          setIsOrganizer(false)
        } else {
          setIsOrganizer(false)
        }
      } catch (error) {
        console.error("Error checking role:", error)
        setIsOrganizer(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkRole()
  }, [user, isAuthenticated])

  // Reset state immediately when user becomes null
  useEffect(() => {
    if (!user || !isAuthenticated) {
      setIsOrganizer(false)
      setIsLoading(false)
    }
  }, [user, isAuthenticated])

  return (
    <UserRoleContext.Provider value={{ isOrganizer, isLoading }}>
      {children}
    </UserRoleContext.Provider>
  )
}

export function useUserRole() {
  return useContext(UserRoleContext)
}
