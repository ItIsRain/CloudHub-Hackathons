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
  GraduationCap,
  Briefcase,
  Award,
  Calendar,
  Globe2,
  Sparkles
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
import { useState, useCallback, memo, useMemo } from "react"

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
          onClick={() => onRemove(skill)} 
          className="ml-1 rounded-full bg-blue-100 p-0.5 hover:bg-blue-200"
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

export default function SettingsDashboard() {
  const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false)
  const [isCertificationDialogOpen, setIsCertificationDialogOpen] = useState(false)
  const [isLanguageDialogOpen, setIsLanguageDialogOpen] = useState(false)
  const [isExperienceDialogOpen, setIsExperienceDialogOpen] = useState(false)
  const [isEducationDialogOpen, setIsEducationDialogOpen] = useState(false)
  const [newSkill, setNewSkill] = useState("")
  const [newCertification, setNewCertification] = useState("")
  const [newLanguage, setNewLanguage] = useState("")
  const [newLanguageLevel, setNewLanguageLevel] = useState("Intermediate")
  const [currentlyWorking, setCurrentlyWorking] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
  
  // Memoized handlers
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);
  
  const handleAddSkill = useCallback(() => {
    if (newSkill.trim()) {
      // Would add the skill to the list in a real implementation
      setNewSkill("");
      setIsSkillDialogOpen(false);
    }
  }, [newSkill]);
  
  const handleAddCertification = useCallback(() => {
    if (newCertification.trim()) {
      // Would add the certification to the list in a real implementation
      setNewCertification("");
      setIsCertificationDialogOpen(false);
    }
  }, [newCertification]);
  
  const handleAddLanguage = useCallback(() => {
    if (newLanguage.trim()) {
      // Would add the language to the list in a real implementation
      setNewLanguage("");
      setIsLanguageDialogOpen(false);
    }
  }, [newLanguage, newLanguageLevel]);
  
  const toggleSkillDialog = useCallback((isOpen: boolean) => {
    setIsSkillDialogOpen(isOpen);
    if (!isOpen) setNewSkill("");
  }, []);
  
  const toggleCertificationDialog = useCallback((isOpen: boolean) => {
    setIsCertificationDialogOpen(isOpen);
    if (!isOpen) setNewCertification("");
  }, []);
  
  const toggleLanguageDialog = useCallback((isOpen: boolean) => {
    setIsLanguageDialogOpen(isOpen);
    if (!isOpen) {
      setNewLanguage("");
      setNewLanguageLevel("Intermediate");
    }
  }, []);
  
  const toggleExperienceDialog = useCallback((isOpen: boolean) => {
    setIsExperienceDialogOpen(isOpen);
    if (!isOpen) setCurrentlyWorking(false);
  }, []);
  
  const toggleEducationDialog = useCallback((isOpen: boolean) => {
    setIsEducationDialogOpen(isOpen);
  }, []);
  
  // Mock data - memoized to prevent recreation on each render
  const profileInfo = useMemo(() => [
    { label: "Email", value: "john.doe@example.com", icon: <Mail className="h-5 w-5" /> },
    { label: "Phone", value: "+1 (555) 123-4567", icon: <Phone className="h-5 w-5" /> },
    { label: "Location", value: "San Francisco, CA", icon: <MapPin className="h-5 w-5" /> },
    { label: "Company", value: "Tech Corp Inc.", icon: <Building2 className="h-5 w-5" /> },
    { label: "Experience", value: "5+ years experience", icon: <Briefcase className="h-5 w-5" /> },
    { label: "Website", value: "johndoe.dev", icon: <Globe className="h-5 w-5" /> }
  ], []);
  
  const skills = useMemo(() => [
    "React", "JavaScript", "TypeScript", "Node.js", "Next.js", "TailwindCSS", "GraphQL", "AWS"
  ], []);
  
  const languages = useMemo(() => [
    { language: "English", level: "Native" },
    { language: "Spanish", level: "Intermediate" },
    { language: "French", level: "Basic" }
  ], []);
  
  const certifications = useMemo(() => [
    { name: "AWS Certified Solutions Architect", issuer: "Amazon Web Services", date: "2022" },
    { name: "Professional Scrum Master I", issuer: "Scrum.org", date: "2021" },
    { name: "Google Cloud Professional Developer", issuer: "Google", date: "2020" }
  ], []);
  
  // Memoize dialog content to prevent re-rendering
  const skillDialogContent = useMemo(() => (
    <>
      <DialogHeader>
        <DialogTitle>Add New Skill</DialogTitle>
        <DialogDescription>Add a new technical or professional skill to your profile.</DialogDescription>
      </DialogHeader>
      <div className="mt-4 mb-6">
        <Label htmlFor="skillName" className="text-sm font-medium text-slate-700">Skill Name</Label>
        <Input 
          id="skillName" 
          value={newSkill} 
          onChange={(e) => setNewSkill(e.target.value)} 
          placeholder="e.g. React, Project Management, JavaScript..." 
          className="mt-1.5 bg-white border-slate-200"
        />
      </div>
      <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
        <Button 
          type="button" 
          variant="outline"
          className="flex-1 border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          onClick={() => toggleSkillDialog(false)}
        >
          Cancel
        </Button>
        <Button 
          type="button" 
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-sm rounded-xl"
          disabled={!newSkill.trim()}
          onClick={handleAddSkill}
        >
          Add Skill
        </Button>
      </DialogFooter>
    </>
  ), [newSkill, handleAddSkill, toggleSkillDialog]);

  const certificationDialogContent = useMemo(() => (
    <>
      <DialogHeader>
        <DialogTitle>Add New Certification</DialogTitle>
        <DialogDescription>Add details about your professional certifications.</DialogDescription>
      </DialogHeader>
      <div className="mt-4 mb-6 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="certName" className="text-sm font-medium text-slate-700">Certification Name</Label>
          <Input 
            id="certName" 
            value={newCertification} 
            onChange={(e) => setNewCertification(e.target.value)} 
            placeholder="e.g. AWS Certified Solutions Architect" 
            className="bg-white border-slate-200"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="certIssuer" className="text-sm font-medium text-slate-700">Issuing Organization</Label>
          <Input 
            id="certIssuer" 
            placeholder="e.g. Amazon Web Services" 
            className="bg-white border-slate-200"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="certDate" className="text-sm font-medium text-slate-700">Issued Date</Label>
          <Input 
            id="certDate" 
            type="month" 
            className="bg-white border-slate-200"
          />
        </div>
      </div>
      <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
        <Button 
          type="button" 
          variant="outline"
          className="flex-1 border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          onClick={() => toggleCertificationDialog(false)}
        >
          Cancel
        </Button>
        <Button 
          type="button" 
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-sm rounded-xl"
          disabled={!newCertification.trim()}
          onClick={handleAddCertification}
        >
          Add Certification
        </Button>
      </DialogFooter>
    </>
  ), [newCertification, handleAddCertification, toggleCertificationDialog]);

  // Memoize long lists to prevent re-rendering
  const countriesList = useMemo(() => {
    const countries = [
      { value: "us", label: "United States" },
      { value: "gb", label: "United Kingdom" },
      { value: "ca", label: "Canada" },
      { value: "au", label: "Australia" },
      { value: "de", label: "Germany" },
      { value: "fr", label: "France" },
      { value: "jp", label: "Japan" },
      { value: "in", label: "India" },
      { value: "cn", label: "China" },
      { value: "br", label: "Brazil" }
    ];
    
    return (
      <>
        {countries.map(country => (
          <SelectItem key={country.value} value={country.value}>{country.label}</SelectItem>
        ))}
      </>
    );
  }, []);

  return (
    <div className="space-y-6 px-6 pb-6">
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
            </div>
          </CardHeader>
          <CardContent className="pt-10 px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-start gap-12">
              <div className="flex flex-col items-center space-y-5">
                <div className="relative">
                  <Avatar className="h-40 w-40 border-4 border-white shadow-md relative">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" className="object-cover" />
                    <AvatarFallback className="bg-blue-500 text-white text-6xl">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    className="absolute bottom-1 right-1 rounded-full shadow-md border-2 border-white size-10 bg-white"
                  >
                    <Camera className="h-4 w-4 text-blue-600" />
                  </Button>
                </div>
                <div className="text-center space-y-2.5">
                  <h3 className="text-2xl font-semibold text-blue-600">John Doe</h3>
                  <p className="text-sm text-slate-600">Full Stack Developer</p>
                  <Badge className="mt-2 bg-blue-500 text-white px-4 py-1 rounded-full shadow-sm">
                    Pro Member
                  </Badge>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 md:mt-0">
                {profileInfo.map((info, index) => (
                  <ProfileInfoCard key={index} label={info.label} value={info.value} icon={info.icon} />
                ))}
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
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="px-8 py-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="John" className="bg-white border-slate-200" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Doe" className="bg-white border-slate-200" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="john.doe@example.com" className="bg-white border-slate-200" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" className="bg-white border-slate-200" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" defaultValue="123 Tech Street" className="bg-white border-slate-200" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" defaultValue="San Francisco" className="bg-white border-slate-200" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input id="state" defaultValue="CA" className="bg-white border-slate-200" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Zip Code</Label>
                      <Input id="zipCode" defaultValue="94105" className="bg-white border-slate-200" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select defaultValue="us">
                        <SelectTrigger className="bg-white border-slate-200 h-10">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[280px]">
                          {countriesList}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Biography</Label>
                    <Textarea 
                      id="bio" 
                      className="resize-none bg-white border-slate-200 min-h-[120px]" 
                      defaultValue="Full stack developer with 5+ years of experience specializing in React, Node.js, and cloud architecture. Passionate about building scalable web applications and mentoring junior developers."
                    />
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
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm hover:shadow-md transition-all duration-200">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="px-8 py-6 space-y-6">
                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-slate-700">Technical Skills</Label>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        <SkillBadge key={index} skill={skill} onRemove={(removedSkill) => {
                          // Implement the logic to remove the skill
                        }} />
                      ))}
                      <Dialog open={isSkillDialogOpen} onOpenChange={toggleSkillDialog}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="rounded-lg h-8 gap-1 text-sm border-dashed border-slate-300 hover:border-blue-300 hover:text-blue-600 text-slate-500">
                            <Plus className="h-3.5 w-3.5" />
                            Add Skill
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden border-none shadow-xl rounded-2xl bg-white animate-in fade-in-0 zoom-in-95">
                          {skillDialogContent}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-slate-700">Professional Certifications</Label>
                    <div className="flex flex-wrap gap-2">
                      {certifications.map((cert, index) => (
                        <Badge key={index} className="px-3 py-1.5 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors rounded-lg flex items-center gap-1.5">
                          {cert.name}
                          <X className="h-3 w-3 cursor-pointer hover:text-indigo-900" />
                        </Badge>
                      ))}
                      <Dialog open={isCertificationDialogOpen} onOpenChange={toggleCertificationDialog}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="rounded-lg h-8 gap-1 text-sm border-dashed border-slate-300 hover:border-blue-300 hover:text-blue-600 text-slate-500">
                            <Plus className="h-3.5 w-3.5" />
                            Add Certification
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden border-none shadow-xl rounded-2xl bg-white animate-in fade-in-0 zoom-in-95">
                          {certificationDialogContent}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-slate-700">Languages</Label>
                    <div className="flex flex-wrap gap-2">
                      {languages.map((lang, index) => (
                        <LanguageItem key={index} language={lang.language} level={lang.level} onRemove={(removedLang) => {
                          // Implement the logic to remove the language
                        }} />
                      ))}
                      <Dialog open={isLanguageDialogOpen} onOpenChange={toggleLanguageDialog}>
                        <DialogTrigger asChild>
                          <Button 
                            className="flex items-center justify-between p-3 rounded-xl border border-slate-200 border-dashed bg-white/60 hover:bg-blue-50/50 hover:border-blue-300 text-slate-500 hover:text-blue-600 h-auto w-[224px]"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                                <Plus className="h-4 w-4" />
                              </div>
                              <div className="text-left">
                                <h4 className="font-medium text-slate-900">Add Language</h4>
                                <p className="text-xs text-slate-500">Add a new language</p>
                              </div>
                            </div>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden border-none shadow-xl rounded-2xl bg-white animate-in fade-in-0 zoom-in-95">
                          <div className="relative py-4 px-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600">
                            <DialogTitle className="text-xl font-bold text-white flex items-center">
                              <Globe className="h-5 w-5 mr-2" />
                              Add Language
                            </DialogTitle>
                            <DialogDescription className="text-blue-100 mt-1">
                              Add a language to your profile
                            </DialogDescription>
                          </div>
                          <div className="p-6">
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="language">Language</Label>
                                <Input 
                                  id="language" 
                                  placeholder="e.g. Spanish" 
                                  className="bg-white border-slate-200"
                                  value={newLanguage}
                                  onChange={(e) => setNewLanguage(e.target.value)}
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
                          </div>
                          <DialogFooter className="p-6 pt-0 flex gap-3 border-t border-slate-100 mt-3">
                            <Button
                              variant="outline"
                              className="flex-1 border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-200"
                              onClick={() => toggleLanguageDialog(false)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-xl"
                              disabled={!newLanguage.trim()}
                              onClick={handleAddLanguage}
                            >
                              Add Language
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label htmlFor="experience" className="text-sm font-medium text-slate-700">Work Experience</Label>
                    <div className="space-y-4">
                      <div className="p-4 border border-slate-200 rounded-xl bg-white">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-slate-900">Senior Developer</h4>
                            <p className="text-sm text-slate-500">Tech Corp Inc. • Full-time</p>
                            <div className="flex items-center text-xs text-slate-500 mt-1.5">
                              <Calendar className="h-3.5 w-3.5 mr-1" />
                              Jan 2020 - Present • 3 years, 5 months
                            </div>
                          </div>
                          <Button size="sm" variant="ghost" className="text-slate-500 hover:text-blue-600 p-2 h-8 w-8">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Dialog open={isExperienceDialogOpen} onOpenChange={toggleExperienceDialog}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="w-full rounded-xl h-10 gap-1.5 text-sm border-dashed border-slate-300 hover:border-blue-300 hover:text-blue-600 text-slate-500">
                            <Plus className="h-4 w-4" />
                            Add Work Experience
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[525px] p-0 overflow-hidden border-none shadow-xl rounded-2xl bg-white animate-in fade-in-0 zoom-in-95">
                          <div className="relative py-4 px-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600">
                            <DialogTitle className="text-xl font-bold text-white flex items-center">
                              <Briefcase className="h-5 w-5 mr-2" />
                              Add Work Experience
                            </DialogTitle>
                            <DialogDescription className="text-blue-100 mt-1">
                              Add your professional work experience
                            </DialogDescription>
                          </div>
                          <div className="p-6">
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="job-title">Job Title</Label>
                                <Input 
                                  id="job-title" 
                                  placeholder="e.g. Senior Developer" 
                                  className="bg-white border-slate-200"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="company">Company</Label>
                                <Input 
                                  id="company" 
                                  placeholder="e.g. Tech Corp Inc." 
                                  className="bg-white border-slate-200"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="job-start-date">Start Date</Label>
                                  <Input 
                                    id="job-start-date" 
                                    type="date"
                                    className="bg-white border-slate-200"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="job-end-date">End Date</Label>
                                  <Input 
                                    id="job-end-date" 
                                    type="date"
                                    className="bg-white border-slate-200"
                                    disabled={currentlyWorking}
                                  />
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id="current-job" 
                                  className="h-5 w-5 rounded-md border-slate-300 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-600 data-[state=checked]:to-indigo-600 data-[state=checked]:shadow-sm transition-all duration-200" 
                                  checked={currentlyWorking}
                                  onCheckedChange={(checked) => {
                                    setCurrentlyWorking(checked === true);
                                  }}
                                />
                                <Label 
                                  htmlFor="current-job" 
                                  className="text-sm text-slate-700 cursor-pointer hover:text-blue-600 transition-colors duration-200"
                                >
                                  I currently work here
                                </Label>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="job-type">Employment Type</Label>
                                <Select defaultValue="full-time">
                                  <SelectTrigger className="bg-white border-slate-200">
                                    <SelectValue placeholder="Select employment type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="full-time">Full-time</SelectItem>
                                    <SelectItem value="part-time">Part-time</SelectItem>
                                    <SelectItem value="contract">Contract</SelectItem>
                                    <SelectItem value="freelance">Freelance</SelectItem>
                                    <SelectItem value="internship">Internship</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="job-description">Description (Optional)</Label>
                                <Textarea 
                                  id="job-description" 
                                  placeholder="Describe your role and responsibilities"
                                  className="resize-none bg-white border-slate-200 min-h-[100px]"
                                />
                              </div>
                            </div>
                          </div>
                          <DialogFooter className="p-6 pt-0 flex gap-3 border-t border-slate-100 mt-3">
                            <Button
                              variant="outline"
                              className="flex-1 border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-200"
                              onClick={() => {
                                setCurrentlyWorking(false);
                                toggleExperienceDialog(false);
                              }}
                            >
                              Cancel
                            </Button>
                            <Button 
                              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-xl"
                              onClick={() => {
                                // Add work experience logic would go here
                                setCurrentlyWorking(false);
                                toggleExperienceDialog(false);
                              }}
                            >
                              Add Experience
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label htmlFor="education" className="text-sm font-medium text-slate-700">Education</Label>
                    <div className="space-y-4">
                      <div className="p-4 border border-slate-200 rounded-xl bg-white">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-slate-900">MSc Computer Science</h4>
                            <p className="text-sm text-slate-500">University of Technology</p>
                            <div className="flex items-center text-xs text-slate-500 mt-1.5">
                              <Calendar className="h-3.5 w-3.5 mr-1" />
                              2016 - 2018
                            </div>
                          </div>
                          <Button size="sm" variant="ghost" className="text-slate-500 hover:text-blue-600 p-2 h-8 w-8">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Dialog open={isEducationDialogOpen} onOpenChange={toggleEducationDialog}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="w-full rounded-xl h-10 gap-1.5 text-sm border-dashed border-slate-300 hover:border-blue-300 hover:text-blue-600 text-slate-500">
                            <Plus className="h-4 w-4" />
                            Add Education
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[525px] p-0 overflow-hidden border-none shadow-xl rounded-2xl bg-white animate-in fade-in-0 zoom-in-95">
                          <div className="relative py-4 px-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600">
                            <DialogTitle className="text-xl font-bold text-white flex items-center">
                              <GraduationCap className="h-5 w-5 mr-2" />
                              Add Education
                            </DialogTitle>
                            <DialogDescription className="text-blue-100 mt-1">
                              Add your educational background
                            </DialogDescription>
                          </div>
                          <div className="p-6">
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="degree">Degree / Certificate</Label>
                                <Input 
                                  id="degree" 
                                  placeholder="e.g. Bachelor of Science in Computer Science" 
                                  className="bg-white border-slate-200"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="school">School / University</Label>
                                <Input 
                                  id="school" 
                                  placeholder="e.g. University of Technology" 
                                  className="bg-white border-slate-200"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edu-start-date">Start Year</Label>
                                  <Input 
                                    id="edu-start-date" 
                                    type="number"
                                    placeholder="e.g. 2016"
                                    className="bg-white border-slate-200"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edu-end-date">End Year (or expected)</Label>
                                  <Input 
                                    id="edu-end-date" 
                                    type="number"
                                    placeholder="e.g. 2020"
                                    className="bg-white border-slate-200"
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="field-of-study">Field of Study (Optional)</Label>
                                <Input 
                                  id="field-of-study" 
                                  placeholder="e.g. Computer Science" 
                                  className="bg-white border-slate-200"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edu-description">Description (Optional)</Label>
                                <Textarea 
                                  id="edu-description" 
                                  placeholder="Additional details about your education"
                                  className="resize-none bg-white border-slate-200 min-h-[100px]"
                                />
                              </div>
                            </div>
                          </div>
                          <DialogFooter className="p-6 pt-0 flex gap-3 border-t border-slate-100 mt-3">
                            <Button
                              variant="outline"
                              className="flex-1 border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-200"
                              onClick={() => toggleEducationDialog(false)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-xl"
                              onClick={() => {
                                // Add education logic would go here
                                toggleEducationDialog(false);
                              }}
                            >
                              Add Education
                            </Button>
                          </DialogFooter>
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
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm hover:shadow-md transition-all duration-200">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
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
                      <Input id="website" defaultValue="https://johndoe.dev" className="bg-white border-slate-200" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Github className="h-4 w-4 text-slate-600" />
                        <Label htmlFor="github">GitHub</Label>
                      </div>
                      <Input id="github" defaultValue="github.com/johndoe" className="bg-white border-slate-200" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Linkedin className="h-4 w-4 text-slate-600" />
                        <Label htmlFor="linkedin">LinkedIn</Label>
                      </div>
                      <Input id="linkedin" defaultValue="linkedin.com/in/johndoe" className="bg-white border-slate-200" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Twitter className="h-4 w-4 text-slate-600" />
                        <Label htmlFor="twitter">Twitter</Label>
                      </div>
                      <Input id="twitter" defaultValue="twitter.com/johndoe" className="bg-white border-slate-200" />
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
    </div>
  )
} 