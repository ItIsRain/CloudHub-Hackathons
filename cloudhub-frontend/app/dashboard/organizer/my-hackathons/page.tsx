"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  CalendarDays, 
  ChevronRight, 
  Clock, 
  Filter, 
  PlusCircle, 
  Search, 
  Settings, 
  Trophy, 
  Users, 
  ArrowRight, 
  Edit, 
  ExternalLink,
  BarChart3,
  Megaphone,
  MoreHorizontal,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Calendar,
  LayoutDashboard,
  List,
  Award
} from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"

export default function OrganizerMyHackathonsPage() {
  const [isCreateHackathonOpen, setIsCreateHackathonOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [createStepIndex, setCreateStepIndex] = useState(0)
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [selectedMaxParticipants, setSelectedMaxParticipants] = useState(50)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  // Reset dialog state when dialog closes
  const handleDialogOpenChange = (open: boolean) => {
    setIsCreateHackathonOpen(open);
    if (!open) {
      setCreateStepIndex(0);
      setSelectedPackage(null);
      setSelectedMaxParticipants(50);
      setIsProcessingPayment(false);
    }
  };

  const handlePackageSelect = (packageName: string, maxParticipants: number) => {
    setSelectedPackage(packageName);
    setSelectedMaxParticipants(maxParticipants);
  };

  const handleNextStep = () => {
    setCreateStepIndex(prev => prev + 1);
  };

  const handlePreviousStep = () => {
    setCreateStepIndex(prev => prev - 1);
  };

  const handleCreateHackathon = () => {
    setIsProcessingPayment(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessingPayment(false);
      handleDialogOpenChange(false);
    }, 2000);
  };

  // Dummy data for hackathons
  const hackathons = [
    {
      id: 1,
      title: "AI Innovation Challenge",
      description: "Build innovative AI solutions for real-world problems",
      startDate: "2025-06-15",
      endDate: "2025-06-17",
      registrationDeadline: "2025-06-10",
      participants: 250,
      maxParticipants: 300,
      submissionCount: 48,
      prizePool: "10,000 AED",
      status: "Active",
      progress: 65,
      bannerImage: "/placeholder.svg?height=100&width=200",
      categories: ["AI/ML", "Web Development", "Mobile"],
      featured: true,
    },
    {
      id: 2,
      title: "Web3 Hackathon",
      description: "Decentralized applications for the future",
      startDate: "2025-07-01",
      endDate: "2025-07-03",
      registrationDeadline: "2025-06-25",
      participants: 200,
      maxParticipants: 500,
      submissionCount: 0,
      prizePool: "15,000 AED",
      status: "Active",
      progress: 40,
      bannerImage: "/placeholder.svg?height=100&width=200",
      categories: ["Blockchain", "Smart Contracts", "Cryptocurrency"],
      featured: false,
    },
    {
      id: 3,
      title: "Environmental Tech Challenge",
      description: "Technology solutions for environmental sustainability",
      startDate: "2025-08-10",
      endDate: "2025-08-12",
      registrationDeadline: "2025-08-01",
      participants: 0,
      maxParticipants: 200,
      submissionCount: 0,
      prizePool: "8,000 AED",
      status: "Draft",
      progress: 85,
      bannerImage: "/placeholder.svg?height=100&width=200",
      categories: ["Sustainability", "IoT", "Clean Energy"],
      featured: false,
    },
    {
      id: 4,
      title: "Mobile App Innovation",
      description: "Create the next generation of mobile applications",
      startDate: "2025-04-15",
      endDate: "2025-04-17",
      registrationDeadline: "2025-04-10",
      participants: 180,
      maxParticipants: 200,
      submissionCount: 65,
      prizePool: "12,000 AED",
      status: "Completed",
      progress: 100,
      bannerImage: "/placeholder.svg?height=100&width=200",
      categories: ["iOS", "Android", "Cross-platform"],
      featured: false,
    },
  ]

  // Filter hackathons based on search query and status filter
  const filteredHackathons = hackathons.filter((hackathon) => {
    const matchesSearch = hackathon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          hackathon.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          hackathon.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesStatus = statusFilter === "all" || hackathon.status.toLowerCase() === statusFilter.toLowerCase()
    
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-8 pb-10 px-6">
      {/* Banner Section */}
      <section className="relative overflow-hidden rounded-2xl shadow-lg mt-6">
        {/* Gradient background with animated elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/20"></div>
        
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-1/3 h-4/5 bg-gradient-to-b from-white/10 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-2/3 h-1/2 bg-gradient-to-t from-blue-400/10 to-transparent rounded-full blur-3xl"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-[10%] w-12 h-12 rounded-full bg-blue-500/10 backdrop-blur-md border border-white/10"></div>
        <div className="absolute bottom-1/4 right-[15%] w-20 h-20 rounded-full bg-violet-500/10 backdrop-blur-md border border-white/10"></div>
        
        <div className="relative p-8 sm:p-10">
          <div className="grid gap-6 md:grid-cols-2 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-1.5 rounded-full mb-5 text-white text-sm border border-white/20 shadow-xl">
                <Trophy className="h-4 w-4 text-blue-200" />
                <span className="font-medium tracking-wide">Hackathon Management</span>
              </div>
              
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-3 tracking-tight">My Hackathons</h1>
              
              <p className="text-white/90 text-lg mb-6 max-w-lg font-light">
                Create, manage, and track all your hackathon events in one place.
              </p>
              
              <Button className="bg-white text-indigo-700 hover:bg-white/90 shadow-lg transition-all group px-5 py-2 h-auto text-sm font-medium rounded-xl border border-white/50" onClick={() => handleDialogOpenChange(true)}>
                <PlusCircle className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                <span>Create New Hackathon</span>
              </Button>
            </div>
            
            <div className="hidden md:block">
              <div className="flex items-end justify-end gap-4">
                <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 w-32 text-center shadow-xl">
                  <h3 className="text-3xl font-bold text-white">{hackathons.filter(h => h.status === "Active").length}</h3>
                  <p className="text-xs text-white/80 mt-1">Active Hackathons</p>
                </div>
                <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 w-32 text-center shadow-xl">
                  <h3 className="text-3xl font-bold text-white">{hackathons.reduce((sum, h) => sum + h.participants, 0)}</h3>
                  <p className="text-xs text-white/80 mt-1">Total Participants</p>
                </div>
                <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 w-32 text-center shadow-xl">
                  <h3 className="text-3xl font-bold text-white">{hackathons.reduce((sum, h) => sum + h.submissionCount, 0)}</h3>
                  <p className="text-xs text-white/80 mt-1">Submissions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Tabs defaultValue="cards" className="w-full">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
          <div className="relative w-full sm:w-auto flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input 
              placeholder="Search hackathons..." 
              className="pl-9 bg-white border-slate-200 h-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px] bg-white border-slate-200 h-10">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-slate-500" />
                  <SelectValue placeholder="Filter by status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <div className="bg-white rounded-lg border border-slate-200 shadow-sm h-10 p-0 overflow-hidden">
              <TabsList className="grid grid-cols-2 w-[180px] h-full">
                <TabsTrigger 
                  value="cards" 
                  className="rounded-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-sm text-sm font-medium h-full"
                >
                  <div className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Cards</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="list" 
                  className="rounded-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-sm text-sm font-medium h-full"
                >
                  <div className="flex items-center gap-2">
                    <List className="h-4 w-4" />
                    <span>List</span>
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
        </div>
        
        <TabsContent value="cards" className="mt-0">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredHackathons.map((hackathon) => (
              <Link key={hackathon.id} href={`/dashboard/organizer/hackathons/${hackathon.id}`}>
                <Card className="h-full overflow-hidden border-slate-200 transition-all hover:border-blue-200 hover:shadow-md cursor-pointer">
                  <div 
                    className="h-36 w-full bg-cover bg-center relative border-b border-slate-100"
                    style={{ backgroundImage: `url(${hackathon.bannerImage})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent"></div>
                    <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
                      <Badge className={`
                        ${hackathon.status === "Active" ? "bg-emerald-600" : 
                          hackathon.status === "Draft" ? "bg-amber-600" : 
                          "bg-slate-600"}
                      `}>
                        {hackathon.status}
                      </Badge>
                      {hackathon.featured && (
                        <Badge className="bg-blue-600">Featured</Badge>
                      )}
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-bold line-clamp-1">{hackathon.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{hackathon.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {hackathon.categories.map((category, idx) => (
                        <Badge key={idx} variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
                          {category}
                        </Badge>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Participants</p>
                        <div className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-slate-600" />
                          <span className="font-medium">
                            {hackathon.participants}/{hackathon.maxParticipants}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Submissions</p>
                        <div className="flex items-center gap-1.5">
                          <Trophy className="h-3.5 w-3.5 text-slate-600" />
                          <span className="font-medium">{hackathon.submissionCount}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Prize Pool</p>
                        <div className="flex items-center gap-1.5">
                          <Award className="h-3.5 w-3.5 text-slate-600" />
                          <span className="font-medium">{hackathon.prizePool}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Dates</p>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-600" />
                          <span className="font-medium text-xs">
                            {new Date(hackathon.startDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                            {" - "}
                            {new Date(hackathon.endDate).toLocaleDateString("en-US", {
                              month: "short", 
                              day: "numeric"
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <div className="w-full">
                      <div className="flex justify-between items-center text-xs mb-2">
                        <span className="text-slate-500">Progress</span>
                        <span className="font-medium text-blue-700">{hackathon.progress}%</span>
                      </div>
                      <Progress 
                        value={hackathon.progress} 
                        className="h-1.5" 
                        indicatorClassName={`${
                          hackathon.status === "Draft" ? "bg-amber-500" :
                          hackathon.status === "Completed" ? "bg-slate-500" :
                          "bg-blue-600"
                        }`}
                      />
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-0">
          <Card className="border-slate-200 shadow-md overflow-hidden rounded-xl">
            <CardContent className="p-0">
              <div className="rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white px-6 py-4 border-b border-indigo-700/20">
                  <h3 className="text-lg font-semibold">Hackathon Events</h3>
                </div>

                <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200 text-sm font-medium text-slate-600">
                  <div className="col-span-4">Hackathon</div>
                  <div className="col-span-2 text-center">Dates</div>
                  <div className="col-span-2 text-center">Participants</div>
                  <div className="col-span-2 text-center">Status</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>

                {filteredHackathons.map((hackathon, index) => (
                  <div 
                    key={hackathon.id}
                    className={`grid grid-cols-12 gap-4 px-6 py-5 items-center border-b border-slate-100 last:border-0 hover:bg-blue-50/40 transition-all duration-200 ${index % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`}
                  >
                    <div className="col-span-4">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-xl bg-slate-100 flex-shrink-0 bg-cover bg-center shadow overflow-hidden ring-1 ring-slate-200 border border-white"
                          style={{ backgroundImage: `url(${hackathon.bannerImage})` }}>
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-800 text-base mb-0.5">{hackathon.title}</h4>
                          <p className="text-sm text-slate-500 line-clamp-1 leading-snug pr-4">{hackathon.description}</p>
                          <div className="flex gap-2 mt-1.5">
                            {hackathon.categories.slice(0, 2).map((category, idx) => (
                              <Badge key={idx} variant="outline" className="bg-slate-50 text-xs text-slate-600 border-slate-200 font-normal py-0 h-5">
                                {category}
                              </Badge>
                            ))}
                            {hackathon.categories.length > 2 && (
                              <span className="text-xs text-slate-400">+{hackathon.categories.length - 2} more</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 text-center">
                      <div className="flex flex-col">
                        <div className="flex items-center justify-center gap-1.5 mb-1">
                          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                          <span className="font-medium text-slate-700 text-sm">
                            Starts on {new Date(hackathon.startDate).toLocaleDateString("en-US", {
                              month: "short", day: "numeric", year: "numeric"
                            })}
                          </span>
                        </div>
                        <div className="flex items-center justify-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                          <span className="font-medium text-slate-700 text-sm">
                            Ends on {new Date(hackathon.endDate).toLocaleDateString("en-US", {
                              month: "short", day: "numeric", year: "numeric"
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 text-center">
                      <div className="flex flex-col">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-sm font-medium text-indigo-700">
                            {Math.round((hackathon.participants / hackathon.maxParticipants) * 100)}%
                          </span>
                          <span className="text-sm font-medium text-slate-600">
                            {hackathon.participants}/{hackathon.maxParticipants}
                          </span>
                        </div>
                        <div className="relative w-full">
                          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                            <div 
                              className={`h-full rounded-full ${
                                hackathon.status === "Active" ? "bg-gradient-to-r from-blue-500 to-indigo-600" : 
                                hackathon.status === "Draft" ? "bg-gradient-to-r from-amber-400 to-amber-500" : 
                                "bg-gradient-to-r from-slate-400 to-slate-500"
                              }`}
                              style={{ width: `${(hackathon.participants / hackathon.maxParticipants) * 100}%` }}
                            ></div>
                          </div>
                          <div className="mt-1.5 flex items-center gap-1 justify-center text-xs text-slate-500">
                            <Users className="h-3 w-3 text-slate-400" strokeWidth={2.5} />
                            <span>Participation rate</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 text-center">
                      <div>
                        <Badge className={`
                          px-4 py-1.5 font-medium shadow-sm rounded-full text-sm ${
                            hackathon.status === "Active" ? "bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200" : 
                            hackathon.status === "Draft" ? "bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-200" : 
                            "bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200"
                          }
                        `}>
                          <div className="flex items-center gap-1.5">
                            {hackathon.status === "Active" && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>}
                            {hackathon.status === "Draft" && <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>}
                            {hackathon.status === "Completed" && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {hackathon.status}
                          </div>
                        </Badge>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-9 px-3 text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 rounded-lg"
                          asChild
                        >
                          <Link href={`/dashboard/organizer/hackathons/${hackathon.id}`}>
                            <Eye className="h-4 w-4 mr-1.5" />
                            <span className="font-medium">View</span>
                          </Link>
                        </Button>
                        <div className="relative group">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 border border-transparent hover:border-slate-200"
                          >
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                          <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 hidden group-hover:block z-10">
                            <Link href={`/dashboard/organizer/hackathons/${hackathon.id}/edit`} className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600">
                              <Edit className="h-3.5 w-3.5" />
                              <span>Edit</span>
                            </Link>
                            <button className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50">
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50 border-t border-slate-200 px-6 py-4">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-sm text-slate-600">
                      <strong className="font-medium">{hackathons.filter(h => h.status === "Active").length}</strong> Active
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <span className="text-sm text-slate-600">
                      <strong className="font-medium">{hackathons.filter(h => h.status === "Draft").length}</strong> Draft
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-slate-500"></div>
                    <span className="text-sm text-slate-600">
                      <strong className="font-medium">{hackathons.filter(h => h.status === "Completed").length}</strong> Completed
                    </span>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5 rounded-lg h-9"
                  onClick={() => handleDialogOpenChange(true)}
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>New Hackathon</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Hackathon Dialog */}
      <Dialog open={isCreateHackathonOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>
              {createStepIndex === 0 ? "Select a Package" : 
               createStepIndex === 1 ? "Create New Hackathon" : 
               "Processing Payment"}
            </DialogTitle>
            <DialogDescription>
              {createStepIndex === 0 ? "Choose the package that best fits your needs for this hackathon." : 
               createStepIndex === 1 ? "Fill in the details to create your new hackathon." : 
               "Please wait while we process your payment."}
            </DialogDescription>
          </DialogHeader>

          {/* Step 1: Package Selection */}
          {createStepIndex === 0 && (
            <div className="py-2">
              <div className="relative mb-6 overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-5 text-center">
                {/* Animated background elements */}
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 backdrop-blur-sm"></div>
                
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-b from-blue-400/20 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-t from-purple-400/20 to-transparent rounded-full blur-3xl"></div>
                
                {/* Floating shapes */}
                <div className="absolute top-1/4 right-1/4 w-6 h-6 rounded-full bg-blue-500/10 animate-pulse"></div>
                <div className="absolute bottom-1/3 left-1/4 w-10 h-10 rounded-full bg-indigo-500/10 animate-pulse delay-300"></div>
                <div className="absolute top-2/3 right-1/3 w-8 h-8 rounded-full bg-purple-500/10 animate-pulse delay-700"></div>
                
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 mb-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-white text-xs">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-200">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                    <span>Find your perfect match</span>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-white mb-2">Choose the Right Plan for Your Hackathon</h2>
                  <p className="text-indigo-100 text-base mb-4 max-w-2xl mx-auto">
                    Select a package that meets your needs and unlock powerful features for your hackathon event.
                  </p>
                  
                  <div className="flex flex-wrap justify-center items-center gap-3 relative">
                    <div className="inline-flex items-center bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/20 shadow-md">
                      <span className="text-xs font-medium text-white px-2">Compare key features</span>
                      <div className="bg-white rounded-full px-2 py-1 text-xs font-medium text-indigo-700 shadow-sm">
                        All plans include Event Management & Credits
                      </div>
                    </div>
                    
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-white/15 backdrop-blur-md text-white rounded-full border border-white/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-300"></div>
                      Starter: 500 Credits
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-white/15 backdrop-blur-md text-white rounded-full border border-white/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-300"></div>
                      Growth: 1,500 Credits
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-white/15 backdrop-blur-md text-white rounded-full border border-white/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-300"></div>
                      Scale: 5,000 Credits
                    </span>
                  </div>
                </div>
              </div>
                
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
                {/* Starter Package */}
                <div 
                  className={`relative rounded-xl overflow-hidden border transition-all hover:transform hover:scale-[1.01] cursor-pointer ${
                    selectedPackage === "Starter" 
                      ? "border-blue-500 ring-2 ring-blue-200 shadow-xl" 
                      : "border-slate-200 hover:border-blue-200 hover:shadow-lg"
                  }`}
                  onClick={() => handlePackageSelect("Starter", 50)}
                >
                  {selectedPackage === "Starter" && (
                    <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 rounded-bl-lg text-xs font-medium z-10">
                      Selected
                    </div>
                  )}
                  <div className="absolute top-0 left-0 w-full h-32 bg-blue-500/10 z-0"></div>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 relative z-10 border-b border-blue-100">
                    <div className="absolute top-1 right-1 w-20 h-20 bg-blue-600/5 rounded-full -translate-y-8 translate-x-8"></div>
                    <div className="absolute bottom-1 left-1 w-16 h-16 bg-blue-600/10 rounded-full translate-y-6 -translate-x-6"></div>
                    
                    <h3 className="text-lg font-bold text-slate-900">Starter Plan</h3>
                    <div className="mt-1 flex items-baseline">
                      <span className="text-2xl font-bold text-blue-600">AED 2,500</span>
                      <span className="ml-2 text-xs text-slate-600">(USD 680)</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">per hackathon</p>
                    
                    <div className="mt-2 bg-white/50 rounded-lg border border-blue-200/50 px-2 py-1 text-center">
                      <span className="text-xs font-medium text-blue-700">Up to 50 participants</span>
                    </div>
                  </div>
                  <div className="p-3 bg-white relative z-10 h-[240px] flex flex-col mb-2">
                    <div className="mb-4">
                      <span className="inline-block bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 text-xs font-medium rounded-full px-3 py-1 shadow-sm border border-blue-200/50">INCLUDES</span>
                    </div>
                    <ul className="space-y-3 flex-grow">
                      <li className="flex items-start gap-2.5">
                        <div className="h-4 w-4 flex-shrink-0 text-blue-500 mt-0.5">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <span className="text-sm text-slate-600">Perfect for up to 50 participants</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <div className="h-4 w-4 flex-shrink-0 text-blue-500 mt-0.5">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <span className="text-sm text-slate-600">Essential hackathon toolkit</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <div className="h-4 w-4 flex-shrink-0 text-blue-500 mt-0.5">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <span className="text-sm text-slate-600">Basic branding capabilities</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <div className="h-4 w-4 flex-shrink-0 text-blue-500 mt-0.5">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <span className="text-sm text-slate-600">
                          <span className="font-medium">500 CloudHub Credits</span>
                          <span className="text-xs text-blue-600 ml-1">for AI tools</span>
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <div className="h-4 w-4 flex-shrink-0 text-blue-500 mt-0.5">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <span className="text-sm text-slate-600">Foundational AI capabilities</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <div className="h-4 w-4 flex-shrink-0 text-blue-500 mt-0.5">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <span className="text-sm text-slate-600">Responsive community support</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Growth Package */}
                <div 
                  className={`relative rounded-xl overflow-hidden border transition-all hover:transform hover:scale-[1.01] cursor-pointer ${
                    selectedPackage === "Growth" 
                      ? "border-indigo-500 ring-2 ring-indigo-200 shadow-xl" 
                      : "border-slate-200 hover:border-indigo-200 hover:shadow-lg"
                  }`}
                  onClick={() => handlePackageSelect("Growth", 100)}
                >
                  <div className="absolute -rotate-45 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white px-10 py-1 text-xs font-medium -left-8 top-5 shadow-md z-10">
                    POPULAR
                  </div>
                  {selectedPackage === "Growth" && (
                    <div className="absolute top-0 right-0 bg-indigo-500 text-white px-3 py-1 rounded-bl-lg text-xs font-medium z-10">
                      Selected
                    </div>
                  )}
                  <div className="absolute top-0 left-0 w-full h-32 bg-indigo-500/10 z-0"></div>
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-3 relative z-10 border-b border-indigo-100">
                    <div className="absolute top-1 right-1 w-20 h-20 bg-indigo-600/5 rounded-full -translate-y-8 translate-x-8"></div>
                    <div className="absolute bottom-1 left-1 w-16 h-16 bg-indigo-600/10 rounded-full translate-y-6 -translate-x-6"></div>
                    
                    <h3 className="text-lg font-bold text-slate-900">Growth Plan</h3>
                    <div className="mt-1 flex items-baseline">
                      <span className="text-2xl font-bold text-indigo-600">AED 7,500</span>
                      <span className="ml-2 text-xs text-slate-600">(USD 2,040)</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">per hackathon</p>
                    
                    <div className="mt-2 bg-white/50 rounded-lg border border-indigo-200/50 px-2 py-1 text-center">
                      <span className="text-xs font-medium text-indigo-700">Up to 100 participants</span>
                    </div>
                  </div>
                  <div className="p-3 bg-white relative z-10 h-[240px] flex flex-col mb-2">
                    <div className="mb-4">
                      <span className="inline-block bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 text-xs font-medium rounded-full px-3 py-1 shadow-sm border border-indigo-200/50">INCLUDES</span>
                    </div>
                    <ul className="space-y-3 flex-grow">
                      <li className="flex items-start gap-2.5">
                        <div className="h-4 w-4 flex-shrink-0 text-indigo-500 mt-0.5">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <span className="text-sm text-slate-600">Host up to 100 innovators</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <div className="h-4 w-4 flex-shrink-0 text-indigo-500 mt-0.5">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <span className="text-sm text-slate-600">Enhanced collaboration tools</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <div className="h-4 w-4 flex-shrink-0 text-indigo-500 mt-0.5">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <span className="text-sm text-slate-600">Premium branding capabilities</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <div className="h-4 w-4 flex-shrink-0 text-indigo-500 mt-0.5">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <span className="text-sm text-slate-600">
                          <span className="font-medium">1,500 CloudHub Credits</span>
                          <span className="text-xs text-indigo-600 ml-1">for AI tools</span>
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <div className="h-4 w-4 flex-shrink-0 text-indigo-500 mt-0.5">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <span className="text-sm text-slate-600">Advanced AI toolkit access</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <div className="h-4 w-4 flex-shrink-0 text-indigo-500 mt-0.5">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <span className="text-sm text-slate-600">Fast-track support (12hr SLA)</span>
                      </li>
                    </ul>
                    <div className="mb-4"></div>
                    {selectedPackage === "Growth" ? (
                      <div className="w-full flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 py-2 rounded-lg border border-indigo-200">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="font-medium">Selected</span>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Scale Package */}
                <div 
                  className={`relative rounded-xl overflow-hidden border transition-all hover:transform hover:scale-[1.01] cursor-pointer ${
                    selectedPackage === "Scale" 
                      ? "border-purple-500 ring-2 ring-purple-200 shadow-xl" 
                      : "border-slate-200 hover:border-purple-200 hover:shadow-lg"
                  }`}
                  onClick={() => handlePackageSelect("Scale", 250)}
                >
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-600 to-purple-500 text-white px-4 py-1.5 text-xs font-medium rounded-bl-lg z-10">
                    ENTERPRISE
                  </div>
                  {selectedPackage === "Scale" && (
                    <div className="absolute top-10 right-0 bg-purple-500 text-white px-3 py-1 rounded-bl-lg text-xs font-medium z-10">
                      Selected
                    </div>
                  )}
                  <div className="absolute top-0 left-0 w-full h-32 bg-purple-500/10 z-0"></div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 relative z-10 border-b border-purple-100">
                    <div className="absolute top-1 right-1 w-20 h-20 bg-purple-600/5 rounded-full -translate-y-8 translate-x-8"></div>
                    <div className="absolute bottom-1 left-1 w-16 h-16 bg-purple-600/10 rounded-full translate-y-6 -translate-x-6"></div>
                    
                    <h3 className="text-lg font-bold text-slate-900">Scale Plan</h3>
                    <div className="mt-1 flex items-baseline">
                      <span className="text-2xl font-bold text-purple-600">AED 20,000</span>
                      <span className="ml-2 text-xs text-slate-600">(USD 5,450)</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">per hackathon</p>
                    
                    <div className="mt-2 bg-white/50 rounded-lg border border-purple-200/50 px-2 py-1 text-center">
                      <span className="text-xs font-medium text-purple-700">Up to 250 participants</span>
                    </div>
                  </div>
                  <div className="p-3 bg-white relative z-10 h-[240px] flex flex-col mb-2">
                    <div className="mb-4">
                      <span className="inline-block bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 text-xs font-medium rounded-full px-3 py-1 shadow-sm border border-purple-200/50">INCLUDES</span>
                    </div>
                    <ul className="space-y-3 flex-grow">
                      <li className="flex items-start gap-2.5">
                        <div className="h-4 w-4 flex-shrink-0 text-purple-500 mt-0.5">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <span className="text-sm text-slate-600">Scale to 250 global participants</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <div className="h-4 w-4 flex-shrink-0 text-purple-500 mt-0.5">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <span className="text-sm text-slate-600">Enterprise-grade customization</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <div className="h-4 w-4 flex-shrink-0 text-purple-500 mt-0.5">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <span className="text-sm text-slate-600">Complete white-labeling solution</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <div className="h-4 w-4 flex-shrink-0 text-purple-500 mt-0.5">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <span className="text-sm text-slate-600">
                          <span className="font-medium">5,000 CloudHub Credits</span>
                          <span className="text-xs text-purple-600 ml-1">for AI tools</span>
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <div className="h-4 w-4 flex-shrink-0 text-purple-500 mt-0.5">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <span className="text-sm text-slate-600">Premium AI suite with no limits</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <div className="h-4 w-4 flex-shrink-0 text-purple-500 mt-0.5">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <span className="text-sm text-slate-600">VIP Support (2hr SLA)</span>
                      </li>
                    </ul>
                    <div className="mb-4"></div>
                    {selectedPackage === "Scale" ? (
                      <div className="w-full flex items-center justify-center gap-2 bg-purple-50 text-purple-700 py-2 rounded-lg border border-purple-200">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="font-medium">Selected</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Hackathon Information */}
          {createStepIndex === 1 && (
            <div className="grid gap-6 py-4">
              <div className="border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3 mb-4">
                  {selectedPackage === "Starter" && (
                    <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-200">
                      Starter Plan
                    </div>
                  )}
                  {selectedPackage === "Growth" && (
                    <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium border border-indigo-200">
                      Growth Plan
                    </div>
                  )}
                  {selectedPackage === "Scale" && (
                    <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium border border-purple-200">
                      Scale Plan
                    </div>
                  )}
                  <span className="text-sm text-slate-500">
                    Maximum {selectedMaxParticipants} participants
                  </span>
                </div>
              </div>
              
              <div className="grid gap-3">
                <label htmlFor="title" className="text-sm font-medium">
                  Hackathon Title <span className="text-red-500">*</span>
                </label>
                <Input id="title" placeholder="Enter a title for your hackathon" required />
              </div>

              <div className="grid gap-3">
                <label htmlFor="description" className="text-sm font-medium">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea 
                  id="description" 
                  rows={3} 
                  className="min-h-[100px] rounded-md border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Describe your hackathon"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="grid gap-3">
                  <label className="text-sm font-medium">
                    Date Range <span className="text-red-500">*</span>
                  </label>
                  <DatePickerWithRange />
                </div>
                <div className="grid gap-3">
                  <label className="text-sm font-medium">
                    Registration Deadline <span className="text-red-500">*</span>
                  </label>
                  <DatePickerWithRange />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="grid gap-3">
                  <label htmlFor="maxParticipants" className="text-sm font-medium flex items-center justify-between">
                    <span>Maximum Participants <span className="text-red-500">*</span></span>
                    <span className="text-sm text-slate-500">Max: {selectedMaxParticipants}</span>
                  </label>
                  <Input 
                    id="maxParticipants" 
                    type="number" 
                    placeholder={`Enter maximum number of participants (up to ${selectedMaxParticipants})`}
                    min="1"
                    max={selectedMaxParticipants.toString()}
                    defaultValue={selectedMaxParticipants.toString()}
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <label htmlFor="prizePool" className="text-sm font-medium">
                    Prize Pool <span className="text-red-500">*</span>
                  </label>
                  <Input id="prizePool" placeholder="Enter prize pool amount" required />
                </div>
              </div>

              <div className="grid gap-3">
                <label className="text-sm font-medium">Categories</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {["AI/ML", "Blockchain", "Web Development", "Mobile", "IoT", "Cloud", "Sustainability", "FinTech"].map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox id={`category-${category}`} />
                      <label
                        htmlFor={`category-${category}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="featured" />
                <label
                  htmlFor="featured"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Feature this hackathon on the homepage
                </label>
              </div>
            </div>
          )}

          {/* Step 3: Payment Processing */}
          {createStepIndex === 2 && (
            <div className="py-8">
              <div className="max-w-md mx-auto">
                <div className="text-center mb-6">
                  {isProcessingPayment ? (
                    <>
                      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Processing Payment</h3>
                      <p className="text-slate-600">Please wait while we process your payment...</p>
                    </>
                  ) : (
                    <>
                      <div className="text-green-500 mx-auto mb-4">
                        <CheckCircle2 className="h-16 w-16 mx-auto" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Payment Successful</h3>
                      <p className="text-slate-600">Your hackathon has been created successfully!</p>
                    </>
                  )}
                </div>

                {isProcessingPayment && (
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-slate-700">Package</span>
                      <span className="text-sm text-slate-900">{selectedPackage} Plan</span>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-slate-700">Amount</span>
                      <span className="text-sm text-slate-900">
                        {selectedPackage === "Starter" ? "AED 2,500" : 
                         selectedPackage === "Growth" ? "AED 7,500" : 
                         "AED 20,000"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-700">Payment Method</span>
                      <span className="text-sm text-slate-900">Credit Card (****4242)</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="flex items-center justify-between">
            {createStepIndex === 0 ? (
              <>
                <Button variant="outline" onClick={() => handleDialogOpenChange(false)}>
                  Cancel
                </Button>
                <Button 
                  disabled={!selectedPackage} 
                  onClick={handleNextStep} 
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            ) : createStepIndex === 1 ? (
              <>
                <Button variant="outline" onClick={handlePreviousStep}>
                  <ChevronRight className="mr-2 h-4 w-4 rotate-180" />
                  Back
                </Button>
                <Button 
                  onClick={handleNextStep} 
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Proceed to Payment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            ) : (
              <div className="w-full flex justify-between">
                {isProcessingPayment ? (
                  <div className="w-full text-center">
                    <span className="text-sm text-slate-500">Please wait while we process your payment...</span>
                  </div>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => handleDialogOpenChange(false)}>
                      Close
                    </Button>
                    <Button 
                      onClick={() => handleDialogOpenChange(false)} 
                      className="bg-green-600 hover:bg-green-700"
                    >
                      View Hackathon
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 