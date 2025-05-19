"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  FileText,
  Upload,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
  Download,
  ExternalLink,
  MoreVertical,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Sample data for submissions
const submissions = [
  {
    id: 1,
    hackathonName: "AI Innovation Challenge",
    projectName: "SmartAI Assistant",
    teamName: "Team Innovators",
    submittedAt: "2024-03-15T14:30:00",
    status: "submitted",
    score: 85,
    feedback: "Great implementation of AI features. Consider improving the UI/UX.",
    members: [
      { name: "Sarah Chen", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Mike Johnson", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Emily Zhang", avatar: "/placeholder.svg?height=32&width=32" },
    ],
  },
  {
    id: 2,
    hackathonName: "Web3 Hackathon",
    projectName: "DeFi Platform",
    teamName: "Blockchain Builders",
    submittedAt: "2024-03-10T09:15:00",
    status: "reviewing",
    score: null,
    feedback: null,
    members: [
      { name: "Alex Turner", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Lisa Wang", avatar: "/placeholder.svg?height=32&width=32" },
    ],
  },
  {
    id: 3,
    hackathonName: "Sustainability Challenge",
    projectName: "EcoTracker",
    teamName: "Green Tech",
    submittedAt: "2024-03-01T16:45:00",
    status: "completed",
    score: 92,
    feedback: "Excellent project with real-world impact. Outstanding presentation.",
    members: [
      { name: "David Kim", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Rachel Singh", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Tom Wilson", avatar: "/placeholder.svg?height=32&width=32" },
    ],
  },
]

const statusColors = {
  submitted: "bg-blue-100 text-blue-700 border-blue-200",
  reviewing: "bg-amber-100 text-amber-700 border-amber-200",
  completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
}

const statusIcons = {
  submitted: CheckCircle2,
  reviewing: Clock,
  completed: CheckCircle2,
  rejected: XCircle,
}

export default function Submissions() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch = 
      submission.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.hackathonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.teamName.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (selectedTab === "all") return matchesSearch
    return matchesSearch && submission.status === selectedTab
  })

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col space-y-4 p-4 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Submissions</h1>
          <p className="text-slate-500">Manage and track your hackathon submissions</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700">
          <Upload className="h-4 w-4 mr-2" />
          New Submission
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="search"
                placeholder="Search submissions..."
                className="pl-8 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="shrink-0">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedTab}>
            <div className="px-4">
              <TabsList className="w-full max-w-2xl grid grid-cols-4 bg-slate-50 p-1">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="submitted">Submitted</TabsTrigger>
                <TabsTrigger value="reviewing">Reviewing</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={selectedTab} className="mt-4">
              <div className="divide-y">
                {filteredSubmissions.map((submission) => {
                  const StatusIcon = statusIcons[submission.status as keyof typeof statusIcons]
                  return (
                    <div key={submission.id} className="p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-slate-900">
                              {submission.projectName}
                            </h3>
                            <Badge
                              variant="outline"
                              className={`${
                                statusColors[submission.status as keyof typeof statusColors]
                              } capitalize`}
                            >
                              <StatusIcon className="h-3.5 w-3.5 mr-1" />
                              {submission.status}
                            </Badge>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-slate-500">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              {submission.hackathonName}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {new Date(submission.submittedAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex -space-x-2">
                                {submission.members.map((member, index) => (
                                  <Avatar
                                    key={index}
                                    className="h-6 w-6 border-2 border-white"
                                  >
                                    <AvatarImage src={member.avatar} alt={member.name} />
                                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                                  </Avatar>
                                ))}
                              </div>
                              <span>{submission.teamName}</span>
                            </div>
                          </div>
                          {submission.feedback && (
                            <p className="mt-2 text-sm text-slate-600">
                              {submission.feedback}
                            </p>
                          )}
                          {submission.score && (
                            <div className="mt-2">
                              <Badge className="bg-violet-100 text-violet-700 border-violet-200">
                                Score: {submission.score}/100
                              </Badge>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="shrink-0">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                          <Button variant="outline" size="sm" className="shrink-0">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Edit submission</DropdownMenuItem>
                              <DropdownMenuItem>Share</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 