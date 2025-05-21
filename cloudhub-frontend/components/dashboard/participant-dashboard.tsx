import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import {
  CalendarDays,
  Clock,
  Trophy,
  Users,
  ArrowRight,
  Calendar,
  FileText,
  Lightbulb,
  MessageSquare,
  Search,
  Bell,
  Zap,
  BarChart,
  TrendingUp,
  CheckCircle,
  Code,
  LayoutDashboard,
  Sparkles,
} from "lucide-react"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts"
import { useRef, useEffect, useState } from "react"
import Link from "next/link"

const hackathonData = [
  { month: "Jan", participants: 120, submissions: 45 },
  { month: "Feb", participants: 150, submissions: 60 },
  { month: "Mar", participants: 200, submissions: 80 },
  { month: "Apr", participants: 180, submissions: 70 },
  { month: "May", participants: 250, submissions: 100 },
  { month: "Jun", participants: 300, submissions: 120 },
]

const activityData = [
  { day: "Mon", value: 40 },
  { day: "Tue", value: 30 },
  { day: "Wed", value: 45 },
  { day: "Thu", value: 50 },
  { day: "Fri", value: 60 },
  { day: "Sat", value: 75 },
  { day: "Sun", value: 65 },
]

// Skills data with only first 4 skills shown
const skillsData = [
  { name: "React.js", level: 85 },
  { name: "AI/ML", level: 70 },
  { name: "Node.js", level: 75 },
  { name: "Web3", level: 60 },
]

// Full skills data (hidden by default)
const allSkillsData = [
  { name: "React.js", level: 85 },
  { name: "AI/ML", level: 70 },
  { name: "Node.js", level: 75 },
  { name: "Web3", level: 60 },
  { name: "Python", level: 82 },
  { name: "UI/UX", level: 78 },
  { name: "TypeScript", level: 65 },
  { name: "Cloud", level: 55 },
]

export default function ParticipantDashboard() {
  // Simulate loading state
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-8 pb-10 px-6 mt-6">
      {/* Welcome Section */}
      <section className="relative overflow-hidden rounded-2xl shadow-lg">
        {/* Gradient background with animated elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600"></div>
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
                <LayoutDashboard className="h-4 w-4 text-blue-200" />
                <span className="font-medium tracking-wide">Dashboard Overview</span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-violet-200">John!</span>
              </h1>
              
              <p className="text-white/90 text-lg mb-8 max-w-lg font-light">
                You have 2 active hackathons and 1 upcoming submission deadline.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button className="bg-white text-indigo-700 hover:bg-white/90 shadow-lg transition-all group px-5 py-2 h-auto text-sm font-medium rounded-xl border border-white/50" asChild>
                  <Link href="/dashboard/marketplace">
                    <Trophy className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                    <span>Browse Hackathons</span>
                  </Link>
                </Button>
                <Button variant="outline" className="text-white border-white/20 bg-white/10 hover:bg-white hover:text-indigo-700 backdrop-blur-xl transition-all group px-5 py-2 h-auto text-sm font-medium rounded-xl" asChild>
                  <Link href="/dashboard/teams">
                    <Users className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                    <span>View My Teams</span>
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="hidden md:flex justify-end">
              <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-5 w-full max-w-xs shadow-xl">
                <h3 className="font-medium mb-4 flex items-center text-white">
                  <Clock className="h-4 w-4 mr-2 text-amber-300" />
                  <span className="text-base">Upcoming Deadline</span>
                </h3>
                <div className="bg-white/10 rounded-lg backdrop-blur-md p-5 mb-4">
                  <Badge className="bg-amber-500/90 mb-3 border-0 px-3 py-1 text-xs">In 3 days</Badge>
                  <h4 className="font-medium text-white text-lg mb-1">AI Innovation Challenge</h4>
                  <p className="text-sm text-white/80 mb-4">Project submission due June 15, 2025</p>
                  <div className="mt-3 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" style={{ width: "65%" }}></div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-white/80">
                    <span>Progress</span>
                    <span className="font-medium">65%</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full text-white border-white/20 bg-white/10 hover:bg-white hover:text-indigo-700 backdrop-blur-xl transition-all group px-4 py-2 h-auto text-sm font-medium rounded-xl" asChild>
                  <Link href="/dashboard/projects/1">
                    <CalendarDays className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                    <span>View Submission Details</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden group cursor-pointer" onClick={() => window.location.href = '/dashboard/marketplace'}>
          <CardContent className="p-0">
            <div className="p-5">
              <div className="mb-3 flex justify-between items-start">
                <div className="h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-violet-600" />
                </div>
              </div>
              <h3 className="font-medium text-sm text-slate-500">Active Hackathons</h3>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-slate-900">3</p>
                <span className="text-xs text-green-600 font-medium">+1 this month</span>
              </div>
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-violet-500 to-indigo-500"></div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden group cursor-pointer" onClick={() => window.location.href = '/dashboard/teams'}>
          <CardContent className="p-0">
            <div className="p-5">
              <div className="mb-3 flex justify-between items-start">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <h3 className="font-medium text-sm text-slate-500">My Teams</h3>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-slate-900">2</p>
                <span className="text-xs text-slate-500 font-medium">Active now</span>
              </div>
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden group">
          <CardContent className="p-0">
            <div className="p-5">
              <div className="mb-3 flex justify-between items-start">
                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-amber-600" />
                </div>

              </div>
              <h3 className="font-medium text-sm text-slate-500">Submissions</h3>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-slate-900">5</p>
                <span className="text-xs text-green-600 font-medium">+2 new</span>
              </div>
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-amber-500 to-orange-500"></div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden group">
          <CardContent className="p-0">
            <div className="p-5">
              <div className="mb-3 flex justify-between items-start">
                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Lightbulb className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
              <h3 className="font-medium text-sm text-slate-500">Mentorship</h3>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-slate-900">2</p>
                <span className="text-xs text-amber-600 font-medium">Session today</span>
              </div>
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-green-500"></div>
          </CardContent>
        </Card>
      </div>

      {/* Tab content for hackathons and schedule */}
      <Tabs defaultValue="hackathons" className="w-full">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div className="inline-flex rounded-full bg-gradient-to-r from-slate-50 via-slate-50 to-slate-50 p-1.5 border border-slate-100 shadow-sm">
            <TabsList className="bg-transparent">
              <TabsTrigger 
                value="hackathons" 
                className="flex items-center gap-2 rounded-full px-4 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:via-indigo-500 data-[state=active]:to-violet-500 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-200"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500 text-white">
                  <Trophy className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm font-medium">My Hackathons</span>
              </TabsTrigger>
              <TabsTrigger 
                value="schedule" 
                className="flex items-center gap-2 rounded-full px-4 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:via-indigo-500 data-[state=active]:to-violet-500 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-200"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500 text-white">
                  <Calendar className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm font-medium">Schedule</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="hackathons" className="mt-0">
          <Card className="border-slate-200 shadow-none">
            <CardContent className="p-0">
              <div className="space-y-4 p-6">
                {[
                  {
                    id: 1,
                    title: "AI Innovation Challenge",
                    organizer: "TechCorp",
                    startDate: "2025-06-15",
                    endDate: "2025-06-17",
                    participants: 120,
                    maxParticipants: 150,
                    prizePool: "10,000 AED",
                    status: "Active",
                    progress: 65,
                    image: "/placeholder.svg?height=100&width=200",
                    technologies: ["TensorFlow", "Python", "React"],
                    teamSize: 4,
                  },
                  {
                    id: 2,
                    title: "Web3 Hackathon",
                    organizer: "Blockchain Foundation",
                    startDate: "2025-07-01",
                    endDate: "2025-07-03",
                    participants: 85,
                    maxParticipants: 200,
                    prizePool: "15,000 AED",
                    status: "Upcoming",
                    progress: 30,
                    image: "/placeholder.svg?height=100&width=200",
                    technologies: ["Solidity", "Ethereum", "Web3.js"],
                    teamSize: 3,
                  },
                ].map((hackathon) => (
                  <div
                    key={hackathon.id}
                    className="flex flex-col sm:flex-row gap-4 p-5 rounded-xl border border-slate-200 bg-white hover:border-violet-200 hover:shadow-md transition-all group relative overflow-hidden"
                  >
                    {/* Status indicator */}
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-violet-500 to-indigo-500 opacity-70 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div
                      className="w-full sm:w-32 h-24 bg-slate-100 rounded-lg flex-shrink-0 bg-cover bg-center overflow-hidden"
                      style={{ backgroundImage: `url(${hackathon.image})` }}
                    >
                      <div className="w-full h-full bg-gradient-to-tr from-violet-900/30 to-transparent"></div>
                    </div>
                    
                    <div className="flex-1 space-y-3 pl-1.5">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-slate-900 group-hover:text-violet-700 transition-colors">{hackathon.title}</h3>
                          <p className="text-sm text-slate-500">Organized by {hackathon.organizer}</p>
                        </div>
                        <Badge className={`${hackathon.status === "Active" ? "bg-emerald-500" : "bg-blue-500"} shadow-sm`}>
                          {hackathon.status}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-3 text-sm">
                        <div className="flex items-center gap-1 text-slate-700">
                          <CalendarDays className="h-4 w-4 text-slate-500" />
                          <span>
                            {new Date(hackathon.startDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}{" "}
                            -{" "}
                            {new Date(hackathon.endDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-700">
                          <Trophy className="h-4 w-4 text-slate-500" />
                          <span>{hackathon.prizePool} prize pool</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-700">
                          <Users className="h-4 w-4 text-slate-500" />
                          <span>Team Size: {hackathon.teamSize}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-1">
                        {hackathon.technologies.map((tech, index) => (
                          <HoverCard key={index}>
                            <HoverCardTrigger>
                              <Badge variant="outline" className="bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200 cursor-pointer">
                                {tech}
                              </Badge>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-60">
                              <div className="space-y-2">
                                <h4 className="font-medium">{tech}</h4>
                                <p className="text-sm text-slate-500">
                                  {tech === "TensorFlow" && "Machine learning framework used in this hackathon."}
                                  {tech === "Python" && "Primary programming language for AI development."}
                                  {tech === "React" && "Frontend JavaScript library for UI development."}
                                  {tech === "Solidity" && "Smart contract programming language for Ethereum."}
                                  {tech === "Ethereum" && "Blockchain platform used in this hackathon."}
                                  {tech === "Web3.js" && "JavaScript library for interacting with the Ethereum blockchain."}
                                </p>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        ))}
                      </div>
                      
                      <div className="pt-1">
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-slate-600">Your progress</span>
                          <span className="font-medium text-violet-700">{hackathon.progress}%</span>
                        </div>
                        <Progress value={hackathon.progress} className="h-1.5 bg-slate-100" indicatorClassName="bg-gradient-to-r from-violet-500 to-indigo-500" />
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex -space-x-2">
                          {[...Array(3)].map((_, i) => (
                            <Avatar key={i} className="h-7 w-7 border-2 border-white">
                              <AvatarImage src={`/placeholder.svg?height=28&width=28&text=${i+1}`} />
                              <AvatarFallback>T{i+1}</AvatarFallback>
                            </Avatar>
                          ))}
                          <div className="h-7 w-7 rounded-full bg-violet-100 text-violet-700 text-xs flex items-center justify-center border-2 border-white">
                            +{hackathon.teamSize - 3}
                          </div>
                        </div>
                        
                        <Button size="sm" className="gap-1 bg-white text-violet-700 border border-violet-200 hover:bg-violet-50 hover:text-violet-800 shadow-sm" asChild>
                          <Link href={`/dashboard/projects/${hackathon.id}`}>
                            View Project
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center p-6 pt-2">
                <Button variant="outline" className="w-full max-w-sm border-violet-200 text-violet-700 hover:bg-violet-50 hover:text-violet-800" asChild>
                  <Link href="/dashboard/marketplace">
                    Explore More Hackathons
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="mt-0">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2 border-slate-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">This Week's Schedule</CardTitle>
                <CardDescription>Your events for the next 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      id: 1,
                      title: "Team Meeting",
                      description: "AI Innovation Challenge",
                      date: "Today",
                      time: "3:00 PM - 4:00 PM",
                      type: "meeting",
                      link: "https://meet.google.com/abc-defg-hij",
                    },
                    {
                      id: 2,
                      title: "Mentor Session",
                      description: "With Dr. Emily Zhang",
                      date: "Tomorrow",
                      time: "2:00 PM - 3:00 PM",
                      type: "mentorship",
                      location: "Virtual",
                    },
                    {
                      id: 3,
                      title: "Submission Deadline",
                      description: "AI Innovation Challenge",
                      date: "Jun 15",
                      time: "11:59 PM",
                      type: "deadline",
                      important: true,
                    },
                    {
                      id: 4,
                      title: "Workshop: AI Ethics",
                      description: "By TechCorp",
                      date: "Jun 16",
                      time: "10:00 AM - 12:00 PM",
                      type: "workshop",
                      location: "Virtual",
                    },
                  ].map((event) => (
                    <div
                      key={event.id}
                      className={`flex gap-3 p-4 rounded-lg border ${
                        event.important 
                          ? "border-amber-200 bg-amber-50/50" 
                          : "border-slate-200 hover:border-violet-200"
                      } transition-all group`}
                    >
                      <div className="flex-shrink-0">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          event.type === "meeting" ? "bg-blue-100" : 
                          event.type === "mentorship" ? "bg-amber-100" :
                          event.type === "deadline" ? "bg-rose-100" :
                          "bg-emerald-100"
                        }`}>
                          {event.type === "meeting" && <Users className="h-5 w-5 text-blue-600" />}
                          {event.type === "mentorship" && <Lightbulb className="h-5 w-5 text-amber-600" />}
                          {event.type === "deadline" && <Clock className="h-5 w-5 text-rose-600" />}
                          {event.type === "workshop" && <Calendar className="h-5 w-5 text-emerald-600" />}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium text-slate-900 group-hover:text-violet-700 transition-colors">
                            {event.title}
                          </h4>
                          <div className="flex items-center gap-1.5">
                            <Badge variant="outline" className={`${
                              event.date === "Today" ? "border-emerald-200 text-emerald-700 bg-emerald-50" :
                              event.date === "Tomorrow" ? "border-blue-200 text-blue-700 bg-blue-50" :
                              "border-slate-200 text-slate-700 bg-slate-50"
                            }`}>
                              {event.date}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-sm text-slate-500 mt-0.5">{event.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                          <span className="text-xs text-violet-600 font-medium">
                            {event.time}
                          </span>
                          
                          {event.location && (
                            <span className="text-xs text-slate-500">
                              {event.location}
                            </span>
                          )}
                          
                          {event.link && (
                            <a 
                              href={event.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline"
                            >
                              Join Meeting
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">AI Tools Available</CardTitle>
                <CardDescription>Enhance your hackathon projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      name: "Code Generation",
                      description: "AI-powered code generation to speed up development",
                      icon: <Code className="h-5 w-5 text-violet-600" />,
                      new: true,
                    },
                    {
                      name: "Project Insights",
                      description: "Get AI recommendations for your projects",
                      icon: <Lightbulb className="h-5 w-5 text-amber-600" />,
                    },
                    {
                      name: "Smart Dashboard",
                      description: "AI-enhanced analytics and monitoring",
                      icon: <LayoutDashboard className="h-5 w-5 text-blue-600" />,
                    },
                    {
                      name: "AI Co-pilot",
                      description: "Get real-time help from AI assistants",
                      icon: <Sparkles className="h-5 w-5 text-emerald-600" />,
                      new: true,
                    },
                  ].map((tool, i) => (
                    <div 
                      key={i} 
                      className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:border-violet-200 hover:shadow-sm transition-all cursor-pointer group"
                    >
                      <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center">
                        {tool.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-slate-900 group-hover:text-violet-700 transition-colors">
                            {tool.name}
                          </h4>
                          {tool.new && (
                            <Badge className="bg-green-500 text-[10px] h-4">NEW</Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5">{tool.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button className="w-full mt-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700" asChild>
                  <Link href="/marketplace">
                    Explore AI Tools
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Activity & Messages */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Activity Chart */}
        <Card className="md:col-span-2 border-slate-200 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Your Activity</CardTitle>
              <CardDescription>Platform engagement over time</CardDescription>
            </div>
            <div className="bg-slate-100 rounded-md p-1">
              <Tabs defaultValue="weekly" className="w-full">
                <TabsList className="grid grid-cols-2 h-8 bg-slate-100">
                  <TabsTrigger value="weekly" className="text-xs px-3">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly" className="text-xs px-3">Monthly</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={activityData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                    itemStyle={{ color: "#7c3aed" }}
                    labelStyle={{ fontWeight: "bold", color: "#1e293b" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fill="url(#colorGradient)"
                    activeDot={{ r: 6, fill: "#7c3aed", stroke: "#ffffff", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex justify-between items-center mt-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-violet-500"></span>
                <span className="text-slate-600">Activity Score</span>
              </div>
              <div className="flex items-center gap-1 text-emerald-600 font-medium">
                <TrendingUp className="h-4 w-4" />
                <span>+12.5% from last week</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg">Recent Messages</CardTitle>
                <CardDescription>Your latest conversations</CardDescription>
              </div>
              <Badge className="bg-violet-500">3 New</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {[
                {
                  id: 1,
                  name: "Sarah Chen",
                  message: "Hey, how's the project coming along?",
                  time: "2h ago",
                  avatar: "/placeholder.svg?height=40&width=40",
                  unread: true,
                },
                {
                  id: 2,
                  name: "Team AI Innovators",
                  message: "Meeting scheduled for tomorrow at 3 PM",
                  time: "5h ago",
                  avatar: "/placeholder.svg?height=40&width=40",
                  unread: true,
                },
                {
                  id: 3,
                  name: "Dr. Emily Zhang",
                  message: "Looking forward to our mentorship session",
                  time: "Yesterday",
                  avatar: "/placeholder.svg?height=40&width=40",
                  unread: false,
                },
              ].map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    message.unread ? "bg-violet-50/50" : "hover:bg-slate-50"
                  } transition-all cursor-pointer`}
                >
                  <Avatar className="h-10 w-10 border border-slate-200">
                    <AvatarImage src={message.avatar || "/placeholder.svg"} alt={message.name} />
                    <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
                      {message.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-slate-900">{message.name}</h4>
                      <span className="text-xs text-slate-500">{message.time}</span>
                    </div>
                    <p className="text-sm text-slate-600 truncate">{message.message}</p>
                  </div>
                  {message.unread && (
                    <div className="h-2.5 w-2.5 rounded-full bg-violet-500 mt-2 animate-pulse"></div>
                  )}
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 gap-2">
              <MessageSquare className="h-4 w-4" />
              Open Messages
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Skills & Progress Section */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="pb-2 border-b border-slate-100">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  Your Skills
                  <Badge className="ml-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
                    Level 3
                  </Badge>
                </CardTitle>
                <CardDescription>Development areas and proficiency</CardDescription>
              </div>
              <Button size="sm" variant="ghost" className="text-violet-600 hover:bg-violet-50 hover:text-violet-700">
                Take Skill Assessment
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-6">
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-2 auto-rows-auto mb-4">
                {skillsData.map((skill, index) => (
                  <div key={index} className="group relative">
                    <div 
                      className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-indigo-500/10 rounded-lg transform scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300"
                    ></div>
                    <div className="relative p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-sm">
                            {skill.name === "React.js" && <div className="text-lg font-bold">R</div>}
                            {skill.name === "AI/ML" && <div className="text-lg font-bold">AI</div>}
                            {skill.name === "Node.js" && <div className="text-lg font-bold">N</div>}
                            {skill.name === "Web3" && <div className="text-lg font-bold">W3</div>}
                            {skill.name === "Python" && <div className="text-lg font-bold">PY</div>}
                            {skill.name === "UI/UX" && <div className="text-lg font-bold">UX</div>}
                            {skill.name === "TypeScript" && <div className="text-lg font-bold">TS</div>}
                            {skill.name === "Cloud" && <div className="text-lg font-bold">C</div>}
                          </div>
                          <h4 className="font-medium text-slate-900">{skill.name}</h4>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm font-semibold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full">{skill.level}%</span>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                        {skill.level >= 80 && (
                          <div className="absolute -right-1 -top-1 animate-pulse">
                            <div className="text-xs">🔥</div>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-center text-xs text-slate-500">
                        <span>Beginner</span>
                        <span>Intermediate</span>
                        <span>Advanced</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="px-0">
                <Button variant="outline" size="sm" className="w-full text-violet-600 hover:bg-violet-50 hover:text-violet-700 border-violet-200">
                  View All Skills ({allSkillsData.length})
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="pb-2 border-b border-slate-100">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg">Achievement Badges</CardTitle>
                <CardDescription>Your hackathon milestones</CardDescription>
              </div>
              <Badge className="bg-violet-500">3/4</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              {[
                { 
                  id: "first-hackathon", 
                  title: "First Hackathon", 
                  description: "Completed your first hackathon", 
                  icon: <Trophy className="h-9 w-9 text-amber-400" />,
                  achieved: true,
                  color: "from-amber-400 to-amber-600" 
                },
                { 
                  id: "team-leader", 
                  title: "Team Leader", 
                  description: "Led a team in a hackathon", 
                  icon: <Users className="h-9 w-9 text-blue-500" />, 
                  achieved: true,
                  color: "from-blue-500 to-indigo-500" 
                },
                { 
                  id: "prize-winner", 
                  title: "Prize Winner", 
                  description: "Won a prize in any category", 
                  icon: <Sparkles className="h-9 w-9 text-violet-500" />, 
                  achieved: false,
                  color: "from-violet-500 to-purple-600" 
                },
                { 
                  id: "mentor", 
                  title: "Mentor Connection", 
                  description: "Connected with a mentor", 
                  icon: <Lightbulb className="h-9 w-9 text-emerald-500" />, 
                  achieved: true,
                  color: "from-emerald-500 to-green-600" 
                },
              ].map((achievement) => (
                <div key={achievement.id} className="group">
                  <div className={`relative flex flex-col items-center p-4 rounded-xl border ${
                    achievement.achieved 
                      ? "border-slate-200 bg-white" 
                      : "border-slate-200 bg-slate-50 opacity-60"
                  } transition-all duration-300 hover:shadow-md group-hover:border-violet-200 text-center`}>
                    {achievement.achieved && (
                      <div className={`absolute top-2 right-2 h-4 w-4 rounded-full ring-2 ring-white bg-emerald-500 flex items-center justify-center`}>
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                    )}
                    
                    <div className={`relative h-16 w-16 rounded-full flex items-center justify-center mb-2 ${
                      achievement.achieved 
                        ? `bg-gradient-to-br ${achievement.color} text-white shadow-lg` 
                        : "bg-slate-200 text-slate-400"
                    }`}>
                      {achievement.icon}
                      
                      {achievement.achieved && (
                        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                      )}
                      
                      {achievement.achieved && (
                        <>
                          <div className="absolute -inset-1 rounded-full bg-gradient-to-br opacity-20 blur-sm"></div>
                          <div className="absolute -inset-0.5 rounded-full border border-white/30"></div>
                        </>
                      )}
                    </div>
                    <h4 className={`font-semibold text-sm ${achievement.achieved ? "text-slate-900" : "text-slate-600"}`}>
                      {achievement.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">{achievement.description}</p>
                    
                    {achievement.achieved ? (
                      <Badge className="mt-3 bg-violet-100 text-violet-700 hover:bg-violet-200 border-0 text-[10px]">
                        Earned
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="mt-3 text-slate-400 border-slate-300 text-[10px]">
                        Locked
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col items-center mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2 text-slate-600 text-sm mb-3">
                <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-amber-400 to-pink-600"></div>
                <span>Next Achievement: 10 Hackathon Points</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full w-[75%] bg-gradient-to-r from-amber-400 via-pink-500 to-violet-600 rounded-full"></div>
              </div>
              <div className="flex justify-between w-full mt-2 text-xs text-slate-500">
                <span>25 pts</span>
                <span>50 pts</span>
                <span>75 pts</span>
                <span>100 pts</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
