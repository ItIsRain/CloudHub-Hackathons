"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type UserRole = "participant" | "organizer"

interface UserRoleContextType {
  userRole: UserRole
  setUserRole: (role: UserRole) => void
  isOrganizer: boolean
  isParticipant: boolean
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined)

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>("participant")

  const value = {
    userRole,
    setUserRole,
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
