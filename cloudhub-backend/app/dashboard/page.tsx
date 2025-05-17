"use client"

import { useUserRole } from "@/components/dashboard/user-role-context"
import HackathonMarketplace from "@/components/dashboard/hackathon-marketplace"

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full min-h-0 overflow-auto">
      <HackathonMarketplace />
    </div>
  )
}