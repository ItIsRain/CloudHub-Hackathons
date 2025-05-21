"use client"

import { useUserRole } from "@/components/dashboard/user-role-context"
import SettingsDashboard from "@/components/dashboard/settings-dashboard"

export default function SettingsPage() {
  return (
    <div className="flex flex-col h-full min-h-0 overflow-auto">
      <SettingsDashboard />
    </div>
  )
} 