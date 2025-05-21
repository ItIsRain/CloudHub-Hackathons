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

export default function SettingsDashboard() {
  return (
    <div className="space-y-6 px-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-200/60 [mask-image:linear-gradient(to_bottom,white,transparent)] pointer-events-none opacity-40"></div>
      
      {/* Banner Card */}
      <div className="relative rounded-2xl overflow-hidden shadow-xl z-10">
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
              <Sparkles className="h-3.5 w-3.5 text-blue-100" />
              <span className="text-xs font-medium text-blue-50">Personal Dashboard</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white">
              Settings <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-indigo-200 to-violet-200">& Preferences</span>
            </h1>
            <p className="text-blue-100 mt-2 max-w-2xl text-sm md:text-base mb-6">
              Customize your profile, manage your skills, and update your personal information
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-8 z-10">
        {/* Profile Card */}
        <Card className="border-none shadow-xl rounded-3xl overflow-hidden backdrop-blur-sm bg-white/80">
          <CardHeader className="border-b border-slate-100 bg-white/60 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Profile</CardTitle>
                <CardDescription className="text-slate-600 mt-1">Your personal information and photo</CardDescription>
              </div>
              <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900">
                <UserCog className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-10 px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-start gap-12">
              <div className="flex flex-col items-center space-y-5">
                <div className="relative group">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 blur-xl opacity-40 group-hover:opacity-70 transition-all duration-300"></div>
                  <Avatar className="h-40 w-40 border-4 border-white shadow-2xl transition-all duration-300 group-hover:scale-105 relative">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" className="object-cover" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-6xl">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    className="absolute bottom-1 right-1 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 bg-white backdrop-blur-sm border-2 border-white size-10"
                  >
                    <Camera className="h-4 w-4 text-blue-600" />
                  </Button>
                </div>
                <div className="text-center space-y-2.5">
                  <h3 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">John Doe</h3>
                  <p className="text-sm text-slate-600">Full Stack Developer</p>
                  <Badge className="mt-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-1 rounded-full shadow-sm">
                    Pro Member
                  </Badge>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 md:mt-0">
                <div className="space-y-5">
                  <div className="flex items-center gap-4 text-slate-600 hover:text-blue-600 transition-all group p-3 rounded-xl hover:bg-blue-50/50">
                    <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs text-slate-500 font-medium">Email</p>
                      <span className="text-sm font-medium">john.doe@example.com</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-slate-600 hover:text-blue-600 transition-all group p-3 rounded-xl hover:bg-blue-50/50">
                    <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs text-slate-500 font-medium">Phone</p>
                      <span className="text-sm font-medium">+1 (555) 123-4567</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-slate-600 hover:text-blue-600 transition-all group p-3 rounded-xl hover:bg-blue-50/50">
                    <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs text-slate-500 font-medium">Location</p>
                      <span className="text-sm font-medium">San Francisco, CA</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-5">
                  <div className="flex items-center gap-4 text-slate-600 hover:text-blue-600 transition-all group p-3 rounded-xl hover:bg-blue-50/50">
                    <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs text-slate-500 font-medium">Company</p>
                      <span className="text-sm font-medium">Tech Corp Inc.</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-slate-600 hover:text-blue-600 transition-all group p-3 rounded-xl hover:bg-blue-50/50">
                    <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs text-slate-500 font-medium">Experience</p>
                      <span className="text-sm font-medium">5+ years experience</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-slate-600 hover:text-blue-600 transition-all group p-3 rounded-xl hover:bg-blue-50/50">
                    <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                      <Globe className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs text-slate-500 font-medium">Website</p>
                      <span className="text-sm font-medium">johndoe.dev</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Settings */}
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="w-full bg-white/80 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-200/70 shadow-lg mb-6">
            <TabsTrigger 
              value="personal" 
              className="flex items-center gap-2 flex-1 text-sm font-medium py-3 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:via-indigo-500 data-[state=active]:to-violet-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl transition-all duration-200"
            >
              <UserCog className="h-4 w-4" />
              Personal Info
            </TabsTrigger>
            <TabsTrigger 
              value="skills" 
              className="flex items-center gap-2 flex-1 text-sm font-medium py-3 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:via-indigo-500 data-[state=active]:to-violet-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl transition-all duration-200"
            >
              <Award className="h-4 w-4" />
              Skills
            </TabsTrigger>
            <TabsTrigger 
              value="social" 
              className="flex items-center gap-2 flex-1 text-sm font-medium py-3 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:via-indigo-500 data-[state=active]:to-violet-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl transition-all duration-200"
            >
              <Globe2 className="h-4 w-4" />
              Social Links
            </TabsTrigger>
          </TabsList>

          <div>
            {/* Tab content with all the settings panels */}
            {/* This includes the remaining content from the original settings page */}
            {/* Tab content will go here */}
          </div>
        </Tabs>
      </div>
    </div>
  )
} 