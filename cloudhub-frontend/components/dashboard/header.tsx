"use client"

import { useState } from "react"
import { Bell, Plus, ChevronDown, Settings, LogOut, User, Link as LinkIcon, SidebarOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUserRole } from "./user-role-context"
import { usePathname } from "next/navigation"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useScrollHandler } from "@/hooks/use-scroll-handler"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useAuth } from '@/contexts/auth-context'

export default function DashboardHeader() {
  const [notifications] = useState(3)
  const { userRole, isOrganizer, isParticipant } = useUserRole()
  const pathname = usePathname()
  const [joinDialogOpen, setJoinDialogOpen] = useState(false)
  const [inviteCode, setInviteCode] = useState("")
  const [inviteLink, setInviteLink] = useState("")
  const { isSticky, scrollY } = useScrollHandler()
  const { user, logout } = useAuth()

  // Get page title based on pathname
  const getPageTitle = () => {
    const path = pathname.split("/").filter(Boolean)
    if (path.length === 1) return "Dashboard"

    // Convert path to title case
    const lastSegment = path[path.length - 1]
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace(/-/g, " ")
  }

  const handleJoinHackathon = () => {
    // Here you can implement the actual logic to join the hackathon
    if (inviteCode) {
      // Remove this line:
      // console.log("Joining with code:", inviteCode)
    } else if (inviteLink) {
      // Remove this line:
      // console.log("Joining with link:", inviteLink)
    }
    setJoinDialogOpen(false)
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white/70 px-4 backdrop-blur-md transition-all duration-200 dark:border-slate-700 dark:bg-slate-900/80",
        isSticky && scrollY > 0 && "border-b shadow-sm"
      )}
    >
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="md:hidden">
          <SidebarOpen className="h-5 w-5" />
        </Button>
        <div className="relative hidden md:flex">
          <span className="font-medium text-slate-700">
            {isOrganizer ? "Organizer Dashboard" : "Participant Dashboard"}
          </span>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-end md:gap-4">
        <div className="flex items-center gap-3">
          {isOrganizer ? (
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex items-center gap-1 text-slate-700 border border-slate-100 bg-white/80 backdrop-blur-sm shadow-sm hover:bg-blue-50 hover:text-[#2684ff] hover:border-blue-200 transition-all"
              asChild
            >
              <Link href="/dashboard/organizer/my-hackathons">
                <Plus className="h-4 w-4" />
                <span>New Hackathon</span>
              </Link>
            </Button>
          ) : (
            <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:flex items-center gap-1 text-slate-700 border border-slate-100 bg-white/80 backdrop-blur-sm shadow-sm hover:bg-blue-50 hover:text-[#2684ff] hover:border-blue-200 transition-all"
                >
                  <Plus className="h-4 w-4" />
                  <span>Join Hackathon</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl">Join a Hackathon</DialogTitle>
                  <DialogDescription>
                    Enter an invite code or paste an invite link to join a hackathon.
                  </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="code" className="w-full mt-2">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="code">Invite Code</TabsTrigger>
                    <TabsTrigger value="link">Invite Link</TabsTrigger>
                  </TabsList>
                  <TabsContent value="code" className="mt-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="invite-code">Enter invite code</Label>
                        <Input
                          id="invite-code"
                          value={inviteCode}
                          onChange={(e) => setInviteCode(e.target.value)}
                          placeholder="e.g. HUB-2025-ABC123"
                          className="w-full"
                        />
                      </div>
                      <p className="text-xs text-slate-500">
                        The invite code is typically a unique alphanumeric code shared by the hackathon organizers.
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="link" className="mt-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="invite-link">Paste invite link</Label>
                        <div className="flex items-center space-x-2">
                          <div className="relative flex-1">
                            <LinkIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                            <Input
                              id="invite-link"
                              value={inviteLink}
                              onChange={(e) => setInviteLink(e.target.value)}
                              placeholder="https://hub.lynq.ae/invite/..."
                              className="pl-8 w-full"
                            />
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500">
                        Paste the full invite link shared by the hackathon organizers.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={() => setJoinDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    type="button" 
                    onClick={handleJoinHackathon}
                    disabled={!inviteCode && !inviteLink}
                    className="bg-[#2684ff] hover:bg-blue-600"
                  >
                    Join Hackathon
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative h-8 w-8 border-slate-100 bg-white/80 backdrop-blur-sm shadow-sm hover:bg-blue-50 hover:text-[#2684ff] hover:border-blue-200 transition-all"
              >
                <Bell className="h-4 w-4" />
                {notifications > 0 && (
                  <Badge
                    className="absolute -top-1 -right-1 h-4 min-w-4 p-0 flex items-center justify-center text-[10px] bg-[#2684ff] border-white border"
                    aria-hidden="true"
                  >
                    {notifications}
                  </Badge>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-white/90 backdrop-blur-md border-slate-100 shadow-md">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                {[...Array(3)].map((_, i) => (
                  <DropdownMenuItem key={i} className="cursor-pointer py-3 hover:bg-slate-50">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8 border border-slate-100 shadow-sm">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none">
                          {["New team member joined", "Hackathon submission reminder", "Mentor session scheduled"][i]}
                        </p>
                        <p className="text-xs text-slate-500">{["2 minutes ago", "1 hour ago", "Yesterday"][i]}</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer justify-center text-sm font-medium text-[#2684ff] hover:text-blue-700 hover:bg-blue-50">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="relative h-8 gap-1 text-slate-700 hover:bg-blue-50 hover:text-[#2684ff] transition-all"
              >
                <Avatar className="h-6 w-6 border border-slate-100 shadow-sm">
                  <AvatarImage src={user?.avatar || '/default-avatar.png'} alt={user?.full_name || 'User'} />
                  <AvatarFallback>{user?.full_name ? user.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : 'U'}</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline-block">{user?.full_name || 'Loading...'}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white/90 backdrop-blur-md border-slate-100 shadow-md">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.full_name || 'Loading...'}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email || ''}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="hover:bg-slate-50 hover:text-slate-900 cursor-pointer">
                <Link href="/dashboard/profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="hover:bg-slate-50 hover:text-slate-900 cursor-pointer">
                <Link href="/dashboard/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={logout}
                className="hover:bg-red-50 hover:text-red-600 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
