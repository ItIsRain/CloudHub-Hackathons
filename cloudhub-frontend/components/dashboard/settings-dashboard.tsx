"use client"

import { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { 
  Camera, 
  Mail, 
  MapPin, 
  Phone, 
  Globe, 
  Github, 
  Linkedin, 
  Twitter, 
  Save, 
  Plus, 
  X,
  Bell,
  Lock,
  Palette,
  Languages,
  Moon,
  Sun,
  Shield,
  Key,
  CreditCard,
  UserCog,
  Building2,
  Award,
  Calendar,
  Globe2,
  Sparkles,
  Loader2
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useCallback, memo, useMemo, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { User as UserType } from "@/types/user"
import CountrySelect from '@/components/selects/CountrySelect'
import { useRouter } from 'next/navigation'
import ReactCrop, { Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

const getCountryCodeFromName = (countryName: string): string => {
  const countryMapping: { [key: string]: string } = {
    'United States': 'us',
    'United Kingdom': 'gb',
    'Canada': 'ca',
    'Australia': 'au',
    'Germany': 'de',
    'France': 'fr',
    'Japan': 'jp',
    'India': 'in',
    'China': 'cn',
    'Brazil': 'br',
    'Mexico': 'mx',
    'Spain': 'es',
    'Italy': 'it',
    'Netherlands': 'nl',
    'Sweden': 'se',
    'Norway': 'no',
    'Denmark': 'dk',
    'Finland': 'fi',
    'Switzerland': 'ch',
    'Austria': 'at',
    'Belgium': 'be',
    'Portugal': 'pt',
    'Ireland': 'ie',
    'New Zealand': 'nz',
    'South Korea': 'kr',
    'Singapore': 'sg',
    'United Arab Emirates': 'ae',
    'Saudi Arabia': 'sa',
    'South Africa': 'za',
    'Russia': 'ru',
    'Poland': 'pl',
    'Czech Republic': 'cz',
    'Hungary': 'hu',
    'Greece': 'gr',
    'Turkey': 'tr',
    'Israel': 'il',
    'Egypt': 'eg',
    'Thailand': 'th',
    'Malaysia': 'my',
    'Indonesia': 'id',
    'Philippines': 'ph',
    'Vietnam': 'vn',
    'Argentina': 'ar',
    'Chile': 'cl',
    'Colombia': 'co',
    'Peru': 'pe',
    'Venezuela': 've',
    'Nigeria': 'ng',
    'Kenya': 'ke',
    'Ghana': 'gh',
    'Morocco': 'ma',
    'Tunisia': 'tn',
    'Algeria': 'dz',
    'Pakistan': 'pk',
    'Bangladesh': 'bd',
    'Sri Lanka': 'lk',
    'Nepal': 'np',
    'Myanmar': 'mm',
    'Cambodia': 'kh',
    'Laos': 'la',
    'Mongolia': 'mn',
    'Kazakhstan': 'kz',
    'Uzbekistan': 'uz',
    'Azerbaijan': 'az',
    'Georgia': 'ge',
    'Armenia': 'am',
    'Ukraine': 'ua',
    'Belarus': 'by',
    'Moldova': 'md',
    'Lithuania': 'lt',
    'Latvia': 'lv',
    'Estonia': 'ee',
    'Romania': 'ro',
    'Bulgaria': 'bg',
    'Serbia': 'rs',
    'Croatia': 'hr',
    'Slovenia': 'si',
    'Slovakia': 'sk',
    'Bosnia and Herzegovina': 'ba',
    'Montenegro': 'me',
    'North Macedonia': 'mk',
    'Albania': 'al',
    // Add more mappings as needed
  };
  
  return countryMapping[countryName] || countryName.toLowerCase();
};

const getCountryNameFromCode = (code: string): string => {
  const countryMapping: { [key: string]: string } = {
    'us': 'United States',
    'gb': 'United Kingdom',
    'ca': 'Canada',
    'au': 'Australia',
    'de': 'Germany',
    'fr': 'France',
    'jp': 'Japan',
    'in': 'India',
    'cn': 'China',
    'br': 'Brazil',
    'mx': 'Mexico',
    'es': 'Spain',
    'it': 'Italy',
    'nl': 'Netherlands',
    'se': 'Sweden',
    'no': 'Norway',
    'dk': 'Denmark',
    'fi': 'Finland',
    'ch': 'Switzerland',
    'at': 'Austria',
    'be': 'Belgium',
    'pt': 'Portugal',
    'ie': 'Ireland',
    'nz': 'New Zealand',
    'kr': 'South Korea',
    'sg': 'Singapore',
    'ae': 'United Arab Emirates',
    'sa': 'Saudi Arabia',
    'za': 'South Africa',
    'ru': 'Russia',
    'pl': 'Poland',
    'cz': 'Czech Republic',
    'hu': 'Hungary',
    'gr': 'Greece',
    'tr': 'Turkey',
    'il': 'Israel',
    'eg': 'Egypt',
    'th': 'Thailand',
    'my': 'Malaysia',
    'id': 'Indonesia',
    'ph': 'Philippines',
    'vn': 'Vietnam',
    'ar': 'Argentina',
    'cl': 'Chile',
    'co': 'Colombia',
    'pe': 'Peru',
    've': 'Venezuela',
    'ng': 'Nigeria',
    'ke': 'Kenya',
    'gh': 'Ghana',
    'ma': 'Morocco',
    'tn': 'Tunisia',
    'dz': 'Algeria',
    'pk': 'Pakistan',
    'bd': 'Bangladesh',
    'lk': 'Sri Lanka',
    'np': 'Nepal',
    'mm': 'Myanmar',
    'kh': 'Cambodia',
    'la': 'Laos',
    'mn': 'Mongolia',
    'kz': 'Kazakhstan',
    'uz': 'Uzbekistan',
    'az': 'Azerbaijan',
    'ge': 'Georgia',
    'am': 'Armenia',
    'ua': 'Ukraine',
    'by': 'Belarus',
    'md': 'Moldova',
    'lt': 'Lithuania',
    'lv': 'Latvia',
    'ee': 'Estonia',
    'ro': 'Romania',
    'bg': 'Bulgaria',
    'rs': 'Serbia',
    'hr': 'Croatia',
    'si': 'Slovenia',
    'sk': 'Slovakia',
    'ba': 'Bosnia and Herzegovina',
    'me': 'Montenegro',
    'mk': 'North Macedonia',
    'al': 'Albania'
  };
  
  return countryMapping[code.toLowerCase()] || code;
};

// Add export configuration
export const config = {
  runtime: 'edge',
  unstable_skipMiddlewareUrlNormalize: true,
};

// Add TypeScript interfaces for our component props
interface ProfileInfoCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

interface SkillBadgeProps {
  skill: string;
  onRemove?: (skill: string) => void;
}

interface LanguageItemProps {
  language: string;
  level: string;
  onRemove?: (language: string) => void;
}

interface CertificationProps {
  name: string;
  issuer: string;
  date: string;
}

interface LanguageProps {
  language: string;
  level: string;
}

// Profile Info Card - memoized component
const ProfileInfoCard = memo(({ label, value, icon }: ProfileInfoCardProps) => {
  return (
    <div className="flex items-center gap-4 text-slate-600 p-3 rounded-xl hover:bg-blue-50/50">
      <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>
      <div className="space-y-0.5">
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        <span className="text-sm font-medium">{value}</span>
      </div>
    </div>
  );
});
ProfileInfoCard.displayName = "ProfileInfoCard";

// Skill Badge - memoized component
const SkillBadge = memo(({ skill, onRemove }: SkillBadgeProps) => {
  return (
    <Badge className="flex items-center gap-1.5 bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition-colors px-3 py-1.5 rounded-lg">
      {skill}
      {onRemove && (
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove(skill);
          }} 
          className="ml-1 rounded-full bg-blue-100 p-0.5 hover:bg-blue-200 transition-colors"
          type="button"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </Badge>
  );
});
SkillBadge.displayName = "SkillBadge";

// Language Item - memoized component
const LanguageItem = memo(({ language, level, onRemove }: LanguageItemProps) => {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
          <Globe2 className="h-4 w-4" />
        </div>
        <div>
          <h4 className="font-medium text-slate-900">{language}</h4>
          <p className="text-xs text-slate-500">{level}</p>
        </div>
      </div>
      {onRemove && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 ml-4"
          onClick={() => onRemove(language)}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
});
LanguageItem.displayName = "LanguageItem";

// Certification Badge - memoized component
const CertificationBadge = memo(({ certification, onRemove }: { certification: any, onRemove?: (certification: any) => void }) => {
  return (
    <Badge className="flex items-center gap-1.5 bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition-colors px-3 py-1.5 rounded-lg">
      {certification.name}
      {onRemove && (
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove(certification);
          }} 
          className="ml-1 rounded-full bg-blue-100 p-0.5 hover:bg-blue-200 transition-colors"
          type="button"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </Badge>
  );
});
CertificationBadge.displayName = "CertificationBadge";

// Form schema
const settingsFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  country: z.string().optional(),
  bio: z.string().optional(),
  organization_name: z.string().optional(),
  organization_website: z.string().url("Invalid URL").optional().or(z.literal("")),
  organization_size: z.string().optional(),
  industry: z.string().optional(),
  skills: z.array(z.string()).optional(),
  certifications: z.array(z.object({
    name: z.string(),
    issuer: z.string(),
    date: z.string()
  })).optional(),
  languages: z.array(z.object({
    language: z.string(),
    level: z.string()
  })).optional(),
  social_links: z.object({
    github: z.string().url("Invalid URL").optional().or(z.literal("")),
    linkedin: z.string().url("Invalid URL").optional().or(z.literal("")),
    twitter: z.string().url("Invalid URL").optional().or(z.literal("")),
    website: z.string().url("Invalid URL").optional().or(z.literal(""))
  }).optional()
})

type SettingsFormValues = z.infer<typeof settingsFormSchema>

export default function SettingsDashboard() {
  const { user, updateUser } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isFormInitialized, setIsFormInitialized] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
  const [organizationSize, setOrganizationSize] = useState("")
  const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false)
  const [isCertificationDialogOpen, setIsCertificationDialogOpen] = useState(false)
  const [isLanguageDialogOpen, setIsLanguageDialogOpen] = useState(false)
  const [newSkill, setNewSkill] = useState("")
  const [newCertification, setNewCertification] = useState({
    name: "",
    issuer: "",
    date: ""
  })
  const [newLanguage, setNewLanguage] = useState("")
  const [newLanguageLevel, setNewLanguageLevel] = useState("Intermediate")
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5
  })
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [isCropping, setIsCropping] = useState(false)
  const [croppedImage, setCroppedImage] = useState<File | null>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      full_name: user?.full_name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      country: user?.country || "",
      bio: user?.bio || "",
      organization_name: user?.organization_name || "",
      organization_website: user?.organization_website || "",
      skills: user?.skills || [],
      languages: user?.languages || [],
      certifications: user?.certifications || [],
      social_links: {
        github: user?.social_links?.github || "",
        linkedin: user?.social_links?.linkedin || "",
        twitter: user?.social_links?.twitter || "",
        website: user?.social_links?.website || user?.organization_website || ""
      }
    }
  })

  // Initialize form with user data
  useEffect(() => {
    if (!user || isFormInitialized) {
      return
    }

    form.reset({
      full_name: user.full_name || "",
      email: user.email || "",
      phone: user.phone || "",
      country: user.country || "",
      bio: user.bio || "",
      organization_name: user.organization_name || "",
      organization_website: user.organization_website || "",
      skills: user.skills || [],
      languages: user.languages || [],
      certifications: user.certifications || [],
      social_links: {
        github: user.social_links?.github || "",
        linkedin: user.social_links?.linkedin || "",
        twitter: user.social_links?.twitter || "",
        website: user.social_links?.website || user.organization_website || ""
      }
    })

    if (user.organization_size) {
      setOrganizationSize(user.organization_size)
    }

    setIsFormInitialized(true)
  }, [user, form, isFormInitialized])

  // Reset initialization when user changes (logout/login)
  useEffect(() => {
    if (!user) {
      setIsFormInitialized(false)
    }
  }, [user])

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value)
  }, [])

  const handleSkillRemove = async (removedSkill: string) => {
    try {
      if (!user?.skills) return
      
      const filteredSkills = user.skills.filter(s => s !== removedSkill)
      setIsLoading(true)
      
      const result = await updateUser({ skills: filteredSkills })
      
      toast({
        title: "Skill removed",
        description: "The skill has been removed from your profile.",
      })
      
      if (result && result.skills) {
        form.setValue('skills', result.skills)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove skill. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCertificationRemove = async (removedCert: any) => {
    try {
      if (!user?.certifications) return
      
      const filteredCerts = user.certifications.filter(c => c.name !== removedCert.name)
      setIsLoading(true)
      
      const result = await updateUser({ certifications: filteredCerts })
      
      toast({
        title: "Certification removed",
        description: "The certification has been removed from your profile.",
      })
      
      if (result && result.certifications) {
        form.setValue('certifications', result.certifications)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove certification. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLanguageRemove = async (removedLang: any) => {
    try {
      if (!user?.languages) return
      
      const filteredLangs = user.languages.filter(l => l.language !== removedLang.language)
      setIsLoading(true)
      
      const result = await updateUser({ languages: filteredLangs })
      
      toast({
        title: "Language removed",
        description: "The language has been removed from your profile.",
      })
      
      if (result && result.languages) {
        form.setValue('languages', result.languages)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove language. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleSkillDialog = useCallback((isOpen: boolean) => {
    setIsSkillDialogOpen(isOpen)
    if (!isOpen) setNewSkill("")
  }, [])

  const toggleCertificationDialog = useCallback((isOpen: boolean) => {
    setIsCertificationDialogOpen(isOpen)
    if (!isOpen) setNewCertification({ name: "", issuer: "", date: "" })
  }, [])

  const toggleLanguageDialog = useCallback((isOpen: boolean) => {
    setIsLanguageDialogOpen(isOpen)
    if (!isOpen) {
      setNewLanguage("")
      setNewLanguageLevel("Intermediate")
    }
  }, [])

  const onSubmit = async (data: SettingsFormValues) => {
    if (!user) return

    try {
      setIsLoading(true)
      
      const updateData = {
        name: data.full_name,
        phone: data.phone,
        country: data.country,
        bio: data.bio,
        organization_name: data.organization_name,
        organization_website: data.organization_website,
        organization_size: organizationSize || data.organization_size,
        industry: data.industry,
        skills: data.skills || [],
        certifications: data.certifications || [],
        languages: data.languages || [],
        social_links: data.social_links
      }
      
      const updatedUser = await updateUser(updateData)
      
      if (updatedUser) {
        const frontendUserData = {
          ...updatedUser,
          full_name: updatedUser.name,
          name: updatedUser.name
        }
        form.reset(frontendUserData, { keepDirty: false })
      }
      
      toast({
        title: "Settings updated",
        description: "Your settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveChanges = () => {
    console.log('Form is dirty:', form.formState.isDirty);
    console.log('Current form values:', form.getValues());
    form.handleSubmit(onSubmit)();
  }

  const handleAddSkill = useCallback(async () => {
    if (!newSkill.trim()) return

    try {
      const currentSkills = user?.skills || []
      
      if (currentSkills.includes(newSkill.trim())) {
        toast({
          title: "Skill already exists",
          description: "This skill has already been added to your profile.",
          variant: "destructive",
        })
        return
      }
      
      const updatedSkills = [...currentSkills, newSkill.trim()]
      const result = await updateUser({ skills: updatedSkills })
      
      toast({
        title: "Skill added",
        description: "Your skill has been added successfully.",
      })
      
      setNewSkill("")
      setIsSkillDialogOpen(false)
      
      if (result && result.skills) {
        form.setValue('skills', result.skills)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add skill. Please try again.",
        variant: "destructive",
      })
    }
  }, [newSkill, user, updateUser, toast, form])

  const handleAddCertification = useCallback(async () => {
    if (!newCertification.name.trim() || !newCertification.issuer.trim() || !newCertification.date) return

    try {
      const currentCertifications = user?.certifications || []
      
      if (currentCertifications.some(cert => cert.name === newCertification.name.trim())) {
        toast({
          title: "Certification already exists",
          description: "This certification has already been added to your profile.",
          variant: "destructive",
        })
        return
      }
      
      const updatedCertifications = [...currentCertifications, newCertification]
      const result = await updateUser({ certifications: updatedCertifications })
      
      toast({
        title: "Certification added",
        description: "Your certification has been added successfully.",
      })
      
      setNewCertification({ name: "", issuer: "", date: "" })
      setIsCertificationDialogOpen(false)
      
      if (result && result.certifications) {
        form.setValue('certifications', result.certifications)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add certification. Please try again.",
        variant: "destructive",
      })
    }
  }, [newCertification, user, updateUser, toast, form])

  const handleAddLanguage = useCallback(async () => {
    if (!newLanguage.trim()) return

    try {
      const currentLanguages = user?.languages || []
      
      if (currentLanguages.some(lang => lang.language === newLanguage.trim())) {
        toast({
          title: "Language already exists",
          description: "This language has already been added to your profile.",
          variant: "destructive",
        })
        return
      }
      
      const updatedLanguages = [...currentLanguages, { language: newLanguage.trim(), level: newLanguageLevel }]
      const result = await updateUser({ languages: updatedLanguages })
      
      toast({
        title: "Language added",
        description: "Your language has been added successfully.",
      })
      
      setNewLanguage("")
      setNewLanguageLevel("Intermediate")
      setIsLanguageDialogOpen(false)
      
      if (result && result.languages) {
        form.setValue('languages', result.languages)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add language. Please try again.",
        variant: "destructive",
      })
    }
  }, [newLanguage, newLanguageLevel, user, updateUser, toast, form])

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPEG, PNG, GIF, or WebP image.",
          variant: "destructive",
        })
        return
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB.",
          variant: "destructive",
        })
        return
      }

      // Create a URL for the image
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        setImageSrc(reader.result as string)
        setIsCropping(true)
      })
      reader.readAsDataURL(file)
    }
  }

  const getCroppedImg = async (image: HTMLImageElement, crop: Crop): Promise<File> => {
    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    canvas.width = crop.width
    canvas.height = crop.height
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('No 2d context')
    }

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
    )

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'))
          return
        }
        const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' })
        resolve(file)
      }, 'image/jpeg')
    })
  }

  const handleCropComplete = async () => {
    if (imageRef.current && crop) {
      try {
        const croppedImageFile = await getCroppedImg(imageRef.current, crop)
        setCroppedImage(croppedImageFile)
        setIsCropping(false)
        setImageSrc(null)
        
        // Now upload the cropped image
        await handleImageUpload(croppedImageFile)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to crop image. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true)

      // Create FormData
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'profile-pictures')

      // Upload to backend
      const accessToken = localStorage.getItem('access_token');
      const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json()
        throw new Error(errorData.detail || 'Upload failed')
      }

      const data = await uploadResponse.json()

      if (data.file?.success) {
        // Update user profile with new avatar URL
        const result = await updateUser({ avatar: data.file.url })
        
        if (result) {
          toast({
            title: "Profile picture updated",
            description: "Your profile picture has been updated successfully.",
          })
        }
      } else {
        throw new Error(data.file?.error || 'Upload failed')
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // Memoize dialog content to prevent re-rendering
  const skillDialogContent = useMemo(() => (
    <div className="p-4">
      <div className="relative py-4 px-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 -m-4 mb-4">
        <DialogTitle className="text-xl font-bold text-white flex items-center">
          <Award className="h-5 w-5 mr-2" />
          Add Skill
        </DialogTitle>
        <DialogDescription className="text-blue-100 mt-1">
          Add a new technical or professional skill to your profile
        </DialogDescription>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="skillName">Skill Name</Label>
          <Input 
            id="skillName" 
            value={newSkill} 
            onChange={(e) => setNewSkill(e.target.value)} 
            placeholder="e.g. React, Project Management, JavaScript..." 
            className="bg-white border-slate-200"
          />
        </div>
      </div>
      <DialogFooter className="flex gap-3 border-t border-slate-100 mt-4 pt-4">
        <Button 
          variant="outline"
          className="flex-1 border-slate-200 rounded-xl hover:bg-slate-50"
          onClick={() => toggleSkillDialog(false)}
        >
          Cancel
        </Button>
        <Button 
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md rounded-xl"
          disabled={!newSkill.trim()}
          onClick={handleAddSkill}
        >
          Add Skill
        </Button>
      </DialogFooter>
    </div>
  ), [newSkill, handleAddSkill, toggleSkillDialog])

  const certificationDialogContent = useMemo(() => (
    <div className="p-4">
      <div className="relative py-4 px-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 -m-4 mb-4">
        <DialogTitle className="text-xl font-bold text-white flex items-center">
          <Award className="h-5 w-5 mr-2" />
          Add Certification
        </DialogTitle>
        <DialogDescription className="text-blue-100 mt-1">
          Add details about your professional certifications
        </DialogDescription>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="certName">Certification Name</Label>
          <Input 
            id="certName" 
            value={newCertification.name} 
            onChange={(e) => setNewCertification(prev => ({ ...prev, name: e.target.value }))} 
            placeholder="e.g. AWS Certified Solutions Architect" 
            className="bg-white border-slate-200"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="certIssuer">Issuing Organization</Label>
          <Input 
            id="certIssuer" 
            value={newCertification.issuer}
            onChange={(e) => setNewCertification(prev => ({ ...prev, issuer: e.target.value }))}
            placeholder="e.g. Amazon Web Services" 
            className="bg-white border-slate-200"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="certDate">Issued Date</Label>
          <Input 
            id="certDate" 
            type="date"
            value={newCertification.date}
            onChange={(e) => setNewCertification(prev => ({ ...prev, date: e.target.value }))}
            className="bg-white border-slate-200"
          />
        </div>
      </div>
      <DialogFooter className="flex gap-3 border-t border-slate-100 mt-4 pt-4">
        <Button 
          variant="outline"
          className="flex-1 border-slate-200 rounded-xl hover:bg-slate-50"
          onClick={() => toggleCertificationDialog(false)}
        >
          Cancel
        </Button>
        <Button 
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md rounded-xl"
          disabled={!newCertification.name.trim() || !newCertification.issuer.trim() || !newCertification.date}
          onClick={handleAddCertification}
        >
          Add Certification
        </Button>
      </DialogFooter>
    </div>
  ), [newCertification, handleAddCertification, toggleCertificationDialog])

  const languageDialogContent = useMemo(() => (
    <div className="p-4">
      <div className="relative py-4 px-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 -m-4 mb-4">
        <DialogTitle className="text-xl font-bold text-white flex items-center">
          <Globe className="h-5 w-5 mr-2" />
          Add Language
        </DialogTitle>
        <DialogDescription className="text-blue-100 mt-1">
          Add a language to your profile
        </DialogDescription>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Input 
            id="language" 
            value={newLanguage}
            onChange={(e) => setNewLanguage(e.target.value)}
            placeholder="e.g. Spanish" 
            className="bg-white border-slate-200"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="language-level">Proficiency Level</Label>
          <Select 
            value={newLanguageLevel} 
            onValueChange={setNewLanguageLevel}
          >
            <SelectTrigger className="bg-white border-slate-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Native">Native</SelectItem>
              <SelectItem value="Fluent">Fluent</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Basic">Basic</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter className="flex gap-3 border-t border-slate-100 mt-4 pt-4">
        <Button
          variant="outline"
          className="flex-1 border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-200"
          onClick={() => toggleLanguageDialog(false)}
        >
          Cancel
        </Button>
        <Button 
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md rounded-xl"
          disabled={!newLanguage.trim()}
          onClick={handleAddLanguage}
        >
          Add Language
        </Button>
      </DialogFooter>
    </div>
  ), [newLanguage, newLanguageLevel, handleAddLanguage, toggleLanguageDialog])

  if (!user || !isFormInitialized) {
    return (
      <div className="flex items-center justify-center min-h-[600px] px-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-slate-700">Loading Settings</h3>
          <p className="text-slate-500">
            Loading user data...
          </p>
        </div>
      </div>
    )
  }

  // Show access denied only if no user
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[600px] px-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-700">Access Denied</h3>
          <p className="text-slate-500">Please log in to view your settings.</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-6 pb-6">
      <div className="space-y-6">
      {/* Background Pattern - Simplified */}
      <div className="absolute inset-0 bg-grid-slate-200/40 pointer-events-none"></div>
      
      {/* Banner Card - Simplified */}
      <div className="relative rounded-2xl overflow-hidden shadow-md z-10">
        <div className="relative py-8 px-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600"></div>
          
          <div className="relative z-10 flex flex-col max-w-3xl">
            <div className="inline-flex items-center space-x-2 mb-6 px-3 py-1 rounded-full bg-white/10 border border-white/20 w-fit">
              <Sparkles className="h-3.5 w-3.5 text-blue-100" />
              <span className="text-xs font-medium text-blue-50">Personal Dashboard</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white">
              Settings <span className="text-blue-200">& Preferences</span>
            </h1>
            <p className="text-blue-100 mt-2 max-w-2xl text-sm md:text-base mb-6">
              Customize your profile, manage your skills, and update your personal information
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-8 z-10">
        {/* Profile Card - Simplified */}
        <Card className="border-none shadow-md rounded-3xl overflow-hidden bg-white/80">
          <CardHeader className="border-b border-slate-100 bg-white px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-semibold text-blue-600">Profile</CardTitle>
                <CardDescription className="text-slate-600 mt-1">Your personal information and photo</CardDescription>
              </div>
                <Button 
                  type="submit"
                  disabled={isLoading || !form.formState.isDirty}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-10 px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-start gap-12">
              {/* Profile Section - Updated Design */}
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="relative group">
                  <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                    <AvatarImage src={user?.avatar || '/placeholder-avatar.png'} alt={user?.name || 'User'} />
                    <AvatarFallback className="text-2xl">{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={onFileChange}
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    className="hidden"
                  />
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 group-hover:scale-110"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent form submission
                      e.stopPropagation(); // Stop event bubbling
                      fileInputRef.current?.click();
                    }}
                    disabled={isUploading}
                    type="button" // Explicitly set type to button
                  >
                    {isUploading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Camera className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-slate-900">{user?.name}</h3>
                  <p className="text-sm text-slate-500">{user?.full_name || user?.name}</p>
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium">
                    {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'No role'}
                  </div>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 md:mt-0">
                  <ProfileInfoCard 
                    label="Email" 
                    value={user?.email || 'No email'} 
                    icon={<Mail className="h-5 w-5" />} 
                  />
                  <ProfileInfoCard 
                    label="Phone" 
                    value={user?.phone || 'No phone'} 
                    icon={<Phone className="h-5 w-5" />} 
                  />
                  <ProfileInfoCard 
                    label="Location" 
                    value={user?.country ? getCountryNameFromCode(user.country) : 'No location'} 
                    icon={<MapPin className="h-5 w-5" />} 
                  />
                  <ProfileInfoCard 
                    label="Company" 
                    value={user?.organization_name || 'No company'} 
                    icon={<Building2 className="h-5 w-5" />} 
                  />
                  <ProfileInfoCard 
                    label="Website" 
                    value={user?.social_links?.website || user?.organization_website || 'No website'} 
                    icon={<Globe className="h-5 w-5" />} 
                  />
                  <ProfileInfoCard 
                    label="Role" 
                    value={(user?.role && user.role.charAt(0).toUpperCase() + user.role.slice(1)) || 'No role'} 
                    icon={<UserCog className="h-5 w-5" />} 
                  />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Settings - Simplified */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="w-full bg-white/80 p-1.5 rounded-2xl border border-slate-200/70 shadow-md mb-6">
            <TabsTrigger 
              value="personal" 
              className="flex items-center gap-2 flex-1 text-sm font-medium py-3 px-4 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl transition-colors"
            >
              <UserCog className="h-4 w-4" />
              Personal Info
            </TabsTrigger>
            <TabsTrigger 
              value="skills" 
              className="flex items-center gap-2 flex-1 text-sm font-medium py-3 px-4 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl transition-colors"
            >
              <Award className="h-4 w-4" />
              Skills
            </TabsTrigger>
            <TabsTrigger 
              value="social" 
              className="flex items-center gap-2 flex-1 text-sm font-medium py-3 px-4 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl transition-colors"
            >
              <Globe2 className="h-4 w-4" />
              Social Links
            </TabsTrigger>
          </TabsList>

          <div>
            {/* Personal Info Tab */}
            <TabsContent value="personal" className="space-y-6">
              <Card className="border-none shadow-md rounded-3xl overflow-hidden bg-white/80">
                <CardHeader className="border-b border-slate-100 bg-white px-8 py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-semibold text-blue-600">Personal Information</CardTitle>
                      <CardDescription className="text-slate-600 mt-1">Update your personal details</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-8 py-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                          id="full_name"
                          {...form.register("full_name")}
                          placeholder="Enter your full name"
                          className="bg-white"
                        />
                        {form.formState.errors.full_name && (
                          <p className="text-sm text-red-500">
                            {form.formState.errors.full_name.message}
                          </p>
                        )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          {...form.register("email")}
                          disabled
                          className="bg-slate-50"
                        />
                        <p className="text-xs text-slate-500">
                          Email cannot be changed
                        </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          {...form.register("phone")}
                          placeholder="Enter your phone number"
                          className="bg-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="country">Country</Label>
                        <div className="relative">
                          <div className="h-10">
                            <CountrySelect 
                              value={form.watch("country") || ""}
                              onValueChange={(value) => {
                                form.setValue('country', value, { shouldDirty: true });
                              }}
                              placeholder="Select your country"
                            />
                          </div>
                        </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          {...form.register("bio")}
                          placeholder="Tell us about yourself"
                          className="bg-white min-h-[100px] resize-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="organization_name">Organization Name</Label>
                        <Input
                          id="organization_name"
                          {...form.register("organization_name")}
                          placeholder="Enter your organization name"
                          className="bg-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="organization_website">Organization Website</Label>
                        <Input
                          id="organization_website"
                          {...form.register("organization_website")}
                          placeholder="Enter your organization website"
                          className="bg-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="organization_size">Organization Size</Label>
                        <div className="h-10">
                          <Select
                            defaultValue={user?.organization_size || ""}
                            value={organizationSize || user?.organization_size || ""}
                            onValueChange={(value) => {
                              console.log('Setting organization size to:', value);
                              setOrganizationSize(value);
                              form.setValue("organization_size", value, { shouldDirty: true });
                            }}
                          >
                            <SelectTrigger className="h-10 bg-white border-slate-200">
                              <SelectValue>
                                {organizationSize || user?.organization_size ? `${organizationSize || user?.organization_size} employees` : "Select size"}
                              </SelectValue>
                        </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1-10">1-10 employees</SelectItem>
                              <SelectItem value="11-50">11-50 employees</SelectItem>
                              <SelectItem value="51-200">51-200 employees</SelectItem>
                              <SelectItem value="201-500">201-500 employees</SelectItem>
                              <SelectItem value="501+">501+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                        <Label htmlFor="industry">Industry</Label>
                        <Select
                          value={user?.industry || form.watch("industry") || ""}
                          onValueChange={(value) => {
                            console.log('Setting industry to:', value);
                            form.setValue("industry", value, { shouldDirty: true });
                          }}
                        >
                          <SelectTrigger className="h-10 bg-white border-slate-200">
                            <SelectValue placeholder="Select your industry" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technology">Technology</SelectItem>
                            <SelectItem value="healthcare">Healthcare</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="manufacturing">Manufacturing</SelectItem>
                            <SelectItem value="retail">Retail</SelectItem>
                            <SelectItem value="media">Media & Entertainment</SelectItem>
                            <SelectItem value="transportation">Transportation</SelectItem>
                            <SelectItem value="energy">Energy</SelectItem>
                            <SelectItem value="construction">Construction</SelectItem>
                            <SelectItem value="agriculture">Agriculture</SelectItem>
                            <SelectItem value="telecommunications">Telecommunications</SelectItem>
                            <SelectItem value="hospitality">Hospitality</SelectItem>
                            <SelectItem value="real_estate">Real Estate</SelectItem>
                            <SelectItem value="legal">Legal Services</SelectItem>
                            <SelectItem value="consulting">Consulting</SelectItem>
                            <SelectItem value="non_profit">Non-Profit</SelectItem>
                            <SelectItem value="government">Government</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                  </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Skills Tab */}
            <TabsContent value="skills" className="space-y-6">
              <Card className="border-none shadow-lg rounded-3xl overflow-hidden backdrop-blur-sm bg-white/80">
                <CardHeader className="border-b border-slate-100 bg-white/60 px-8 py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Skills & Expertise</CardTitle>
                      <CardDescription className="text-slate-600 mt-1">Add your skills and professional expertise</CardDescription>
                    </div>
                        <Button 
                          type="submit"
                          disabled={isLoading || !form.formState.isDirty}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm hover:shadow-md transition-all duration-200"
                          onClick={handleSaveChanges}
                        >
                          {isLoading ? (
                            <>
                              <span className="animate-spin mr-2">⏳</span>
                              Saving...
                            </>
                          ) : (
                            <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                            </>
                          )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="px-8 py-6 space-y-6">
                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-slate-700">Technical Skills</Label>
                    <div className="flex flex-wrap gap-2">
                      {/* Use form.watch("skills") instead of user?.skills */}
                      {(form.watch("skills") || []).map((skill, index) => (
                        <SkillBadge 
                          key={`${skill}-${index}`} // Better key to ensure proper re-rendering
                          skill={skill} 
                          onRemove={handleSkillRemove} 
                        />
                      ))}
                      <Dialog open={isSkillDialogOpen} onOpenChange={toggleSkillDialog}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="rounded-lg h-8 gap-1 text-sm border-dashed border-slate-300 hover:border-blue-300 hover:text-blue-600 text-slate-500">
                            <Plus className="h-3.5 w-3.5" />
                            Add Skill
                          </Button>
                        </DialogTrigger>
                          <DialogContent className="p-0 overflow-hidden border-none shadow-xl rounded-2xl bg-white">
                          {skillDialogContent}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-slate-700">Professional Certifications</Label>
                    <div className="flex flex-wrap gap-2">
                        {(form.watch("certifications") || []).map((cert: any, index) => (
                          <CertificationBadge 
                            key={`${cert.name}-${index}`}
                            certification={cert} 
                            onRemove={handleCertificationRemove} 
                          />
                      ))}
                      <Dialog open={isCertificationDialogOpen} onOpenChange={toggleCertificationDialog}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="rounded-lg h-8 gap-1 text-sm border-dashed border-slate-300 hover:border-blue-300 hover:text-blue-600 text-slate-500">
                            <Plus className="h-3.5 w-3.5" />
                            Add Certification
                          </Button>
                        </DialogTrigger>
                          <DialogContent className="p-0 overflow-hidden border-none shadow-xl rounded-2xl bg-white">
                          {certificationDialogContent}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-slate-700">Languages</Label>
                    <div className="flex flex-wrap gap-2">
                        {(form.watch("languages") || []).map((lang: any, index) => (
                          <Badge 
                            key={`${lang.language}-${index}`}
                            className="flex items-center gap-1.5 bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition-colors px-3 py-1.5 rounded-lg"
                          >
                            {lang.language} ({lang.level})
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleLanguageRemove(lang);
                              }} 
                              className="ml-1 rounded-full bg-blue-100 p-0.5 hover:bg-blue-200 transition-colors"
                              type="button"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                      ))}
                      <Dialog open={isLanguageDialogOpen} onOpenChange={toggleLanguageDialog}>
                        <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="rounded-lg h-8 gap-1 text-sm border-dashed border-slate-300 hover:border-blue-300 hover:text-blue-600 text-slate-500">
                              <Plus className="h-3.5 w-3.5" />
                              Add Language
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="p-0 overflow-hidden border-none shadow-xl rounded-2xl bg-white">
                            {languageDialogContent}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Social Links Tab */}
            <TabsContent value="social" className="space-y-6">
              <Card className="border-none shadow-lg rounded-3xl overflow-hidden backdrop-blur-sm bg-white/80">
                <CardHeader className="border-b border-slate-100 bg-white/60 px-8 py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Social Profiles</CardTitle>
                      <CardDescription className="text-slate-600 mt-1">Connect your social media accounts</CardDescription>
                    </div>
                      <Button 
                        type="submit"
                        disabled={isLoading || !form.formState.isDirty}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm hover:shadow-md transition-all duration-200"
                        onClick={handleSaveChanges}
                      >
                        {isLoading ? (
                          <>
                            <span className="animate-spin mr-2">⏳</span>
                            Saving...
                          </>
                        ) : (
                          <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                          </>
                        )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="px-8 py-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-slate-600" />
                        <Label htmlFor="website">Website</Label>
                      </div>
                      <Input 
                        id="website" 
                        {...form.register("social_links.website")}
                        placeholder="https://yourwebsite.com"
                        className="bg-white border-slate-200" 
                      />
                      {form.formState.errors.social_links?.website && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.social_links.website.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Github className="h-4 w-4 text-slate-600" />
                        <Label htmlFor="github">GitHub</Label>
                      </div>
                      <Input 
                        id="github" 
                        {...form.register("social_links.github")}
                        placeholder="https://github.com/username"
                        className="bg-white border-slate-200" 
                      />
                      {form.formState.errors.social_links?.github && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.social_links.github.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Linkedin className="h-4 w-4 text-slate-600" />
                        <Label htmlFor="linkedin">LinkedIn</Label>
                      </div>
                      <Input 
                        id="linkedin" 
                        {...form.register("social_links.linkedin")}
                        placeholder="https://linkedin.com/in/username"
                        className="bg-white border-slate-200" 
                      />
                      {form.formState.errors.social_links?.linkedin && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.social_links.linkedin.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Twitter className="h-4 w-4 text-slate-600" />
                        <Label htmlFor="twitter">Twitter</Label>
                      </div>
                      <Input 
                        id="twitter" 
                        {...form.register("social_links.twitter")}
                        placeholder="https://twitter.com/username"
                        className="bg-white border-slate-200" 
                      />
                      {form.formState.errors.social_links?.twitter && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.social_links.twitter.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <Separator className="my-4" />
                  
                  <div className="space-y-4">
                    <h3 className="font-medium text-slate-900">Profile Visibility</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between bg-gradient-to-r from-slate-50 to-white p-3 rounded-xl border border-slate-100 hover:border-blue-100 transition-all duration-200">
                        <div className="space-y-0.5">
                          <div className="text-sm font-medium">Public profile</div>
                          <div className="text-xs text-slate-500">Make your profile visible to everyone</div>
                        </div>
                        <Checkbox 
                          id="public-profile" 
                          className="h-5 w-5 rounded-md border-slate-300 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-600 data-[state=checked]:to-indigo-600 data-[state=checked]:shadow-sm transition-all duration-200"
                          defaultChecked
                        />
                      </div>
                      
                      <div className="flex items-center justify-between bg-gradient-to-r from-slate-50 to-white p-3 rounded-xl border border-slate-100 hover:border-blue-100 transition-all duration-200">
                        <div className="space-y-0.5">
                          <div className="text-sm font-medium">Show email address</div>
                          <div className="text-xs text-slate-500">Allow others to see your email</div>
                        </div>
                        <Checkbox 
                          id="show-email" 
                          className="h-5 w-5 rounded-md border-slate-300 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-600 data-[state=checked]:to-indigo-600 data-[state=checked]:shadow-sm transition-all duration-200"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between bg-gradient-to-r from-slate-50 to-white p-3 rounded-xl border border-slate-100 hover:border-blue-100 transition-all duration-200">
                        <div className="space-y-0.5">
                          <div className="text-sm font-medium">Show phone number</div>
                          <div className="text-xs text-slate-500">Allow others to see your phone number</div>
                        </div>
                        <Checkbox 
                          id="show-phone" 
                          className="h-5 w-5 rounded-md border-slate-300 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-600 data-[state=checked]:to-indigo-600 data-[state=checked]:shadow-sm transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
      
      {/* Add the cropping modal */}
      <Dialog open={isCropping} onOpenChange={setIsCropping}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-xl rounded-2xl bg-white">
          <div className="p-4">
            <div className="relative py-4 px-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 -m-4 mb-4">
              <DialogTitle className="text-xl font-bold text-white flex items-center">
                <Camera className="h-5 w-5 mr-2" />
                Crop Profile Picture
              </DialogTitle>
              <DialogDescription className="text-blue-100 mt-1">
                Adjust the crop area to get the perfect profile picture
              </DialogDescription>
            </div>
            
            <div className="space-y-4">
              {imageSrc && (
                <div className="max-h-[400px] overflow-auto">
                  <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    aspect={1}
                    className="max-w-full"
                  >
                    <img
                      ref={imageRef}
                      src={imageSrc}
                      alt="Crop preview"
                      className="max-w-full"
                    />
                  </ReactCrop>
                </div>
              )}
            </div>
            
            <DialogFooter className="flex gap-3 border-t border-slate-100 mt-4 pt-4">
              <Button
                variant="outline"
                className="flex-1 border-slate-200 rounded-xl hover:bg-slate-50"
                onClick={() => {
                  setIsCropping(false)
                  setImageSrc(null)
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md rounded-xl"
                onClick={handleCropComplete}
              >
                Apply Crop
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </form>
  )
} 