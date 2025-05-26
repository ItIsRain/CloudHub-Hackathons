"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useAuth } from "@/lib/auth"

type UserRole = "organizer" | "participant" | "judge" | "mentor" | "media"

type UserRoleContextType = {
  userRole: UserRole
  isOrganizer: boolean
  isParticipant: boolean
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined)

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [userRole, setUserRole] = useState<UserRole>("participant") // Default to participant

  useEffect(() => {
    if (user?.role) {
      setUserRole(user.role as UserRole)
    }
  }, [user])

  const value = {
    userRole,
    isOrganizer: userRole === "organizer",
    isParticipant: userRole === "participant",
  }

  return <UserRoleContext.Provider value={value}>{children}</UserRoleContext.Provider>
}

export function useUserRole() {
  const context = useContext(UserRoleContext)
  if (context === undefined) {
    throw new Error("useUserRole must be used within a UserRoleProvider")
  }
  return context
}
