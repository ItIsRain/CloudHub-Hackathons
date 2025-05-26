"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input" 
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Trophy,
  CalendarDays,
  PlusCircle,
  Star,
  Check,
  MessageSquare,
  ArrowRight,
  Search,
  Filter,
  UserPlus,
  Sparkles,
  BarChart3,
  Clock,
  MoreHorizontal,
  Pin,
  X,
  Mail,
  Briefcase,
  Globe,
  Lock,
  AlertCircle,
  Info
} from "lucide-react"

// Mock data for users that can be invited to a team
const availableUsers = [
  {
    id: 7,
    name: "Ava Wilson",
    email: "ava.wilson@example.com",
    role: "Full-stack Developer",
    skills: ["JavaScript", "React", "Node.js"],
    avatar: "/placeholder.svg?height=40&width=40&text=AW",
    isOnline: true,
  },
  {
    id: 8,
    name: "Raj Patel",
    email: "raj.patel@example.com",
    role: "Machine Learning Engineer",
    skills: ["Python", "TensorFlow", "Data Science"],
    avatar: "/placeholder.svg?height=40&width=40&text=RP",
    isOnline: true,
  },
  {
    id: 9,
    name: "Maya Chen",
    email: "maya.chen@example.com",
    role: "UI/UX Designer",
    skills: ["Figma", "UI Design", "User Research"],
    avatar: "/placeholder.svg?height=40&width=40&text=MC",
    isOnline: false,
  },
  {
    id: 10,
    name: "Luke Johnson",
    email: "luke.johnson@example.com",
    role: "DevOps Engineer",
    skills: ["Docker", "Kubernetes", "CI/CD"],
    avatar: "/placeholder.svg?height=40&width=40&text=LJ",
    isOnline: false,
  },
  {
    id: 11,
    name: "Sophia Garcia",
    email: "sophia.garcia@example.com",
    role: "Blockchain Developer",
    skills: ["Solidity", "Ethereum", "Web3"],
    avatar: "/placeholder.svg?height=40&width=40&text=SG",
    isOnline: true,
  },
];

// Mock data for teams
const myTeamsData = [
  {
    id: 1,
    name: "InnovateAI",
    hackathon: "AI Innovation Challenge",
    members: 4,
    maxMembers: 5,
    progress: 65,
    skills: ["Machine Learning", "React", "Node.js"],
    projectName: "AI-powered Healthcare Assistant",
    lastActive: "2 hours ago",
    avatar: "/placeholder.svg?height=100&width=100&text=IA",
    membersData: [
      { id: 1, name: "John Doe", role: "Team Lead", avatar: "/placeholder.svg?height=40&width=40&text=JD" },
      { id: 2, name: "Sarah Johnson", role: "ML Engineer", avatar: "/placeholder.svg?height=40&width=40&text=SJ" },
      { id: 3, name: "Miguel Rodriguez", role: "Frontend Dev", avatar: "/placeholder.svg?height=40&width=40&text=MR" },
      { id: 4, name: "Priya Patel", role: "Backend Dev", avatar: "/placeholder.svg?height=40&width=40&text=PP" },
    ],
    achievements: [
      { id: 1, name: "First Milestone Completed", date: "June 2, 2025" },
      { id: 2, name: "Technical Review Passed", date: "June 8, 2025" },
    ],
    nextMilestone: "Final Submission",
    nextMilestoneDate: "June 18, 2025"
  },
  {
    id: 2,
    name: "Blockchain Pioneers",
    hackathon: "Web3 Hackathon",
    members: 3,
    maxMembers: 4,
    progress: 30,
    skills: ["Solidity", "Ethereum", "Web3.js"],
    projectName: "Decentralized Voting System",
    lastActive: "Yesterday",
    avatar: "/placeholder.svg?height=100&width=100&text=BP",
    membersData: [
      { id: 1, name: "John Doe", role: "Team Lead", avatar: "/placeholder.svg?height=40&width=40&text=JD" },
      { id: 5, name: "Alex Chen", role: "Blockchain Dev", avatar: "/placeholder.svg?height=40&width=40&text=AC" },
      { id: 6, name: "Emma Wilson", role: "Smart Contract Dev", avatar: "/placeholder.svg?height=40&width=40&text=EW" },
    ],
    achievements: [
      { id: 1, name: "Project Concept Approved", date: "June 5, 2025" },
    ],
    nextMilestone: "Technical Demo",
    nextMilestoneDate: "July 5, 2025"
  },
]

const recommendedTeams = [
  {
    id: 3,
    name: "DataViz Experts",
    hackathon: "AI Innovation Challenge",
    members: 3,
    maxMembers: 5,
    skills: ["Data Science", "Visualization", "Python", "React"],
    projectIdea: "Interactive data visualization platform for complex datasets",
    lookingFor: ["Full-stack Developer", "UI/UX Designer"],
    avatar: "/placeholder.svg?height=100&width=100&text=DV",
    leadName: "Emily Zhang",
    leadAvatar: "/placeholder.svg?height=40&width=40&text=EZ",
    matchScore: 92
  },
  {
    id: 4,
    name: "Quantum Coders",
    hackathon: "Quantum Computing Challenge",
    members: 2,
    maxMembers: 4,
    skills: ["Quantum Algorithms", "Python", "Physics"],
    projectIdea: "Quantum machine learning model for materials science",
    lookingFor: ["ML Engineer", "Quantum Physics Specialist"],
    avatar: "/placeholder.svg?height=100&width=100&text=QC",
    leadName: "David Kumar",
    leadAvatar: "/placeholder.svg?height=40&width=40&text=DK",
    matchScore: 87
  },
  {
    id: 5,
    name: "AR Innovators",
    hackathon: "Extended Reality Hackathon",
    members: 3,
    maxMembers: 5,
    skills: ["Unity", "AR/VR", "3D Modeling"],
    projectIdea: "Augmented reality educational platform for STEM subjects",
    lookingFor: ["Unity Developer", "3D Artist"],
    avatar: "/placeholder.svg?height=100&width=100&text=AR",
    leadName: "Sofia Martinez",
    leadAvatar: "/placeholder.svg?height=40&width=40&text=SM",
    matchScore: 78
  },
]

export default function TeamsDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  
  // Create Team Dialog State
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [teamName, setTeamName] = useState("")
  const [teamDescription, setTeamDescription] = useState("")
  const [selectedHackathon, setSelectedHackathon] = useState("")
  const [maxTeamSize, setMaxTeamSize] = useState("5")
  const [isLookingForMembers, setIsLookingForMembers] = useState(true)
  const [isPublic, setIsPublic] = useState(true)
  
  // Team Members State
  const [selectedMembers, setSelectedMembers] = useState<typeof availableUsers>([])
  const [emailInvites, setEmailInvites] = useState<string[]>([])
  const [currentEmail, setCurrentEmail] = useState("")
  const [memberSearchTerm, setMemberSearchTerm] = useState("")

  // Update looking for members state when max team size changes
  useEffect(() => {
    if (maxTeamSize === "6" && isLookingForMembers) {
      setIsLookingForMembers(false)
    }
  }, [maxTeamSize, isLookingForMembers])

  // Handle invitation by email
  const handleAddEmailInvite = () => {
    if (currentEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentEmail)) {
      if (!emailInvites.includes(currentEmail)) {
        setEmailInvites([...emailInvites, currentEmail])
      }
      setCurrentEmail("")
    }
  }

  const handleRemoveEmailInvite = (email: string) => {
    setEmailInvites(emailInvites.filter(e => e !== email))
  }

  // Handle adding/removing team members
  const handleToggleMember = (user: typeof availableUsers[0]) => {
    const isSelected = selectedMembers.some(m => m.id === user.id)
    
    if (isSelected) {
      setSelectedMembers(selectedMembers.filter(m => m.id !== user.id))
    } else {
      setSelectedMembers([...selectedMembers, user])
    }
  }

  // Filter available users based on search
  const filteredAvailableUsers = availableUsers.filter(user => {
    if (!memberSearchTerm.trim()) return true
    
    const searchLower = memberSearchTerm.toLowerCase()
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower) ||
      user.skills.some(skill => skill.toLowerCase().includes(searchLower))
    )
  })

  // Create new team
  const handleCreateTeam = () => {
    // Reset form and close dialog
    setTeamName("")
    setTeamDescription("")
    setSelectedHackathon("")
    setMaxTeamSize("5")
    setIsLookingForMembers(true)
    setIsPublic(true)
    setSelectedMembers([])
    setEmailInvites([])
    setCurrentEmail("")
    setMemberSearchTerm("")
    setIsCreateDialogOpen(false)
  }

  // Handle keyboard events for search
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setSearchTerm("");
      (e.target as HTMLInputElement).blur();
    }
  };
  
  // Filter teams based on search term
  const filteredMyTeams = myTeamsData.filter(team => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      team.name.toLowerCase().includes(searchLower) ||
      team.hackathon.toLowerCase().includes(searchLower) ||
      team.skills.some(skill => skill.toLowerCase().includes(searchLower)) ||
      team.projectName.toLowerCase().includes(searchLower)
    );
  });
  
  const filteredRecommendedTeams = recommendedTeams.filter(team => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      team.name.toLowerCase().includes(searchLower) ||
      team.hackathon.toLowerCase().includes(searchLower) ||
      team.skills.some(skill => skill.toLowerCase().includes(searchLower)) ||
      team.projectIdea.toLowerCase().includes(searchLower) ||
      team.lookingFor.some(role => role.toLowerCase().includes(searchLower))
    );
  });
  
  // Memoize search handler
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  // Memoize filtered teams
  const filteredTeams = useMemo(() => {
    return myTeamsData.filter(team => 
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.hackathon.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      team.projectName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [myTeamsData, searchTerm]);

  // Memoize dialog handlers
  const handleDialogOpen = useCallback(() => {
    setIsCreateDialogOpen(true);
  }, []);

  const handleDialogClose = useCallback(() => {
    setIsCreateDialogOpen(false);
    // Reset form state
    setTeamName("");
    setTeamDescription("");
    setSelectedHackathon("");
    setMaxTeamSize("5");
    setIsLookingForMembers(true);
    setIsPublic(true);
    setSelectedMembers([]);
    setEmailInvites([]);
  }, []);

  return (
    <div className="space-y-8 pb-10 px-6 mt-6">
      {/* Header Section */}
      <section className="relative overflow-hidden rounded-2xl shadow-lg">
        {/* Gradient background with animated elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/20"></div>
        
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-1/3 h-4/5 bg-gradient-to-b from-white/10 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-2/3 h-1/2 bg-gradient-to-t from-blue-400/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-[10%] w-12 h-12 rounded-full bg-blue-500/10 backdrop-blur-md border border-white/10"></div>
        <div className="absolute bottom-1/4 right-[15%] w-20 h-20 rounded-full bg-violet-500/10 backdrop-blur-md border border-white/10"></div>
        <div className="absolute top-1/2 left-[30%] w-16 h-16 rounded-full bg-indigo-500/10 backdrop-blur-md border border-white/10"></div>
        
        <div className="relative p-8 sm:p-10 md:p-12">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-1.5 rounded-full mb-5 text-white text-sm border border-white/20 shadow-xl">
                <Users className="h-4 w-4 text-blue-200" />
                <span className="font-medium tracking-wide">Team Management</span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-violet-200">Teams</span>
              </h1>
              
              <p className="text-white/90 text-lg mb-8 max-w-lg font-light">
                Manage your hackathon teams and find new teammates to collaborate with on exciting projects.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button className="bg-white text-indigo-700 hover:bg-white/90 shadow-lg transition-all group px-5 py-2 h-auto text-sm font-medium rounded-xl border border-white/50">
                  <PlusCircle className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  <span>Create New Team</span>
                </Button>
              </div>
            </div>
            
            <div className="hidden md:flex justify-end">
              <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-5 w-full max-w-xs shadow-xl">
                <h3 className="font-medium mb-4 flex items-center text-white">
                  <Star className="h-4 w-4 mr-2 text-amber-300" />
                  <span className="text-base">Team Statistics</span>
                </h3>
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-white/80">Active Teams</span>
                      <span className="text-white font-medium">{myTeamsData.length}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full" style={{ width: `${myTeamsData.length * 50}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-white/80">Average Completion</span>
                      <span className="text-white font-medium">47.5%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full" style={{ width: '47.5%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-white/80">Overall Activity</span>
                      <span className="text-white font-medium">High</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teams Tabs */}
      <Tabs defaultValue="myTeams" className="w-full">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div className="inline-flex rounded-full bg-gradient-to-r from-slate-50 via-slate-50 to-slate-50 p-1.5 border border-slate-100 shadow-sm">
            <TabsList className="bg-transparent">
              <TabsTrigger 
                value="myTeams" 
                className="flex items-center gap-2 rounded-full px-4 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:via-indigo-500 data-[state=active]:to-violet-500 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-200"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white">
                  <Users className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm font-medium">My Teams</span>
              </TabsTrigger>
              <TabsTrigger 
                value="findTeams" 
                className="flex items-center gap-2 rounded-full px-4 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:via-indigo-500 data-[state=active]:to-violet-500 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-200"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500 text-white">
                  <UserPlus className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm font-medium">Find Teams</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className={`relative flex items-center transition-all ${isSearchFocused || searchTerm ? 'w-full sm:w-72 md:w-80' : 'w-full sm:w-60 md:w-72'}`}>
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors ${isSearchFocused || searchTerm ? 'text-blue-500' : 'text-slate-400'}`} />
            <Input 
              type="search" 
              placeholder="Search teams..." 
              className="pl-10 pr-12 bg-white border-slate-200 rounded-full focus-visible:ring-blue-500 w-full"
              value={searchTerm}
              onChange={handleSearch}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              onKeyDown={handleSearchKeyDown}
            />
            {searchTerm ? (
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-10 top-1/2 transform -translate-y-1/2 text-slate-400 h-8 w-8 hover:bg-slate-100 hover:text-slate-600 rounded-full"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </Button>
            ) : null}
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-1 top-1/2 transform -translate-y-1/2 text-slate-400 h-8 w-8 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Filter results"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {searchTerm && (
          <div className="mb-6 flex items-center justify-between bg-blue-50 text-blue-800 px-4 py-2 rounded-lg">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <p className="text-sm">
                Searching for <span className="font-medium">"{searchTerm}"</span>
              </p>
            </div>
            <Button variant="ghost" size="sm" className="h-8 text-blue-700 hover:bg-blue-100" onClick={() => setSearchTerm("")}>
              Clear
            </Button>
          </div>
        )}

        <TabsContent value="myTeams" className="mt-0 space-y-6 px-2">
          {filteredTeams.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-1">No teams found</h3>
              <p className="text-slate-500 mb-4 max-w-md">We couldn't find any teams matching "{searchTerm}"</p>
              <Button variant="outline" size="sm" onClick={() => setSearchTerm("")}>
                Clear search
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredTeams.map((team) => (
                <Card key={team.id} className="overflow-hidden border-slate-200 hover:shadow-md transition-all group">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      <div className="w-full sm:w-1/3 h-auto min-h-32 bg-gradient-to-br from-slate-50 to-slate-100 flex-shrink-0 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-violet-500/10 group-hover:opacity-100 opacity-0 transition-opacity"></div>
                        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-blue-500 to-violet-500 group-hover:opacity-20 transition-opacity"></div>
                        <div className="w-full h-full p-4 flex items-center justify-center">
                          <Avatar className="h-24 w-24 shadow-md group-hover:scale-105 transition-transform">
                            <AvatarImage src={team.avatar} alt={team.name} className="object-cover" />
                            <AvatarFallback className="text-3xl font-semibold bg-gradient-to-br from-blue-500 to-violet-500 text-white">
                              {team.name.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                      <div className="p-5 flex-1">
                        <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                          <div>
                            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{team.name}</h3>
                            <p className="text-sm text-slate-500">{team.hackathon}</p>
                          </div>
                          <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 group-hover:from-blue-600 group-hover:to-indigo-600 transition-all">
                            {team.members}/{team.maxMembers} Members
                          </Badge>
                        </div>
                        
                        <div className="mb-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-600">Project progress</span>
                            <span className="font-medium text-blue-700">{team.progress}%</span>
                          </div>
                          <Progress 
                            value={team.progress} 
                            className="h-1.5 bg-slate-100" 
                            indicatorClassName="bg-gradient-to-r from-blue-500 to-violet-500" 
                          />
                        </div>
                        
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {team.skills.map((skill, index) => (
                            <Badge 
                              key={index} 
                              variant="outline" 
                              className="bg-slate-50 text-slate-700 border-slate-200 group-hover:bg-blue-50 group-hover:text-blue-700 group-hover:border-blue-200 transition-colors px-3 py-1 mr-1.5 mb-1.5"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center text-xs text-slate-500 mb-4">
                          <Clock className="h-3.5 w-3.5 mr-1.5" />
                          <span>Next milestone: <span className="font-medium text-slate-700">{team.nextMilestone}</span> · {team.nextMilestoneDate}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex -space-x-2">
                            {team.membersData.slice(0, 3).map((member) => (
                              <HoverCard key={member.id}>
                                <HoverCardTrigger>
                                  <Avatar className="h-8 w-8 border-2 border-white rounded-full">
                                    <AvatarImage src={member.avatar} alt={member.name} />
                                    <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                                  </Avatar>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-64 p-4">
                                  <div className="flex justify-between space-x-4">
                                    <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                                      <AvatarImage src={member.avatar} />
                                      <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1 flex-1">
                                      <h4 className="text-sm font-semibold">{member.name}</h4>
                                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 shadow-sm">
                                        {member.role}
                                      </div>
                                      <div className="flex space-x-2 mt-2">
                                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full">
                                          <MessageSquare className="h-4 w-4" />
                                        </Button>
                                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full">
                                          <UserPlus className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </HoverCardContent>
                              </HoverCard>
                            ))}
                            {team.membersData.length > 3 && (
                              <Avatar className="h-8 w-8 border-2 border-white bg-slate-100 text-slate-600 text-xs flex items-center justify-center rounded-full">
                                +{team.membersData.length - 3}
                              </Avatar>
                            )}
                          </div>
                          
                          <div className="flex gap-1.5">
                            <Button size="sm" variant="ghost" className="px-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100">
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              className="gap-1 bg-white text-blue-700 border border-blue-200 hover:bg-blue-50 hover:text-blue-800 shadow-sm group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all"
                            >
                              Team Page
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="findTeams" className="mt-0 px-2">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-lg font-medium text-slate-900">Recommended Teams</h2>
                <p className="text-sm text-slate-500">
                  {searchTerm ? 
                    `${filteredRecommendedTeams.length} teams found matching "${searchTerm}"` : 
                    "Teams that match your skills and interests"
                  }
                </p>
              </div>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50">
                View All
              </Button>
            </div>
            
            {filteredRecommendedTeams.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-1">No teams found</h3>
                <p className="text-slate-500 mb-4 max-w-md">We couldn't find any teams matching "{searchTerm}"</p>
                <Button variant="outline" size="sm" onClick={() => setSearchTerm("")}>
                  Clear search
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-3">
                {filteredRecommendedTeams.map((team) => (
                  <Card key={team.id} className="overflow-hidden border-slate-200 hover:shadow-md transition-all group relative">
                    <div className="absolute top-3 right-3 z-10">
                      <HoverCard>
                        <HoverCardTrigger>
                          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 shadow-sm border border-blue-200">
                            <Sparkles className="h-3 w-3 mr-1 text-blue-600" />
                            {team.matchScore}% Match
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-64 p-4">
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold">Match Score Breakdown</h4>
                            <div className="space-y-1.5">
                              <div>
                                <div className="flex justify-between text-xs mb-0.5">
                                  <span className="text-slate-600">Skills Match</span>
                                  <span className="font-medium text-blue-700">90%</span>
                                </div>
                                <Progress value={90} className="h-1 bg-slate-100" indicatorClassName="bg-blue-500" />
                              </div>
                              <div>
                                <div className="flex justify-between text-xs mb-0.5">
                                  <span className="text-slate-600">Project Interest</span>
                                  <span className="font-medium text-blue-700">85%</span>
                                </div>
                                <Progress value={85} className="h-1 bg-slate-100" indicatorClassName="bg-emerald-500" />
                              </div>
                              <div>
                                <div className="flex justify-between text-xs mb-0.5">
                                  <span className="text-slate-600">Team Compatibility</span>
                                  <span className="font-medium text-blue-700">95%</span>
                                </div>
                                <Progress value={95} className="h-1 bg-slate-100" indicatorClassName="bg-violet-500" />
                              </div>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                    
                    <div className="w-full h-32 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-violet-500/10 group-hover:opacity-100 opacity-0 transition-opacity"></div>
                      <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-blue-500 to-violet-500 group-hover:opacity-20 transition-opacity"></div>
                      <Avatar className="h-20 w-20 shadow-md group-hover:scale-105 transition-transform">
                        <AvatarImage src={team.avatar} alt={team.name} className="object-cover" />
                        <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-blue-500 to-violet-500 text-white">
                          {team.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="text-base group-hover:text-blue-600 transition-colors">{team.name}</CardTitle>
                          <CardDescription className="text-xs">{team.hackathon}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6 border-2 border-white">
                            <AvatarImage src={team.leadAvatar} alt={team.leadName} />
                            <AvatarFallback>{team.leadName.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-slate-500">Lead: {team.leadName}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2 space-y-3">
                      <div className="flex items-center text-sm text-slate-700">
                        <Users className="h-4 w-4 mr-2 text-slate-400" />
                        <span>{team.members}/{team.maxMembers} Members</span>
                      </div>
                      
                      <div>
                        <p className="text-xs font-medium text-slate-500 mb-1.5">Project Idea</p>
                          <p className="text-sm text-slate-700">{team.projectIdea}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs font-medium text-slate-500 mb-1.5">Skills & Technologies</p>
                          <div className="flex flex-wrap gap-1.5">
                            {team.skills.map((skill, index) => (
                              <Badge 
                                key={index} 
                                variant="outline" 
                                className="bg-slate-50 text-slate-700 border-slate-200 text-xs group-hover:bg-blue-50 group-hover:text-blue-700 group-hover:border-blue-200 transition-colors px-2.5 py-0.5 mr-1 mb-1"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                      </div>
                      
                      <div>
                        <p className="text-xs font-medium text-slate-500 mb-1.5">Looking For</p>
                          <div className="flex flex-wrap gap-1.5">
                            {team.lookingFor.map((role, index) => (
                              <Badge 
                                key={index} 
                                className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-0 text-xs group-hover:from-blue-200 group-hover:to-indigo-200 transition-all px-2.5 py-0.5 mr-1 mb-1"
                              >
                                {role}
                              </Badge>
                            ))}
                          </div>
                      </div>
                      
                      <div className="flex gap-2 pt-3">
                        <Button 
                          size="sm" 
                          className="w-full gap-1 bg-white text-blue-700 border border-blue-200 hover:bg-blue-50 hover:text-blue-800 shadow-sm group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all"
                        >
                          Request to Join
                          <UserPlus className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" className="flex-shrink-0 px-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            <div className="flex justify-center mt-8">
              <Button variant="outline" className="w-full max-w-sm border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 group">
                <span>Load More Teams</span>
                <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="h-3.5 w-3.5 inline" />
                </span>
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 