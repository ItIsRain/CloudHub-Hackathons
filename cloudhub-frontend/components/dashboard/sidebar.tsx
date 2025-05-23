"use client"

import { SidebarGroupAction } from "@/components/ui/sidebar"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  Trophy,
  Users,
  Calendar,
  MessageSquare,
  Settings,
  HelpCircle,
  LogOut,
  PlusCircle,
  Sparkles,
  BarChart3,
  Award,
  FileText,
  Briefcase,
  Lightbulb,
  Gauge,
  Megaphone,
  Ticket,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import AnimatedGradientText from "../animated-gradient-text"
import { useUserRole } from "./user-role-context"
import { LucideIcon } from "lucide-react"
import Image from "next/image"

// Define the type for navigation items
interface NavItem {
  name: string
  href: string
  icon: LucideIcon
  badge?: string
}

export default function DashboardSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()
  const { isOrganizer } = useUserRole()

  // Check if a menu item is active based on the current path
  const isActive = (href: string) => {
    // Normalize paths by removing trailing slashes
    const normalizedPathname = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
    const normalizedHref = href.endsWith('/') ? href.slice(0, -1) : href
    
    // For the dashboard root, check if it's either /dashboard or /dashboard/
    if (normalizedHref === '/dashboard') {
      return normalizedPathname === '/dashboard'
    }
    // For other pages, check if pathname starts with href
    return normalizedPathname.startsWith(normalizedHref)
  }

  // Participant navigation items
  const participantNavItems: NavItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Marketplace", href: "/dashboard/marketplace", icon: Sparkles },
    { name: "My Hackathons", href: "/dashboard/my-hackathons", icon: Trophy },
    { name: "Teams", href: "/dashboard/teams", icon: Users },
    { name: "Resources", href: "/dashboard/resources", icon: Lightbulb },
    { name: "Messages", href: "/dashboard/messages", icon: MessageSquare, badge: "3" },
  ]

  // Organizer navigation items
  const organizerNavItems: NavItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Hackathons", href: "/dashboard/organizer/my-hackathons", icon: Sparkles },
    { name: "Participants", href: "/dashboard/organizer/participants", icon: Users },
    { name: "Judging", href: "/dashboard/organizer/judging", icon: Award },
    { name: "Announcements", href: "/dashboard/organizer/announcements", icon: Megaphone },
  ]

  const mainNavItems = isOrganizer ? organizerNavItems : participantNavItems

  // Secondary navigation items
  const secondaryNavItems: NavItem[] = [
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Help & Support", href: "/dashboard/help", icon: HelpCircle },
  ]

  return (
    <Sidebar className="border-r border-slate-100 bg-white/70 backdrop-blur-md shadow-sm">
      <SidebarHeader className="border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center justify-center h-16 px-4">
          <Link href="/dashboard" className="group flex items-center justify-center w-full py-2">
            <Image 
              src="/CloudHubV2.svg" 
              alt="CloudHub Logo" 
              width={200} 
              height={64}
            />
          </Link>
          <div className="md:hidden absolute right-4">
            <SidebarTrigger />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-slate-500">Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.href)} 
                    tooltip={item.name}
                    className={isActive(item.href) ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm font-medium' : ''}
                  >
                    <Link href={item.href} className="flex items-center gap-2 hover:bg-blue-50 transition-all rounded-md">
                      <item.icon className={`${isActive(item.href) ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'} transition-colors`} />
                      <span className={`${isActive(item.href) ? 'text-blue-700' : 'text-slate-700 hover:text-blue-700'} transition-colors`}>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.badge && (
                    <Badge className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#2684ff] hover:bg-blue-700 group-data-[collapsible=icon]:hidden">
                      {item.badge}
                    </Badge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isOrganizer ? (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-medium text-slate-500">Management</SidebarGroupLabel>
            <SidebarGroupAction>
              <div className="flex items-center justify-center">
                <Button variant="ghost" size="icon" className="h-5 w-5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full">
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </SidebarGroupAction>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    tooltip="AI Innovation Challenge"
                  >
                    <Link href="/dashboard/organizer/hackathons/ai-innovation-challenge" className="flex items-center gap-2 hover:bg-blue-50 transition-all rounded-md">
                      <div className="relative flex items-center justify-center h-5 w-5">
                        <div className="absolute inset-0 rounded-full bg-blue-100 opacity-40 hover:opacity-60 transition-opacity"></div>
                        <Sparkles className="h-3.5 w-3.5 text-blue-500 hover:text-blue-600 transition-colors" />
                      </div>
                      <span className="text-slate-700 hover:text-slate-900 transition-colors">AI Innovation Challenge</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    tooltip="Web3 Hackathon"
                  >
                    <Link href="/dashboard/hackathons/web3" className="flex items-center gap-2 hover:bg-blue-50 transition-all rounded-md">
                      <div className="relative flex items-center justify-center h-5 w-5">
                        <div className="absolute inset-0 rounded-full bg-blue-100 opacity-40 hover:opacity-60 transition-opacity"></div>
                        <Sparkles className="h-3.5 w-3.5 text-blue-500 hover:text-blue-600 transition-colors" />
                      </div>
                      <span className="text-slate-700 hover:text-slate-900 transition-colors">Web3 Hackathon</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : null}

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-slate-500">Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNavItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.href)} 
                    tooltip={item.name}
                    className={isActive(item.href) ? 'bg-slate-50 text-slate-900 shadow-sm font-medium' : ''}
                  >
                    <Link href={item.href} className="flex items-center gap-2 hover:bg-slate-50 transition-all rounded-md">
                      <item.icon className={`${isActive(item.href) ? 'text-slate-700' : 'text-slate-500 hover:text-slate-700'} transition-colors`} />
                      <span className={`${isActive(item.href) ? 'text-slate-900' : 'text-slate-700 hover:text-slate-900'} transition-colors`}>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-100 dark:border-slate-700 mt-auto">
        <div className="p-4">
          <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
            <Avatar className="h-9 w-9 border border-slate-100 shadow-sm">
              <AvatarImage src="/placeholder.svg?height=36&width=36" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="group-data-[collapsible=icon]:hidden">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{isOrganizer ? "Organizer" : "Participant"}</p>
            </div>
          </div>

          <div className="mt-4 group-data-[collapsible=icon]:hidden">
            <Button variant="outline" size="sm" className="w-full justify-start text-slate-600 dark:text-slate-400 border-slate-100 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}