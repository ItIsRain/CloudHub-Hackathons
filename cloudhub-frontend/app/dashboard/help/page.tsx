import { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Search, 
  Plus, 
  MessageSquare, 
  HelpCircle, 
  BookOpen, 
  Video, 
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Send,
  Paperclip,
  Image as ImageIcon,
  X,
  Book
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const metadata: Metadata = {
  title: "Help & Support | CloudHub",
  description: "Get help and support for CloudHub",
}

// Mock data for tickets
const tickets = [
  {
    id: "TICK-001",
    title: "Cannot access hackathon dashboard",
    status: "open",
    priority: "high",
    category: "Technical",
    createdAt: "2024-03-15T10:30:00Z",
    lastUpdated: "2024-03-15T11:45:00Z",
    messages: [
      {
        id: 1,
        sender: "John Doe",
        content: "I'm unable to access the hackathon dashboard. The page keeps loading indefinitely.",
        timestamp: "2024-03-15T10:30:00Z",
        isStaff: false,
      },
      {
        id: 2,
        sender: "Support Team",
        content: "We're looking into this issue. Could you please try clearing your browser cache and let us know if the problem persists?",
        timestamp: "2024-03-15T11:45:00Z",
        isStaff: true,
      },
    ],
  },
  {
    id: "TICK-002",
    title: "Payment processing error",
    status: "resolved",
    priority: "medium",
    category: "Billing",
    createdAt: "2024-03-14T15:20:00Z",
    lastUpdated: "2024-03-15T09:15:00Z",
    messages: [
      {
        id: 1,
        sender: "John Doe",
        content: "I'm getting an error when trying to process payment for hackathon registration.",
        timestamp: "2024-03-14T15:20:00Z",
        isStaff: false,
      },
      {
        id: 2,
        sender: "Support Team",
        content: "This issue has been resolved. Please try processing your payment again.",
        timestamp: "2024-03-15T09:15:00Z",
        isStaff: true,
      },
    ],
  },
]

// Mock data for help articles
const helpArticles = [
  {
    id: 1,
    title: "Getting Started with CloudHub",
    category: "Basics",
    description: "Learn the basics of using CloudHub for hackathons",
  },
  {
    id: 2,
    title: "Creating Your First Hackathon",
    category: "Hackathons",
    description: "Step-by-step guide to creating and managing hackathons",
  },
  {
    id: 3,
    title: "Team Management",
    category: "Teams",
    description: "How to create and manage teams for hackathons",
  },
  {
    id: 4,
    title: "Payment and Billing",
    category: "Billing",
    description: "Understanding payment processing and billing",
  },
]

export default function HelpPage() {
  return (
    <div className="flex flex-col h-full bg-white p-6 space-y-6">
      {/* Banner Card */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl">
        <div className="relative py-12 px-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600"></div>
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-2/3 h-1/2 bg-gradient-to-t from-blue-400/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-10 right-[20%] w-16 h-16 rounded-lg bg-gradient-to-tr from-blue-500/40 to-transparent backdrop-blur-sm border border-white/20 animate-float-slow"></div>
          <div className="absolute top-1/2 right-[40%] w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/30 to-transparent backdrop-blur-sm border border-white/20 animate-float-slow animate-delay-500"></div>
          <div className="absolute bottom-10 left-[30%] w-14 h-14 rounded-lg bg-gradient-to-tl from-violet-500/30 to-transparent backdrop-blur-sm border border-white/20 animate-float-slow animate-delay-700"></div>
          
          <div className="relative z-10 flex flex-col">
            <h1 className="text-4xl font-bold text-white md:text-5xl">
              Help <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-indigo-200 to-violet-200">& Support</span>
            </h1>
            <p className="text-blue-100 mt-3 max-w-2xl text-lg">
              Get help with your account, find answers to common questions, and contact support
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Help */}
        <Card className="border-slate-200 shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-slate-200 bg-white">
            <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Quick Help</CardTitle>
            <CardDescription className="text-slate-600">Find answers to common questions</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-auto py-4 px-6 flex flex-col items-center gap-2 hover:bg-slate-50">
                <BookOpen className="h-6 w-6 text-blue-500" />
                <span className="text-sm font-medium">Documentation</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 px-6 flex flex-col items-center gap-2 hover:bg-slate-50">
                <Video className="h-6 w-6 text-blue-500" />
                <span className="text-sm font-medium">Tutorials</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 px-6 flex flex-col items-center gap-2 hover:bg-slate-50">
                <HelpCircle className="h-6 w-6 text-blue-500" />
                <span className="text-sm font-medium">FAQs</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 px-6 flex flex-col items-center gap-2 hover:bg-slate-50">
                <Book className="h-6 w-6 text-blue-500" />
                <span className="text-sm font-medium">Guides</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Popular Help Articles */}
        <Card className="border-slate-200 shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-slate-200 bg-white">
            <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Popular Articles</CardTitle>
            <CardDescription className="text-slate-600">Most viewed help articles</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {helpArticles.map((article, index) => (
                <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-blue-50 transition-colors">
                    <BookOpen className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">{article.title}</h4>
                    <p className="text-sm text-slate-500 mt-1">{article.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Support Tickets */}
        <Card className="border-slate-200 shadow-lg rounded-2xl overflow-hidden md:col-span-2">
          <CardHeader className="border-b border-slate-200 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Support Tickets</CardTitle>
                <CardDescription className="text-slate-600">View and manage your support requests</CardDescription>
              </div>
              <Button className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl">
                <Plus className="h-5 w-5 mr-2" />
                New Ticket
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {tickets.map((ticket, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-blue-200 transition-colors bg-white">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-slate-100">
                      <MessageSquare className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">{ticket.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={ticket.status === 'Open' ? 'default' : 'secondary'} className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                          {ticket.status}
                        </Badge>
                        <Badge variant="outline" className="border-slate-200">
                          {ticket.category}
                        </Badge>
                        <span className="text-sm text-slate-500">#{ticket.id}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-slate-500">Last updated</p>
                      <p className="text-sm font-medium text-slate-900">{ticket.lastUpdated}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="hover:bg-slate-100">
                      <ChevronRight className="h-5 w-5 text-slate-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 