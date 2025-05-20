"use client"

import { useState } from "react"
import { 
  Calendar, Trophy, Users, Clock, Globe, CalendarDays, 
  MapPin, Code, Rocket, Bell, GitPullRequest, PlusCircle, Sparkles, ExternalLink, Star
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
    <div className="space-y-8 px-6 mt-6 pb-10">
      {/* Hero Section */}
      <section className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-1/3 h-4/5 bg-gradient-to-b from-white/10 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-2/3 h-1/2 bg-gradient-to-t from-blue-400/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-[10%] w-12 h-12 rounded-lg bg-gradient-to-tr from-blue-500/30 to-transparent backdrop-blur-sm border border-white/10 animate-float-slow"></div>
        <div className="absolute bottom-16 right-[15%] w-16 h-16 rounded-lg bg-gradient-to-br from-indigo-500/20 to-transparent backdrop-blur-sm border border-white/10 animate-float"></div>
        <div className="absolute top-1/2 left-[30%] w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-transparent backdrop-blur-sm border border-white/10 animate-float-slow"></div>
        
        <div className="relative p-8 sm:p-10 md:p-12">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-1.5 rounded-full mb-5 text-white text-sm border border-white/20 shadow-xl">
                <Trophy className="h-4 w-4 text-blue-200" />
                <span className="font-medium tracking-wide">Hackathon Management</span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-violet-200">Hackathons</span>
              </h1>
              
              <p className="text-white/90 text-lg mb-8 max-w-lg font-light">
                Track your registered hackathons, manage your team progress, and stay updated on upcoming deadlines.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button className="bg-white text-indigo-700 hover:bg-white/90 shadow-lg transition-all group px-5 py-2 h-auto text-sm font-medium rounded-xl border border-white/50">
                  <ExternalLink className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  <span>Discover Hackathons</span>
                </Button>
              </div>
            </div>
            
            <div className="hidden md:flex justify-end">
              <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-5 w-full max-w-xs shadow-xl">
                <h3 className="font-medium mb-4 flex items-center text-white">
                  <Star className="h-4 w-4 mr-2 text-amber-300" />
                  <span className="text-base">Hackathon Stats</span>
                </h3>
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-white/80">Active Hackathons</span>
                      <span className="text-white font-medium">{registeredHackathons.filter(h => h.status === "Active").length}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full" style={{ width: `${(registeredHackathons.filter(h => h.status === "Active").length / registeredHackathons.length) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-white/80">Upcoming Hackathons</span>
                      <span className="text-white font-medium">{registeredHackathons.filter(h => h.status === "Upcoming").length}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full" style={{ width: `${(registeredHackathons.filter(h => h.status === "Upcoming").length / registeredHackathons.length) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-white/80">Next Deadline</span>
                      <span className="text-white font-medium">{formatDate(registeredHackathons[0]?.nextDeadline)}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" style={{ width: `${Math.min(100, 100 - (getDaysUntil(registeredHackathons[0]?.nextDeadline) / 14) * 100)}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {hasRegistered ? (
        <>
          {/* Tabs navigation with modern design */}
          <Tabs defaultValue="active" className="w-full">
            <div className="inline-flex rounded-full bg-slate-100/80 backdrop-blur-sm p-1.5 shadow-inner">
              <TabsList className="bg-transparent">
                <TabsTrigger 
                  value="active" 
                  className="flex items-center gap-2 rounded-full px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow transition-all duration-200"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-sm">
                    <Rocket className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-sm font-medium">Active & Upcoming</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="past" 
                  className="flex items-center gap-2 rounded-full px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow transition-all duration-200"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-slate-400 to-slate-500 text-white shadow-sm">
                    <Trophy className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-sm font-medium">Past Hackathons</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="active" className="space-y-6 mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {registeredHackathons.map((hackathon) => (
                  <Card key={hackathon.id} className="group overflow-hidden flex flex-col border-slate-200 hover:shadow-lg transition-all duration-300 hover:border-violet-200">
                    <div className="relative h-40">
                      <div 
                        className="h-full w-full bg-cover bg-center transform group-hover:scale-105 transition-transform duration-500"
                        style={{ backgroundImage: `url(${hackathon.image})` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-slate-900/20"></div>
                      </div>
                      <div className="absolute top-3 left-3">
                        <Badge className={`${getStatusColor(hackathon.status)} shadow-sm`}>
                          {hackathon.status}
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge variant="outline" className="bg-white/20 backdrop-blur-md text-white border-white/30">
                          {hackathon.location}
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-lg font-semibold text-white drop-shadow-sm">{hackathon.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="h-5 w-5 rounded-full overflow-hidden bg-white/10 backdrop-blur-sm p-0.5">
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
                    
                    <CardContent className="p-5 flex-1 bg-gradient-to-b from-white to-slate-50/80">
                      <div className="mb-4">
                        <div className="flex justify-between items-center text-sm mb-2.5">
                          <div className="font-semibold text-slate-800 flex items-center">
                            <Users className="h-3.5 w-3.5 mr-1.5 text-violet-500" />
                            {hackathon.teamName}
                          </div>
                          <Badge variant="outline" className="text-[10px] font-medium bg-violet-50 text-violet-600 border-violet-200">
                            {hackathon.teamMembers.length} members
                          </Badge>
                        </div>
                        
                        <div className="flex -space-x-2 mb-3">
                          {hackathon.teamMembers.slice(0, 4).map((member) => (
                            <HoverCard key={member.id}>
                              <HoverCardTrigger asChild>
                                <Avatar className={cn(
                                  "h-8 w-8 border-2 border-white shadow-sm transition-transform hover:scale-105", 
                                  member.isTeamLead && "ring-2 ring-violet-500"
                                )}>
                                  <AvatarImage src={member.avatar} />
                                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                              </HoverCardTrigger>
                              <HoverCardContent className="w-52 p-3">
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-10 w-10 border border-slate-100">
                                    <AvatarImage src={member.avatar} />
                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{member.name}</div>
                                    {member.isTeamLead && (
                                      <div className="flex items-center text-xs text-violet-600 font-medium">
                                        <Crown className="h-3 w-3 mr-1" />
                                        Team Lead
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          ))}
                          {hackathon.teamMembers.length > 4 && (
                            <Avatar className="h-8 w-8 border-2 border-white bg-slate-100 text-slate-600">
                              <AvatarFallback>+{hackathon.teamMembers.length - 4}</AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                        
                        <div className="space-y-2.5">
                          <div className="flex justify-between items-center text-xs font-medium">
                            <span className="text-slate-500">Project Progress</span>
                            <span className="text-violet-600">{hackathon.progress}%</span>
                          </div>
                          <Progress value={hackathon.progress} className="h-2 bg-slate-100" indicatorClassName="bg-gradient-to-r from-violet-500 to-indigo-500 shadow-sm" />
                          
                          <div className="flex justify-between text-[10px] text-slate-400 font-medium pt-2 px-1">
                            <div>Start</div>
                            <div>Team Formation</div>
                            <div>Project</div>
                            <div>Submission</div>
                          </div>
                          
                          <div className="flex items-center justify-between relative mt-1 px-1">
                            {/* Connecting line - renders first */}
                            <div className="absolute top-1/2 left-[10px] right-[10px] h-0.5 bg-slate-200 -translate-y-1/2"></div>
                            
                            {/* Dots rendered on top of the line */}
                            {hackathon.milestones.map((milestone, index) => (
                              <div key={milestone.id} className="relative z-10">
                                <div className={`h-2.5 w-2.5 rounded-full ${
                                  milestone.completed 
                                    ? 'bg-violet-500 ring-2 ring-violet-200' 
                                    : 'bg-slate-200'
                                }`}></div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <CalendarDays className="h-4 w-4 text-slate-400" />
                          <span>{formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-slate-400" />
                          <div>
                            <span className="font-medium text-violet-700">{hackathon.nextDeadlineTitle}:</span> {formatDate(hackathon.nextDeadline)} 
                            <Badge className={cn(
                              "ml-2 font-medium",
                              getDaysUntil(hackathon.nextDeadline) <= 3 ? "bg-rose-500" : 
                              getDaysUntil(hackathon.nextDeadline) <= 7 ? "bg-amber-500" : 
                              "bg-emerald-500"
                            )}>
                              {getDaysUntil(hackathon.nextDeadline)} days left
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="p-4 pt-0 flex gap-3 bg-gradient-to-t from-slate-50 to-white">
                      <Button className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200">
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
              <div className="bg-gradient-to-br from-slate-50 to-slate-100/70 border border-slate-200/60 rounded-xl p-12 text-center shadow-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 shadow-inner mb-5">
                  <Trophy className="h-7 w-7 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-800">No Past Hackathons</h3>
                <p className="text-slate-500 max-w-lg mx-auto">
                  You haven't participated in any past hackathons yet. Join an upcoming hackathon to start your journey!
                </p>
                <Button variant="outline" className="mt-6 border-slate-200 text-slate-700 hover:border-violet-200 hover:text-violet-700">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Browse Hackathon History
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <Card className="border-none shadow-lg bg-gradient-to-br from-slate-50 to-blue-50/50 overflow-hidden rounded-2xl">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="p-8 sm:p-10 space-y-5">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 shadow-inner mb-1">
                  <Rocket className="h-7 w-7 text-blue-600" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-1 text-slate-900">Join Your First Hackathon</h2>
                <p className="text-slate-600 text-lg">
                  Discover exciting hackathon opportunities, collaborate with talented teams, and showcase your skills.
                </p>
                
                <div className="space-y-4 py-3">
                  <div className="flex gap-3 items-start">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mt-0.5 shadow-sm">
                      <Check className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Learn and grow</h3>
                      <p className="text-slate-500">Enhance your skills through real-world challenges</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-600 mt-0.5 shadow-sm">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Network with peers</h3>
                      <p className="text-slate-500">Connect with like-minded innovators and experts</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-600 mt-0.5 shadow-sm">
                      <Trophy className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Win prizes</h3>
                      <p className="text-slate-500">Compete for recognition and valuable rewards</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 shadow-md hover:shadow-lg transition-all duration-200 py-2.5">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Browse Hackathons
                  </Button>
                </div>
              </div>
              
              <div 
                className="h-full min-h-[340px] md:min-h-[unset] bg-cover bg-center relative hidden md:block"
                style={{ backgroundImage: "url(/placeholder.svg?height=400&width=600&text=Hackathon)" }}
              >
                <div className="absolute inset-0 bg-gradient-to-l from-blue-600/40 to-transparent"></div>
                
                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(8)].map((_, i) => (
                    <div 
                      key={i}
                      className="absolute h-3 w-3 rounded-full bg-white/40 blur-sm animate-float"
                      style={{ 
                        top: `${Math.random() * 100}%`, 
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: `${8 + Math.random() * 10}s`
                      }}
                    ></div>
                  ))}
                </div>
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

const Crown = ({ className }: { className?: string }) => (
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
    <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"></path>
  </svg>
); 