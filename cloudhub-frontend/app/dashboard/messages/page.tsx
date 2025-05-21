"use client"

import { useUserRole } from "@/components/dashboard/user-role-context"
import MessagesDashboard from "@/components/dashboard/messages-dashboard"

export default function MessagesPage() {
  return (
    <div className="flex flex-col h-full min-h-0 overflow-auto">
      <MessagesDashboard />
    </div>
  )
} 