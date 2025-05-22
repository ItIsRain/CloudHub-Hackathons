import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Plus, MessageSquare, MessageCircle, Sparkles, Search, Users, User, X, Check, Phone, Mail, Globe, Calendar, Building2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Conversation {
  name: string
  avatar: string
  lastMessage: string
  time: string
  unread?: number
}

interface Message {
  content: string
  time: string
  sent: boolean
}

const conversations: Conversation[] = [
  {
    name: "Sarah Wilson",
    avatar: "/placeholder-avatar.jpg",
    lastMessage: "Hey, how's the project coming along?",
    time: "2m ago",
    unread: 2
  },
  {
    name: "Michael Chen",
    avatar: "/placeholder-avatar.jpg",
    lastMessage: "I've sent you the updated design files",
    time: "1h ago"
  },
  {
    name: "Emily Rodriguez",
    avatar: "/placeholder-avatar.jpg",
    lastMessage: "Let's schedule a meeting to discuss the roadmap",
    time: "3h ago"
  }
]

const messages: Message[] = [
  {
    content: "Hey, how's the project coming along?",
    time: "10:30 AM",
    sent: false
  },
  {
    content: "It's going great! I've just finished implementing the new features.",
    time: "10:32 AM",
    sent: true
  },
  {
    content: "That's awesome! Can you share the progress with the team?",
    time: "10:33 AM",
    sent: false
  },
  {
    content: "Sure, I'll prepare a detailed update for tomorrow's meeting.",
    time: "10:35 AM",
    sent: true
  },
  {
    content: "That's awesome! Can you share the progress with the team?",
    time: "10:33 AM",
    sent: false
  },
  {
    content: "That's awesome! Can you share the progress with the team?",
    time: "10:33 AM",
    sent: false
  },
  {
    content: "Sure, I'll prepare a detailed update for tomorrow's meeting.",
    time: "10:35 AM",
    sent: true
  },
  {
    content: "Sure, I'll prepare a detailed update for tomorrow's meeting.",
    time: "10:35 AM",
    sent: true
  },
]

export default function MessagesDashboard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPeople, setSelectedPeople] = useState<string[]>([])
  const [groupName, setGroupName] = useState("")

  const handlePersonSelect = (name: string) => {
    if (selectedPeople.includes(name)) {
      setSelectedPeople(selectedPeople.filter(person => person !== name))
    } else {
      setSelectedPeople([...selectedPeople, name])
    }
  }

  return (
    <div className="flex flex-col h-full min-h-0 space-y-6 px-6 pt-6 pb-6 overflow-hidden bg-white">
      {/* Banner Card */}
      <div className="relative rounded-2xl overflow-hidden shadow-md z-10 flex-shrink-0">
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
              <MessageCircle className="h-3.5 w-3.5 text-blue-100" />
              <span className="text-xs font-medium text-blue-50">Communication Center</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white">
              Messages <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-indigo-200 to-violet-200">& Notifications</span>
            </h1>
            <p className="text-blue-100 mt-2 max-w-2xl text-sm md:text-base mb-6">
              Stay connected with your team and manage your conversations
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 z-10 min-h-0 max-h-[calc(100vh-250px)]">
        {/* Conversations List */}
        <Card className="border-none shadow-md rounded-3xl overflow-hidden bg-white lg:col-span-1 flex flex-col h-full">
          <CardHeader className="border-b border-slate-100 bg-white px-8 py-6 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Conversations</CardTitle>
                <CardDescription className="text-slate-600 mt-1">Your active chats</CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm hover:shadow-md transition-all duration-200 rounded-xl">
                    <Plus className="h-4 w-4 mr-2" />
                    New Chat
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-xl rounded-2xl bg-white animate-in fade-in-0 zoom-in-95">
                  <div className="relative py-8 px-6 overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600">
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
                    <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-blue-400/10 to-transparent rounded-full blur-3xl"></div>
                    <div className="absolute top-10 right-[20%] w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500/30 to-transparent backdrop-blur-md border border-white/20 animate-float-slow"></div>
                    <DialogHeader className="relative z-10">
                      <DialogTitle className="text-2xl font-bold text-white flex items-center">
                        <MessageCircle className="h-5 w-5 mr-2" />
                        New Conversation
                      </DialogTitle>
                      <DialogDescription className="text-blue-100 mt-2">
                        Start a direct message or create a group chat
                      </DialogDescription>
                    </DialogHeader>
                  </div>
                  
                  <Tabs defaultValue="direct" className="w-full">
                    <div className="px-6 pt-6">
                      <TabsList className="w-full grid grid-cols-2 bg-slate-100/70 p-1 rounded-xl">
                        <TabsTrigger value="direct" className="data-[state=active]:bg-white rounded-lg data-[state=active]:shadow-sm transition-all duration-200">
                          <User className="h-4 w-4 mr-2" />
                          Direct Message
                        </TabsTrigger>
                        <TabsTrigger value="group" className="data-[state=active]:bg-white rounded-lg data-[state=active]:shadow-sm transition-all duration-200">
                          <Users className="h-4 w-4 mr-2" />
                          Group Chat
                        </TabsTrigger>
                      </TabsList>
                    </div>
                    
                    <div className="p-6">
                      <div className="mb-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input 
                            placeholder="Search for people..." 
                            className="pl-10 bg-slate-50 border-slate-200 rounded-xl transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <TabsContent value="direct" className="mt-0 space-y-4">
                        <div className="space-y-4 max-h-[240px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-slate-100 mb-6">
                          <div className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">Suggested People</div>
                          
                          {["Jordan Wilson", "Alex Chen", "Taylor Moore"].map((name, i) => (
                            <div 
                              key={i} 
                              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-50/50 cursor-pointer transition-colors duration-200 border border-transparent hover:border-blue-100"
                              onClick={() => handlePersonSelect(name)}
                            >
                              <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                                  {name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="font-medium text-slate-900">{name}</div>
                                <div className="text-xs text-slate-500">Software Developer</div>
                              </div>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className={`rounded-full h-8 w-8 p-0 transition-all duration-200 ${
                                  selectedPeople.includes(name) 
                                    ? "bg-blue-500 border-blue-500 text-white hover:bg-blue-600 hover:border-blue-600" 
                                    : "hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                                }`}
                              >
                                {selectedPeople.includes(name) ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <Plus className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="group" className="mt-0 space-y-4">
                        <div className="mb-4">
                          <Label htmlFor="group-name" className="text-sm font-medium text-slate-700 mb-1.5 block">
                            Group Name
                          </Label>
                          <Input
                            id="group-name"
                            placeholder="Enter group name..."
                            className="bg-slate-50 border-slate-200 rounded-xl transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-slate-100 mb-6">
                          <div className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">Select Members</div>
                          
                          {["Jordan Wilson", "Alex Chen", "Taylor Moore", "Jamie Smith", "Pat Johnson"].map((name, i) => (
                            <div 
                              key={i} 
                              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-50/50 cursor-pointer transition-colors duration-200 border border-transparent hover:border-blue-100"
                              onClick={() => handlePersonSelect(name)}
                            >
                              <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                                  {name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="font-medium text-slate-900">{name}</div>
                                <div className="text-xs text-slate-500">Software Developer</div>
                              </div>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className={`rounded-full h-8 w-8 p-0 transition-all duration-200 ${
                                  selectedPeople.includes(name) 
                                    ? "bg-blue-500 border-blue-500 text-white hover:bg-blue-600 hover:border-blue-600" 
                                    : "hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                                }`}
                              >
                                {selectedPeople.includes(name) ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <Plus className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          ))}
                        </div>
                        
                        {selectedPeople.length > 0 && (
                          <div className="mb-6 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                            <Label className="text-xs font-medium text-blue-700 mb-2 block uppercase tracking-wider">
                              Selected Members ({selectedPeople.length})
                            </Label>
                            <div className="flex flex-wrap gap-2">
                              {selectedPeople.map((name, i) => (
                                <Badge key={i} className="bg-blue-500 hover:bg-blue-600 px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors duration-200">
                                  {name}
                                  <X 
                                    className="h-3 w-3 cursor-pointer ml-1 hover:text-blue-200 transition-colors" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handlePersonSelect(name);
                                    }} 
                                  />
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </TabsContent>
                    </div>
                    
                    <DialogFooter className="p-6 pt-0 flex gap-3 border-t border-slate-100 mt-3">
                      <Button
                        variant="outline"
                        className="flex-1 border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-200"
                        onClick={() => {
                          setIsDialogOpen(false);
                          setSelectedPeople([]);
                          setGroupName("");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-xl"
                        disabled={selectedPeople.length === 0}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Start Chat
                      </Button>
                    </DialogFooter>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-hidden">
            <div className="flex flex-col h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-slate-50 max-h-[calc(100vh-320px)]">
              {conversations.map((conversation, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors cursor-pointer group border-b border-slate-100 last:border-0"
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                      <AvatarImage src={conversation.avatar} alt={conversation.name} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                        {conversation.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.unread && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-blue-600 text-white text-[10px]">
                        {conversation.unread}
                      </Badge>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">{conversation.name}</h4>
                      <span className="text-xs text-slate-500">{conversation.time}</span>
                    </div>
                    <p className="text-sm text-slate-500 truncate">{conversation.lastMessage}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="border-none shadow-md rounded-3xl overflow-hidden bg-white lg:col-span-2 flex flex-col h-full">
          <CardHeader className="border-b border-slate-100 bg-white px-8 py-6 flex-shrink-0">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                <AvatarImage src="/placeholder-avatar.jpg" alt="Sarah Wilson" />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white">SW</AvatarFallback>
              </Avatar>
              <div className="flex-1 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setIsProfileDialogOpen(true)}>
                <CardTitle className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Sarah Wilson</CardTitle>
                <CardDescription className="text-slate-600 mt-1 flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                  Online
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-full hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-200">
                  <Phone className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-full hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M23 7l-7 5 7 5V7z" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                  </svg>
                </Button>
                <Button className="rounded-xl px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
                    <path d="M15 10l5 5-5 5" />
                    <path d="M4 4v7a4 4 0 0 0 4 4h12" />
                  </svg>
                  Start Meeting
                </Button>
              </div>
            </div>
          </CardHeader>
          
          {/* Profile Dialog */}
          <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-xl rounded-2xl bg-white animate-in fade-in-0 zoom-in-95 h-[700px] flex flex-col">
              <DialogHeader className="sr-only">
                <DialogTitle>Sarah Wilson's Profile</DialogTitle>
                <DialogDescription>View details about Sarah Wilson</DialogDescription>
              </DialogHeader>
              <div className="relative py-8 px-6 overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-blue-400/10 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute top-10 right-[20%] w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500/30 to-transparent backdrop-blur-md border border-white/20 animate-float-slow"></div>
                
                <div className="relative z-10 flex items-start gap-5">
                  <Avatar className="h-20 w-20 border-4 border-white/20 shadow-xl">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="Sarah Wilson" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-2xl">SW</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Sarah Wilson</h2>
                    <p className="text-blue-100 mt-1">Senior UX Designer • San Francisco, CA</p>
                    <div className="flex items-center gap-3 mt-4">
                      <Badge className="bg-blue-500/30 text-blue-50 hover:bg-blue-500/40 border-none">
                        Design Lead
                      </Badge>
                      <Badge className="bg-violet-500/30 text-violet-50 hover:bg-violet-500/40 border-none">
                        Team Mentor
                      </Badge>
                      <Badge className="bg-emerald-500/30 text-emerald-50 hover:bg-emerald-500/40 border-none">
                        Available for Projects
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 flex-1 overflow-hidden flex flex-col">
                <Tabs defaultValue="about" className="w-full h-full flex flex-col">
                  <TabsList className="w-full bg-gradient-to-r from-slate-50 via-slate-50 to-slate-50 p-1.5 rounded-xl border border-slate-100 shadow-sm mb-6 sticky top-0 z-10">
                    <TabsTrigger 
                      value="about" 
                      className="flex-1 text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:via-indigo-500 data-[state=active]:to-violet-500 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
                    >
                      About
                    </TabsTrigger>
                    <TabsTrigger 
                      value="skills" 
                      className="flex-1 text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:via-indigo-500 data-[state=active]:to-violet-500 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
                    >
                      Skills & Expertise
                    </TabsTrigger>
                    <TabsTrigger 
                      value="achievements" 
                      className="flex-1 text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:via-indigo-500 data-[state=active]:to-violet-500 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
                    >
                      Achievements
                    </TabsTrigger>
                  </TabsList>
                  
                  <div className="overflow-y-auto pr-2 flex-1 pb-4">
                    <TabsContent value="about" className="mt-0 space-y-5 data-[state=active]:block">
                      <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/30 p-4 rounded-xl border border-blue-100/50">
                        <h3 className="text-sm font-medium text-blue-700 mb-2 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                          Bio
                        </h3>
                        <p className="text-slate-700 text-sm leading-relaxed">
                          Senior UX Designer with 7+ years of experience specializing in product design, interaction design, and design systems. Passionate about creating intuitive and accessible user experiences through research-driven approaches and user-centered design methodologies.
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow transition-all duration-300">
                          <h3 className="text-sm font-medium text-indigo-700 mb-3 flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-indigo-500" />
                            Contact Information
                          </h3>
                          <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <Mail className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="text-xs text-slate-500">Email</div>
                                <div className="text-slate-700 font-medium">sarah.wilson@example.com</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                <Phone className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="text-xs text-slate-500">Phone</div>
                                <div className="text-slate-700 font-medium">(555) 123-4567</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                              <div className="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                                <Globe className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="text-xs text-slate-500">Website</div>
                                <div className="text-slate-700 font-medium">sarahwilsondesign.com</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow transition-all duration-300">
                          <h3 className="text-sm font-medium text-indigo-700 mb-3 flex items-center">
                            <Users className="h-4 w-4 mr-2 text-indigo-500" />
                            Team & Department
                          </h3>
                          <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                              <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                <Users className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="text-xs text-slate-500">Team</div>
                                <div className="text-slate-700 font-medium">Design & Product Team</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <Building2 className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="text-xs text-slate-500">Department</div>
                                <div className="text-slate-700 font-medium">Product Development</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                              <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                <Calendar className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="text-xs text-slate-500">Joined</div>
                                <div className="text-slate-700 font-medium">May 2018</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="skills" className="mt-0 space-y-5 data-[state=active]:block">
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="text-sm font-medium text-indigo-700 mb-3 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2 text-indigo-500">
                            <path d="M2 12h5"></path>
                            <path d="M17 12h5"></path>
                            <path d="M9 6v12"></path>
                            <path d="M15 6v12"></path>
                            <path d="M3 6l3 6-3 6"></path>
                            <path d="M21 6l-3 6 3 6"></path>
                          </svg>
                          Core Skills
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {["UI Design", "UX Research", "Wireframing", "Prototyping", "User Testing", "Design Systems", "Figma", "Adobe XD", "Sketch", "Accessibility"].map((skill, index) => (
                            <Badge key={index} className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none px-3 py-1.5 rounded-lg">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="text-sm font-medium text-indigo-700 mb-3 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2 text-indigo-500">
                            <path d="M12 2v6.5l3-3"></path>
                            <path d="M12 2v6.5l-3-3"></path>
                            <path d="M6 9.5A6.5 6.5 0 0 1 12 3"></path>
                            <path d="M18 9.5A6.5 6.5 0 0 0 12 3"></path>
                            <path d="M12 22v-6.5"></path>
                            <path d="M6 14.5a6.5 6.5 0 0 0 6 6.5"></path>
                            <path d="M18 14.5a6.5 6.5 0 0 1-6 6.5"></path>
                          </svg>
                          Additional Expertise
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {["Motion Design", "Design Thinking", "A/B Testing", "Design Sprint Facilitation", "Information Architecture", "Frontend Development", "React", "HTML/CSS", "Javascript"].map((skill, index) => (
                            <Badge key={index} className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-none px-3 py-1.5 rounded-lg">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="text-sm font-medium text-indigo-700 mb-3 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2 text-indigo-500">
                            <path d="m2 9 3-3 3 3"></path>
                            <path d="M13 18a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"></path>
                            <path d="m22 9-3-3-3 3"></path>
                            <path d="M19 6v10c0 1.1-.9 2-2 2"></path>
                            <path d="M5 6v10c0 1.1.9 2 2 2h6"></path>
                          </svg>
                          Languages
                        </h3>
                        <div className="space-y-3 mt-1">
                          <div className="flex items-center gap-3">
                            <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-200 border-none px-3 py-1.5 rounded-lg">
                              English
                            </Badge>
                            <div className="flex-1">
                              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 w-[100%]"></div>
                              </div>
                            </div>
                            <span className="text-xs text-slate-500">Native</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-200 border-none px-3 py-1.5 rounded-lg">
                              Spanish
                            </Badge>
                            <div className="flex-1">
                              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 w-[60%]"></div>
                              </div>
                            </div>
                            <span className="text-xs text-slate-500">Intermediate</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-200 border-none px-3 py-1.5 rounded-lg">
                              French
                            </Badge>
                            <div className="flex-1">
                              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 w-[30%]"></div>
                              </div>
                            </div>
                            <span className="text-xs text-slate-500">Basic</span>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="achievements" className="mt-0 space-y-5 data-[state=active]:block">
                      <div>
                        <div className="flex items-center mb-4">
                          <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                              <path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.11"></path>
                              <path d="M15 7a4 4 0 1 0-8 0"></path>
                              <path d="M17 14h.352a3 3 0 1 0 0-6H17"></path>
                              <path d="M7 14h-.352a3 3 0 1 1 0-6H7"></path>
                            </svg>
                          </div>
                          <h3 className="text-sm font-medium text-amber-700">Hackathons & Competitions</h3>
                        </div>
                        <div className="space-y-3">
                          <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 p-3 rounded-xl border border-amber-100">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium text-slate-900">CloudHub Design Hackathon</h4>
                                <p className="text-xs text-slate-500 mt-1">1st Place • Design Category</p>
                                <div className="flex items-center text-xs text-slate-500 mt-1">
                                  <Calendar className="h-3.5 w-3.5 mr-1" />
                                  October 2023
                                </div>
                              </div>
                              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 border-none text-white">
                                Winner
                              </Badge>
                            </div>
                          </div>
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-3 rounded-xl border border-blue-100">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium text-slate-900">Global UX Challenge</h4>
                                <p className="text-xs text-slate-500 mt-1">Finalist • Accessibility Innovation</p>
                                <div className="flex items-center text-xs text-slate-500 mt-1">
                                  <Calendar className="h-3.5 w-3.5 mr-1" />
                                  March 2023
                                </div>
                              </div>
                              <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 border-none text-white">
                                Finalist
                              </Badge>
                            </div>
                          </div>
                          <div className="bg-gradient-to-br from-indigo-50 to-violet-50/50 p-3 rounded-xl border border-indigo-100">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium text-slate-900">Tech For Good Hackathon</h4>
                                <p className="text-xs text-slate-500 mt-1">2nd Place • Social Impact</p>
                                <div className="flex items-center text-xs text-slate-500 mt-1">
                                  <Calendar className="h-3.5 w-3.5 mr-1" />
                                  July 2022
                                </div>
                              </div>
                              <Badge className="bg-gradient-to-r from-indigo-500 to-violet-500 border-none text-white">
                                2nd Place
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center mb-4">
                          <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                              <path d="M12 8a2 2 0 1 0 4 0 2 2 0 1 0-4 0"></path>
                              <path d="M10.2 2.2a1 1 0 0 0-1.4 0l-1 1a1 1 0 0 0 0 1.4l5.4 5.4a1 1 0 0 0 1.4 0l1-1a1 1 0 0 0 0-1.4Z"></path>
                              <path d="M2 13.9a1 1 0 0 0 .1 1.4l5.4 5.4a1 1 0 0 0 1.4 0l1-1a1 1 0 0 0 0-1.4L4.5 12.9a1 1 0 0 0-1.4 0Z"></path>
                              <path d="M16 16a2 2 0 1 0 4 0 2 2 0 1 0-4 0"></path>
                            </svg>
                          </div>
                          <h3 className="text-sm font-medium text-emerald-700">Awards & Recognition</h3>
                        </div>
                        <div className="space-y-3">
                          <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 p-3 rounded-xl border border-emerald-100">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium text-slate-900">Employee of the Quarter</h4>
                                <p className="text-xs text-slate-500 mt-1">Excellence in Design Leadership</p>
                                <div className="flex items-center text-xs text-slate-500 mt-1">
                                  <Calendar className="h-3.5 w-3.5 mr-1" />
                                  Q2 2023
                                </div>
                              </div>
                              <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 border-none text-white">
                                Recognition
                              </Badge>
                            </div>
                          </div>
                          <div className="bg-gradient-to-br from-blue-50 to-cyan-50/50 p-3 rounded-xl border border-blue-100">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium text-slate-900">Design Impact Award</h4>
                                <p className="text-xs text-slate-500 mt-1">For CloudHub Mobile App Redesign</p>
                                <div className="flex items-center text-xs text-slate-500 mt-1">
                                  <Calendar className="h-3.5 w-3.5 mr-1" />
                                  November 2022
                                </div>
                              </div>
                              <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 border-none text-white">
                                Award
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="text-sm font-medium text-indigo-700 mb-3 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2 text-indigo-500">
                            <path d="M4 4v16"></path>
                            <path d="M9 16c0-6.627-1-15-1-15"></path>
                            <path d="M12 12c0 8-1 8-4 8s-4 0-4-8 1-8 4-8 4 0 4 8Z"></path>
                            <path d="M17 7c-3.333 0-5-1.5-5 8.5s1.667 8.5 5 8.5 5-1.5 5-8.5S20.333 7 17 7Z"></path>
                          </svg>
                          Certifications
                        </h3>
                        <div className="space-y-3 mt-1">
                          <div className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                                <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"></path>
                                <path d="m9 12 2 2 4-4"></path>
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-medium text-slate-900">Advanced UX Certification</h4>
                              <p className="text-xs text-slate-500 mt-1">Nielsen Norman Group</p>
                              <div className="flex items-center text-xs text-slate-500 mt-1">
                                <Calendar className="h-3.5 w-3.5 mr-1" />
                                Issued 2021 • No Expiration
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                            <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                                <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                                <path d="M9 14v1"></path>
                                <path d="M9 19v2"></path>
                                <path d="M9 3v2"></path>
                                <path d="M9 9v1"></path>
                                <path d="M15 14v1"></path>
                                <path d="M15 19v2"></path>
                                <path d="M15 3v2"></path>
                                <path d="M15 9v1"></path>
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-medium text-slate-900">Accessibility Design Specialist</h4>
                              <p className="text-xs text-slate-500 mt-1">International Association of Accessibility Professionals</p>
                              <div className="flex items-center text-xs text-slate-500 mt-1">
                                <Calendar className="h-3.5 w-3.5 mr-1" />
                                Issued 2022 • Valid until 2025
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
              
              <div className="border-t border-slate-100 mt-3 mb-2">
                <DialogFooter className="p-6 pt-4 flex justify-end">
                  <Button
                    variant="outline"
                    className="border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-200"
                    onClick={() => setIsProfileDialogOpen(false)}
                  >
                    Close
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
          
          <CardContent className="p-6 flex flex-col flex-1 overflow-hidden">
            <div className="space-y-4 flex-1 overflow-y-auto mb-4 pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-slate-50 max-h-[calc(100vh-580px)]">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.sent ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-end gap-2 max-w-[80%] ${message.sent ? 'flex-row-reverse' : 'flex-row'}`}>
                    {!message.sent && (
                      <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                        <AvatarImage src="/placeholder-avatar.jpg" alt="Sarah Wilson" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-xs">SW</AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.sent 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
                        : 'bg-slate-100 text-slate-900'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <span className={`text-xs mt-1 block ${message.sent ? 'text-blue-100' : 'text-slate-500'}`}>{message.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Input 
                placeholder="Type your message..." 
                className="bg-white border-slate-200 h-12 rounded-xl px-4 focus:border-blue-500 focus:ring-blue-500/20" 
              />
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm hover:shadow-md transition-all duration-200 rounded-xl h-12 px-4">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 