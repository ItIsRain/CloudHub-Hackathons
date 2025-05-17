import { Metadata } from "next"
import DashboardLayoutClient from "@/components/dashboard/dashboard-layout-client"

export const metadata: Metadata = {
  title: "CloudHub | Dashboard",
  description: "Manage your hackathons, track submissions, and connect with the CloudHub community."
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>
}
