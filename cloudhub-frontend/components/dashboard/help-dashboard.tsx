import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  MessageSquare, 
  HelpCircle, 
  BookOpen, 
  Video, 
  ChevronRight,
  Book,
  LifeBuoy,
  Ticket,
  MessageCircle,
  FileQuestion
} from "lucide-react"

// Mock data for tickets
const tickets = [
  {
    id: "TICK-001",
    title: "Cannot access hackathon dashboard",
    status: "open",
    priority: "high",
    category: "Technical",
    createdAt: "2024-03-15T10:30:00Z",
    lastUpdated: "2024-03-15T11:45:00Z"
  },
  {
    id: "TICK-002",
    title: "Payment processing error",
    status: "resolved",
    priority: "medium",
    category: "Billing",
    createdAt: "2024-03-14T15:20:00Z",
    lastUpdated: "2024-03-15T09:15:00Z"
  },
]

// Mock data for help articles
const helpArticles = [
  {
    id: 1,
    title: "Getting Started with CloudHub",
    category: "Basics",
    description: "Learn the basics of using CloudHub for hackathons",
    icon: BookOpen,
  },
  {
    id: 2,
    title: "Creating Your First Hackathon",
    category: "Hackathons",
    description: "Step-by-step guide to creating and managing hackathons",
    icon: Ticket,
  },
  {
    id: 3,
    title: "Team Management",
    category: "Teams",
    description: "How to create and manage teams for hackathons",
    icon: MessageCircle,
  },
  {
    id: 4,
    title: "Payment and Billing",
    category: "Billing",
    description: "Understanding payment processing and billing",
    icon: FileQuestion,
  },
]

export default function HelpDashboard() {
  return (
    <div className="flex flex-col h-full min-h-0 space-y-6 px-6 pb-6 overflow-auto">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-200/60 [mask-image:linear-gradient(to_bottom,white,transparent)] pointer-events-none opacity-40"></div>
      
      {/* Banner Card */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg z-10">
        <div className="relative py-8 px-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600"></div>
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
          
          {/* Floating glass elements */}
          <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-blue-400/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-10 right-[20%] w-12 h-12 rounded-lg bg-gradient-to-tr from-blue-500/30 to-transparent backdrop-blur-md border border-white/20 animate-float-slow"></div>
          <div className="absolute top-1/2 right-[40%] w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-transparent backdrop-blur-md border border-white/20 animate-float-slow animate-delay-500"></div>
          <div className="absolute bottom-10 left-[30%] w-12 h-12 rounded-lg bg-gradient-to-tl from-violet-500/20 to-transparent backdrop-blur-md border border-white/20 animate-float-slow animate-delay-700"></div>
          
          <div className="relative z-10 flex flex-col max-w-3xl">
            <div className="inline-flex items-center space-x-2 mb-6 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 w-fit">
              <LifeBuoy className="h-3.5 w-3.5 text-blue-100" />
              <span className="text-xs font-medium text-blue-50">Support Center</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white">
              Help <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-indigo-200 to-violet-200">& Support</span>
            </h1>
            <p className="text-blue-100 mt-2 max-w-2xl text-sm md:text-base mb-6">
              Find answers, manage your support tickets, and get assistance with CloudHub
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 z-10">
        {/* Tabs Interface */}
        <Tabs defaultValue="articles" className="w-full flex flex-col flex-1">
          <TabsList className="w-full bg-white/80 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-200/70 shadow-lg mb-6">
            <TabsTrigger 
              value="articles" 
              className="flex items-center gap-2 flex-1 text-sm font-medium py-3 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:via-indigo-500 data-[state=active]:to-violet-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl transition-all duration-200"
            >
              <BookOpen className="h-4 w-4" />
              Knowledge Base
            </TabsTrigger>
            <TabsTrigger 
              value="tickets" 
              className="flex items-center gap-2 flex-1 text-sm font-medium py-3 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:via-indigo-500 data-[state=active]:to-violet-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl transition-all duration-200"
            >
              <MessageSquare className="h-4 w-4" />
              Support Tickets
            </TabsTrigger>
          </TabsList>

          <div className="flex-1">
            {/* Articles Tab */}
            <TabsContent value="articles" className="m-0 h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
                {/* Quick Help Card */}
                <Card className="border-none shadow-lg rounded-3xl overflow-hidden backdrop-blur-sm bg-white/80 col-span-1 md:col-span-2 lg:col-span-1 h-auto">
                  <CardHeader className="border-b border-slate-100 bg-white/60 px-8 py-6">
                    <CardTitle className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Quick Help</CardTitle>
                    <CardDescription className="text-slate-600 mt-1">Access resources and guides</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" className="h-auto py-4 px-6 flex flex-col items-center gap-2 hover:bg-slate-50 border-slate-200 rounded-xl">
                        <div className="p-2 rounded-full bg-blue-50 text-blue-600">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">Documentation</span>
                      </Button>
                      <Button variant="outline" className="h-auto py-4 px-6 flex flex-col items-center gap-2 hover:bg-slate-50 border-slate-200 rounded-xl">
                        <div className="p-2 rounded-full bg-indigo-50 text-indigo-600">
                          <Video className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">Tutorials</span>
                      </Button>
                      <Button variant="outline" className="h-auto py-4 px-6 flex flex-col items-center gap-2 hover:bg-slate-50 border-slate-200 rounded-xl">
                        <div className="p-2 rounded-full bg-violet-50 text-violet-600">
                          <HelpCircle className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">FAQs</span>
                      </Button>
                      <Button variant="outline" className="h-auto py-4 px-6 flex flex-col items-center gap-2 hover:bg-slate-50 border-slate-200 rounded-xl">
                        <div className="p-2 rounded-full bg-blue-50 text-blue-600">
                          <Book className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">Guides</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Popular Articles */}
                <Card className="border-none shadow-lg rounded-3xl overflow-hidden backdrop-blur-sm bg-white/80 col-span-1 md:col-span-2 h-auto">
                  <CardHeader className="border-b border-slate-100 bg-white/60 px-8 py-6">
                    <CardTitle className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Popular Articles</CardTitle>
                    <CardDescription className="text-slate-600 mt-1">Most viewed help articles</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 px-6 pb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {helpArticles.map((article, index) => (
                        <div 
                          key={index} 
                          className="flex items-start gap-4 p-4 rounded-xl hover:bg-blue-50/50 transition-colors cursor-pointer group border border-transparent hover:border-blue-100"
                        >
                          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                            {article.icon && <article.icon className="h-5 w-5" />}
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">{article.title}</h4>
                            <p className="text-sm text-slate-500 mt-1">{article.description}</p>
                            <div className="mt-2 pt-2 border-t border-slate-100">
                              <Badge variant="outline" className="text-xs bg-slate-50 border-slate-200 text-slate-600">
                                {article.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tickets Tab */}
            <TabsContent value="tickets" className="m-0 h-full">
              <Card className="border-none shadow-lg rounded-3xl overflow-hidden backdrop-blur-sm bg-white/80 h-auto">
                <CardHeader className="border-b border-slate-100 bg-white/60 px-8 py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Your Support Tickets</CardTitle>
                      <CardDescription className="text-slate-600 mt-1">View and manage your support requests</CardDescription>
                    </div>
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-xl">
                      <Plus className="h-4 w-4 mr-2" />
                      New Ticket
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 px-6 pb-6">
                  <div className="space-y-4">
                    {tickets.map((ticket, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-200 transition-colors bg-white/60 backdrop-blur-sm shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                            <MessageSquare className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900">{ticket.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={`${
                                ticket.status === 'open' 
                                  ? 'bg-blue-500' 
                                  : ticket.status === 'resolved' 
                                  ? 'bg-green-500' 
                                  : 'bg-slate-500'
                              } text-white`}>
                                {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                              </Badge>
                              <Badge variant="outline" className="border-slate-200 bg-slate-50">
                                {ticket.category}
                              </Badge>
                              <span className="text-xs text-slate-500">#{ticket.id}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right hidden md:block">
                            <p className="text-xs text-slate-500">Last updated</p>
                            <p className="text-sm font-medium text-slate-900">
                              {new Date(ticket.lastUpdated).toLocaleDateString()}
                            </p>
                          </div>
                          <Button variant="outline" size="icon" className="rounded-full border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200">
                            <ChevronRight className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
} 