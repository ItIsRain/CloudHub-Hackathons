"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
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
  ArrowUpRight,
  FileCode2,
  LayoutDashboard
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter, useParams } from "next/navigation"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import ReactCrop, { Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

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

// Add interface for API response
interface HackathonResponse {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  participants: number;
  maxParticipants: number;
  submissionCount: number;
  prizePool: string;
  status: string;
  progress: number;
  bannerImage: string;
  categories: string[];
  featured: boolean;
  participants_count: number;
  submission_count: number;
  coverImage: string;
  organizationName: string;
  organizationLogo: string;
  rules: string;
  requirements: string[];
  judging_criteria: {
    name: string;
    description: string;
    weight: number;
  }[];
  challenges: {
    title: string;
    description: string;
  }[];
  prizes: {
    position: number;
    amount: number;
    description: string;
    currency: string;
  }[];
  resources: Resource[];
  submission_template: string;
}

// Dummy data for FAQs
const faqs: FAQ[] = [
  {
    id: "1",
    question: "What technologies are allowed in the hackathon?",
    answer: "Participants can use any programming language or framework. We encourage the use of modern technologies and open-source tools.",
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
    answer: "Projects are evaluated based on innovation (30%), technical implementation (30%), impact (20%), and presentation (20%).",
    category: "Judging",
    views: 312,
    helpful: 290,
    lastUpdated: "2024-03-05T11:30:00",
    order: 2,
    published: true,
    featured: true
  }
];

// Dummy data for email templates
const emailTemplates: EmailTemplate[] = [
  {
    id: "1",
    name: "Welcome Email",
    subject: "Welcome to the Hackathon!",
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

export default function HackathonManagement() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [hackathon, setHackathon] = useState<HackathonResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add state for UI components
  const [activeTab, setActiveTab] = useState("overview");
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [editMemberOpen, setEditMemberOpen] = useState(false);
  const [addSponsorOpen, setAddSponsorOpen] = useState(false);
  const [editSponsorOpen, setEditSponsorOpen] = useState(false);
  const [editTimelineOpen, setEditTimelineOpen] = useState(false);
  const [editResourceOpen, setEditResourceOpen] = useState(false);
  const [editFAQOpen, setEditFAQOpen] = useState(false);
  const [deleteFAQOpen, setDeleteFAQOpen] = useState(false);
  const [activeFaqFilter, setActiveFaqFilter] = useState("all");
  const [addDocumentationOpen, setAddDocumentationOpen] = useState(false);

  // Add state for delete dialogs
  const [deleteMemberOpen, setDeleteMemberOpen] = useState(false);
  const [deleteSponsorOpen, setDeleteSponsorOpen] = useState(false);
  const [deleteTimelineOpen, setDeleteTimelineOpen] = useState(false);
  const [deleteResourceOpen, setDeleteResourceOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);
  const [selectedTimeline, setSelectedTimeline] = useState<TimelineEvent | null>(null);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [configureRoleOpen, setConfigureRoleOpen] = useState(false);

  // Image upload states
  const [bannerImageUrl, setBannerImageUrl] = useState<string>('');
  const [coverImageUrl, setCoverImageUrl] = useState<string>('');
  const [organizationLogoUrl, setOrganizationLogoUrl] = useState<string>('');
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0
  });
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [imageType, setImageType] = useState<'banner' | 'cover' | 'logo'>('banner');
  const [isUploading, setIsUploading] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const fetchHackathonData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem('access_token') || 
                     sessionStorage.getItem('access_token') ||
                     document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1];

        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`http://localhost:8000/api/hackathons/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Hackathon not found');
          }
          throw new Error('Failed to fetch hackathon data');
        }

        const data = await response.json();
        setHackathon(data);
        // Set existing images
        setBannerImageUrl(data.bannerImage || '');
        setCoverImageUrl(data.coverImage || '');
        setOrganizationLogoUrl(data.organizationLogo || '');
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred');
        toast({
          title: "Error",
          description: err.message || "Failed to fetch hackathon data. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchHackathonData();
    }
  }, [params.id, toast]);

  // Filter FAQs based on selected category
  const filteredFaqs = activeFaqFilter === "all" 
    ? faqs 
    : faqs.filter(faq => faq.category.toLowerCase() === activeFaqFilter.toLowerCase());

  // Helper functions
  const getPhaseColor = (phase: string) => {
    switch (phase.toLowerCase()) {
      case 'registration':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'submission':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'judging':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'completed':
        return 'text-slate-600 bg-slate-50 border-slate-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  // Event handlers
  const handleAddMember = () => setAddMemberOpen(true);
  const handleEditMember = (member: TeamMember) => {
    setEditMemberOpen(true);
  };
  const handleDeleteMember = (member: TeamMember) => {
    setSelectedMember(member);
    setDeleteMemberOpen(true);
  };

  const handleAddSponsor = () => setAddSponsorOpen(true);
  const handleEditSponsor = (sponsor: Sponsor) => {
    setEditSponsorOpen(true);
  };
  const handleDeleteSponsor = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor);
    setDeleteSponsorOpen(true);
  };

  const handleEditTimeline = (event: TimelineEvent) => {
    setSelectedTimeline(event);
    setEditTimelineOpen(true);
  };
  const handleDeleteTimeline = (event: TimelineEvent) => {
    setSelectedTimeline(event);
    setDeleteTimelineOpen(true);
  };

  const handleEditResource = (resource: Resource) => {
    setEditResourceOpen(true);
  };
  const handleDeleteResource = (resource: Resource) => {
    setSelectedResource(resource);
    setDeleteResourceOpen(true);
  };

  const handleEditFAQ = (faq: FAQ) => {
    setEditFAQOpen(true);
  };
  const handleDeleteFAQ = (faq: FAQ) => {
    setSelectedFAQ(faq);
    setDeleteFAQOpen(true);
  };

  const handleConfigureRole = (role: Role) => {
    setSelectedRole(role);
    setConfigureRoleOpen(true);
  };

  // Image handling functions
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'banner' | 'cover' | 'logo') => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);
      setImageType(type);
      
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
        // Set appropriate crop dimensions based on image type
        if (type === 'banner') {
          setCrop({
            unit: '%',
            width: 100,
            height: 56.25, // 16:9 aspect ratio
            x: 0,
            y: 0
          });
        } else if (type === 'cover') {
          setCrop({
            unit: '%',
            width: 100,
            height: 56.25, // 16:9 aspect ratio
            x: 0,
            y: 0
          });
        } else if (type === 'logo') {
          setCrop({
            unit: '%',
            width: 50,
            height: 50, // 1:1 aspect ratio
            x: 25,
            y: 25
          });
        }
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCroppedImg = async (image: HTMLImageElement, crop: Crop): Promise<File> => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );
    }

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `${imageType}-image.jpg`, { type: 'image/jpeg' });
          resolve(file);
        }
      }, 'image/jpeg', 0.9);
    });
  };

  const handleCropComplete = async () => {
    if (imageRef.current && completedCrop && completedCrop.width && completedCrop.height) {
      try {
        const croppedImageFile = await getCroppedImg(imageRef.current, completedCrop);
        await handleImageUpload(croppedImageFile);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to crop image. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const token = localStorage.getItem('access_token') || 
                   sessionStorage.getItem('access_token') ||
                   document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1];

      if (!token) {
        throw new Error('No authentication token found');
      }

      // Upload image to BunnyNet
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', `hackathons/${params.id}`);

      const uploadResponse = await fetch('http://localhost:8000/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }

      const uploadResult = await uploadResponse.json();
      const imageUrl = uploadResult.file.url;

      // Update hackathon with new image URL
      const updateData: any = {};
      if (imageType === 'banner') {
        updateData.bannerImage = imageUrl;
        setBannerImageUrl(imageUrl);
      } else if (imageType === 'cover') {
        updateData.coverImage = imageUrl;
        setCoverImageUrl(imageUrl);
      } else if (imageType === 'logo') {
        updateData.organizationLogo = imageUrl;
        setOrganizationLogoUrl(imageUrl);
      }

      const updateResponse = await fetch(`http://localhost:8000/api/hackathons/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update hackathon');
      }

      toast({
        title: "Success",
        description: `${imageType.charAt(0).toUpperCase() + imageType.slice(1)} image updated successfully`,
      });

      setIsCropping(false);
      setSelectedImageFile(null);
      setImagePreview('');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !hackathon) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Error Loading Hackathon</h2>
          <p className="text-slate-600">{error || 'Hackathon not found'}</p>
          <Button 
            className="mt-4"
            onClick={() => router.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

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
                <span className="font-medium tracking-wide">{hackathon.categories[0] || 'Hackathon'}</span>
              </div>
              
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-3 tracking-tight">{hackathon.title}</h1>
              
              <p className="text-white/90 text-lg mb-6 max-w-lg font-light">
                {hackathon.description}
              </p>
            </div>

            <div className="hidden md:grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 text-center shadow-xl">
                <h3 className="text-3xl font-bold text-white">{hackathon.participants_count}</h3>
                <p className="text-xs text-white/80 mt-1">Total Participants</p>
                <div className="text-xs text-emerald-300 mt-2 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-emerald-400/30 flex items-center justify-center mr-1">
                    <span className="text-[8px]">+</span>
                  </div>
                  12 today
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 text-center shadow-xl">
                <h3 className="text-3xl font-bold text-white">{hackathon.submission_count}</h3>
                <p className="text-xs text-white/80 mt-1">Project Submissions</p>
                <div className="text-xs text-purple-300 mt-2 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-purple-400/30 flex items-center justify-center mr-1">
                    <span className="text-[8px]">↑</span>
                  </div>
                  65% complete
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 text-center shadow-xl">
                <h3 className="text-3xl font-bold text-white">12</h3>
                <p className="text-xs text-white/80 mt-1">Active Mentors</p>
                <div className="text-xs text-blue-300 mt-2 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-blue-400/30 flex items-center justify-center mr-1">
                    <span className="text-[8px]">!</span>
                  </div>
                  All available
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 text-center shadow-xl">
                <h3 className="text-3xl font-bold text-white">8</h3>
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
          <Tabs value={activeTab} onValueChange={setActiveTab}>
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
                            <p className="text-sm text-slate-600">{new Date(hackathon.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at 11:59 PM</p>
                          </div>
                          <Badge variant="outline" className="ml-auto">
                            In {Math.ceil((new Date(hackathon.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 border border-slate-100">
                          <div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                            <Users className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-medium">Registration Deadline</h4>
                            <p className="text-sm text-slate-600">{new Date(hackathon.registrationDeadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at 6:00 PM</p>
                          </div>
                          <Badge variant="outline" className="ml-auto">
                            {new Date(hackathon.registrationDeadline) < new Date() ? 'Closed' : `In ${Math.ceil((new Date(hackathon.registrationDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days`}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-200 shadow-md overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-sm">
                          <Upload className="h-4 w-4 text-white" />
                        </div>
                        <CardTitle className="text-lg font-semibold text-slate-800">Image Management</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        {/* Banner Image */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <h4 className="text-sm font-medium text-slate-900">Banner Image</h4>
                              <p className="text-xs text-slate-500">Recommended size: 1920x1080px (16:9)</p>
                            </div>
                            <Label 
                              htmlFor="banner-upload" 
                              className="cursor-pointer"
                            >
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="h-8"
                                onClick={(e) => {
                                  e.preventDefault();
                                  document.getElementById('banner-upload')?.click();
                                }}
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                Upload
                              </Button>
                              <Input
                                id="banner-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleImageSelect(e, 'banner')}
                              />
                            </Label>
                          </div>
                          {bannerImageUrl && (
                            <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-200">
                              <img 
                                src={bannerImageUrl} 
                                alt="Banner" 
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                              <Badge className="absolute bottom-2 right-2 bg-green-600 text-white">
                                Current Banner
                              </Badge>
                            </div>
                          )}
                        </div>

                        {/* Cover Image */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <h4 className="text-sm font-medium text-slate-900">Cover Image</h4>
                              <p className="text-xs text-slate-500">Recommended size: 1200x675px (16:9)</p>
                            </div>
                            <Label 
                              htmlFor="cover-upload" 
                              className="cursor-pointer"
                            >
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="h-8"
                                onClick={(e) => {
                                  e.preventDefault();
                                  document.getElementById('cover-upload')?.click();
                                }}
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                Upload
                              </Button>
                              <Input
                                id="cover-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleImageSelect(e, 'cover')}
                              />
                            </Label>
                          </div>
                          {coverImageUrl && (
                            <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-200">
                              <img 
                                src={coverImageUrl} 
                                alt="Cover" 
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                              <Badge className="absolute bottom-2 right-2 bg-blue-600 text-white">
                                Current Cover
                              </Badge>
                            </div>
                          )}
                        </div>

                        {/* Organization Logo */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <h4 className="text-sm font-medium text-slate-900">Organization Logo</h4>
                              <p className="text-xs text-slate-500">Recommended size: 400x400px (1:1)</p>
                            </div>
                            <Label 
                              htmlFor="logo-upload" 
                              className="cursor-pointer"
                            >
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="h-8"
                                onClick={(e) => {
                                  e.preventDefault();
                                  document.getElementById('logo-upload')?.click();
                                }}
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                Upload
                              </Button>
                              <Input
                                id="logo-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleImageSelect(e, 'logo')}
                              />
                            </Label>
                          </div>
                          {organizationLogoUrl && (
                            <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200 mx-auto">
                              <img 
                                src={organizationLogoUrl} 
                                alt="Organization Logo" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
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
                        {/* Example team members - replace with actual data */}
                        <div className="group rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white overflow-hidden hover:shadow-md transition-all duration-200">
                          <div className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                  <AvatarImage src={`https://avatar.vercel.sh/sarah.chen@example.com`} />
                                  <AvatarFallback className="bg-gradient-to-br from-slate-100 to-slate-200">
                                    SC
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="font-medium text-slate-900">Sarah Chen</h4>
                                  <p className="text-sm text-slate-600">sarah.chen@example.com</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge 
                                  variant="outline" 
                                  className="shadow-sm capitalize bg-emerald-50 text-emerald-700 border-emerald-200"
                                >
                                  active
                                </Badge>
                                <Badge 
                                  variant="outline" 
                                  className="shadow-sm capitalize bg-purple-50 text-purple-700 border-purple-200"
                                >
                                  organizer
                                </Badge>
                              </div>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                              <Badge 
                                variant="outline" 
                                className="bg-slate-50 text-slate-700 border-slate-200 shadow-sm"
                              >
                                admin
                              </Badge>
                              <Badge 
                                variant="outline" 
                                className="bg-slate-50 text-slate-700 border-slate-200 shadow-sm"
                              >
                                manage_teams
                              </Badge>
                              <Badge 
                                variant="outline" 
                                className="bg-slate-50 text-slate-700 border-slate-200 shadow-sm"
                              >
                                manage_submissions
                              </Badge>
                            </div>

                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200">
                              <span className="text-sm text-slate-500">Added 2024-02-15</span>
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-8 text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                                  onClick={() => handleEditMember({
                                    id: '1',
                                    name: 'Sarah Chen',
                                    email: 'sarah.chen@example.com',
                                    role: 'organizer',
                                    permissions: ['admin', 'manage_teams', 'manage_submissions'],
                                    status: 'active',
                                    dateAdded: '2024-02-15'
                                  } as TeamMember)}
                                >
                                  <PenLine className="h-4 w-4 mr-2" />
                                  Edit
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleDeleteMember({
                                    id: '1',
                                    name: 'Sarah Chen',
                                    email: 'sarah.chen@example.com',
                                    role: 'organizer',
                                    permissions: ['admin', 'manage_teams', 'manage_submissions'],
                                    status: 'active',
                                    dateAdded: '2024-02-15'
                                  } as TeamMember)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
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
                        <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Badge 
                                variant="outline" 
                                className="shadow-sm capitalize bg-purple-50 text-purple-700 border-purple-200"
                              >
                                organizer
                              </Badge>
                              <span className="text-sm font-medium text-slate-900">1 member</span>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="h-8 bg-white/50 backdrop-blur-sm border-slate-200 hover:bg-white/75 hover:border-slate-300"
                              onClick={() => handleConfigureRole({
                                name: 'organizer',
                                count: 1,
                                description: 'Full access to manage the hackathon'
                              })}
                            >
                              <Settings2 className="h-4 w-4 mr-2" />
                              Configure
                            </Button>
                          </div>
                          <div className="mt-3 text-sm text-slate-600">Full access to manage the hackathon</div>
                        </div>

                        <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Badge 
                                variant="outline" 
                                className="shadow-sm capitalize bg-blue-50 text-blue-700 border-blue-200"
                              >
                                judge
                              </Badge>
                              <span className="text-sm font-medium text-slate-900">0 members</span>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="h-8 bg-white/50 backdrop-blur-sm border-slate-200 hover:bg-white/75 hover:border-slate-300"
                              onClick={() => handleConfigureRole({
                                name: 'judge',
                                count: 0,
                                description: 'Access to review and score submissions'
                              })}
                            >
                              <Settings2 className="h-4 w-4 mr-2" />
                              Configure
                            </Button>
                          </div>
                          <div className="mt-3 text-sm text-slate-600">Access to review and score submissions</div>
                        </div>

                        <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Badge 
                                variant="outline" 
                                className="shadow-sm capitalize bg-indigo-50 text-indigo-700 border-indigo-200"
                              >
                                mentor
                              </Badge>
                              <span className="text-sm font-medium text-slate-900">0 members</span>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="h-8 bg-white/50 backdrop-blur-sm border-slate-200 hover:bg-white/75 hover:border-slate-300"
                              onClick={() => handleConfigureRole({
                                name: 'mentor',
                                count: 0,
                                description: 'Can provide guidance to participants'
                              })}
                            >
                              <Settings2 className="h-4 w-4 mr-2" />
                              Configure
                            </Button>
                          </div>
                          <div className="mt-3 text-sm text-slate-600">Can provide guidance to participants</div>
                        </div>
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
                        {/* Example sponsor - replace with actual data */}
                        <div className="group rounded-xl border border-violet-200/50 bg-white overflow-hidden hover:shadow-lg transition-all duration-200">
                          <div className="p-6 relative border-b bg-gradient-to-r from-slate-50 via-violet-50 to-slate-50 border-violet-200/50">
                            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
                            <div className="relative flex items-start gap-6">
                              <div className="shrink-0 h-20 w-20 rounded-xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-white flex items-center justify-center shadow-sm overflow-hidden">
                                <Building2 className="h-10 w-10 text-violet-300" />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <h3 className="text-lg font-semibold text-slate-900">TechCorp AI</h3>
                                    <a 
                                      href="https://techcorp.ai" 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="mt-1 text-sm text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1.5"
                                    >
                                      <Globe className="h-3.5 w-3.5" />
                                      techcorp.ai
                                    </a>
                                  </div>
                                  <div className="flex items-start gap-3">
                                    <Badge 
                                      variant="outline" 
                                      className="shadow-sm font-medium px-3 py-1 bg-gradient-to-r from-violet-50 to-slate-50 text-violet-700 border-violet-200"
                                    >
                                      Platinum Tier
                                    </Badge>
                                    <div className="flex items-center gap-1">
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        className="h-8 px-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                                        onClick={() => handleEditSponsor({} as Sponsor)}
                                      >
                                        <PenLine className="h-4 w-4" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        className="h-8 px-2 text-slate-600 hover:text-red-600 hover:bg-red-50"
                                        onClick={() => handleDeleteSponsor({} as Sponsor)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                                <p className="mt-2 text-sm text-slate-600 max-w-3xl">Leading provider of enterprise AI solutions</p>
                              </div>
                            </div>
                          </div>

                          <div className="p-6 space-y-6">
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <User className="h-4 w-4 text-slate-500" />
                                <h4 className="text-sm font-medium text-slate-900">Primary Contact</h4>
                              </div>
                              <div className="p-4 rounded-xl border bg-gradient-to-br from-slate-50 to-white shadow-sm border-violet-200/50">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-sm bg-gradient-to-br from-violet-500 to-violet-600">
                                    MC
                                  </div>
                                  <div>
                                    <div className="font-medium text-slate-900">Michael Chang</div>
                                    <div className="text-sm text-slate-600">Partnership Director</div>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Mail className="h-4 w-4 text-slate-400" />
                                    <span>m.chang@techcorp.ai</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Phone className="h-4 w-4 text-slate-400" />
                                    <span>+1 (555) 123-4567</span>
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
                                <div className="px-3 py-1.5 rounded-lg border shadow-sm text-sm flex items-center gap-2 bg-gradient-to-r from-violet-50 to-slate-50 text-violet-700 border-violet-200">
                                  <Check className="h-3.5 w-3.5" />
                                  Keynote speaking slot
                                </div>
                                <div className="px-3 py-1.5 rounded-lg border shadow-sm text-sm flex items-center gap-2 bg-gradient-to-r from-violet-50 to-slate-50 text-violet-700 border-violet-200">
                                  <Check className="h-3.5 w-3.5" />
                                  Dedicated workshop session
                                </div>
                                <div className="px-3 py-1.5 rounded-lg border shadow-sm text-sm flex items-center gap-2 bg-gradient-to-r from-violet-50 to-slate-50 text-violet-700 border-violet-200">
                                  <Check className="h-3.5 w-3.5" />
                                  Premium booth space
                                </div>
                              </div>
                            </div>

                            <div className="pt-4 border-t border-slate-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-baseline gap-2">
                                  <span className="text-sm font-medium text-slate-600">Contribution</span>
                                  <span className="text-2xl font-semibold text-violet-700">
                                    25,000 AED
                                  </span>
                                </div>
                                <Badge 
                                  variant="outline" 
                                  className="shadow-sm font-medium bg-violet-50 text-violet-700 border-violet-200"
                                >
                                  Platinum
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
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
                        <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-white border-violet-200 border shadow-sm hover:shadow-md transition-all duration-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium capitalize text-violet-900">Platinum</h4>
                              <p className="text-sm text-slate-600 mt-1">Premium partnership with maximum visibility</p>
                            </div>
                            <Badge 
                              variant="outline" 
                              className="shadow-sm font-medium bg-violet-50 text-violet-700 border-violet-200"
                            >
                              25,000+ AED
                            </Badge>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-white border-amber-200 border shadow-sm hover:shadow-md transition-all duration-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium capitalize text-amber-900">Gold</h4>
                              <p className="text-sm text-slate-600 mt-1">Enhanced visibility with premium placement</p>
                            </div>
                            <Badge 
                              variant="outline" 
                              className="shadow-sm font-medium bg-amber-50 text-amber-700 border-amber-200"
                            >
                              15,000+ AED
                            </Badge>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white border-slate-200 border shadow-sm hover:shadow-md transition-all duration-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium capitalize text-slate-900">Silver</h4>
                              <p className="text-sm text-slate-600 mt-1">Standard sponsorship package</p>
                            </div>
                            <Badge 
                              variant="outline" 
                              className="shadow-sm font-medium bg-slate-50 text-slate-700 border-slate-200"
                            >
                              10,000+ AED
                            </Badge>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-white border-orange-200 border shadow-sm hover:shadow-md transition-all duration-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium capitalize text-orange-900">Bronze</h4>
                              <p className="text-sm text-slate-600 mt-1">Basic sponsorship package</p>
                            </div>
                            <Badge 
                              variant="outline" 
                              className="shadow-sm font-medium bg-orange-50 text-orange-700 border-orange-200"
                            >
                              5,000+ AED
                            </Badge>
                          </div>
                        </div>
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
                                  Add a new event to your hackathon timeline.
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
                                    defaultValue={selectedTimeline?.title}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="event-description" className="text-sm font-medium text-slate-900">Description</Label>
                                  <Textarea 
                                    id="event-description" 
                                    placeholder="Describe the event"
                                    defaultValue={selectedTimeline?.description}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow min-h-[100px]"
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="event-date" className="text-sm font-medium text-slate-900">Date</Label>
                                    <Input 
                                      id="event-date" 
                                      type="date"
                                      defaultValue={selectedTimeline?.date}
                                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="event-type" className="text-sm font-medium text-slate-900">Event Type</Label>
                                    <select 
                                      id="event-type" 
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

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="event-duration" className="text-sm font-medium text-slate-900">Duration (minutes)</Label>
                                    <Input 
                                      id="event-duration" 
                                      type="number"
                                      placeholder="Enter duration"
                                      defaultValue={selectedTimeline?.duration}
                                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="event-location" className="text-sm font-medium text-slate-900">Location</Label>
                                    <Input 
                                      id="event-location" 
                                      placeholder="Enter location"
                                      defaultValue={selectedTimeline?.location}
                                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="event-status" className="text-sm font-medium text-slate-900">Status</Label>
                                  <select 
                                    id="event-status" 
                                    defaultValue={selectedTimeline?.status}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500/20 transition-shadow bg-white"
                                  >
                                    <option value="upcoming">Upcoming</option>
                                    <option value="ongoing">Ongoing</option>
                                    <option value="completed">Completed</option>
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

                        {/* Example timeline events - replace with actual data */}
                        <div className="relative pl-10 pr-4 py-4 rounded-lg border bg-white hover:shadow-md transition-all duration-200">
                          <div className="absolute left-0 ml-2 -mt-2">
                            <div className="w-5 h-5 rounded-full border-2 border-white shadow-md bg-emerald-500" />
                          </div>

                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-grow">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-medium text-slate-900">Registration Opens</h4>
                                <Badge 
                                  variant="outline" 
                                  className="capitalize shadow-sm bg-purple-50 text-purple-700 border-purple-200"
                                >
                                  milestone
                                </Badge>
                                <Badge 
                                  variant="outline" 
                                  className="capitalize shadow-sm bg-emerald-50 text-emerald-700 border-emerald-200"
                                >
                                  completed
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-600 mb-3">Team registration and project ideation phase begins</p>
                              <div className="flex items-center gap-4 text-sm text-slate-500">
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(hackathon.startDate).toLocaleDateString()}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-start gap-2">
                              <Button 
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditTimeline({} as TimelineEvent)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteTimeline({} as TimelineEvent)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="relative pl-10 pr-4 py-4 rounded-lg border bg-white hover:shadow-md transition-all duration-200">
                          <div className="absolute left-0 ml-2 -mt-2">
                            <div className="w-5 h-5 rounded-full border-2 border-white shadow-md bg-blue-500" />
                            <div className="absolute top-0 left-0 w-5 h-5">
                              <div className="absolute inline-flex w-full h-full rounded-full opacity-75 bg-blue-500 animate-ping" />
                            </div>
                          </div>

                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-grow">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-medium text-slate-900">Project Submissions Due</h4>
                                <Badge 
                                  variant="outline" 
                                  className="capitalize shadow-sm bg-red-50 text-red-700 border-red-200"
                                >
                                  deadline
                                </Badge>
                                <Badge 
                                  variant="outline" 
                                  className="capitalize shadow-sm bg-blue-50 text-blue-700 border-blue-200"
                                >
                                  ongoing
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-600 mb-3">Final project submissions including code and documentation</p>
                              <div className="flex items-center gap-4 text-sm text-slate-500">
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(hackathon.endDate).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Timer className="h-4 w-4" />
                                  48 hours
                                </div>
                              </div>
                            </div>

                            <div className="flex items-start gap-2">
                              <Button 
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditTimeline({} as TimelineEvent)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteTimeline({} as TimelineEvent)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
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
                          <Button className="w-full justify-start bg-white hover:bg-slate-50 text-slate-900 border-slate-200 hover:border-slate-300 shadow-sm transition-all duration-200 h-auto py-4">
                            <div className="flex items-center gap-3">
                              <Plus className="h-5 w-5 text-purple-600" />
                              <div className="text-left">
                                <div className="font-medium">Add Milestone</div>
                                <div className="text-sm text-slate-600">Create a new milestone</div>
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 ml-auto text-slate-400" />
                          </Button>

                          <Button className="w-full justify-start bg-white hover:bg-slate-50 text-slate-900 border-slate-200 hover:border-slate-300 shadow-sm transition-all duration-200 h-auto py-4">
                            <div className="flex items-center gap-3">
                              <Plus className="h-5 w-5 text-blue-600" />
                              <div className="text-left">
                                <div className="font-medium">Add Workshop</div>
                                <div className="text-sm text-slate-600">Schedule a new workshop</div>
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 ml-auto text-slate-400" />
                          </Button>

                          <Button className="w-full justify-start bg-white hover:bg-slate-50 text-slate-900 border-slate-200 hover:border-slate-300 shadow-sm transition-all duration-200 h-auto py-4">
                            <div className="flex items-center gap-3">
                              <Plus className="h-5 w-5 text-red-600" />
                              <div className="text-left">
                                <div className="font-medium">Add Deadline</div>
                                <div className="text-sm text-slate-600">Set a new deadline</div>
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 ml-auto text-slate-400" />
                          </Button>
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
                                {new Date(hackathon.registrationDeadline) < new Date() ? 'Completed' : 'Active'}
                              </Badge>
                            </div>
                            <div className="text-sm text-slate-600">
                              Until {new Date(hackathon.registrationDeadline).toLocaleDateString()}
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
                              {new Date(hackathon.startDate).toLocaleDateString()} - {new Date(hackathon.endDate).toLocaleDateString()}
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
                              After {new Date(hackathon.endDate).toLocaleDateString()}
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
                                  Add a new resource to help participants in their projects.
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
                        {/* Example resources - replace with actual data */}
                        <div className="rounded-lg border border-slate-200 bg-gradient-to-r from-slate-50 to-white overflow-hidden hover:shadow-md transition-all duration-200">
                          <div className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-lg flex items-center justify-center shadow-sm bg-gradient-to-br from-purple-100 to-purple-50 text-purple-700 border border-purple-200">
                                  <Database className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium text-slate-900">AI Training Dataset</h4>
                                    <Badge 
                                      variant="outline" 
                                      className="capitalize shadow-sm bg-emerald-50 text-emerald-700 border-emerald-200"
                                    >
                                      public
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-slate-600">Curated dataset for machine learning model training</p>
                                  <div className="flex items-center gap-4 text-sm text-slate-500">
                                    <span className="capitalize">Machine Learning</span>
                                    <span>Format: CSV, JSON</span>
                                    <span>Size: 2.5GB</span>
                                    <span>Downloads: 128</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditResource({} as Resource)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteResource({} as Resource)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-gradient-to-r from-slate-50 to-white overflow-hidden hover:shadow-md transition-all duration-200">
                          <div className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-lg flex items-center justify-center shadow-sm bg-gradient-to-br from-blue-100 to-blue-50 text-blue-700 border border-blue-200">
                                  <FileText className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium text-slate-900">Computer Vision API</h4>
                                    <Badge 
                                      variant="outline" 
                                      className="capitalize shadow-sm bg-amber-50 text-amber-700 border-amber-200"
                                    >
                                      private
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-slate-600">API access for image recognition and processing</p>
                                  <div className="flex items-center gap-4 text-sm text-slate-500">
                                    <span className="capitalize">Computer Vision</span>
                                    <span>Downloads: 85</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditResource({} as Resource)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteResource({} as Resource)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
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
                              <Button className="w-full justify-start bg-white hover:bg-slate-50 text-slate-900 border-slate-200 hover:border-slate-300 shadow-sm transition-all duration-200 h-auto py-4">
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
                              <Button className="w-full justify-start bg-white hover:bg-slate-50 text-slate-900 border-slate-200 hover:border-slate-300 shadow-sm transition-all duration-200 h-auto py-4">
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

                          <Button 
                            className="w-full justify-start bg-white hover:bg-slate-50 text-slate-900 border-slate-200 hover:border-slate-300 shadow-sm transition-all duration-200 h-auto py-4"
                            onClick={() => setAddDocumentationOpen(true)}
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-emerald-600" />
                              <div className="text-left">
                                <div className="font-medium">Create Documentation</div>
                                <div className="text-sm text-slate-600">Add new documentation</div>
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 ml-auto text-slate-400" />
                          </Button>

                          <Dialog open={addDocumentationOpen} onOpenChange={setAddDocumentationOpen}>
                            <DialogContent className="sm:max-w-[600px] p-0 gap-0 max-h-[85vh] overflow-hidden flex flex-col">
                              <DialogHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6 relative overflow-hidden flex-shrink-0">
                                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
                                <div className="relative">
                                  <DialogTitle className="text-xl font-semibold tracking-tight text-slate-900">
                                    <div className="flex items-center">
                                      <FileText className="h-5 w-5 mr-2 text-blue-600" />
                                      Create Documentation
                                    </div>
                                  </DialogTitle>
                                  <DialogDescription className="text-base text-slate-500 mt-2">
                                    Add new documentation or resources for participants
                                  </DialogDescription>
                                </div>
                              </DialogHeader>

                              <div className="p-6 space-y-6 overflow-y-auto">
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="doc-title" className="text-sm font-medium text-slate-900">Title</Label>
                                    <Input 
                                      id="doc-title" 
                                      placeholder="Enter documentation title"
                                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="doc-description" className="text-sm font-medium text-slate-900">Description</Label>
                                    <Textarea 
                                      id="doc-description" 
                                      placeholder="Provide a brief description of this documentation" 
                                      className="min-h-[100px] w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow resize-y"
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="doc-type" className="text-sm font-medium text-slate-900">Type</Label>
                                      <select 
                                        id="doc-type" 
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500/20 transition-shadow bg-white"
                                      >
                                        <option value="guide">User Guide</option>
                                        <option value="api">API Documentation</option>
                                        <option value="tutorial">Tutorial</option>
                                        <option value="reference">Reference</option>
                                      </select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="doc-access" className="text-sm font-medium text-slate-900">Access Level</Label>
                                      <select 
                                        id="doc-access" 
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500/20 transition-shadow bg-white"
                                      >
                                        <option value="public">Public</option>
                                        <option value="private">Private</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium text-slate-900">Content Type</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="flex items-center gap-2 p-4 rounded-lg border border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/50 cursor-pointer transition-all">
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
                                        <Label htmlFor="content-type" className="text-sm cursor-pointer flex items-center gap-2">
                                          <FileText className="h-4 w-4 text-slate-500" />
                                          Write Content
                                        </Label>
                                      </div>
                                      <div className="flex items-center gap-2 p-4 rounded-lg border border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/50 cursor-pointer transition-all">
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
                                        <Label htmlFor="file-type" className="text-sm cursor-pointer flex items-center gap-2">
                                          <Upload className="h-4 w-4 text-slate-500" />
                                          Upload File
                                        </Label>
                                      </div>
                                    </div>
                                  </div>

                                  <div id="content-section" className="space-y-2">
                                    <Label htmlFor="doc-content" className="text-sm font-medium text-slate-900">Content</Label>
                                    <Textarea 
                                      id="doc-content" 
                                      placeholder="Write your documentation content here..." 
                                      className="min-h-[200px] w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow resize-y"
                                    />
                                  </div>

                                  <div id="file-section" className="hidden space-y-2">
                                    <Label htmlFor="doc-file" className="text-sm font-medium text-slate-900">File Upload</Label>
                                    <div className="flex items-center justify-center w-full">
                                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                          <Upload className="w-8 h-8 mb-4 text-slate-400" />
                                          <p className="mb-2 text-sm text-slate-500">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                          </p>
                                          <p className="text-xs text-slate-500">PDF, DOC, DOCX up to 10MB</p>
                                        </div>
                                        <Input 
                                          id="doc-file" 
                                          type="file" 
                                          className="hidden" 
                                          accept=".pdf,.doc,.docx"
                                        />
                                      </label>
                                    </div>
                                  </div>

                                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-4">
                                    <div className="flex items-center justify-between">
                                      <Label className="text-sm font-medium text-slate-900">
                                        Additional Settings
                                      </Label>
                                    </div>
                                    <div className="space-y-3">
                                      <div className="flex items-center gap-2">
                                        <Checkbox 
                                          id="doc-featured" 
                                          className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                        />
                                        <Label htmlFor="doc-featured" className="text-sm text-slate-600">
                                          Feature this documentation
                                        </Label>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Checkbox 
                                          id="doc-notify" 
                                          className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                        />
                                        <Label htmlFor="doc-notify" className="text-sm text-slate-600">
                                          Notify participants about this documentation
                                        </Label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50 flex-shrink-0">
                                <Button 
                                  variant="outline"
                                  className="rounded-lg px-4 hover:bg-slate-100 transition-colors"
                                  onClick={() => setAddDocumentationOpen(false)}
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  className="rounded-lg px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all hover:shadow-lg"
                                >
                                  Create Documentation
                                </Button>
                              </div>
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
                              1 item
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-blue-600" />
                              <span className="font-medium">APIs</span>
                            </div>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              1 item
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-emerald-600" />
                              <span className="font-medium">Documentation</span>
                            </div>
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700">
                              0 items
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Settings className="h-4 w-4 text-amber-600" />
                              <span className="font-medium">Tools</span>
                            </div>
                            <Badge variant="outline" className="bg-amber-50 text-amber-700">
                              0 items
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
                              <span className="font-medium">213</span>
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
                            className="w-full justify-start bg-white hover:bg-slate-50 text-slate-900 border-slate-200 hover:border-slate-300 shadow-sm transition-all duration-200 h-auto py-4"
                            onClick={() => {
                              router.push('/dashboard/organizer/announcements?action=create&hackathonId=' + params.id);
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

      {/* Dialogs */}
      <Dialog open={editTimelineOpen} onOpenChange={setEditTimelineOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 gap-0">
          <DialogHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
            <div className="relative">
              <DialogTitle className="text-xl font-semibold tracking-tight text-slate-900">Edit Timeline Event</DialogTitle>
              <DialogDescription className="text-base text-slate-500 mt-2">
                Update the timeline event details.
              </DialogDescription>
            </div>
          </DialogHeader>
          
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="event-title" className="text-sm font-medium text-slate-900">Event Title</Label>
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
                  placeholder="Describe the event"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event-date" className="text-sm font-medium text-slate-900">Date</Label>
                  <Input 
                    id="event-date" 
                    type="date"
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event-duration" className="text-sm font-medium text-slate-900">Duration (minutes)</Label>
                  <Input 
                    id="event-duration" 
                    type="number"
                    placeholder="Enter duration"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-location" className="text-sm font-medium text-slate-900">Location</Label>
                  <Input 
                    id="event-location" 
                    placeholder="Enter location"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-status" className="text-sm font-medium text-slate-900">Status</Label>
                <select 
                  id="event-status" 
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500/20 transition-shadow bg-white"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
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
              onClick={() => {
                setEditTimelineOpen(false);
                toast({
                  title: "Timeline event updated",
                  description: "The timeline event has been successfully updated.",
                });
              }}
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 gap-0">
          <DialogHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
            <div className="relative">
              <DialogTitle className="text-xl font-semibold tracking-tight text-slate-900">Add Team Member</DialogTitle>
              <DialogDescription className="text-base text-slate-500 mt-2">
                Add a new member to your hackathon organizing team.
              </DialogDescription>
            </div>
          </DialogHeader>
          
          <div className="p-6 space-y-6">
            <div className="space-y-4">
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

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-slate-900">
                    Permissions
                  </Label>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="perm-admin" 
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="perm-admin" className="text-sm text-slate-600">
                      Admin access
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="perm-teams" 
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="perm-teams" className="text-sm text-slate-600">
                      Manage teams
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="perm-submissions" 
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="perm-submissions" className="text-sm text-slate-600">
                      Manage submissions
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="perm-communications" 
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="perm-communications" className="text-sm text-slate-600">
                      Send communications
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
              onClick={() => setAddMemberOpen(false)}
            >
              Add Member
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete FAQ Dialog */}
      <Dialog open={deleteFAQOpen} onOpenChange={setDeleteFAQOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-900">Delete FAQ</DialogTitle>
            <DialogDescription className="text-base text-slate-600 mt-2">
              Are you sure you want to delete this FAQ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-4 rounded-lg bg-red-50 border border-red-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-red-900">This will permanently delete:</p>
                <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                  <li>The FAQ question and answer</li>
                  <li>All view and helpful statistics</li>
                  <li>Any references to this FAQ</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button 
              variant="outline"
              className="rounded-lg px-4 hover:bg-slate-100 transition-colors"
              onClick={() => setDeleteFAQOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              className="rounded-lg px-4 bg-red-600 hover:bg-red-700 text-white shadow-md transition-all hover:shadow-lg"
              onClick={() => setDeleteFAQOpen(false)}
            >
              Delete FAQ
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Resource Dialog */}
      <Dialog open={editResourceOpen} onOpenChange={setEditResourceOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 gap-0">
          <DialogHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
            <div className="relative">
              <DialogTitle className="text-xl font-semibold tracking-tight text-slate-900">Edit Resource</DialogTitle>
              <DialogDescription className="text-base text-slate-500 mt-2">
                Update the resource details and settings.
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
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-resource-description" className="text-sm font-medium text-slate-900">Description</Label>
                <Textarea 
                  id="edit-resource-description" 
                  placeholder="Provide a detailed description of the resource" 
                  className="min-h-[100px] w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow resize-y"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-resource-type" className="text-sm font-medium text-slate-900">Resource Type</Label>
                  <select 
                    id="edit-resource-type" 
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
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500/20 transition-shadow bg-white"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-resource-url" className="text-sm font-medium text-slate-900">Resource URL</Label>
                <Input 
                  id="edit-resource-url" 
                  placeholder="Enter resource URL"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                />
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
              onClick={() => setEditResourceOpen(false)}
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Team Member Dialog */}
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
              <div className="space-y-2">
                <Label htmlFor="edit-member-name" className="text-sm font-medium text-slate-900">Name</Label>
                <Input 
                  id="edit-member-name" 
                  placeholder="Enter member name"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-member-email" className="text-sm font-medium text-slate-900">Email</Label>
                <Input 
                  id="edit-member-email" 
                  type="email" 
                  placeholder="Enter email address"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-member-role" className="text-sm font-medium text-slate-900">Role</Label>
                <select 
                  id="edit-member-role" 
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500/20 transition-shadow bg-white"
                >
                  <option value="organizer">Organizer</option>
                  <option value="judge">Judge</option>
                  <option value="mentor">Mentor</option>
                  <option value="media">Media</option>
                </select>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-slate-900">
                    Permissions
                  </Label>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="edit-perm-admin" 
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="edit-perm-admin" className="text-sm text-slate-600">
                      Admin access
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="edit-perm-teams" 
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="edit-perm-teams" className="text-sm text-slate-600">
                      Manage teams
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="edit-perm-submissions" 
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="edit-perm-submissions" className="text-sm text-slate-600">
                      Manage submissions
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="edit-perm-communications" 
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="edit-perm-communications" className="text-sm text-slate-600">
                      Send communications
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
              onClick={() => setEditMemberOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="rounded-lg px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all hover:shadow-lg"
              onClick={() => setEditMemberOpen(false)}
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Sponsor Dialog */}
      <Dialog open={editSponsorOpen} onOpenChange={setEditSponsorOpen}>
        <DialogContent className="sm:max-w-[700px] p-0 gap-0 max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6 relative overflow-hidden flex-shrink-0">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
            <div className="relative">
              <DialogTitle className="text-xl font-semibold tracking-tight text-slate-900">Edit Sponsor</DialogTitle>
              <DialogDescription className="text-base text-slate-500 mt-2">
                Update sponsor information and benefits.
              </DialogDescription>
            </div>
          </DialogHeader>
          
          <div className="p-6 space-y-6 overflow-y-auto">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-sponsor-name" className="text-sm font-medium text-slate-900">Company Name</Label>
                <Input 
                  id="edit-sponsor-name" 
                  placeholder="Enter company name"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-sponsor-tier" className="text-sm font-medium text-slate-900">Sponsorship Tier</Label>
                  <select 
                    id="edit-sponsor-tier" 
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500/20 transition-shadow bg-white"
                  >
                    <option value="platinum">Platinum</option>
                    <option value="gold">Gold</option>
                    <option value="silver">Silver</option>
                    <option value="bronze">Bronze</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-sponsor-amount" className="text-sm font-medium text-slate-900">Contribution Amount</Label>
                  <Input 
                    id="edit-sponsor-amount" 
                    type="number" 
                    placeholder="Enter amount"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-sponsor-website" className="text-sm font-medium text-slate-900">Website</Label>
                <Input 
                  id="edit-sponsor-website" 
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-sponsor-description" className="text-sm font-medium text-slate-900">Description</Label>
                <Textarea 
                  id="edit-sponsor-description" 
                  placeholder="Brief description of the sponsor" 
                  className="min-h-[100px] w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow resize-y"
                />
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-slate-900">
                    Primary Contact
                  </Label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-contact-name" className="text-sm font-medium text-slate-900">Contact Name</Label>
                    <Input 
                      id="edit-contact-name" 
                      placeholder="Enter contact name"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-contact-role" className="text-sm font-medium text-slate-900">Role</Label>
                    <Input 
                      id="edit-contact-role" 
                      placeholder="Enter role"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-contact-email" className="text-sm font-medium text-slate-900">Email</Label>
                    <Input 
                      id="edit-contact-email" 
                      type="email" 
                      placeholder="Enter email"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-contact-phone" className="text-sm font-medium text-slate-900">Phone</Label>
                    <Input 
                      id="edit-contact-phone" 
                      placeholder="Enter phone number"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-slate-900">
                    Sponsorship Benefits
                  </Label>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="edit-benefit-keynote" 
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="edit-benefit-keynote" className="text-sm text-slate-600">
                      Keynote speaking slot
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="edit-benefit-workshop" 
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="edit-benefit-workshop" className="text-sm text-slate-600">
                      Dedicated workshop session
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="edit-benefit-booth" 
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="edit-benefit-booth" className="text-sm text-slate-600">
                      Premium booth space
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="edit-benefit-branding" 
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="edit-benefit-branding" className="text-sm text-slate-600">
                      Logo on all materials
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="edit-benefit-recruitment" 
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="edit-benefit-recruitment" className="text-sm text-slate-600">
                      Recruitment opportunities
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50 flex-shrink-0">
            <Button 
              variant="outline"
              className="rounded-lg px-4 hover:bg-slate-100 transition-colors"
              onClick={() => setEditSponsorOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="rounded-lg px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all hover:shadow-lg"
              onClick={() => setEditSponsorOpen(false)}
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Sponsor Dialog */}
      <Dialog open={addSponsorOpen} onOpenChange={setAddSponsorOpen}>
        <DialogContent className="sm:max-w-[700px] p-0 gap-0 max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6 relative overflow-hidden flex-shrink-0">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
            <div className="relative">
              <DialogTitle className="text-xl font-semibold tracking-tight text-slate-900">Add Sponsor</DialogTitle>
              <DialogDescription className="text-base text-slate-500 mt-2">
                Add a new sponsor to your hackathon.
              </DialogDescription>
            </div>
          </DialogHeader>
          
          <div className="p-6 space-y-6 overflow-y-auto">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sponsor-name" className="text-sm font-medium text-slate-900">Company Name</Label>
                <Input 
                  id="sponsor-name" 
                  placeholder="Enter company name"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                <div className="space-y-2">
                  <Label htmlFor="sponsor-amount" className="text-sm font-medium text-slate-900">Contribution Amount</Label>
                  <Input 
                    id="sponsor-amount" 
                    type="number" 
                    placeholder="Enter amount"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sponsor-website" className="text-sm font-medium text-slate-900">Website</Label>
                <Input 
                  id="sponsor-website" 
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sponsor-description" className="text-sm font-medium text-slate-900">Description</Label>
                <Textarea 
                  id="sponsor-description" 
                  placeholder="Brief description of the sponsor" 
                  className="min-h-[100px] w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow resize-y"
                />
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-slate-900">
                    Primary Contact
                  </Label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name" className="text-sm font-medium text-slate-900">Contact Name</Label>
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
                      placeholder="Enter role"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email" className="text-sm font-medium text-slate-900">Email</Label>
                    <Input 
                      id="contact-email" 
                      type="email" 
                      placeholder="Enter email"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-phone" className="text-sm font-medium text-slate-900">Phone</Label>
                    <Input 
                      id="contact-phone" 
                      placeholder="Enter phone number"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-slate-900">
                    Sponsorship Benefits
                  </Label>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="benefit-keynote" 
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="benefit-keynote" className="text-sm text-slate-600">
                      Keynote speaking slot
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="benefit-workshop" 
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="benefit-workshop" className="text-sm text-slate-600">
                      Dedicated workshop session
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="benefit-booth" 
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="benefit-booth" className="text-sm text-slate-600">
                      Premium booth space
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="benefit-branding" 
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="benefit-branding" className="text-sm text-slate-600">
                      Logo on all materials
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="benefit-recruitment" 
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="benefit-recruitment" className="text-sm text-slate-600">
                      Recruitment opportunities
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50 flex-shrink-0">
            <Button 
              variant="outline"
              className="rounded-lg px-4 hover:bg-slate-100 transition-colors"
              onClick={() => setAddSponsorOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="rounded-lg px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all hover:shadow-lg"
              onClick={() => setAddSponsorOpen(false)}
            >
              Add Sponsor
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit FAQ Dialog */}
      <Dialog open={editFAQOpen} onOpenChange={setEditFAQOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 gap-0">
          <DialogHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
            <div className="relative">
              <DialogTitle className="text-xl font-semibold tracking-tight text-slate-900">Edit FAQ</DialogTitle>
              <DialogDescription className="text-base text-slate-500 mt-2">
                Update the frequently asked question details.
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
                      Published
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="edit-faq-featured" 
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="edit-faq-featured" className="text-sm text-slate-600">
                      Featured
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
              onClick={() => setEditFAQOpen(false)}
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Member Dialog */}
      <Dialog open={deleteMemberOpen} onOpenChange={setDeleteMemberOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-900">Remove Team Member</DialogTitle>
            <DialogDescription className="text-base text-slate-600 mt-2">
              Are you sure you want to remove this team member? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedMember && (
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`https://avatar.vercel.sh/${selectedMember.email}`} />
                  <AvatarFallback>{selectedMember.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-slate-900">{selectedMember.name}</p>
                  <p className="text-sm text-slate-600">{selectedMember.email}</p>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 rounded-lg bg-red-50 border border-red-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-red-900">This will permanently remove:</p>
                <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                  <li>All access and permissions for this member</li>
                  <li>Their ability to manage the hackathon</li>
                  <li>Any pending invitations or tasks assigned to them</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button 
              variant="outline"
              className="rounded-lg px-4 hover:bg-slate-100 transition-colors"
              onClick={() => setDeleteMemberOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              className="rounded-lg px-4 bg-red-600 hover:bg-red-700 text-white shadow-md transition-all hover:shadow-lg"
              onClick={() => {
                // Handle delete
                setDeleteMemberOpen(false);
                toast({
                  title: "Team member removed",
                  description: "The team member has been successfully removed.",
                });
              }}
            >
              Remove Member
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Sponsor Dialog */}
      <Dialog open={deleteSponsorOpen} onOpenChange={setDeleteSponsorOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-900">Remove Sponsor</DialogTitle>
            <DialogDescription className="text-base text-slate-600 mt-2">
              Are you sure you want to remove this sponsor? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedSponsor && (
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-violet-100 to-violet-50 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-violet-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">{selectedSponsor.name}</p>
                  <p className="text-sm text-slate-600 capitalize">{selectedSponsor.tier} Sponsor</p>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 rounded-lg bg-red-50 border border-red-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-red-900">This will permanently remove:</p>
                <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                  <li>All sponsor information and benefits</li>
                  <li>Contact details and communication history</li>
                  <li>Sponsorship tier and contribution records</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button 
              variant="outline"
              className="rounded-lg px-4 hover:bg-slate-100 transition-colors"
              onClick={() => setDeleteSponsorOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              className="rounded-lg px-4 bg-red-600 hover:bg-red-700 text-white shadow-md transition-all hover:shadow-lg"
              onClick={() => {
                // Handle delete
                setDeleteSponsorOpen(false);
                toast({
                  title: "Sponsor removed",
                  description: "The sponsor has been successfully removed.",
                });
              }}
            >
              Remove Sponsor
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Timeline Dialog */}
      <Dialog open={deleteTimelineOpen} onOpenChange={setDeleteTimelineOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-900">Delete Timeline Event</DialogTitle>
            <DialogDescription className="text-base text-slate-600 mt-2">
              Are you sure you want to delete this timeline event? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedTimeline && (
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">{selectedTimeline.title}</p>
                  <p className="text-sm text-slate-600">{new Date(selectedTimeline.date).toLocaleDateString()}</p>
                  <Badge variant="outline" className="mt-1 capitalize">
                    {selectedTimeline.type}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 rounded-lg bg-red-50 border border-red-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-red-900">This will permanently delete:</p>
                <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                  <li>The timeline event and all its details</li>
                  <li>Any notifications scheduled for this event</li>
                  <li>Associated reminders and updates</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button 
              variant="outline"
              className="rounded-lg px-4 hover:bg-slate-100 transition-colors"
              onClick={() => setDeleteTimelineOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              className="rounded-lg px-4 bg-red-600 hover:bg-red-700 text-white shadow-md transition-all hover:shadow-lg"
              onClick={() => {
                // Handle delete
                setDeleteTimelineOpen(false);
                toast({
                  title: "Timeline event deleted",
                  description: "The timeline event has been successfully deleted.",
                });
              }}
            >
              Delete Event
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Resource Dialog */}
      <Dialog open={deleteResourceOpen} onOpenChange={setDeleteResourceOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-900">Delete Resource</DialogTitle>
            <DialogDescription className="text-base text-slate-600 mt-2">
              Are you sure you want to delete this resource? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedResource && (
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                  <Database className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">{selectedResource.title}</p>
                  <p className="text-sm text-slate-600">{selectedResource.type} • {selectedResource.category}</p>
                  {selectedResource.downloads && (
                    <p className="text-xs text-slate-500 mt-1">{selectedResource.downloads} downloads</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="p-4 rounded-lg bg-red-50 border border-red-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-red-900">This will permanently delete:</p>
                <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                  <li>The resource file or link</li>
                  <li>All download history and statistics</li>
                  <li>Access permissions and settings</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button 
              variant="outline"
              className="rounded-lg px-4 hover:bg-slate-100 transition-colors"
              onClick={() => setDeleteResourceOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              className="rounded-lg px-4 bg-red-600 hover:bg-red-700 text-white shadow-md transition-all hover:shadow-lg"
              onClick={() => {
                // Handle delete
                setDeleteResourceOpen(false);
                toast({
                  title: "Resource deleted",
                  description: "The resource has been successfully deleted.",
                });
              }}
            >
              Delete Resource
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Configure Role Dialog */}
      <Dialog open={configureRoleOpen} onOpenChange={setConfigureRoleOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 gap-0">
          <DialogHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
            <div className="relative">
              <DialogTitle className="text-xl font-semibold tracking-tight text-slate-900">Configure {selectedRole?.name.charAt(0).toUpperCase()}{selectedRole?.name.slice(1)} Role</DialogTitle>
              <DialogDescription className="text-base text-slate-500 mt-2">
                Manage permissions and settings for this role.
              </DialogDescription>
            </div>
          </DialogHeader>
          
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role-description" className="text-sm font-medium text-slate-900">Role Description</Label>
                <Textarea 
                  id="role-description" 
                  placeholder="Describe the role's responsibilities"
                  defaultValue={selectedRole?.description}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                />
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-slate-900">
                    Role Permissions
                  </Label>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="role-perm-admin" 
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      defaultChecked={selectedRole?.name === 'organizer'}
                    />
                    <Label htmlFor="role-perm-admin" className="text-sm text-slate-600">
                      Admin access
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="role-perm-teams" 
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      defaultChecked={selectedRole?.name === 'organizer' || selectedRole?.name === 'mentor'}
                    />
                    <Label htmlFor="role-perm-teams" className="text-sm text-slate-600">
                      Manage teams
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="role-perm-submissions" 
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      defaultChecked={selectedRole?.name === 'organizer' || selectedRole?.name === 'judge'}
                    />
                    <Label htmlFor="role-perm-submissions" className="text-sm text-slate-600">
                      Manage submissions
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="role-perm-communications" 
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      defaultChecked={selectedRole?.name === 'organizer'}
                    />
                    <Label htmlFor="role-perm-communications" className="text-sm text-slate-600">
                      Send communications
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="role-perm-resources" 
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      defaultChecked={selectedRole?.name === 'organizer' || selectedRole?.name === 'mentor'}
                    />
                    <Label htmlFor="role-perm-resources" className="text-sm text-slate-600">
                      Manage resources
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="role-perm-scoring" 
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      defaultChecked={selectedRole?.name === 'judge'}
                    />
                    <Label htmlFor="role-perm-scoring" className="text-sm text-slate-600">
                      Score submissions
                    </Label>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-slate-900">
                    Additional Settings
                  </Label>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="role-auto-approve" className="text-sm text-slate-600">
                        Auto-approve members
                      </Label>
                      <div className="text-xs text-slate-500">
                        Automatically approve new members with this role
                      </div>
                    </div>
                    <Switch 
                      id="role-auto-approve"
                      defaultChecked={selectedRole?.name === 'mentor'}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="role-notifications" className="text-sm text-slate-600">
                        Role notifications
                      </Label>
                      <div className="text-xs text-slate-500">
                        Send notifications about role changes
                      </div>
                    </div>
                    <Switch 
                      id="role-notifications"
                      defaultChecked={true}
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
              onClick={() => setConfigureRoleOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="rounded-lg px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all hover:shadow-lg"
              onClick={() => {
                setConfigureRoleOpen(false);
                toast({
                  title: "Role updated",
                  description: "The role settings have been successfully updated.",
                });
              }}
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Cropping Dialog */}
      <Dialog open={isCropping} onOpenChange={setIsCropping}>
        <DialogContent className="sm:max-w-[800px] p-0 gap-0">
          <DialogHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
            <div className="relative">
              <DialogTitle className="text-xl font-semibold tracking-tight text-slate-900">
                Crop {imageType.charAt(0).toUpperCase() + imageType.slice(1)} Image
              </DialogTitle>
              <DialogDescription className="text-base text-slate-500 mt-2">
                Adjust the crop area to get the perfect {imageType} image
              </DialogDescription>
            </div>
          </DialogHeader>
          
          <div className="p-6">
            {imagePreview && (
              <div className="relative max-h-[500px] overflow-auto rounded-lg border border-slate-200">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={imageType === 'logo' ? 1 : 16 / 9}
                  minWidth={imageType === 'logo' ? 100 : 200}
                  minHeight={imageType === 'logo' ? 100 : 112}
                >
                  <img
                    ref={imageRef}
                    src={imagePreview}
                    alt="Crop preview"
                    style={{ maxWidth: '100%' }}
                    onLoad={(e) => {
                      imageRef.current = e.currentTarget;
                    }}
                  />
                </ReactCrop>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
            <Button 
              variant="outline"
              className="rounded-lg px-4 hover:bg-slate-100 transition-colors"
              onClick={() => {
                setIsCropping(false);
                setImagePreview('');
                setSelectedImageFile(null);
              }}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button 
              className="rounded-lg px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all hover:shadow-lg"
              onClick={handleCropComplete}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                'Apply Crop & Upload'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 