import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function RecentActivity() {
  const activities = [
    {
      id: 1,
      user: {
        name: "Sarah Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "SC",
      },
      action: "joined your team",
      target: "AI Innovation Challenge",
      time: "2 hours ago",
    },
    {
      id: 2,
      user: {
        name: "Michael Kim",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "MK",
      },
      action: "submitted a project",
      target: "Web3 Hackathon",
      time: "Yesterday",
    },
    {
      id: 3,
      user: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "AJ",
      },
      action: "commented on your submission",
      target: "Mobile App Challenge",
      time: "2 days ago",
    },
    {
      id: 4,
      user: {
        name: "Lisa Wang",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "LW",
      },
      action: "scheduled a mentor session",
      target: "Tomorrow at 3:00 PM",
      time: "3 days ago",
    },
    {
      id: 5,
      user: {
        name: "David Park",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "DP",
      },
      action: "invited you to collaborate",
      target: "AI Innovation Challenge",
      time: "4 days ago",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates from your hackathons and teams</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              <Avatar className="h-9 w-9 border border-slate-200">
                <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
                <AvatarFallback>{activity.user.initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm text-slate-900">
                  <span className="font-medium">{activity.user.name}</span> {activity.action}
                </p>
                <p className="text-sm font-medium text-violet-600">{activity.target}</p>
                <p className="text-xs text-slate-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
