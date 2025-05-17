import { CalendarDays, Users, Trophy, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function UpcomingHackathons() {
  const hackathons = [
    {
      id: 1,
      title: "AI Innovation Challenge",
      organizer: "TechCorp",
      startDate: "2025-06-15",
      endDate: "2025-06-17",
      participants: 120,
      maxParticipants: 150,
      prizePool: "10,000 AED",
      status: "Upcoming",
      daysLeft: 28,
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
      status: "Registration Open",
      daysLeft: 44,
      image: "/placeholder.svg?height=100&width=200",
    },
    {
      id: 3,
      title: "Mobile App Challenge",
      organizer: "AppDev Community",
      startDate: "2025-06-10",
      endDate: "2025-06-12",
      participants: 95,
      maxParticipants: 100,
      prizePool: "5,000 AED",
      status: "Almost Full",
      daysLeft: 23,
      image: "/placeholder.svg?height=100&width=200",
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Upcoming Hackathons</CardTitle>
          <CardDescription>Your upcoming and registered hackathon events</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="gap-1 text-slate-700 border-slate-200">
          View All
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {hackathons.map((hackathon) => (
            <div
              key={hackathon.id}
              className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg border border-slate-200 bg-white hover:border-violet-200 hover:shadow-sm transition-all"
            >
              <div
                className="w-full sm:w-24 h-24 bg-slate-100 rounded-md flex-shrink-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${hackathon.image})` }}
              ></div>
              <div className="flex-1 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h3 className="font-semibold text-slate-900">{hackathon.title}</h3>
                  <Badge
                    className={
                      hackathon.status === "Almost Full"
                        ? "bg-amber-500"
                        : hackathon.status === "Registration Open"
                          ? "bg-emerald-500"
                          : "bg-violet-500"
                    }
                  >
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
                    <Users className="h-4 w-4 text-slate-500" />
                    <span>
                      {hackathon.participants}/{hackathon.maxParticipants} participants
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-700">
                    <Trophy className="h-4 w-4 text-slate-500" />
                    <span>{hackathon.prizePool} prize pool</span>
                  </div>
                </div>
                <div className="pt-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Registration progress</span>
                    <span className="font-medium">
                      {Math.round((hackathon.participants / hackathon.maxParticipants) * 100)}%
                    </span>
                  </div>
                  <Progress value={(hackathon.participants / hackathon.maxParticipants) * 100} className="h-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t border-slate-200 pt-4">
        <Button className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
          Create New Hackathon
        </Button>
      </CardFooter>
    </Card>
  )
}
