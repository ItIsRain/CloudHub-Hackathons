"use client"

import { useUserRole } from "@/components/dashboard/user-role-context"
import ParticipantDashboard from "@/components/dashboard/participant-dashboard"

export default function ParticipantPage() {
  return (
    <div className="flex flex-col h-full min-h-0 overflow-auto">
      <ParticipantDashboard />
    </div>
  )
} 