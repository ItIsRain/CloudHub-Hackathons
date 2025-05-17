"use client"

import { useState } from "react"
import { Bell, Plus, ChevronDown, Settings, LogOut, User, Link as LinkIcon } from "lucide-react"
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

export default function DashboardHeader() {
  const [notifications] = useState(3)
  const { userRole, setUserRole, isOrganizer } = useUserRole()
  const pathname = usePathname()
  const [joinDialogOpen, setJoinDialogOpen] = useState(false)
  const [inviteCode, setInviteCode] = useState("")
  const [inviteLink, setInviteLink] = useState("")

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
      console.log("Joining with code:", inviteCode)
    } else if (inviteLink) {
      console.log("Joining with link:", inviteLink)
    }
    setJoinDialogOpen(false)
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-100 bg-white/70 backdrop-blur-md px-4 sm:px-6 shadow-sm">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>

      <div className="hidden md:flex md:flex-1 md:items-center md:gap-4 md:overflow-hidden">
        <div className="flex flex-1 items-center gap-2">
          <h1 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">{getPageTitle()}</h1>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-end md:gap-4">
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-slate-100 p-1 px-3 rounded-full shadow-sm">
            <Label
              htmlFor="role-toggle"
              className={`text-xs ${!isOrganizer ? "font-medium text-[#2684ff]" : "text-slate-600"}`}
            >
              Participant
            </Label>
            <Switch
              id="role-toggle"
              checked={isOrganizer}
              onCheckedChange={(checked) => setUserRole(checked ? "organizer" : "participant")}
              className="data-[state=checked]:bg-[#2684ff]"
            />
            <Label
              htmlFor="role-toggle"
              className={`text-xs ${isOrganizer ? "font-medium text-[#2684ff]" : "text-slate-600"}`}
            >
              Organizer
            </Label>
          </div>

          {isOrganizer ? (
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex items-center gap-1 text-slate-700 border border-slate-100 bg-white/80 backdrop-blur-sm shadow-sm hover:bg-blue-50 hover:text-[#2684ff] hover:border-blue-200 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>New Hackathon</span>
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
                  <AvatarImage src="/placeholder.svg?height=24&width=24" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline-block">John Doe</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white/90 backdrop-blur-md border-slate-100 shadow-md">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="hover:bg-slate-50 hover:text-slate-900 cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-slate-50 hover:text-slate-900 cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="md:hidden hover:bg-slate-50 hover:text-slate-900 cursor-pointer">
                <div className="flex items-center w-full justify-between">
                  <span>Switch to {isOrganizer ? "Participant" : "Organizer"}</span>
                  <Switch
                    checked={isOrganizer}
                    onCheckedChange={(checked) => setUserRole(checked ? "organizer" : "participant")}
                    className="data-[state=checked]:bg-[#2684ff]"
                  />
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="md:hidden" />
              <DropdownMenuItem className="hover:bg-red-50 hover:text-red-600 cursor-pointer">
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
