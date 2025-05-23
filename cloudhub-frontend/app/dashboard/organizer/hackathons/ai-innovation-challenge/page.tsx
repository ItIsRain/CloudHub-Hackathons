"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Trophy,
  Calendar,
  Settings,
  Building2,
  MessageSquare,
  FileText,
  Brain,
  Timer,
  UserCog,
  Database,
  Mail,
  AlertCircle,
  ChevronRight,
  Plus,
  ArrowUpRight,
  Activity,
  PenLine,
  Trash2,
  Check,
  Upload
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"

// Types
interface HackathonStats {
  participants: number;
  teams: number;
  submissions: number;
  mentors: number;
  judges: number;
  daysRemaining: number;
  currentPhase: 'registration' | 'submission' | 'judging' | 'completed';
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'organizer' | 'judge' | 'mentor' | 'media';
  permissions: string[];
  status: 'active' | 'pending' | 'inactive';
  dateAdded: string;
}

interface Sponsor {
  id: string;
  name: string;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
  logo: string;
  website: string;
  description: string;
  contacts: {
    name: string;
    role: string;
    email: string;
    phone: string;
  }[];
  visibility: {
    landing: boolean;
    dashboard: boolean;
    submissions: boolean;
    awards: boolean;
  };
  benefits: string[];
  contribution: number;
}

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'milestone' | 'deadline' | 'workshop' | 'announcement';
  status: 'upcoming' | 'ongoing' | 'completed';
  duration?: number; // in minutes
  location?: string;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'dataset' | 'api' | 'documentation' | 'tool';
  format?: string;
  size?: string;
  url: string;
  accessLevel: 'public' | 'private';
  category: string;
  downloads?: number;
  lastUpdated: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  description: string;
  type: 'welcome' | 'reminder' | 'update' | 'announcement';
  lastUsed?: string;
  variables: string[];
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  views: number;
  helpful: number;
  lastUpdated: string;
}

const stats: HackathonStats = {
  participants: 256,
  teams: 64,
  submissions: 42,
  mentors: 12,
  judges: 8,
  daysRemaining: 15,
  currentPhase: 'submission'
};

const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    role: "organizer",
    permissions: ["admin", "manage_teams", "manage_submissions", "manage_judging"],
    status: "active",
    dateAdded: "2024-02-15T09:00:00"
  },
  {
    id: "2",
    name: "Dr. James Wilson",
    email: "j.wilson@example.com",
    role: "judge",
    permissions: ["view_submissions", "submit_scores", "view_teams"],
    status: "active",
    dateAdded: "2024-02-20T10:30:00"
  },
  {
    id: "3",
    name: "Maria Garcia",
    email: "m.garcia@example.com",
    role: "mentor",
    permissions: ["view_teams", "message_teams", "view_resources"],
    status: "active",
    dateAdded: "2024-02-18T14:15:00"
  }
];

const sponsors: Sponsor[] = [
  {
    id: "1",
    name: "TechCorp AI",
    tier: "platinum",
    logo: "/sponsors/techcorp.svg",
    website: "https://techcorp.ai",
    description: "Leading provider of enterprise AI solutions",
    contacts: [
      {
        name: "Michael Chang",
        role: "Partnership Director",
        email: "m.chang@techcorp.ai",
        phone: "+1 (555) 123-4567"
      }
    ],
    visibility: {
      landing: true,
      dashboard: true,
      submissions: true,
      awards: true
    },
    benefits: [
      "Keynote speaking slot",
      "Dedicated workshop session",
      "Premium booth space",
      "First-tier logo placement"
    ],
    contribution: 25000
  },
  {
    id: "2",
    name: "Neural Dynamics",
    tier: "gold",
    logo: "/sponsors/neural.svg",
    website: "https://neuraldynamics.com",
    description: "Pioneering research in neural networks",
    contacts: [
      {
        name: "Emma Watson",
        role: "Technical Evangelist",
        email: "e.watson@neuraldynamics.com",
        phone: "+1 (555) 234-5678"
      }
    ],
    visibility: {
      landing: true,
      dashboard: true,
      submissions: true,
      awards: false
    },
    benefits: [
      "Workshop session",
      "Booth space",
      "Second-tier logo placement"
    ],
    contribution: 15000
  }
];

const timelineEvents: TimelineEvent[] = [
  {
    id: "1",
    title: "Registration Opens",
    description: "Team registration and project ideation phase begins",
    date: "2024-03-01T09:00:00",
    type: "milestone",
    status: "completed"
  },
  {
    id: "2",
    title: "AI Workshop: Getting Started",
    description: "Introduction to AI tools and frameworks",
    date: "2024-03-15T14:00:00",
    type: "workshop",
    status: "completed",
    duration: 120,
    location: "Virtual - Zoom"
  },
  {
    id: "3",
    title: "Mentor Matching Deadline",
    description: "Last day to request mentor assignments",
    date: "2024-04-05T18:00:00",
    type: "deadline",
    status: "upcoming"
  },
  {
    id: "4",
    title: "Project Submissions Due",
    description: "Final project submissions including code and documentation",
    date: "2024-04-15T23:59:00",
    type: "deadline",
    status: "upcoming"
  }
];

const resources: Resource[] = [
  {
    id: "1",
    title: "AI Training Dataset",
    description: "Curated dataset for machine learning model training",
    type: "dataset",
    format: "CSV, JSON",
    size: "2.5GB",
    url: "/datasets/ai-training",
    accessLevel: "public",
    category: "Machine Learning",
    downloads: 128,
    lastUpdated: "2024-03-15T10:00:00"
  },
  {
    id: "2",
    title: "Computer Vision API",
    description: "API access for image recognition and processing",
    type: "api",
    url: "/api/docs/vision",
    accessLevel: "private",
    category: "Computer Vision",
    downloads: 85,
    lastUpdated: "2024-03-10T14:30:00"
  },
  {
    id: "3",
    title: "Getting Started Guide",
    description: "Comprehensive guide for participants",
    type: "documentation",
    format: "PDF",
    url: "/docs/getting-started",
    accessLevel: "public",
    category: "Guides",
    downloads: 256,
    lastUpdated: "2024-03-01T09:00:00"
  }
];

const emailTemplates: EmailTemplate[] = [
  {
    id: "1",
    name: "Welcome Email",
    subject: "Welcome to AI Innovation Challenge 2024!",
    description: "Initial welcome email sent to all participants",
    type: "welcome",
    lastUsed: "2024-03-01T09:00:00",
    variables: ["participantName", "teamName", "startDate", "mentorName"]
  },
  {
    id: "2",
    name: "Submission Reminder",
    subject: "Project Submission Deadline Approaching",
    description: "Reminder email for project submission deadline",
    type: "reminder",
    lastUsed: "2024-03-15T14:00:00",
    variables: ["participantName", "teamName", "daysRemaining", "submissionLink"]
  }
];

const faqs: FAQ[] = [
  {
    id: "1",
    question: "What AI frameworks are allowed in the competition?",
    answer: "Participants can use any open-source AI frameworks including but not limited to TensorFlow, PyTorch, and scikit-learn. Custom implementations are also welcome.",
    category: "Technical",
    views: 245,
    helpful: 180,
    lastUpdated: "2024-03-01T09:00:00"
  },
  {
    id: "2",
    question: "How are projects evaluated?",
    answer: "Projects are evaluated based on innovation (30%), technical implementation (30%), impact (20%), and presentation (20%). Each criteria is scored by a panel of expert judges.",
    category: "Judging",
    views: 312,
    helpful: 290,
    lastUpdated: "2024-03-05T11:30:00"
  }
];

const rolePermissions = {
  organizer: [
    "admin",
    "manage_teams",
    "manage_submissions",
    "manage_judging",
    "manage_resources",
    "manage_communications"
  ],
  judge: [
    "view_submissions",
    "submit_scores",
    "view_teams",
    "view_resources"
  ],
  mentor: [
    "view_teams",
    "message_teams",
    "view_resources",
    "submit_feedback"
  ],
  media: [
    "view_teams",
    "publish_content",
    "manage_social",
    "view_resources"
  ]
};

export default function AIHackathonManagement() {
  const [activeTab, setActiveTab] = useState("overview")
  const [activeFaqFilter, setActiveFaqFilter] = useState("all")
  const router = useRouter()

  // Filter FAQs based on selected category
  const filteredFaqs = activeFaqFilter === "all" 
    ? faqs 
    : faqs.filter(faq => faq.category.toLowerCase() === activeFaqFilter.toLowerCase())

  // Quick Action button base styles
  const quickActionButtonStyles = "w-full justify-start bg-white hover:bg-slate-50 text-slate-900 border-slate-200 hover:border-slate-300 shadow-sm transition-all duration-200 h-auto py-4"

  const getPhaseColor = (phase: HackathonStats['currentPhase']) => {
    switch (phase) {
      case 'registration':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'submission':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'judging':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-8 pb-10 px-6">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl shadow-lg mt-6">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/20"></div>
        
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-1/3 h-4/5 bg-gradient-to-b from-white/10 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-2/3 h-1/2 bg-gradient-to-t from-blue-400/10 to-transparent rounded-full blur-3xl"></div>
        
        <div className="relative p-8 sm:p-10">
          <div className="grid gap-6 md:grid-cols-2 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-1.5 rounded-full mb-5 text-white text-sm border border-white/20 shadow-xl">
                <Brain className="h-4 w-4 text-purple-200" />
                <span className="font-medium tracking-wide">AI Innovation Challenge</span>
              </div>
              
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-3 tracking-tight">Hackathon Management</h1>
              
              <p className="text-white/90 text-lg mb-6 max-w-lg font-light">
                Manage all aspects of the AI Innovation Challenge, from team coordination to resource distribution.
              </p>

              <div className="flex items-center gap-3">
                <Button 
                  className="bg-white/10 backdrop-blur-md text-white border border-white/25 hover:bg-white/20 shadow-lg transition-all group px-5 py-2 h-auto text-sm font-medium rounded-xl"
                >
                  <Plus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  Add Team
                </Button>
                <Button 
                  className="bg-white/10 backdrop-blur-md text-white border border-white/25 hover:bg-white/20 shadow-lg transition-all group px-5 py-2 h-auto text-sm font-medium rounded-xl"
                >
                  <MessageSquare className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  Send Update
                </Button>
                <Button 
                  className="bg-white/10 backdrop-blur-md text-white border border-white/25 hover:bg-white/20 shadow-lg transition-all group px-5 py-2 h-auto text-sm font-medium rounded-xl"
                >
                  <Settings className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  Settings
                </Button>
              </div>
            </div>

            <div className="hidden md:grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 text-center shadow-xl">
                <h3 className="text-3xl font-bold text-white">{stats.participants}</h3>
                <p className="text-xs text-white/80 mt-1">Total Participants</p>
                <div className="text-xs text-emerald-300 mt-2 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-emerald-400/30 flex items-center justify-center mr-1">
                    <span className="text-[8px]">+</span>
                  </div>
                  12 today
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 text-center shadow-xl">
                <h3 className="text-3xl font-bold text-white">{stats.submissions}</h3>
                <p className="text-xs text-white/80 mt-1">Project Submissions</p>
                <div className="text-xs text-purple-300 mt-2 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-purple-400/30 flex items-center justify-center mr-1">
                    <span className="text-[8px]">↑</span>
                  </div>
                  65% complete
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 text-center shadow-xl">
                <h3 className="text-3xl font-bold text-white">{stats.mentors}</h3>
                <p className="text-xs text-white/80 mt-1">Active Mentors</p>
                <div className="text-xs text-blue-300 mt-2 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-blue-400/30 flex items-center justify-center mr-1">
                    <span className="text-[8px]">!</span>
                  </div>
                  All available
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 text-center shadow-xl">
                <h3 className="text-3xl font-bold text-white">{stats.judges}</h3>
                <p className="text-xs text-white/80 mt-1">Active Judges</p>
                <div className="text-xs text-emerald-300 mt-2 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-emerald-400/30 flex items-center justify-center mr-1">
                    <span className="text-[8px]">↑</span>
                  </div>
                  Ready to review
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
        <div className="border-b border-slate-200">
          <Tabs defaultValue="overview">
            <TabsList className="p-0 w-full bg-slate-50/80 border border-slate-200/70 shadow-sm rounded-none">
              <TabsTrigger 
                value="overview"
                className="flex items-center gap-2 flex-1 text-sm font-medium py-2.5 rounded-none data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
              >
                <Activity className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="teams"
                className="flex items-center gap-2 flex-1 text-sm font-medium py-2.5 rounded-none data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
              >
                <Users className="h-4 w-4" />
                Teams
              </TabsTrigger>
              <TabsTrigger 
                value="sponsors"
                className="flex items-center gap-2 flex-1 text-sm font-medium py-2.5 rounded-none data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
              >
                <Building2 className="h-4 w-4" />
                Sponsors
              </TabsTrigger>
              <TabsTrigger 
                value="timeline"
                className="flex items-center gap-2 flex-1 text-sm font-medium py-2.5 rounded-none data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
              >
                <Calendar className="h-4 w-4" />
                Timeline
              </TabsTrigger>
              <TabsTrigger 
                value="resources"
                className="flex items-center gap-2 flex-1 text-sm font-medium py-2.5 rounded-none data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
              >
                <Database className="h-4 w-4" />
                Resources
              </TabsTrigger>
              <TabsTrigger 
                value="communications"
                className="flex items-center gap-2 flex-1 text-sm font-medium py-2.5 rounded-none data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
              >
                <Mail className="h-4 w-4" />
                Communications
              </TabsTrigger>
            </TabsList>
            {/* Tab Content */}
            <div className="p-6">
              <TabsContent value="overview" className="mt-0 space-y-6">
                {/* Overview Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-slate-200 shadow-md overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 px-6 py-7">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-sm">
                          <Calendar className="h-4 w-4 text-white" />
                        </div>
                        <CardTitle className="text-lg font-semibold text-slate-800">Upcoming Deadlines</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 border border-slate-100">
                          <div className="h-10 w-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                            <Timer className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-medium">Project Submissions Due</h4>
                            <p className="text-sm text-slate-600">April 15, 2024 at 11:59 PM</p>
                          </div>
                          <Badge variant="outline" className="ml-auto">
                            In 15 days
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 border border-slate-100">
                          <div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                            <Users className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-medium">Mentor Matching Deadline</h4>
                            <p className="text-sm text-slate-600">April 5, 2024 at 6:00 PM</p>
                          </div>
                          <Badge variant="outline" className="ml-auto">
                            In 5 days
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-200 shadow-md overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-sm">
                          <AlertCircle className="h-4 w-4 text-white" />
                        </div>
                        <CardTitle className="text-lg font-semibold text-slate-800">Recent Activity</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                            <Users className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm">
                              <span className="font-medium">New team registered:</span> AI Innovators
                            </p>
                            <p className="text-xs text-slate-500">2 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
                            <MessageSquare className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm">
                              <span className="font-medium">Announcement sent:</span> Workshop Schedule Update
                            </p>
                            <p className="text-xs text-slate-500">5 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                            <Trophy className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm">
                              <span className="font-medium">Project submitted:</span> Neural Network Navigator
                            </p>
                            <p className="text-xs text-slate-500">8 hours ago</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="teams" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Team Members List */}
                  <Card className="lg:col-span-2 border-slate-200 shadow-md overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-sm">
                            <Users className="h-4 w-4 text-white" />
                          </div>
                          <CardTitle className="text-lg font-semibold text-slate-800">Team Members</CardTitle>
                        </div>
                        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Member
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {teamMembers.map((member) => (
                          <div 
                            key={member.id}
                            className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 bg-gradient-to-r from-slate-50 to-white hover:shadow-md transition-all duration-200"
                          >
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-medium shadow-sm">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </div>
                            </div>
                            
                            <div className="flex-grow min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-slate-900 truncate">{member.name}</h4>
                                <Badge 
                                  variant="outline" 
                                  className={cn(
                                    "shadow-sm",
                                    member.role === 'organizer' && "bg-purple-50 text-purple-700 border-purple-200",
                                    member.role === 'judge' && "bg-blue-50 text-blue-700 border-blue-200",
                                    member.role === 'mentor' && "bg-emerald-50 text-emerald-700 border-emerald-200",
                                    member.role === 'media' && "bg-amber-50 text-amber-700 border-amber-200"
                                  )}
                                >
                                  {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                                </Badge>
                                <Badge 
                                  variant="outline" 
                                  className={cn(
                                    "shadow-sm",
                                    member.status === 'active' && "bg-emerald-50 text-emerald-700 border-emerald-200",
                                    member.status === 'pending' && "bg-amber-50 text-amber-700 border-amber-200",
                                    member.status === 'inactive' && "bg-slate-50 text-slate-700 border-slate-200"
                                  )}
                                >
                                  {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-600 truncate">{member.email}</p>
                              <div className="flex items-center gap-2 mt-2">
                                {member.permissions.slice(0, 3).map((permission) => (
                                  <span 
                                    key={permission}
                                    className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs shadow-sm"
                                  >
                                    {permission.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                  </span>
                                ))}
                                {member.permissions.length > 3 && (
                                  <span className="text-xs text-slate-500">
                                    +{member.permissions.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                              >
                                <PenLine className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-slate-600 hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Role Management */}
                  <Card className="border-slate-200 shadow-md overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-sm">
                          <UserCog className="h-4 w-4 text-white" />
                        </div>
                        <CardTitle className="text-lg font-semibold text-slate-800">Role Management</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        {Object.entries(rolePermissions).map(([role, permissions]) => (
                          <div key={role} className="space-y-3">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium capitalize text-slate-800">{role}</h4>
                              <Badge 
                                variant="outline" 
                                className={cn(
                                  "shadow-sm ml-auto",
                                  role === 'organizer' && "bg-purple-50 text-purple-700 border-purple-200",
                                  role === 'judge' && "bg-blue-50 text-blue-700 border-blue-200",
                                  role === 'mentor' && "bg-emerald-50 text-emerald-700 border-emerald-200",
                                  role === 'media' && "bg-amber-50 text-amber-700 border-amber-200"
                                )}
                              >
                                {teamMembers.filter(m => m.role === role).length} members
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              {permissions.map((permission) => (
                                <div 
                                  key={permission}
                                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-gradient-to-r from-slate-50 to-white border border-slate-200 shadow-sm"
                                >
                                  <Label 
                                    htmlFor={`permission-${permission}`}
                                    className="text-sm text-slate-700"
                                  >
                                    {permission.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                  </Label>
                                  <Checkbox 
                                    id={`permission-${permission}`}
                                    className="data-[state=checked]:bg-purple-600"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="flex justify-end mt-6">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md">
                    Save Changes
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="sponsors" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Sponsors List */}
                  <Card className="lg:col-span-2 border-slate-200 shadow-md overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-sm">
                            <Building2 className="h-4 w-4 text-white" />
                          </div>
                          <CardTitle className="text-lg font-semibold text-slate-800">Sponsors</CardTitle>
                        </div>
                        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Sponsor
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        {sponsors.map((sponsor) => (
                          <div 
                            key={sponsor.id}
                            className="rounded-lg border border-slate-200 bg-gradient-to-r from-slate-50 to-white overflow-hidden hover:shadow-md transition-all duration-200"
                          >
                            <div className="p-4 bg-white border-b border-slate-200">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-slate-100 to-white border border-slate-200 flex items-center justify-center shadow-sm">
                                    <Building2 className="h-6 w-6 text-slate-400" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-slate-900">{sponsor.name}</h4>
                                    <p className="text-sm text-slate-600">{sponsor.description}</p>
                                  </div>
                                </div>
                                <Badge 
                                  variant="outline" 
                                  className={cn(
                                    "shadow-sm",
                                    sponsor.tier === 'platinum' && "bg-violet-50 text-violet-700 border-violet-200",
                                    sponsor.tier === 'gold' && "bg-amber-50 text-amber-700 border-amber-200",
                                    sponsor.tier === 'silver' && "bg-slate-50 text-slate-700 border-slate-200",
                                    sponsor.tier === 'bronze' && "bg-orange-50 text-orange-700 border-orange-200"
                                  )}
                                >
                                  {sponsor.tier.charAt(0).toUpperCase() + sponsor.tier.slice(1)} Tier
                                </Badge>
                              </div>
                            </div>

                            <div className="p-4 space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <h5 className="text-sm font-medium text-slate-700">Primary Contact</h5>
                                  <div className="p-3 rounded-lg bg-gradient-to-r from-slate-50 to-white border border-slate-200 space-y-1 shadow-sm">
                                    <p className="text-sm font-medium text-slate-800">{sponsor.contacts[0].name}</p>
                                    <p className="text-sm text-slate-600">{sponsor.contacts[0].role}</p>
                                    <p className="text-sm text-slate-600">{sponsor.contacts[0].email}</p>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <h5 className="text-sm font-medium text-slate-700">Visibility</h5>
                                  <div className="p-3 rounded-lg bg-gradient-to-r from-slate-50 to-white border border-slate-200 space-y-2 shadow-sm">
                                    {Object.entries(sponsor.visibility).map(([key, value]) => (
                                      <div key={key} className="flex items-center gap-2">
                                        <Checkbox 
                                          id={`visibility-${key}`}
                                          checked={value}
                                          className="data-[state=checked]:bg-purple-600"
                                        />
                                        <Label 
                                          htmlFor={`visibility-${key}`}
                                          className="text-sm capitalize text-slate-700"
                                        >
                                          {key.replace('_', ' ')}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <h5 className="text-sm font-medium text-slate-700">Benefits</h5>
                                <div className="flex flex-wrap gap-2">
                                  {sponsor.benefits.map((benefit, index) => (
                                    <Badge 
                                      key={index} 
                                      variant="outline" 
                                      className="bg-slate-50 text-slate-700 border-slate-200 shadow-sm"
                                    >
                                      {benefit}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                                <div className="flex items-baseline gap-2">
                                  <span className="text-sm font-medium text-slate-700">Contribution:</span>
                                  <span className="text-lg font-semibold text-slate-900">
                                    ${sponsor.contribution.toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="h-8 text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                                  >
                                    <PenLine className="h-4 w-4 mr-2" />
                                    Edit
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Remove
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Sponsorship Tiers */}
                  <Card className="border-slate-200 shadow-md overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-sm">
                          <Trophy className="h-4 w-4 text-white" />
                        </div>
                        <CardTitle className="text-lg font-semibold text-slate-800">Sponsorship Tiers</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-gradient-to-r from-violet-50 to-violet-50/50 border border-violet-200 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-violet-900">Platinum</h4>
                            <Badge variant="outline" className="bg-violet-100 text-violet-700 border-violet-200 shadow-sm">
                              25,000 AED
                            </Badge>
                          </div>
                          <p className="text-sm text-violet-700 mb-3">Premium partnership with maximum visibility and benefits</p>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-violet-700">
                              <Check className="h-4 w-4" />
                              All Gold tier benefits
                            </div>
                            <div className="flex items-center gap-2 text-sm text-violet-700">
                              <Check className="h-4 w-4" />
                              Keynote speaking opportunity
                            </div>
                            <div className="flex items-center gap-2 text-sm text-violet-700">
                              <Check className="h-4 w-4" />
                              Dedicated workshop session
                            </div>
                          </div>
                        </div>

                        <div className="p-4 rounded-lg bg-gradient-to-r from-amber-50 to-amber-50/50 border border-amber-200 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-amber-900">Gold</h4>
                            <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200 shadow-sm">
                              15,000 AED
                            </Badge>
                          </div>
                          <p className="text-sm text-amber-700 mb-3">Enhanced visibility with premium placement</p>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-amber-700">
                              <Check className="h-4 w-4" />
                              All Silver tier benefits
                            </div>
                            <div className="flex items-center gap-2 text-sm text-amber-700">
                              <Check className="h-4 w-4" />
                              Workshop session
                            </div>
                            <div className="flex items-center gap-2 text-sm text-amber-700">
                              <Check className="h-4 w-4" />
                              Premium booth location
                            </div>
                          </div>
                        </div>

                        <div className="p-4 rounded-lg bg-gradient-to-r from-slate-50 to-slate-50/50 border border-slate-200 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-slate-900">Silver</h4>
                            <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200 shadow-sm">
                              10,000 AED
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-700 mb-3">Standard sponsorship package with good visibility</p>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-slate-700">
                              <Check className="h-4 w-4" />
                              Logo on website & materials
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-700">
                              <Check className="h-4 w-4" />
                              Booth space
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-700">
                              <Check className="h-4 w-4" />
                              Social media mentions
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="flex justify-end mt-6">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md">
                    Save Changes
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="timeline" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Timeline View */}
                  <Card className="lg:col-span-2 border-slate-200 shadow-md overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-sm">
                            <Calendar className="h-4 w-4 text-white" />
                          </div>
                          <CardTitle className="text-lg font-semibold text-slate-800">Event Timeline</CardTitle>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Event
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px] p-0 gap-0">
                            <DialogHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6 relative overflow-hidden">
                              <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
                              <div className="relative">
                                <DialogTitle className="text-xl font-semibold tracking-tight text-slate-900">Add New Event</DialogTitle>
                                <DialogDescription className="text-base text-slate-500 mt-2">
                                  Add a new event to your hackathon timeline. Events help participants stay on track and informed.
                                </DialogDescription>
                              </div>
                            </DialogHeader>
                            
                            <div className="p-6 space-y-6">
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="event-title" className="text-sm font-medium text-slate-900">Title</Label>
                                  <Input 
                                    id="event-title" 
                                    placeholder="Enter event title"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="event-description" className="text-sm font-medium text-slate-900">Description</Label>
                                  <Textarea 
                                    id="event-description" 
                                    placeholder="Provide event details and any important information" 
                                    className="min-h-[100px] w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow resize-y"
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="event-date" className="text-sm font-medium text-slate-900">Date & Time</Label>
                                    <Input 
                                      id="event-date" 
                                      type="datetime-local"
                                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="event-type" className="text-sm font-medium text-slate-900">Event Type</Label>
                                    <select 
                                      id="event-type" 
                                      className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500/20 transition-shadow bg-white"
                                    >
                                      <option value="milestone">Milestone</option>
                                      <option value="deadline">Deadline</option>
                                      <option value="workshop">Workshop</option>
                                      <option value="announcement">Announcement</option>
                                    </select>
                                  </div>
                                </div>

                                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-4">
                                  <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium text-slate-900">
                                      Additional Details
                                    </Label>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="event-duration" className="text-sm font-medium text-slate-900">Duration (minutes)</Label>
                                      <Input 
                                        id="event-duration" 
                                        type="number" 
                                        min="0"
                                        placeholder="Enter duration"
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="event-location" className="text-sm font-medium text-slate-900">Location</Label>
                                      <Input 
                                        id="event-location" 
                                        placeholder="Enter location or URL"
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-3 mt-4">
                                    <div className="flex items-center gap-2">
                                      <Checkbox 
                                        id="event-notify" 
                                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                      />
                                      <Label htmlFor="event-notify" className="text-sm text-slate-600">
                                        Send notification to participants
                                      </Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Checkbox 
                                        id="event-featured" 
                                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                      />
                                      <Label htmlFor="event-featured" className="text-sm text-slate-600">
                                        Feature this event
                                      </Label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
                              <Button 
                                variant="outline"
                                className="rounded-lg px-4 hover:bg-slate-100 transition-colors"
                              >
                                Cancel
                              </Button>
                              <Button 
                                className="rounded-lg px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all hover:shadow-lg"
                              >
                                Create Event
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="relative space-y-6 pb-4">
                        {/* Timeline line */}
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-200 via-blue-200 to-slate-200" />

                        {timelineEvents.map((event, index) => (
                          <div 
                            key={event.id}
                            className={cn(
                              "relative pl-10 pr-4 py-4 rounded-lg border transition-all duration-200",
                              event.status === "completed" ? "bg-slate-50/70" : "bg-white",
                              "hover:shadow-md",
                              index === 0 && "mt-0"
                            )}
                          >
                            {/* Timeline dot with pulse effect for ongoing events */}
                            <div className="absolute left-0 ml-2 -mt-2">
                              <div 
                                className={cn(
                                  "w-5 h-5 rounded-full border-2 border-white shadow-md",
                                  event.status === "completed" && "bg-emerald-500",
                                  event.status === "ongoing" && "bg-blue-500",
                                  event.status === "upcoming" && "bg-slate-300"
                                )}
                              />
                              {event.status === "ongoing" && (
                                <div className="absolute top-0 left-0 w-5 h-5">
                                  <div className="absolute inline-flex w-full h-full rounded-full opacity-75 bg-blue-500 animate-ping" />
                                </div>
                              )}
                            </div>

                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-grow">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-medium text-slate-900">{event.title}</h4>
                                  <Badge 
                                    variant="outline" 
                                    className={cn(
                                      "capitalize shadow-sm",
                                      event.type === "milestone" && "bg-purple-50 text-purple-700 border-purple-200",
                                      event.type === "deadline" && "bg-red-50 text-red-700 border-red-200",
                                      event.type === "workshop" && "bg-blue-50 text-blue-700 border-blue-200",
                                      event.type === "announcement" && "bg-amber-50 text-amber-700 border-amber-200"
                                    )}
                                  >
                                    {event.type}
                                  </Badge>
                                  <Badge 
                                    variant="outline" 
                                    className={cn(
                                      "capitalize shadow-sm",
                                      event.status === "completed" && "bg-emerald-50 text-emerald-700 border-emerald-200",
                                      event.status === "ongoing" && "bg-blue-50 text-blue-700 border-blue-200",
                                      event.status === "upcoming" && "bg-slate-50 text-slate-700 border-slate-200"
                                    )}
                                  >
                                    {event.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-slate-600 mb-3">{event.description}</p>
                                <div className="flex items-center gap-4 text-sm text-slate-500">
                                  <div className="flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(event.date).toLocaleDateString()}
                                  </div>
                                  {event.duration && (
                                    <div className="flex items-center gap-1.5">
                                      <Timer className="h-4 w-4" />
                                      {event.duration} minutes
                                    </div>
                                  )}
                                  {event.location && (
                                    <div className="flex items-center gap-1.5">
                                      <Building2 className="h-4 w-4" />
                                      {event.location}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-start gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-8 text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                                >
                                  <PenLine className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions and Settings */}
                  <div className="space-y-6">
                    <Card className="border-slate-200 shadow-md overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-sm">
                            <Plus className="h-4 w-4 text-white" />
                          </div>
                          <CardTitle className="text-lg font-semibold text-slate-800">Quick Actions</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className={quickActionButtonStyles}>
                                <div className="flex items-center gap-3">
                                  <Plus className="h-5 w-5 text-purple-600" />
                                  <div className="text-left">
                                    <div className="font-medium">Add Milestone</div>
                                    <div className="text-sm text-slate-600">Create a new milestone</div>
                                  </div>
                                </div>
                                <ChevronRight className="h-5 w-5 ml-auto text-slate-400" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px] p-0 gap-0">
                              <DialogHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6 relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
                                <div className="relative">
                                  <DialogTitle className="text-xl font-semibold tracking-tight text-slate-900">Add New Milestone</DialogTitle>
                                  <DialogDescription className="text-base text-slate-500 mt-2">
                                    Create a new milestone to mark important events and progress in your hackathon timeline.
                                  </DialogDescription>
                                </div>
                              </DialogHeader>
                              
                              <div className="p-6 space-y-6">
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="milestone-title" className="text-sm font-medium text-slate-900">Title</Label>
                                    <Input 
                                      id="milestone-title" 
                                      placeholder="Enter milestone title"
                                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                                    />
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label htmlFor="milestone-description" className="text-sm font-medium text-slate-900">Description</Label>
                                    <Textarea 
                                      id="milestone-description" 
                                      placeholder="Provide details about this milestone" 
                                      className="min-h-[100px] w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow resize-y"
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="milestone-date" className="text-sm font-medium text-slate-900">Date</Label>
                                      <Input 
                                        id="milestone-date" 
                                        type="datetime-local"
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="milestone-type" className="text-sm font-medium text-slate-900">Type</Label>
                                      <select 
                                        id="milestone-type" 
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500/20 transition-shadow bg-white"
                                      >
                                        <option value="project">Project</option>
                                        <option value="submission">Submission</option>
                                        <option value="judging">Judging</option>
                                        <option value="event">Event</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-4">
                                    <div className="flex items-center justify-between">
                                      <Label className="text-sm font-medium text-slate-900">
                                        Milestone Settings
                                      </Label>
                                    </div>
                                    <div className="space-y-3">
                                      <div className="flex items-center gap-2">
                                        <Checkbox 
                                          id="milestone-notify" 
                                          className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                        />
                                        <Label htmlFor="milestone-notify" className="text-sm text-slate-600">
                                          Send notification to participants
                                        </Label>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Checkbox 
                                          id="milestone-featured" 
                                          className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                        />
                                        <Label htmlFor="milestone-featured" className="text-sm text-slate-600">
                                          Feature this milestone
                                        </Label>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Checkbox 
                                          id="milestone-required" 
                                          className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                        />
                                        <Label htmlFor="milestone-required" className="text-sm text-slate-600">
                                          Mark as required milestone
                                        </Label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
                                <Button 
                                  variant="outline"
                                  className="rounded-lg px-4 hover:bg-slate-100 transition-colors"
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  className="rounded-lg px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all hover:shadow-lg"
                                >
                                  Create Milestone
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className={quickActionButtonStyles}>
                                <div className="flex items-center gap-3">
                                  <Plus className="h-5 w-5 text-blue-600" />
                                  <div className="text-left">
                                    <div className="font-medium">Add Workshop</div>
                                    <div className="text-sm text-slate-600">Schedule a new workshop</div>
                                  </div>
                                </div>
                                <ChevronRight className="h-5 w-5 ml-auto text-slate-400" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px] p-0 gap-0">
                              <DialogHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6 relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
                                <div className="relative">
                                  <DialogTitle className="text-xl font-semibold tracking-tight text-slate-900">Add New Workshop</DialogTitle>
                                  <DialogDescription className="text-base text-slate-500 mt-2">
                                    Schedule a new workshop for participants.
                                  </DialogDescription>
                                </div>
                              </DialogHeader>
                              
                              <div className="p-6 space-y-6">
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="workshop-title" className="text-sm font-medium text-slate-900">Title</Label>
                                    <Input 
                                      id="workshop-title" 
                                      placeholder="Enter workshop title"
                                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="workshop-description" className="text-sm font-medium text-slate-900">Description</Label>
                                    <Textarea 
                                      id="workshop-description" 
                                      placeholder="Enter workshop description"
                                      className="min-h-[100px] w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow resize-y"
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="workshop-date" className="text-sm font-medium text-slate-900">Date</Label>
                                      <Input 
                                        id="workshop-date" 
                                        type="datetime-local"
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="workshop-duration" className="text-sm font-medium text-slate-900">Duration (minutes)</Label>
                                      <Input 
                                        id="workshop-duration" 
                                        type="number" 
                                        min="0"
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="workshop-location" className="text-sm font-medium text-slate-900">Location</Label>
                                    <Input 
                                      id="workshop-location" 
                                      placeholder="Enter location or meeting link"
                                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
                                <Button 
                                  variant="outline"
                                  className="rounded-lg px-4 hover:bg-slate-100 transition-colors"
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  className="rounded-lg px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all hover:shadow-lg"
                                >
                                  Schedule Workshop
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className={quickActionButtonStyles}>
                                <div className="flex items-center gap-3">
                                  <Plus className="h-5 w-5 text-red-600" />
                                  <div className="text-left">
                                    <div className="font-medium">Add Deadline</div>
                                    <div className="text-sm text-slate-600">Set a new deadline</div>
                                  </div>
                                </div>
                                <ChevronRight className="h-5 w-5 ml-auto text-slate-400" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px] p-0 gap-0">
                              <DialogHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6 relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
                                <div className="relative">
                                  <DialogTitle className="text-xl font-semibold tracking-tight text-slate-900">Add New Deadline</DialogTitle>
                                  <DialogDescription className="text-base text-slate-500 mt-2">
                                    Set a new deadline for your hackathon.
                                  </DialogDescription>
                                </div>
                              </DialogHeader>
                              
                              <div className="p-6 space-y-6">
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="deadline-title" className="text-sm font-medium text-slate-900">Title</Label>
                                    <Input 
                                      id="deadline-title" 
                                      placeholder="Enter deadline title"
                                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="deadline-description" className="text-sm font-medium text-slate-900">Description</Label>
                                    <Textarea 
                                      id="deadline-description" 
                                      placeholder="Enter deadline description"
                                      className="min-h-[100px] w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow resize-y"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="deadline-date" className="text-sm font-medium text-slate-900">Due Date</Label>
                                    <Input 
                                      id="deadline-date" 
                                      type="datetime-local"
                                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="deadline-reminder" className="text-sm font-medium text-slate-900">Set Reminder</Label>
                                    <select 
                                      id="deadline-reminder" 
                                      className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500/20 transition-shadow bg-white"
                                    >
                                      <option value="1">1 day before</option>
                                      <option value="3">3 days before</option>
                                      <option value="7">1 week before</option>
                                    </select>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
                                <Button 
                                  variant="outline"
                                  className="rounded-lg px-4 hover:bg-slate-100 transition-colors"
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  className="rounded-lg px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all hover:shadow-lg"
                                >
                                  Set Deadline
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold">Phase Settings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-slate-900">Registration Phase</h4>
                              <Badge variant="outline" className="bg-emerald-50 text-emerald-700">
                                Completed
                              </Badge>
                            </div>
                            <div className="text-sm text-slate-600">
                              Mar 1, 2024 - Mar 31, 2024
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-slate-900">Project Phase</h4>
                              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                Active
                              </Badge>
                            </div>
                            <div className="text-sm text-slate-600">
                              Apr 1, 2024 - Apr 15, 2024
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-slate-900">Judging Phase</h4>
                              <Badge variant="outline" className="bg-slate-50 text-slate-700">
                                Upcoming
                              </Badge>
                            </div>
                            <div className="text-sm text-slate-600">
                              Apr 16, 2024 - Apr 30, 2024
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="resources" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Resources List */}
                  <Card className="lg:col-span-2 border-slate-200 shadow-md overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-sm">
                            <Database className="h-4 w-4 text-white" />
                          </div>
                          <CardTitle className="text-lg font-semibold text-slate-800">Resources</CardTitle>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Resource
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px] p-0 gap-0">
                            <DialogHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6 relative overflow-hidden">
                              <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
                              <div className="relative">
                                <DialogTitle className="text-xl font-semibold tracking-tight text-slate-900">Add New Resource</DialogTitle>
                                <DialogDescription className="text-base text-slate-500 mt-2">
                                  Add a new resource to help participants in their projects. Resources can be datasets, APIs, documentation, or tools.
                                </DialogDescription>
                              </div>
                            </DialogHeader>
                            
                            <div className="p-6 space-y-6">
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="resource-title" className="text-sm font-medium text-slate-900">Title</Label>
                                  <Input 
                                    id="resource-title" 
                                    placeholder="Enter resource title"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="resource-description" className="text-sm font-medium text-slate-900">Description</Label>
                                  <Textarea 
                                    id="resource-description" 
                                    placeholder="Provide a detailed description of the resource" 
                                    className="min-h-[100px] w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow resize-y"
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="resource-type" className="text-sm font-medium text-slate-900">Resource Type</Label>
                                    <select 
                                      id="resource-type" 
                                      className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500/20 transition-shadow bg-white"
                                    >
                                      <option value="dataset">Dataset</option>
                                      <option value="api">API</option>
                                      <option value="documentation">Documentation</option>
                                      <option value="tool">Tool</option>
                                    </select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="resource-access" className="text-sm font-medium text-slate-900">Access Level</Label>
                                    <select 
                                      id="resource-access" 
                                      className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500/20 transition-shadow bg-white"
                                    >
                                      <option value="public">Public</option>
                                      <option value="private">Private</option>
                                    </select>
                                  </div>
                                </div>

                                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-4">
                                  <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium text-slate-900">
                                      Resource Details
                                    </Label>
                                  </div>
                                  <div className="space-y-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="resource-url" className="text-sm font-medium text-slate-900">Resource URL</Label>
                                      <Input 
                                        id="resource-url" 
                                        placeholder="Enter resource URL or endpoint"
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                                      />
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="resource-format" className="text-sm font-medium text-slate-900">Format</Label>
                                        <Input 
                                          id="resource-format" 
                                          placeholder="e.g., CSV, JSON, PDF"
                                          className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="resource-size" className="text-sm font-medium text-slate-900">Size</Label>
                                        <Input 
                                          id="resource-size" 
                                          placeholder="e.g., 2.5GB"
                                          className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="space-y-3 mt-4">
                                    <div className="flex items-center gap-2">
                                      <Checkbox 
                                        id="resource-featured" 
                                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                      />
                                      <Label htmlFor="resource-featured" className="text-sm text-slate-600">
                                        Feature this resource
                                      </Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Checkbox 
                                        id="resource-notify" 
                                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                      />
                                      <Label htmlFor="resource-notify" className="text-sm text-slate-600">
                                        Notify participants about this resource
                                      </Label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
                              <Button 
                                variant="outline"
                                className="rounded-lg px-4 hover:bg-slate-100 transition-colors"
                              >
                                Cancel
                              </Button>
                              <Button 
                                className="rounded-lg px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all hover:shadow-lg"
                              >
                                Add Resource
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {resources.map((resource) => (
                          <div 
                            key={resource.id}
                            className="rounded-lg border border-slate-200 bg-gradient-to-r from-slate-50 to-white overflow-hidden hover:shadow-md transition-all duration-200"
                          >
                            <div className="p-4">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                  <div className={cn(
                                    "h-10 w-10 rounded-lg flex items-center justify-center shadow-sm",
                                    resource.type === "dataset" && "bg-gradient-to-br from-purple-100 to-purple-50 text-purple-700 border border-purple-200",
                                    resource.type === "api" && "bg-gradient-to-br from-blue-100 to-blue-50 text-blue-700 border border-blue-200",
                                    resource.type === "documentation" && "bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-700 border border-emerald-200",
                                    resource.type === "tool" && "bg-gradient-to-br from-amber-100 to-amber-50 text-amber-700 border border-amber-200"
                                  )}>
                                    {resource.type === "dataset" && <Database className="h-5 w-5" />}
                                    {resource.type === "api" && <FileText className="h-5 w-5" />}
                                    {resource.type === "documentation" && <FileText className="h-5 w-5" />}
                                    {resource.type === "tool" && <Settings className="h-5 w-5" />}
                                  </div>
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-medium text-slate-900">{resource.title}</h4>
                                      <Badge 
                                        variant="outline" 
                                        className={cn(
                                          "capitalize shadow-sm",
                                          resource.accessLevel === "public" && "bg-emerald-50 text-emerald-700 border-emerald-200",
                                          resource.accessLevel === "private" && "bg-amber-50 text-amber-700 border-amber-200"
                                        )}
                                      >
                                        {resource.accessLevel}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-slate-600">{resource.description}</p>
                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                      <span className="capitalize">{resource.category}</span>
                                      {resource.format && (
                                        <span>Format: {resource.format}</span>
                                      )}
                                      {resource.size && (
                                        <span>Size: {resource.size}</span>
                                      )}
                                      <span>Downloads: {resource.downloads}</span>
                                      <span>Updated: {new Date(resource.lastUpdated).toLocaleDateString()}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="h-8 text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                                  >
                                    <PenLine className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Resource Management */}
                  <div className="space-y-6">
                    <Card className="border-slate-200 shadow-md overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-sm">
                            <Plus className="h-4 w-4 text-white" />
                          </div>
                          <CardTitle className="text-lg font-semibold text-slate-800">Quick Actions</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className={quickActionButtonStyles}>
                                <div className="flex items-center gap-3">
                                  <Plus className="h-5 w-5 text-purple-600" />
                                  <div className="text-left">
                                    <div className="font-medium">Upload Dataset</div>
                                    <div className="text-sm text-slate-600">Add a new dataset</div>
                                  </div>
                                </div>
                                <ChevronRight className="h-5 w-5 ml-auto text-slate-400" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px] p-0 gap-0">
                              <DialogHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6 relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
                                <div className="relative">
                                  <DialogTitle className="text-xl font-semibold tracking-tight text-slate-900">Upload Dataset</DialogTitle>
                                  <DialogDescription className="text-base text-slate-500 mt-2">
                                    Upload a new dataset for participants to use in their projects.
                                  </DialogDescription>
                                </div>
                              </DialogHeader>
                              
                              <div className="p-6 space-y-6">
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="dataset-title" className="text-sm font-medium text-slate-900">Title</Label>
                                    <Input 
                                      id="dataset-title" 
                                      placeholder="Enter dataset title"
                                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                                    />
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label htmlFor="dataset-description" className="text-sm font-medium text-slate-900">Description</Label>
                                    <Textarea 
                                      id="dataset-description" 
                                      placeholder="Provide a detailed description of the dataset" 
                                      className="min-h-[100px] w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow resize-y"
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="dataset-file" className="text-sm font-medium text-slate-900">Dataset File</Label>
                                    <div className="flex items-center justify-center w-full">
                                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                          <Upload className="w-8 h-8 mb-4 text-slate-400" />
                                          <p className="mb-2 text-sm text-slate-500">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                          </p>
                                          <p className="text-xs text-slate-500">CSV, JSON, or ZIP (MAX. 100MB)</p>
                                        </div>
                                        <Input 
                                          id="dataset-file" 
                                          type="file" 
                                          className="hidden" 
                                          accept=".csv,.json,.zip"
                                        />
                                      </label>
                                    </div>
                                  </div>

                                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-4">
                                    <div className="flex items-center justify-between">
                                      <Label className="text-sm font-medium text-slate-900">
                                        Dataset Settings
                                      </Label>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="dataset-format" className="text-sm font-medium text-slate-900">Format</Label>
                                        <select 
                                          id="dataset-format" 
                                          className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500/20 transition-shadow bg-white"
                                        >
                                          <option value="csv">CSV</option>
                                          <option value="json">JSON</option>
                                          <option value="zip">ZIP Archive</option>
                                        </select>
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="dataset-access" className="text-sm font-medium text-slate-900">Access Level</Label>
                                        <select 
                                          id="dataset-access" 
                                          className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500/20 transition-shadow bg-white"
                                        >
                                          <option value="public">Public</option>
                                          <option value="private">Private</option>
                                        </select>
                                      </div>
                                    </div>
                                    <div className="space-y-3 mt-4">
                                      <div className="flex items-center gap-2">
                                        <Checkbox 
                                          id="dataset-featured" 
                                          className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                        />
                                        <Label htmlFor="dataset-featured" className="text-sm text-slate-600">
                                          Feature this dataset
                                        </Label>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Checkbox 
                                          id="dataset-notify" 
                                          className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                        />
                                        <Label htmlFor="dataset-notify" className="text-sm text-slate-600">
                                          Notify participants about this dataset
                                        </Label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
                                <Button 
                                  variant="outline"
                                  className="rounded-lg px-4 hover:bg-slate-100 transition-colors"
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  className="rounded-lg px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all hover:shadow-lg"
                                >
                                  Upload Dataset
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className={quickActionButtonStyles}>
                                <div className="flex items-center gap-3">
                                  <Plus className="h-5 w-5 text-blue-600" />
                                  <div className="text-left">
                                    <div className="font-medium">Add API Credentials</div>
                                    <div className="text-sm text-slate-600">Configure API access</div>
                                  </div>
                                </div>
                                <ChevronRight className="h-5 w-5 ml-auto text-slate-400" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px] p-0 gap-0">
                              <DialogHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6 relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
                                <div className="relative">
                                  <DialogTitle className="text-xl font-semibold tracking-tight text-slate-900">Add API Credentials</DialogTitle>
                                  <DialogDescription className="text-base text-slate-500 mt-2">
                                    Configure API access credentials for participants to use in their projects.
                                  </DialogDescription>
                                </div>
                              </DialogHeader>
                              
                              <div className="p-6 space-y-6">
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="api-name" className="text-sm font-medium text-slate-900">API Name</Label>
                                    <Input 
                                      id="api-name" 
                                      placeholder="Enter API name"
                                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                                    />
                                  </div>

                                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-4">
                                    <div className="flex items-center justify-between">
                                      <Label className="text-sm font-medium text-slate-900">
                                        API Configuration
                                      </Label>
                                    </div>
                                    <div className="space-y-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="api-key" className="text-sm font-medium text-slate-900">API Key</Label>
                                        <Input 
                                          id="api-key" 
                                          type="password" 
                                          placeholder="Enter API key"
                                          className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="api-endpoint" className="text-sm font-medium text-slate-900">API Endpoint</Label>
                                        <Input 
                                          id="api-endpoint" 
                                          placeholder="Enter API endpoint URL"
                                          className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="api-docs" className="text-sm font-medium text-slate-900">Documentation URL</Label>
                                        <Input 
                                          id="api-docs" 
                                          placeholder="Enter documentation URL"
                                          className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="api-description" className="text-sm font-medium text-slate-900">Description</Label>
                                    <Textarea 
                                      id="api-description" 
                                      placeholder="Provide details about the API and its usage" 
                                      className="min-h-[100px] w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow resize-y"
                                    />
                                  </div>

                                  <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                      <Checkbox 
                                        id="api-featured" 
                                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                      />
                                      <Label htmlFor="api-featured" className="text-sm text-slate-600">
                                        Feature this API
                                      </Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Checkbox 
                                        id="api-notify" 
                                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                      />
                                      <Label htmlFor="api-notify" className="text-sm text-slate-600">
                                        Notify participants about this API
                                      </Label>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
                                <Button 
                                  variant="outline"
                                  className="rounded-lg px-4 hover:bg-slate-100 transition-colors"
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  className="rounded-lg px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all hover:shadow-lg"
                                >
                                  Add API
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className={quickActionButtonStyles}>
                                <div className="flex items-center gap-3">
                                  <Plus className="h-5 w-5 text-emerald-600" />
                                  <div className="text-left">
                                    <div className="font-medium">Create Documentation</div>
                                    <div className="text-sm text-slate-600">Add new documentation</div>
                                  </div>
                                </div>
                                <ChevronRight className="h-5 w-5 ml-auto text-slate-400" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                              <DialogHeader>
                                <DialogTitle className="text-xl font-semibold tracking-tight">Create Documentation</DialogTitle>
                                <DialogDescription className="text-base text-slate-500">
                                  Create new documentation for participants. You can either write content directly or upload a file.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-6 py-6">
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="doc-title" className="text-sm font-medium">Title</Label>
                                    <Input 
                                      id="doc-title" 
                                      placeholder="Enter documentation title"
                                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium">Documentation Type</Label>
                                    <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
                                      <div className="flex items-center gap-2">
                                        <input 
                                          type="radio" 
                                          id="content-type" 
                                          name="doc-type"
                                          className="text-blue-600 focus:ring-blue-500/20" 
                                          defaultChecked
                                          onChange={() => {
                                            const contentSection = document.getElementById('content-section');
                                            const fileSection = document.getElementById('file-section');
                                            if (contentSection && fileSection) {
                                              contentSection.classList.remove('hidden');
                                              fileSection.classList.add('hidden');
                                            }
                                          }}
                                        />
                                        <Label htmlFor="content-type" className="text-sm cursor-pointer">Write Content</Label>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <input 
                                          type="radio" 
                                          id="file-type" 
                                          name="doc-type"
                                          className="text-blue-600 focus:ring-blue-500/20" 
                                          onChange={() => {
                                            const contentSection = document.getElementById('content-section');
                                            const fileSection = document.getElementById('file-section');
                                            if (contentSection && fileSection) {
                                              contentSection.classList.add('hidden');
                                              fileSection.classList.remove('hidden');
                                            }
                                          }}
                                        />
                                        <Label htmlFor="file-type" className="text-sm cursor-pointer">Upload File</Label>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="space-y-2" id="content-section">
                                    <Label htmlFor="doc-content" className="text-sm font-medium">Content</Label>
                                    <Textarea 
                                      id="doc-content" 
                                      placeholder="Enter documentation content" 
                                      className="min-h-[200px] w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow resize-y"
                                    />
                                  </div>

                                  <div className="space-y-2 hidden" id="file-section">
                                    <Label htmlFor="doc-file" className="text-sm font-medium">File</Label>
                                    <div className="flex items-center justify-center w-full">
                                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                          <Upload className="w-8 h-8 mb-4 text-slate-400" />
                                          <p className="mb-2 text-sm text-slate-500">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                          </p>
                                          <p className="text-xs text-slate-500">PDF, MD, or DOC (MAX. 10MB)</p>
                                        </div>
                                        <input 
                                          id="doc-file" 
                                          type="file" 
                                          className="hidden" 
                                          accept=".pdf,.md,.doc,.docx"
                                        />
                                      </label>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="doc-category" className="text-sm font-medium">Category</Label>
                                      <select 
                                        id="doc-category" 
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                                      >
                                        <option value="getting-started">Getting Started</option>
                                        <option value="api-reference">API Reference</option>
                                        <option value="tutorials">Tutorials</option>
                                        <option value="guidelines">Guidelines</option>
                                      </select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="doc-access" className="text-sm font-medium">Access Level</Label>
                                      <select 
                                        id="doc-access" 
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                                      >
                                        <option value="public">Public</option>
                                        <option value="private">Private</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <DialogFooter className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
                                <Button 
                                  variant="outline"
                                  className="rounded-lg px-4 hover:bg-slate-100 transition-colors"
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  className="rounded-lg px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all hover:shadow-lg"
                                >
                                  Create Documentation
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold">Resource Categories</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Database className="h-4 w-4 text-purple-600" />
                              <span className="font-medium">Datasets</span>
                            </div>
                            <Badge variant="outline" className="bg-purple-50 text-purple-700">
                              {resources.filter(r => r.type === 'dataset').length} items
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-blue-600" />
                              <span className="font-medium">APIs</span>
                            </div>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              {resources.filter(r => r.type === 'api').length} items
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-emerald-600" />
                              <span className="font-medium">Documentation</span>
                            </div>
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700">
                              {resources.filter(r => r.type === 'documentation').length} items
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Settings className="h-4 w-4 text-amber-600" />
                              <span className="font-medium">Tools</span>
                            </div>
                            <Badge variant="outline" className="bg-amber-50 text-amber-700">
                              {resources.filter(r => r.type === 'tool').length} items
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold">Access Statistics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-600">Total Downloads</span>
                              <span className="font-medium">{resources.reduce((acc, r) => acc + (r.downloads || 0), 0)}</span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-100">
                              <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-600">Active API Users</span>
                              <span className="font-medium">42</span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-100">
                              <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-600">Documentation Views</span>
                              <span className="font-medium">1,284</span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-100">
                              <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-emerald-500 to-green-500" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="communications" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* FAQ Management */}
                  <Card className="lg:col-span-2 border-slate-200 shadow-md overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-sm">
                            <FileText className="h-4 w-4 text-white" />
                          </div>
                          <CardTitle className="text-lg font-semibold text-slate-800">FAQ Management</CardTitle>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md">
                              <Plus className="h-4 w-4 mr-2" />
                              Add FAQ
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px] p-0 gap-0">
                            <DialogHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6 relative overflow-hidden">
                              <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
                              <div className="relative">
                                <DialogTitle className="text-xl font-semibold tracking-tight text-slate-900">Add FAQ</DialogTitle>
                                <DialogDescription className="text-base text-slate-500 mt-2">
                                  Add a new frequently asked question to help participants find answers quickly.
                                </DialogDescription>
                              </div>
                            </DialogHeader>
                            
                            <div className="p-6 space-y-6">
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="faq-question" className="text-sm font-medium text-slate-900">Question</Label>
                                  <Input 
                                    id="faq-question" 
                                    placeholder="Enter your question" 
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="faq-answer" className="text-sm font-medium text-slate-900">Answer</Label>
                                  <Textarea 
                                    id="faq-answer" 
                                    placeholder="Provide a clear and concise answer" 
                                    className="min-h-[150px] w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow resize-y"
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="faq-category" className="text-sm font-medium text-slate-900">Category</Label>
                                    <select 
                                      id="faq-category" 
                                      className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500/20 transition-shadow bg-white"
                                    >
                                      <option value="general">General</option>
                                      <option value="technical">Technical</option>
                                      <option value="judging">Judging</option>
                                      <option value="submission">Submission</option>
                                    </select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="faq-order" className="text-sm font-medium text-slate-900">Display Order</Label>
                                    <Input 
                                      id="faq-order" 
                                      type="number" 
                                      min="1"
                                      placeholder="Set display priority"
                                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                                    />
                                  </div>
                                </div>

                                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-4">
                                  <div className="flex items-center justify-between">
                                    <Label htmlFor="faq-published" className="text-sm font-medium text-slate-900">
                                      Visibility Settings
                                    </Label>
                                  </div>
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                      <Checkbox 
                                        id="faq-published" 
                                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                      />
                                      <Label htmlFor="faq-published" className="text-sm text-slate-600">
                                        Publish immediately
                                      </Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Checkbox 
                                        id="faq-featured" 
                                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                      />
                                      <Label htmlFor="faq-featured" className="text-sm text-slate-600">
                                        Feature this FAQ
                                      </Label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
                              <Button 
                                variant="outline"
                                className="rounded-lg px-4 hover:bg-slate-100 transition-colors"
                              >
                                Cancel
                              </Button>
                              <Button 
                                className="rounded-lg px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all hover:shadow-lg"
                              >
                                Add FAQ
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        {/* FAQ Categories */}
                        <div className="flex items-center gap-2 pb-4 border-b border-slate-200">
                          {["all", "general", "technical", "judging", "submission"].map((filter) => (
                              <Button 
                                key={filter}
                                variant="outline" 
                                className={cn(
                                  "rounded-full transition-all duration-200",
                                  activeFaqFilter === filter
                                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:text-white"
                                    : "hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 hover:border-blue-200"
                                )}
                                onClick={() => setActiveFaqFilter(filter)}
                              >
                                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                              </Button>
                            ))}
                        </div>

                        {/* FAQ List */}
                        <div className="space-y-4">
                          {filteredFaqs.map((faq) => (
                            <div 
                              key={faq.id} 
                              className="rounded-lg border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-4 hover:shadow-md transition-all duration-200"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-grow space-y-2">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium text-slate-900">{faq.question}</h4>
                                    <Badge 
                                      variant="outline" 
                                      className="bg-slate-50 text-slate-700 shadow-sm"
                                    >
                                      {faq.category}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-slate-600">{faq.answer}</p>
                                  <div className="flex items-center gap-4 text-xs text-slate-500">
                                    <span>{faq.views} views</span>
                                    <span>{faq.helpful} found helpful</span>
                                    <span>Updated {new Date(faq.lastUpdated).toLocaleDateString()}</span>
                                  </div>
                                </div>
                                <div className="flex items-start gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="h-8 text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                                  >
                                    <PenLine className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <div className="space-y-6">
                    <Card className="border-slate-200 shadow-md overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-sm">
                            <MessageSquare className="h-4 w-4 text-white" />
                          </div>
                          <CardTitle className="text-lg font-semibold text-slate-800">Quick Actions</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <Button 
                            className={quickActionButtonStyles}
                            onClick={() => {
                              router.push('/dashboard/organizer/announcements?action=create&hackathonId=ai-innovation-challenge');
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <Plus className="h-5 w-5 text-blue-600" />
                              <div className="text-left">
                                <div className="font-medium">Create Announcement</div>
                                <div className="text-sm text-slate-600">Post updates for all participants</div>
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 ml-auto text-slate-400" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Communication Stats */}
                    <Card>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold">Communication Stats</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-600">FAQ Resolution Rate</span>
                              <span className="font-medium">85%</span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-100">
                              <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-600">Response Time</span>
                              <span className="font-medium">2.4 hours</span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-100">
                              <div className="h-full w-[70%] rounded-full bg-gradient-to-r from-purple-500 to-violet-500" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-600">Total FAQ Views</span>
                              <span className="font-medium">{faqs.reduce((acc, faq) => acc + faq.views, 0)}</span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-100">
                              <div className="h-full w-[90%] rounded-full bg-gradient-to-r from-emerald-500 to-green-500" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Add Timeline Dialog Components */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full justify-start" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Milestone
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] p-0 gap-0">
          <DialogHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
            <div className="relative">
              <DialogTitle className="text-xl font-semibold tracking-tight text-slate-900">Add New Milestone</DialogTitle>
              <DialogDescription className="text-base text-slate-500 mt-2">
                Create a new milestone to mark important events and progress in your hackathon timeline.
              </DialogDescription>
            </div>
          </DialogHeader>
          
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="milestone-title" className="text-sm font-medium text-slate-900">Title</Label>
                <Input 
                  id="milestone-title" 
                  placeholder="Enter milestone title"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="milestone-description" className="text-sm font-medium text-slate-900">Description</Label>
                <Textarea 
                  id="milestone-description" 
                  placeholder="Provide details about this milestone" 
                  className="min-h-[100px] w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow resize-y"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="milestone-date" className="text-sm font-medium text-slate-900">Date</Label>
                  <Input 
                    id="milestone-date" 
                    type="datetime-local"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="milestone-type" className="text-sm font-medium text-slate-900">Type</Label>
                  <select 
                    id="milestone-type" 
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500/20 transition-shadow bg-white"
                  >
                    <option value="project">Project</option>
                    <option value="submission">Submission</option>
                    <option value="judging">Judging</option>
                    <option value="event">Event</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-slate-900">
                    Milestone Settings
                  </Label>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="milestone-notify" 
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="milestone-notify" className="text-sm text-slate-600">
                      Send notification to participants
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="milestone-featured" 
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="milestone-featured" className="text-sm text-slate-600">
                      Feature this milestone
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="milestone-required" 
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="milestone-required" className="text-sm text-slate-600">
                      Mark as required milestone
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
            <Button 
              variant="outline"
              className="rounded-lg px-4 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </Button>
            <Button 
              className="rounded-lg px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all hover:shadow-lg"
            >
              Create Milestone
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Similar Dialog components for Workshop and Deadline */}
      {/* ... Add Workshop Dialog ... */}
      {/* ... Add Deadline Dialog ... */}

      {/* Resources Dialogs */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full justify-start" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Resource
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] p-0 gap-0">
          <DialogHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
            <div className="relative">
              <DialogTitle className="text-xl font-semibold tracking-tight text-slate-900">Add New Resource</DialogTitle>
              <DialogDescription className="text-base text-slate-500 mt-2">
                Add a new resource to help participants in their projects. Resources can be datasets, APIs, documentation, or tools.
              </DialogDescription>
            </div>
          </DialogHeader>
          
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resource-title" className="text-sm font-medium text-slate-900">Title</Label>
                <Input 
                  id="resource-title" 
                  placeholder="Enter resource title"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="resource-description" className="text-sm font-medium text-slate-900">Description</Label>
                <Textarea 
                  id="resource-description" 
                  placeholder="Provide a detailed description of the resource" 
                  className="min-h-[100px] w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow resize-y"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="resource-type" className="text-sm font-medium text-slate-900">Resource Type</Label>
                  <select 
                    id="resource-type" 
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500/20 transition-shadow bg-white"
                  >
                    <option value="dataset">Dataset</option>
                    <option value="api">API</option>
                    <option value="documentation">Documentation</option>
                    <option value="tool">Tool</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resource-access" className="text-sm font-medium text-slate-900">Access Level</Label>
                  <select 
                    id="resource-access" 
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500/20 transition-shadow bg-white"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-slate-900">
                    Resource Details
                  </Label>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="resource-url" className="text-sm font-medium text-slate-900">Resource URL</Label>
                    <Input 
                      id="resource-url" 
                      placeholder="Enter resource URL or endpoint"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="resource-format" className="text-sm font-medium text-slate-900">Format</Label>
                      <Input 
                        id="resource-format" 
                        placeholder="e.g., CSV, JSON, PDF"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="resource-size" className="text-sm font-medium text-slate-900">Size</Label>
                      <Input 
                        id="resource-size" 
                        placeholder="e.g., 2.5GB"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-3 mt-4">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="resource-featured" 
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="resource-featured" className="text-sm text-slate-600">
                      Feature this resource
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="resource-notify" 
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="resource-notify" className="text-sm text-slate-600">
                      Notify participants about this resource
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
            <Button 
              variant="outline"
              className="rounded-lg px-4 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </Button>
            <Button 
              className="rounded-lg px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all hover:shadow-lg"
            >
              Add Resource
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 