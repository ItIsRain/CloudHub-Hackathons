import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
} from "lucide-react"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

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

export default function ParticipantDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="grid gap-6 md:grid-cols-2 items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, John!</h1>
            <p className="text-white/80 mb-4">You have 2 active hackathons and 1 upcoming submission deadline.</p>
            <div className="flex flex-wrap gap-3">
              <Button className="bg-white text-blue-700 hover:bg-white/90">Browse Hackathons</Button>
              <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
                View My Teams
              </Button>
            </div>
          </div>
          <div className="hidden md:flex justify-end">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-4 w-full max-w-xs">
              <h3 className="font-medium mb-3 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Upcoming Deadline
              </h3>
              <div className="bg-white/10 rounded-lg p-3 mb-3">
                <Badge className="bg-amber-500 mb-2">In 3 days</Badge>
                <h4 className="font-medium">AI Innovation Challenge</h4>
                <p className="text-sm text-white/70">Project submission due June 15, 2025</p>
              </div>
              <Button variant="outline" size="sm" className="w-full text-white border-white/20 hover:bg-white/10">
                View Submission Details
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
              <Trophy className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-medium text-slate-900">My Hackathons</h3>
            <p className="text-2xl font-bold text-blue-700 mt-1">3</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-3">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-medium text-slate-900">My Teams</h3>
            <p className="text-2xl font-bold text-purple-700 mt-1">2</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-pink-50 to-white border-pink-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center mb-3">
              <FileText className="h-6 w-6 text-pink-600" />
            </div>
            <h3 className="font-medium text-slate-900">Submissions</h3>
            <p className="text-2xl font-bold text-pink-700 mt-1">5</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
              <Lightbulb className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="font-medium text-slate-900">Mentorship</h3>
            <p className="text-2xl font-bold text-emerald-700 mt-1">2</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Active Hackathons */}
        <Card className="lg:col-span-2 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-slate-900">Active Hackathons</CardTitle>
              <CardDescription className="text-slate-500">Your current and upcoming hackathon events</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-1 text-blue-600">
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
                  organizer: "TechCorp",
                  startDate: "2025-06-15",
                  endDate: "2025-06-17",
                  participants: 120,
                  maxParticipants: 150,
                  prizePool: "10,000 AED",
                  status: "Active",
                  progress: 65,
                  image: "/placeholder.svg?height=100&width=200",
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
                },
              ].map((hackathon) => (
                <div
                  key={hackathon.id}
                  className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg border border-slate-200 bg-white hover:border-blue-200 hover:shadow-sm transition-all"
                >
                  <div
                    className="w-full sm:w-24 h-24 bg-slate-100 rounded-md flex-shrink-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${hackathon.image})` }}
                  ></div>
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <h3 className="font-semibold text-slate-900">{hackathon.title}</h3>
                      <Badge className={hackathon.status === "Active" ? "bg-emerald-500" : "bg-blue-500"}>
                        {hackathon.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500">Organized by {hackathon.organizer}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
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
                    </div>
                    <div className="pt-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Your progress</span>
                        <span className="font-medium">{hackathon.progress}%</span>
                      </div>
                      <Progress value={hackathon.progress} className="h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Schedule */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Upcoming Schedule</CardTitle>
            <CardDescription>Your events for the next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  id: 1,
                  title: "Team Meeting",
                  description: "AI Innovation Challenge",
                  date: "Today",
                  time: "3:00 PM - 4:00 PM",
                  type: "meeting",
                },
                {
                  id: 2,
                  title: "Mentor Session",
                  description: "With Dr. Emily Zhang",
                  date: "Tomorrow",
                  time: "2:00 PM - 3:00 PM",
                  type: "mentorship",
                },
                {
                  id: 3,
                  title: "Submission Deadline",
                  description: "AI Innovation Challenge",
                  date: "Jun 15",
                  time: "11:59 PM",
                  type: "deadline",
                },
                {
                  id: 4,
                  title: "Workshop: AI Ethics",
                  description: "By TechCorp",
                  date: "Jun 16",
                  time: "10:00 AM - 12:00 PM",
                  type: "workshop",
                },
              ].map((event) => (
                <div
                  key={event.id}
                  className="flex gap-3 p-3 rounded-lg border border-slate-200 hover:border-violet-200 transition-all"
                >
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center bg-blue-100">
                      {event.type === "meeting" && <Users className="h-5 w-5 text-[#2684ff]" />}
                      {event.type === "mentorship" && <Lightbulb className="h-5 w-5 text-amber-600" />}
                      {event.type === "deadline" && <Clock className="h-5 w-5 text-rose-600" />}
                      {event.type === "workshop" && <Calendar className="h-5 w-5 text-emerald-600" />}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900">{event.title}</h4>
                    <p className="text-sm text-slate-500">{event.description}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs">
                      <span className="font-medium text-[#2684ff]">{event.date}</span>
                      <span className="text-slate-500">{event.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4">
              View Full Calendar
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Activity & Messages */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Activity Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Your Activity</CardTitle>
            <CardDescription>Your platform engagement over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={activityData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" />
                  <YAxis />
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
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#8b5cf6" }}
                    activeDot={{ r: 6, fill: "#8b5cf6" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Recent Messages</CardTitle>
            <CardDescription>Your latest conversations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <Avatar className="h-9 w-9 border border-slate-200">
                    <AvatarImage src={message.avatar || "/placeholder.svg"} alt={message.name} />
                    <AvatarFallback>{message.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-slate-900">{message.name}</h4>
                      <span className="text-xs text-slate-500">{message.time}</span>
                    </div>
                    <p className="text-sm text-slate-600 truncate">{message.message}</p>
                  </div>
                  {message.unread && <div className="h-2 w-2 rounded-full bg-[#2684ff] mt-2"></div>}
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 gap-2">
              <MessageSquare className="h-4 w-4" />
              Open Messages
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
