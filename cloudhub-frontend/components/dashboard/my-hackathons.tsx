"use client"

import { useState } from "react"
import { 
  Calendar, Trophy, Users, Clock, Globe, CalendarDays, 
  MapPin, Code, Rocket, Bell, GitPullRequest, PlusCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// Types
interface TeamMember {
  id: number;
  name: string;
  avatar: string;
  isTeamLead?: boolean;
}

interface Milestone {
  id: number;
  title: string;
  completed: boolean;
  date: string;
}

interface HackathonData {
  id: number;
  title: string;
  organizer: string;
  organizerLogo: string;
  description: string;
  prizePool: string;
  location: string;
  venue?: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Upcoming" | "Completed" | "Archived";
  teamName: string;
  teamId: string;
  teamMembers: TeamMember[];
  progress: number;
  nextDeadline: string;
  nextDeadlineTitle: string;
  milestones: Milestone[];
  categories: string[];
  image: string;
}

// Sample data for registered hackathons
const registeredHackathons: HackathonData[] = [
  {
    id: 1,
    title: "AI Innovation Challenge",
    organizer: "TechCorp",
    organizerLogo: "/placeholder.svg?height=40&width=40",
    description:
      "Build innovative AI solutions that solve real-world problems. Open to teams of 2-5 participants with prizes for the most creative and impactful projects.",
    prizePool: "25,000 AED",
    location: "Online",
    startDate: "2025-06-15",
    endDate: "2025-06-17",
    status: "Upcoming",
    teamName: "Neural Nexus",
    teamId: "team-123",
    teamMembers: [
      { id: 1, name: "You", avatar: "/placeholder.svg?height=32&width=32", isTeamLead: true },
      { id: 2, name: "Sarah Chen", avatar: "/placeholder.svg?height=32&width=32" },
      { id: 3, name: "Alex Johnson", avatar: "/placeholder.svg?height=32&width=32" },
    ],
    progress: 15,
    nextDeadline: "2025-06-01",
    nextDeadlineTitle: "Team Registration",
    milestones: [
      { id: 1, title: "Registration", completed: true, date: "2025-05-15" },
      { id: 2, title: "Team Formation", completed: true, date: "2025-05-25" },
      { id: 3, title: "Project Proposal", completed: false, date: "2025-06-01" },
      { id: 4, title: "Submission", completed: false, date: "2025-06-17" },
    ],
    categories: ["AI", "Machine Learning", "Data Science"],
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 2,
    title: "Web3 Global Hackathon",
    organizer: "Blockchain Foundation",
    organizerLogo: "/placeholder.svg?height=40&width=40",
    description:
      "Develop decentralized applications on blockchain technology. This global event brings together developers, designers, and entrepreneurs to build the future of Web3.",
    prizePool: "50,000 AED",
    location: "Hybrid",
    startDate: "2025-07-01",
    endDate: "2025-07-05",
    status: "Upcoming",
    teamName: "Chain Innovators",
    teamId: "team-456",
    teamMembers: [
      { id: 4, name: "David Lee", avatar: "/placeholder.svg?height=32&width=32", isTeamLead: true },
      { id: 1, name: "You", avatar: "/placeholder.svg?height=32&width=32" },
      { id: 5, name: "Emma Wilson", avatar: "/placeholder.svg?height=32&width=32" },
      { id: 6, name: "Marcus Taylor", avatar: "/placeholder.svg?height=32&width=32" },
    ],
    progress: 25,
    nextDeadline: "2025-06-15",
    nextDeadlineTitle: "Project Proposal",
    milestones: [
      { id: 1, title: "Registration", completed: true, date: "2025-05-10" },
      { id: 2, title: "Team Formation", completed: true, date: "2025-05-20" },
      { id: 3, title: "Project Proposal", completed: false, date: "2025-06-15" },
      { id: 4, title: "Submission", completed: false, date: "2025-07-05" },
    ],
    categories: ["Blockchain", "Web3", "DeFi", "NFT"],
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 3,
    title: "Mobile App Challenge",
    organizer: "AppDev Community",
    organizerLogo: "/placeholder.svg?height=40&width=40",
    description:
      "Create innovative mobile applications that address specific challenges in healthcare, education, or sustainability. Open to individual developers and small teams.",
    prizePool: "15,000 AED",
    location: "On-site",
    venue: "Tech Hub, Dubai",
    startDate: "2025-06-10",
    endDate: "2025-06-12",
    status: "Active",
    teamName: "MobileMinds",
    teamId: "team-789",
    teamMembers: [
      { id: 1, name: "You", avatar: "/placeholder.svg?height=32&width=32", isTeamLead: true },
      { id: 7, name: "Olivia Garcia", avatar: "/placeholder.svg?height=32&width=32" },
    ],
    progress: 60,
    nextDeadline: "2025-06-05",
    nextDeadlineTitle: "Prototype Demo",
    milestones: [
      { id: 1, title: "Registration", completed: true, date: "2025-05-01" },
      { id: 2, title: "Team Formation", completed: true, date: "2025-05-10" },
      { id: 3, title: "Project Proposal", completed: true, date: "2025-05-20" },
      { id: 4, title: "Prototype Demo", completed: false, date: "2025-06-05" },
      { id: 5, title: "Final Submission", completed: false, date: "2025-06-12" },
    ],
    categories: ["Mobile", "iOS", "Android", "Cross-platform"],
    image: "/placeholder.svg?height=200&width=400",
  }
];

// For demonstration, let's create a state to toggle between having registered hackathons or not
export default function MyHackathons() {
  const [hasRegistered, setHasRegistered] = useState(true);
  
  // Format date helpers
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  // Get status color based on status text
  const getStatusColor = (status: HackathonData["status"]): string => {
    switch(status) {
      case "Active": return "bg-emerald-500";
      case "Upcoming": return "bg-blue-500";
      case "Completed": return "bg-slate-500";
      case "Archived": return "bg-slate-400";
      default: return "bg-violet-500";
    }
  };
  
  // Get days until a date
  const getDaysUntil = (dateString: string): number => {
    const targetDate = new Date(dateString);
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-8 px-4 py-2 max-w-[1600px] mx-auto">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Hackathons</h1>
          <p className="text-slate-500">Track your registered hackathons and team progress</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700"
          onClick={() => setHasRegistered(!hasRegistered)} // For demo purposes only
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Join New Hackathon
        </Button>
      </div>

      {hasRegistered ? (
        <>
          {/* Tabs navigation */}
          <Tabs defaultValue="active" className="w-full">
            <div className="inline-flex rounded-full bg-slate-100 p-1.5">
              <TabsList className="bg-transparent">
                <TabsTrigger 
                  value="active" 
                  className="flex items-center gap-2 rounded-full px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-sm"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <Rocket className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-sm font-medium">Active & Upcoming</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="past" 
                  className="flex items-center gap-2 rounded-full px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-sm"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-500 text-white">
                    <Trophy className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-sm font-medium">Past Hackathons</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="active" className="space-y-6 mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {registeredHackathons.map((hackathon) => (
                  <Card key={hackathon.id} className="overflow-hidden flex flex-col border-slate-200 hover:shadow-md transition-all duration-200">
                    <div className="relative h-36">
                      <div 
                        className="h-full w-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${hackathon.image})` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-slate-900/20"></div>
                      </div>
                      <div className="absolute top-3 left-3">
                        <Badge className={getStatusColor(hackathon.status)}>
                          {hackathon.status}
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-lg font-semibold text-white">{hackathon.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="h-5 w-5 rounded-full overflow-hidden bg-white/10 backdrop-blur-sm">
                            <img 
                              src={hackathon.organizerLogo} 
                              alt={hackathon.organizer} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <span className="text-xs text-white/90">{hackathon.organizer}</span>
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-4 flex-1">
                      <div className="mb-4">
                        <div className="flex justify-between items-center text-sm mb-1.5">
                          <div className="font-medium text-slate-800">
                            {hackathon.teamName}
                          </div>
                          <Badge variant="outline" className="text-[10px] bg-violet-50 text-violet-600 border-violet-200">
                            {hackathon.teamMembers.length} members
                          </Badge>
                        </div>
                        
                        <div className="flex -space-x-2 mb-3">
                          {hackathon.teamMembers.slice(0, 4).map((member) => (
                            <HoverCard key={member.id}>
                              <HoverCardTrigger asChild>
                                <Avatar className={cn(
                                  "h-7 w-7 border-2 border-white", 
                                  member.isTeamLead && "ring-2 ring-violet-500"
                                )}>
                                  <AvatarImage src={member.avatar} />
                                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                              </HoverCardTrigger>
                              <HoverCardContent className="w-48 p-2">
                                <div className="flex items-center space-x-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={member.avatar} />
                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{member.name}</div>
                                    {member.isTeamLead && (
                                      <div className="text-xs text-violet-600">Team Lead</div>
                                    )}
                                  </div>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          ))}
                          {hackathon.teamMembers.length > 4 && (
                            <Avatar className="h-7 w-7 border-2 border-white bg-slate-100 text-slate-600">
                              <AvatarFallback>+{hackathon.teamMembers.length - 4}</AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500">Progress</span>
                            <span className="font-medium text-violet-600">{hackathon.progress}%</span>
                          </div>
                          <Progress value={hackathon.progress} className="h-1.5" indicatorClassName="bg-gradient-to-r from-violet-600 to-indigo-600" />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <CalendarDays className="h-4 w-4 text-slate-400" />
                          <span>{formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <Clock className="h-4 w-4 text-slate-400" />
                          <div>
                            <span className="font-medium text-violet-700">{hackathon.nextDeadlineTitle}:</span> {formatDate(hackathon.nextDeadline)} 
                            <span className={cn(
                              "ml-1 text-xs font-medium",
                              getDaysUntil(hackathon.nextDeadline) <= 3 ? "text-rose-600" : 
                              getDaysUntil(hackathon.nextDeadline) <= 7 ? "text-amber-600" : 
                              "text-emerald-600"
                            )}>
                              ({getDaysUntil(hackathon.nextDeadline)} days left)
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <Globe className="h-4 w-4 text-slate-400" />
                          <span>
                            {hackathon.location}
                            {hackathon.venue && <span className="text-slate-500"> • {hackathon.venue}</span>}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="p-4 pt-0 flex gap-3">
                      <Button className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
                        <Code className="h-4 w-4 mr-2" />
                        Project Dashboard
                      </Button>
                      <Button variant="outline" size="icon" className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-violet-700">
                        <Bell className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="past" className="space-y-6 mt-6">
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                  <Trophy className="h-6 w-6 text-slate-500" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Past Hackathons</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  You haven't participated in any past hackathons yet. Join an upcoming hackathon to start your journey!
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <Card className="border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50/30 overflow-hidden">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="p-8 space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-2">
                  <Rocket className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Join Your First Hackathon</h2>
                <p className="text-slate-600 mb-4">
                  Discover exciting hackathon opportunities, collaborate with talented teams, and showcase your skills.
                </p>
                
                <div className="space-y-4">
                  <div className="flex gap-3 items-start">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mt-0.5">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900">Learn and grow</h3>
                      <p className="text-sm text-slate-500">Enhance your skills through real-world challenges</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 mt-0.5">
                      <Users className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900">Network with peers</h3>
                      <p className="text-sm text-slate-500">Connect with like-minded innovators and experts</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-600 mt-0.5">
                      <Trophy className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900">Win prizes</h3>
                      <p className="text-sm text-slate-500">Compete for recognition and valuable rewards</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700">
                    Browse Hackathons
                  </Button>
                </div>
              </div>
              
              <div 
                className="h-full min-h-[320px] md:min-h-[unset] bg-cover bg-center relative hidden md:block"
                style={{ backgroundImage: "url(/placeholder.svg?height=400&width=600&text=Hackathon)" }}
              >
                <div className="absolute inset-0 bg-gradient-to-l from-blue-600/40 to-transparent"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Helper Icons
const Check = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
); 