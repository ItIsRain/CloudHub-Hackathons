"use client"

import { useUserRole } from "@/components/dashboard/user-role-context"
import ParticipantDashboard from "@/components/dashboard/participant-dashboard"
import OrganizerDashboard from "@/components/dashboard/organizer-dashboard"

export default function DashboardPage() {
  const { isOrganizer } = useUserRole()
  
  return (
    <div className="flex flex-col h-full min-h-0 overflow-auto">
      {isOrganizer ? (
        <OrganizerDashboard />
      ) : (
        <ParticipantDashboard />
      )}
    </div>
  )
}