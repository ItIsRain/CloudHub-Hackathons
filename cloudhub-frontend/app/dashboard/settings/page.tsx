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
  Globe2
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const metadata: Metadata = {
  title: "Settings | CloudHub",
  description: "Manage your profile settings and preferences",
}

export default function SettingsPage() {
  return (
    <div className="flex flex-col h-full bg-white p-6 space-y-6">
      {/* Banner Card */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl">
        <div className="relative py-12 px-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600"></div>
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-2/3 h-1/2 bg-gradient-to-t from-blue-400/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-10 right-[20%] w-16 h-16 rounded-lg bg-gradient-to-tr from-blue-500/40 to-transparent backdrop-blur-sm border border-white/20 animate-float-slow"></div>
          <div className="absolute top-1/2 right-[40%] w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/30 to-transparent backdrop-blur-sm border border-white/20 animate-float-slow animate-delay-500"></div>
          <div className="absolute bottom-10 left-[30%] w-14 h-14 rounded-lg bg-gradient-to-tl from-violet-500/30 to-transparent backdrop-blur-sm border border-white/20 animate-float-slow animate-delay-700"></div>
          
          <div className="relative z-10 flex flex-col">
            <h1 className="text-4xl font-bold text-white md:text-5xl">
              Settings <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-indigo-200 to-violet-200">& Preferences</span>
            </h1>
            <p className="text-blue-100 mt-3 max-w-2xl text-lg">
              Customize your profile, manage your skills, and update your personal information
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-8">
        {/* Profile Card */}
        <Card className="border-slate-200 shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-slate-200 bg-white">
            <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Profile</CardTitle>
            <CardDescription className="text-slate-600">Your personal information and photo</CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="flex items-start gap-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <Avatar className="h-36 w-36 border-4 border-white shadow-xl transition-all duration-300 group-hover:scale-105 relative">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-5xl">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-0 right-0 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 bg-white/90 backdrop-blur-sm border-2 border-white"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">John Doe</h3>
                  <p className="text-sm text-slate-600 mt-1">Full Stack Developer</p>
                  <Badge className="mt-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-1 rounded-full shadow-sm">
                    Pro Member
                  </Badge>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-8">
                <div className="space-y-5">
                  <div className="flex items-center gap-4 text-slate-600 hover:text-blue-600 transition-colors group">
                    <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-blue-50 transition-colors">
                      <Mail className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium">john.doe@example.com</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-600 hover:text-blue-600 transition-colors group">
                    <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-blue-50 transition-colors">
                      <Phone className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium">+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-600 hover:text-blue-600 transition-colors group">
                    <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-blue-50 transition-colors">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium">San Francisco, CA</span>
                  </div>
                </div>
                <div className="space-y-5">
                  <div className="flex items-center gap-4 text-slate-600 hover:text-blue-600 transition-colors group">
                    <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-blue-50 transition-colors">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium">Tech Corp Inc.</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-600 hover:text-blue-600 transition-colors group">
                    <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-blue-50 transition-colors">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium">5+ years experience</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-600 hover:text-blue-600 transition-colors group">
                    <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-blue-50 transition-colors">
                      <Globe className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium">https://johndoe.dev</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Settings */}
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="w-full bg-white p-2 rounded-2xl border border-slate-200 shadow-lg">
            <TabsTrigger 
              value="personal" 
              className="flex-1 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:via-indigo-500 data-[state=active]:to-violet-500 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-xl transition-all duration-200"
            >
              Personal Info
            </TabsTrigger>
            <TabsTrigger 
              value="skills" 
              className="flex-1 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:via-indigo-500 data-[state=active]:to-violet-500 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-xl transition-all duration-200"
            >
              Skills
            </TabsTrigger>
            <TabsTrigger 
              value="social" 
              className="flex-1 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:via-indigo-500 data-[state=active]:to-violet-500 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-xl transition-all duration-200"
            >
              Social Links
            </TabsTrigger>
            <TabsTrigger 
              value="preferences" 
              className="flex-1 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:via-indigo-500 data-[state=active]:to-violet-500 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-xl transition-all duration-200"
            >
              Preferences
            </TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <TabsContent value="personal" className="m-0">
              <Card className="border-slate-200 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-slate-200 bg-white">
                  <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Personal Information</CardTitle>
                  <CardDescription className="text-slate-600">Update your personal details and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium text-slate-700">First Name</Label>
                      <Input id="firstName" defaultValue="John" className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium text-slate-700">Last Name</Label>
                      <Input id="lastName" defaultValue="Doe" className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email</Label>
                    <Input id="email" type="email" defaultValue="john.doe@example.com" className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-slate-700">Phone</Label>
                    <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium text-slate-700">Location</Label>
                    <Input id="location" defaultValue="San Francisco, CA" className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-sm font-medium text-slate-700">Company</Label>
                    <Input id="company" defaultValue="Tech Corp Inc." className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position" className="text-sm font-medium text-slate-700">Position</Label>
                    <Input id="position" defaultValue="Senior Full Stack Developer" className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-sm font-medium text-slate-700">Bio</Label>
                    <Textarea 
                      id="bio" 
                      defaultValue="Full stack developer with 5+ years of experience in building modern web applications. Passionate about creating intuitive user experiences and scalable solutions."
                      className="min-h-[100px] bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="languages" className="text-sm font-medium text-slate-700">Languages</Label>
                    <Select defaultValue="english">
                      <SelectTrigger className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20">
                        <SelectValue placeholder="Select primary language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="german">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl py-6">
                    <Save className="h-5 w-5 mr-2" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills" className="m-0">
              <Card className="border-slate-200 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-slate-200 bg-white">
                  <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Skills & Expertise</CardTitle>
                  <CardDescription className="text-slate-600">Add and manage your technical skills and expertise</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-8">
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 hover:from-blue-600 hover:to-indigo-600 transition-colors">
                        React
                        <X className="h-3 w-3 ml-1 cursor-pointer hover:text-red-200" />
                      </Badge>
                      <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 hover:from-blue-600 hover:to-indigo-600 transition-colors">
                        TypeScript
                        <X className="h-3 w-3 ml-1 cursor-pointer hover:text-red-200" />
                      </Badge>
                      <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 hover:from-blue-600 hover:to-indigo-600 transition-colors">
                        Node.js
                        <X className="h-3 w-3 ml-1 cursor-pointer hover:text-red-200" />
                      </Badge>
                      <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 hover:from-blue-600 hover:to-indigo-600 transition-colors">
                        Python
                        <X className="h-3 w-3 ml-1 cursor-pointer hover:text-red-200" />
                      </Badge>
                      <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 hover:from-blue-600 hover:to-indigo-600 transition-colors">
                        AWS
                        <X className="h-3 w-3 ml-1 cursor-pointer hover:text-red-200" />
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Input placeholder="Add a new skill" className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20" />
                      <Button className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl py-6">
                        <Plus className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-900">Expertise Level</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-700">Frontend Development</span>
                          <span className="text-slate-500">Expert</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full w-[90%] bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-700">Backend Development</span>
                          <span className="text-slate-500">Advanced</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full w-[75%] bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-700">DevOps</span>
                          <span className="text-slate-500">Intermediate</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full w-[60%] bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-900">Certifications</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-blue-200 transition-colors bg-white">
                        <div className="flex items-center gap-3">
                          <Award className="h-5 w-5 text-blue-500" />
                          <div>
                            <h5 className="font-medium text-slate-900">AWS Certified Developer</h5>
                            <p className="text-sm text-slate-500">Issued by Amazon Web Services</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-slate-200">2023</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-blue-200 transition-colors bg-white">
                        <div className="flex items-center gap-3">
                          <Award className="h-5 w-5 text-blue-500" />
                          <div>
                            <h5 className="font-medium text-slate-900">Google Cloud Professional</h5>
                            <p className="text-sm text-slate-500">Issued by Google Cloud</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-slate-200">2022</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social" className="m-0">
              <Card className="border-slate-200 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-slate-200 bg-white">
                  <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Social Links</CardTitle>
                  <CardDescription className="text-slate-600">Connect your social media profiles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Github className="h-5 w-5 text-slate-600" />
                      <Input placeholder="GitHub Profile URL" defaultValue="https://github.com/johndoe" className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20" />
                    </div>
                    <div className="flex items-center gap-3">
                      <Linkedin className="h-5 w-5 text-slate-600" />
                      <Input placeholder="LinkedIn Profile URL" defaultValue="https://linkedin.com/in/johndoe" className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20" />
                    </div>
                    <div className="flex items-center gap-3">
                      <Twitter className="h-5 w-5 text-slate-600" />
                      <Input placeholder="Twitter Profile URL" defaultValue="https://twitter.com/johndoe" className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20" />
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-slate-600" />
                      <Input placeholder="Personal Website" defaultValue="https://johndoe.dev" className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20" />
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl py-6">
                    <Save className="h-5 w-5 mr-2" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="m-0">
              <Card className="border-slate-200 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-slate-200 bg-white">
                  <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Preferences</CardTitle>
                  <CardDescription className="text-slate-600">Customize your experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-blue-200 transition-colors bg-white">
                      <div className="space-y-0.5">
                        <Label className="text-slate-900">Email Notifications</Label>
                        <p className="text-sm text-slate-500">Receive email updates about your account</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-blue-200 transition-colors bg-white">
                      <div className="space-y-0.5">
                        <Label className="text-slate-900">Push Notifications</Label>
                        <p className="text-sm text-slate-500">Receive push notifications in your browser</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-blue-200 transition-colors bg-white">
                      <div className="space-y-0.5">
                        <Label className="text-slate-900">Dark Mode</Label>
                        <p className="text-sm text-slate-500">Switch between light and dark themes</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-900">Language & Region</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="language" className="text-sm font-medium text-slate-700">Language</Label>
                        <Select defaultValue="english">
                          <SelectTrigger className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="spanish">Spanish</SelectItem>
                            <SelectItem value="french">French</SelectItem>
                            <SelectItem value="german">German</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timezone" className="text-sm font-medium text-slate-700">Timezone</Label>
                        <Select defaultValue="pst">
                          <SelectTrigger className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20">
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                            <SelectItem value="est">Eastern Time (EST)</SelectItem>
                            <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                            <SelectItem value="cet">Central European Time (CET)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl py-6">
                    <Save className="h-5 w-5 mr-2" />
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
} 