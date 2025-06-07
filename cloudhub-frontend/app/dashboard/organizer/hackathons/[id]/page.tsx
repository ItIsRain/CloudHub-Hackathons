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
  LayoutDashboard,
  MapPin
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
import { useAuth } from "@/contexts/auth-context"

// Types for API integration
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
  resources: any[];
  submission_template: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'organizer' | 'judge' | 'mentor' | 'media';
  permissions: string[];
  status: 'active' | 'pending' | 'inactive';
  date_added: string;
  user_id: string;
  hackathon_id: string;
  added_by: string;
  auto_approve: boolean;
  notifications_enabled: boolean;
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
  currency: string;
  contract_signed: boolean;
  featured: boolean;
  display_order: number;
  hackathon_id: string;
  added_by: string;
  created_at: string;
  updated_at: string;
}

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  event_type: 'milestone' | 'deadline' | 'workshop' | 'announcement';
  status: 'upcoming' | 'ongoing' | 'completed';
  duration?: number;
  location?: string;
  meeting_url?: string;
  notify_participants: boolean;
  reminder_hours: number;
  is_public: boolean;
  display_order: number;
  hackathon_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'dataset' | 'api' | 'documentation' | 'tool';
  format?: string;
  size?: string;
  url: string;
  access_level: 'public' | 'private';
  category: string;
  downloads: number;
  last_downloaded?: string;
  tags: string[];
  featured: boolean;
  display_order: number;
  api_key?: string;
  api_endpoint?: string;
  documentation_url?: string;
  hackathon_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  last_updated: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  views: number;
  helpful: number;
  not_helpful: number;
  order: number;
  published: boolean;
  featured: boolean;
  hackathon_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  last_updated: string;
}

interface Role {
  name: 'organizer' | 'judge' | 'mentor' | 'media';
  count: number;
  description: string;
}

interface SponsorshipTier {
  name: 'platinum' | 'gold' | 'silver' | 'bronze';
  description: string;
  min_contribution: number;
  currency: string;
  count: number;
}

// API utility functions
const getAuthToken = () => {
  return localStorage.getItem('access_token') || 
         sessionStorage.getItem('access_token') ||
         document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1];
};

const apiCall = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const defaultHeaders = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  try {
    const response = await fetch(`http://localhost:8000${url}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      },
      credentials: 'include'
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Handle expired token - force logout and redirect
        console.log('🔒 API call failed with 401, forcing logout');
        localStorage.removeItem('access_token');
        sessionStorage.removeItem('access_token');
        // Force redirect to login
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }
      
      // Try to parse error response
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.errors && Array.isArray(errorData.errors)) {
          // Handle validation errors
          const validationErrors = errorData.errors.map((err: any) => {
            const field = err.loc.join('.');
            return `${field}: ${err.msg}`;
          }).join(', ');
          errorMessage = `Validation error: ${validationErrors}`;
        }
      } catch (e) {
        // If we can't parse the error response, use the status text
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error: any) {
    // Re-throw the error so it can be handled by the calling function
    throw error;
  }
};

export default function HackathonManagement() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  
  // Auth guard - redirect to login if not authenticated
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  
  useEffect(() => {
    if (!authLoading && (!user || !isAuthenticated)) {
      console.log('🔒 User not authenticated, redirecting to login');
      router.push('/login');
      return;
    }
  }, [user, isAuthenticated, authLoading, router]);
  
  // Don't render anything if not authenticated
  if (!user || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  // Core state
  const [hackathon, setHackathon] = useState<HackathonResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data state
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [sponsorshipTiers, setSponsorshipTiers] = useState<SponsorshipTier[]>([]);

  // UI state
  const [activeTab, setActiveTab] = useState("overview");
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [editMemberOpen, setEditMemberOpen] = useState(false);
  const [addSponsorOpen, setAddSponsorOpen] = useState(false);
  const [editSponsorOpen, setEditSponsorOpen] = useState(false);
  const [addTimelineOpen, setAddTimelineOpen] = useState(false);
  const [editTimelineOpen, setEditTimelineOpen] = useState(false);
  const [editResourceOpen, setEditResourceOpen] = useState(false);
  const [editFAQOpen, setEditFAQOpen] = useState(false);
  const [deleteFAQOpen, setDeleteFAQOpen] = useState(false);
  const [activeFaqFilter, setActiveFaqFilter] = useState("all");
  const [addDocumentationOpen, setAddDocumentationOpen] = useState(false);

  // Delete dialog state
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

  // Form state for adding/editing
  const [memberForm, setMemberForm] = useState({
    name: '',
    email: '',
    role: 'organizer' as 'organizer' | 'judge' | 'mentor' | 'media',
    permissions: [] as string[],
    auto_approve: false,
    notifications_enabled: true
  });

  const [sponsorForm, setSponsorForm] = useState({
    name: '',
    tier: 'bronze' as 'platinum' | 'gold' | 'silver' | 'bronze',
    logo: '',
    website: '',
    description: '',
    contacts: [{
      name: '',
      role: '',
      email: '',
      phone: ''
    }],
    benefits: [] as string[],
    contribution: 0,
    currency: 'AED',
    featured: false,
    display_order: 0
  });

  const [timelineForm, setTimelineForm] = useState({
    title: '',
    description: '',
    date: '',
    event_type: 'milestone' as 'milestone' | 'deadline' | 'workshop' | 'announcement',
    status: 'upcoming' as 'upcoming' | 'ongoing' | 'completed',
    duration: '',
    location: '',
    meeting_url: '',
    notify_participants: true,
    reminder_hours: 24,
    is_public: true,
    display_order: 0
  });

  const [resourceForm, setResourceForm] = useState({
    title: '',
    description: '',
    resource_type: 'dataset' as 'dataset' | 'api' | 'documentation' | 'tool',
    format: '',
    size: '',
    url: '',
    access_level: 'public' as 'public' | 'private',
    category: '',
    tags: [] as string[],
    featured: false,
    display_order: 0,
    api_key: '',
    api_endpoint: '',
    documentation_url: ''
  });

  const [faqForm, setFaqForm] = useState({
    question: '',
    answer: '',
    category: '',
    order: 0,
    published: true,
    featured: false
  });

  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Image upload state
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

  // Role configuration form state
  const [roleConfigForm, setRoleConfigForm] = useState({
    description: '',
    permissions: [] as string[],
    auto_approve: false,
    notifications_enabled: true
  });

  // Store role configurations locally since backend only applies to existing members
  const [roleConfigurations, setRoleConfigurations] = useState<{[key: string]: any}>({});

  // Load role configurations from localStorage on mount
  useEffect(() => {
    if (params.id) {
      const stored = localStorage.getItem(`roleConfigs_${params.id}`);
      if (stored) {
        try {
          setRoleConfigurations(JSON.parse(stored));
        } catch (error) {
          console.error('Failed to parse stored role configurations:', error);
        }
      }
    }
  }, [params.id]);

  // Save role configurations to localStorage
  const saveRoleConfigurationsToStorage = (configs: {[key: string]: any}) => {
    localStorage.setItem(`roleConfigs_${params.id}`, JSON.stringify(configs));
    setRoleConfigurations(configs);
  };

  // Apply saved role configurations to existing team members
  const applyConfigurationsToExistingMembers = async () => {
    if (Object.keys(roleConfigurations).length === 0) return;

    try {
      // Apply each role configuration to the backend
      for (const [roleName, config] of Object.entries(roleConfigurations)) {
        const roleConfigData = {
          role: roleName,
          description: config.description,
          permissions: config.permissions,
          auto_approve: config.auto_approve,
          notifications_enabled: config.notifications_enabled
        };

        await apiCall(`/api/hackathons/${params.id}/roles/${roleName}/configure`, {
          method: 'POST',
          body: JSON.stringify(roleConfigData)
        });
      }
    } catch (error) {
      console.error('Failed to apply role configurations to existing members:', error);
    }
  };

  // Apply configurations when team members are loaded
  useEffect(() => {
    if (teamMembers.length > 0 && Object.keys(roleConfigurations).length > 0) {
      applyConfigurationsToExistingMembers();
    }
  }, [teamMembers.length, roleConfigurations]);

  // API functions
  const fetchHackathonData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await apiCall(`/api/hackathons/${params.id}`);
      setHackathon(data);
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

  const fetchTeamMembers = async () => {
    try {
      const data = await apiCall(`/api/hackathons/${params.id}/team-members`);
      setTeamMembers(data);
    } catch (err) {
      console.error('Failed to fetch team members:', err);
    }
  };

  const fetchSponsors = async () => {
    try {
      const data = await apiCall(`/api/hackathons/${params.id}/sponsors`);
      setSponsors(data);
    } catch (err) {
      console.error('Failed to fetch sponsors:', err);
    }
  };

  const fetchTimelineEvents = async () => {
    try {
      const data = await apiCall(`/api/hackathons/${params.id}/timeline-events`);
      setTimelineEvents(data);
    } catch (err) {
      console.error('Failed to fetch timeline events:', err);
    }
  };

  const fetchResources = async () => {
    try {
      const data = await apiCall(`/api/hackathons/${params.id}/resources`);
      setResources(data);
    } catch (err) {
      console.error('Failed to fetch resources:', err);
    }
  };

  const fetchFAQs = async () => {
    try {
      const data = await apiCall(`/api/hackathons/${params.id}/faqs`);
      setFaqs(data);
    } catch (err) {
      console.error('Failed to fetch FAQs:', err);
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await apiCall(`/api/hackathons/${params.id}/roles`);
      setRoles(data.roles);
    } catch (err) {
      console.error('Failed to fetch roles:', err);
    }
  };

  const fetchSponsorshipTiers = async () => {
    try {
      const data = await apiCall(`/api/hackathons/${params.id}/sponsorship-tiers`);
      setSponsorshipTiers(data.tiers);
    } catch (err) {
      console.error('Failed to fetch sponsorship tiers:', err);
    }
  };

  // CRUD API functions
  const createTeamMember = async (memberData: any) => {
    return await apiCall(`/api/hackathons/${params.id}/team-members`, {
      method: 'POST',
      body: JSON.stringify(memberData)
    });
  };

  const updateTeamMember = async (memberId: string, memberData: any) => {
    return await apiCall(`/api/hackathons/${params.id}/team-members/${memberId}`, {
      method: 'PUT',
      body: JSON.stringify(memberData)
    });
  };

  const deleteTeamMember = async (memberId: string) => {
    return await apiCall(`/api/hackathons/${params.id}/team-members/${memberId}`, {
      method: 'DELETE'
    });
  };

  const createSponsor = async (sponsorData: any) => {
    return await apiCall(`/api/hackathons/${params.id}/sponsors`, {
      method: 'POST',
      body: JSON.stringify(sponsorData)
    });
  };

  const updateSponsor = async (sponsorId: string, sponsorData: any) => {
    return await apiCall(`/api/hackathons/${params.id}/sponsors/${sponsorId}`, {
      method: 'PUT',
      body: JSON.stringify(sponsorData)
    });
  };

  const deleteSponsor = async (sponsorId: string) => {
    return await apiCall(`/api/hackathons/${params.id}/sponsors/${sponsorId}`, {
      method: 'DELETE'
    });
  };

  const createTimelineEvent = async (eventData: any) => {
    return await apiCall(`/api/hackathons/${params.id}/timeline-events`, {
      method: 'POST',
      body: JSON.stringify(eventData)
    });
  };

  const updateTimelineEvent = async (eventId: string, eventData: any) => {
    return await apiCall(`/api/hackathons/${params.id}/timeline-events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(eventData)
    });
  };

  const deleteTimelineEvent = async (eventId: string) => {
    return await apiCall(`/api/hackathons/${params.id}/timeline-events/${eventId}`, {
      method: 'DELETE'
    });
  };

  const createResource = async (resourceData: any) => {
    return await apiCall(`/api/hackathons/${params.id}/resources`, {
      method: 'POST',
      body: JSON.stringify(resourceData)
    });
  };

  const updateResource = async (resourceId: string, resourceData: any) => {
    return await apiCall(`/api/hackathons/${params.id}/resources/${resourceId}`, {
      method: 'PUT',
      body: JSON.stringify(resourceData)
    });
  };

  const deleteResource = async (resourceId: string) => {
    return await apiCall(`/api/hackathons/${params.id}/resources/${resourceId}`, {
      method: 'DELETE'
    });
  };

  const createFAQ = async (faqData: any) => {
    return await apiCall(`/api/hackathons/${params.id}/faqs`, {
      method: 'POST',
      body: JSON.stringify(faqData)
    });
  };

  const updateFAQ = async (faqId: string, faqData: any) => {
    return await apiCall(`/api/hackathons/${params.id}/faqs/${faqId}`, {
      method: 'PUT',
      body: JSON.stringify(faqData)
    });
  };

  const deleteFAQ = async (faqId: string) => {
    return await apiCall(`/api/hackathons/${params.id}/faqs/${faqId}`, {
      method: 'DELETE'
    });
  };

  // Load all data on component mount
  useEffect(() => {
    if (params.id) {
      fetchHackathonData();
      fetchTeamMembers();
      fetchSponsors();
      fetchTimelineEvents();
      fetchResources();
      fetchFAQs();
      fetchRoles();
      fetchSponsorshipTiers();
    }
  }, [params.id]);

  // Filter FAQs based on selected category
  const filteredFaqs = activeFaqFilter === "all" 
    ? faqs 
    : faqs.filter(faq => faq.category.toLowerCase() === activeFaqFilter.toLowerCase());

  // Get upcoming deadlines from timeline events and hackathon data
  const getUpcomingDeadlines = () => {
    if (!hackathon) return [];
    
    const now = new Date();
    const deadlines = [];

    // Add hackathon registration deadline
    if (hackathon.registrationDeadline && new Date(hackathon.registrationDeadline) > now) {
      deadlines.push({
        id: 'registration',
        title: 'Registration Deadline',
        date: hackathon.registrationDeadline,
        type: 'registration',
        description: 'Last chance to register for the hackathon',
        icon: Users,
        color: 'blue'
      });
    }

    // Add hackathon end date (submission deadline)
    if (hackathon.endDate && new Date(hackathon.endDate) > now) {
      deadlines.push({
        id: 'submission',
        title: 'Project Submissions Due',
        date: hackathon.endDate,
        type: 'submission',
        description: 'Final deadline for project submissions',
        icon: Timer,
        color: 'purple'
      });
    }

    // Add timeline events that are deadlines or important milestones
    timelineEvents.forEach(event => {
      const eventDate = new Date(event.date);
      if (eventDate > now && (event.event_type === 'deadline' || 
          (event.event_type === 'milestone' && event.status === 'upcoming'))) {
        deadlines.push({
          id: event.id,
          title: event.title,
          date: event.date,
          type: event.event_type,
          description: event.description,
          icon: event.event_type === 'deadline' ? AlertCircle : Calendar,
          color: event.event_type === 'deadline' ? 'red' : 'indigo'
        });
      }
    });

    // Sort by date and return first 4
    return deadlines
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 4);
  };

  const upcomingDeadlines = getUpcomingDeadlines();

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
  const handleAddMember = () => {
    setMemberForm({
      name: '',
      email: '',
      role: 'organizer',
      permissions: [],
      auto_approve: false,
      notifications_enabled: true
    });
    setAddMemberOpen(true);
  };
  
  const handleEditMember = (member: TeamMember) => {
    setSelectedMember(member);
    setMemberForm({
      name: member.name,
      email: member.email,
      role: member.role,
      permissions: member.permissions,
      auto_approve: member.auto_approve,
      notifications_enabled: member.notifications_enabled
    });
    setEditMemberOpen(true);
  };
  
  const handleDeleteMember = (member: TeamMember) => {
    setSelectedMember(member);
    setDeleteMemberOpen(true);
  };

  const handleSubmitMember = async (isEdit: boolean = false) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      // Apply saved role configuration if it exists
      const savedRoleConfig = roleConfigurations[memberForm.role];
      const memberData = {
        ...memberForm,
        // Apply saved permissions if they exist, otherwise use form permissions
        permissions: savedRoleConfig?.permissions || memberForm.permissions,
        // Apply saved auto_approve setting if it exists, otherwise use form setting
        auto_approve: savedRoleConfig?.auto_approve !== undefined ? savedRoleConfig.auto_approve : memberForm.auto_approve,
        // Apply saved notifications setting if it exists, otherwise use form setting
        notifications_enabled: savedRoleConfig?.notifications_enabled !== undefined ? savedRoleConfig.notifications_enabled : memberForm.notifications_enabled
      };
      
      if (isEdit && selectedMember) {
        await updateTeamMember(selectedMember.id, memberData);
        toast({
          title: "Success",
          description: "Team member updated successfully",
        });
        setEditMemberOpen(false);
      } else {
        await createTeamMember(memberData);
        toast({
          title: "Success", 
          description: "Team member added successfully",
        });
        setAddMemberOpen(false);
      }
      
      // Refresh data
      await fetchTeamMembers();
      await fetchRoles();
      
    } catch (error: any) {
      console.error('Member submission error:', error);
      
      // Enhanced error handling for better user feedback
      let errorMessage = "Failed to save team member";
      
      if (error.message) {
        try {
          // Try to parse as JSON error response
          const errorData = JSON.parse(error.message.replace(/^HTTP \d+: /, ''));
          
          if (errorData.errors && Array.isArray(errorData.errors)) {
            // Handle validation errors array
            const validationMessages = errorData.errors.map((err: any) => {
              const field = err.loc[err.loc.length - 1];
              let fieldName = field;
              let errorMsg = err.msg;
              
              // Convert field names to user-friendly names
              switch (field) {
                case 'name':
                  fieldName = 'Name';
                  break;
                case 'email':
                  fieldName = 'Email address';
                  break;
                case 'role':
                  fieldName = 'Role';
                  break;
                default:
                  fieldName = field.replace(/_/g, ' ');
              }
              
              // Convert error messages to user-friendly format
              if (errorMsg.includes('value is not a valid email address')) {
                errorMsg = 'Please enter a valid email address';
              } else if (errorMsg.includes('field required')) {
                errorMsg = 'This field is required';
              } else if (errorMsg.includes('string too short')) {
                errorMsg = 'This field is too short';
              } else if (errorMsg.includes('string too long')) {
                errorMsg = 'This field is too long';
              }
              
              return `${fieldName}: ${errorMsg}`;
            });
            
            errorMessage = validationMessages.join('\n');
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.detail) {
            errorMessage = errorData.detail;
          }
        } catch (parseError) {
          // If JSON parsing fails, handle as string error
          if (error.message.includes('already exists')) {
            errorMessage = "A team member with this email already exists";
          } else {
            errorMessage = error.message;
          }
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDeleteMember = async () => {
    if (!selectedMember || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await deleteTeamMember(selectedMember.id);
      toast({
        title: "Success",
        description: "Team member removed successfully",
      });
      setDeleteMemberOpen(false);
      setSelectedMember(null);
      
      // Refresh data
      await fetchTeamMembers();
      await fetchRoles();
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove team member",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSponsor = () => {
    setSponsorForm({
      name: '',
      tier: 'bronze',
      logo: '',
      website: '',
      description: '',
      contacts: [{
        name: '',
        role: '',
        email: '',
        phone: ''
      }],
      benefits: [],
      contribution: 0,
      currency: 'AED',
      featured: false,
      display_order: 0
    });
    setAddSponsorOpen(true);
  };
  
  const handleEditSponsor = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor);
    setSponsorForm({
      name: sponsor.name,
      tier: sponsor.tier,
      logo: sponsor.logo,
      website: sponsor.website,
      description: sponsor.description,
      contacts: sponsor.contacts,
      benefits: sponsor.benefits,
      contribution: sponsor.contribution,
      currency: sponsor.currency,
      featured: sponsor.featured,
      display_order: sponsor.display_order
    });
    setEditSponsorOpen(true);
  };
  
  const handleDeleteSponsor = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor);
    setDeleteSponsorOpen(true);
  };

  const handleConfirmDeleteSponsor = async () => {
    if (!selectedSponsor || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await deleteSponsor(selectedSponsor.id);
      toast({
        title: "Success",
        description: "Sponsor deleted successfully",
      });
      setDeleteSponsorOpen(false);
      setSelectedSponsor(null);
      
      // Refresh data
      await fetchSponsors();
      await fetchSponsorshipTiers();
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete sponsor",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitSponsor = async (isEdit: boolean = false) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      // Clean up the sponsor form data for API submission
      let cleanedWebsite: string | null = sponsorForm.website.trim();
      let cleanedLogo: string | null = sponsorForm.logo.trim();
      
      // Handle website URL scheme
      if (cleanedWebsite === '') {
        cleanedWebsite = null;
      } else if (!cleanedWebsite.startsWith('http')) {
        cleanedWebsite = `https://${cleanedWebsite}`;
      }

      // Handle logo URL
      if (cleanedLogo === '') {
        cleanedLogo = null;
      } else if (cleanedLogo && !cleanedLogo.startsWith('http')) {
        cleanedLogo = `https://${cleanedLogo}`;
      }

      const cleanedSponsorForm = {
        ...sponsorForm,
        logo: cleanedLogo,
        website: cleanedWebsite
      };

      if (isEdit && selectedSponsor) {
        await updateSponsor(selectedSponsor.id, cleanedSponsorForm);
        toast({
          title: "Success",
          description: "Sponsor updated successfully",
        });
        setEditSponsorOpen(false);
      } else {
        await createSponsor(cleanedSponsorForm);
        toast({
          title: "Success", 
          description: "Sponsor added successfully",
        });
        setAddSponsorOpen(false);
      }
      
      // Refresh data
      await fetchSponsors();
      await fetchSponsorshipTiers();
      
    } catch (error: any) {
      console.error('Sponsor submission error:', error);
      
      // Enhanced error handling for better user feedback
      let errorMessage = "Failed to save sponsor";
      
      if (error.message) {
        try {
          // Try to parse as JSON error response
          const errorData = JSON.parse(error.message.replace(/^HTTP \d+: /, ''));
          
          if (errorData.errors && Array.isArray(errorData.errors)) {
            // Handle validation errors array
            const validationMessages = errorData.errors.map((err: any) => {
              const field = err.loc[err.loc.length - 1];
              let fieldName = field;
              let errorMsg = err.msg;
              
              // Convert field names to user-friendly names
              switch (field) {
                case 'name':
                  fieldName = 'Company name';
                  break;
                case 'email':
                  fieldName = 'Email address';
                  break;
                case 'logo':
                  fieldName = 'Logo URL';
                  break;
                case 'website':
                  fieldName = 'Website URL';
                  break;
                case 'contribution':
                  fieldName = 'Contribution amount';
                  break;
                case 'tier':
                  fieldName = 'Sponsorship tier';
                  break;
                case 'description':
                  fieldName = 'Description';
                  break;
                default:
                  fieldName = field.replace(/_/g, ' ');
              }
              
              // Convert error messages to user-friendly format
              if (errorMsg.includes('value is not a valid email address')) {
                errorMsg = 'Please enter a valid email address';
              } else if (errorMsg.includes('Input should be a valid URL')) {
                errorMsg = 'Please enter a valid URL';
              } else if (errorMsg.includes('URL scheme should be')) {
                errorMsg = 'URL must start with http:// or https://';
              } else if (errorMsg.includes('field required')) {
                errorMsg = 'This field is required';
              } else if (errorMsg.includes('string too short')) {
                errorMsg = 'This field is too short';
              } else if (errorMsg.includes('string too long')) {
                errorMsg = 'This field is too long';
              } else if (errorMsg.includes('value is not a valid')) {
                errorMsg = 'Please enter a valid value';
              }
              
              return `${fieldName}: ${errorMsg}`;
            });
            
            errorMessage = validationMessages.join('\n');
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.detail) {
            errorMessage = errorData.detail;
          }
        } catch (parseError) {
          // If JSON parsing fails, handle as string error
          if (error.message.includes('already exists')) {
            errorMessage = "A sponsor with this name already exists";
          } else {
            errorMessage = error.message;
          }
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTimeline = (event: TimelineEvent) => {
    setSelectedTimeline(event);
    setTimelineForm({
      title: event.title,
      description: event.description,
      date: event.date.split('T')[0], // Extract date part
      event_type: event.event_type,
      status: event.status,
      duration: event.duration?.toString() || '',
      location: event.location || '',
      meeting_url: event.meeting_url || '',
      notify_participants: event.notify_participants,
      reminder_hours: event.reminder_hours,
      is_public: event.is_public,
      display_order: event.display_order
    });
    setEditTimelineOpen(true);
  };
  
  const handleDeleteTimeline = (event: TimelineEvent) => {
    setSelectedTimeline(event);
    setDeleteTimelineOpen(true);
  };

  const handleSubmitTimeline = async (isEdit: boolean = false) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const timelineData = {
        ...timelineForm,
        duration: timelineForm.duration ? parseInt(timelineForm.duration) : null,
        date: new Date(timelineForm.date).toISOString()
      };
      
      if (isEdit && selectedTimeline) {
        await updateTimelineEvent(selectedTimeline.id, timelineData);
        toast({
          title: "Success",
          description: "Timeline event updated successfully",
        });
        setEditTimelineOpen(false);
      } else {
        await createTimelineEvent(timelineData);
        toast({
          title: "Success", 
          description: "Timeline event created successfully",
        });
        // Close the add timeline dialog and reset form
        setAddTimelineOpen(false);
        resetTimelineForm();
      }
      
      // Refresh data
      await fetchTimelineEvents();
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save timeline event",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDeleteTimeline = async () => {
    if (!selectedTimeline || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await deleteTimelineEvent(selectedTimeline.id);
      toast({
        title: "Success",
        description: "Timeline event deleted successfully",
      });
      setDeleteTimelineOpen(false);
      setSelectedTimeline(null);
      
      // Refresh data
      await fetchTimelineEvents();
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete timeline event",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditResource = (resource: Resource) => {
    setSelectedResource(resource);
    setResourceForm({
      title: resource.title,
      description: resource.description,
      resource_type: resource.type,
      format: resource.format || '',
      size: resource.size || '',
      url: resource.url,
      access_level: resource.access_level,
      category: resource.category,
      tags: resource.tags,
      featured: resource.featured,
      display_order: resource.display_order,
      api_key: resource.api_key || '',
      api_endpoint: resource.api_endpoint || '',
      documentation_url: resource.documentation_url || ''
    });
    setEditResourceOpen(true);
  };
  
  const handleDeleteResource = (resource: Resource) => {
    setSelectedResource(resource);
    setDeleteResourceOpen(true);
  };

  const handleSubmitResource = async (isEdit: boolean = false) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      if (isEdit && selectedResource) {
        await updateResource(selectedResource.id, resourceForm);
        toast({
          title: "Success",
          description: "Resource updated successfully",
        });
        setEditResourceOpen(false);
      } else {
        await createResource(resourceForm);
        toast({
          title: "Success", 
          description: "Resource created successfully",
        });
      }
      
      // Refresh data
      await fetchResources();
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save resource",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDeleteResource = async () => {
    if (!selectedResource || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await deleteResource(selectedResource.id);
      toast({
        title: "Success",
        description: "Resource deleted successfully",
      });
      setDeleteResourceOpen(false);
      setSelectedResource(null);
      
      // Refresh data
      await fetchResources();
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete resource",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditFAQ = (faq: FAQ) => {
    setSelectedFAQ(faq);
    setFaqForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      order: faq.order,
      published: faq.published,
      featured: faq.featured
    });
    setEditFAQOpen(true);
  };
  
  const handleDeleteFAQ = (faq: FAQ) => {
    setSelectedFAQ(faq);
    setDeleteFAQOpen(true);
  };

  const handleSubmitFAQ = async (isEdit: boolean = false) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      if (isEdit && selectedFAQ) {
        await updateFAQ(selectedFAQ.id, faqForm);
        toast({
          title: "Success",
          description: "FAQ updated successfully",
        });
        setEditFAQOpen(false);
      } else {
        await createFAQ(faqForm);
        toast({
          title: "Success", 
          description: "FAQ created successfully",
        });
      }
      
      // Refresh data
      await fetchFAQs();
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save FAQ",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDeleteFAQ = async () => {
    if (!selectedFAQ || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await deleteFAQ(selectedFAQ.id);
      toast({
        title: "Success",
        description: "FAQ deleted successfully",
      });
      setDeleteFAQOpen(false);
      setSelectedFAQ(null);
      
      // Refresh data
      await fetchFAQs();
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete FAQ",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfigureRole = (role: Role) => {
    setSelectedRole(role);
    
    // Check if we have a saved configuration for this role
    const savedConfig = roleConfigurations[role.name];
    
    if (savedConfig) {
      // Load saved configuration
      setRoleConfigForm({
        description: savedConfig.description || role.description,
        permissions: savedConfig.permissions || [],
        auto_approve: savedConfig.auto_approve || false,
        notifications_enabled: savedConfig.notifications_enabled !== undefined ? savedConfig.notifications_enabled : true
      });
    } else {
      // Set default permissions based on role
      let defaultPermissions: string[] = [];
      switch (role.name) {
        case 'organizer':
          defaultPermissions = ['admin', 'manage_teams', 'manage_submissions', 'send_communications', 'manage_resources'];
          break;
        case 'judge':
          defaultPermissions = ['manage_submissions', 'score_submissions'];
          break;
        case 'mentor':
          defaultPermissions = ['manage_teams', 'manage_resources'];
          break;
        case 'media':
          defaultPermissions = [];
          break;
      }
      
      // Initialize form state with role defaults
      setRoleConfigForm({
        description: role.description,
        permissions: defaultPermissions,
        auto_approve: role.name === 'mentor', // Default for mentors
        notifications_enabled: true
      });
    }
    
    setConfigureRoleOpen(true);
  };

  const handleSaveRoleConfiguration = async () => {
    if (!selectedRole || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Prepare role configuration data from state
      const roleConfigData = {
        role: selectedRole.name,
        description: roleConfigForm.description,
        permissions: roleConfigForm.permissions,
        auto_approve: roleConfigForm.auto_approve,
        notifications_enabled: roleConfigForm.notifications_enabled
      };

      // Save configuration locally first
      const updatedConfigs = {
        ...roleConfigurations,
        [selectedRole.name]: {
          description: roleConfigForm.description,
          permissions: roleConfigForm.permissions,
          auto_approve: roleConfigForm.auto_approve,
          notifications_enabled: roleConfigForm.notifications_enabled
        }
      };
      saveRoleConfigurationsToStorage(updatedConfigs);

      // Call API to update role configuration (applies to existing team members)
      await apiCall(`/api/hackathons/${params.id}/roles/${selectedRole.name}/configure`, {
        method: 'POST',
        body: JSON.stringify(roleConfigData)
      });

      toast({
        title: "Success",
        description: "Role configuration saved successfully",
      });
      
      setConfigureRoleOpen(false);
      setSelectedRole(null);
      
      // Refresh roles data
      await fetchRoles();
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update role configuration",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
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

  // Form reset functions
  const resetTimelineForm = () => {
    setTimelineForm({
      title: '',
      description: '',
      date: '',
      event_type: 'milestone',
      status: 'upcoming',
      duration: '',
      location: '',
      meeting_url: '',
      notify_participants: true,
      reminder_hours: 24,
      is_public: true,
      display_order: 0
    });
  };

  const resetResourceForm = () => {
    setResourceForm({
      title: '',
      description: '',
      resource_type: 'dataset',
      format: '',
      size: '',
      url: '',
      access_level: 'public',
      category: '',
      tags: [],
      featured: false,
      display_order: 0,
      api_key: '',
      api_endpoint: '',
      documentation_url: ''
    });
  };

  const resetFaqForm = () => {
    setFaqForm({
      question: '',
      answer: '',
      category: '',
      order: 0,
      published: true,
      featured: false
    });
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
                        {upcomingDeadlines.length > 0 ? (
                          upcomingDeadlines.map((deadline) => {
                            const IconComponent = deadline.icon;
                            const daysUntil = Math.ceil((new Date(deadline.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                            const isPast = daysUntil < 0;
                            
                            return (
                              <div key={deadline.id} className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 border border-slate-100">
                                <div className={cn(
                                  "h-10 w-10 rounded-lg flex items-center justify-center",
                                  deadline.color === 'blue' ? "bg-blue-100 text-blue-700" :
                                  deadline.color === 'purple' ? "bg-purple-100 text-purple-700" :
                                  deadline.color === 'red' ? "bg-red-100 text-red-700" :
                                  deadline.color === 'indigo' ? "bg-indigo-100 text-indigo-700" :
                                  "bg-slate-100 text-slate-700"
                                )}>
                                  <IconComponent className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium">{deadline.title}</h4>
                                  <p className="text-sm text-slate-600">
                                    {new Date(deadline.date).toLocaleDateString('en-US', { 
                                      month: 'long', 
                                      day: 'numeric', 
                                      year: 'numeric',
                                      hour: 'numeric',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                  {deadline.description && (
                                    <p className="text-xs text-slate-500 mt-1">{deadline.description}</p>
                                  )}
                                </div>
                                <Badge 
                                  variant="outline" 
                                  className={cn(
                                    "ml-auto",
                                    isPast ? "bg-red-50 text-red-700 border-red-200" :
                                    daysUntil === 0 ? "bg-orange-50 text-orange-700 border-orange-200" :
                                    daysUntil <= 3 ? "bg-amber-50 text-amber-700 border-amber-200" :
                                    "bg-slate-50 text-slate-700 border-slate-200"
                                  )}
                                >
                                  {isPast ? 'Overdue' : 
                                   daysUntil === 0 ? 'Today' : 
                                   daysUntil === 1 ? 'Tomorrow' : 
                                   `In ${daysUntil} days`}
                                </Badge>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-8">
                            <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-900 mb-2">No upcoming deadlines</h3>
                            <p className="text-slate-600">All deadlines are either past or not yet scheduled.</p>
                          </div>
                        )}
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
                        {teamMembers.length > 0 ? (
                          teamMembers.map((member) => (
                            <div key={member.id} className="group rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white overflow-hidden hover:shadow-md transition-all duration-200">
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
                                        member.status === 'active' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                        member.status === 'pending' ? "bg-amber-50 text-amber-700 border-amber-200" :
                                        "bg-slate-50 text-slate-700 border-slate-200"
                                      )}
                                    >
                                      {member.status}
                                    </Badge>
                                    <Badge 
                                      variant="outline" 
                                      className={cn(
                                        "shadow-sm capitalize",
                                        member.role === 'organizer' ? "bg-purple-50 text-purple-700 border-purple-200" :
                                        member.role === 'judge' ? "bg-blue-50 text-blue-700 border-blue-200" :
                                        member.role === 'mentor' ? "bg-indigo-50 text-indigo-700 border-indigo-200" :
                                        "bg-slate-50 text-slate-700 border-slate-200"
                                      )}
                                    >
                                      {member.role}
                                    </Badge>
                                  </div>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-2">
                                  {member.permissions.map((permission) => (
                                    <Badge 
                                      key={permission}
                                      variant="outline" 
                                      className="bg-slate-50 text-slate-700 border-slate-200 shadow-sm"
                                    >
                                      {permission.replace('_', ' ')}
                                    </Badge>
                                  ))}
                                </div>

                                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200">
                                  <span className="text-sm text-slate-500">Added {new Date(member.date_added).toLocaleDateString()}</span>
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
                          ))
                        ) : (
                          <div className="text-center py-12">
                            <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-900 mb-2">No team members</h3>
                            <p className="text-slate-600 mb-4">Add team members to help manage your hackathon</p>
                            <Button onClick={handleAddMember}>
                              <Plus className="h-4 w-4 mr-2" />
                              Add First Member
                            </Button>
                          </div>
                        )}
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
                          <div key={role.name} className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Badge 
                                  variant="outline" 
                                  className={cn(
                                    "shadow-sm capitalize",
                                    role.name === 'organizer' ? "bg-purple-50 text-purple-700 border-purple-200" :
                                    role.name === 'judge' ? "bg-blue-50 text-blue-700 border-blue-200" :
                                    role.name === 'mentor' ? "bg-indigo-50 text-indigo-700 border-indigo-200" :
                                    "bg-slate-50 text-slate-700 border-slate-200"
                                  )}
                                >
                                  {role.name}
                                </Badge>
                                <span className="text-sm font-medium text-slate-900">{role.count} member{role.count !== 1 ? 's' : ''}</span>
                                {roleConfigurations[role.name] && (
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                                    Configured
                                  </Badge>
                                )}
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="h-8 bg-white/50 backdrop-blur-sm border-slate-200 hover:bg-white/75 hover:border-slate-300"
                                onClick={() => handleConfigureRole(role)}
                              >
                                <Settings2 className="h-4 w-4 mr-2" />
                                Configure
                              </Button>
                            </div>
                            <div className="mt-3 text-sm text-slate-600">
                              {roleConfigurations[role.name]?.description || role.description}
                            </div>
                            {roleConfigurations[role.name] && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {roleConfigurations[role.name].permissions?.map((permission: string) => (
                                  <Badge key={permission} variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                                    {permission.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                  </Badge>
                                ))}
                              </div>
                            )}
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
                        {sponsors.length > 0 ? (
                          sponsors.map((sponsor) => (
                            <div key={sponsor.id} className="group rounded-xl border border-violet-200/50 bg-white overflow-hidden hover:shadow-lg transition-all duration-200">
                              <div className="p-6 relative border-b bg-gradient-to-r from-slate-50 via-violet-50 to-slate-50 border-violet-200/50">
                                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
                                <div className="relative flex items-start gap-6">
                                  <div className="shrink-0 h-20 w-20 rounded-xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-white flex items-center justify-center shadow-sm overflow-hidden">
                                    {sponsor.logo ? (
                                      <img src={sponsor.logo} alt={sponsor.name} className="w-full h-full object-cover" />
                                    ) : (
                                      <Building2 className="h-10 w-10 text-violet-300" />
                                    )}
                                  </div>
                                  
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4">
                                      <div>
                                        <h3 className="text-lg font-semibold text-slate-900">{sponsor.name}</h3>
                                        {sponsor.website && (
                                          <a 
                                            href={sponsor.website} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="mt-1 text-sm text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1.5"
                                          >
                                            <Globe className="h-3.5 w-3.5" />
                                            {sponsor.website.replace(/^https?:\/\//, '')}
                                          </a>
                                        )}
                                      </div>
                                      <div className="flex items-start gap-3">
                                        <Badge 
                                          variant="outline" 
                                          className={cn(
                                            "shadow-sm font-medium px-3 py-1 capitalize",
                                            sponsor.tier === 'platinum' ? "bg-violet-50 text-violet-700 border-violet-200" :
                                            sponsor.tier === 'gold' ? "bg-amber-50 text-amber-700 border-amber-200" :
                                            sponsor.tier === 'silver' ? "bg-slate-50 text-slate-700 border-slate-200" :
                                            "bg-orange-50 text-orange-700 border-orange-200"
                                          )}
                                        >
                                          {sponsor.tier} Tier
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
                                {sponsor.contacts && sponsor.contacts.length > 0 && (
                                  <div>
                                    <div className="flex items-center gap-2 mb-3">
                                      <User className="h-4 w-4 text-slate-500" />
                                      <h4 className="text-sm font-medium text-slate-900">Primary Contact</h4>
                                    </div>
                                    <div className="p-4 rounded-xl border bg-gradient-to-br from-slate-50 to-white shadow-sm border-violet-200/50">
                                      <div className="flex items-center gap-3 mb-3">
                                        <div className="h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-sm bg-gradient-to-br from-violet-500 to-violet-600">
                                          {sponsor.contacts[0].name.split(' ').map(n => n[0]).join('').slice(0, 2)}
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
                                        {sponsor.contacts[0].phone && (
                                          <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Phone className="h-4 w-4 text-slate-400" />
                                            <span>{sponsor.contacts[0].phone}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {sponsor.benefits && sponsor.benefits.length > 0 && (
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                      <Gift className="h-4 w-4 text-slate-500" />
                                      <h4 className="text-sm font-medium text-slate-900">Sponsorship Benefits</h4>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {sponsor.benefits.map((benefit, index) => (
                                        <div key={index} className="px-3 py-1.5 rounded-lg border shadow-sm text-sm flex items-center gap-2 bg-gradient-to-r from-violet-50 to-slate-50 text-violet-700 border-violet-200">
                                          <Check className="h-3.5 w-3.5" />
                                          {benefit.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                <div className="pt-4 border-t border-slate-200">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-baseline gap-2">
                                      <span className="text-sm font-medium text-slate-600">Contribution</span>
                                      <span className="text-2xl font-semibold text-violet-700">
                                        {sponsor.contribution.toLocaleString()} {sponsor.currency}
                                      </span>
                                    </div>
                                    <Badge 
                                      variant="outline" 
                                      className={cn(
                                        "shadow-sm font-medium capitalize",
                                        sponsor.tier === 'platinum' ? "bg-violet-50 text-violet-700 border-violet-200" :
                                        sponsor.tier === 'gold' ? "bg-amber-50 text-amber-700 border-amber-200" :
                                        sponsor.tier === 'silver' ? "bg-slate-50 text-slate-700 border-slate-200" :
                                        "bg-orange-50 text-orange-700 border-orange-200"
                                      )}
                                    >
                                      {sponsor.tier}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-12">
                            <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-900 mb-2">No sponsors</h3>
                            <p className="text-slate-600 mb-4">Add sponsors to support your hackathon</p>
                            <Button onClick={handleAddSponsor}>
                              <Plus className="h-4 w-4 mr-2" />
                              Add First Sponsor
                            </Button>
                          </div>
                        )}
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
                          <div key={tier.name} className={cn(
                            "p-4 rounded-xl border shadow-sm hover:shadow-md transition-all duration-200",
                            tier.name === 'platinum' ? "bg-gradient-to-br from-violet-50 to-white border-violet-200" :
                            tier.name === 'gold' ? "bg-gradient-to-br from-amber-50 to-white border-amber-200" :
                            tier.name === 'silver' ? "bg-gradient-to-br from-slate-50 to-white border-slate-200" :
                            "bg-gradient-to-br from-orange-50 to-white border-orange-200"
                          )}>
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className={cn(
                                  "font-medium capitalize",
                                  tier.name === 'platinum' ? "text-violet-900" :
                                  tier.name === 'gold' ? "text-amber-900" :
                                  tier.name === 'silver' ? "text-slate-900" :
                                  "text-orange-900"
                                )}>{tier.name}</h4>
                                <p className="text-sm text-slate-600 mt-1">{tier.description}</p>
                              </div>
                              <Badge 
                                variant="outline" 
                                className={cn(
                                  "shadow-sm font-medium",
                                  tier.name === 'platinum' ? "bg-violet-50 text-violet-700 border-violet-200" :
                                  tier.name === 'gold' ? "bg-amber-50 text-amber-700 border-amber-200" :
                                  tier.name === 'silver' ? "bg-slate-50 text-slate-700 border-slate-200" :
                                  "bg-orange-50 text-orange-700 border-orange-200"
                                )}
                              >
                                {tier.min_contribution.toLocaleString()}+ {tier.currency}
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
                        <div className="flex items-center gap-2">
                          <Button 
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md"
                            onClick={() => {
                              resetTimelineForm();
                              setAddTimelineOpen(true);
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Event
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="relative space-y-6 pb-4">
                        {/* Timeline line */}
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-200 via-blue-200 to-slate-200" />

                        {timelineEvents.length > 0 ? (
                          timelineEvents.map((event, index) => (
                            <div key={event.id} className="relative pl-10 pr-4 py-4 rounded-lg border bg-white hover:shadow-md transition-all duration-200">
                              <div className="absolute left-0 ml-2 -mt-2">
                                <div className={cn(
                                  "w-5 h-5 rounded-full border-2 border-white shadow-md",
                                  event.status === 'completed' ? "bg-emerald-500" :
                                  event.status === 'ongoing' ? "bg-blue-500" :
                                  "bg-slate-400"
                                )}>
                                  {event.status === 'ongoing' && (
                                    <div className="absolute top-0 left-0 w-5 h-5">
                                      <div className="absolute inline-flex w-full h-full rounded-full opacity-75 bg-blue-500 animate-ping" />
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-grow">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-medium text-slate-900">{event.title}</h4>
                                    <Badge 
                                      variant="outline" 
                                      className={cn(
                                        "capitalize shadow-sm",
                                        event.event_type === 'milestone' ? "bg-purple-50 text-purple-700 border-purple-200" :
                                        event.event_type === 'deadline' ? "bg-red-50 text-red-700 border-red-200" :
                                        event.event_type === 'workshop' ? "bg-blue-50 text-blue-700 border-blue-200" :
                                        "bg-green-50 text-green-700 border-green-200"
                                      )}
                                    >
                                      {event.event_type}
                                    </Badge>
                                    <Badge 
                                      variant="outline" 
                                      className={cn(
                                        "capitalize shadow-sm",
                                        event.status === 'completed' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                        event.status === 'ongoing' ? "bg-blue-50 text-blue-700 border-blue-200" :
                                        "bg-slate-50 text-slate-700 border-slate-200"
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
                                        {event.duration} min
                                      </div>
                                    )}
                                    {event.location && (
                                      <div className="flex items-center gap-1.5">
                                        <MapPin className="h-4 w-4" />
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
                          ))
                        ) : (
                          <div className="text-center py-12">
                            <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-900 mb-2">No timeline events</h3>
                            <p className="text-slate-600 mb-4">Create events to plan your hackathon schedule</p>
                          </div>
                        )}
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
                            <Button 
                              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md"
                              onClick={() => resetResourceForm()}
                            >
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
                                    value={resourceForm.title}
                                    onChange={(e) => setResourceForm({...resourceForm, title: e.target.value})}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="resource-description" className="text-sm font-medium text-slate-900">Description</Label>
                                  <Textarea 
                                    id="resource-description" 
                                    placeholder="Provide a detailed description of the resource" 
                                    value={resourceForm.description}
                                    onChange={(e) => setResourceForm({...resourceForm, description: e.target.value})}
                                    className="min-h-[100px] w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow resize-y"
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="resource-type" className="text-sm font-medium text-slate-900">Resource Type</Label>
                                    <select 
                                      id="resource-type" 
                                      value={resourceForm.resource_type}
                                      onChange={(e) => setResourceForm({...resourceForm, resource_type: e.target.value as any})}
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
                                      value={resourceForm.access_level}
                                      onChange={(e) => setResourceForm({...resourceForm, access_level: e.target.value as any})}
                                      className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500/20 transition-shadow bg-white"
                                    >
                                      <option value="public">Public</option>
                                      <option value="private">Private</option>
                                    </select>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="resource-url" className="text-sm font-medium text-slate-900">Resource URL</Label>
                                  <Input 
                                    id="resource-url" 
                                    placeholder="Enter resource URL"
                                    value={resourceForm.url}
                                    onChange={(e) => setResourceForm({...resourceForm, url: e.target.value})}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="resource-category" className="text-sm font-medium text-slate-900">Category</Label>
                                  <Input 
                                    id="resource-category" 
                                    placeholder="Enter category"
                                    value={resourceForm.category}
                                    onChange={(e) => setResourceForm({...resourceForm, category: e.target.value})}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
                              <Button 
                                variant="outline"
                                className="rounded-lg px-4 hover:bg-slate-100 transition-colors"
                                disabled={isSubmitting}
                              >
                                Cancel
                              </Button>
                              <Button 
                                className="rounded-lg px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all hover:shadow-lg"
                                onClick={() => handleSubmitResource(false)}
                                disabled={isSubmitting || !resourceForm.title || !resourceForm.url}
                              >
                                {isSubmitting ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Adding...
                                  </>
                                ) : (
                                  'Add Resource'
                                )}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {resources.length > 0 ? (
                          resources.map((resource) => (
                            <div key={resource.id} className="rounded-lg border border-slate-200 bg-gradient-to-r from-slate-50 to-white overflow-hidden hover:shadow-md transition-all duration-200">
                              <div className="p-4">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex items-start gap-4">
                                    <div className={cn(
                                      "h-10 w-10 rounded-lg flex items-center justify-center shadow-sm border",
                                      resource.type === 'dataset' ? "bg-gradient-to-br from-purple-100 to-purple-50 text-purple-700 border-purple-200" :
                                      resource.type === 'api' ? "bg-gradient-to-br from-blue-100 to-blue-50 text-blue-700 border-blue-200" :
                                      resource.type === 'documentation' ? "bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-700 border-emerald-200" :
                                      "bg-gradient-to-br from-amber-100 to-amber-50 text-amber-700 border-amber-200"
                                    )}>
                                      {resource.type === 'dataset' ? <Database className="h-5 w-5" /> :
                                       resource.type === 'api' ? <FileCode2 className="h-5 w-5" /> :
                                       resource.type === 'documentation' ? <FileText className="h-5 w-5" /> :
                                       <Settings className="h-5 w-5" />}
                                    </div>
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                        <h4 className="font-medium text-slate-900">{resource.title}</h4>
                                        <Badge 
                                          variant="outline" 
                                          className={cn(
                                            "capitalize shadow-sm",
                                            resource.access_level === 'public' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                            "bg-amber-50 text-amber-700 border-amber-200"
                                          )}
                                        >
                                          {resource.access_level}
                                        </Badge>
                                        {resource.featured && (
                                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                            Featured
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-sm text-slate-600">{resource.description}</p>
                                      <div className="flex items-center gap-4 text-sm text-slate-500">
                                        <span className="capitalize">{resource.category}</span>
                                        {resource.format && <span>Format: {resource.format}</span>}
                                        {resource.size && <span>Size: {resource.size}</span>}
                                        <span>Downloads: {resource.downloads}</span>
                                      </div>
                                      {resource.tags && resource.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                          {resource.tags.map((tag) => (
                                            <Badge key={tag} variant="outline" className="text-xs bg-slate-50 text-slate-600">
                                              {tag}
                                            </Badge>
                                          ))}
                                        </div>
                                      )}
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
                          ))
                        ) : (
                          <div className="text-center py-12">
                            <Database className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-900 mb-2">No resources</h3>
                            <p className="text-slate-600 mb-4">Add resources to help participants with their projects</p>
                          </div>
                        )}
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
                            <Button 
                              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md"
                              onClick={() => resetFaqForm()}
                            >
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
                                    value={faqForm.question}
                                    onChange={(e) => setFaqForm({...faqForm, question: e.target.value})}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="faq-answer" className="text-sm font-medium text-slate-900">Answer</Label>
                                  <Textarea 
                                    id="faq-answer" 
                                    placeholder="Provide a clear and concise answer" 
                                    value={faqForm.answer}
                                    onChange={(e) => setFaqForm({...faqForm, answer: e.target.value})}
                                    className="min-h-[150px] w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow resize-y"
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="faq-category" className="text-sm font-medium text-slate-900">Category</Label>
                                    <select 
                                      id="faq-category" 
                                      value={faqForm.category}
                                      onChange={(e) => setFaqForm({...faqForm, category: e.target.value})}
                                      className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500/20 transition-shadow bg-white"
                                    >
                                      <option value="">Select Category</option>
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
                                      value={faqForm.order}
                                      onChange={(e) => setFaqForm({...faqForm, order: parseInt(e.target.value) || 0})}
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
                                        checked={faqForm.published}
                                        onCheckedChange={(checked) => setFaqForm({...faqForm, published: !!checked})}
                                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                      />
                                      <Label htmlFor="faq-published" className="text-sm text-slate-600">
                                        Publish immediately
                                      </Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Checkbox 
                                        id="faq-featured" 
                                        checked={faqForm.featured}
                                        onCheckedChange={(checked) => setFaqForm({...faqForm, featured: !!checked})}
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
                                disabled={isSubmitting}
                              >
                                Cancel
                              </Button>
                              <Button 
                                className="rounded-lg px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all hover:shadow-lg"
                                onClick={() => handleSubmitFAQ(false)}
                                disabled={isSubmitting || !faqForm.question || !faqForm.answer}
                              >
                                {isSubmitting ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Adding...
                                  </>
                                ) : (
                                  'Add FAQ'
                                )}
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
                          {filteredFaqs.length > 0 ? (
                            filteredFaqs.map((faq) => (
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
                                      {faq.featured && (
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                          Featured
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-slate-600">{faq.answer}</p>
                                    <div className="flex items-center gap-4 text-xs text-slate-500">
                                      <span>{faq.views} views</span>
                                      <span>{faq.helpful} found helpful</span>
                                      <span>Updated {new Date(faq.last_updated).toLocaleDateString()}</span>
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
                            ))
                          ) : (
                            <div className="text-center py-12">
                              <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                              <h3 className="text-lg font-medium text-slate-900 mb-2">No FAQs</h3>
                              <p className="text-slate-600 mb-4">Add frequently asked questions to help participants</p>
                            </div>
                          )}
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
                <Label htmlFor="edit-event-title" className="text-sm font-medium text-slate-900">Event Title</Label>
                <Input 
                  id="edit-event-title" 
                  placeholder="Enter event title"
                  value={timelineForm.title}
                  onChange={(e) => setTimelineForm({...timelineForm, title: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-event-description" className="text-sm font-medium text-slate-900">Description</Label>
                <Textarea 
                  id="edit-event-description" 
                  placeholder="Describe the event"
                  value={timelineForm.description}
                  onChange={(e) => setTimelineForm({...timelineForm, description: e.target.value})}
                  className="min-h-[100px] w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow resize-y"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-event-date" className="text-sm font-medium text-slate-900">Date</Label>
                  <Input 
                    id="edit-event-date" 
                    type="date"
                    value={timelineForm.date}
                    onChange={(e) => setTimelineForm({...timelineForm, date: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-event-type" className="text-sm font-medium text-slate-900">Event Type</Label>
                  <select 
                    id="edit-event-type" 
                    value={timelineForm.event_type}
                    onChange={(e) => setTimelineForm({...timelineForm, event_type: e.target.value as any})}
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
                  value={memberForm.name}
                  onChange={(e) => setMemberForm({...memberForm, name: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="member-email" className="text-sm font-medium text-slate-900">Email</Label>
                <Input 
                  id="member-email" 
                  type="email" 
                  placeholder="Enter email address"
                  value={memberForm.email}
                  onChange={(e) => setMemberForm({...memberForm, email: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="member-role" className="text-sm font-medium text-slate-900">Role</Label>
                <select 
                  id="member-role" 
                  value={memberForm.role}
                  onChange={(e) => setMemberForm({...memberForm, role: e.target.value as any})}
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
                  {['admin', 'manage_teams', 'manage_submissions', 'send_communications', 'manage_resources', 'score_submissions'].map((permission) => (
                    <div key={permission} className="flex items-center gap-2">
                      <Checkbox 
                        id={`perm-${permission}`}
                        checked={memberForm.permissions.includes(permission)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setMemberForm({
                              ...memberForm,
                              permissions: [...memberForm.permissions, permission]
                            });
                          } else {
                            setMemberForm({
                              ...memberForm,
                              permissions: memberForm.permissions.filter(p => p !== permission)
                            });
                          }
                        }}
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <Label htmlFor={`perm-${permission}`} className="text-sm text-slate-600">
                        {permission.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="member-auto-approve"
                    checked={memberForm.auto_approve}
                    onCheckedChange={(checked) => setMemberForm({...memberForm, auto_approve: !!checked})}
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <Label htmlFor="member-auto-approve" className="text-sm text-slate-600">
                    Auto-approve for this role
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="member-notifications"
                    checked={memberForm.notifications_enabled}
                    onCheckedChange={(checked) => setMemberForm({...memberForm, notifications_enabled: !!checked})}
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <Label htmlFor="member-notifications" className="text-sm text-slate-600">
                    Enable notifications
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
            <Button 
              variant="outline"
              className="rounded-lg px-4 hover:bg-slate-100 transition-colors"
              onClick={() => setAddMemberOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              className="rounded-lg px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all hover:shadow-lg"
              onClick={() => handleSubmitMember(false)}
              disabled={isSubmitting || !memberForm.name || !memberForm.email}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding...
                </>
              ) : (
                'Add Member'
              )}
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
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              className="rounded-lg px-4 bg-red-600 hover:bg-red-700 text-white shadow-md transition-all hover:shadow-lg"
              onClick={handleConfirmDeleteFAQ}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                'Delete FAQ'
              )}
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
                  value={resourceForm.title}
                  onChange={(e) => setResourceForm({...resourceForm, title: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-resource-description" className="text-sm font-medium text-slate-900">Description</Label>
                <Textarea 
                  id="edit-resource-description" 
                  placeholder="Provide a detailed description of the resource" 
                  value={resourceForm.description}
                  onChange={(e) => setResourceForm({...resourceForm, description: e.target.value})}
                  className="min-h-[100px] w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow resize-y"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-resource-type" className="text-sm font-medium text-slate-900">Resource Type</Label>
                  <select 
                    id="edit-resource-type" 
                    value={resourceForm.resource_type}
                    onChange={(e) => setResourceForm({...resourceForm, resource_type: e.target.value as any})}
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
                    value={resourceForm.access_level}
                    onChange={(e) => setResourceForm({...resourceForm, access_level: e.target.value as any})}
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
                  value={resourceForm.url}
                  onChange={(e) => setResourceForm({...resourceForm, url: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-resource-category" className="text-sm font-medium text-slate-900">Category</Label>
                <Input 
                  id="edit-resource-category" 
                  placeholder="Enter category"
                  value={resourceForm.category}
                  onChange={(e) => setResourceForm({...resourceForm, category: e.target.value})}
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
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              className="rounded-lg px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all hover:shadow-lg"
              onClick={() => handleSubmitResource(true)}
              disabled={isSubmitting || !resourceForm.title || !resourceForm.url}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
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
                  value={memberForm.name}
                  onChange={(e) => setMemberForm({...memberForm, name: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-member-email" className="text-sm font-medium text-slate-900">Email</Label>
                <Input 
                  id="edit-member-email" 
                  type="email" 
                  placeholder="Enter email address"
                  value={memberForm.email}
                  onChange={(e) => setMemberForm({...memberForm, email: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-member-role" className="text-sm font-medium text-slate-900">Role</Label>
                <select 
                  id="edit-member-role" 
                  value={memberForm.role}
                  onChange={(e) => setMemberForm({...memberForm, role: e.target.value as any})}
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
                  {['admin', 'manage_teams', 'manage_submissions', 'send_communications', 'manage_resources', 'score_submissions'].map((permission) => (
                    <div key={permission} className="flex items-center gap-2">
                      <Checkbox 
                        id={`edit-perm-${permission}`}
                        checked={memberForm.permissions.includes(permission)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setMemberForm({
                              ...memberForm,
                              permissions: [...memberForm.permissions, permission]
                            });
                          } else {
                            setMemberForm({
                              ...memberForm,
                              permissions: memberForm.permissions.filter(p => p !== permission)
                            });
                          }
                        }}
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <Label htmlFor={`edit-perm-${permission}`} className="text-sm text-slate-600">
                        {permission.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="edit-member-auto-approve"
                    checked={memberForm.auto_approve}
                    onCheckedChange={(checked) => setMemberForm({...memberForm, auto_approve: !!checked})}
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <Label htmlFor="edit-member-auto-approve" className="text-sm text-slate-600">
                    Auto-approve for this role
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="edit-member-notifications"
                    checked={memberForm.notifications_enabled}
                    onCheckedChange={(checked) => setMemberForm({...memberForm, notifications_enabled: !!checked})}
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <Label htmlFor="edit-member-notifications" className="text-sm text-slate-600">
                    Enable notifications
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
            <Button 
              variant="outline"
              className="rounded-lg px-4 hover:bg-slate-100 transition-colors"
              onClick={() => setEditMemberOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              className="rounded-lg px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all hover:shadow-lg"
              onClick={() => handleSubmitMember(true)}
              disabled={isSubmitting || !memberForm.name || !memberForm.email}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
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
                  value={sponsorForm.name}
                  onChange={(e) => setSponsorForm({...sponsorForm, name: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-sponsor-tier" className="text-sm font-medium text-slate-900">Sponsorship Tier</Label>
                  <select 
                    id="edit-sponsor-tier" 
                    value={sponsorForm.tier}
                    onChange={(e) => setSponsorForm({...sponsorForm, tier: e.target.value as any})}
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
                    value={sponsorForm.contribution}
                    onChange={(e) => setSponsorForm({...sponsorForm, contribution: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-sponsor-website" className="text-sm font-medium text-slate-900">Website</Label>
                <Input 
                  id="edit-sponsor-website" 
                  placeholder="https://example.com or example.com"
                  value={sponsorForm.website}
                  onChange={(e) => setSponsorForm({...sponsorForm, website: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                />
                <p className="text-xs text-slate-500">Enter the company website URL (https:// will be added automatically if not provided)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-sponsor-description" className="text-sm font-medium text-slate-900">Description</Label>
                <Textarea 
                  id="edit-sponsor-description" 
                  placeholder="Brief description of the sponsor" 
                  value={sponsorForm.description}
                  onChange={(e) => setSponsorForm({...sponsorForm, description: e.target.value})}
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
                      value={sponsorForm.contacts[0]?.name || ''}
                      onChange={(e) => setSponsorForm({
                        ...sponsorForm,
                        contacts: [{
                          ...sponsorForm.contacts[0],
                          name: e.target.value
                        }]
                      })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-contact-role" className="text-sm font-medium text-slate-900">Role</Label>
                    <select 
                      id="edit-contact-role" 
                      value={sponsorForm.contacts[0]?.role || ''}
                      onChange={(e) => setSponsorForm({
                        ...sponsorForm,
                        contacts: [{
                          ...sponsorForm.contacts[0],
                          role: e.target.value
                        }]
                      })}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500/20 transition-shadow bg-white"
                    >
                      <option value="">Select Role</option>
                      <option value="CEO">CEO</option>
                      <option value="CTO">CTO</option>
                      <option value="Marketing Director">Marketing Director</option>
                      <option value="Partnership Manager">Partnership Manager</option>
                      <option value="Sponsorship Manager">Sponsorship Manager</option>
                      <option value="Business Development">Business Development</option>
                      <option value="Sales Manager">Sales Manager</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-contact-email" className="text-sm font-medium text-slate-900">Email</Label>
                    <Input 
                      id="edit-contact-email" 
                      type="email" 
                      placeholder="Enter email"
                      value={sponsorForm.contacts[0]?.email || ''}
                      onChange={(e) => setSponsorForm({
                        ...sponsorForm,
                        contacts: [{
                          ...sponsorForm.contacts[0],
                          email: e.target.value
                        }]
                      })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-contact-phone" className="text-sm font-medium text-slate-900">Phone</Label>
                    <Input 
                      id="edit-contact-phone" 
                      placeholder="Enter phone number"
                      value={sponsorForm.contacts[0]?.phone || ''}
                      onChange={(e) => setSponsorForm({
                        ...sponsorForm,
                        contacts: [{
                          ...sponsorForm.contacts[0],
                          phone: e.target.value
                        }]
                      })}
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
                  {['keynote_speaking', 'workshop_session', 'premium_booth', 'logo_placement', 'recruitment_access'].map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2">
                      <Checkbox 
                        id={`edit-benefit-${benefit}`}
                        checked={sponsorForm.benefits.includes(benefit)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSponsorForm({
                              ...sponsorForm,
                              benefits: [...sponsorForm.benefits, benefit]
                            });
                          } else {
                            setSponsorForm({
                              ...sponsorForm,
                              benefits: sponsorForm.benefits.filter(b => b !== benefit)
                            });
                          }
                        }}
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <Label htmlFor={`edit-benefit-${benefit}`} className="text-sm text-slate-600">
                        {benefit.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="edit-sponsor-featured"
                    checked={sponsorForm.featured}
                    onCheckedChange={(checked) => setSponsorForm({...sponsorForm, featured: !!checked})}
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <Label htmlFor="edit-sponsor-featured" className="text-sm text-slate-600">
                    Feature this sponsor
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50 flex-shrink-0">
            <Button 
              variant="outline"
              className="rounded-lg px-4 hover:bg-slate-100 transition-colors"
              onClick={() => setEditSponsorOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              className="rounded-lg px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all hover:shadow-lg"
              onClick={() => handleSubmitSponsor(true)}
              disabled={isSubmitting || !sponsorForm.name}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
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
                  value={sponsorForm.name}
                  onChange={(e) => setSponsorForm({...sponsorForm, name: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sponsor-tier" className="text-sm font-medium text-slate-900">Sponsorship Tier</Label>
                  <select 
                    id="sponsor-tier" 
                    value={sponsorForm.tier}
                    onChange={(e) => setSponsorForm({...sponsorForm, tier: e.target.value as any})}
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
                    value={sponsorForm.contribution}
                    onChange={(e) => setSponsorForm({...sponsorForm, contribution: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sponsor-website" className="text-sm font-medium text-slate-900">Website</Label>
                <Input 
                  id="sponsor-website" 
                  placeholder="https://example.com or example.com"
                  value={sponsorForm.website}
                  onChange={(e) => setSponsorForm({...sponsorForm, website: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                />
                <p className="text-xs text-slate-500">Enter the company website URL (https:// will be added automatically if not provided)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sponsor-description" className="text-sm font-medium text-slate-900">Description</Label>
                <Textarea 
                  id="sponsor-description" 
                  placeholder="Brief description of the sponsor" 
                  value={sponsorForm.description}
                  onChange={(e) => setSponsorForm({...sponsorForm, description: e.target.value})}
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
                      value={sponsorForm.contacts[0]?.name || ''}
                      onChange={(e) => setSponsorForm({
                        ...sponsorForm,
                        contacts: [{
                          ...sponsorForm.contacts[0],
                          name: e.target.value
                        }]
                      })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-role" className="text-sm font-medium text-slate-900">Role</Label>
                    <select 
                      id="contact-role" 
                      value={sponsorForm.contacts[0]?.role || ''}
                      onChange={(e) => setSponsorForm({
                        ...sponsorForm,
                        contacts: [{
                          ...sponsorForm.contacts[0],
                          role: e.target.value
                        }]
                      })}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500/20 transition-shadow bg-white"
                    >
                      <option value="">Select Role</option>
                      <option value="CEO">CEO</option>
                      <option value="CTO">CTO</option>
                      <option value="Marketing Director">Marketing Director</option>
                      <option value="Partnership Manager">Partnership Manager</option>
                      <option value="Sponsorship Manager">Sponsorship Manager</option>
                      <option value="Business Development">Business Development</option>
                      <option value="Sales Manager">Sales Manager</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email" className="text-sm font-medium text-slate-900">Email</Label>
                    <Input 
                      id="contact-email" 
                      type="email" 
                      placeholder="Enter email"
                      value={sponsorForm.contacts[0]?.email || ''}
                      onChange={(e) => setSponsorForm({
                        ...sponsorForm,
                        contacts: [{
                          ...sponsorForm.contacts[0],
                          email: e.target.value
                        }]
                      })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-phone" className="text-sm font-medium text-slate-900">Phone</Label>
                    <Input 
                      id="contact-phone" 
                      placeholder="Enter phone number"
                      value={sponsorForm.contacts[0]?.phone || ''}
                      onChange={(e) => setSponsorForm({
                        ...sponsorForm,
                        contacts: [{
                          ...sponsorForm.contacts[0],
                          phone: e.target.value
                        }]
                      })}
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
                  {['keynote_speaking', 'workshop_session', 'premium_booth', 'logo_placement', 'recruitment_access'].map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2">
                      <Checkbox 
                        id={`benefit-${benefit}`}
                        checked={sponsorForm.benefits.includes(benefit)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSponsorForm({
                              ...sponsorForm,
                              benefits: [...sponsorForm.benefits, benefit]
                            });
                          } else {
                            setSponsorForm({
                              ...sponsorForm,
                              benefits: sponsorForm.benefits.filter(b => b !== benefit)
                            });
                          }
                        }}
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <Label htmlFor={`benefit-${benefit}`} className="text-sm text-slate-600">
                        {benefit.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="sponsor-featured"
                    checked={sponsorForm.featured}
                    onCheckedChange={(checked) => setSponsorForm({...sponsorForm, featured: !!checked})}
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <Label htmlFor="sponsor-featured" className="text-sm text-slate-600">
                    Feature this sponsor
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50 flex-shrink-0">
            <Button 
              variant="outline"
              className="rounded-lg px-4 hover:bg-slate-100 transition-colors"
              onClick={() => setAddSponsorOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              className="rounded-lg px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all hover:shadow-lg"
              onClick={() => handleSubmitSponsor(false)}
              disabled={isSubmitting || !sponsorForm.name}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding...
                </>
              ) : (
                'Add Sponsor'
              )}
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
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({...faqForm, question: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-faq-answer" className="text-sm font-medium text-slate-900">Answer</Label>
                <Textarea 
                  id="edit-faq-answer" 
                  placeholder="Provide a clear and concise answer" 
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({...faqForm, answer: e.target.value})}
                  className="min-h-[150px] w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-shadow resize-y"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-faq-category" className="text-sm font-medium text-slate-900">Category</Label>
                  <select 
                    id="edit-faq-category" 
                    value={faqForm.category}
                    onChange={(e) => setFaqForm({...faqForm, category: e.target.value})}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-500/20 transition-shadow bg-white"
                  >
                    <option value="">Select Category</option>
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
                    value={faqForm.order}
                    onChange={(e) => setFaqForm({...faqForm, order: parseInt(e.target.value) || 0})}
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
                      checked={faqForm.published}
                      onCheckedChange={(checked) => setFaqForm({...faqForm, published: !!checked})}
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="edit-faq-published" className="text-sm text-slate-600">
                      Published
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="edit-faq-featured" 
                      checked={faqForm.featured}
                      onCheckedChange={(checked) => setFaqForm({...faqForm, featured: !!checked})}
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
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              className="rounded-lg px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all hover:shadow-lg"
              onClick={() => handleSubmitFAQ(true)}
              disabled={isSubmitting || !faqForm.question || !faqForm.answer}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
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
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              className="rounded-lg px-4 bg-red-600 hover:bg-red-700 text-white shadow-md transition-all hover:shadow-lg"
              onClick={handleConfirmDeleteMember}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Removing...
                </>
              ) : (
                'Remove Member'
              )}
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
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              className="rounded-lg px-4 bg-red-600 hover:bg-red-700 text-white shadow-md transition-all hover:shadow-lg"
              onClick={handleConfirmDeleteSponsor}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Removing...
                </>
              ) : (
                'Remove Sponsor'
              )}
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
                    {selectedTimeline.event_type}
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
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              className="rounded-lg px-4 bg-red-600 hover:bg-red-700 text-white shadow-md transition-all hover:shadow-lg"
              onClick={handleConfirmDeleteTimeline}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                'Delete Event'
              )}
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
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              className="rounded-lg px-4 bg-red-600 hover:bg-red-700 text-white shadow-md transition-all hover:shadow-lg"
              onClick={handleConfirmDeleteResource}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                'Delete Resource'
              )}
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
                  value={roleConfigForm.description}
                  onChange={(e) => setRoleConfigForm({...roleConfigForm, description: e.target.value})}
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
                      checked={roleConfigForm.permissions.includes('admin')}
                      onCheckedChange={(checked) => {
                        const newPermissions = checked 
                          ? [...roleConfigForm.permissions, 'admin']
                          : roleConfigForm.permissions.filter(p => p !== 'admin');
                        setRoleConfigForm({...roleConfigForm, permissions: newPermissions});
                      }}
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="role-perm-admin" className="text-sm text-slate-600">
                      Admin access
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="role-perm-teams" 
                      checked={roleConfigForm.permissions.includes('manage_teams')}
                      onCheckedChange={(checked) => {
                        const newPermissions = checked 
                          ? [...roleConfigForm.permissions, 'manage_teams']
                          : roleConfigForm.permissions.filter(p => p !== 'manage_teams');
                        setRoleConfigForm({...roleConfigForm, permissions: newPermissions});
                      }}
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="role-perm-teams" className="text-sm text-slate-600">
                      Manage teams
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="role-perm-submissions" 
                      checked={roleConfigForm.permissions.includes('manage_submissions')}
                      onCheckedChange={(checked) => {
                        const newPermissions = checked 
                          ? [...roleConfigForm.permissions, 'manage_submissions']
                          : roleConfigForm.permissions.filter(p => p !== 'manage_submissions');
                        setRoleConfigForm({...roleConfigForm, permissions: newPermissions});
                      }}
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="role-perm-submissions" className="text-sm text-slate-600">
                      Manage submissions
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="role-perm-communications" 
                      checked={roleConfigForm.permissions.includes('send_communications')}
                      onCheckedChange={(checked) => {
                        const newPermissions = checked 
                          ? [...roleConfigForm.permissions, 'send_communications']
                          : roleConfigForm.permissions.filter(p => p !== 'send_communications');
                        setRoleConfigForm({...roleConfigForm, permissions: newPermissions});
                      }}
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="role-perm-communications" className="text-sm text-slate-600">
                      Send communications
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="role-perm-resources" 
                      checked={roleConfigForm.permissions.includes('manage_resources')}
                      onCheckedChange={(checked) => {
                        const newPermissions = checked 
                          ? [...roleConfigForm.permissions, 'manage_resources']
                          : roleConfigForm.permissions.filter(p => p !== 'manage_resources');
                        setRoleConfigForm({...roleConfigForm, permissions: newPermissions});
                      }}
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="role-perm-resources" className="text-sm text-slate-600">
                      Manage resources
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="role-perm-scoring" 
                      checked={roleConfigForm.permissions.includes('score_submissions')}
                      onCheckedChange={(checked) => {
                        const newPermissions = checked 
                          ? [...roleConfigForm.permissions, 'score_submissions']
                          : roleConfigForm.permissions.filter(p => p !== 'score_submissions');
                        setRoleConfigForm({...roleConfigForm, permissions: newPermissions});
                      }}
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
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
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="role-auto-approve"
                      checked={roleConfigForm.auto_approve}
                      onCheckedChange={(checked) => setRoleConfigForm({...roleConfigForm, auto_approve: !!checked})}
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="role-auto-approve" className="text-sm text-slate-600">
                      Auto-approve members
                    </Label>
                    <div className="text-xs text-slate-500 ml-2">
                      Automatically approve new members with this role
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="role-notifications"
                      checked={roleConfigForm.notifications_enabled}
                      onCheckedChange={(checked) => setRoleConfigForm({...roleConfigForm, notifications_enabled: !!checked})}
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="role-notifications" className="text-sm text-slate-600">
                      Role notifications
                    </Label>
                    <div className="text-xs text-slate-500 ml-2">
                      Send notifications about role changes
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
              onClick={() => setConfigureRoleOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="rounded-lg px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all hover:shadow-lg"
              onClick={handleSaveRoleConfiguration}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
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