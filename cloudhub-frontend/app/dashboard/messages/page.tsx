"use client"

import Messages from "@/components/dashboard/messages"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Plus } from "lucide-react"

interface Conversation {
  name: string
  avatar: string
  lastMessage: string
  time: string
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
    time: "2m ago"
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

export default function MessagesPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-white p-6 space-y-6">
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
              Messages <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-indigo-200 to-violet-200">& Notifications</span>
            </h1>
            <p className="text-blue-100 mt-3 max-w-2xl text-lg">
              Stay connected with your team and manage your notifications
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Conversations List */}
        <Card className="border-slate-200 shadow-lg rounded-2xl overflow-hidden lg:col-span-1 flex flex-col h-full">
          <CardHeader className="border-b border-slate-200 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Conversations</CardTitle>
                <CardDescription className="text-slate-600">Your active conversations</CardDescription>
              </div>
              <Button className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl">
                <Plus className="h-5 w-5 mr-2" />
                New Message
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 flex-1 overflow-y-auto">
            <div className="space-y-4">
              {conversations.map((conversation, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group">
                  <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                    <AvatarImage src={conversation.avatar} alt={conversation.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                      {conversation.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
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
        <Card className="border-slate-200 shadow-lg rounded-2xl overflow-hidden lg:col-span-2 flex flex-col h-full">
          <CardHeader className="border-b border-slate-200 bg-white">
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                <AvatarImage src="/placeholder-avatar.jpg" alt="Sarah Wilson" />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white">SW</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Sarah Wilson</CardTitle>
                <CardDescription className="text-slate-600">Online</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 flex flex-col flex-1 min-h-0">
            <div className="space-y-4 flex-1 overflow-y-auto">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.sent ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-end gap-2 max-w-[80%] ${message.sent ? 'flex-row-reverse' : 'flex-row'}`}>
                    {!message.sent && (
                      <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                        <AvatarImage src="/placeholder-avatar.jpg" alt="Sarah Wilson" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-sm">SW</AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`rounded-2xl px-4 py-2 ${
                      message.sent 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
                        : 'bg-slate-100 text-slate-900'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <span className="text-xs opacity-70 mt-1 block">{message.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-2">
              <Input 
                placeholder="Type your message..." 
                className="flex-1 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
              />
              <Button className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 