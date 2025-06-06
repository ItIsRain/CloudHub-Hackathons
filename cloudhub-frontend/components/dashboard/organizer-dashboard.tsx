import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { useAuth } from "@/contexts/auth-context"
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
  BarChart3,
  DollarSign,
  Award,
  Megaphone,
  PlusCircle,
  ChevronRight,
  LayoutDashboard,
  Sparkles,
  Search
} from "lucide-react"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts"
import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const participantData = [
  { name: "Registered", value: 450 },
  { name: "Active", value: 350 },
  { name: "Submitted", value: 200 },
]

const COLORS = ["#8b5cf6", "#6366f1", "#a855f7"]

const submissionData = [
  { day: "Mon", value: 5 },
  { day: "Tue", value: 8 },
  { day: "Wed", value: 12 },
  { day: "Thu", value: 15 },
  { day: "Fri", value: 25 },
  { day: "Sat", value: 30 },
  { day: "Sun", value: 40 },
]

const hackathonData = [
  { month: "Jan", participants: 120, submissions: 45 },
  { month: "Feb", participants: 150, submissions: 60 },
  { month: "Mar", participants: 200, submissions: 80 },
  { month: "Apr", participants: 180, submissions: 70 },
  { month: "May", participants: 250, submissions: 100 },
  { month: "Jun", participants: 300, submissions: 120 },
]

interface Hackathon {
  id: string;
  title: string;
  description: string;
  status: string;
  participants_count: number;
  submission_count: number;
  prizePool: string;
  progress: number;
  maxParticipants: number;
}

export default function OrganizerDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [ownedHackathons, setOwnedHackathons] = useState<Hackathon[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Get first name from full name
  const firstName = user?.full_name?.split(' ')[0] || 'Admin';

  // Stats
  const [stats, setStats] = useState({
    activeHackathons: 0,
    totalParticipants: 0,
    totalSubmissions: 0,
    totalPrizePool: 0
  });

  // Featured hackathon
  const [featuredHackathon, setFeaturedHackathon] = useState<Hackathon | null>(null);

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('access_token');
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Fetch owned hackathons
        const response = await fetch('http://localhost:8000/api/hackathons/my-hackathons', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch hackathons');
        }

        const data = await response.json();
        const hackathons: Hackathon[] = data.hackathons || [];
        setOwnedHackathons(hackathons);

        // Calculate stats
        const activeHacks = hackathons.filter(h => h.status.toLowerCase() === 'active');
        const totalParticipants = hackathons.reduce((sum, h) => sum + (h.participants_count || 0), 0);
        const totalSubmissions = hackathons.reduce((sum, h) => sum + (h.submission_count || 0), 0);
        const totalPrize = hackathons.reduce((sum, h) => sum + parseFloat(h.prizePool || '0'), 0);

        setStats({
          activeHackathons: activeHacks.length,
          totalParticipants,
          totalSubmissions,
          totalPrizePool: totalPrize
        });

        // Set featured hackathon (first active one or first in list)
        const featured = activeHacks[0] || hackathons[0];
        setFeaturedHackathon(featured);

      } catch (error: any) {
        console.error('Error fetching hackathons:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHackathons();
  }, []);

  return (
    <div className="space-y-8 pb-10 px-6 mt-6">
      {/* Welcome Section */}
      <section className="relative overflow-hidden rounded-2xl shadow-lg">
        {/* Gradient background with animated elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
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
                <span className="font-medium tracking-wide">Organizer Overview</span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-violet-200">{firstName}!</span>
              </h1>
              
              <p className="text-white/90 text-lg mb-8 max-w-lg font-light">
                You have {stats.activeHackathons} active hackathons with {stats.totalParticipants} total participants.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button className="bg-white text-indigo-700 hover:bg-white/90 shadow-lg transition-all group px-5 py-2 h-auto text-sm font-medium rounded-xl border border-white/50" asChild>
                  <Link href="/dashboard/organizer/my-hackathons">
                    <PlusCircle className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                    <span>Create Hackathon</span>
                  </Link>
                </Button>
              </div>
            </div>
            
            {featuredHackathon && (
              <div className="hidden md:flex justify-end">
                <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-5 w-full max-w-xs shadow-xl">
                  <h3 className="font-medium mb-4 flex items-center text-white">
                    <Sparkles className="h-4 w-4 mr-2 text-amber-300" />
                    <span className="text-base">Featured Hackathon</span>
                  </h3>
                  <div className="bg-white/10 rounded-lg backdrop-blur-md p-5 mb-4">
                    <Badge className="bg-emerald-500/90 mb-3 border-0 px-3 py-1 text-xs">
                      {featuredHackathon.status}
                    </Badge>
                    <h4 className="font-medium text-white text-lg mb-1">{featuredHackathon.title}</h4>
                    <p className="text-sm text-white/80 mb-4">{featuredHackathon.participants_count} participants registered</p>
                    <div className="mt-3 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full" 
                        style={{ width: `${featuredHackathon.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-white/80">
                      <span>Progress</span>
                      <span className="font-medium">{featuredHackathon.progress}%</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full text-white border-white/20 bg-white/10 hover:bg-white hover:text-indigo-700 backdrop-blur-xl transition-all group px-4 py-2 h-auto text-sm font-medium rounded-xl" asChild>
                    <Link href={`/dashboard/organizer/hackathons/${featuredHackathon.id}`}>
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      <span>View Details</span>
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden group cursor-pointer" onClick={() => window.location.href = '/dashboard/organizer/my-hackathons'}>
          <CardContent className="p-0">
            <div className="p-5">
              <div className="mb-3 flex justify-between items-start">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <h3 className="font-medium text-sm text-slate-500">Active Hackathons</h3>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-slate-900">{stats.activeHackathons}</p>
                <span className="text-xs text-green-600 font-medium">+{Math.min(stats.activeHackathons, 1)} this month</span>
              </div>
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden group cursor-pointer" onClick={() => window.location.href = '/dashboard/participants'}>
          <CardContent className="p-0">
            <div className="p-5">
              <div className="mb-3 flex justify-between items-start">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <h3 className="font-medium text-sm text-slate-500">Total Participants</h3>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-slate-900">{stats.totalParticipants}</p>
                <span className="text-xs text-green-600 font-medium">+{Math.min(stats.totalParticipants, 50)} this week</span>
              </div>
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden group" onClick={() => window.location.href = '/dashboard/submissions'}>
          <CardContent className="p-0">
            <div className="p-5">
              <div className="mb-3 flex justify-between items-start">
                <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-pink-600" />
                </div>
              </div>
              <h3 className="font-medium text-sm text-slate-500">Submissions</h3>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-slate-900">{stats.totalSubmissions}</p>
                <span className="text-xs text-green-600 font-medium">+{Math.min(stats.totalSubmissions, 15)} new</span>
              </div>
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-pink-500 to-rose-500"></div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden group" onClick={() => window.location.href = '/dashboard/judging'}>
          <CardContent className="p-0">
            <div className="p-5">
              <div className="mb-3 flex justify-between items-start">
                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Award className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
              <h3 className="font-medium text-sm text-slate-500">Prize Pool</h3>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-slate-900">{stats.totalPrizePool}K</p>
                <span className="text-xs text-amber-600 font-medium">AED total</span>
              </div>
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-green-500"></div>
          </CardContent>
        </Card>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p>{error}</p>
        </div>
      )}

      {/* Analytics Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Participant Analytics */}
        <Card className="lg:col-span-2 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-slate-900">Participant Analytics</CardTitle>
              <CardDescription className="text-slate-500">Overview of participant engagement</CardDescription>
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px] bg-white border-slate-200">
                <SelectValue placeholder="Select hackathon" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Hackathons</SelectItem>
                <SelectItem value="ai-challenge">AI Challenge</SelectItem>
                <SelectItem value="web3">Web3 Hackathon</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-slate-500 mb-3">Submission Trends</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={submissionData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="day" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "8px",
                          border: "1px solid #e2e8f0",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        name="Submissions"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fill="url(#colorSubmissions)"
                        activeDot={{ r: 6, fill: "#3b82f6" }}
                      />
                      <defs>
                        <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-3">Participant Status</h3>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={participantData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {participantData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "8px",
                          border: "1px solid #e2e8f0",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-2">
                  {participantData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index] }}></div>
                        <span className="text-sm text-slate-600">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your hackathons</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                {
                  title: "Review Submissions",
                  description: "15 new submissions to review",
                  icon: <FileText className="h-5 w-5 text-[#2684ff]" />,
                  link: "/dashboard/organizer/judging",
                },
                {
                  title: "Manage Judges",
                  description: "Assign judges to projects",
                  icon: <Award className="h-5 w-5 text-amber-600" />,
                  link: "/dashboard/organizer/judging",
                },
                {
                  title: "Send Announcements",
                  description: "Update participants",
                  icon: <Megaphone className="h-5 w-5 text-emerald-600" />,
                  link: "/dashboard/organizer/announcements",
                }
              ].map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-between h-auto py-3 px-4 border-slate-200 hover:border-blue-200 hover:bg-blue-50"
                  asChild
                >
                  <a href={action.link}>
                    <div className="flex items-center">
                      <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center mr-3">
                        {action.icon}
                      </div>
                      <div className="text-left">
                        <h4 className="font-medium text-slate-900">{action.title}</h4>
                        <p className="text-xs text-slate-500">{action.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-400" />
                  </a>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab content for hackathons and tasks */}
      <Tabs defaultValue="hackathons" className="w-full">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div className="inline-flex rounded-full bg-gradient-to-r from-slate-50 via-slate-50 to-slate-50 p-1.5 border border-slate-100 shadow-sm">
            <TabsList className="bg-transparent">
              <TabsTrigger 
                value="hackathons" 
                className="flex items-center gap-2 rounded-full px-4 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:via-indigo-500 data-[state=active]:to-violet-500 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-200"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white">
                  <Trophy className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm font-medium">Active Hackathons</span>
              </TabsTrigger>
              <TabsTrigger 
                value="tasks" 
                className="flex items-center gap-2 rounded-full px-4 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:via-indigo-500 data-[state=active]:to-violet-500 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all duration-200"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-white">
                  <Clock className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm font-medium">Upcoming Tasks</span>
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
                    startDate: "2025-06-15",
                    endDate: "2025-06-17",
                    participants: 250,
                    maxParticipants: 300,
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
                    startDate: "2025-07-01",
                    endDate: "2025-07-03",
                    participants: 200,
                    maxParticipants: 500,
                    prizePool: "15,000 AED",
                    status: "Active",
                    progress: 40,
                    image: "/placeholder.svg?height=100&width=200",
                    technologies: ["Solidity", "Ethereum", "Web3.js"],
                    teamSize: 3,
                  },
                ].map((hackathon) => (
                  <div
                    key={hackathon.id}
                    className="flex flex-col sm:flex-row gap-4 p-5 rounded-xl border border-slate-200 bg-white hover:border-blue-200 hover:shadow-md transition-all group relative overflow-hidden"
                  >
                    {/* Status indicator */}
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-500 to-indigo-500 opacity-70 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div
                      className="w-full sm:w-32 h-24 bg-slate-100 rounded-lg flex-shrink-0 bg-cover bg-center overflow-hidden"
                      style={{ backgroundImage: `url(${hackathon.image})` }}
                    >
                      <div className="w-full h-full bg-gradient-to-tr from-blue-900/30 to-transparent"></div>
                    </div>
                    
                    <div className="flex-1 space-y-3 pl-1.5">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">{hackathon.title}</h3>
                          <p className="text-sm text-slate-500">Organized by you</p>
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
                          <span>
                            {hackathon.participants}/{hackathon.maxParticipants} participants
                          </span>
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
                          <span className="text-slate-600">Progress</span>
                          <span className="font-medium text-blue-700">{hackathon.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300" 
                            style={{ width: `${hackathon.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex -space-x-2">
                          {[...Array(3)].map((_, i) => (
                            <Avatar key={i} className="h-7 w-7 border-2 border-white">
                              <AvatarImage src={`/placeholder.svg?height=28&width=28&text=${i+1}`} />
                              <AvatarFallback>P{i+1}</AvatarFallback>
                            </Avatar>
                          ))}
                          <div className="h-7 w-7 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center border-2 border-white">
                            +{hackathon.participants > 3 ? hackathon.participants - 3 : 0}
                          </div>
                        </div>
                        
                        <Button size="sm" className="gap-1 bg-white text-blue-700 border border-blue-200 hover:bg-blue-50 hover:text-blue-800 shadow-sm" asChild>
                          <Link href={`/dashboard/hackathons/${hackathon.id}`}>
                            Manage
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center p-6 pt-2">
                <Button variant="outline" className="w-full max-w-sm border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800" asChild>
                  <Link href="/dashboard/organizer/my-hackathons">
                    Manage All Hackathons
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="mt-0">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Upcoming Tasks</CardTitle>
              <CardDescription>Your organizer to-do list</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    title: "Review Submissions",
                    description: "AI Innovation Challenge - 15 pending",
                    dueDate: "Today",
                    time: "By 11:59 PM",
                    priority: "high",
                    type: "review",
                    link: "/dashboard/submissions",
                  },
                  {
                    id: 2,
                    title: "Finalize Judges",
                    description: "Web3 Hackathon - 3 judges needed",
                    dueDate: "Tomorrow",
                    time: "By 5:00 PM",
                    priority: "medium",
                    type: "judge",
                    link: "/dashboard/judging",
                  },
                  {
                    id: 3,
                    title: "Send Reminder Email",
                    description: "AI Innovation Challenge participants",
                    dueDate: "Jun 14",
                    time: "Morning",
                    priority: "medium",
                    type: "announcement",
                    link: "/dashboard/announcements",
                  },
                  {
                    id: 4,
                    title: "Prepare Prize Distribution",
                    description: "AI Innovation Challenge winners",
                    dueDate: "Jun 18",
                    time: "End of day",
                    priority: "low",
                    type: "prize",
                    link: "/dashboard/prizes",
                  },
                ].map((task) => (
                  <div
                    key={task.id}
                    className={`flex gap-3 p-4 rounded-lg border ${
                      task.priority === "high" 
                        ? "border-rose-200 bg-rose-50/50" 
                        : task.priority === "medium"
                          ? "border-amber-200 bg-amber-50/50"
                          : "border-slate-200 hover:border-blue-200"
                    } transition-all group`}
                  >
                    <div className="flex-shrink-0">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        task.type === "review" ? "bg-rose-100" : 
                        task.type === "judge" ? "bg-amber-100" :
                        task.type === "announcement" ? "bg-blue-100" :
                        "bg-emerald-100"
                      }`}>
                        {task.type === "review" && <FileText className="h-5 w-5 text-rose-600" />}
                        {task.type === "judge" && <Award className="h-5 w-5 text-amber-600" />}
                        {task.type === "announcement" && <Megaphone className="h-5 w-5 text-blue-600" />}
                        {task.type === "prize" && <Trophy className="h-5 w-5 text-emerald-600" />}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-slate-900 group-hover:text-blue-700 transition-colors">
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-1.5">
                          <Badge variant="outline" className={`${
                            task.dueDate === "Today" ? "border-rose-200 text-rose-700 bg-rose-50" :
                            task.dueDate === "Tomorrow" ? "border-amber-200 text-amber-700 bg-amber-50" :
                            "border-slate-200 text-slate-700 bg-slate-50"
                          }`}>
                            {task.dueDate}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">{task.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{task.time}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-blue-700 hover:text-blue-800 hover:bg-blue-50" asChild>
                          <Link href={task.link}>
                            Take Action
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-4">
                <Button variant="outline" className="w-full max-w-sm border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800" asChild>
                  <Link href="/dashboard/tasks">
                    View All Tasks
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
