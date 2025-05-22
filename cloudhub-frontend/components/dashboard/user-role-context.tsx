"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type UserRole = "participant" | "organizer"

interface UserRoleContextType {
  userRole: UserRole
  isOrganizer: boolean
  isParticipant: boolean
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined)

// In a real application, this would be fetched from a backend API after authentication
const MOCK_USER_ROLE: UserRole = "organizer"

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>(MOCK_USER_ROLE)

  // In a real app, this would be an API call to fetch the user's role
  useEffect(() => {
    // Simulating API call with a mock role
    // In production, this would be replaced with actual authentication logic
    setUserRole(MOCK_USER_ROLE)
  }, [])

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
