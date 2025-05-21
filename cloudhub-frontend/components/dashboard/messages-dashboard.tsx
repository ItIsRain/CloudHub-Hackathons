import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Plus, MessageSquare, MessageCircle, Sparkles, Search, Users, User, X, Check } from "lucide-react"
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
  }
]

export default function MessagesDashboard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
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
    <div className="flex flex-col h-full min-h-0 space-y-6 px-6 pt-6 pb-6 overflow-auto bg-white">
      {/* Banner Card */}
      <div className="relative rounded-2xl overflow-hidden shadow-md z-10">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 z-10 min-h-0">
        {/* Conversations List */}
        <Card className="border-none shadow-md rounded-3xl overflow-hidden bg-white lg:col-span-1 flex flex-col h-full">
          <CardHeader className="border-b border-slate-100 bg-white px-8 py-6">
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
                <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-xl rounded-2xl">
                  <div className="relative py-6 px-6 overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600">
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
                    <DialogHeader className="relative z-10">
                      <DialogTitle className="text-2xl font-bold text-white flex items-center">
                        <MessageCircle className="h-5 w-5 mr-2" />
                        New Conversation
                      </DialogTitle>
                      <DialogDescription className="text-blue-100">
                        Start a direct message or create a group chat
                      </DialogDescription>
                    </DialogHeader>
                  </div>
                  
                  <Tabs defaultValue="direct" className="w-full">
                    <div className="px-6 pt-4">
                      <TabsList className="w-full grid grid-cols-2 bg-slate-100">
                        <TabsTrigger value="direct" className="data-[state=active]:bg-white rounded-lg data-[state=active]:shadow-sm">
                          <User className="h-4 w-4 mr-2" />
                          Direct Message
                        </TabsTrigger>
                        <TabsTrigger value="group" className="data-[state=active]:bg-white rounded-lg data-[state=active]:shadow-sm">
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
                            className="pl-10 bg-slate-50 border-slate-200" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <TabsContent value="direct" className="mt-0">
                        <div className="space-y-4 max-h-[240px] overflow-y-auto mb-6">
                          <div className="text-xs font-medium text-slate-500 mb-2">SUGGESTED PEOPLE</div>
                          
                          {["Jordan Wilson", "Alex Chen", "Taylor Moore"].map((name, i) => (
                            <div 
                              key={i} 
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer"
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
                                className={`rounded-full h-8 w-8 p-0 ${
                                  selectedPeople.includes(name) 
                                    ? "bg-blue-500 border-blue-500 text-white hover:bg-blue-600 hover:border-blue-600" 
                                    : ""
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
                      
                      <TabsContent value="group" className="mt-0">
                        <div className="mb-4">
                          <Label htmlFor="group-name" className="text-sm font-medium text-slate-700 mb-1.5 block">
                            Group Name
                          </Label>
                          <Input
                            id="group-name"
                            placeholder="Enter group name..."
                            className="bg-slate-50 border-slate-200"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-4 max-h-[200px] overflow-y-auto mb-6">
                          <div className="text-xs font-medium text-slate-500 mb-2">SELECT MEMBERS</div>
                          
                          {["Jordan Wilson", "Alex Chen", "Taylor Moore", "Jamie Smith", "Pat Johnson"].map((name, i) => (
                            <div 
                              key={i} 
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer"
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
                                className={`rounded-full h-8 w-8 p-0 ${
                                  selectedPeople.includes(name) 
                                    ? "bg-blue-500 border-blue-500 text-white hover:bg-blue-600 hover:border-blue-600" 
                                    : ""
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
                          <div className="mb-6">
                            <Label className="text-xs font-medium text-slate-500 mb-2 block">
                              SELECTED MEMBERS ({selectedPeople.length})
                            </Label>
                            <div className="flex flex-wrap gap-2">
                              {selectedPeople.map((name, i) => (
                                <Badge key={i} className="bg-blue-500 hover:bg-blue-600 px-2 py-1 flex items-center gap-1">
                                  {name}
                                  <X 
                                    className="h-3 w-3 cursor-pointer ml-1" 
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
                    
                    <DialogFooter className="p-6 pt-0 flex gap-2 sm:gap-0">
                      <Button
                        variant="outline"
                        className="flex-1 border-slate-200"
                        onClick={() => {
                          setIsDialogOpen(false);
                          setSelectedPeople([]);
                          setGroupName("");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        disabled={selectedPeople.length === 0}
                      >
                        Start Chat
                      </Button>
                    </DialogFooter>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-hidden h-full">
            <div className="flex flex-col h-full overflow-y-auto">
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
          <CardHeader className="border-b border-slate-100 bg-white px-8 py-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                <AvatarImage src="/placeholder-avatar.jpg" alt="Sarah Wilson" />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white">SW</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Sarah Wilson</CardTitle>
                <CardDescription className="text-slate-600 mt-1 flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                  Online
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 flex flex-col flex-1 overflow-hidden">
            <div className="space-y-4 flex-1 overflow-y-auto mb-4">
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