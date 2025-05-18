"use client"

import { useUserRole } from "@/components/dashboard/user-role-context"
import TeamsDashboard from "@/components/dashboard/teams-dashboard"

export default function TeamsPage() {
  return (
    <div className="flex flex-col h-full min-h-0 overflow-auto">
      <TeamsDashboard />
    </div>
  )
} 