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
import { useState } from "react"

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
                        <SelectTrigger className="bg-white border-slate-200 h-10">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[280px]">
                          <SelectItem value="af">Afghanistan</SelectItem>
                          <SelectItem value="al">Albania</SelectItem>
                          <SelectItem value="dz">Algeria</SelectItem>
                          <SelectItem value="ad">Andorra</SelectItem>
                          <SelectItem value="ao">Angola</SelectItem>
                          <SelectItem value="ag">Antigua and Barbuda</SelectItem>
                          <SelectItem value="ar">Argentina</SelectItem>
                          <SelectItem value="am">Armenia</SelectItem>
                          <SelectItem value="au">Australia</SelectItem>
                          <SelectItem value="at">Austria</SelectItem>
                          <SelectItem value="az">Azerbaijan</SelectItem>
                          <SelectItem value="bs">Bahamas</SelectItem>
                          <SelectItem value="bh">Bahrain</SelectItem>
                          <SelectItem value="bd">Bangladesh</SelectItem>
                          <SelectItem value="bb">Barbados</SelectItem>
                          <SelectItem value="by">Belarus</SelectItem>
                          <SelectItem value="be">Belgium</SelectItem>
                          <SelectItem value="bz">Belize</SelectItem>
                          <SelectItem value="bj">Benin</SelectItem>
                          <SelectItem value="bt">Bhutan</SelectItem>
                          <SelectItem value="bo">Bolivia</SelectItem>
                          <SelectItem value="ba">Bosnia and Herzegovina</SelectItem>
                          <SelectItem value="bw">Botswana</SelectItem>
                          <SelectItem value="br">Brazil</SelectItem>
                          <SelectItem value="bn">Brunei</SelectItem>
                          <SelectItem value="bg">Bulgaria</SelectItem>
                          <SelectItem value="bf">Burkina Faso</SelectItem>
                          <SelectItem value="bi">Burundi</SelectItem>
                          <SelectItem value="cv">Cabo Verde</SelectItem>
                          <SelectItem value="kh">Cambodia</SelectItem>
                          <SelectItem value="cm">Cameroon</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="cf">Central African Republic</SelectItem>
                          <SelectItem value="td">Chad</SelectItem>
                          <SelectItem value="cl">Chile</SelectItem>
                          <SelectItem value="cn">China</SelectItem>
                          <SelectItem value="co">Colombia</SelectItem>
                          <SelectItem value="km">Comoros</SelectItem>
                          <SelectItem value="cg">Congo</SelectItem>
                          <SelectItem value="cr">Costa Rica</SelectItem>
                          <SelectItem value="hr">Croatia</SelectItem>
                          <SelectItem value="cu">Cuba</SelectItem>
                          <SelectItem value="cy">Cyprus</SelectItem>
                          <SelectItem value="cz">Czech Republic</SelectItem>
                          <SelectItem value="dk">Denmark</SelectItem>
                          <SelectItem value="dj">Djibouti</SelectItem>
                          <SelectItem value="dm">Dominica</SelectItem>
                          <SelectItem value="do">Dominican Republic</SelectItem>
                          <SelectItem value="ec">Ecuador</SelectItem>
                          <SelectItem value="eg">Egypt</SelectItem>
                          <SelectItem value="sv">El Salvador</SelectItem>
                          <SelectItem value="gq">Equatorial Guinea</SelectItem>
                          <SelectItem value="er">Eritrea</SelectItem>
                          <SelectItem value="ee">Estonia</SelectItem>
                          <SelectItem value="et">Ethiopia</SelectItem>
                          <SelectItem value="fj">Fiji</SelectItem>
                          <SelectItem value="fi">Finland</SelectItem>
                          <SelectItem value="fr">France</SelectItem>
                          <SelectItem value="ga">Gabon</SelectItem>
                          <SelectItem value="gm">Gambia</SelectItem>
                          <SelectItem value="ge">Georgia</SelectItem>
                          <SelectItem value="de">Germany</SelectItem>
                          <SelectItem value="gh">Ghana</SelectItem>
                          <SelectItem value="gr">Greece</SelectItem>
                          <SelectItem value="gd">Grenada</SelectItem>
                          <SelectItem value="gt">Guatemala</SelectItem>
                          <SelectItem value="gn">Guinea</SelectItem>
                          <SelectItem value="gw">Guinea-Bissau</SelectItem>
                          <SelectItem value="gy">Guyana</SelectItem>
                          <SelectItem value="ht">Haiti</SelectItem>
                          <SelectItem value="hn">Honduras</SelectItem>
                          <SelectItem value="hu">Hungary</SelectItem>
                          <SelectItem value="is">Iceland</SelectItem>
                          <SelectItem value="in">India</SelectItem>
                          <SelectItem value="id">Indonesia</SelectItem>
                          <SelectItem value="ir">Iran</SelectItem>
                          <SelectItem value="iq">Iraq</SelectItem>
                          <SelectItem value="ie">Ireland</SelectItem>
                          <SelectItem value="il">Israel</SelectItem>
                          <SelectItem value="it">Italy</SelectItem>
                          <SelectItem value="jm">Jamaica</SelectItem>
                          <SelectItem value="jp">Japan</SelectItem>
                          <SelectItem value="jo">Jordan</SelectItem>
                          <SelectItem value="kz">Kazakhstan</SelectItem>
                          <SelectItem value="ke">Kenya</SelectItem>
                          <SelectItem value="ki">Kiribati</SelectItem>
                          <SelectItem value="kp">North Korea</SelectItem>
                          <SelectItem value="kr">South Korea</SelectItem>
                          <SelectItem value="kw">Kuwait</SelectItem>
                          <SelectItem value="kg">Kyrgyzstan</SelectItem>
                          <SelectItem value="la">Laos</SelectItem>
                          <SelectItem value="lv">Latvia</SelectItem>
                          <SelectItem value="lb">Lebanon</SelectItem>
                          <SelectItem value="ls">Lesotho</SelectItem>
                          <SelectItem value="lr">Liberia</SelectItem>
                          <SelectItem value="ly">Libya</SelectItem>
                          <SelectItem value="li">Liechtenstein</SelectItem>
                          <SelectItem value="lt">Lithuania</SelectItem>
                          <SelectItem value="lu">Luxembourg</SelectItem>
                          <SelectItem value="mg">Madagascar</SelectItem>
                          <SelectItem value="mw">Malawi</SelectItem>
                          <SelectItem value="my">Malaysia</SelectItem>
                          <SelectItem value="mv">Maldives</SelectItem>
                          <SelectItem value="ml">Mali</SelectItem>
                          <SelectItem value="mt">Malta</SelectItem>
                          <SelectItem value="mh">Marshall Islands</SelectItem>
                          <SelectItem value="mr">Mauritania</SelectItem>
                          <SelectItem value="mu">Mauritius</SelectItem>
                          <SelectItem value="mx">Mexico</SelectItem>
                          <SelectItem value="fm">Micronesia</SelectItem>
                          <SelectItem value="md">Moldova</SelectItem>
                          <SelectItem value="mc">Monaco</SelectItem>
                          <SelectItem value="mn">Mongolia</SelectItem>
                          <SelectItem value="me">Montenegro</SelectItem>
                          <SelectItem value="ma">Morocco</SelectItem>
                          <SelectItem value="mz">Mozambique</SelectItem>
                          <SelectItem value="mm">Myanmar</SelectItem>
                          <SelectItem value="na">Namibia</SelectItem>
                          <SelectItem value="nr">Nauru</SelectItem>
                          <SelectItem value="np">Nepal</SelectItem>
                          <SelectItem value="nl">Netherlands</SelectItem>
                          <SelectItem value="nz">New Zealand</SelectItem>
                          <SelectItem value="ni">Nicaragua</SelectItem>
                          <SelectItem value="ne">Niger</SelectItem>
                          <SelectItem value="ng">Nigeria</SelectItem>
                          <SelectItem value="no">Norway</SelectItem>
                          <SelectItem value="om">Oman</SelectItem>
                          <SelectItem value="pk">Pakistan</SelectItem>
                          <SelectItem value="pw">Palau</SelectItem>
                          <SelectItem value="pa">Panama</SelectItem>
                          <SelectItem value="pg">Papua New Guinea</SelectItem>
                          <SelectItem value="py">Paraguay</SelectItem>
                          <SelectItem value="pe">Peru</SelectItem>
                          <SelectItem value="ph">Philippines</SelectItem>
                          <SelectItem value="pl">Poland</SelectItem>
                          <SelectItem value="pt">Portugal</SelectItem>
                          <SelectItem value="qa">Qatar</SelectItem>
                          <SelectItem value="ro">Romania</SelectItem>
                          <SelectItem value="ru">Russia</SelectItem>
                          <SelectItem value="rw">Rwanda</SelectItem>
                          <SelectItem value="kn">Saint Kitts and Nevis</SelectItem>
                          <SelectItem value="lc">Saint Lucia</SelectItem>
                          <SelectItem value="vc">Saint Vincent and the Grenadines</SelectItem>
                          <SelectItem value="ws">Samoa</SelectItem>
                          <SelectItem value="sm">San Marino</SelectItem>
                          <SelectItem value="st">Sao Tome and Principe</SelectItem>
                          <SelectItem value="sa">Saudi Arabia</SelectItem>
                          <SelectItem value="sn">Senegal</SelectItem>
                          <SelectItem value="rs">Serbia</SelectItem>
                          <SelectItem value="sc">Seychelles</SelectItem>
                          <SelectItem value="sl">Sierra Leone</SelectItem>
                          <SelectItem value="sg">Singapore</SelectItem>
                          <SelectItem value="sk">Slovakia</SelectItem>
                          <SelectItem value="si">Slovenia</SelectItem>
                          <SelectItem value="sb">Solomon Islands</SelectItem>
                          <SelectItem value="so">Somalia</SelectItem>
                          <SelectItem value="za">South Africa</SelectItem>
                          <SelectItem value="ss">South Sudan</SelectItem>
                          <SelectItem value="es">Spain</SelectItem>
                          <SelectItem value="lk">Sri Lanka</SelectItem>
                          <SelectItem value="sd">Sudan</SelectItem>
                          <SelectItem value="sr">Suriname</SelectItem>
                          <SelectItem value="sz">Swaziland</SelectItem>
                          <SelectItem value="se">Sweden</SelectItem>
                          <SelectItem value="ch">Switzerland</SelectItem>
                          <SelectItem value="sy">Syria</SelectItem>
                          <SelectItem value="tw">Taiwan</SelectItem>
                          <SelectItem value="tj">Tajikistan</SelectItem>
                          <SelectItem value="tz">Tanzania</SelectItem>
                          <SelectItem value="th">Thailand</SelectItem>
                          <SelectItem value="tl">Timor-Leste</SelectItem>
                          <SelectItem value="tg">Togo</SelectItem>
                          <SelectItem value="to">Tonga</SelectItem>
                          <SelectItem value="tt">Trinidad and Tobago</SelectItem>
                          <SelectItem value="tn">Tunisia</SelectItem>
                          <SelectItem value="tr">Turkey</SelectItem>
                          <SelectItem value="tm">Turkmenistan</SelectItem>
                          <SelectItem value="tv">Tuvalu</SelectItem>
                          <SelectItem value="ug">Uganda</SelectItem>
                          <SelectItem value="ua">Ukraine</SelectItem>
                          <SelectItem value="ae">United Arab Emirates</SelectItem>
                          <SelectItem value="gb">United Kingdom</SelectItem>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="uy">Uruguay</SelectItem>
                          <SelectItem value="uz">Uzbekistan</SelectItem>
                          <SelectItem value="vu">Vanuatu</SelectItem>
                          <SelectItem value="va">Vatican City</SelectItem>
                          <SelectItem value="ve">Venezuela</SelectItem>
                          <SelectItem value="vn">Vietnam</SelectItem>
                          <SelectItem value="ye">Yemen</SelectItem>
                          <SelectItem value="zm">Zambia</SelectItem>
                          <SelectItem value="zw">Zimbabwe</SelectItem>
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
                      <Dialog open={isSkillDialogOpen} onOpenChange={setIsSkillDialogOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="rounded-lg h-8 gap-1 text-sm border-dashed border-slate-300 hover:border-blue-300 hover:text-blue-600 text-slate-500">
                            <Plus className="h-3.5 w-3.5" />
                            Add Skill
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden border-none shadow-xl rounded-2xl bg-white animate-in fade-in-0 zoom-in-95">
                          <div className="relative py-4 px-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600">
                            <DialogTitle className="text-xl font-bold text-white flex items-center">
                              <Award className="h-5 w-5 mr-2" />
                              Add New Skill
                            </DialogTitle>
                            <DialogDescription className="text-blue-100 mt-1">
                              Add a new technical skill to your profile
                            </DialogDescription>
                          </div>
                          <div className="p-6">
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="skill">Skill Name</Label>
                                <Input 
                                  id="skill" 
                                  placeholder="e.g. React, Python, Adobe XD" 
                                  className="bg-white border-slate-200"
                                  value={newSkill}
                                  onChange={(e) => setNewSkill(e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                          <DialogFooter className="p-6 pt-0 flex gap-3 border-t border-slate-100 mt-3">
                            <Button
                              variant="outline"
                              className="flex-1 border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-200"
                              onClick={() => setIsSkillDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-xl"
                              disabled={!newSkill.trim()}
                              onClick={() => {
                                // Add skill logic would go here
                                setNewSkill("");
                                setIsSkillDialogOpen(false);
                              }}
                            >
                              Add Skill
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
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
                      <Dialog open={isCertificationDialogOpen} onOpenChange={setIsCertificationDialogOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="rounded-lg h-8 gap-1 text-sm border-dashed border-slate-300 hover:border-blue-300 hover:text-blue-600 text-slate-500">
                            <Plus className="h-3.5 w-3.5" />
                            Add Certification
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden border-none shadow-xl rounded-2xl bg-white animate-in fade-in-0 zoom-in-95">
                          <div className="relative py-4 px-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600">
                            <DialogTitle className="text-xl font-bold text-white flex items-center">
                              <Award className="h-5 w-5 mr-2" />
                              Add New Certification
                            </DialogTitle>
                            <DialogDescription className="text-blue-100 mt-1">
                              Add a professional certification to your profile
                            </DialogDescription>
                          </div>
                          <div className="p-6">
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="certification">Certification Name</Label>
                                <Input 
                                  id="certification" 
                                  placeholder="e.g. AWS Solutions Architect" 
                                  className="bg-white border-slate-200"
                                  value={newCertification}
                                  onChange={(e) => setNewCertification(e.target.value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="cert-date">Issue Date</Label>
                                <Input 
                                  id="cert-date" 
                                  type="date"
                                  className="bg-white border-slate-200"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="cert-expiry">Expiration Date (Optional)</Label>
                                <Input 
                                  id="cert-expiry" 
                                  type="date"
                                  className="bg-white border-slate-200"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="cert-issuer">Issuing Organization</Label>
                                <Input 
                                  id="cert-issuer" 
                                  placeholder="e.g. Amazon Web Services"
                                  className="bg-white border-slate-200"
                                />
                              </div>
                            </div>
                          </div>
                          <DialogFooter className="p-6 pt-0 flex gap-3 border-t border-slate-100 mt-3">
                            <Button
                              variant="outline"
                              className="flex-1 border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-200"
                              onClick={() => setIsCertificationDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-xl"
                              disabled={!newCertification.trim()}
                              onClick={() => {
                                // Add certification logic would go here
                                setNewCertification("");
                                setIsCertificationDialogOpen(false);
                              }}
                            >
                              Add Certification
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
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
                      <Dialog open={isLanguageDialogOpen} onOpenChange={setIsLanguageDialogOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="rounded-lg h-8 gap-1 text-sm border-dashed border-slate-300 hover:border-blue-300 hover:text-blue-600 text-slate-500">
                            <Plus className="h-3.5 w-3.5" />
                            Add Language
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
                              onClick={() => setIsLanguageDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-xl"
                              disabled={!newLanguage.trim()}
                              onClick={() => {
                                // Add language logic would go here
                                setNewLanguage("");
                                setNewLanguageLevel("Intermediate");
                                setIsLanguageDialogOpen(false);
                              }}
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
                      <Dialog open={isExperienceDialogOpen} onOpenChange={setIsExperienceDialogOpen}>
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
                                setIsExperienceDialogOpen(false);
                              }}
                            >
                              Cancel
                            </Button>
                            <Button 
                              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-xl"
                              onClick={() => {
                                // Add work experience logic would go here
                                setCurrentlyWorking(false);
                                setIsExperienceDialogOpen(false);
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
                      <Dialog open={isEducationDialogOpen} onOpenChange={setIsEducationDialogOpen}>
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
                              onClick={() => setIsEducationDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-xl"
                              onClick={() => {
                                // Add education logic would go here
                                setIsEducationDialogOpen(false);
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