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
    <div className="space-y-6 px-6 pb-6">
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
            </div>
          </CardHeader>
          <CardContent className="pt-10 px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-start gap-12">
              <div className="flex flex-col items-center space-y-5">
                <div className="relative">
                  <Avatar className="h-40 w-40 border-4 border-white shadow-lg relative">
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
            
            {/* Personal Info Tab */}
            <TabsContent value="personal" className="space-y-6">
              <Card className="border-none shadow-lg rounded-3xl overflow-hidden backdrop-blur-sm bg-white/80">
                <CardHeader className="border-b border-slate-100 bg-white/60 px-8 py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Personal Information</CardTitle>
                      <CardDescription className="text-slate-600 mt-1">Update your personal details</CardDescription>
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
                        <SelectTrigger className="bg-white border-slate-200">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="au">Australia</SelectItem>
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
                      {["React", "TypeScript", "Node.js", "Next.js", "GraphQL", "MongoDB", "AWS", "Docker", "CI/CD", "REST API"].map((skill, index) => (
                        <Badge key={index} className="px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors rounded-lg flex items-center gap-1.5">
                          {skill}
                          <X className="h-3 w-3 cursor-pointer hover:text-blue-900" />
                        </Badge>
                      ))}
                      <Button size="sm" variant="outline" className="rounded-lg h-8 gap-1 text-sm border-dashed border-slate-300 hover:border-blue-300 hover:text-blue-600 text-slate-500">
                        <Plus className="h-3.5 w-3.5" />
                        Add Skill
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-slate-700">Professional Certifications</Label>
                    <div className="flex flex-wrap gap-2">
                      {["AWS Solutions Architect", "Google Cloud Professional", "Microsoft Azure Developer"].map((cert, index) => (
                        <Badge key={index} className="px-3 py-1.5 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors rounded-lg flex items-center gap-1.5">
                          {cert}
                          <X className="h-3 w-3 cursor-pointer hover:text-indigo-900" />
                        </Badge>
                      ))}
                      <Button size="sm" variant="outline" className="rounded-lg h-8 gap-1 text-sm border-dashed border-slate-300 hover:border-blue-300 hover:text-blue-600 text-slate-500">
                        <Plus className="h-3.5 w-3.5" />
                        Add Certification
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-slate-700">Languages</Label>
                    <div className="flex flex-wrap gap-2">
                      {["English (Native)", "Spanish (Intermediate)", "French (Basic)"].map((lang, index) => (
                        <Badge key={index} className="px-3 py-1.5 bg-violet-100 text-violet-700 hover:bg-violet-200 transition-colors rounded-lg flex items-center gap-1.5">
                          {lang}
                          <X className="h-3 w-3 cursor-pointer hover:text-violet-900" />
                        </Badge>
                      ))}
                      <Button size="sm" variant="outline" className="rounded-lg h-8 gap-1 text-sm border-dashed border-slate-300 hover:border-blue-300 hover:text-blue-600 text-slate-500">
                        <Plus className="h-3.5 w-3.5" />
                        Add Language
                      </Button>
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
                      <Button size="sm" variant="outline" className="w-full rounded-xl h-10 gap-1.5 text-sm border-dashed border-slate-300 hover:border-blue-300 hover:text-blue-600 text-slate-500">
                        <Plus className="h-4 w-4" />
                        Add Work Experience
                      </Button>
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
                      <Button size="sm" variant="outline" className="w-full rounded-xl h-10 gap-1.5 text-sm border-dashed border-slate-300 hover:border-blue-300 hover:text-blue-600 text-slate-500">
                        <Plus className="h-4 w-4" />
                        Add Education
                      </Button>
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
                  
                  <div className="pt-2">
                    <Button variant="outline" className="rounded-lg h-10 gap-1.5 text-sm border-dashed border-slate-300 hover:border-blue-300 hover:text-blue-600 text-slate-500">
                      <Plus className="h-4 w-4" />
                      Add More Social Profiles
                    </Button>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-4">
                    <h3 className="font-medium text-slate-900">Profile Visibility</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="text-sm font-medium">Public profile</div>
                          <div className="text-xs text-slate-500">Make your profile visible to everyone</div>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="text-sm font-medium">Show email address</div>
                          <div className="text-xs text-slate-500">Allow others to see your email</div>
                        </div>
                        <Switch />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="text-sm font-medium">Show phone number</div>
                          <div className="text-xs text-slate-500">Allow others to see your phone number</div>
                        </div>
                        <Switch />
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