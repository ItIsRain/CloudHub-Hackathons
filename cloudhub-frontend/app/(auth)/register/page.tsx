"use client";

import { useState, useMemo, useCallback, useRef, Suspense, lazy, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { 
  ChevronLeft, 
  ChevronRight, 
  User, 
  Building, 
  Mail, 
  Lock, 
  Check, 
  Github,
  Eye,
  EyeOff,
  MapPin,
  Phone,
  Briefcase,
  Calendar,
  Globe,
  CreditCard,
  GraduationCap,
  ShieldCheck,
  Circle,
  Link2,
  CheckCircle2,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { authAPI } from '@/lib/api/auth';
import type { TokenResponse } from '@/lib/api/auth';
import { toast } from 'sonner';
import CountrySelect from '@/components/selects/CountrySelect';
import CountryCodeSelect from '@/components/selects/CountryCodeSelect';
import ExperienceLevelSelect from '@/components/selects/ExperienceLevelSelect';

type UserRole = 'participant' | 'organizer';

// Constants moved outside component
const STEPS = [
  { title: "Account Type", description: "Choose your account type" },
  { title: "Personal Info", description: "Basic account details" },
  { title: "Profile Setup", description: "Professional details" },
  { title: "Complete", description: "Finalize registration" }
];

// Country options for select
const countries = [
  { value: "af", label: "Afghanistan" },
  { value: "al", label: "Albania" },
  { value: "dz", label: "Algeria" },
  { value: "ad", label: "Andorra" },
  { value: "ao", label: "Angola" },
  { value: "ag", label: "Antigua and Barbuda" },
  { value: "ar", label: "Argentina" },
  { value: "am", label: "Armenia" },
  { value: "au", label: "Australia" },
  { value: "at", label: "Austria" },
  { value: "az", label: "Azerbaijan" },
  { value: "bs", label: "Bahamas" },
  { value: "bh", label: "Bahrain" },
  { value: "bd", label: "Bangladesh" },
  { value: "bb", label: "Barbados" },
  { value: "by", label: "Belarus" },
  { value: "be", label: "Belgium" },
  { value: "bz", label: "Belize" },
  { value: "bj", label: "Benin" },
  { value: "bt", label: "Bhutan" },
  { value: "bo", label: "Bolivia" },
  { value: "ba", label: "Bosnia and Herzegovina" },
  { value: "bw", label: "Botswana" },
  { value: "br", label: "Brazil" },
  { value: "bn", label: "Brunei" },
  { value: "bg", label: "Bulgaria" },
  { value: "bf", label: "Burkina Faso" },
  { value: "bi", label: "Burundi" },
  { value: "cv", label: "Cabo Verde" },
  { value: "kh", label: "Cambodia" },
  { value: "cm", label: "Cameroon" },
  { value: "ca", label: "Canada" },
  { value: "cf", label: "Central African Republic" },
  { value: "td", label: "Chad" },
  { value: "cl", label: "Chile" },
  { value: "cn", label: "China" },
  { value: "co", label: "Colombia" },
  { value: "km", label: "Comoros" },
  { value: "cg", label: "Congo" },
  { value: "cr", label: "Costa Rica" },
  { value: "hr", label: "Croatia" },
  { value: "cu", label: "Cuba" },
  { value: "cy", label: "Cyprus" },
  { value: "cz", label: "Czech Republic" },
  { value: "dk", label: "Denmark" },
  { value: "dj", label: "Djibouti" },
  { value: "dm", label: "Dominica" },
  { value: "do", label: "Dominican Republic" },
  { value: "ec", label: "Ecuador" },
  { value: "eg", label: "Egypt" },
  { value: "sv", label: "El Salvador" },
  { value: "gq", label: "Equatorial Guinea" },
  { value: "er", label: "Eritrea" },
  { value: "ee", label: "Estonia" },
  { value: "et", label: "Ethiopia" },
  { value: "fj", label: "Fiji" },
  { value: "fi", label: "Finland" },
  { value: "fr", label: "France" },
  { value: "ga", label: "Gabon" },
  { value: "gm", label: "Gambia" },
  { value: "ge", label: "Georgia" },
  { value: "de", label: "Germany" },
  { value: "gh", label: "Ghana" },
  { value: "gr", label: "Greece" },
  { value: "gd", label: "Grenada" },
  { value: "gt", label: "Guatemala" },
  { value: "gn", label: "Guinea" },
  { value: "gw", label: "Guinea-Bissau" },
  { value: "gy", label: "Guyana" },
  { value: "ht", label: "Haiti" },
  { value: "hn", label: "Honduras" },
  { value: "hu", label: "Hungary" },
  { value: "is", label: "Iceland" },
  { value: "in", label: "India" },
  { value: "id", label: "Indonesia" },
  { value: "ir", label: "Iran" },
  { value: "iq", label: "Iraq" },
  { value: "ie", label: "Ireland" },
  { value: "il", label: "Israel" },
  { value: "it", label: "Italy" },
  { value: "jm", label: "Jamaica" },
  { value: "jp", label: "Japan" },
  { value: "jo", label: "Jordan" },
  { value: "kz", label: "Kazakhstan" },
  { value: "ke", label: "Kenya" },
  { value: "ki", label: "Kiribati" },
  { value: "kw", label: "Kuwait" },
  { value: "kg", label: "Kyrgyzstan" },
  { value: "la", label: "Laos" },
  { value: "lv", label: "Latvia" },
  { value: "lb", label: "Lebanon" },
  { value: "ls", label: "Lesotho" },
  { value: "lr", label: "Liberia" },
  { value: "ly", label: "Libya" },
  { value: "li", label: "Liechtenstein" },
  { value: "lt", label: "Lithuania" },
  { value: "lu", label: "Luxembourg" },
  { value: "mg", label: "Madagascar" },
  { value: "mw", label: "Malawi" },
  { value: "my", label: "Malaysia" },
  { value: "mv", label: "Maldives" },
  { value: "ml", label: "Mali" },
  { value: "mt", label: "Malta" },
  { value: "mh", label: "Marshall Islands" },
  { value: "mr", label: "Mauritania" },
  { value: "mu", label: "Mauritius" },
  { value: "mx", label: "Mexico" },
  { value: "fm", label: "Micronesia" },
  { value: "md", label: "Moldova" },
  { value: "mc", label: "Monaco" },
  { value: "mn", label: "Mongolia" },
  { value: "me", label: "Montenegro" },
  { value: "ma", label: "Morocco" },
  { value: "mz", label: "Mozambique" },
  { value: "mm", label: "Myanmar" },
  { value: "na", label: "Namibia" },
  { value: "nr", label: "Nauru" },
  { value: "np", label: "Nepal" },
  { value: "nl", label: "Netherlands" },
  { value: "nz", label: "New Zealand" },
  { value: "ni", label: "Nicaragua" },
  { value: "ne", label: "Niger" },
  { value: "ng", label: "Nigeria" },
  { value: "kp", label: "North Korea" },
  { value: "mk", label: "North Macedonia" },
  { value: "no", label: "Norway" },
  { value: "om", label: "Oman" },
  { value: "pk", label: "Pakistan" },
  { value: "pw", label: "Palau" },
  { value: "pa", label: "Panama" },
  { value: "pg", label: "Papua New Guinea" },
  { value: "py", label: "Paraguay" },
  { value: "pe", label: "Peru" },
  { value: "ph", label: "Philippines" },
  { value: "pl", label: "Poland" },
  { value: "pt", label: "Portugal" },
  { value: "qa", label: "Qatar" },
  { value: "ro", label: "Romania" },
  { value: "ru", label: "Russia" },
  { value: "rw", label: "Rwanda" },
  { value: "kn", label: "Saint Kitts and Nevis" },
  { value: "lc", label: "Saint Lucia" },
  { value: "vc", label: "Saint Vincent and the Grenadines" },
  { value: "ws", label: "Samoa" },
  { value: "sm", label: "San Marino" },
  { value: "st", label: "Sao Tome and Principe" },
  { value: "sa", label: "Saudi Arabia" },
  { value: "sn", label: "Senegal" },
  { value: "rs", label: "Serbia" },
  { value: "sc", label: "Seychelles" },
  { value: "sl", label: "Sierra Leone" },
  { value: "sg", label: "Singapore" },
  { value: "sk", label: "Slovakia" },
  { value: "si", label: "Slovenia" },
  { value: "sb", label: "Solomon Islands" },
  { value: "so", label: "Somalia" },
  { value: "za", label: "South Africa" },
  { value: "kr", label: "South Korea" },
  { value: "ss", label: "South Sudan" },
  { value: "es", label: "Spain" },
  { value: "lk", label: "Sri Lanka" },
  { value: "sd", label: "Sudan" },
  { value: "sr", label: "Suriname" },
  { value: "sz", label: "Eswatini" },
  { value: "se", label: "Sweden" },
  { value: "ch", label: "Switzerland" },
  { value: "sy", label: "Syria" },
  { value: "tw", label: "Taiwan" },
  { value: "tj", label: "Tajikistan" },
  { value: "tz", label: "Tanzania" },
  { value: "th", label: "Thailand" },
  { value: "tl", label: "Timor-Leste" },
  { value: "tg", label: "Togo" },
  { value: "to", label: "Tonga" },
  { value: "tt", label: "Trinidad and Tobago" },
  { value: "tn", label: "Tunisia" },
  { value: "tr", label: "Turkey" },
  { value: "tm", label: "Turkmenistan" },
  { value: "tv", label: "Tuvalu" },
  { value: "ug", label: "Uganda" },
  { value: "ua", label: "Ukraine" },
  { value: "ae", label: "United Arab Emirates" },
  { value: "gb", label: "United Kingdom" },
  { value: "us", label: "United States" },
  { value: "uy", label: "Uruguay" },
  { value: "uz", label: "Uzbekistan" },
  { value: "vu", label: "Vanuatu" },
  { value: "va", label: "Vatican City" },
  { value: "ve", label: "Venezuela" },
  { value: "vn", label: "Vietnam" },
  { value: "ye", label: "Yemen" },
  { value: "zm", label: "Zambia" },
  { value: "zw", label: "Zimbabwe" }
];

// Experience level options
const experienceLevels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" }
];

// Country code options for phone numbers
const countryCodes = [
  { value: "+1", label: "+1 (US/Canada)" },
  { value: "+44", label: "+44 (UK)" },
  { value: "+91", label: "+91 (India)" },
  { value: "+61", label: "+61 (Australia)" },
  { value: "+86", label: "+86 (China)" },
  { value: "+49", label: "+49 (Germany)" },
  { value: "+33", label: "+33 (France)" },
  { value: "+81", label: "+81 (Japan)" },
  { value: "+7", label: "+7 (Russia)" },
  { value: "+55", label: "+55 (Brazil)" },
  { value: "+52", label: "+52 (Mexico)" },
  { value: "+966", label: "+966 (Saudi Arabia)" },
  { value: "+971", label: "+971 (UAE)" },
  { value: "+65", label: "+65 (Singapore)" },
  { value: "+82", label: "+82 (South Korea)" },
  { value: "+234", label: "+234 (Nigeria)" },
  { value: "+27", label: "+27 (South Africa)" },
  { value: "+20", label: "+20 (Egypt)" },
  { value: "+34", label: "+34 (Spain)" },
  { value: "+39", label: "+39 (Italy)" },
  { value: "+31", label: "+31 (Netherlands)" },
  { value: "+90", label: "+90 (Turkey)" },
  { value: "+92", label: "+92 (Pakistan)" },
  { value: "+62", label: "+62 (Indonesia)" },
  { value: "+60", label: "+60 (Malaysia)" },
  { value: "+63", label: "+63 (Philippines)" },
  { value: "+84", label: "+84 (Vietnam)" },
  { value: "+66", label: "+66 (Thailand)" },
  { value: "+48", label: "+48 (Poland)" },
  { value: "+46", label: "+46 (Sweden)" },
  { value: "+41", label: "+41 (Switzerland)" },
  { value: "+43", label: "+43 (Austria)" },
  { value: "+32", label: "+32 (Belgium)" },
  { value: "+45", label: "+45 (Denmark)" },
  { value: "+64", label: "+64 (New Zealand)" }
];

// Add this constant near the other constants at the top of the file
const educationLevels = [
  { value: "high_school", label: "High School" },
  { value: "diploma", label: "Diploma" },
  { value: "bachelors", label: "Bachelor's Degree" },
  { value: "masters", label: "Master's Degree" },
  { value: "phd", label: "Ph.D." },
  { value: "other", label: "Other" }
];

// Add organization size options
const organizationSizes = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-500", label: "201-500 employees" },
  { value: "501-1000", label: "501-1000 employees" },
  { value: "1001+", label: "1001+ employees" }
];

// Add industry options
const industryTypes = [
  { value: "technology", label: "Technology" },
  { value: "education", label: "Education" },
  { value: "healthcare", label: "Healthcare" },
  { value: "finance", label: "Finance" },
  { value: "retail", label: "Retail" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "non_profit", label: "Non-Profit" },
  { value: "government", label: "Government" },
  { value: "other", label: "Other" }
];

// Password strength calculation
const calculatePasswordStrength = (password: string): { score: number; feedback: string } => {
  let score = 0;
  let feedback = '';

  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  switch (score) {
    case 0:
    case 1:
      feedback = 'Very weak';
      break;
    case 2:
      feedback = 'Weak';
      break;
    case 3:
      feedback = 'Moderate';
      break;
    case 4:
      feedback = 'Strong';
      break;
    case 5:
      feedback = 'Very strong';
      break;
  }

  return { score, feedback };
};

const getStrengthColor = (score: number): string => {
  switch (score) {
    case 0:
    case 1:
      return 'bg-red-500';
    case 2:
      return 'bg-orange-500';
    case 3:
      return 'bg-yellow-500';
    case 4:
      return 'bg-green-500';
    case 5:
      return 'bg-emerald-500';
    default:
      return 'bg-gray-200';
  }
};

export default function RegisterPage() {
  // Refs for form elements
  const formRef = useRef<HTMLFormElement>(null);
  
  // State management
  const [formData, setFormData] = useState({
    accountType: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    countryCode: "+971",
    country: "",
    city: "",
    company: "",
    jobTitle: "",
    website: "",
    github: "",
    linkedin: "",
    experienceLevel: "",
    education: "",
    dateOfBirth: "",
    bio: "",
    skills: "",
    organization: "",
    role: "",
    interests: "",
    heardFrom: "",
    acceptTerms: false,
    organizationSize: "",
    industry: "",
    specializations: "",
  });
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<TokenResponse['user'] | null>(null);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: '' });
  const { theme } = useTheme();

  // Memoized values
  const logoSrc = useMemo(() => theme === 'dark' ? "/CloudHubDarkV2.svg" : "/CloudHubV2.svg", [theme]);
  
  // Step indicators
  const isFirstStep = currentStep === 0;
  const isSecondStep = currentStep === 1;
  const isThirdStep = currentStep === 2;
  const isLastStep = currentStep === 3;

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Update password strength immediately for password changes
    if (name === 'password') {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
    }
  }, []);

  const handleSelectChange = useCallback((value: string, name: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleCheckboxChange = useCallback((checked: boolean, name: string) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  }, []);

  // Navigation handlers
  const handleNextStep = useCallback(() => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  }, [currentStep]);

  const handlePreviousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  }, [currentStep]);

  // Form submission handler
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
  }, []);

  // Account creation handler
  const handleCreateAccount = useCallback(async () => {
    if (!formData.accountType) {
      setError('Please select an account type');
      return;
    }

    if (!formData.name) {
      setError('Please enter your full name');
      return;
    }

    if (!formData.email) {
      setError('Please enter your email address');
      return;
    }

    if (passwordStrength.score < 3) {
      setError('Password is not strong enough');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.acceptTerms) {
      setError('Please accept the terms and conditions');
      return;
    }

    if (!formData.country) {
      setError('Please select your country');
      return;
    }

    const role: UserRole = formData.accountType === "organizer" ? "organizer" : "participant";
    setIsLoading(true);
    setError(null);

    try {
      // Common registration data for both participant and organizer
      const registerData = {
        email: formData.email,
        password: formData.password,
        name: formData.name,  // Use name directly
        role,
        phone: formData.phoneNumber || undefined,
        country: formData.country,  // Always include country
        bio: formData.bio || undefined,
        social_links: {
          github: formData.github || '',
          linkedin: formData.linkedin || '',
        },
        accepted_terms: formData.acceptTerms,
        accepted_privacy_policy: formData.acceptTerms
      };

      // Add organizer-specific fields
      if (role === "organizer") {
        if (!formData.organization) {
          setError('Please enter your organization name');
          return;
        }
        if (!formData.website) {
          setError('Please enter your organization website');
          return;
        }
        if (!formData.industry) {
          setError('Please select your industry');
          return;
        }

        // Validate website format
        try {
          new URL(formData.website);
        } catch (e) {
          setError('Please enter a valid website URL (e.g., https://example.com)');
          return;
        }

        Object.assign(registerData, {
          organization_name: formData.organization,
          organization_website: formData.website,
          organization_size: formData.organizationSize || undefined,
          industry: formData.industry,
          specializations: formData.specializations ? formData.specializations.split(',').map(s => s.trim()) : undefined,
        });
      }

      const response = await authAPI.register(registerData);
      setUser(response.user);
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      setCurrentStep(3);
    } catch (err: any) {
      console.error('Registration error:', err);
      let errorMessage = err.message || 'Failed to create account';

      if (err.response?.data?.errors) {
        // Handle validation errors
        const errors = err.response.data.errors;
        errorMessage = errors.map((e: any) => `${e.msg} for ${e.loc[1]}`).join(', ');
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      }

      setError(errorMessage);
      toast.error(errorMessage, {
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [formData, passwordStrength.score]);

  // Render functions
  const renderPasswordStrengthMeter = useMemo(() => {
    return (
      <div className="space-y-2">
        <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${getStrengthColor(passwordStrength.score)}`}
            style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-500">{passwordStrength.feedback}</p>
      </div>
    );
  }, [passwordStrength]);

  // Component render
  return (
    <div className="min-h-screen w-full relative flex items-center justify-center bg-gradient-to-b from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent dark:from-blue-900/20"></div>
        <div className="absolute top-20 right-[10%] w-72 h-72 rounded-full bg-gradient-to-br from-blue-200/20 to-purple-300/30 dark:from-blue-800/20 dark:to-purple-800/20 blur-3xl"></div>
        <div className="absolute bottom-20 left-[5%] w-96 h-96 rounded-full bg-gradient-to-tr from-indigo-200/20 to-blue-300/30 dark:from-indigo-900/20 dark:to-blue-800/20 blur-3xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] dark:bg-[linear-gradient(to_right,rgba(99,102,241,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.1)_1px,transparent_1px)]"></div>
        <svg className="absolute -bottom-40 -left-40 text-blue-500/5 dark:text-blue-300/5" width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(300,300)">
            <path d="M153.6,-106.8C196,-53.1,226.2,13.5,214.5,72.8C202.7,132.1,149,184,81.7,217C14.3,249.9,-66.7,264,-133.2,236C-199.8,208,-251.8,138,-263.7,62.3C-275.5,-13.4,-247.1,-94.7,-196.7,-147.5C-146.2,-200.3,-73.1,-224.6,-5.5,-220.5C62.1,-216.4,111.3,-160.6,153.6,-106.8Z" fill="currentColor" />
          </g>
        </svg>
        <svg className="absolute -top-40 -right-40 text-indigo-500/5 dark:text-indigo-300/5" width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(300,300)">
            <path d="M172.4,-118.8C220.7,-58.4,255,13.3,240.9,72.6C226.7,132,164.2,178.9,97.7,200.8C31.2,222.6,-39.3,219.3,-95.8,190.8C-152.3,162.3,-194.9,108.6,-215.8,43.7C-236.7,-21.3,-236,-97.5,-199.1,-156.7C-162.2,-215.9,-89.2,-258.1,-14.9,-249.2C59.3,-240.2,124.1,-179.3,172.4,-118.8Z" fill="currentColor" />
          </g>
        </svg>
      </div>
      
      <div className="container relative mx-auto px-4 py-8 sm:px-6">
        <div className="flex justify-center mb-6">
          <Image 
            src={logoSrc} 
            alt="CloudHub Logo" 
            width={200} 
            height={36} 
            className="dark:invert" 
            priority
            style={{ width: 'auto', height: 'auto' }}
          />
        </div>
        
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2 max-w-xl mx-auto">
              Join the CloudHub community to connect with fellow innovators and participate in exciting hackathons
            </p>
          </div>
          
          {/* Progress Steps */}
          <div className="mx-auto max-w-3xl mb-6">
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-800">
              <div className="px-4 py-4 sm:px-6">
                <nav aria-label="Progress">
                  <ol className="flex items-center justify-between sm:justify-around">
                    {STEPS.map((step, index) => (
                      <li key={step.title} className={cn(
                        "relative flex flex-col items-center",
                        index < STEPS.length - 1 ? "w-full sm:w-auto" : ""
                      )}>
                        {index < currentStep ? (
                          <>
                            <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 sm:hidden">
                              <div className="h-full w-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                            </div>
                            <a className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 text-white ring-4 ring-white dark:ring-slate-900 shadow-md">
                              <Check className="h-4 w-4" />
                              <span className="sr-only">{step.title}</span>
                            </a>
                          </>
                        ) : index === currentStep ? (
                          <>
                            {index > 0 && (
                              <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 sm:hidden">
                                <div className="h-full w-1/2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                              </div>
                            )}
                            <a
                              className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-blue-500 bg-white dark:bg-slate-800 font-medium text-blue-500 ring-4 ring-white dark:ring-slate-900"
                              aria-current="step"
                            >
                              {index + 1}
                              <span className="sr-only">{step.title}</span>
                            </a>
                          </>
                        ) : (
                          <>
                            {index > 0 && (
                              <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-transparent sm:hidden"></div>
                            )}
                            <a className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400">
                              {index + 1}
                              <span className="sr-only">{step.title}</span>
                            </a>
                          </>
                        )}
                        
                        <div className="mt-2 text-center">
                          <span className={cn(
                            "text-xs font-medium",
                            index <= currentStep 
                              ? "text-blue-600 dark:text-blue-400" 
                              : "text-gray-500 dark:text-gray-400"
                          )}>
                            {step.title}
                          </span>
                          <p className={cn(
                            "text-[10px] mt-0.5 hidden sm:block",
                            index <= currentStep 
                              ? "text-gray-600 dark:text-gray-300" 
                              : "text-gray-400 dark:text-gray-500"
                          )}>
                            {step.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </nav>
              </div>
            </div>
          </div>
          
          {/* Main Form */}
          <Card className="border-none shadow-xl w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md mx-auto max-w-3xl overflow-hidden rounded-2xl">
            <CardContent className="pt-6 pb-4 px-6 sm:px-8">
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                {/* Step Content */}
                <Suspense fallback={<div className="animate-pulse">Loading...</div>}>
                  {isFirstStep && (
                    <div className="space-y-4 py-2">
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent inline-block">Choose Account Type</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Select the type of account you want to create</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        <div 
                          className={cn(
                            "relative overflow-hidden rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg group",
                            formData.accountType === "participant" 
                              ? "border-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-900/30 dark:to-indigo-900/30 shadow-lg" 
                              : "border border-gray-200 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm"
                          )}
                          onClick={() => setFormData({ ...formData, accountType: "participant" })}
                        >
                          <div className="absolute top-4 right-4">
                            <div className={cn(
                              "rounded-full flex items-center justify-center w-6 h-6 transition-all duration-300", 
                              formData.accountType === "participant" 
                                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md" 
                                : "bg-gray-200 text-gray-400 dark:bg-gray-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30"
                            )}>
                              {formData.accountType === "participant" ? (
                                <Check className="h-3.5 w-3.5" />
                              ) : (
                                <Circle className="h-3.5 w-3.5" />
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-center text-center space-y-4">
                            <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md transform transition-transform duration-300 group-hover:scale-110">
                              <User className="h-6 w-6" />
                            </div>
                            <h4 className="font-semibold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Participant</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Join hackathons, collaborate with teams, and showcase your skills</p>
                            <ul className="text-xs text-left w-full space-y-2.5 mt-1 text-gray-600 dark:text-gray-400">
                              <li className="flex items-center">
                                <CheckCircle2 className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
                                <span>Join hackathon events</span>
                              </li>
                              <li className="flex items-center">
                                <CheckCircle2 className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
                                <span>Build and submit projects</span>
                              </li>
                              <li className="flex items-center">
                                <CheckCircle2 className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
                                <span>Connect with other participants</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                        
                        <div 
                          className={cn(
                            "relative overflow-hidden rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg group",
                            formData.accountType === "organizer" 
                              ? "border-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-900/30 dark:to-purple-900/30 shadow-lg" 
                              : "border border-gray-200 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm"
                          )}
                          onClick={() => setFormData({ ...formData, accountType: "organizer" })}
                        >
                          <div className="absolute top-4 right-4">
                            <div className={cn(
                              "rounded-full flex items-center justify-center w-6 h-6 transition-all duration-300", 
                              formData.accountType === "organizer" 
                                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md" 
                                : "bg-gray-200 text-gray-400 dark:bg-gray-800 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30"
                            )}>
                              {formData.accountType === "organizer" ? (
                                <Check className="h-3.5 w-3.5" />
                              ) : (
                                <Circle className="h-3.5 w-3.5" />
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-center text-center space-y-4">
                            <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md transform transition-transform duration-300 group-hover:scale-110">
                              <Users className="h-6 w-6" />
                            </div>
                            <h4 className="font-semibold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Organizer</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Create and manage hackathons, review submissions, and build communities</p>
                            <ul className="text-xs text-left w-full space-y-2.5 mt-1 text-gray-600 dark:text-gray-400">
                              <li className="flex items-center">
                                <CheckCircle2 className="h-4 w-4 mr-2 text-indigo-500 flex-shrink-0" />
                                <span>Host your own hackathons</span>
                              </li>
                              <li className="flex items-center">
                                <CheckCircle2 className="h-4 w-4 mr-2 text-indigo-500 flex-shrink-0" />
                                <span>Manage event logistics</span>
                              </li>
                              <li className="flex items-center">
                                <CheckCircle2 className="h-4 w-4 mr-2 text-indigo-500 flex-shrink-0" />
                                <span>Access sponsor opportunities</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {isSecondStep && (
                    <div className="space-y-4 py-2 max-w-5xl mx-auto">
                      <div className="text-center mb-5">
                        <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent inline-block">Personal Information</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Provide your basic account details</p>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label htmlFor="name" className="text-sm font-medium flex items-center">
                              Full Name <span className="text-red-500 ml-1">*</span>
                            </Label>
                            <Input
                              id="name"
                              name="name"
                              placeholder="John Doe"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="border-slate-200 dark:border-slate-700 focus:border-blue-500 hover:border-blue-400 dark:hover:border-blue-500 transition-colors h-11 rounded-lg shadow-sm"
                              required
                            />
                          </div>
                          
                          <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-sm font-medium flex items-center">
                              Email Address <span className="text-red-500 ml-1">*</span>
                            </Label>
                            <div className="relative group">
                              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                              <Input
                                id="email"
                                name="email"
                                placeholder="name@example.com"
                                type="email"
                                autoCapitalize="none"
                                autoComplete="email"
                                autoCorrect="off"
                                className="pl-10 border-slate-200 dark:border-slate-700 focus:border-blue-500 group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-colors h-11 rounded-lg shadow-sm"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label htmlFor="password" className="text-sm font-medium flex items-center">
                              Password <span className="text-red-500 ml-1">*</span>
                            </Label>
                            <div className="relative group">
                              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                              <Input
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                type={showPassword ? "text" : "password"}
                                autoCapitalize="none"
                                autoComplete="new-password"
                                className="pl-10 pr-10 border-slate-200 dark:border-slate-700 focus:border-blue-500 group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-colors h-11 rounded-lg shadow-sm"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                              />
                              <button 
                                type="button"
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors" 
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                            {renderPasswordStrengthMeter}
                          </div>
                          
                          <div className="space-y-1.5">
                            <Label htmlFor="confirmPassword" className="text-sm font-medium flex items-center">
                              Confirm Password <span className="text-red-500 ml-1">*</span>
                            </Label>
                            <div className="relative group">
                              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                              <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder="••••••••"
                                type={showConfirmPassword ? "text" : "password"}
                                autoCapitalize="none"
                                className="pl-10 pr-10 border-slate-200 dark:border-slate-700 focus:border-blue-500 group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-colors h-11 rounded-lg shadow-sm"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                              />
                              <button 
                                type="button"
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors" 
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label htmlFor="phoneNumber" className="text-sm font-medium flex items-center">
                              Phone Number <Phone className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
                            </Label>
                            <div className="flex space-x-2">
                              <div className="w-24">
                                <CountryCodeSelect 
                                  value={formData.countryCode} 
                                  onValueChange={(value: string) => handleSelectChange(value, 'countryCode')} 
                                />
                              </div>
                              <div className="relative group flex-1">
                                <Input
                                  id="phoneNumber"
                                  name="phoneNumber"
                                  placeholder="(050) 123-4567"
                                  type="tel"
                                  className="border-slate-200 dark:border-slate-700 focus:border-blue-500 group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-colors h-11 rounded-lg shadow-sm"
                                  value={formData.phoneNumber}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-1.5">
                            <Label htmlFor="country" className="text-sm font-medium flex items-center">
                              Country <Globe className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
                            </Label>
                            <CountrySelect 
                              value={formData.country} 
                              onValueChange={(value: string) => handleSelectChange(value, 'country')}
                              placeholder="Select your country"
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2 pt-2">
                          <Checkbox 
                            id="acceptTerms" 
                            checked={formData.acceptTerms}
                            onCheckedChange={(checked) => handleCheckboxChange(checked === true, 'acceptTerms')}
                            className="mt-1"
                          />
                          <div className="grid gap-1 leading-none">
                            <Label htmlFor="acceptTerms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              I accept the <Link href="#" className="text-primary hover:underline">Terms of Service</Link> and <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              You must agree to our Terms and Privacy Policy to create an account.
                            </p>
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-100 dark:border-blue-900 flex items-center text-xs text-blue-700 dark:text-blue-300">
                          <ShieldCheck className="h-4 w-4 mr-2 flex-shrink-0" />
                          <p>Your personal information is secured with end-to-end encryption. We prioritize your privacy.</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {isThirdStep && (
                    <div className="space-y-4 py-2 max-w-5xl mx-auto">
                      <div className="text-center mb-5">
                        <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent inline-block">
                          {formData.accountType === "organizer" ? "Organization Details" : "Profile Details"}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {formData.accountType === "organizer" 
                            ? "Tell us about your organization" 
                            : "Tell us more about yourself"}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4">
                        {formData.accountType === "organizer" ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <Label htmlFor="organization" className="text-sm font-medium flex items-center">
                                  Organization Name <span className="text-red-500 ml-1">*</span>
                                </Label>
                                <div className="relative group">
                                  <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                  <Input
                                    id="organization"
                                    name="organization"
                                    placeholder="Enter organization name"
                                    className="pl-10 border-slate-200 dark:border-slate-700 focus:border-blue-500 group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-colors h-11 rounded-lg shadow-sm"
                                    value={formData.organization}
                                    onChange={handleInputChange}
                                    required
                                  />
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <Label htmlFor="website" className="text-sm font-medium flex items-center">
                                  Organization Website <span className="text-red-500 ml-1">*</span>
                                </Label>
                                <div className="relative group">
                                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                  <Input
                                    id="website"
                                    name="website"
                                    placeholder="https://example.com"
                                    type="url"
                                    className="pl-10 border-slate-200 dark:border-slate-700 focus:border-blue-500 group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-colors h-11 rounded-lg shadow-sm"
                                    value={formData.website}
                                    onChange={handleInputChange}
                                    required
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <Label htmlFor="organizationSize" className="text-sm font-medium">
                                  Organization Size
                                </Label>
                                <Select 
                                  value={formData.organizationSize}
                                  onValueChange={(value) => handleSelectChange(value, 'organizationSize')}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select organization size" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      {organizationSizes.map((size) => (
                                        <SelectItem key={size.value} value={size.value}>
                                          {size.label}
                                        </SelectItem>
                                      ))}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-1.5">
                                <Label htmlFor="industry" className="text-sm font-medium">
                                  Industry
                                </Label>
                                <Select 
                                  value={formData.industry}
                                  onValueChange={(value) => handleSelectChange(value, 'industry')}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select industry" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      {industryTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                          {type.label}
                                        </SelectItem>
                                      ))}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div>
                              <Label htmlFor="bio" className="text-sm font-medium">Organization Description</Label>
                              <Textarea
                                id="bio"
                                name="bio"
                                placeholder="Tell us about your organization, its mission, and what kind of hackathons you plan to organize..."
                                className="resize-none h-24 w-full"
                                value={formData.bio}
                                onChange={handleInputChange}
                              />
                            </div>

                            <div className="space-y-1.5">
                              <Label htmlFor="specializations" className="text-sm font-medium">
                                Areas of Focus
                              </Label>
                              <Input
                                id="specializations"
                                name="specializations"
                                placeholder="e.g., AI/ML, Web3, Cloud Computing (comma separated)"
                                className="border-slate-200 dark:border-slate-700 focus:border-blue-500 group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-colors h-11 rounded-lg shadow-sm"
                                value={formData.specializations}
                                onChange={handleInputChange}
                              />
                              <p className="text-xs text-gray-500">Enter the main areas your hackathons will focus on</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <Label htmlFor="github" className="text-sm font-medium flex items-center">
                                  GitHub Organization <Github className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
                                </Label>
                                <div className="relative group">
                                  <Input
                                    id="github"
                                    name="github"
                                    placeholder="github.com/organization"
                                    className="border-slate-200 dark:border-slate-700 focus:border-blue-500 group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-colors h-11 rounded-lg shadow-sm"
                                    value={formData.github}
                                    onChange={handleInputChange}
                                  />
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <Label htmlFor="linkedin" className="text-sm font-medium">
                                  LinkedIn Company Page
                                </Label>
                                <div className="relative group">
                                  <Input
                                    id="linkedin"
                                    name="linkedin"
                                    placeholder="linkedin.com/company/organization"
                                    className="border-slate-200 dark:border-slate-700 focus:border-blue-500 group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-colors h-11 rounded-lg shadow-sm"
                                    value={formData.linkedin}
                                    onChange={handleInputChange}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3 col-span-1">
                            <div>
                              <Label htmlFor="bio">Bio</Label>
                              <Textarea
                                id="bio"
                                name="bio"
                                placeholder="Tell us about your background, interests, and what drives you..."
                                className="resize-none h-24 w-full"
                                value={formData.bio}
                                onChange={handleInputChange}
                              />
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <Label htmlFor="experienceLevel">Experience Level</Label>
                                <Select 
                                  name="experienceLevel" 
                                  value={formData.experienceLevel || ""}
                                  onValueChange={(value) => setFormData({ ...formData, experienceLevel: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select level" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {experienceLevels.map((level) => (
                                      <SelectItem key={level.value} value={level.value}>
                                        {level.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <Label htmlFor="education">Education</Label>
                                <Select 
                                  value={formData.education}
                                  onValueChange={(value) => handleSelectChange(value, 'education')}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select education level" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      {educationLevels.map((level) => (
                                        <SelectItem key={level.value} value={level.value}>
                                          {level.label}
                                        </SelectItem>
                                      ))}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {isLastStep && (
                    <div className="flex flex-col items-center justify-center space-y-6 py-6 max-w-2xl mx-auto">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full blur-md opacity-70"></div>
                        <div className="relative rounded-full bg-gradient-to-br from-green-400 to-emerald-500 p-5 shadow-md">
                          <Check className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      
                      <div className="text-center space-y-3">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Account Created!</h3>
                        <p className="text-center text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
                          Your account has been successfully created. You can now login and start exploring
                          {formData.accountType === "participant" 
                            ? " hackathons to join." 
                            : " and create your first hackathon."
                          }
                        </p>
                      </div>
                      
                      <div className="space-y-5 w-full max-w-md">
                        <Button 
                          asChild 
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 shadow-md h-10 text-base rounded-lg transition-all"
                        >
                          <Link href="/login">
                            <Lock className="mr-2 h-4 w-4" /> Go to Login
                          </Link>
                        </Button>
                        
                        <div className="bg-blue-50/50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30 text-center text-blue-700 dark:text-blue-300 backdrop-blur-sm">
                          <p>A confirmation email has been sent to <span className="font-semibold">{formData.email}</span></p>
                          <p className="mt-1 text-xs">Please verify your email to activate all features.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {formData.accountType === "participant" && (
                            <div className="bg-blue-50/50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30 text-center backdrop-blur-sm">
                              <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">Recommended Next Steps:</h4>
                              <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-2">
                                <li className="flex items-center justify-center">
                                  <CheckCircle2 className="h-3 w-3 mr-2 text-blue-500" />
                                  Complete your profile
                                </li>
                                <li className="flex items-center justify-center">
                                  <CheckCircle2 className="h-3 w-3 mr-2 text-blue-500" />
                                  Browse upcoming hackathons
                                </li>
                                <li className="flex items-center justify-center">
                                  <CheckCircle2 className="h-3 w-3 mr-2 text-blue-500" />
                                  Join our community
                                </li>
                              </ul>
                            </div>
                          )}
                          
                          {formData.accountType === "organizer" && (
                            <div className="bg-indigo-50/50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30 text-center backdrop-blur-sm">
                              <h4 className="font-medium text-indigo-700 dark:text-indigo-300 mb-2">Recommended Next Steps:</h4>
                              <ul className="text-xs text-indigo-600 dark:text-indigo-400 space-y-2">
                                <li className="flex items-center justify-center">
                                  <CheckCircle2 className="h-3 w-3 mr-2 text-indigo-500" />
                                  Set up organization profile
                                </li>
                                <li className="flex items-center justify-center">
                                  <CheckCircle2 className="h-3 w-3 mr-2 text-indigo-500" />
                                  Create your first hackathon
                                </li>
                                <li className="flex items-center justify-center">
                                  <CheckCircle2 className="h-3 w-3 mr-2 text-indigo-500" />
                                  Invite team members
                                </li>
                              </ul>
                            </div>
                          )}
                          
                          <div className="bg-indigo-50/50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/30 text-center backdrop-blur-sm">
                            <h4 className="font-medium text-indigo-700 dark:text-indigo-300 mb-2">Need Help?</h4>
                            <p className="text-xs text-indigo-600 dark:text-indigo-400 mb-3">We have resources to help you get started.</p>
                            <Button 
                              variant="outline"
                              size="sm"
                              className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:border-indigo-800 dark:hover:bg-indigo-950/50 w-full text-xs h-8 rounded-lg"
                            >
                              <Link2 className="mr-1 h-3 w-3" /> View Resources
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Suspense>
                
                {/* Navigation buttons */}
                {!isLastStep && (
                  <div className="mt-8 flex justify-between items-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePreviousStep}
                      disabled={currentStep === 0 || isLoading}
                      className="border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 transition-all h-11 px-5 rounded-xl min-w-[100px] font-medium"
                    >
                      <ChevronLeft className="mr-1.5 h-4 w-4" />
                      Back
                    </Button>
                    
                    {currentStep === 2 ? (
                      <Button 
                        type="button"
                        onClick={handleCreateAccount}
                        disabled={isLoading || !formData.acceptTerms}
                        className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 shadow-md px-6 h-11 min-w-[180px] font-medium rounded-xl transition-all duration-300 border-0 group"
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating Account...
                          </div>
                        ) : (
                          <span className="flex items-center">
                            Create Account 
                            <Check className="ml-1.5 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                          </span>
                        )}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={handleNextStep}
                        disabled={
                          isLoading ||
                          (currentStep === 0 && !formData.accountType) ||
                          (currentStep === 1 && (!formData.name || !formData.email || !formData.password || !formData.acceptTerms || formData.password !== formData.confirmPassword))
                        }
                        className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 shadow-md px-6 h-11 min-w-[140px] font-medium rounded-xl transition-all duration-300 border-0 group"
                      >
                        <span className="flex items-center">
                          Continue
                          <ChevronRight className="ml-1.5 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                      </Button>
                    )}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Footer Links */}
          {currentStep < 3 && (
            <div className="text-center mt-6 mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 transition-all duration-300 relative inline-block group"
                >
                  Sign in
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 