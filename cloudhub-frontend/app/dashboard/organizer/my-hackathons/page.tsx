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
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
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
  Award,
  Upload,
  Image as ImageIcon,
  Info,
  AlertTriangle
} from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { addDays } from "date-fns"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { hackathonApi, HackathonFormData } from '@/lib/api/hackathon';

// Define interfaces for the criteria and challenges
interface Criterion {
  id: string;
  name: string;
  weight: number;
  description: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
}

interface Prize {
  id?: string;
  place: string;
  position: number;
  amount: number;
  currency: string;
  description: string;
}

interface Technology {
  name: string;
  description: string;
  icon_url?: string;
}

// Update the DateRange type to handle undefined values
interface DateRangeType {
  from: Date;
  to: Date;
}

export default function OrganizerMyHackathonsPage() {
  const [isCreateHackathonOpen, setIsCreateHackathonOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [createStepIndex, setCreateStepIndex] = useState(0)
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [selectedMaxParticipants, setSelectedMaxParticipants] = useState<number>(50)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [hackathonName, setHackathonName] = useState("");
  const [description, setDescription] = useState("");
  const [rulesText, setRulesText] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [logoImage, setLogoImage] = useState<File | null>(null);
  const [dateRange, setDateRange] = useState<DateRangeType>({
    from: new Date(),
    to: addDays(new Date(), 30),
  });
  const [registrationDeadline, setRegistrationDeadline] = useState<Date>(
    addDays(new Date(), 14)
  );
  const [prizePool, setPrizePool] = useState<string>("1000");
  // State for tiered prizes
  const [hasTieredPrizes, setHasTieredPrizes] = useState(false);
  const [prizeSplitOption, setPrizeSplitOption] = useState<string>("none");
  const [prizes, setPrizes] = useState<Prize[]>([
    { 
      id: '1', 
      place: '1st Place',
      position: 1,
      amount: 500,
      currency: 'AED',
      description: '1st Place'
    },
    { 
      id: '2', 
      place: '2nd Place',
      position: 2,
      amount: 300,
      currency: 'AED',
      description: '2nd Place'
    },
    { 
      id: '3', 
      place: '3rd Place',
      position: 3,
      amount: 200,
      currency: 'AED',
      description: '3rd Place'
    }
  ]);
  const [participationPrize, setParticipationPrize] = useState("Certificate of Participation");
  
  // State for judging criteria weights
  const [criteriaWeights, setCriteriaWeights] = useState<Criterion[]>([
    { id: '1', name: 'Innovation', weight: 25, description: 'How original and innovative is the solution?' },
    { id: '2', name: 'Technical Complexity', weight: 25, description: 'How technically challenging was the implementation?' },
    { id: '3', name: 'User Experience', weight: 25, description: 'How intuitive and user-friendly is the solution?' },
    { id: '4', name: 'Impact & Practicality', weight: 25, description: 'How impactful and practical is the solution for real-world use?' },
  ]);
  
  // State for challenges
  const [challenges, setChallenges] = useState<Challenge[]>([
    { 
      id: '1', 
      title: 'AI-Powered Healthcare Solutions', 
      description: 'Develop innovative AI solutions that address healthcare challenges like early disease detection, remote patient monitoring, or medical image analysis.' 
    },
    { 
      id: '2', 
      title: 'Sustainable Smart Cities', 
      description: 'Create applications that improve urban sustainability through energy efficiency, waste management, transportation solutions, or environmental monitoring.' 
    }
  ]);
  
  // Calculate total weight of all criteria
  const calculateTotalWeight = (): number => {
    const total = criteriaWeights.reduce((total, criterion) => total + Number(criterion.weight), 0);
    // Round to 2 decimal places to handle floating point precision
    return Math.round(total * 100) / 100;
  };
  
  // Update criterion weight
  const handleWeightChange = (id: string, value: string): void => {
    const numValue = Number(value);
    const updatedWeights = criteriaWeights.map(criterion => {
      if (criterion.id === id) {
        return { ...criterion, weight: numValue };
      }
      return criterion;
    });
    setCriteriaWeights(updatedWeights);
  };
  
  // Function to handle name changes
  const handleNameChange = (id: string, newName: string) => {
    setCriteriaWeights(criteriaWeights.map(c => 
      c.id === id ? { ...c, name: newName } : c
    ));
  }
  
  // Function to handle description changes
  const handleDescriptionChange = (id: string, newDescription: string) => {
    setCriteriaWeights(criteriaWeights.map(c => 
      c.id === id ? { ...c, description: newDescription } : c
    ));
  }
  
  // Function to add a new criterion
  const handleAddCriterion = () => {
    // Generate a new ID by converting to string the max ID + 1
    const newId = String(Math.max(...criteriaWeights.map(c => Number(c.id))) + 1);
    
    // Calculate equal weights for all criteria including the new one
    const newTotalItems = criteriaWeights.length + 1;
    const equalWeight = Math.floor(100 / newTotalItems);
    
    // Handle remainder to ensure total is 100
    const remainder = 100 - (equalWeight * newTotalItems);
    
    // Update all weights to be equal
    const updatedWeights = criteriaWeights.map(c => ({
      ...c,
      weight: equalWeight + (remainder > 0 ? 1 : 0)
    }));
    
    // Add the new criterion with equal weight
    setCriteriaWeights([
      ...updatedWeights,
      {
        id: newId,
        name: "New Criterion",
        weight: equalWeight,
        description: "Description of the criterion"
      }
    ]);
  }
  
  // Function to delete a criterion
  const handleDeleteCriterion = (id: string) => {
    // Only allow deletion if there is more than one criterion
    if (criteriaWeights.length <= 1) return;
    
    // Remove the criterion
    const filteredCriteria = criteriaWeights.filter(c => c.id !== id);
    
    // Recalculate weights to maintain total of 100
    const equalWeight = Math.floor(100 / filteredCriteria.length);
    const remainder = 100 - (equalWeight * filteredCriteria.length);
    
    // Update weights with equal distribution
    const updatedWeights = filteredCriteria.map((c, index) => ({
      ...c,
      weight: equalWeight + (index < remainder ? 1 : 0)
    }));
    
    setCriteriaWeights(updatedWeights);
  }

  // Function to handle challenge title changes
  const handleChallengeTitle = (id: string, newTitle: string) => {
    setChallenges(challenges.map(c => 
      c.id === id ? { ...c, title: newTitle } : c
    ))
  }
  
  // Function to handle challenge description changes
  const handleChallengeDescription = (id: string, newDescription: string) => {
    setChallenges(challenges.map(c => 
      c.id === id ? { ...c, description: newDescription } : c
    ))
  }
  
  // Function to add a new challenge
  const handleAddChallenge = () => {
    // Find the highest id to ensure unique ids
    const maxId = Math.max(...challenges.map(c => Number(c.id)), 0)
    
    // Add a new challenge with default content
    const newChallenge = {
      id: String(maxId + 1),
      title: "New Challenge",
      description: "Describe the challenge here..."
    }
    
    setChallenges([...challenges, newChallenge])
  }
  
  // Function to delete a challenge
  const handleDeleteChallenge = (id: string) => {
    // Always keep at least one challenge
    if (challenges.length <= 1) return;
    
    // Remove the challenge
    setChallenges(challenges.filter(c => c.id !== id));
  }
  
  // Function to handle prize place change
  const handlePrizePlace = (id: string | undefined, newPlace: string) => {
    if (!id) return;
    setPrizes(prizes.map(p => 
      p.id === id ? { ...p, place: newPlace, description: newPlace } : p
    ));
  };
  
  // Function to handle prize amount change
  const handlePrizeAmount = (id: string | undefined, newAmount: string) => {
    if (!id) return;
    setPrizes(prizes.map(p => 
      p.id === id ? { ...p, amount: parseFloat(newAmount) || 0 } : p
    ));
  };
  
  // Function to add a new prize tier
  const handleAddPrize = () => {
    const maxId = Math.max(...prizes.map(p => Number(p.id)), 0);
    const newPosition = prizes.length + 1;
    const newPrize: Prize = {
      id: String(maxId + 1),
      place: `${newPosition}${getOrdinalSuffix(newPosition)} Place`,
      position: newPosition,
      amount: 100,
      currency: 'AED',
      description: `${newPosition}${getOrdinalSuffix(newPosition)} Place`
    };
    setPrizes([...prizes, newPrize]);
  }
  
  // Function to delete a prize tier
  const handleDeletePrize = (id: string | undefined) => {
    if (!id) return;
    // Always keep at least one prize
    if (prizes.length <= 1) return;
    
    // Remove the prize
    setPrizes(prizes.filter(p => p.id !== id));
  }
  
  // Function to handle prize split selection
  const handlePrizeSplitChange = (option: string) => {
    setPrizeSplitOption(option);
    
    // Update hasTieredPrizes based on the selected option
    setHasTieredPrizes(option !== "none");
    
    if (option !== "none") {
      const totalPrize = parseFloat(prizePool) || 0;
      
      // Update prize distribution based on selected split
      if (option === "standard") {
        // 50-30-20 split
        setPrizes([
          { id: '1', place: '1st Place', position: 1, amount: Math.round(totalPrize * 0.5), currency: 'AED', description: '1st Place' },
          { id: '2', place: '2nd Place', position: 2, amount: Math.round(totalPrize * 0.3), currency: 'AED', description: '2nd Place' },
          { id: '3', place: '3rd Place', position: 3, amount: Math.round(totalPrize * 0.2), currency: 'AED', description: '3rd Place' }
        ]);
      } else if (option === "winner-focused") {
        // 70-20-10 split (more for winner)
        setPrizes([
          { id: '1', place: '1st Place', position: 1, amount: Math.round(totalPrize * 0.7), currency: 'AED', description: '1st Place' },
          { id: '2', place: '2nd Place', position: 2, amount: Math.round(totalPrize * 0.2), currency: 'AED', description: '2nd Place' },
          { id: '3', place: '3rd Place', position: 3, amount: Math.round(totalPrize * 0.1), currency: 'AED', description: '3rd Place' }
        ]);
      } else if (option === "balanced") {
        // 40-30-30 split (more balanced)
        setPrizes([
          { id: '1', place: '1st Place', position: 1, amount: Math.round(totalPrize * 0.4), currency: 'AED', description: '1st Place' },
          { id: '2', place: '2nd Place', position: 2, amount: Math.round(totalPrize * 0.3), currency: 'AED', description: '2nd Place' },
          { id: '3', place: '3rd Place', position: 3, amount: Math.round(totalPrize * 0.3), currency: 'AED', description: '3rd Place' }
        ]);
      } else if (option === "top5") {
        // Top 5 winners
        setPrizes([
          { id: '1', place: '1st Place', position: 1, amount: Math.round(totalPrize * 0.35), currency: 'AED', description: '1st Place' },
          { id: '2', place: '2nd Place', position: 2, amount: Math.round(totalPrize * 0.25), currency: 'AED', description: '2nd Place' },
          { id: '3', place: '3rd Place', position: 3, amount: Math.round(totalPrize * 0.20), currency: 'AED', description: '3rd Place' },
          { id: '4', place: '4th Place', position: 4, amount: Math.round(totalPrize * 0.12), currency: 'AED', description: '4th Place' },
          { id: '5', place: '5th Place', position: 5, amount: Math.round(totalPrize * 0.08), currency: 'AED', description: '5th Place' }
        ]);
      } else if (option === "custom") {
        // Keep current prizes or set default custom
        if (prizes.length === 0) {
          setPrizes([
            { id: '1', place: '1st Place', position: 1, amount: Math.round(totalPrize * 0.5), currency: 'AED', description: '1st Place' },
            { id: '2', place: '2nd Place', position: 2, amount: Math.round(totalPrize * 0.3), currency: 'AED', description: '2nd Place' },
            { id: '3', place: '3rd Place', position: 3, amount: Math.round(totalPrize * 0.2), currency: 'AED', description: '3rd Place' }
          ]);
        }
      }
    }
  };
  
  // Helper function to get ordinal suffix
  const getOrdinalSuffix = (num: number): string => {
    const j = num % 10;
    const k = num % 100;
    
    if (j === 1 && k !== 11) {
      return "st";
    } else if (j === 2 && k !== 12) {
      return "nd";
    } else if (j === 3 && k !== 13) {
      return "rd";
    } else {
      return "th";
    }
  }

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

  const { toast } = useToast()

  // Add error state after other state declarations
  const [formErrors, setFormErrors] = useState<string[]>([]);

  // Update the handleCreateHackathon function
  const handleCreateHackathon = async () => {
    // Create an array to collect all validation errors
    const errors: string[] = [];

    if (!hackathonName || hackathonName.length < 3 || hackathonName.length > 100) {
      errors.push("Title must be between 3 and 100 characters");
    }

    if (!description || description.length < 10) {
      errors.push("Description must be at least 10 characters long");
    }

    if (!dateRange.from || !dateRange.to) {
      errors.push("Please select a date range for your hackathon");
    }

    if (!registrationDeadline) {
      errors.push("Please select a registration deadline");
    }

    if (!selectedPackage) {
      errors.push("Please select a package for your hackathon");
    }

    if (!prizePool || parseFloat(prizePool) <= 0) {
      errors.push("Please enter a valid prize pool amount");
    }

    if (prizes.length === 0) {
      errors.push("Please add at least one prize tier");
    }

    const totalWeight = calculateTotalWeight();
    if (totalWeight !== 100) {
      errors.push(`Judging criteria total weight is ${totalWeight}%. It must equal exactly 100%`);
    }

    // Validate prize amounts don't exceed prize pool
    const totalPrizeAmount = prizes.reduce((sum, prize) => sum + Number(prize.amount), 0);
    if (totalPrizeAmount > parseFloat(prizePool)) {
      errors.push("Total prize amounts cannot exceed the prize pool");
    }

    // Update the form errors state
    setFormErrors(errors);

    // If there are any errors, show them in toast and return
    if (errors.length > 0) {
      toast({
        title: "Please fix the following errors:",
        description: (
          <ul className="list-disc pl-4 mt-2 space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-sm">{error}</li>
            ))}
          </ul>
        ),
        variant: "destructive",
      });
      return;
    }

    // If validation passes, proceed to payment step
    setCreateStepIndex(2);
    setIsProcessingPayment(true);

    try {
      // Create hackathon data object with all required fields
      const hackathonData: HackathonFormData = {
        title: hackathonName,
        description,
        short_description: description.substring(0, 200),
        organization_name: organizationName,
        cover_image: coverImageUrl,
        banner_image: bannerImageUrl,
        organization_logo: organizationLogo,
        dateRange: {
          from: dateRange.from,
          to: dateRange.to
        },
        registrationDeadline: registrationDeadline,
        maxParticipants: selectedMaxParticipants,
        min_team_size: minTeamSize,
        max_team_size: maxTeamSize,
        is_team_required: isTeamRequired,
        package: selectedPackage as 'starter' | 'growth' | 'scale',
        prizePool,
        prizes: prizes.map(prize => ({
          place: prize.place,
          amount: prize.amount.toString(),
          position: prize.position,
          description: prize.description,
          currency: prize.currency
        })),
        judgingCriteria: criteriaWeights.map(criteria => ({
          name: criteria.name,
          weight: criteria.weight,
          description: `${criteria.name} evaluation criteria`
        })),
        challenges: [],
        rules: rulesText,
        requirements: [],
        resources: resources,
        submission_template: submissionTemplate || "",
        isPrivate: false,
        tags: []
      };

      // Send request to create hackathon
      const response = await hackathonApi.createHackathon(hackathonData);
      
      setIsProcessingPayment(false);
      
      // Show success message
      toast({
        title: "Hackathon created!",
        description: "Your hackathon has been created successfully",
        variant: "default"
      });
      
      // Reset form and close dialog
      handleDialogOpenChange(false);
      setCreateStepIndex(0);
      
      // Reset all form fields with default dates
      setHackathonName("");
      setDescription("");
      setCoverImage(null);
      setLogoImage(null);
      setDateRange({
        from: new Date(),
        to: addDays(new Date(), 30),
      });
      setRegistrationDeadline(addDays(new Date(), 14));
      setSelectedMaxParticipants(100);
      setPrizePool("1000");
      setSelectedPackage(null);
      setCriteriaWeights([
        { id: '1', name: 'Innovation', weight: 30, description: 'Evaluating the innovation and creativity of the solution' },
        { id: '2', name: 'Technical Complexity', weight: 30, description: 'Assessing the technical sophistication and implementation' },
        { id: '3', name: 'Impact', weight: 20, description: 'Measuring the potential real-world impact' },
        { id: '4', name: 'Presentation', weight: 20, description: 'Quality of presentation and documentation' }
      ]);
      setPrizes([
        { id: '1', place: '1st Place', position: 1, amount: 500, currency: 'AED', description: '1st Place' },
        { id: '2', place: '2nd Place', position: 2, amount: 300, currency: 'AED', description: '2nd Place' },
        { id: '3', place: '3rd Place', position: 3, amount: 200, currency: 'AED', description: '3rd Place' }
      ]);
      setResources([]);
      setSubmissionTemplate(""); // Use empty string instead of null
      setOrganizationName("");
      setMinTeamSize(1);
      setMaxTeamSize(4);
      setIsTeamRequired(true);
      setCoverImageUrl("");
      setBannerImageUrl("");
      setOrganizationLogo("");

    } catch (error: any) {
      setIsProcessingPayment(false);
      toast({
        title: "Error creating hackathon",
        description: error.response?.data?.detail || "An unexpected error occurred",
        variant: "destructive"
      });
    }
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

  // Add hackathonType state variable after the other useState declarations
  const [hackathonType, setHackathonType] = useState("online");

  // Add new state variables after existing ones
  const [minTeamSize, setMinTeamSize] = useState<number>(1);
  const [maxTeamSize, setMaxTeamSize] = useState<number>(4);
  const [isTeamRequired, setIsTeamRequired] = useState(true);
  const [coverImageUrl, setCoverImageUrl] = useState<string>("");
  const [bannerImageUrl, setBannerImageUrl] = useState<string>("");
  const [organizationLogo, setOrganizationLogo] = useState<string>("");
  const [submissionTemplate, setSubmissionTemplate] = useState<string>("");
  const [resources, setResources] = useState<string[]>([]);
  const [organizationName, setOrganizationName] = useState<string>("");

  // Update the state variables with proper types
  const [maxParticipants, setMaxParticipants] = useState<number>(100);

  // Update the prize pool handler
  const handlePrizePoolChange = (value: string) => {
    setPrizePool(value);
  };

  // Update the team size handlers
  const handleMinTeamSizeChange = (value: string) => {
    setMinTeamSize(parseInt(value) || 1);
  };

  const handleMaxTeamSizeChange = (value: string) => {
    setMaxTeamSize(parseInt(value) || 4);
  };

  const handleMaxParticipantsChange = (value: string) => {
    setMaxParticipants(parseInt(value) || 100);
  };

  // Update the date change handlers
  const handleDateRangeFromChange = (value: string) => {
    const from = value ? new Date(value) : new Date();
    setDateRange(prev => ({ ...prev, from }));
  };

  const handleDateRangeToChange = (value: string) => {
    const to = value ? new Date(value) : addDays(new Date(), 30);
    setDateRange(prev => ({ ...prev, to }));
  };

  const handleRegistrationDeadlineChange = (value: string) => {
    const date = value ? new Date(value) : addDays(new Date(), 14);
    setRegistrationDeadline(date);
  };

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
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full transition-all duration-300 rounded-full",
                            hackathon.status === "Draft" ? "bg-amber-500" :
                            hackathon.status === "Completed" ? "bg-slate-500" :
                            "bg-blue-600"
                          )}
                          style={{ width: `${hackathon.progress}%` }}
                        />
                      </div>
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
        <DialogContent className={`w-full sm:max-w-[95vw] lg:max-w-[90vw] xl:max-w-[85vw] ${createStepIndex === 1 ? "max-h-[90vh] overflow-hidden flex flex-col" : ""}`}>
          <DialogHeader className="flex-shrink-0 px-6">
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
            <div className="py-2 px-6">
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
            <div className="overflow-y-auto py-4 px-6 custom-scrollbar" style={{ 
              maxHeight: 'calc(90vh - 240px)',
              scrollbarWidth: 'thin',
              scrollbarColor: '#e2e8f0 #f8fafc'
            }}>
              {/* Error Summary */}
              {formErrors.length > 0 && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-800 mb-2">
                    <XCircle className="h-5 w-5" />
                    <h4 className="font-medium">Please fix the following errors:</h4>
                  </div>
                  <ul className="list-disc pl-5 space-y-1">
                    {formErrors.map((error, index) => (
                      <li key={index} className="text-sm text-red-700">{error}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="space-y-8 w-full">
                {/* Top Row: Basic Information and Schedule & Capacity side by side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Section 1: Basic Information */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow h-full">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-200">
                      <h3 className="text-base font-semibold text-slate-900 flex items-center">
                        <span className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full inline-flex items-center justify-center mr-2 text-xs shadow-sm border border-blue-200">1</span>
                        Basic Information
                      </h3>
                    </div>
                    <div className="p-6 space-y-5">
                      {/* Hackathon Title */}
                      <div className="grid gap-3">
                        <Label htmlFor="title" className="font-medium text-sm">
                          Hackathon Title <span className="text-red-500">*</span>
                        </Label>
                        <Input 
                          id="title" 
                          placeholder="Enter a title for your hackathon" 
                          className="h-10 focus:border-blue-500 focus:ring-blue-500" 
                          required 
                          value={hackathonName}
                          onChange={(e) => setHackathonName(e.target.value)}
                        />
                      </div>

                      <div className="grid gap-3">
                        <Label htmlFor="description" className="font-medium text-sm">
                          Description <span className="text-red-500">*</span>
                        </Label>
                        <textarea 
                          id="description" 
                          rows={3} 
                          className="min-h-[90px] rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Describe your hackathon in detail including goals, themes, and what participants can expect"
                          required
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>

                      {/* Schedule & Capacity */}
                      <div className="space-y-4 pt-4 border-t border-slate-200">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-slate-600" />
                          <h3 className="text-sm font-medium">Schedule & Capacity</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Date Range Picker */}
                          <div className="space-y-2">
                            <Label htmlFor="date-range" className="text-sm font-medium">Hackathon Dates</Label>
                            <div className="border border-slate-200 rounded-md p-3">
                              {/* Placeholder for DatePickerWithRange */}
                              <div className="flex items-center gap-2">
                                <Input 
                                  type="date" 
                                  value={dateRange.from.toISOString().substring(0, 10)}
                                  onChange={(e) => handleDateRangeFromChange(e.target.value)}
                                  className="h-9"
                                />
                                <span className="text-sm text-slate-500">to</span>
                                <Input 
                                  type="date" 
                                  value={dateRange.to.toISOString().substring(0, 10)}
                                  onChange={(e) => handleDateRangeToChange(e.target.value)}
                                  className="h-9"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Registration Deadline */}
                          <div className="space-y-2">
                            <Label htmlFor="registration-deadline" className="text-sm font-medium">Registration Deadline</Label>
                            <div className="border border-slate-200 rounded-md p-3">
                              {/* Placeholder for DatePicker */}
                              <Input 
                                type="date" 
                                value={registrationDeadline.toISOString().substring(0, 10)}
                                onChange={(e) => handleRegistrationDeadlineChange(e.target.value)}
                                className="h-9 w-full"
                              />
                            </div>
                          </div>

                          {/* Maximum Participants */}
                          <div className="space-y-2">
                            <Label htmlFor="max-participants" className="text-sm font-medium flex items-center justify-between">
                              <span>Max Participants <span className="text-red-500">*</span></span>
                              <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full text-xs">
                                Package Limit: {
                                  selectedPackage === "Growth" ? "100" :
                                  selectedPackage === "Scale" ? "250" : "50"
                                }
                              </span>
                            </Label>
                            <div className="flex items-center">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-10 w-10 rounded-r-none flex items-center justify-center border-indigo-200"
                                onClick={() => setSelectedMaxParticipants(Math.max(10, selectedMaxParticipants - 10))}
                                disabled={selectedMaxParticipants <= 10}
                              >
                                <span className="text-lg">-</span>
                              </Button>
                              <Input
                                id="max-participants"
                                type="number"
                                className="h-10 rounded-none text-center focus:border-indigo-500 focus:ring-indigo-500 border-x-0"
                                value={selectedMaxParticipants}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value);
                                  if (!isNaN(value)) {
                                    // Find the selected package's limit
                                    let limit = 50; // Default for Starter plan
                                    if (selectedPackage === "Growth") limit = 100;
                                    if (selectedPackage === "Scale") limit = 250;
                                    
                                    // Ensure the value doesn't exceed the package limit
                                    setSelectedMaxParticipants(Math.min(limit, Math.max(10, value)));
                                  }
                                }}
                                min="10"
                                max={
                                  selectedPackage === "Growth" ? "100" :
                                  selectedPackage === "Scale" ? "250" : "50"
                                }
                                required
                                style={{ appearance: 'textfield' }}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-10 w-10 rounded-l-none flex items-center justify-center border-indigo-200"
                                onClick={() => {
                                  // Find the selected package's limit
                                  let limit = 50; // Default for Starter plan
                                  if (selectedPackage === "Growth") limit = 100;
                                  if (selectedPackage === "Scale") limit = 250;
                                  
                                  setSelectedMaxParticipants(Math.min(limit, selectedMaxParticipants + 10));
                                }}
                                disabled={
                                  (selectedPackage === "Starter" && selectedMaxParticipants >= 50) ||
                                  (selectedPackage === "Growth" && selectedMaxParticipants >= 100) ||
                                  (selectedPackage === "Scale" && selectedMaxParticipants >= 250)
                                }
                              >
                                <span className="text-lg">+</span>
                              </Button>
                            </div>
                            <p className="text-xs text-slate-500">Select the maximum number of participants</p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="hackathon-type" className="text-sm font-medium">
                              Hackathon Type <span className="text-red-500">*</span>
                            </Label>
                            <Select 
                              value={hackathonType} 
                              onValueChange={setHackathonType}
                            >
                              <SelectTrigger id="hackathon-type" className="h-10">
                                <SelectValue placeholder="Select hackathon type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="online">Online</SelectItem>
                                <SelectItem value="onsite">On-site</SelectItem>
                                <SelectItem value="hybrid">Hybrid</SelectItem>
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-slate-500">Choose how participants will attend</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Schedule & Capacity */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow h-full">
                    <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 px-6 py-4 border-b border-indigo-200">
                      <h3 className="text-base font-semibold text-slate-900 flex items-center">
                        <span className="bg-indigo-100 text-indigo-800 w-6 h-6 rounded-full inline-flex items-center justify-center mr-2 text-xs shadow-sm border border-indigo-200">2</span>
                        Schedule & Capacity
                      </h3>
                    </div>
                    <div className="p-6 space-y-5">
                      <div className="grid gap-3">
                        <Label className="font-medium text-sm">
                          Date Range <span className="text-red-500">*</span>
                        </Label>
                        <div className="border border-slate-200 rounded-md p-3">
                          <div className="flex items-center gap-2">
                            <Input 
                              type="date" 
                              className="h-9"
                              placeholder="Start date"
                            />
                            <span className="text-sm text-slate-500">to</span>
                            <Input 
                              type="date" 
                              className="h-9"
                              placeholder="End date"
                            />
                          </div>
                        </div>
                        <p className="text-xs text-slate-500">Select start and end dates</p>
                      </div>

                      <div className="grid gap-3">
                        <Label className="font-medium text-sm">
                          Registration Deadline <span className="text-red-500">*</span>
                        </Label>
                        <div className="border border-slate-200 rounded-md p-3">
                          <Input 
                            type="date" 
                            className="h-9 w-full"
                            placeholder="Registration deadline"
                          />
                        </div>
                        <p className="text-xs text-slate-500">Set registration deadline</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="prize-split" className="text-sm font-medium block mb-2">Prize Distribution</Label>
                          <Select 
                            value={prizeSplitOption} 
                            onValueChange={handlePrizeSplitChange}
                          >
                            <SelectTrigger id="prize-split" className="h-10">
                              <SelectValue placeholder="Select prize distribution" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No tiered prizes</SelectItem>
                              <SelectItem value="standard">Standard (50/30/20)</SelectItem>
                              <SelectItem value="winner-focused">Winner Focused (70/20/10)</SelectItem>
                              <SelectItem value="balanced">Balanced (40/30/30)</SelectItem>
                              <SelectItem value="top5">Top 5 Winners</SelectItem>
                              <SelectItem value="custom">Custom Distribution</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-slate-500">Choose how to distribute the prize pool</p>
                        </div>
                          
                        <div className="space-y-2">
                          <Label htmlFor="prize-pool" className="text-sm font-medium block mb-2">Prize Pool (AED)</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">AED</span>
                            <Input 
                              id="prize-pool" 
                              type="number" 
                              className="pl-12 h-10" 
                              placeholder="Enter prize amount"
                              value={prizePool}
                              onChange={(e) => {
                                setPrizePool(e.target.value);
                                // Update prize amounts if tiered prizes are enabled
                                if (prizeSplitOption !== "none" && prizeSplitOption !== "custom") {
                                  handlePrizeSplitChange(prizeSplitOption);
                                }
                              }}
                              style={{ appearance: 'textfield' }}
                            />
                          </div>
                          <p className="text-xs text-slate-500">Total prize pool amount</p>
                        </div>
                      </div>
                      
                      {hasTieredPrizes && (
                        <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 space-y-4 mt-4">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium text-slate-800">Prize Distribution</Label>
                            {prizeSplitOption === "custom" && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-7 text-xs"
                                onClick={handleAddPrize}
                              >
                                <PlusCircle className="h-3 w-3 mr-1.5" />
                                Add Prize Tier
                              </Button>
                            )}
                          </div>
                          
                          <div className="space-y-3">
                            {prizes.map((prize) => (
                              <div key={prize.id} className="grid grid-cols-12 gap-3 items-center bg-white rounded-md border border-slate-200 p-3">
                                <div className="col-span-5">
                                  <Label htmlFor={`prize-place-${prize.id}`} className="text-xs mb-1 block">Prize Place</Label>
                                  <Input 
                                    id={`prize-place-${prize.id}`}
                                    value={prize.place}
                                    onChange={(e) => handlePrizePlace(prize.id, e.target.value)}
                                    className="h-9 text-sm"
                                    readOnly={prizeSplitOption !== "custom"}
                                  />
                                </div>
                                <div className="col-span-6 relative">
                                  <Label htmlFor={`prize-amount-${prize.id}`} className="text-xs mb-1 block">Prize Amount</Label>
                                  <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">AED</span>
                                    <Input 
                                      id={`prize-amount-${prize.id}`}
                                      type="number"
                                      value={prize.amount}
                                      onChange={(e) => handlePrizeAmount(prize.id, e.target.value)}
                                      className="h-9 text-sm pl-12"
                                      readOnly={prizeSplitOption !== "custom"}
                                      style={{ appearance: 'textfield' }}
                                    />
                                  </div>
                                </div>
                                <div className="col-span-1 flex items-end justify-end h-full pb-1">
                                  {prizeSplitOption === "custom" && (
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-7 w-7 p-0 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50"
                                      onClick={() => handleDeletePrize(prize.id)}
                                      disabled={prizes.length <= 1}
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="pt-3 border-t border-slate-200 mt-2">
                            <Label htmlFor="participation-prize" className="text-sm font-medium text-slate-800 mb-2 block">Participation Prize/Recognition</Label>
                            <Input 
                              id="participation-prize"
                              value={participationPrize}
                              onChange={(e) => setParticipationPrize(e.target.value)}
                              className="h-9 text-sm"
                              placeholder="e.g., Certificate, Credits, Swag, etc."
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section: Challenges & Rules */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-100 px-6 py-4 border-b border-emerald-200">
                    <h3 className="text-base font-semibold text-slate-900 flex items-center">
                      <span className="bg-emerald-100 text-emerald-800 w-6 h-6 rounded-full inline-flex items-center justify-center mr-2 text-xs shadow-sm border border-emerald-200">3</span>
                      Challenges & Rules
                    </h3>
                  </div>
                  <div className="p-6 space-y-6">
                    {/* Challenges Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="font-medium text-sm">Hackathon Challenges</Label>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 px-3 text-xs bg-slate-50 border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
                          onClick={handleAddChallenge}
                        >
                          <PlusCircle className="h-3.5 w-3.5 mr-1" />
                          Add Challenge
                        </Button>
                      </div>
                      
                      {challenges.map((challenge) => (
                        <div key={challenge.id} className="rounded-lg border border-slate-200 overflow-hidden hover:shadow-sm transition-all">
                          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-800 w-5 h-5 rounded-full inline-flex items-center justify-center text-xs shadow-sm border border-blue-200">{challenge.id}</span>
                                <h4 className="font-medium text-sm">{challenge.title}</h4>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-7 w-7 p-0 rounded-full text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-7 w-7 p-0 rounded-full text-slate-500 hover:text-red-600 hover:bg-red-50"
                                  onClick={() => handleDeleteChallenge(challenge.id)}
                                  disabled={challenges.length <= 1}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="space-y-3">
                              <div>
                                <Label htmlFor={`challenge-title-${challenge.id}`} className="text-xs font-medium text-slate-700 mb-1 block">Challenge Title</Label>
                                <Input 
                                  id={`challenge-title-${challenge.id}`} 
                                  value={challenge.title}
                                  onChange={(e) => handleChallengeTitle(challenge.id, e.target.value)}
                                  className="h-9 text-sm"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`challenge-description-${challenge.id}`} className="text-xs font-medium text-slate-700 mb-1 block">Description</Label>
                                <textarea 
                                  id={`challenge-description-${challenge.id}`} 
                                  rows={2}
                                  className="min-h-[60px] w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                                  value={challenge.description}
                                  onChange={(e) => handleChallengeDescription(challenge.id, e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <div className="pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full border-dashed border-slate-300 text-slate-500 hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50"
                          onClick={handleAddChallenge}
                        >
                          <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
                          Add Another Challenge
                        </Button>
                      </div>
                    </div>

                    {/* Rules Section */}
                    <div className="space-y-4 pt-4 border-t border-slate-200">
                      <div className="flex items-center justify-between">
                        <Label className="font-medium text-sm">Hackathon Rules</Label>
                      </div>
                      <div>
                        <Label htmlFor="rules" className="text-xs font-medium text-slate-700 mb-2 block">
                          Define the rules and guidelines for your hackathon
                        </Label>
                        <textarea 
                          id="rules" 
                          rows={5}
                          className="min-h-[120px] w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                          placeholder="Enter rules, guidelines, judging criteria, and submission requirements for your hackathon..."
                          defaultValue="1. Teams can consist of 1-4 members.
2. All code must be written during the hackathon.
3. You may use open-source libraries and frameworks.
4. Projects will be judged on innovation, technical complexity, design, and impact.
5. Each team must submit their code to GitHub and provide a 3-minute demo video."
                        />
                      </div>
                    </div>

                    {/* Judging Criteria */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Judging Criteria</Label>
                        <Button 
                          type="button"
                          variant="outline" 
                          size="sm" 
                          className="h-7 text-xs"
                          onClick={handleAddCriterion}
                        >
                          <PlusCircle className="h-3 w-3 mr-1.5" />
                          Add Criterion
                        </Button>
                      </div>

                      {/* Weight Warning */}
                      <div className="p-2.5 rounded-md bg-amber-50 border border-amber-200">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                          <div className="text-xs text-amber-800">
                            <p className="font-medium">Total Weight: {calculateTotalWeight()}%</p>
                            {calculateTotalWeight() !== 100 && (
                              <p className="mt-1">
                                {calculateTotalWeight() > 100
                                  ? "The total weight exceeds 100%. Please adjust the values."
                                  : "The total weight is less than 100%. Please adjust the values."}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Criteria List */}
                      <div className="space-y-3">
                        {criteriaWeights.map((criterion) => (
                          <div 
                            key={criterion.id} 
                            className="grid grid-cols-12 gap-3 items-start p-3 rounded-lg border border-slate-200"
                          >
                            <div className="col-span-7 space-y-1.5">
                              <Input
                                className="h-8 text-sm"
                                placeholder="Criterion Name"
                                value={criterion.name}
                                onChange={(e) => handleNameChange(criterion.id, e.target.value)}
                              />
                              <Textarea
                                className="min-h-[60px] text-sm"
                                placeholder="Criterion Description"
                                value={criterion.description}
                                onChange={(e) => handleDescriptionChange(criterion.id, e.target.value)}
                              />
                            </div>
                            <div className="col-span-4">
                              <Label htmlFor={`weight-${criterion.id}`} className="text-xs mb-1 block">Weight (%)</Label>
                              <Input
                                id={`weight-${criterion.id}`}
                                type="number"
                                className="h-8 text-sm"
                                min="0"
                                max="100"
                                value={criterion.weight}
                                onChange={(e) => handleWeightChange(criterion.id, e.target.value)}
                              />
                            </div>
                            <div className="col-span-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50"
                                onClick={() => handleDeleteCriterion(criterion.id)}
                                disabled={criteriaWeights.length <= 1}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Challenges */}
                    <div className="space-y-3 pt-6 border-t border-slate-200 mt-6">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Hackathon Challenges</Label>
                        <Button 
                          type="button"
                          variant="outline" 
                          size="sm" 
                          className="h-7 text-xs"
                          onClick={handleAddChallenge}
                        >
                          <PlusCircle className="h-3 w-3 mr-1.5" />
                          Add Challenge
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {challenges.map((challenge) => (
                          <div 
                            key={challenge.id} 
                            className="grid grid-cols-12 gap-3 items-start p-3 rounded-lg border border-slate-200"
                          >
                            <div className="col-span-11 space-y-1.5">
                              <Input
                                className="h-8 text-sm"
                                placeholder="Challenge Title"
                                value={challenge.title}
                                onChange={(e) => handleChallengeTitle(challenge.id, e.target.value)}
                              />
                              <Textarea
                                className="min-h-[60px] text-sm"
                                placeholder="Challenge Description"
                                value={challenge.description}
                                onChange={(e) => handleChallengeDescription(challenge.id, e.target.value)}
                              />
                            </div>
                            <div className="col-span-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50"
                                onClick={() => handleDeleteChallenge(challenge.id)}
                                disabled={challenges.length <= 1}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Payment Processing */}
          {createStepIndex === 2 && (
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

          <DialogFooter className={createStepIndex === 1 ? "flex-shrink-0 mt-2 border-t pt-4 px-6" : "px-6"}>
            {createStepIndex === 0 && (
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
            )}
            {createStepIndex === 1 && (
              <>
                <Button variant="outline" onClick={handlePreviousStep}>
                  <ChevronRight className="mr-2 h-4 w-4 rotate-180" />
                  Back
                </Button>
                <Button 
                  onClick={handleCreateHackathon} 
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={calculateTotalWeight() !== 100}
                >
                  {calculateTotalWeight() !== 100 ? (
                    <>Judging criteria must total 100%</>
                  ) : (
                    <>
                      Proceed to Payment
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </>
            )}
            {createStepIndex === 2 && (
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
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  )
} 