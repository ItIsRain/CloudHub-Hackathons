import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CalendarDays,
  Trophy,
  Users,
  ArrowRight,
  Sparkles,
  FileText,
  BarChart3,
  DollarSign,
  Award,
  Megaphone,
  PlusCircle,
  ChevronRight,
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
} from "recharts"

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

export default function OrganizerDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="grid gap-6 md:grid-cols-2 items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Organizer Dashboard</h1>
            <p className="text-white/80 mb-4">You have 2 active hackathons with 450 total participants.</p>
            <div className="flex flex-wrap gap-3">
              <Button className="bg-white text-blue-700 hover:bg-white/90">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Hackathon
              </Button>
              <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
                Manage Events
              </Button>
            </div>
          </div>
          <div className="hidden md:flex justify-end">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-4 w-full max-w-xs">
              <h3 className="font-medium mb-3 flex items-center">
                <Sparkles className="h-4 w-4 mr-2" />
                Featured Hackathon
              </h3>
              <div className="bg-white/10 rounded-lg p-3 mb-3">
                <h4 className="font-medium">AI Innovation Challenge</h4>
                <p className="text-sm text-white/70 mb-2">450 participants registered</p>
                <div className="flex justify-between text-xs mb-1">
                  <span>Progress</span>
                  <span>65%</span>
                </div>
                <Progress value={65} className="h-1.5 bg-white/20" indicatorClassName="bg-white" />
              </div>
              <Button variant="outline" size="sm" className="w-full text-white border-white/20 hover:bg-white/10">
                View Details
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
              <Trophy className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-medium text-slate-900">Active Hackathons</h3>
            <p className="text-2xl font-bold text-blue-700 mt-1">2</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-3">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-medium text-slate-900">Total Participants</h3>
            <p className="text-2xl font-bold text-purple-700 mt-1">450</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-pink-50 to-white border-pink-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center mb-3">
              <FileText className="h-6 w-6 text-pink-600" />
            </div>
            <h3 className="font-medium text-slate-900">Submissions</h3>
            <p className="text-2xl font-bold text-pink-700 mt-1">135</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
              <DollarSign className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="font-medium text-slate-900">Prize Pool</h3>
            <p className="text-2xl font-bold text-emerald-700 mt-1">25K AED</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Participant Analytics */}
        <Card className="lg:col-span-2 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-slate-900">Participant Analytics</CardTitle>
              <CardDescription className="text-slate-500">Overview of participant engagement</CardDescription>
            </div>
            <Tabs defaultValue="all" className="w-[250px]">
              <TabsList className="grid w-full grid-cols-3 bg-slate-50">
                <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-blue-600">All</TabsTrigger>
                <TabsTrigger value="ai-challenge" className="data-[state=active]:bg-white data-[state=active]:text-blue-600">AI Challenge</TabsTrigger>
                <TabsTrigger value="web3" className="data-[state=active]:bg-white data-[state=active]:text-blue-600">Web3</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
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
                      <Line
                        type="monotone"
                        dataKey="value"
                        name="Submissions"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: 4, fill: "#3b82f6" }}
                        activeDot={{ r: 6, fill: "#3b82f6" }}
                      />
                    </LineChart>
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
          <CardHeader className="pb-2">
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
                  link: "/dashboard/submissions",
                },
                {
                  title: "Manage Judges",
                  description: "Assign judges to projects",
                  icon: <Award className="h-5 w-5 text-amber-600" />,
                  link: "/dashboard/judging",
                },
                {
                  title: "Send Announcements",
                  description: "Update participants",
                  icon: <Megaphone className="h-5 w-5 text-emerald-600" />,
                  link: "/dashboard/announcements",
                },
                {
                  title: "View Analytics",
                  description: "Track hackathon performance",
                  icon: <BarChart3 className="h-5 w-5 text-[#2684ff]" />,
                  link: "/dashboard/analytics",
                },
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
            <Button className="w-full mt-4 bg-[#2684ff] hover:bg-blue-700">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create New Hackathon
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Hackathons & Upcoming Tasks */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Your Hackathons */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Your Hackathons</CardTitle>
              <CardDescription>Manage your active events</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-1 text-[#2684ff]">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
                },
              ].map((hackathon) => (
                <div
                  key={hackathon.id}
                  className="flex gap-4 p-4 rounded-lg border border-slate-200 bg-white hover:border-blue-200 hover:shadow-sm transition-all"
                >
                  <div
                    className="w-16 h-16 bg-slate-100 rounded-md flex-shrink-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${hackathon.image})` }}
                  ></div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900">{hackathon.title}</h3>
                      <Badge className={hackathon.status === "Active" ? "bg-emerald-500" : "bg-[#2684ff]"}>
                        {hackathon.status}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs">
                      <div className="flex items-center gap-1 text-slate-700">
                        <CalendarDays className="h-3.5 w-3.5 text-slate-500" />
                        <span>
                          {new Date(hackathon.startDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}{" "}
                          -{" "}
                          {new Date(hackathon.endDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-700">
                        <Users className="h-3.5 w-3.5 text-slate-500" />
                        <span>
                          {hackathon.participants}/{hackathon.maxParticipants}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-700">
                        <Trophy className="h-3.5 w-3.5 text-slate-500" />
                        <span>{hackathon.prizePool}</span>
                      </div>
                    </div>

                    <div className="pt-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span className="font-medium">{hackathon.progress}%</span>
                      </div>
                      <Progress value={hackathon.progress} className="h-1.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Upcoming Tasks</CardTitle>
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
                  priority: "high",
                },
                {
                  id: 2,
                  title: "Finalize Judges",
                  description: "Web3 Hackathon - 3 judges needed",
                  dueDate: "Tomorrow",
                  priority: "medium",
                },
                {
                  id: 3,
                  title: "Send Reminder Email",
                  description: "AI Innovation Challenge participants",
                  dueDate: "Jun 14",
                  priority: "medium",
                },
                {
                  id: 4,
                  title: "Prepare Prize Distribution",
                  description: "AI Innovation Challenge winners",
                  dueDate: "Jun 18",
                  priority: "low",
                },
              ].map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:border-blue-200 transition-all"
                >
                  <div className="flex-shrink-0 pt-0.5">
                    <div
                      className={`h-5 w-5 rounded-full border-2 ${
                        task.priority === "high"
                          ? "border-rose-500"
                          : task.priority === "medium"
                            ? "border-amber-500"
                            : "border-emerald-500"
                      }`}
                    ></div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900">{task.title}</h4>
                    <p className="text-sm text-slate-500">{task.description}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs">
                      <span
                        className={`font-medium ${
                          task.dueDate === "Today"
                            ? "text-rose-600"
                            : task.dueDate === "Tomorrow"
                              ? "text-amber-600"
                              : "text-slate-600"
                        }`}
                      >
                        Due: {task.dueDate}
                      </span>
                      <Badge
                        className={`${
                          task.priority === "high"
                            ? "bg-rose-100 text-rose-700"
                            : task.priority === "medium"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4">
              View All Tasks
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
