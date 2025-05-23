"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  User,
  Building2,
  Trophy,
  CalendarClock,
  Calendar,
  Clock,
  Activity,
  BarChart3,
  Plus,
  PenLine,
  Trash2,
  Check,
  AlertCircle,
  Download,
  ShieldCheck,
  Settings2,
  Globe,
  Mail,
  Phone,
  Eye,
  Gift,
  MessageSquare,
  FileText,
  Brain,
  Timer,
  Database,
  ChevronRight,
  Upload,
  Edit,
  Settings,
  ArrowUpRight
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

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
  order: number;
  published: boolean;
  featured: boolean;
}

interface Role {
  name: 'organizer' | 'judge' | 'mentor' | 'media';
  count: number;
  description: string;
}

interface SponsorshipTier {
  name: 'platinum' | 'gold' | 'silver' | 'bronze';
  description: string;
  minContribution: number;
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
    lastUpdated: "2024-03-01T09:00:00",
    order: 1,
    published: true,
    featured: true
  },
  {
    id: "2",
    question: "How are projects evaluated?",
    answer: "Projects are evaluated based on innovation (30%), technical implementation (30%), impact (20%), and presentation (20%). Each criteria is scored by a panel of expert judges.",
    category: "Judging",
    views: 312,
    helpful: 290,
    lastUpdated: "2024-03-05T11:30:00",
    order: 2,
    published: true,
    featured: true
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

const roles: Role[] = [
  {
    name: 'organizer',
    count: teamMembers.filter(m => m.role === 'organizer').length,
    description: 'Full access to manage the hackathon, including teams, submissions, and settings.'
  },
  {
    name: 'judge',
    count: teamMembers.filter(m => m.role === 'judge').length,
    description: 'Access to review and score submissions during the judging phase.'
  },
  {
    name: 'mentor',
    count: teamMembers.filter(m => m.role === 'mentor').length,
    description: 'Can provide guidance to participants and access mentorship resources.'
  },
  {
    name: 'media',
    count: teamMembers.filter(m => m.role === 'media').length,
    description: 'Access to media resources and ability to publish content.'
  }
];

const sponsorshipTiers: SponsorshipTier[] = [
  {
    name: 'platinum',
    description: 'Premium partnership with maximum visibility and benefits',
    minContribution: 25000
  },
  {
    name: 'gold',
    description: 'Enhanced visibility with premium placement',
    minContribution: 15000
  },
  {
    name: 'silver',
    description: 'Standard sponsorship package with good visibility',
    minContribution: 10000
  },
  {
    name: 'bronze',
    description: 'Basic sponsorship package with essential benefits',
    minContribution: 5000
  }
];

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

  // Dialog states
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [editMemberOpen, setEditMemberOpen] = useState(false);
  const [deleteMemberOpen, setDeleteMemberOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const [addSponsorOpen, setAddSponsorOpen] = useState(false);
  const [editSponsorOpen, setEditSponsorOpen] = useState(false);
  const [deleteSponsorOpen, setDeleteSponsorOpen] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);

  const [editTimelineOpen, setEditTimelineOpen] = useState(false);
  const [deleteTimelineOpen, setDeleteTimelineOpen] = useState(false);
  const [selectedTimeline, setSelectedTimeline] = useState<TimelineEvent | null>(null);

  const [editResourceOpen, setEditResourceOpen] = useState(false);
  const [deleteResourceOpen, setDeleteResourceOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  const [editFAQOpen, setEditFAQOpen] = useState(false);
  const [deleteFAQOpen, setDeleteFAQOpen] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);

  // Member handlers
  const handleAddMember = () => setAddMemberOpen(true);
  const handleEditMember = (member: TeamMember) => {
    setSelectedMember(member);
    setEditMemberOpen(true);
  };
  const handleDeleteMember = (member: TeamMember) => {
    setSelectedMember(member);
    setDeleteMemberOpen(true);
  };

  // Sponsor handlers
  const handleAddSponsor = () => setAddSponsorOpen(true);
  const handleEditSponsor = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor);
    setEditSponsorOpen(true);
  };
  const handleDeleteSponsor = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor);
    setDeleteSponsorOpen(true);
  };

  // Timeline handlers
  const handleEditTimeline = (event: TimelineEvent) => {
    setSelectedTimeline(event);
    setEditTimelineOpen(true);
  };
  const handleDeleteTimeline = (event: TimelineEvent) => {
    setSelectedTimeline(event);
    setDeleteTimelineOpen(true);
  };

  // Resource handlers
  const handleEditResource = (resource: Resource) => {
    setSelectedResource(resource);
    setEditResourceOpen(true);
  };
  const handleDeleteResource = (resource: Resource) => {
    setSelectedResource(resource);
    setDeleteResourceOpen(true);
  };

  // FAQ handlers
  const handleEditFAQ = (faq: FAQ) => {
    setSelectedFAQ(faq);
    setEditFAQOpen(true);
  };
  const handleDeleteFAQ = (faq: FAQ) => {
    setSelectedFAQ(faq);
    setDeleteFAQOpen(true);
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
                  <Card className="lg:col-span-2 border-slate-200 shadow-md bg-white overflow-hidden hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6 relative">
                      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
                      <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-sm">
                            <Users className="h-4 w-4 text-white" />
                          </div>
                          <CardTitle className="text-lg font-semibold text-slate-800">Team Members</CardTitle>
                        </div>
                        <Button 
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md"
                          onClick={handleAddMember}
                        >
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
                            className="group rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white overflow-hidden hover:shadow-md transition-all duration-200"
                          >
                            <div className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                  <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                    <AvatarImage src={`https://avatar.vercel.sh/${member.email}`} />
                                    <AvatarFallback className="bg-gradient-to-br from-slate-100 to-slate-200">
                                      {member.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h4 className="font-medium text-slate-900">{member.name}</h4>
                                    <p className="text-sm text-slate-600">{member.email}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Badge 
                                    variant="outline" 
                                    className={cn(
                                      "shadow-sm capitalize",
                                      member.status === 'active' && "bg-emerald-50 text-emerald-700 border-emerald-200",
                                      member.status === 'pending' && "bg-amber-50 text-amber-700 border-amber-200",
                                      member.status === 'inactive' && "bg-slate-50 text-slate-700 border-slate-200"
                                    )}
                                  >
                                    {member.status}
                                  </Badge>
                                  <Badge 
                                    variant="outline" 
                                    className={cn(
                                      "shadow-sm capitalize",
                                      member.role === 'organizer' && "bg-purple-50 text-purple-700 border-purple-200",
                                      member.role === 'judge' && "bg-blue-50 text-blue-700 border-blue-200",
                                      member.role === 'mentor' && "bg-indigo-50 text-indigo-700 border-indigo-200",
                                      member.role === 'media' && "bg-pink-50 text-pink-700 border-pink-200"
                                    )}
                                  >
                                    {member.role}
                                  </Badge>
                                </div>
                              </div>

                              <div className="mt-4 flex flex-wrap gap-2">
                                {member.permissions.map((permission, index) => (
                                  <Badge 
                                    key={index}
                                    variant="outline" 
                                    className="bg-slate-50 text-slate-700 border-slate-200 shadow-sm"
                                  >
                                    {permission}
                                  </Badge>
                                ))}
                              </div>

                              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200">
                                <span className="text-sm text-slate-500">Added {member.dateAdded}</span>
                                <div className="flex items-center gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="h-8 text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                                    onClick={() => handleEditMember(member)}
                                  >
                                    <PenLine className="h-4 w-4 mr-2" />
                                    Edit
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleDeleteMember(member)}
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

                  {/* Role Management */}
                  <Card className="border-slate-200 shadow-md bg-white overflow-hidden hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6 relative">
                      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
                      <div className="relative flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-sm">
                          <ShieldCheck className="h-4 w-4 text-white" />
                        </div>
                        <CardTitle className="text-lg font-semibold text-slate-800">Role Management</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {roles.map((role) => (
                          <div 
                            key={role.name}
                            className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Badge 
                                  variant="outline" 
                                  className={cn(
                                    "shadow-sm capitalize",
                                    role.name === 'organizer' && "bg-purple-50 text-purple-700 border-purple-200",
                                    role.name === 'judge' && "bg-blue-50 text-blue-700 border-blue-200",
                                    role.name === 'mentor' && "bg-indigo-50 text-indigo-700 border-indigo-200",
                                    role.name === 'media' && "bg-pink-50 text-pink-700 border-pink-200"
                                  )}
                                >
                                  {role.name}
                                </Badge>
                                <span className="text-sm font-medium text-slate-900">{role.count} members</span>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="h-8 bg-white/50 backdrop-blur-sm border-slate-200 hover:bg-white/75 hover:border-slate-300"
                              >
                                <Settings2 className="h-4 w-4 mr-2" />
                                Configure
                              </Button>
                            </div>
                            <div className="mt-3 text-sm text-slate-600">{role.description}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="sponsors" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Sponsors List */}
                  <Card className="lg:col-span-2 border-slate-200 shadow-md bg-white overflow-hidden hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6 relative">
                      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
                      <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-sm">
                            <Building2 className="h-4 w-4 text-white" />
                          </div>
                          <CardTitle className="text-lg font-semibold text-slate-800">Sponsors</CardTitle>
                        </div>
                        <Button 
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all hover:shadow-lg"
                          onClick={handleAddSponsor}
                        >
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
                            className={cn(
                              "group rounded-xl border bg-white overflow-hidden hover:shadow-lg transition-all duration-200",
                              sponsor.tier === 'platinum' && "border-violet-200/50",
                              sponsor.tier === 'gold' && "border-amber-200/50",
                              sponsor.tier === 'silver' && "border-slate-200/50",
                              sponsor.tier === 'bronze' && "border-orange-200/50"
                            )}
                          >
                            <div className={cn(
                              "p-6 relative border-b",
                              sponsor.tier === 'platinum' && "bg-gradient-to-r from-slate-50 via-violet-50 to-slate-50 border-violet-200/50",
                              sponsor.tier === 'gold' && "bg-gradient-to-r from-slate-50 via-amber-50 to-slate-50 border-amber-200/50",
                              sponsor.tier === 'silver' && "bg-gradient-to-r from-slate-50 via-slate-100 to-slate-50 border-slate-200/50",
                              sponsor.tier === 'bronze' && "bg-gradient-to-r from-slate-50 via-orange-50 to-slate-50 border-orange-200/50"
                            )}>
                              <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
                              <div className="relative flex items-start gap-6">
                                <div className={cn(
                                  "shrink-0 h-20 w-20 rounded-xl border-2 flex items-center justify-center shadow-sm bg-white overflow-hidden",
                                  sponsor.tier === 'platinum' && "border-violet-200 bg-gradient-to-br from-violet-50 to-white",
                                  sponsor.tier === 'gold' && "border-amber-200 bg-gradient-to-br from-amber-50 to-white",
                                  sponsor.tier === 'silver' && "border-slate-200 bg-gradient-to-br from-slate-50 to-white",
                                  sponsor.tier === 'bronze' && "border-orange-200 bg-gradient-to-br from-orange-50 to-white"
                                )}>
                                  {sponsor.logo ? (
                                    <img 
                                      src={sponsor.logo} 
                                      alt={sponsor.name} 
                                      className="h-14 w-14 object-contain"
                                    />
                                  ) : (
                                    <Building2 className={cn(
                                      "h-10 w-10",
                                      sponsor.tier === 'platinum' && "text-violet-300",
                                      sponsor.tier === 'gold' && "text-amber-300",
                                      sponsor.tier === 'silver' && "text-slate-300",
                                      sponsor.tier === 'bronze' && "text-orange-300"
                                    )} />
                                  )}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-4">
                                    <div>
                                      <h3 className="text-lg font-semibold text-slate-900">{sponsor.name}</h3>
                                      <a 
                                        href={sponsor.website} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="mt-1 text-sm text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1.5"
                                      >
                                        <Globe className="h-3.5 w-3.5" />
                                        {sponsor.website.replace(/^https?:\/\//, '')}
                                      </a>
                                    </div>
                                    <div className="flex items-start gap-3">
                                      <Badge 
                                        variant="outline" 
                                        className={cn(
                                          "shadow-sm font-medium px-3 py-1",
                                          sponsor.tier === 'platinum' && "bg-gradient-to-r from-violet-50 to-slate-50 text-violet-700 border-violet-200",
                                          sponsor.tier === 'gold' && "bg-gradient-to-r from-amber-50 to-slate-50 text-amber-700 border-amber-200",
                                          sponsor.tier === 'silver' && "bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 border-slate-200",
                                          sponsor.tier === 'bronze' && "bg-gradient-to-r from-orange-50 to-slate-50 text-orange-700 border-orange-200"
                                        )}
                                      >
                                        {sponsor.tier.charAt(0).toUpperCase() + sponsor.tier.slice(1)} Tier
                                      </Badge>
                                      <div className="flex items-center gap-1">
                                        <Button 
                                          variant="ghost" 
                                          size="sm"
                                          className="h-8 px-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                                          onClick={() => handleEditSponsor(sponsor)}
                                        >
                                          <PenLine className="h-4 w-4" />
                                        </Button>
                                        <Button 
                                          variant="ghost" 
                                          size="sm"
                                          className="h-8 px-2 text-slate-600 hover:text-red-600 hover:bg-red-50"
                                          onClick={() => handleDeleteSponsor(sponsor)}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                  <p className="mt-2 text-sm text-slate-600 max-w-3xl">{sponsor.description}</p>
                                </div>
                              </div>
                            </div>

                            <div className="p-6 space-y-6">
                              <div>
                                <div className="flex items-center gap-2 mb-3">
                                  <User className="h-4 w-4 text-slate-500" />
                                  <h4 className="text-sm font-medium text-slate-900">Primary Contact</h4>
                                </div>
                                <div className={cn(
                                  "p-4 rounded-xl border bg-gradient-to-br from-slate-50 to-white shadow-sm",
                                  sponsor.tier === 'platinum' && "border-violet-200/50",
                                  sponsor.tier === 'gold' && "border-amber-200/50",
                                  sponsor.tier === 'silver' && "border-slate-200/50",
                                  sponsor.tier === 'bronze' && "border-orange-200/50"
                                )}>
                                  <div className="flex items-center gap-3 mb-3">
                                    <div className={cn(
                                      "h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-sm",
                                      sponsor.tier === 'platinum' && "bg-gradient-to-br from-violet-500 to-violet-600",
                                      sponsor.tier === 'gold' && "bg-gradient-to-br from-amber-500 to-amber-600",
                                      sponsor.tier === 'silver' && "bg-gradient-to-br from-slate-500 to-slate-600",
                                      sponsor.tier === 'bronze' && "bg-gradient-to-br from-orange-500 to-orange-600"
                                    )}>
                                      {sponsor.contacts[0].name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                      <div className="font-medium text-slate-900">{sponsor.contacts[0].name}</div>
                                      <div className="text-sm text-slate-600">{sponsor.contacts[0].role}</div>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                      <Mail className="h-4 w-4 text-slate-400" />
                                      <span>{sponsor.contacts[0].email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                      <Phone className="h-4 w-4 text-slate-400" />
                                      <span>{sponsor.contacts[0].phone}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <Gift className="h-4 w-4 text-slate-500" />
                                  <h4 className="text-sm font-medium text-slate-900">Sponsorship Benefits</h4>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {sponsor.benefits.map((benefit, index) => (
                                    <div 
                                      key={index}
                                      className={cn(
                                        "px-3 py-1.5 rounded-lg border shadow-sm text-sm flex items-center gap-2",
                                        sponsor.tier === 'platinum' && "bg-gradient-to-r from-violet-50 to-slate-50 text-violet-700 border-violet-200",
                                        sponsor.tier === 'gold' && "bg-gradient-to-r from-amber-50 to-slate-50 text-amber-700 border-amber-200",
                                        sponsor.tier === 'silver' && "bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 border-slate-200",
                                        sponsor.tier === 'bronze' && "bg-gradient-to-r from-orange-50 to-slate-50 text-orange-700 border-orange-200"
                                      )}
                                    >
                                      <Check className="h-3.5 w-3.5" />
                                      {benefit}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="pt-4 border-t border-slate-200">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-baseline gap-2">
                                    <span className="text-sm font-medium text-slate-600">Contribution</span>
                                    <span className={cn(
                                      "text-2xl font-semibold",
                                      sponsor.tier === 'platinum' && "text-violet-700",
                                      sponsor.tier === 'gold' && "text-amber-700",
                                      sponsor.tier === 'silver' && "text-slate-700",
                                      sponsor.tier === 'bronze' && "text-orange-700"
                                    )}>
                                      ${sponsor.contribution.toLocaleString()}
                                    </span>
                                  </div>
                                  <Badge 
                                    variant="outline" 
                                    className={cn(
                                      "shadow-sm font-medium",
                                      sponsor.tier === 'platinum' && "bg-violet-50 text-violet-700 border-violet-200",
                                      sponsor.tier === 'gold' && "bg-amber-50 text-amber-700 border-amber-200",
                                      sponsor.tier === 'silver' && "bg-slate-50 text-slate-700 border-slate-200",
                                      sponsor.tier === 'bronze' && "bg-orange-50 text-orange-700 border-orange-200"
                                    )}
                                  >
                                    {sponsor.tier.charAt(0).toUpperCase() + sponsor.tier.slice(1)}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Sponsorship Tiers */}
                  <Card className="border-slate-200 shadow-md bg-white overflow-hidden hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6 relative">
                      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
                      <div className="relative flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-sm">
                          <Trophy className="h-4 w-4 text-white" />
                        </div>
                        <CardTitle className="text-lg font-semibold text-slate-800">Sponsorship Tiers</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {sponsorshipTiers.map((tier) => (
                          <div 
                            key={tier.name}
                            className={cn(
                              "p-4 rounded-xl border shadow-sm hover:shadow-md transition-all duration-200",
                              tier.name === 'platinum' && "bg-gradient-to-br from-violet-50 to-white border-violet-200",
                              tier.name === 'gold' && "bg-gradient-to-br from-amber-50 to-white border-amber-200",
                              tier.name === 'silver' && "bg-gradient-to-br from-slate-50 to-white border-slate-200",
                              tier.name === 'bronze' && "bg-gradient-to-br from-orange-50 to-white border-orange-200"
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className={cn(
                                  "font-medium capitalize",
                                  tier.name === 'platinum' && "text-violet-900",
                                  tier.name === 'gold' && "text-amber-900",
                                  tier.name === 'silver' && "text-slate-900",
                                  tier.name === 'bronze' && "text-orange-900"
                                )}>
                                  {tier.name}
                                </h4>
                                <p className="text-sm text-slate-600 mt-1">{tier.description}</p>
                              </div>
                              <Badge 
                                variant="outline" 
                                className={cn(
                                  "shadow-sm font-medium",
                                  tier.name === 'platinum' && "bg-violet-50 text-violet-700 border-violet-200",
                                  tier.name === 'gold' && "bg-amber-50 text-amber-700 border-amber-200",
                                  tier.name === 'silver' && "bg-slate-50 text-slate-700 border-slate-200",
                                  tier.name === 'bronze' && "bg-orange-50 text-orange-700 border-orange-200"
                                )}
                              >
                                ${tier.minContribution.toLocaleString()}+
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
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
                                  size="icon"
                                  onClick={() => handleEditTimeline(event)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteTimeline(event)}
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
                                    size="icon"
                                    onClick={() => handleEditResource(resource)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteResource(resource)}
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
                                    size="icon"
                                    onClick={() => handleEditFAQ(faq)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteFAQ(faq)}
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

      {/* Member Management Dialogs */}
      <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 gap-0">
          <DialogHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
            <div className="relative">
              <DialogTitle className="text-xl font-semibold tracking-tight text-slate-900">Add Team Member</DialogTitle>
              <DialogDescription className="text-base text-slate-500 mt-2">
                Add a new member to your hackathon team. Members can be organizers, judges, mentors, or media personnel.
              </DialogDescription>
            </div>
          </DialogHeader>
          
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="member-name" className="text-sm font-medium text-slate-900">Name</Label>
                  <Input 
                    id="member-name" 
                    placeholder="Enter member name"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="member-email" className="text-sm font-medium text-slate-900">Email</Label>
                  <Input 
                    id="member-email" 
                    type="email"
                    placeholder="Enter email address"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="member-role" className="text-sm font-medium text-slate-900">Role</Label>
                  <select 
                    id="member-role" 
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500/20 transition-shadow bg-white"
                  >
                    <option value="organizer">Organizer</option>
                    <option value="judge">Judge</option>
                    <option value="mentor">Mentor</option>
                    <option value="media">Media</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="member-status" className="text-sm font-medium text-slate-900">Status</Label>
                  <select 
                    id="member-status" 
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500/20 transition-shadow bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-slate-900">
                    Permissions
                  </Label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="perm-manage-members"
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="perm-manage-members" className="text-sm text-slate-600">
                      Manage Members
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="perm-manage-submissions"
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="perm-manage-submissions" className="text-sm text-slate-600">
                      Manage Submissions
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="perm-manage-resources"
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="perm-manage-resources" className="text-sm text-slate-600">
                      Manage Resources
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="perm-send-announcements"
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="perm-send-announcements" className="text-sm text-slate-600">
                      Send Announcements
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="perm-view-analytics"
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="perm-view-analytics" className="text-sm text-slate-600">
                      View Analytics
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="perm-manage-settings"
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="perm-manage-settings" className="text-sm text-slate-600">
                      Manage Settings
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
              onClick={() => setAddMemberOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="rounded-lg px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all hover:shadow-lg"
            >
              Add Member
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog open={editMemberOpen} onOpenChange={setEditMemberOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 gap-0">
          <DialogHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
            <div className="relative">
              <DialogTitle className="text-xl font-semibold tracking-tight text-slate-900">Edit Team Member</DialogTitle>
              <DialogDescription className="text-base text-slate-500 mt-2">
                Update team member details and permissions.
              </DialogDescription>
            </div>
          </DialogHeader>
          
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="member-name" className="text-sm font-medium text-slate-900">Name</Label>
                  <Input 
                    id="member-name" 
                    placeholder="Enter member name"
                    defaultValue={selectedMember?.name}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="member-email" className="text-sm font-medium text-slate-900">Email</Label>
                  <Input 
                    id="member-email" 
                    type="email"
                    placeholder="Enter email address"
                    defaultValue={selectedMember?.email}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="member-role" className="text-sm font-medium text-slate-900">Role</Label>
                  <select 
                    id="member-role" 
                    defaultValue={selectedMember?.role}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500/20 transition-shadow bg-white"
                  >
                    <option value="organizer">Organizer</option>
                    <option value="judge">Judge</option>
                    <option value="mentor">Mentor</option>
                    <option value="media">Media</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="member-status" className="text-sm font-medium text-slate-900">Status</Label>
                  <select 
                    id="member-status" 
                    defaultValue={selectedMember?.status}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500/20 transition-shadow bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-slate-900">
                    Permissions
                  </Label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {['manage_members', 'manage_submissions', 'manage_resources', 'send_announcements', 'view_analytics', 'manage_settings'].map((permission) => (
                    <div key={permission} className="flex items-center gap-2">
                      <Checkbox 
                        id={`perm-${permission}`}
                        defaultChecked={selectedMember?.permissions.includes(permission)}
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <Label htmlFor={`perm-${permission}`} className="text-sm text-slate-600">
                        {permission.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
            <Button 
              variant="outline"
              className="rounded-lg px-4 hover:bg-slate-100 transition-colors"
              onClick={() => setEditMemberOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="rounded-lg px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all hover:shadow-lg"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Member Dialog */}
      <Dialog open={deleteMemberOpen} onOpenChange={setDeleteMemberOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 gap-0">
          <DialogHeader className="bg-gradient-to-r from-slate-50 via-red-50 to-slate-50 border-b border-slate-200 p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
            <div className="relative">
              <DialogTitle className="text-xl font-semibold tracking-tight text-slate-900">Remove Team Member</DialogTitle>
              <DialogDescription className="text-base text-slate-500 mt-2">
                Are you sure you want to remove this team member? This action cannot be undone.
              </DialogDescription>
            </div>
          </DialogHeader>
          
          <div className="p-6">
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 mb-4">
              <div className="flex items-center gap-3 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <p className="text-sm font-medium">This will permanently remove the member and revoke all their permissions.</p>
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-medium">
                  JD
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">John Doe</h4>
                  <p className="text-sm text-slate-600">john.doe@example.com</p>
                </div>
                <Badge variant="outline" className="ml-auto bg-blue-50 text-blue-700 border-blue-200">
                  Organizer
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
            <Button 
              variant="outline"
              className="rounded-lg px-4 hover:bg-slate-100 transition-colors"
              onClick={() => setDeleteMemberOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              className="rounded-lg px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
            >
              Remove Member
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sponsor Management Dialogs */}
      <Dialog open={addSponsorOpen} onOpenChange={setAddSponsorOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 gap-0 max-h-[85vh] flex flex-col">
          <DialogHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6 relative overflow-hidden shrink-0">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
            <div className="relative">
              <DialogTitle className="text-xl font-semibold tracking-tight text-slate-900">Add New Sponsor</DialogTitle>
              <DialogDescription className="text-base text-slate-500 mt-2">
                Add a new sponsor to your hackathon. Configure their details, visibility, and benefits.
              </DialogDescription>
            </div>
          </DialogHeader>
          
          <div className="overflow-y-auto flex-1">
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sponsor-name" className="text-sm font-medium text-slate-900">Company Name</Label>
                    <Input 
                      id="sponsor-name" 
                      placeholder="Enter company name"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sponsor-tier" className="text-sm font-medium text-slate-900">Sponsorship Tier</Label>
                    <select 
                      id="sponsor-tier" 
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500/20 transition-shadow bg-white"
                    >
                      <option value="platinum">Platinum</option>
                      <option value="gold">Gold</option>
                      <option value="silver">Silver</option>
                      <option value="bronze">Bronze</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sponsor-description" className="text-sm font-medium text-slate-900">Description</Label>
                  <Textarea 
                    id="sponsor-description" 
                    placeholder="Enter company description"
                    className="min-h-[100px] w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow resize-y"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sponsor-website" className="text-sm font-medium text-slate-900">Website</Label>
                    <Input 
                      id="sponsor-website" 
                      placeholder="Enter website URL"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sponsor-contribution" className="text-sm font-medium text-slate-900">Contribution Amount</Label>
                    <Input 
                      id="sponsor-contribution" 
                      type="number"
                      placeholder="Enter amount"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-slate-900">
                      Primary Contact
                    </Label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact-name" className="text-sm font-medium text-slate-900">Name</Label>
                      <Input 
                        id="contact-name" 
                        placeholder="Enter contact name"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-role" className="text-sm font-medium text-slate-900">Role</Label>
                      <Input 
                        id="contact-role" 
                        placeholder="Enter contact role"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-email" className="text-sm font-medium text-slate-900">Email</Label>
                      <Input 
                        id="contact-email" 
                        type="email"
                        placeholder="Enter contact email"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-phone" className="text-sm font-medium text-slate-900">Phone</Label>
                      <Input 
                        id="contact-phone" 
                        placeholder="Enter contact phone"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50 shrink-0">
            <Button 
              variant="outline"
              className="rounded-lg px-4 hover:bg-slate-100 transition-colors"
              onClick={() => setAddSponsorOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="rounded-lg px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all hover:shadow-lg"
            >
              Add Sponsor
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={editSponsorOpen} onOpenChange={setEditSponsorOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 gap-0 max-h-[85vh] flex flex-col">
          <DialogHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6 relative overflow-hidden shrink-0">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
            <div className="relative">
              <DialogTitle className="text-xl font-semibold tracking-tight text-slate-900">Edit Sponsor</DialogTitle>
              <DialogDescription className="text-base text-slate-500 mt-2">
                Update sponsor details, visibility settings, and benefits.
              </DialogDescription>
            </div>
          </DialogHeader>
          
          <div className="overflow-y-auto flex-1">
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sponsor-name" className="text-sm font-medium text-slate-900">Company Name</Label>
                    <Input 
                      id="sponsor-name" 
                      placeholder="Enter company name"
                      defaultValue={selectedSponsor?.name}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sponsor-tier" className="text-sm font-medium text-slate-900">Sponsorship Tier</Label>
                    <select 
                      id="sponsor-tier" 
                      defaultValue={selectedSponsor?.tier}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500/20 transition-shadow bg-white"
                    >
                      <option value="platinum">Platinum</option>
                      <option value="gold">Gold</option>
                      <option value="silver">Silver</option>
                      <option value="bronze">Bronze</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sponsor-description" className="text-sm font-medium text-slate-900">Description</Label>
                  <Textarea 
                    id="sponsor-description" 
                    placeholder="Enter company description"
                    defaultValue={selectedSponsor?.description}
                    className="min-h-[100px] w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow resize-y"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sponsor-website" className="text-sm font-medium text-slate-900">Website</Label>
                    <Input 
                      id="sponsor-website" 
                      placeholder="Enter website URL"
                      defaultValue={selectedSponsor?.website}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sponsor-contribution" className="text-sm font-medium text-slate-900">Contribution Amount</Label>
                    <Input 
                      id="sponsor-contribution" 
                      type="number"
                      placeholder="Enter amount"
                      defaultValue={selectedSponsor?.contribution}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-slate-900">
                      Primary Contact
                    </Label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact-name" className="text-sm font-medium text-slate-900">Name</Label>
                      <Input 
                        id="contact-name" 
                        placeholder="Enter contact name"
                        defaultValue={selectedSponsor?.contacts[0]?.name}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-role" className="text-sm font-medium text-slate-900">Role</Label>
                      <Input 
                        id="contact-role" 
                        placeholder="Enter contact role"
                        defaultValue={selectedSponsor?.contacts[0]?.role}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-email" className="text-sm font-medium text-slate-900">Email</Label>
                      <Input 
                        id="contact-email" 
                        type="email"
                        placeholder="Enter contact email"
                        defaultValue={selectedSponsor?.contacts[0]?.email}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-phone" className="text-sm font-medium text-slate-900">Phone</Label>
                      <Input 
                        id="contact-phone" 
                        placeholder="Enter contact phone"
                        defaultValue={selectedSponsor?.contacts[0]?.phone}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50 shrink-0">
            <Button 
              variant="outline"
              className="rounded-lg px-4 hover:bg-slate-100 transition-colors"
              onClick={() => setEditSponsorOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="rounded-lg px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all hover:shadow-lg"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteSponsorOpen} onOpenChange={setDeleteSponsorOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 gap-0">
          <DialogHeader className="bg-gradient-to-r from-slate-50 via-red-50 to-slate-50 border-b border-slate-200 p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
            <div className="relative">
              <DialogTitle className="text-xl font-semibold tracking-tight text-slate-900">Remove Sponsor</DialogTitle>
              <DialogDescription className="text-base text-slate-500 mt-2">
                Are you sure you want to remove this sponsor? This action cannot be undone.
              </DialogDescription>
            </div>
          </DialogHeader>
          
          <div className="p-6">
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 mb-4">
              <div className="flex items-center gap-3 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <p className="text-sm font-medium">This will permanently remove the sponsor and all associated data.</p>
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-slate-100 to-white border border-slate-200 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-slate-400" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">TechCorp AI</h4>
                  <p className="text-sm text-slate-600">Platinum Sponsor</p>
                </div>
                <Badge variant="outline" className="ml-auto bg-violet-50 text-violet-700 border-violet-200">
                  25,000 AED
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
            <Button 
              variant="outline"
              className="rounded-lg px-4 hover:bg-slate-100 transition-colors"
              onClick={() => setDeleteSponsorOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              className="rounded-lg px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
            >
              Remove Sponsor
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Timeline Management Dialogs */}
      <Dialog open={editTimelineOpen} onOpenChange={setEditTimelineOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 gap-0">
          <DialogHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
            <div className="relative">
              <DialogTitle className="text-xl font-semibold tracking-tight text-slate-900">Edit Timeline Event</DialogTitle>
              <DialogDescription className="text-base text-slate-500 mt-2">
                Update the details of this timeline event.
              </DialogDescription>
            </div>
          </DialogHeader>
          
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-event-title" className="text-sm font-medium text-slate-900">Title</Label>
                <Input 
                  id="edit-event-title" 
                  placeholder="Enter event title"
                  defaultValue={selectedTimeline?.title}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-event-description" className="text-sm font-medium text-slate-900">Description</Label>
                <Textarea 
                  id="edit-event-description" 
                  placeholder="Provide event details and any important information" 
                  defaultValue={selectedTimeline?.description}
                  className="min-h-[100px] w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow resize-y"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-event-date" className="text-sm font-medium text-slate-900">Date & Time</Label>
                  <Input 
                    id="edit-event-date" 
                    type="datetime-local"
                    defaultValue={selectedTimeline?.date}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-event-type" className="text-sm font-medium text-slate-900">Event Type</Label>
                  <select 
                    id="edit-event-type" 
                    defaultValue={selectedTimeline?.type}
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
                    <Label htmlFor="edit-event-duration" className="text-sm font-medium text-slate-900">Duration (minutes)</Label>
                    <Input 
                      id="edit-event-duration" 
                      type="number" 
                      min="0"
                      placeholder="Enter duration"
                      defaultValue={selectedTimeline?.duration}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-event-location" className="text-sm font-medium text-slate-900">Location</Label>
                    <Input 
                      id="edit-event-location" 
                      placeholder="Enter location or URL"
                      defaultValue={selectedTimeline?.location}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
            <Button 
              variant="outline"
              className="rounded-lg px-4 hover:bg-slate-100 transition-colors"
              onClick={() => setEditTimelineOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="rounded-lg px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all hover:shadow-lg"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteTimelineOpen} onOpenChange={setDeleteTimelineOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 gap-0">
          <DialogHeader className="bg-gradient-to-r from-slate-50 via-red-50 to-slate-50 border-b border-slate-200 p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
            <div className="relative">
              <DialogTitle className="text-xl font-semibold tracking-tight text-slate-900">Delete Timeline Event</DialogTitle>
              <DialogDescription className="text-base text-slate-500 mt-2">
                Are you sure you want to delete this event? This action cannot be undone.
              </DialogDescription>
            </div>
          </DialogHeader>
          
          <div className="p-6">
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 mb-4">
              <div className="flex items-center gap-3 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <p className="text-sm font-medium">This will permanently delete the event and all associated data.</p>
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-medium">
                  JD
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">Event Title</h4>
                  <p className="text-sm text-slate-600">Event Description</p>
                </div>
                <Badge variant="outline" className="ml-auto bg-blue-50 text-blue-700 border-blue-200">
                  Event Type
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
            <Button 
              variant="outline"
              className="rounded-lg px-4 hover:bg-slate-100 transition-colors"
              onClick={() => setDeleteTimelineOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              className="rounded-lg px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
            >
              Delete Event
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Resource Management Dialogs */}
      <Dialog open={editResourceOpen} onOpenChange={setEditResourceOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 gap-0">
          <DialogHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
            <div className="relative">
              <DialogTitle className="text-xl font-semibold tracking-tight text-slate-900">Edit Resource</DialogTitle>
              <DialogDescription className="text-base text-slate-500 mt-2">
                Update resource details and settings.
              </DialogDescription>
            </div>
          </DialogHeader>
          
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-resource-title" className="text-sm font-medium text-slate-900">Title</Label>
                <Input 
                  id="edit-resource-title" 
                  placeholder="Enter resource title"
                  defaultValue={selectedResource?.title}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-resource-description" className="text-sm font-medium text-slate-900">Description</Label>
                <Textarea 
                  id="edit-resource-description" 
                  placeholder="Provide a detailed description of the resource" 
                  defaultValue={selectedResource?.description}
                  className="min-h-[100px] w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow resize-y"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-resource-type" className="text-sm font-medium text-slate-900">Resource Type</Label>
                  <select 
                    id="edit-resource-type" 
                    defaultValue={selectedResource?.type}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500/20 transition-shadow bg-white"
                  >
                    <option value="dataset">Dataset</option>
                    <option value="api">API</option>
                    <option value="documentation">Documentation</option>
                    <option value="tool">Tool</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-resource-access" className="text-sm font-medium text-slate-900">Access Level</Label>
                  <select 
                    id="edit-resource-access" 
                    defaultValue={selectedResource?.accessLevel}
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
                    <Label htmlFor="edit-resource-url" className="text-sm font-medium text-slate-900">Resource URL</Label>
                    <Input 
                      id="edit-resource-url" 
                      placeholder="Enter resource URL or endpoint"
                      defaultValue={selectedResource?.url}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-resource-format" className="text-sm font-medium text-slate-900">Format</Label>
                      <Input 
                        id="edit-resource-format" 
                        placeholder="e.g., CSV, JSON, PDF"
                        defaultValue={selectedResource?.format}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-resource-size" className="text-sm font-medium text-slate-900">Size</Label>
                      <Input 
                        id="edit-resource-size" 
                        placeholder="e.g., 2.5GB"
                        defaultValue={selectedResource?.size}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
            <Button 
              variant="outline"
              className="rounded-lg px-4 hover:bg-slate-100 transition-colors"
              onClick={() => setEditResourceOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="rounded-lg px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all hover:shadow-lg"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteResourceOpen} onOpenChange={setDeleteResourceOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 gap-0">
          <DialogHeader className="bg-gradient-to-r from-slate-50 via-red-50 to-slate-50 border-b border-slate-200 p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
            <div className="relative">
              <DialogTitle className="text-xl font-semibold tracking-tight text-slate-900">Delete Resource</DialogTitle>
              <DialogDescription className="text-base text-slate-500 mt-2">
                Are you sure you want to delete this resource? This action cannot be undone.
              </DialogDescription>
            </div>
          </DialogHeader>
          
          <div className="p-6">
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 mb-4">
              <div className="flex items-center gap-3 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <p className="text-sm font-medium">This will permanently delete the resource and all associated data.</p>
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-medium">
                  RD
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">Resource Title</h4>
                  <p className="text-sm text-slate-600">Resource Description</p>
                </div>
                <Badge variant="outline" className="ml-auto bg-blue-50 text-blue-700 border-blue-200">
                  Resource Type
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
            <Button 
              variant="outline"
              className="rounded-lg px-4 hover:bg-slate-100 transition-colors"
              onClick={() => setDeleteResourceOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              className="rounded-lg px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
            >
              Delete Resource
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* FAQ Management Dialogs */}
      <Dialog open={editFAQOpen} onOpenChange={setEditFAQOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 gap-0">
          <DialogHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
            <div className="relative">
              <DialogTitle className="text-xl font-semibold tracking-tight text-slate-900">Edit FAQ</DialogTitle>
              <DialogDescription className="text-base text-slate-500 mt-2">
                Update FAQ question and answer.
              </DialogDescription>
            </div>
          </DialogHeader>
          
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-faq-question" className="text-sm font-medium text-slate-900">Question</Label>
                <Input 
                  id="edit-faq-question" 
                  placeholder="Enter your question" 
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-faq-answer" className="text-sm font-medium text-slate-900">Answer</Label>
                <Textarea 
                  id="edit-faq-answer" 
                  placeholder="Provide a clear and concise answer" 
                  className="min-h-[150px] w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow resize-y"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-faq-category" className="text-sm font-medium text-slate-900">Category</Label>
                  <select 
                    id="edit-faq-category" 
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500/20 transition-shadow bg-white"
                  >
                    <option value="general">General</option>
                    <option value="technical">Technical</option>
                    <option value="judging">Judging</option>
                    <option value="submission">Submission</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-faq-order" className="text-sm font-medium text-slate-900">Display Order</Label>
                  <Input 
                    id="edit-faq-order" 
                    type="number" 
                    min="1"
                    placeholder="Set display priority"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                  />
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="edit-faq-published" className="text-sm font-medium text-slate-900">
                    Visibility Settings
                  </Label>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="edit-faq-published" 
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="edit-faq-published" className="text-sm text-slate-600">
                      Publish immediately
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="edit-faq-featured" 
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="edit-faq-featured" className="text-sm text-slate-600">
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
              onClick={() => setEditFAQOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="rounded-lg px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all hover:shadow-lg"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteFAQOpen} onOpenChange={setDeleteFAQOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 gap-0">
          <DialogHeader className="bg-gradient-to-r from-slate-50 via-red-50 to-slate-50 border-b border-slate-200 p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
            <div className="relative">
              <DialogTitle className="text-xl font-semibold tracking-tight text-slate-900">Delete FAQ</DialogTitle>
              <DialogDescription className="text-base text-slate-500 mt-2">
                Are you sure you want to delete this FAQ? This action cannot be undone.
              </DialogDescription>
            </div>
          </DialogHeader>
          
          <div className="p-6">
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 mb-4">
              <div className="flex items-center gap-3 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <p className="text-sm font-medium">This will permanently delete the FAQ and all associated data.</p>
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-medium">
                  FQ
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">FAQ Question</h4>
                  <p className="text-sm text-slate-600">FAQ Answer</p>
                </div>
                <Badge variant="outline" className="ml-auto bg-blue-50 text-blue-700 border-blue-200">
                  Category
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
            <Button 
              variant="outline"
              className="rounded-lg px-4 hover:bg-slate-100 transition-colors"
              onClick={() => setDeleteFAQOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              className="rounded-lg px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
            >
              Delete FAQ
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 