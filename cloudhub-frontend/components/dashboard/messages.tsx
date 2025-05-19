"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  MessageSquare,
  Users,
  UserPlus,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Info,
  Image,
  File,
  Mic,
  X,
  CheckCheck,
  Check,
  ArrowLeft,
  Filter,
  Star,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// Sample data for messages
const conversations = [
  {
    id: 1,
    name: "Sarah Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Hey, how's the project coming along?",
    time: "2h ago",
    unread: 2,
    online: true,
    isTeam: false,
    status: "Working on AI model integration",
    role: "ML Engineer",
    isFavorite: true,
    typing: true
  },
  {
    id: 2,
    name: "Team AI Innovators",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Meeting scheduled for tomorrow at 3 PM",
    time: "5h ago",
    unread: 1,
    online: false,
    isTeam: true,
    members: 5,
    isFavorite: false
  },
  {
    id: 3,
    name: "Dr. Emily Zhang",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Looking forward to our mentorship session",
    time: "Yesterday",
    unread: 0,
    online: true,
    isTeam: false,
    status: "Available for mentoring",
    role: "Lead Researcher",
    isFavorite: true
  },
  {
    id: 4,
    name: "Blockchain Dev Team",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "I pushed the smart contract updates to GitHub",
    time: "2d ago",
    unread: 0,
    online: false,
    isTeam: true,
    members: 3,
    isFavorite: false
  },
  {
    id: 5,
    name: "Alex Morgan",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Can you review my pull request?",
    time: "3d ago",
    unread: 0,
    online: false,
    isTeam: false,
    status: "In a meeting",
    role: "Frontend Developer",
    isFavorite: false
  }
]

const messages: Message[] = [
  {
    id: 1,
    senderId: "user",
    content: "Hi Sarah, just wanted to check in on the project progress.",
    time: "10:30 AM",
    status: "read"
  },
  {
    id: 2,
    senderId: "other",
    content: "Hey! Thanks for checking in. I've been working on the AI model integration. Made some good progress!",
    time: "10:32 AM",
    status: "read"
  },
  {
    id: 3,
    senderId: "user",
    content: "That's great to hear! Any challenges you're facing?",
    time: "10:33 AM",
    status: "read"
  },
  {
    id: 4,
    senderId: "other",
    content: "Actually yes, I'm having some issues with the data preprocessing pipeline. Could use your input on that.",
    time: "10:35 AM",
    status: "read"
  },
  {
    id: 5,
    senderId: "user",
    content: "Of course! Want to hop on a quick call to discuss? I have some time later today around 3 PM.",
    time: "10:36 AM",
    status: "delivered"
  },
  {
    id: 6,
    senderId: "other",
    content: "That would be perfect! I'll make myself available at 3 PM. Should we use the usual Zoom link?",
    time: "10:40 AM",
    status: "read"
  },
  {
    id: 7,
    senderId: "user",
    content: "Yes, the usual link works. I'll send a calendar invite just to make it official.",
    time: "10:42 AM",
    status: "sent"
  }
]

// Add TypeScript interfaces
interface Member {
  name: string
  avatar: string
}

interface Conversation {
  id: number
  name: string
  avatar: string
  lastMessage: string
  time: string
  unread: number
  online: boolean
  isTeam: boolean
  status?: string
  role?: string
  isFavorite: boolean
  typing?: boolean
  members?: number
}

interface Message {
  id: number
  senderId: "user" | "other"
  content: string
  time: string
  status: "sending" | "sent" | "delivered" | "read"
}

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation>(conversations[0])
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [conversationsData, setConversationsData] = useState<Conversation[]>(conversations)
  const [activeTab, setActiveTab] = useState("all")
  const [isMobileView, setIsMobileView] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const [messagesData, setMessagesData] = useState<Message[]>(messages)
  const messageEndRef = useRef<HTMLDivElement>(null)

  // Filter conversations based on search and active tab
  const filteredConversations = conversationsData.filter(conv => {
    // Filter by search term
    const matchesSearch = conv.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by tab
    let matchesTab = true;
    if (activeTab === "unread") {
      matchesTab = conv.unread > 0;
    } else if (activeTab === "teams") {
      matchesTab = conv.isTeam;
    } else if (activeTab === "favorites") {
      matchesTab = conv.isFavorite;
    }
    
    return matchesSearch && matchesTab;
  });

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesData]);

  // Check if mobile view on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setShowSidebar(true);
      } else {
        setShowSidebar(true);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg: Message = {
        id: messagesData.length + 1,
        senderId: "user",
        content: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: "sending"
      };
      
      setMessagesData([...messagesData, newMsg]);
      setNewMessage("");
      
      // Simulate message status changes
      setTimeout(() => {
        setMessagesData(prev => 
          prev.map(msg => 
            msg.id === newMsg.id ? {...msg, status: "sent" as const} : msg
          )
        );
        
        setTimeout(() => {
          setMessagesData(prev => 
            prev.map(msg => 
              msg.id === newMsg.id ? {...msg, status: "delivered" as const} : msg
            )
          );
          
          setTimeout(() => {
            setMessagesData(prev => 
              prev.map(msg => 
                msg.id === newMsg.id ? {...msg, status: "read" as const} : msg
              )
            );
          }, 1000);
        }, 1000);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleFavorite = (id: number) => {
    setConversationsData(prev => 
      prev.map(conv => 
        conv.id === id ? {...conv, isFavorite: !conv.isFavorite} : conv
      )
    )
  }

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case "sending":
        return <Clock className="h-3 w-3" />
      case "sent":
        return <Check className="h-3 w-3" />
      case "delivered":
        return <CheckCheck className="h-3 w-3" />
      case "read":
        return <CheckCheck className="h-3 w-3 text-blue-500" />
      default:
        return null
    }
  }

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    
    // Mark as read
    setConversationsData(prev => 
      prev.map(conv => 
        conv.id === conversation.id ? {...conv, unread: 0} : conv
      )
    )
    
    if (isMobileView) {
      setShowSidebar(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] p-4 max-w-[1600px] mx-auto">
      {/* Header Section with gradient background */}
      <div className="relative mb-4 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 p-4 sm:p-6 text-white shadow-lg overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-white/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-white/5 rounded-full blur-2xl -z-10 animate-pulse delay-700"></div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-1">Hackathon Chat</h1>
            <p className="text-white/80">Connect with teammates and mentors in real-time</p>
          </div>
          <Button className="bg-white text-violet-600 hover:bg-white/90 shadow-md">
            <UserPlus className="h-4 w-4 mr-2" />
            New Conversation
          </Button>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex gap-4 flex-1 min-h-0 overflow-hidden">
        {/* Conversations List - Show/hide based on mobile view */}
        {(showSidebar || !isMobileView) && (
          <Card className={`${isMobileView ? 'absolute inset-0 z-10 m-4' : 'w-80'} flex flex-col shadow-md border-slate-200`}>
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-violet-500" />
                <h3 className="font-semibold">Conversations</h3>
              </div>
              {isMobileView && (
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setShowSidebar(false)}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-3 pb-2">
              <div className="relative mb-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  type="search"
                  placeholder="Search messages..."
                  className="pl-8 bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardContent>
            <div className="px-3">
              <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full bg-slate-50 p-1 rounded-md">
                  <TabsTrigger value="all" className="flex-1 text-xs">All</TabsTrigger>
                  <TabsTrigger value="unread" className="flex-1 text-xs">Unread</TabsTrigger>
                  <TabsTrigger value="teams" className="flex-1 text-xs">Teams</TabsTrigger>
                  <TabsTrigger value="favorites" className="flex-1 text-xs">Favorites</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <CardContent className="flex-1 p-3 pt-3 overflow-hidden">
              <ScrollArea className="h-full pr-3 -mr-3">
                {filteredConversations.length > 0 ? (
                  <div className="space-y-2">
                    {filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() => handleConversationSelect(conversation)}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all relative",
                          selectedConversation.id === conversation.id
                            ? "bg-violet-50 border-l-4 border-l-violet-500 border-y border-r border-violet-200"
                            : "hover:bg-slate-50 border border-transparent"
                        )}
                      >
                        <div className="relative">
                          <Avatar className="h-12 w-12 border border-slate-200">
                            <AvatarImage src={conversation.avatar} alt={conversation.name} />
                            <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
                              {conversation.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          {conversation.online && (
                            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-slate-900 truncate">{conversation.name}</h4>
                              {conversation.isTeam && (
                                <Badge variant="outline" className="h-5 bg-blue-50 text-blue-700 border-blue-200">
                                  <Users className="h-3 w-3 mr-1" />
                                  {conversation.members}
                                </Badge>
                              )}
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className={cn(
                                "h-6 w-6 p-1 absolute right-2 top-2",
                                conversation.isFavorite ? "text-amber-500" : "text-slate-300 hover:text-slate-400"
                              )}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(conversation.id);
                              }}
                            >
                              <Star className="h-full w-full" fill={conversation.isFavorite ? "currentColor" : "none"} />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-sm text-slate-600 truncate max-w-[160px]">
                              {conversation.typing ? (
                                <span className="flex items-center text-violet-600">
                                  <span className="animate-pulse">Typing</span>
                                  <span className="inline-flex ml-1">
                                    <span className="animate-bounce mx-px h-1 w-1 rounded-full bg-violet-600"></span>
                                    <span className="animate-bounce delay-75 mx-px h-1 w-1 rounded-full bg-violet-600"></span>
                                    <span className="animate-bounce delay-150 mx-px h-1 w-1 rounded-full bg-violet-600"></span>
                                  </span>
                                </span>
                              ) : conversation.lastMessage}
                            </p>
                            <span className="text-xs text-slate-500">{conversation.time}</span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            {conversation.unread > 0 && (
                              <Badge className="bg-violet-500 hover:bg-violet-600">{conversation.unread}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <div className="bg-slate-100 p-3 rounded-full mb-3">
                      <Search className="h-6 w-6 text-slate-400" />
                    </div>
                    <h3 className="text-sm font-medium text-slate-900">No conversations found</h3>
                    <p className="text-sm text-slate-500 max-w-xs mt-1">
                      Try changing your search or filters to find what you're looking for.
                    </p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col shadow-md border-slate-200 overflow-hidden">
          {isMobileView && !showSidebar && (
            <div className="absolute top-4 left-4 z-20">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-full bg-white shadow-md border-slate-200"
                onClick={() => setShowSidebar(true)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <CardHeader className="border-b p-4 flex flex-row items-center">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-slate-200">
                  <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.name} />
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
                    {selectedConversation.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{selectedConversation.name}</CardTitle>
                    {selectedConversation.online && (
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                        Online
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    {selectedConversation.isTeam ? (
                      <span className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {selectedConversation.members} members
                      </span>
                    ) : (
                      selectedConversation.status || "Last active 2m ago"
                    )}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-600 rounded-full">
                        <Phone className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Voice call</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-600 rounded-full">
                        <Video className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Video call</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-600 rounded-full">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Chat Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <Info className="h-4 w-4 mr-2" />
                      View profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Search className="h-4 w-4 mr-2" />
                      Search in conversation
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Star className="h-4 w-4 mr-2" />
                      Add to favorites
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600 cursor-pointer">
                      <X className="h-4 w-4 mr-2" />
                      Block user
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 p-0 overflow-hidden relative">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4 min-h-full flex flex-col justify-end">
                <div className="bg-slate-100 text-slate-500 text-xs text-center py-2 px-4 rounded-full mx-auto mb-4">
                  Today, {new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
                </div>
                {messagesData.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.senderId !== "user" && (
                      <Avatar className="h-8 w-8 mr-2 self-end mb-1 hidden sm:flex">
                        <AvatarImage src={selectedConversation.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-xs">
                          {selectedConversation.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        "max-w-[80%] sm:max-w-[70%] rounded-2xl p-3",
                        message.senderId === "user"
                          ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-br-none"
                          : "bg-slate-100 text-slate-900 rounded-bl-none"
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className={cn(
                        "text-xs mt-1 flex items-center justify-end gap-1",
                        message.senderId === "user" ? "text-violet-200" : "text-slate-500"
                      )}>
                        {message.time}
                        {message.senderId === "user" && getStatusIcon(message.status)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messageEndRef} />
              </div>
            </ScrollArea>
          </CardContent>
          
          <CardFooter className="p-4 border-t">
            <div className="flex items-center gap-2 w-full">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="shrink-0 rounded-full h-10 w-10">
                    <Plus className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="start">
                  <DropdownMenuItem className="cursor-pointer">
                    <Image className="h-4 w-4 mr-2" />
                    Send image
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <File className="h-4 w-4 mr-2" />
                    Send file
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Mic className="h-4 w-4 mr-2" />
                    Voice message
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <div className="relative flex-1">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="pr-10 py-6 rounded-full bg-slate-50 border-slate-200 focus-visible:ring-violet-500"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full text-slate-500 hover:text-slate-600"
                >
                  <Smile className="h-5 w-5" />
                </Button>
              </div>
              
              <Button 
                className="shrink-0 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 h-10 w-10 p-0 rounded-full shadow-md"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}