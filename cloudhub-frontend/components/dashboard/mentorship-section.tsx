import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock } from "lucide-react"

export default function MentorshipSection() {
  const upcomingSession = {
    mentor: {
      name: "Dr. Emily Zhang",
      role: "AI Research Scientist",
      avatar: "/placeholder.svg?height=60&width=60",
      initials: "EZ",
    },
    date: "May 18, 2025",
    time: "3:00 PM - 4:00 PM",
    topic: "Machine Learning Model Optimization",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mentorship</CardTitle>
        <CardDescription>Your upcoming mentor sessions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-lg border border-slate-200 p-4 bg-white">
          <div className="flex flex-col items-center text-center">
            <Badge className="mb-3 bg-violet-100 text-violet-700 hover:bg-violet-100 hover:text-violet-800">
              Upcoming Session
            </Badge>
            <Avatar className="h-16 w-16 border-2 border-violet-100">
              <AvatarImage
                src={upcomingSession.mentor.avatar || "/placeholder.svg"}
                alt={upcomingSession.mentor.name}
              />
              <AvatarFallback>{upcomingSession.mentor.initials}</AvatarFallback>
            </Avatar>
            <h3 className="mt-3 font-semibold text-slate-900">{upcomingSession.mentor.name}</h3>
            <p className="text-sm text-slate-500">{upcomingSession.mentor.role}</p>

            <div className="w-full mt-4 space-y-2">
              <div className="flex items-center justify-center gap-1 text-sm text-slate-700">
                <CalendarDays className="h-4 w-4 text-violet-500" />
                <span>{upcomingSession.date}</span>
              </div>
              <div className="flex items-center justify-center gap-1 text-sm text-slate-700">
                <Clock className="h-4 w-4 text-violet-500" />
                <span>{upcomingSession.time}</span>
              </div>
            </div>

            <div className="mt-3 w-full p-2 bg-slate-50 rounded-md text-sm">
              <span className="text-slate-700">{upcomingSession.topic}</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 w-full">
              <Button variant="outline" size="sm" className="border-slate-200">
                Reschedule
              </Button>
              <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
                Join Call
              </Button>
            </div>
          </div>
        </div>

        <Button variant="outline" className="w-full border-slate-200 text-slate-700">
          Find a Mentor
        </Button>
      </CardContent>
    </Card>
  )
}
