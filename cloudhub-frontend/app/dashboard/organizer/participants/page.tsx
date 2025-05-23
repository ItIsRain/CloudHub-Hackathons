"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Search, 
  Filter, 
  Mail, 
  Users, 
  UserPlus, 
  Award, 
  Trophy, 
  ArrowUpDown,
  MessageCircle,
  BarChart2,
  User,
  Trash2,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  BellRing,
  ChevronRight,
  ChevronUp,
  MessageSquare,
  Settings,
  Clock
} from "lucide-react"
import Link from "next/link"
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { CheckedState } from "@radix-ui/react-checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function ParticipantsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState("all")
  const [hackathonFilter, setHackathonFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name-asc")
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")
  const [manageDialogOpen, setManageDialogOpen] = useState(false)
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null)
  const [newStatus, setNewStatus] = useState("")
  const [statusNote, setStatusNote] = useState("")

  // Dummy data for participants
  const participants = [
    {
      id: "1",
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      avatar: "/placeholder.svg?height=40&width=40&text=AJ",
      hackathons: ["AI Innovation Challenge", "Web3 Hackathon"],
      submissions: 3,
      badges: ["Top Contributor", "AI Expert"],
      status: "active",
      joinDate: "2025-01-15",
      skills: ["React", "Python", "TensorFlow"],
      teamId: "team-1",
      teamName: "Neural Ninjas",
    },
    {
      id: "2",
      name: "Maria Garcia",
      email: "maria.garcia@example.com",
      avatar: "/placeholder.svg?height=40&width=40&text=MG",
      hackathons: ["AI Innovation Challenge"],
      submissions: 1,
      badges: ["First-time Participant"],
      status: "inactive",
      joinDate: "2025-03-10",
      skills: ["UI/UX", "Figma", "JavaScript"],
      teamId: "team-1",
      teamName: "Neural Ninjas",
    },
    {
      id: "3",
      name: "Jamal Williams",
      email: "jamal.williams@example.com",
      avatar: "/placeholder.svg?height=40&width=40&text=JW",
      hackathons: ["Web3 Hackathon"],
      submissions: 2,
      badges: ["Blockchain Enthusiast"],
      status: "left",
      joinDate: "2025-02-20",
      skills: ["Solidity", "Ethereum", "JavaScript"],
      teamId: "team-2",
      teamName: "Blockchain Builders",
    },
    {
      id: "4",
      name: "Sarah Chen",
      email: "sarah.chen@example.com",
      avatar: "/placeholder.svg?height=40&width=40&text=SC",
      hackathons: ["AI Innovation Challenge", "Web3 Hackathon"],
      submissions: 4,
      badges: ["Top Contributor", "Multiple Winner"],
      status: "disqualified",
      joinDate: "2025-01-05",
      skills: ["Python", "Deep Learning", "Cloud Computing"],
      teamId: "team-3",
      teamName: "Data Wizards",
    },
    {
      id: "5",
      name: "Ahmed Patel",
      email: "ahmed.patel@example.com",
      avatar: "/placeholder.svg?height=40&width=40&text=AP",
      hackathons: ["Mobile App Innovation"],
      submissions: 1,
      badges: ["Mobile Dev"],
      status: "active",
      joinDate: "2025-03-25",
      skills: ["Swift", "Kotlin", "Flutter"],
      teamId: "team-4",
      teamName: "App Avengers",
    },
  ]

  // Filter participants based on search and filters
  const filteredParticipants = participants.filter((participant) => {
    const matchesSearch = 
      participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      participant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      participant.teamName.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || participant.status === statusFilter
    
    const matchesHackathon = hackathonFilter === "all" || 
      participant.hackathons.some(h => h.toLowerCase() === hackathonFilter.toLowerCase())
    
    return matchesSearch && matchesStatus && matchesHackathon
  })

  // Sort participants
  const sortedParticipants = [...filteredParticipants].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name)
      case "name-desc":
        return b.name.localeCompare(a.name)
      case "date-asc":
        return new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime()
      case "date-desc":
        return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()
      case "submissions-asc":
        return a.submissions - b.submissions
      case "submissions-desc":
        return b.submissions - a.submissions
      default:
        return 0
    }
  })

  // Handle participant selection
  const toggleParticipantSelection = (id: string, checked: CheckedState) => {
    if (checked === true) {
      setSelectedParticipants(prev => [...prev, id]);
    } else if (checked === false) {
      setSelectedParticipants(prev => prev.filter(participantId => participantId !== id));
    }
  }

  // Handle toggle of all participants
  const toggleAllParticipants = (checked: CheckedState) => {
    if (checked === true) {
      setSelectedParticipants(filteredParticipants.map(p => p.id));
    } else {
      setSelectedParticipants([]);
    }
  }

  // Hackathon options for filter
  const hackathonOptions = [
    { value: "all", label: "All Hackathons" },
    { value: "AI Innovation Challenge", label: "AI Innovation Challenge" },
    { value: "Web3 Hackathon", label: "Web3 Hackathon" },
    { value: "Mobile App Innovation", label: "Mobile App Innovation" },
  ]

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Define isAllSelected 
  const isAllSelected = 
    filteredParticipants.length > 0 && 
    selectedParticipants.length === filteredParticipants.length;

  // Function to handle participant status change
  const handleStatusChange = () => {
    // Here you would typically make an API call to update the participant's status
    if (selectedParticipant && newStatus) {
      // Update participant status in your data
      const updatedParticipants = participants.map(p => 
        p.id === selectedParticipant.id 
          ? { ...p, status: newStatus }
          : p
      )
      // Update your state/data here
      console.log('Status updated:', { participant: selectedParticipant.name, newStatus, note: statusNote })
      setManageDialogOpen(false)
      setNewStatus("")
      setStatusNote("")
    }
  }

  // Function to open manage dialog
  const openManageDialog = (participant: any) => {
    setSelectedParticipant(participant)
    setNewStatus(participant.status)
    setManageDialogOpen(true)
  }

  return (
    <div className="space-y-8 pb-10 px-6 pt-6">
      {/* Modern Header Section with Stats */}
      <div className="relative overflow-hidden rounded-2xl shadow-lg mt-6 mb-8">
        {/* Gradient background with animated elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/20"></div>
        
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-1/3 h-4/5 bg-gradient-to-b from-white/10 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-2/3 h-1/2 bg-gradient-to-t from-blue-400/10 to-transparent rounded-full blur-3xl"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-[10%] w-12 h-12 rounded-full bg-blue-500/10 backdrop-blur-md border border-white/10"></div>
        <div className="absolute bottom-1/4 right-[15%] w-20 h-20 rounded-full bg-violet-500/10 backdrop-blur-md border border-white/10"></div>
          
        <div className="relative p-8 sm:p-10">
          <div className="grid gap-6 md:grid-cols-2 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-1.5 rounded-full mb-5 text-white text-sm border border-white/20 shadow-xl">
                <Users className="h-4 w-4 text-blue-200" />
                <span className="font-medium tracking-wide">Participant Management</span>
              </div>
              
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-3 tracking-tight">Participants Dashboard</h1>
              
              <p className="text-white/90 text-lg mb-6 max-w-lg font-light">
                Manage hackathon participants, track team formations, and analyze participation metrics.
              </p>
              
              <div className="space-x-2">
                <Button 
                  className="bg-white text-indigo-700 hover:bg-white/90 shadow-lg transition-all group px-5 py-2 h-auto text-sm font-medium rounded-xl border border-white/50"
                  disabled={selectedParticipants.length === 0}
                >
                  <Mail className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  Email Selected
                </Button>
                <Button className="bg-white/10 backdrop-blur-md text-white border border-white/25 hover:bg-white/20 shadow-lg transition-all group px-5 py-2 h-auto text-sm font-medium rounded-xl">
                  <UserPlus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  Invite Participants
                </Button>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 text-center shadow-xl">
                  <h3 className="text-3xl font-bold text-white">{participants.length}</h3>
                  <p className="text-xs text-white/80 mt-1">Total Participants</p>
                  <div className="text-xs text-emerald-300 mt-2 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-emerald-400/30 flex items-center justify-center mr-1">
                      <span className="text-[8px]">↑</span>
                    </div>
                    +12% from last month
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 text-center shadow-xl">
                  <h3 className="text-3xl font-bold text-white">4</h3>
                  <p className="text-xs text-white/80 mt-1">Active Teams</p>
                  <div className="text-xs text-emerald-300 mt-2 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-emerald-400/30 flex items-center justify-center mr-1">
                      <span className="text-[8px]">+</span>
                    </div>
                    2 new teams this week
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 text-center shadow-xl">
                  <h3 className="text-3xl font-bold text-white">{participants.reduce((sum, p) => sum + p.submissions, 0)}</h3>
                  <p className="text-xs text-white/80 mt-1">Total Submissions</p>
                  <div className="text-xs text-blue-300 mt-2 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-blue-400/30 flex items-center justify-center mr-1">
                      <span className="text-[8px]">!</span>
                    </div>
                    5 pending review
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 text-center shadow-xl">
                  <h3 className="text-3xl font-bold text-white">86%</h3>
                  <p className="text-xs text-white/80 mt-1">Completion Rate</p>
                  <div className="text-xs text-emerald-300 mt-2 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-emerald-400/30 flex items-center justify-center mr-1">
                      <span className="text-[8px]">↑</span>
                    </div>
                    4% from previous
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input 
            placeholder="Search participants..." 
            className="pl-9 bg-white border-slate-200 shadow-sm focus:border-blue-300 focus:ring-blue-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={hackathonFilter} onValueChange={setHackathonFilter}>
          <SelectTrigger className="w-full sm:w-[200px] bg-white border-slate-200 shadow-sm focus:border-blue-300 focus:ring-blue-200">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-slate-500" />
              <SelectValue placeholder="Filter by hackathon" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {hackathonOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px] bg-white border-slate-200 shadow-sm focus:border-blue-300 focus:ring-blue-200">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-500" />
              <SelectValue placeholder="Filter by status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="disqualified">Disqualified</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Participants Table */}
      <Card className="border-slate-200 shadow-lg overflow-hidden rounded-xl mt-6 bg-white/50 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 border-b border-indigo-100/50 p-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg font-semibold bg-gradient-to-r from-slate-800 to-indigo-600 bg-clip-text text-transparent">
                Participants
              </CardTitle>
              <CardDescription className="text-sm text-slate-600 mt-1">
                {selectedParticipants.length > 0 ? (
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-indigo-500"></span>
                    <span>{selectedParticipants.length} selected out of {participants.length} participants</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-slate-400" />
                    <span>Manage all {participants.length} participants</span>
                  </div>
                )}
              </CardDescription>
            </div>
            {selectedParticipants.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedParticipants([])} 
                className="text-xs h-8 border-indigo-200 text-indigo-700 hover:bg-indigo-50 shadow-sm group transition-all duration-200"
              >
                <XCircle className="h-3.5 w-3.5 mr-1.5 group-hover:rotate-90 transition-transform duration-200" />
                Clear Selection
              </Button>
            )}
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gradient-to-r from-slate-50/90 via-blue-50/90 to-indigo-50/90 backdrop-blur-sm sticky top-0 z-10">
              <TableRow className="border-b border-indigo-100/50 hover:bg-transparent">
                <TableHead className="w-12 text-center">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={toggleAllParticipants}
                    aria-label="Select all participants"
                    className="rounded-sm data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                  />
                </TableHead>
                {[
                  { label: "Participant", field: "name" },
                  { label: "Team", field: "teamName" },
                  { label: "Hackathon", field: "hackathons" },
                  { label: "Submissions", field: "submissions" },
                  { label: "Status", field: "status" },
                  { label: "Joined", field: "joinDate" }
                ].map((column) => (
                  <TableHead key={column.field} className="px-4 py-3 font-medium">
                    <button 
                      onClick={() => handleSort(column.field)}
                      className="flex items-center gap-1.5 text-slate-800 font-semibold text-sm hover:text-indigo-700 transition-colors group"
                    >
                      {column.label}
                      <ChevronUp className={cn(
                        "h-4 w-4 text-slate-400 transition-transform duration-200 ease-in-out opacity-0 group-hover:opacity-100",
                        sortField === column.field && "opacity-100",
                        sortField === column.field && sortDirection === "desc" && "rotate-180"
                      )} />
                    </button>
                  </TableHead>
                ))}
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParticipants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center gap-2 p-6">
                      <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                        <Users className="h-6 w-6 text-slate-400" />
                      </div>
                      <p className="text-slate-500 text-sm font-medium">No participants found</p>
                      <p className="text-slate-400 text-xs mt-1">Try adjusting your search or filters</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredParticipants.map((participant) => (
                  <TableRow 
                    key={participant.id} 
                    className="group border-b border-slate-100 last:border-0 hover:bg-gradient-to-r hover:from-slate-50 hover:to-indigo-50/30 transition-all duration-200"
                  >
                    <TableCell className="text-center">
                      <Checkbox
                        checked={selectedParticipants.includes(participant.id)}
                        onCheckedChange={(checked) => {
                          toggleParticipantSelection(participant.id, checked)
                        }}
                        aria-label={`Select ${participant.name}`}
                        className="rounded-sm data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 transition-all duration-200"
                      />
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-slate-200 shadow-sm ring-2 ring-white">
                          <AvatarImage src={participant.avatar} alt={participant.name} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-indigo-700 font-medium">
                            {participant.name.charAt(0)}{participant.name.split(' ')[1]?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium text-slate-800 group-hover:text-indigo-600 transition-colors">
                            {participant.name}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                            <Mail className="h-3 w-3" />
                            {participant.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="px-3 py-1.5 rounded-lg bg-gradient-to-br from-slate-50 to-indigo-50 inline-flex items-center gap-2 border border-indigo-100 text-sm font-medium text-slate-700 group-hover:border-indigo-200 transition-all duration-200">
                        <Users className="h-3.5 w-3.5 text-indigo-500" />
                        {participant.teamName}
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex flex-col gap-1">
                        {participant.hackathons.map((hackathon, index) => (
                          <span 
                            key={index} 
                            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-md bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 border border-indigo-100 group-hover:border-indigo-200 transition-all duration-200"
                          >
                            <Trophy className="h-3 w-3 text-indigo-500" />
                            {hackathon}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                          <Trophy className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-700">{participant.submissions}</span>
                          <span className="text-xs text-slate-500">submissions</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200",
                          {
                            "bg-emerald-50 text-emerald-700 border border-emerald-200 group-hover:bg-emerald-100/50": participant.status === "active",
                            "bg-red-50 text-red-700 border border-red-200 group-hover:bg-red-100/50": participant.status === "inactive",
                            "bg-slate-50 text-slate-700 border border-slate-200 group-hover:bg-slate-100/50": participant.status === "left",
                            "bg-orange-50 text-orange-700 border border-orange-200 group-hover:bg-orange-100/50": participant.status === "disqualified"
                          }
                        )}>
                          <div className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            {
                              "bg-emerald-500": participant.status === "active",
                              "bg-red-500": participant.status === "inactive",
                              "bg-slate-500": participant.status === "left",
                              "bg-orange-500": participant.status === "disqualified"
                            }
                          )} />
                          {participant.status.charAt(0).toUpperCase() + participant.status.slice(1)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-700">{participant.joinDate}</span>
                        <span className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {participant.hackathons[0] === "AI Innovation Challenge" ? "2 days ago" : "1 week ago"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 p-1.5">
                            <DropdownMenuItem 
                              className="flex items-center gap-2 cursor-pointer px-3 py-2 hover:bg-indigo-50 text-sm text-slate-700 hover:text-indigo-700 rounded-md transition-colors"
                              onClick={() => openManageDialog(participant)}
                            >
                              <Settings className="h-3.5 w-3.5" />
                              <span>Manage Participant</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer px-3 py-2 hover:bg-indigo-50 text-sm text-slate-700 hover:text-indigo-700 rounded-md transition-colors">
                              <User className="h-3.5 w-3.5" />
                              <span>View Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer px-3 py-2 hover:bg-indigo-50 text-sm text-slate-700 hover:text-indigo-700 rounded-md transition-colors">
                              <MessageSquare className="h-3.5 w-3.5" />
                              <span>Send Message</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer px-3 py-2 hover:bg-indigo-50 text-sm text-slate-700 hover:text-indigo-700 rounded-md transition-colors">
                              <Award className="h-3.5 w-3.5" />
                              <span>Assign Badge</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Stats and Insights Cards */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {/* Participant Analytics Card */}
        <Card className="border-slate-200 shadow-md overflow-hidden rounded-xl h-full flex flex-col">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-100 border-b border-indigo-200 p-5 flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-800">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                <BarChart2 className="h-4 w-4 text-white" />
              </div>
              <span>Participant Analytics</span>
            </CardTitle>
            <Button variant="ghost" size="sm" className="h-8 border border-blue-200 text-blue-700 hover:bg-blue-50 shadow-sm">
              <BarChart2 className="h-4 w-4 mr-2" />
              <span className="text-xs font-medium">View Detailed</span>
            </Button>
          </CardHeader>
          <CardContent className="p-6 flex-1">
            <div className="grid grid-cols-2 gap-4 h-full">
              {/* Total Participants */}
              <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-4 border border-blue-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-slate-600">Total Participants</p>
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-sm">
                      <Users className="h-3.5 w-3.5 text-white" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{participants.length}</p>
                </div>
                <div className="mt-2 text-xs flex items-center text-emerald-600">
                  <span className="bg-emerald-100 text-emerald-700 rounded-md px-1.5 py-0.5 font-medium">+12%</span>
                  <span className="ml-1.5">from last period</span>
                </div>
              </div>

              {/* Active Participants */}
              <div className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-xl p-4 border border-indigo-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-slate-600">Active Participants</p>
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-sm">
                      <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">
                    {participants.filter(p => p.status === "active").length}
                  </p>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full" 
                      style={{ width: `${(participants.filter(p => p.status === "active").length / participants.length) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-slate-600 ml-2">
                    {Math.round((participants.filter(p => p.status === "active").length / participants.length) * 100)}%
                  </span>
                </div>
              </div>

              {/* Total Teams */}
              <div className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-xl p-4 border border-indigo-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-slate-600">Total Teams</p>
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shadow-sm">
                      <Users className="h-3.5 w-3.5 text-white" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">4</p>
                </div>
                <div className="mt-2 text-xs flex items-center text-emerald-600">
                  <span className="bg-emerald-100 text-emerald-700 rounded-md px-1.5 py-0.5 font-medium">+2</span>
                  <span className="ml-1.5">new teams this week</span>
                </div>
              </div>

              {/* Submissions */}
              <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-4 border border-blue-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-slate-600">Submissions</p>
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center shadow-sm">
                      <Trophy className="h-3.5 w-3.5 text-white" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">
                    {participants.reduce((sum, p) => sum + p.submissions, 0)}
                  </p>
                </div>
                <div className="mt-2 text-xs flex items-center text-blue-600">
                  <span className="bg-blue-100 text-blue-700 rounded-md px-1.5 py-0.5 font-medium">5</span>
                  <span className="ml-1.5">pending review</span>
                </div>
              </div>

              {/* Average Team Size */}
              <div className="bg-gradient-to-br from-slate-50 to-purple-50 rounded-xl p-4 border border-purple-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-slate-600">Avg. Team Size</p>
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-sm">
                      <User className="h-3.5 w-3.5 text-white" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">3.2</p>
                </div>
                <div className="mt-2 text-xs flex items-center text-purple-600">
                  <span className="bg-purple-100 text-purple-700 rounded-md px-1.5 py-0.5 font-medium">+0.4</span>
                  <span className="ml-1.5">vs previous hackathons</span>
                </div>
              </div>

              {/* Engagement Rate */}
              <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-4 border border-blue-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-slate-600">Engagement Rate</p>
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-sm">
                      <MessageCircle className="h-3.5 w-3.5 text-white" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">78%</p>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full" 
                      style={{ width: '78%' }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-slate-600 ml-2">78%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Performers Card */}
        <Card className="border-slate-200 shadow-md overflow-hidden rounded-xl h-full">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-100 border-b border-indigo-200 p-5 flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-800">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-sm">
                <Trophy className="h-4 w-4 text-white" />
              </div>
              <span>Top Performers</span>
            </CardTitle>
            <Button variant="ghost" size="sm" className="h-8 border border-indigo-200 text-indigo-700 hover:bg-indigo-50 shadow-sm">
              <Trophy className="h-4 w-4 mr-2" />
              <span className="text-xs font-medium">View Leaderboard</span>
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4 flex flex-col h-full">
              {participants
                .sort((a, b) => b.submissions - a.submissions)
                .slice(0, 3)
                .map((participant, idx) => (
                  <div key={participant.id} className="bg-gradient-to-r from-slate-50 to-indigo-50 rounded-xl p-4 border border-indigo-100 flex items-center gap-4 shadow-sm hover:shadow-md transition-all duration-200 flex-1">
                    <div className="relative">
                      <Avatar className="h-14 w-14 border-2 border-white shadow-md">
                        <AvatarImage src={participant.avatar} alt={participant.name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-indigo-700">{participant.name.charAt(0)}{participant.name.split(' ')[1]?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -top-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md ${
                        idx === 0 ? "bg-gradient-to-br from-blue-400 to-indigo-600" : 
                        idx === 1 ? "bg-gradient-to-br from-slate-400 to-slate-600" : 
                        "bg-gradient-to-br from-indigo-700 to-indigo-900"
                      }`}>
                        {idx + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-slate-900 text-base">{participant.name}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Users className="h-3 w-3 text-slate-500" />
                            <p className="text-xs text-slate-600">{participant.teamName}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800 rounded-full px-2.5 py-0.5 text-sm font-medium flex items-center gap-1.5">
                            <Trophy className="h-3 w-3" />
                            <span>{participant.submissions}</span>
                          </div>
                          <span className="text-xs text-slate-500 mt-0.5">submissions</span>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {participant.badges.map((badge, badgeIdx) => (
                          <span key={`${participant.id}-badge-${badgeIdx}`} className="inline-block px-2 py-0.5 text-[10px] font-medium rounded-full bg-indigo-100/70 text-indigo-800 border border-indigo-200">
                            {badge}
                          </span>
                        ))}
                      </div>
                      {/* Additional content to make cards taller */}
                      <div className="mt-3 pt-2 border-t border-indigo-100">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-600">Performance</span>
                          <span className="text-xs font-medium text-indigo-700">{90 - idx * 10}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                          <div 
                            className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full" 
                            style={{ width: `${90 - idx * 10}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Participant Alerts Card */}
        <Card className="border-slate-200 shadow-md overflow-hidden rounded-xl h-full flex flex-col">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-b border-indigo-200 p-5 flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-800">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-sm">
                <BellRing className="h-4 w-4 text-white" />
              </div>
              <span>Participant Alerts</span>
            </CardTitle>
            <Button variant="ghost" size="sm" className="h-8 border border-indigo-200 text-indigo-700 hover:bg-indigo-50 shadow-sm">
              <BellRing className="h-4 w-4 mr-2" />
              <span className="text-xs font-medium">Manage Alerts</span>
            </Button>
          </CardHeader>
          <CardContent className="p-6 flex-1">
            <div className="space-y-4 flex flex-col h-full">
              {/* Teams Incomplete Alert */}
              <div className="bg-gradient-to-r from-red-50 to-red-100/50 rounded-xl p-4 border border-red-200 shadow-sm hover:shadow-md transition-all duration-200 flex-1 flex flex-col justify-between">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <XCircle className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-base font-semibold text-red-700">Teams Incomplete</p>
                      <span className="bg-red-200 text-red-800 text-xs px-2 py-0.5 rounded-full font-medium">2</span>
                    </div>
                    <p className="text-sm text-red-700 mb-3">2 teams need more members to participate effectively.</p>
                    <Button variant="outline" size="sm" className="h-8 text-xs border-red-200 text-red-700 hover:bg-red-50 shadow-sm">
                      <span>Review Teams</span>
                      <ChevronRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Pending Reviews Alert */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200 shadow-sm hover:shadow-md transition-all duration-200 flex-1 flex flex-col justify-between">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <BellRing className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-base font-semibold text-blue-700">Pending Reviews</p>
                      <span className="bg-blue-200 text-blue-800 text-xs px-2 py-0.5 rounded-full font-medium">5</span>
                    </div>
                    <p className="text-sm text-blue-700 mb-3">
                      5 submissions for AI Innovation Challenge need review.
                    </p>
                    <Button variant="outline" size="sm" className="h-8 text-xs border-blue-200 text-blue-700 hover:bg-blue-50 shadow-sm">
                      <span>Review Submissions</span>
                      <ChevronRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* New Registrations Alert */}
              <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-xl p-4 border border-emerald-200 shadow-sm hover:shadow-md transition-all duration-200 flex-1 flex flex-col justify-between">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-base font-semibold text-emerald-700">New Registrations</p>
                      <span className="bg-emerald-200 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-medium">12</span>
                    </div>
                    <p className="text-sm text-emerald-700 mb-3">
                      12 new participants registered in the last 7 days.
                    </p>
                    <Button variant="outline" size="sm" className="h-8 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50 shadow-sm">
                      <span>View Registrations</span>
                      <ChevronRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Manage Participant Dialog */}
      <Dialog open={manageDialogOpen} onOpenChange={setManageDialogOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 gap-0">
          <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-slate-50 to-indigo-50 border-b border-indigo-100">
            <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-slate-800 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-sm">
                <Settings className="h-4 w-4 text-white" />
              </div>
              Manage Participant
            </DialogTitle>
            <DialogDescription asChild>
              <div>
                {selectedParticipant && (
                  <div className="mt-4">
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-white border border-indigo-100 shadow-sm">
                      <Avatar className="h-12 w-12 border-2 border-white shadow-md ring-2 ring-indigo-100">
                        <AvatarImage src={selectedParticipant.avatar} alt={selectedParticipant.name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-indigo-700 font-medium">
                          {selectedParticipant.name.charAt(0)}{selectedParticipant.name.split(' ')[1]?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-800">{selectedParticipant.name}</span>
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                          <span className="text-sm text-slate-600">{selectedParticipant.teamName}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1.5 text-sm text-slate-500">
                            <Mail className="h-3.5 w-3.5" />
                            <span>{selectedParticipant.email}</span>
                          </div>
                          <span className="h-1 w-1 rounded-full bg-slate-200" />
                          <div className="flex items-center gap-1.5 text-sm text-slate-500">
                            <Users className="h-3.5 w-3.5" />
                            <span>{selectedParticipant.teamName}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="status" className="w-full">
            <TabsList className="w-full bg-white/80 p-1.5 border border-slate-200/70 shadow-md">
              <TabsTrigger 
                value="status"
                className="flex items-center gap-2 flex-1 text-sm font-medium py-2.5 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-colors"
              >
                <BellRing className="h-4 w-4" />
                Status
              </TabsTrigger>
              <TabsTrigger 
                value="permissions"
                className="flex items-center gap-2 flex-1 text-sm font-medium py-2.5 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-colors"
              >
                <Settings className="h-4 w-4" />
                Permissions
              </TabsTrigger>
            </TabsList>
            
            <div className="p-6">
              <TabsContent value="status" className="space-y-6 mt-0">
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-slate-700">Participation Status</Label>
                  <RadioGroup 
                    value={newStatus} 
                    onValueChange={setNewStatus}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="relative">
                      <RadioGroupItem 
                        value="active" 
                        id="active"
                        className="peer sr-only"
                      />
                      <Label 
                        htmlFor="active"
                        className="flex items-center gap-3 p-4 border border-emerald-200 rounded-lg cursor-pointer bg-emerald-50/50 peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-emerald-500 hover:bg-emerald-50 transition-all"
                      >
                        <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-medium text-emerald-700">Active</p>
                          <p className="text-xs text-emerald-600 mt-0.5">Fully participating</p>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="relative">
                      <RadioGroupItem 
                        value="inactive" 
                        id="inactive"
                        className="peer sr-only"
                      />
                      <Label 
                        htmlFor="inactive"
                        className="flex items-center gap-3 p-4 border border-red-200 rounded-lg cursor-pointer bg-red-50/50 peer-data-[state=checked]:border-red-500 peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-red-500 hover:bg-red-50 transition-all"
                      >
                        <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                          <XCircle className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium text-red-700">Inactive</p>
                          <p className="text-xs text-red-600 mt-0.5">Temporarily paused</p>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="relative">
                      <RadioGroupItem 
                        value="left" 
                        id="left"
                        className="peer sr-only"
                      />
                      <Label 
                        htmlFor="left"
                        className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg cursor-pointer bg-slate-50/50 peer-data-[state=checked]:border-slate-500 peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-slate-500 hover:bg-slate-50 transition-all"
                      >
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-slate-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-700">Left</p>
                          <p className="text-xs text-slate-600 mt-0.5">No longer participating</p>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="relative">
                      <RadioGroupItem 
                        value="disqualified" 
                        id="disqualified"
                        className="peer sr-only"
                      />
                      <Label 
                        htmlFor="disqualified"
                        className="flex items-center gap-3 p-4 border border-orange-200 rounded-lg cursor-pointer bg-orange-50/50 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-orange-500 hover:bg-orange-50 transition-all"
                      >
                        <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                          <Trash2 className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-orange-700">Disqualified</p>
                          <p className="text-xs text-orange-600 mt-0.5">Removed from competition</p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="statusNote" className="text-sm font-medium text-slate-700">
                    Note
                  </Label>
                  <Textarea
                    id="statusNote"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="Add a note about this status change..."
                    className="resize-none h-24"
                  />
                </div>

                <div className="space-y-4 rounded-lg border border-slate-200 p-4 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notify" className="text-sm font-medium text-slate-700">
                        Notify participant
                      </Label>
                      <p className="text-xs text-slate-500">Send an email about this change</p>
                    </div>
                    <Checkbox id="notify" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="restrict" className="text-sm font-medium text-slate-700">
                        Restrict access
                      </Label>
                      <p className="text-xs text-slate-500">Limit access to submissions</p>
                    </div>
                    <Checkbox id="restrict" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="permissions" className="mt-0">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-slate-700">Submission Permissions</h3>
                      <Button variant="outline" size="sm" className="h-8 text-xs">
                        Reset to Default
                      </Button>
                    </div>
                    <div className="space-y-3 rounded-lg border border-slate-200 p-4 bg-slate-50/50">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="canSubmit" className="text-sm font-medium text-slate-700">
                            Submit projects
                          </Label>
                          <p className="text-xs text-slate-500">Can submit new projects</p>
                        </div>
                        <Checkbox id="canSubmit" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="canEdit" className="text-sm font-medium text-slate-700">
                            Edit submissions
                          </Label>
                          <p className="text-xs text-slate-500">Can modify existing submissions</p>
                        </div>
                        <Checkbox id="canEdit" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="canDelete" className="text-sm font-medium text-slate-700">
                            Delete submissions
                          </Label>
                          <p className="text-xs text-slate-500">Can remove their submissions</p>
                        </div>
                        <Checkbox id="canDelete" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-slate-700">Team Permissions</h3>
                      <Button variant="outline" size="sm" className="h-8 text-xs">
                        Reset to Default
                      </Button>
                    </div>
                    <div className="space-y-3 rounded-lg border border-slate-200 p-4 bg-slate-50/50">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="canInvite" className="text-sm font-medium text-slate-700">
                            Invite members
                          </Label>
                          <p className="text-xs text-slate-500">Can invite new team members</p>
                        </div>
                        <Checkbox id="canInvite" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="canRemove" className="text-sm font-medium text-slate-700">
                            Remove members
                          </Label>
                          <p className="text-xs text-slate-500">Can remove team members</p>
                        </div>
                        <Checkbox id="canRemove" />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <DialogFooter className="flex items-center justify-between p-6 bg-slate-50 border-t border-slate-200">
            <Button
              variant="outline"
              onClick={() => setManageDialogOpen(false)}
              className="border-slate-200 text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
                onClick={() => {
                  // Handle participant removal
                  setManageDialogOpen(false)
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove Participant
              </Button>
              <Button
                onClick={handleStatusChange}
                className="bg-indigo-600 hover:bg-indigo-700"
                disabled={!newStatus || newStatus === selectedParticipant?.status}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Update Status
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 