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
  const { user } = useAuth()

  useEffect(() => {
    const checkRole = async () => {
      if (!user) {
        setIsOrganizer(false)
        setIsLoading(false)
        return
      }

      try {
        const token = localStorage.getItem("access_token")
        const response = await fetch("http://localhost:8000/api/auth/check-role", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setIsOrganizer(data.role === "organizer")
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
  }, [user])

  return (
    <UserRoleContext.Provider value={{ isOrganizer, isLoading }}>
      {children}
    </UserRoleContext.Provider>
  )
}

export function useUserRole() {
  return useContext(UserRoleContext)
}
