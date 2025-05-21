"use client"

import { useUserRole } from "@/components/dashboard/user-role-context"
import HelpDashboard from "@/components/dashboard/help-dashboard"

export default function HelpPage() {
  return (
    <div className="flex flex-col h-full min-h-0 overflow-auto">
      <HelpDashboard />
    </div>
  )
} 