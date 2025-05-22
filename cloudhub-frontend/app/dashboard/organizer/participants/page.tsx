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
  BellRing
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

export default function ParticipantsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState("all")
  const [hackathonFilter, setHackathonFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name-asc")

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
      status: "active",
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
      status: "active",
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
      status: "inactive",
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

  // Toggle selection of a participant
  const toggleParticipantSelection = (participantId: string) => {
    setSelectedParticipants(prev => 
      prev.includes(participantId)
        ? prev.filter(id => id !== participantId)
        : [...prev, participantId]
    )
  }

  // Toggle selection of all participants
  const toggleAllParticipants = () => {
    if (selectedParticipants.length === filteredParticipants.length) {
      setSelectedParticipants([])
    } else {
      setSelectedParticipants(filteredParticipants.map(p => p.id))
    }
  }

  // Hackathon options for filter
  const hackathonOptions = [
    { value: "all", label: "All Hackathons" },
    { value: "AI Innovation Challenge", label: "AI Innovation Challenge" },
    { value: "Web3 Hackathon", label: "Web3 Hackathon" },
    { value: "Mobile App Innovation", label: "Mobile App Innovation" },
  ]

  return (
    <div className="space-y-8 pb-10 px-6 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Participants</h1>
          <p className="text-slate-500">Manage hackathon participants and teams</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="border-slate-200"
            disabled={selectedParticipants.length === 0}
          >
            <Mail className="h-4 w-4 mr-2" />
            Email Selected
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
            <UserPlus className="h-4 w-4" />
            Invite Participants
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input 
            placeholder="Search participants..." 
            className="pl-9 bg-white border-slate-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={hackathonFilter} onValueChange={setHackathonFilter}>
          <SelectTrigger className="w-full sm:w-[200px] bg-white border-slate-200">
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
          <SelectTrigger className="w-full sm:w-[180px] bg-white border-slate-200">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-500" />
              <SelectValue placeholder="Filter by status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-slate-50">
                <TableHead className="w-[40px]">
                  <Checkbox 
                    checked={selectedParticipants.length === filteredParticipants.length && filteredParticipants.length > 0}
                    onCheckedChange={toggleAllParticipants}
                  />
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1 cursor-pointer" onClick={() => setSortBy(sortBy === "name-asc" ? "name-desc" : "name-asc")}>
                    Participant
                    <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />
                  </div>
                </TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Hackathons</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1 cursor-pointer" onClick={() => setSortBy(sortBy === "submissions-asc" ? "submissions-desc" : "submissions-asc")}>
                    Submissions
                    <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1 cursor-pointer" onClick={() => setSortBy(sortBy === "date-asc" ? "date-desc" : "date-asc")}>
                    Joined
                    <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedParticipants.map((participant) => (
                <TableRow key={participant.id} className="hover:bg-slate-50">
                  <TableCell>
                    <Checkbox 
                      checked={selectedParticipants.includes(participant.id)}
                      onCheckedChange={() => toggleParticipantSelection(participant.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={participant.avatar} alt={participant.name} />
                        <AvatarFallback>{participant.name.charAt(0)}{participant.name.split(' ')[1]?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-slate-900">{participant.name}</p>
                        <p className="text-xs text-slate-500">{participant.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-slate-500" />
                      <span>{participant.teamName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {participant.hackathons.map((hackathon, idx) => (
                        <Badge key={idx} variant="outline" className="bg-slate-50 border-slate-200 text-xs">
                          {hackathon}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{participant.submissions}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={participant.status === "active" ? "bg-emerald-600" : "bg-slate-600"}>
                      {participant.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-600">
                      {new Date(participant.joinDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="flex items-center gap-2">
                          <User className="h-4 w-4" /> View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">
                          <MessageCircle className="h-4 w-4" /> Send Message
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Award className="h-4 w-4" /> Assign Badge
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                          <Trash2 className="h-4 w-4" /> Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredParticipants.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <Users className="h-10 w-10 mb-3 text-slate-300" />
                      <p className="font-medium">No participants found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span>Participant Statistics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-500">Total Participants</p>
                  <p className="text-2xl font-bold text-slate-900">{participants.length}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-500">Active Participants</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {participants.filter(p => p.status === "active").length}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-500">Total Teams</p>
                  <p className="text-2xl font-bold text-slate-900">4</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-500">Submissions</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {participants.reduce((sum, p) => sum + p.submissions, 0)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 px-6">
            <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50">
              <BarChart2 className="h-4 w-4 mr-2" />
              View Detailed Analytics
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-600" />
              <span>Top Performers</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {participants
                .sort((a, b) => b.submissions - a.submissions)
                .slice(0, 3)
                .map((participant, idx) => (
                  <div key={participant.id} className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={participant.avatar} alt={participant.name} />
                        <AvatarFallback>{participant.name.charAt(0)}{participant.name.split(' ')[1]?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                        idx === 0 ? "bg-amber-500" : idx === 1 ? "bg-slate-400" : "bg-amber-700"
                      }`}>
                        {idx + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{participant.name}</p>
                      <p className="text-xs text-slate-500">{participant.teamName}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-bold text-blue-700">{participant.submissions}</span>
                      <span className="text-xs text-slate-500">submissions</span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 px-6">
            <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50">
              View All Leaderboards
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BellRing className="h-5 w-5 text-red-600" />
              <span>Participant Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <XCircle className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">2 teams incomplete</p>
                  <p className="text-xs text-slate-500">Teams need more members</p>
                </div>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <BellRing className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">5 submissions pending review</p>
                  <p className="text-xs text-slate-500">For AI Innovation Challenge</p>
                </div>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">3 new registrations</p>
                  <p className="text-xs text-slate-500">In the last 24 hours</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 px-6">
            <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50">
              View All Alerts
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
} 