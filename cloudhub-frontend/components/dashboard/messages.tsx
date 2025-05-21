"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { 
  Search, 
  PlusCircle, 
  MoreVertical, 
  Send, 
  Paperclip, 
  ChevronLeft,
  SmileIcon,
  ImageIcon,
  PhoneIcon,
  VideoIcon,
  User,
  MessageSquare,
  Sparkles,
  Link as LinkIcon,
  Users
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useWindowSize } from "@/hooks/use-window-size"

interface Message {
  id: string
  content: string
  sender: string
  timestamp: Date
  isMe: boolean
}

interface Conversation {
  id: string
  name: string
  avatar: string
  lastMessage: string
  timestamp: Date
  unread: number
  online: boolean
  messages: Message[]
}

// Sample data
const conversations: Conversation[] = [
  {
    id: "1",
    name: "AI Hackathon Team",
    avatar: "/placeholder.svg",
    lastMessage: "Let's finalize our project submission",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    unread: 3,
    online: true,
    messages: [
      {
        id: "1-1",
        content: "Hello team! How's the progress on our project?",
        sender: "Sarah Chen",
        timestamp: new Date(Date.now() - 120 * 60 * 1000),
        isMe: false,
      },
      {
        id: "1-2",
        content: "I've completed the AI model integration. We're on track for the demo.",
        sender: "You",
        timestamp: new Date(Date.now() - 110 * 60 * 1000),
        isMe: true,
      },
      {
        id: "1-3",
        content: "Great work! I've updated the frontend with the new design.",
        sender: "Mike Johnson",
        timestamp: new Date(Date.now() - 100 * 60 * 1000),
        isMe: false,
      },
      {
        id: "1-4",
        content: "Let's finalize our project submission",
        sender: "Sarah Chen",
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        isMe: false,
      },
    ],
  },
  {
    id: "2",
    name: "Cloud Innovation Group",
    avatar: "/placeholder.svg",
    lastMessage: "The meeting is scheduled for tomorrow at 3pm",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unread: 0,
    online: false,
    messages: [
      {
        id: "2-1",
        content: "Hi everyone, I wanted to check if you're all available for a meeting tomorrow?",
        sender: "Alex Wong",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        isMe: false,
      },
      {
        id: "2-2",
        content: "I'm available after 2pm",
        sender: "You",
        timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
        isMe: true,
      },
      {
        id: "2-3",
        content: "The meeting is scheduled for tomorrow at 3pm",
        sender: "Alex Wong",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isMe: false,
      },
    ],
  },
  {
    id: "3",
    name: "Web3 Hackathon Mentors",
    avatar: "/placeholder.svg",
    lastMessage: "Check out this article on blockchain scalability",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    unread: 0,
    online: true,
    messages: [
      {
        id: "3-1",
        content: "Hey team, how are you approaching the scalability challenge?",
        sender: "Maria Garcia",
        timestamp: new Date(Date.now() - 1.2 * 24 * 60 * 60 * 1000),
        isMe: false,
      },
      {
        id: "3-2",
        content: "We're implementing sharding. It's complex but promising.",
        sender: "You",
        timestamp: new Date(Date.now() - 1.1 * 24 * 60 * 60 * 1000),
        isMe: true,
      },
      {
        id: "3-3",
        content: "Check out this article on blockchain scalability",
        sender: "David Kim",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        isMe: false,
      },
    ],
  },
  {
    id: "4",
    name: "Hackathon Organizers",
    avatar: "/placeholder.svg",
    lastMessage: "Submission deadline extended by 24 hours",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    unread: 0,
    online: true,
    messages: [
      {
        id: "4-1",
        content: "Attention all participants: Due to the high level of activity, we're making an announcement.",
        sender: "CloudHub Team",
        timestamp: new Date(Date.now() - 2.1 * 24 * 60 * 60 * 1000),
        isMe: false,
      },
      {
        id: "4-2",
        content: "Submission deadline extended by 24 hours",
        sender: "CloudHub Team",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        isMe: false,
      },
    ],
  },
]

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const { width } = useWindowSize()
  const isMobile = width ? width < 768 : false
  const [showConversation, setShowConversation] = useState(!isMobile)
  
  // Filter conversations based on search query
  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Switch to conversation view on mobile when a conversation is selected
  useEffect(() => {
    if (isMobile && selectedConversation) {
      setShowConversation(true)
    }
  }, [selectedConversation, isMobile])

  // Reset to conversation list when resizing to desktop
  useEffect(() => {
    if (!isMobile) {
      setShowConversation(true)
    }
  }, [isMobile])

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    // We would normally send this to an API
    // For now, we'll just log it
    console.log("Message sent:", newMessage)
    
    // Clear the input
    setNewMessage("")
  }

  // Handle selecting a conversation
  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    if (isMobile) {
      setShowConversation(true)
    }
  }

  // Handle back button on mobile
  const handleBackToList = () => {
    setShowConversation(false)
  }

  return (
    <div className="flex flex-col h-full bg-slate-50/50 p-4 space-y-4">
      {/* Banner Card */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg">
        <div className="relative py-8 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600"></div>
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-2/3 h-1/2 bg-gradient-to-t from-blue-400/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-10 right-[20%] w-16 h-16 rounded-lg bg-gradient-to-tr from-blue-500/40 to-transparent backdrop-blur-sm border border-white/20 animate-float-slow"></div>
          <div className="absolute top-1/2 right-[40%] w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/30 to-transparent backdrop-blur-sm border border-white/20 animate-float-slow animate-delay-500"></div>
          <div className="absolute bottom-10 left-[30%] w-14 h-14 rounded-lg bg-gradient-to-tl from-violet-500/30 to-transparent backdrop-blur-sm border border-white/20 animate-float-slow animate-delay-700"></div>
          
          <div className="relative z-10 flex flex-col">
            <h1 className="text-3xl font-bold text-white md:text-4xl">
              Messages <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-indigo-200 to-violet-200">Center</span>
            </h1>
            <p className="text-blue-100 mt-2 max-w-2xl text-lg">
              Connect with your team members, mentors, and hackathon participants
            </p>
          </div>
        </div>
      </div>

      {/* Messages Card */}
      <div className="flex flex-1 h-[calc(100vh-20rem)] bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Conversation List */}
        <div 
          className={`w-full md:w-1/3 border-r border-slate-100 flex flex-col overflow-hidden ${
            isMobile && showConversation ? "hidden" : "flex"
          }`}
        >
          <div className="px-4 pb-2 pt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search messages..."
                className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <div className="px-4 pt-2">
              <TabsList className="w-full bg-gradient-to-r from-slate-50 via-slate-50 to-slate-50 p-1.5 rounded-xl border border-slate-100 shadow-sm">
                <TabsTrigger 
                  value="all" 
                  className="flex-1 text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:via-indigo-500 data-[state=active]:to-violet-500 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
                >
                  All
                </TabsTrigger>
                <TabsTrigger 
                  value="unread" 
                  className="flex-1 text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:via-indigo-500 data-[state=active]:to-violet-500 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
                >
                  Unread
                </TabsTrigger>
                <TabsTrigger 
                  value="teams" 
                  className="flex-1 text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:via-indigo-500 data-[state=active]:to-violet-500 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
                >
                  Teams
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="mt-0 flex-1 overflow-hidden">
              <ScrollArea className="h-[calc(100vh-27rem)]">
                <div className="p-2 space-y-1">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                        selectedConversation?.id === conversation.id
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm border border-blue-100"
                          : "hover:bg-slate-50 hover:shadow-sm"
                      }`}
                      onClick={() => handleSelectConversation(conversation)}
                    >
                      <div className="relative">
                        <Avatar className="h-11 w-11 border border-slate-200 shadow-sm">
                          <AvatarImage src={conversation.avatar} alt={conversation.name} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                            {conversation.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.online && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                        )}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-slate-900 truncate">{conversation.name}</h3>
                          <span className="text-xs text-slate-500">
                            {formatDistanceToNow(conversation.timestamp, { addSuffix: false })}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 truncate">{conversation.lastMessage}</p>
                      </div>
                      {conversation.unread > 0 && (
                        <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 border-0">{conversation.unread}</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="unread" className="mt-0 flex-1 overflow-hidden">
              <ScrollArea className="h-[calc(100vh-27rem)]">
                <div className="flex items-center justify-center h-full min-h-[300px]">
                  <div className="text-center p-6">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center mb-4 shadow-inner">
                      <MessageSquare className="h-10 w-10 text-blue-500" />
                    </div>
                    <p className="text-slate-500 text-sm">No unread messages</p>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="teams" className="mt-0 flex-1 overflow-hidden">
              <ScrollArea className="h-[calc(100vh-27rem)]">
                <div className="flex items-center justify-center h-full min-h-[300px]">
                  <div className="text-center p-6">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center mb-4 shadow-inner">
                      <Users className="h-10 w-10 text-blue-500" />
                    </div>
                    <p className="text-slate-500 text-sm">No team messages</p>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>

          <div className="mt-auto p-4 border-t border-slate-100">
            <Button 
              className="w-full flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 text-white border-0 shadow-sm" 
              size="sm"
            >
              <PlusCircle className="h-4 w-4" />
              New conversation
            </Button>
          </div>
        </div>

        {/* Conversation/Messages Area */}
        <div 
          className={`w-full md:w-2/3 flex flex-col ${
            isMobile && !showConversation ? "hidden" : "flex"
          }`}
        >
          {selectedConversation ? (
            <>
              {/* Conversation Header */}
              <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-white shadow-sm sticky top-0 z-10">
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBackToList}
                    className="md:hidden"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                )}
                <Avatar className="h-10 w-10 border border-slate-200 shadow-sm">
                  <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                    {selectedConversation.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-medium text-slate-900">{selectedConversation.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    {selectedConversation.online ? 
                      <><span className="inline-block h-2 w-2 rounded-full bg-green-500"></span> Online</> : 
                      "Offline"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                  >
                    <PhoneIcon className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                  >
                    <VideoIcon className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white/90 backdrop-blur-md border-slate-100 shadow-md">
                      <DropdownMenuItem className="hover:bg-slate-50 cursor-pointer">View profile</DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-slate-50 cursor-pointer">Mute notifications</DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-slate-50 cursor-pointer">Share contact</DropdownMenuItem>
                      <Separator className="my-1" />
                      <DropdownMenuItem className="text-red-600 hover:bg-red-50 cursor-pointer">Block user</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4 bg-slate-50/50" type="always">
                <div className="space-y-4 pb-2">
                  {selectedConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl p-3.5 shadow-sm ${
                          message.isMe
                            ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 text-white"
                            : "bg-white text-slate-900 border border-slate-100"
                        }`}
                      >
                        {!message.isMe && (
                          <p className="text-xs font-medium mb-1 text-blue-600">{message.sender}</p>
                        )}
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`text-xs mt-1 text-right ${
                            message.isMe ? "text-blue-200" : "text-slate-400"
                          }`}
                        >
                          {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t border-slate-100 bg-white shadow-sm">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="flex-shrink-0 border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="flex-shrink-0 border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    className="flex-1 bg-slate-50 border-slate-200 focus-visible:ring-blue-500"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="flex-shrink-0 border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                  >
                    <SmileIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    className="flex-shrink-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 hover:from-blue-600 hover:via-indigo-600 hover:to-violet-600 text-white border-0"
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-slate-50/50">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center mb-6 shadow-inner">
                <MessageSquare className="h-12 w-12 text-blue-500" />
              </div>
              <h3 className="text-2xl font-medium text-slate-900 mb-3">Your messages</h3>
              <p className="text-slate-500 mb-8 max-w-md text-lg">
                Select a conversation to start messaging or create a new one to connect with teammates
              </p>
              <Button 
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 text-white shadow-sm px-6 py-2"
              >
                <PlusCircle className="h-4 w-4" />
                New conversation
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 