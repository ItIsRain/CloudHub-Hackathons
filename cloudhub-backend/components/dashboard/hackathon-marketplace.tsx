"use client"

import { useState } from "react"
import { Search, Filter, ArrowUpDown, MapPin, Calendar, Users, Trophy, Clock, Globe, CalendarDays } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// Sample hackathon data
const hackathons = [
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
    registrationDeadline: "2025-06-10",
    participants: 120,
    maxParticipants: 500,
    categories: ["AI", "Machine Learning", "Data Science"],
    featured: true,
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
    registrationDeadline: "2025-06-25",
    participants: 350,
    maxParticipants: 1000,
    categories: ["Blockchain", "Web3", "DeFi", "NFT"],
    featured: true,
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
    registrationDeadline: "2025-06-01",
    participants: 95,
    maxParticipants: 200,
    categories: ["Mobile", "iOS", "Android", "Cross-platform"],
    featured: false,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 4,
    title: "Sustainability Tech Challenge",
    organizer: "GreenTech Initiative",
    organizerLogo: "/placeholder.svg?height=40&width=40",
    description:
      "Develop technological solutions to address environmental challenges. Looking for innovative approaches to sustainability, conservation, and climate action.",
    prizePool: "30,000 AED",
    location: "Online",
    startDate: "2025-07-15",
    endDate: "2025-07-18",
    registrationDeadline: "2025-07-10",
    participants: 75,
    maxParticipants: 300,
    categories: ["Sustainability", "CleanTech", "IoT", "Energy"],
    featured: false,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 5,
    title: "FinTech Innovation Summit",
    organizer: "Global Finance Group",
    organizerLogo: "/placeholder.svg?height=40&width=40",
    description:
      "Reimagine the future of financial services through technology. Build solutions for banking, payments, investments, or financial inclusion.",
    prizePool: "40,000 AED",
    location: "On-site",
    venue: "Finance Center, Singapore",
    startDate: "2025-08-05",
    endDate: "2025-08-07",
    registrationDeadline: "2025-07-25",
    participants: 180,
    maxParticipants: 400,
    categories: ["FinTech", "Blockchain", "Payments", "InsurTech"],
    featured: true,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: 6,
    title: "EdTech Hackathon",
    organizer: "Education Innovation Network",
    organizerLogo: "/placeholder.svg?height=40&width=40",
    description:
      "Create solutions that transform education and learning. Focus areas include personalized learning, educational games, assessment tools, and accessibility.",
    prizePool: "20,000 AED",
    location: "Hybrid",
    startDate: "2025-06-20",
    endDate: "2025-06-22",
    registrationDeadline: "2025-06-15",
    participants: 110,
    maxParticipants: 250,
    categories: ["EdTech", "E-learning", "Educational Games"],
    featured: false,
    image: "/placeholder.svg?height=200&width=400",
  },
]

// Categories for filtering
const allCategories = [
  "AI",
  "Machine Learning",
  "Blockchain",
  "Web3",
  "Mobile",
  "Sustainability",
  "FinTech",
  "EdTech",
  "IoT",
  "Data Science",
  "AR/VR",
  "Gaming",
]

export default function HackathonMarketplace() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [locationFilter, setLocationFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("date")

  // Filter hackathons based on search, categories, and location
  const filteredHackathons = hackathons.filter((hackathon) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      hackathon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hackathon.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hackathon.organizer.toLowerCase().includes(searchQuery.toLowerCase())

    // Category filter
    const matchesCategory =
      selectedCategories.length === 0 || hackathon.categories.some((category) => selectedCategories.includes(category))

    // Location filter
    const matchesLocation =
      locationFilter === "all" || hackathon.location.toLowerCase() === locationFilter.toLowerCase()

    return matchesSearch && matchesCategory && matchesLocation
  })

  // Sort hackathons
  const sortedHackathons = [...filteredHackathons].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      case "prize":
        return Number.parseInt(b.prizePool.replace(/\D/g, "")) - Number.parseInt(a.prizePool.replace(/\D/g, ""))
      case "participants":
        return b.participants - a.participants
      default:
        return 0
    }
  })

  // Toggle category selection
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    } else {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  // Get status color based on hackathon dates
  const getStatusColor = (hackathon: any) => {
    const now = new Date();
    const startDate = new Date(hackathon.startDate);
    const endDate = new Date(hackathon.endDate);
    const registrationDeadline = new Date(hackathon.registrationDeadline);
    
    if (now > endDate) {
      return "bg-slate-500"; // Completed
    } else if (now >= startDate && now <= endDate) {
      return "bg-emerald-500"; // Active
    } else if (now < startDate && now > registrationDeadline) {
      return "bg-amber-500"; // Registration closed, not started
    } else {
      return "bg-blue-500"; // Upcoming
    }
  };

  // Get status text based on hackathon dates
  const getStatusText = (hackathon: any) => {
    const now = new Date();
    const startDate = new Date(hackathon.startDate);
    const endDate = new Date(hackathon.endDate);
    const registrationDeadline = new Date(hackathon.registrationDeadline);
    
    if (now > endDate) {
      return "Completed";
    } else if (now >= startDate && now <= endDate) {
      return "Active";
    } else if (now < startDate && now > registrationDeadline) {
      return "Starting Soon";
    } else {
      return "Upcoming";
    }
  };

  // Find active hackathon or use the first one as featured
  const featuredHackathon = hackathons.find(h => {
    const now = new Date();
    const startDate = new Date(h.startDate);
    const endDate = new Date(h.endDate);
    return now >= startDate && now <= endDate;
  }) || hackathons.find(h => h.featured) || hackathons[0];

  return (
    <div className="space-y-8 px-4 py-2 max-w-[1600px] mx-auto">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hackathon Marketplace</h1>
          <p className="text-slate-500">Discover and join the latest hackathons from around the world</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700">
          Create Hackathon
        </Button>
      </div>

      {/* Featured Hackathon */}
      {featuredHackathon && (
        <Card className="border-slate-200 bg-gradient-to-r from-slate-50/80 to-violet-50/80 overflow-hidden relative">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="p-6 md:p-8 space-y-4 flex flex-col justify-between">
                <div>
                  <Badge className={`mb-4 ${getStatusColor(featuredHackathon)}`}>
                    {getStatusText(featuredHackathon)}
                  </Badge>
                  <h2 className="text-2xl font-bold mb-2">{featuredHackathon.title}</h2>
                  <p className="text-slate-600 mb-4">{featuredHackathon.description}</p>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    {featuredHackathon.categories.map((tag, index) => (
                      <Badge key={index} variant="outline" className="bg-white/60 text-slate-700 hover:bg-white/90 border-slate-200">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-y-3 pt-4 text-sm">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Trophy className="h-4 w-4 text-[#2684ff]" />
                    <span className="font-semibold">{featuredHackathon.prizePool} prize pool</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Users className="h-4 w-4 text-[#2684ff]" />
                    <span>
                      <span className="font-semibold">{featuredHackathon.participants}</span>/{featuredHackathon.maxParticipants} participants
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <CalendarDays className="h-4 w-4 text-[#2684ff]" />
                    <span>
                      <span className="font-semibold">
                        {new Date(featuredHackathon.startDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      {" "}-{" "}
                      {new Date(featuredHackathon.endDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Globe className="h-4 w-4 text-[#2684ff]" />
                    <span>{featuredHackathon.location}</span>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-6">
                  <Button className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700">
                    Join Now
                  </Button>
                  <Button variant="outline" className="border-slate-200 text-slate-800 hover:bg-white/80">
                    Learn More
                  </Button>
                </div>
              </div>
              
              <div 
                className="h-full min-h-[240px] md:min-h-[unset] bg-cover bg-center relative"
                style={{ backgroundImage: `url(${featuredHackathon.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#2684ff]/40 to-[#2684ff]/10"></div>
                <div className="absolute bottom-4 right-4">
                  <Badge className="bg-white/90 text-[#2684ff] hover:bg-white border-0 shadow-sm">
                    Featured Hackathon
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 space-y-6">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <h3 className="font-medium mb-2 flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </h3>
                <Separator className="my-2" />
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Location</h4>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="on-site">On-site</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Categories</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {allCategories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                      />
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

              <div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setSelectedCategories([])
                    setLocationFilter("all")
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">Create Your Own</h3>
              <p className="text-sm text-slate-500 mb-4">
                Have an idea for a hackathon? Create your own and invite participants from around the world.
              </p>
              <Button className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
                Create Hackathon
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6 pr-4">
          {/* Search and Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="search"
                placeholder="Search hackathons..."
                className="w-full pl-8 border-slate-200 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-1 border-slate-200 px-3 h-9">
                    <ArrowUpDown className="h-4 w-4" />
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSortBy("date")}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Date (Soonest)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("prize")}>
                    <Trophy className="h-4 w-4 mr-2" />
                    Prize Pool (Highest)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("participants")}>
                    <Users className="h-4 w-4 mr-2" />
                    Popularity
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-slate-500">
            Showing {sortedHackathons.length} of {hackathons.length} hackathons
          </div>

          {/* Hackathons Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedHackathons.map((hackathon) => (
              <HackathonCard key={hackathon.id} hackathon={hackathon} />
            ))}
          </div>

          {sortedHackathons.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                <Search className="h-6 w-6 text-slate-500" />
              </div>
              <h3 className="text-lg font-medium mb-2">No hackathons found</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                We couldn't find any hackathons matching your search criteria. Try adjusting your filters or search
                query.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface HackathonCardProps {
  hackathon: any
}

function HackathonCard({ hackathon }: HackathonCardProps) {
  // Format dates
  const startDate = new Date(hackathon.startDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
  const endDate = new Date(hackathon.endDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
  const registrationDeadline = new Date(hackathon.registrationDeadline).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })

  // Calculate days left for registration
  const today = new Date()
  const deadline = new Date(hackathon.registrationDeadline)
  const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <Card className="overflow-hidden group hover:shadow-md transition-all duration-300 flex flex-col h-full">
      <div className="relative">
        <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${hackathon.image})` }}></div>
        {hackathon.featured && (
          <Badge className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
            Featured
          </Badge>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex items-center gap-2">
            <Badge
              className={cn(
                "bg-white/90 text-slate-900 hover:bg-white/80",
                hackathon.location === "Online" && "text-blue-700",
                hackathon.location === "On-site" && "text-emerald-700",
                hackathon.location === "Hybrid" && "text-purple-700",
              )}
            >
              {hackathon.location === "Online" && <Globe className="h-3 w-3 mr-1" />}
              {hackathon.location === "On-site" && <MapPin className="h-3 w-3 mr-1" />}
              {hackathon.location === "Hybrid" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <path d="M20 5h-4l-4-4-4 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="10" r="3" />
                  <path d="M12 13v8" />
                </svg>
              )}
              {hackathon.location}
            </Badge>
            <Badge className="bg-[#2684ff] hover:bg-blue-700">
              <Trophy className="h-3 w-3 mr-1" />
              {hackathon.prizePool}
            </Badge>
          </div>
        </div>
      </div>

      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-6 w-6 rounded-full overflow-hidden bg-slate-100">
            <img
              src={hackathon.organizerLogo || "/placeholder.svg"}
              alt={hackathon.organizer}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="text-xs text-slate-500">{hackathon.organizer}</span>
        </div>

        <h3 className="font-semibold text-lg mb-3 group-hover:text-[#2684ff] transition-colors">{hackathon.title}</h3>
        <p className="text-sm text-slate-600 mb-4 line-clamp-2">{hackathon.description}</p>

        <div className="mt-auto space-y-3">
          <div className="flex items-center gap-1 text-sm text-slate-700">
            <Calendar className="h-4 w-4 text-slate-500" />
            <span>
              {startDate} - {endDate}
            </span>
          </div>

          <div className="flex items-center gap-1 text-sm text-slate-700">
            <Clock className="h-4 w-4 text-slate-500" />
            <span>
              Registration closes: {registrationDeadline}{" "}
              <span
                className={cn(
                  "font-medium",
                  daysLeft <= 3 ? "text-rose-600" : daysLeft <= 7 ? "text-amber-600" : "text-emerald-600",
                )}
              >
                ({daysLeft} days left)
              </span>
            </span>
          </div>

          <div className="flex items-center gap-1 text-sm text-slate-700">
            <Users className="h-4 w-4 text-slate-500" />
            <span>
              {hackathon.participants}/{hackathon.maxParticipants} participants
            </span>
          </div>

          <div className="flex flex-wrap gap-1 pt-1">
            {hackathon.categories.slice(0, 3).map((category: string) => (
              <Badge key={category} variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
                {category}
              </Badge>
            ))}
            {hackathon.categories.length > 3 && (
              <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
                +{hackathon.categories.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>

      <div className="p-4 pt-0">
        <Button className="w-full bg-[#2684ff] hover:bg-blue-700">
          View Details
        </Button>
      </div>
    </Card>
  )
}
