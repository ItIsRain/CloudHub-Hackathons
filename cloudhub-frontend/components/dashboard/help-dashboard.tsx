import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  MessageSquare, 
  HelpCircle, 
  BookOpen, 
  Video, 
  ChevronRight,
  Book,
  LifeBuoy,
  Ticket,
  MessageCircle,
  FileQuestion,
  Clock,
  AlertCircle,
  CheckCircle2,
  Search,
  Filter,
  ArrowUpRight,
  User,
  Send,
  MoreHorizontal,
  AlignLeft,
  CalendarClock,
  Tag
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { useState, useCallback, memo, useMemo } from "react"

// Add export configuration
export const config = {
  runtime: 'edge',
  unstable_skipMiddlewareUrlNormalize: true,
};

// Mock data for tickets
const tickets = [
  {
    id: "TICK-001",
    title: "Cannot access hackathon dashboard",
    status: "open",
    priority: "high",
    category: "Technical",
    createdAt: "2024-03-15T10:30:00Z",
    lastUpdated: "2024-03-15T11:45:00Z",
    description: "I'm unable to access the hackathon dashboard after logging in. The page shows a blank screen."
  },
  {
    id: "TICK-002",
    title: "Payment processing error",
    status: "resolved",
    priority: "medium",
    category: "Billing",
    createdAt: "2024-03-14T15:20:00Z",
    lastUpdated: "2024-03-15T09:15:00Z",
    description: "Received an error when trying to process payment for premium plan."
  },
  {
    id: "TICK-003",
    title: "Team member invitation not working",
    status: "in-progress",
    priority: "medium",
    category: "Teams",
    createdAt: "2024-03-13T09:20:00Z",
    lastUpdated: "2024-03-14T14:30:00Z",
    description: "Invitations sent to team members are not being received in their email."
  },
  {
    id: "TICK-004",
    title: "Need to change subscription plan",
    status: "pending",
    priority: "low",
    category: "Billing",
    createdAt: "2024-03-12T11:45:00Z",
    lastUpdated: "2024-03-13T10:20:00Z",
    description: "Looking to upgrade from Basic to Pro plan for our organization."
  },
]

// Mock data for help articles - use same memory reference
const helpArticles = [
  {
    id: 1,
    title: "Getting Started with CloudHub",
    category: "Basics",
    description: "Learn the basics of using CloudHub for hackathons",
    icon: BookOpen,
  },
  {
    id: 2,
    title: "Creating Your First Hackathon",
    category: "Hackathons",
    description: "Step-by-step guide to creating and managing hackathons",
    icon: Ticket,
  },
  {
    id: 3,
    title: "Team Management",
    category: "Teams",
    description: "How to create and manage teams for hackathons",
    icon: MessageCircle,
  },
  {
    id: 4,
    title: "Payment and Billing",
    category: "Billing",
    description: "Understanding payment processing and billing",
    icon: FileQuestion,
  },
];

// Mock ticket message data
const ticketMessages: { [key: string]: MessageType[] } = {
  "TICK-001": [
    {
      id: 1,
      sender: "user",
      name: "John Doe",
      avatar: "/avatars/user-01.png",
      content: "I'm unable to access the hackathon dashboard after logging in. The page shows a blank screen with no error messages.",
      timestamp: "2024-03-15T10:30:00Z",
    },
    {
      id: 2,
      sender: "agent",
      name: "Sarah Wilson",
      avatar: "/avatars/support-01.png",
      content: "Hello John, thank you for reporting this issue. Can you please provide more details about your browser and operating system?",
      timestamp: "2024-03-15T11:15:00Z",
    },
    {
      id: 3,
      sender: "user",
      name: "John Doe",
      avatar: "/avatars/user-01.png",
      content: "I'm using Chrome version 121 on Windows 11. I've tried clearing my cache and cookies, but the issue persists.",
      timestamp: "2024-03-15T11:30:00Z",
    }
  ],
  "TICK-002": [
    {
      id: 1,
      sender: "user",
      name: "John Doe",
      avatar: "/avatars/user-01.png",
      content: "I received an error when trying to process payment for the premium plan. The error message says 'Payment processing failed'.",
      timestamp: "2024-03-14T15:20:00Z",
    },
    {
      id: 2,
      sender: "agent",
      name: "Mike Johnson",
      avatar: "/avatars/support-02.png",
      content: "Hi John, I'm sorry to hear about this issue. Our payment system was experiencing some downtime. Can you please try again now?",
      timestamp: "2024-03-14T15:45:00Z",
    },
    {
      id: 3,
      sender: "user",
      name: "John Doe",
      avatar: "/avatars/user-01.png",
      content: "I tried again and it worked. Thank you for the quick response!",
      timestamp: "2024-03-14T16:00:00Z",
    },
    {
      id: 4,
      sender: "agent",
      name: "Mike Johnson",
      avatar: "/avatars/support-02.png",
      content: "Great! I'm glad to hear it's working now. If you have any other issues, please don't hesitate to reach out. I've marked this ticket as resolved.",
      timestamp: "2024-03-15T09:15:00Z",
    }
  ],
  "TICK-003": [
    {
      id: 1,
      sender: "user",
      name: "John Doe",
      avatar: "/avatars/user-01.png",
      content: "Team member invitations are not being received in their email. I've sent multiple invitations to different email addresses.",
      timestamp: "2024-03-13T09:20:00Z",
    },
    {
      id: 2,
      sender: "agent",
      name: "Emily Rodriguez",
      avatar: "/avatars/support-03.png",
      content: "Hello John, I'm looking into this issue. Can you confirm the email addresses you're sending invitations to?",
      timestamp: "2024-03-13T10:30:00Z",
    },
    {
      id: 3,
      sender: "user",
      name: "John Doe",
      avatar: "/avatars/user-01.png",
      content: "I've sent invitations to test@example.com and dev@example.org. Both are valid email addresses.",
      timestamp: "2024-03-13T11:00:00Z",
    },
    {
      id: 4,
      sender: "agent",
      name: "Emily Rodriguez",
      avatar: "/avatars/support-03.png",
      content: "Thank you for confirming. I've identified the issue with our email delivery system. Our team is working on a fix. I'll update you soon.",
      timestamp: "2024-03-14T14:30:00Z",
    }
  ],
  "TICK-004": [
    {
      id: 1,
      sender: "user",
      name: "John Doe",
      avatar: "/avatars/user-01.png",
      content: "I'd like to upgrade from the Basic to Pro plan for our organization. How can I do this?",
      timestamp: "2024-03-12T11:45:00Z",
    },
    {
      id: 2,
      sender: "agent",
      name: "Mike Johnson",
      avatar: "/avatars/support-02.png",
      content: "Hi John, you can upgrade your plan from the Billing section in your account settings. Let me know if you need any assistance with this process.",
      timestamp: "2024-03-13T10:20:00Z",
    }
  ]
};

// Define interfaces for component props
interface TicketType {
  id: string;
  title: string;
  status: string;
  priority: string;
  category: string;
  createdAt: string;
  lastUpdated: string;
  description: string;
}

interface MessageType {
  id: number;
  sender: string;
  name: string;
  avatar: string;
  content: string;
  timestamp: string;
}

interface ArticleType {
  id: number;
  title: string;
  category: string;
  description: string;
  icon: React.FC<any>;
}

interface TicketCardProps {
  ticket: TicketType;
  openTicketDialog: (ticket: TicketType) => void;
}

interface ArticleCardProps {
  article: ArticleType;
}

interface StatCardProps {
  icon: React.ReactNode;
  count: number;
  title: string;
  color: string;
  percentage: number;
}

interface MessageItemProps {
  message: MessageType;
}

// Function to get status icon and color - move outside of component to prevent recreation on each render
function getStatusProperties(status: string) {
  switch(status) {
    case 'open':
      return { 
        icon: <AlertCircle className="h-4 w-4" />, 
        color: 'bg-blue-500', 
        lightColor: 'bg-blue-50',
        textColor: 'text-blue-600'
      };
    case 'in-progress':
      return { 
        icon: <Clock className="h-4 w-4" />, 
        color: 'bg-amber-500', 
        lightColor: 'bg-amber-50',
        textColor: 'text-amber-600'
      };
    case 'pending':
      return { 
        icon: <Clock className="h-4 w-4" />, 
        color: 'bg-purple-500', 
        lightColor: 'bg-purple-50',
        textColor: 'text-purple-600'
      };
    case 'resolved':
      return { 
        icon: <CheckCircle2 className="h-4 w-4" />, 
        color: 'bg-green-500', 
        lightColor: 'bg-green-50',
        textColor: 'text-green-600'
      };
    default:
      return { 
        icon: <MessageSquare className="h-4 w-4" />, 
        color: 'bg-slate-500', 
        lightColor: 'bg-slate-50',
        textColor: 'text-slate-600'
      };
  }
}

// Function to format date nicely - move outside of component to prevent recreation on each render
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// Simplified Ticket Card with optimized rendering
const TicketCard = memo(({ ticket, openTicketDialog }: TicketCardProps) => {
  const statusProps = getStatusProperties(ticket.status);
  
  return (
    <div 
      className="flex flex-col p-5 rounded-xl border border-slate-200 hover:border-blue-200 bg-white shadow-sm hover:shadow cursor-pointer"
      onClick={() => openTicketDialog(ticket)}
    >
      <div className="flex items-start gap-4">
        <div className={`p-2.5 rounded-lg ${statusProps.lightColor} ${statusProps.textColor} mt-0.5`}>
          <MessageSquare className="h-4 w-4" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <h4 className="font-medium text-slate-900 hover:text-blue-600">
              {ticket.title}
            </h4>
            <span className="text-xs text-slate-500 shrink-0 ml-2 font-mono bg-slate-100 px-1.5 py-0.5 rounded">#{ticket.id}</span>
          </div>
          
          <p className="text-sm text-slate-500 mt-1.5 line-clamp-2">{ticket.description}</p>
          
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Badge className={`${statusProps.color} text-white flex items-center gap-1.5 px-2.5 py-0.5 rounded-md`}>
              {statusProps.icon}
              {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1).replace('-', ' ')}
            </Badge>
            <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700 px-2 py-0.5 rounded-md">
              {ticket.category}
            </Badge>
            <Badge variant="outline" className={`border-slate-200 bg-slate-50 px-2 py-0.5 rounded-md ${
              ticket.priority === 'high' 
                ? 'text-red-600' 
                : ticket.priority === 'medium' 
                ? 'text-amber-600' 
                : 'text-blue-600'
            }`}>
              {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)} Priority
            </Badge>
          </div>
          
          <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center text-xs text-slate-500">
              <Clock className="h-3.5 w-3.5 mr-1" />
              Updated {formatDate(ticket.lastUpdated)}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-lg border-slate-200 hover:bg-blue-50 hover:text-blue-600 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                openTicketDialog(ticket);
              }}
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});
TicketCard.displayName = "TicketCard";

// Simplified ArticleCard
const ArticleCard = memo(({ article }: ArticleCardProps) => {
  return (
    <div className="flex items-start gap-4 p-5 rounded-xl hover:bg-blue-50/50 border border-transparent hover:border-blue-100 cursor-pointer">
      <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
        {article.icon && <article.icon className="h-5 w-5" />}
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-slate-900 hover:text-blue-600">{article.title}</h4>
        <p className="text-sm text-slate-500 mt-1">{article.description}</p>
        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
          <Badge variant="outline" className="text-xs bg-slate-50 border-slate-200 text-slate-600 px-2 py-0.5 rounded-md">
            {article.category}
          </Badge>
          <span className="text-xs text-slate-400">5 min read</span>
        </div>
      </div>
    </div>
  );
});
ArticleCard.displayName = "ArticleCard";

// Simplified StatCard
const StatCard = memo(({ icon, count, title, color, percentage }: StatCardProps) => {
  return (
    <div className={`p-4 rounded-xl bg-${color}-50 border border-${color}-100 hover:shadow-sm`}>
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-lg bg-${color}-100 text-${color}-600`}>
          {icon}
        </div>
        <span className={`text-2xl font-bold text-${color}-600`}>{count}</span>
      </div>
      <h4 className="text-sm font-medium text-slate-700 mt-2 flex items-center gap-1">
        {title}
        <span className={`text-xs font-normal text-${color}-500 ml-auto`}>{percentage}%</span>
      </h4>
      <div className={`w-full h-1.5 bg-${color}-100 rounded-full mt-2 overflow-hidden`}>
        <div className={`h-full w-${percentage}/100 bg-${color}-500 rounded-full`}></div>
      </div>
    </div>
  );
});
StatCard.displayName = "StatCard";

// Simplified MessageItem
const MessageItem = memo(({ message }: MessageItemProps) => {
  return (
    <div className={`flex gap-4 ${message.sender === 'agent' ? 'justify-start' : 'justify-end'}`}>
      {message.sender === 'agent' && (
        <Avatar className="h-10 w-10 border border-white">
          <AvatarImage src={message.avatar} alt={message.name} />
          <AvatarFallback className="bg-blue-500 text-white">
            {message.name.split(' ').map((n: string) => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
      )}
      <div className={`max-w-[75%] ${message.sender === 'agent' ? 'order-last' : 'order-first'}`}>
        <div className={`rounded-xl p-4 ${
          message.sender === 'agent' 
            ? 'bg-white border border-slate-200' 
            : 'bg-blue-500 text-white'
        }`}>
          <p className={`text-sm ${message.sender === 'agent' ? 'text-slate-800' : 'text-white'}`}>
            {message.content}
          </p>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-xs text-slate-500">{message.name}</span>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs text-slate-400">
            {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </span>
        </div>
      </div>
      {message.sender === 'user' && (
        <Avatar className="h-10 w-10 border border-white">
          <AvatarImage src={message.avatar} alt={message.name} />
          <AvatarFallback className="bg-indigo-500 text-white">
            {message.name.split(' ').map((n: string) => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
});
MessageItem.displayName = "MessageItem";

// Main component
export default function HelpDashboard() {
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState("articles");

  const openTicketDialog = useCallback((ticket: TicketType) => {
    setSelectedTicket(ticket);
    setIsDialogOpen(true);
  }, []);

  const handleSendMessage = useCallback(() => {
    if (newMessage.trim() === '') return;
    // In a real app, this would send the message to the API
    // For now, we'll just clear the input
    setNewMessage('');
  }, [newMessage]);

  // Memoize ticket counts to prevent recalculation
  const ticketStats = useMemo(() => {
    const stats = {
      open: 0,
      inProgress: 0,
      pending: 0,
      resolved: 0
    };
    
    tickets.forEach(ticket => {
      if (ticket.status === 'open') stats.open++;
      else if (ticket.status === 'in-progress') stats.inProgress++;
      else if (ticket.status === 'pending') stats.pending++;
      else if (ticket.status === 'resolved') stats.resolved++;
    });
    
    const total = tickets.length;
    return {
      open: stats.open,
      inProgress: stats.inProgress,
      pending: stats.pending,
      resolved: stats.resolved,
      openPercentage: Math.round((stats.open / total) * 100),
      inProgressPercentage: Math.round((stats.inProgress / total) * 100),
      pendingPercentage: Math.round((stats.pending / total) * 100),
      resolvedPercentage: Math.round((stats.resolved / total) * 100)
    };
  }, []);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);

  const currentMessages = useMemo(() => {
    if (!selectedTicket) return [];
    return ticketMessages[selectedTicket.id] || [];
  }, [selectedTicket]);

  // Memoize dialog content to prevent re-renders
  const dialogContent = useMemo(() => {
    if (!selectedTicket) return null;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 h-[80vh]">
        {/* Left Side - Ticket Details */}
        <div className="md:col-span-1 border-r border-slate-200 p-0 bg-slate-50/50">
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-slate-200 bg-white">
              <div className="flex items-center justify-between mb-4">
                <Badge className="px-2.5 py-0.5 text-xs font-medium bg-slate-100 text-slate-800 rounded-md">
                  Ticket #{selectedTicket.id}
                </Badge>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-slate-500">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">{selectedTicket.title}</h2>
              <p className="text-sm text-slate-600">{selectedTicket.description}</p>
            </div>
            
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                {/* Status */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-slate-900 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-slate-600" />
                    Status
                  </h3>
                  <div>
                    {(() => {
                      const statusProps = getStatusProperties(selectedTicket.status);
                      return (
                        <Badge className={`${statusProps.color} text-white flex items-center gap-1.5 px-2.5 py-1 rounded-md`}>
                          {statusProps.icon}
                          {selectedTicket.status.charAt(0).toUpperCase() + selectedTicket.status.slice(1).replace('-', ' ')}
                        </Badge>
                      );
                    })()}
                  </div>
                </div>
                
                {/* Priority */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-slate-900 flex items-center gap-2">
                    <Tag className="h-4 w-4 text-slate-600" />
                    Priority
                  </h3>
                  <div>
                    <Badge variant="outline" className={`border-slate-200 bg-slate-50 px-2.5 py-1 rounded-md ${
                      selectedTicket.priority === 'high' 
                        ? 'text-red-600' 
                        : selectedTicket.priority === 'medium' 
                        ? 'text-amber-600' 
                        : 'text-blue-600'
                    }`}>
                      {selectedTicket.priority.charAt(0).toUpperCase() + selectedTicket.priority.slice(1)} Priority
                    </Badge>
                  </div>
                </div>
                
                {/* Category */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-slate-900 flex items-center gap-2">
                    <AlignLeft className="h-4 w-4 text-slate-600" />
                    Category
                  </h3>
                  <div>
                    <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700 px-2.5 py-1 rounded-md">
                      {selectedTicket.category}
                    </Badge>
                  </div>
                </div>
                
                {/* Date Information */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-slate-900 flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-slate-600" />
                    Date Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Created:</span>
                      <span className="text-slate-900">{formatDate(selectedTicket.createdAt)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Last Updated:</span>
                      <span className="text-slate-900">{formatDate(selectedTicket.lastUpdated)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="pt-4">
                  <div className="space-y-2">
                    <Button 
                      className="w-full justify-start gap-2 rounded-xl text-sm font-medium" 
                      variant="outline"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Mark as Resolved
                    </Button>
                    <Button 
                      className="w-full justify-start gap-2 rounded-xl text-sm font-medium" 
                      variant="outline"
                    >
                      <User className="h-4 w-4" />
                      Assign Support Agent
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
        
        {/* Right Side - Chat Messages */}
        <div className="md:col-span-2 flex flex-col h-full">
          <div className="p-6 border-b border-slate-200 bg-white">
            <h2 className="text-lg font-semibold text-slate-900">Conversation</h2>
            <p className="text-sm text-slate-500">
              Ticket opened on {formatDate(selectedTicket.createdAt)}
            </p>
          </div>
          
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {currentMessages.map((message: MessageType) => (
                <MessageItem key={message.id} message={message} />
              ))}
            </div>
          </ScrollArea>
          
          {/* Message Input */}
          <div className="p-4 border-t border-slate-200 bg-white">
            <div className="flex gap-4">
              <Textarea 
                placeholder="Type your message here..." 
                className="flex-1 resize-none rounded-xl border-slate-200 min-h-[80px]"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <Button 
                onClick={handleSendMessage}
                className="h-10 w-10 rounded-full flex items-center justify-center bg-blue-600 text-white"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }, [selectedTicket, currentMessages, newMessage, handleSendMessage]);

  return (
    <div className="flex flex-col h-full min-h-0 space-y-6 px-6 pb-6 overflow-auto">
      {/* Background Pattern - Simplified */}
      <div className="absolute inset-0 bg-grid-slate-200/40 pointer-events-none"></div>
      
      {/* Banner Card - Simplified gradients and removed animations */}
      <div className="relative rounded-2xl overflow-hidden shadow-md z-10">
        <div className="relative py-8 px-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600"></div>
          
          <div className="relative z-10 flex md:flex-row flex-col md:items-center md:justify-between max-w-full">
            <div className="flex flex-col">
              <div className="inline-flex items-center space-x-2 mb-6 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 w-fit">
                <LifeBuoy className="h-3.5 w-3.5 text-blue-100" />
                <span className="text-xs font-medium text-blue-50">Support Center</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white">
                Help <span className="text-blue-200">& Support</span>
              </h1>
              <p className="text-blue-100 mt-2 max-w-2xl text-sm md:text-base mb-6 md:mb-0">
                Find answers, manage your support tickets, and get assistance with CloudHub
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 z-10">
        {/* Tabs Interface - Simplified */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full flex flex-col flex-1">
          <TabsList className="w-full bg-white/80 p-2 rounded-2xl border border-slate-200/70 shadow-md mb-6">
            <TabsTrigger 
              value="articles" 
              className="flex items-center gap-2 flex-1 text-sm font-medium py-3 px-4 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              Knowledge Base
            </TabsTrigger>
            <TabsTrigger 
              value="tickets" 
              className="flex items-center gap-2 flex-1 text-sm font-medium py-3 px-4 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              Support Tickets
            </TabsTrigger>
          </TabsList>

          <div className="flex-1">
            {/* Articles Tab */}
            <TabsContent value="articles" className="m-0 h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
                {/* Quick Help Card */}
                <Card className="border-none shadow-md rounded-3xl overflow-hidden bg-white/80 col-span-1 md:col-span-2 lg:col-span-1 h-auto">
                  <CardHeader className="border-b border-slate-100 bg-white px-8 py-6">
                    <CardTitle className="text-xl font-semibold text-blue-600">Quick Help</CardTitle>
                    <CardDescription className="text-slate-600 mt-1">Access resources and guides</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" className="h-auto py-4 px-6 flex flex-col items-center gap-2 hover:bg-blue-50/50 border-slate-200 rounded-xl">
                        <div className="p-2.5 rounded-full bg-blue-50 text-blue-600">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">Documentation</span>
                      </Button>
                      <Button variant="outline" className="h-auto py-4 px-6 flex flex-col items-center gap-2 hover:bg-indigo-50/50 border-slate-200 rounded-xl">
                        <div className="p-2.5 rounded-full bg-indigo-50 text-indigo-600">
                          <Video className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">Tutorials</span>
                      </Button>
                      <Button variant="outline" className="h-auto py-4 px-6 flex flex-col items-center gap-2 hover:bg-violet-50/50 border-slate-200 rounded-xl">
                        <div className="p-2.5 rounded-full bg-violet-50 text-violet-600">
                          <HelpCircle className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">FAQs</span>
                      </Button>
                      <Button variant="outline" className="h-auto py-4 px-6 flex flex-col items-center gap-2 hover:bg-blue-50/50 border-slate-200 rounded-xl">
                        <div className="p-2.5 rounded-full bg-blue-50 text-blue-600">
                          <Book className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">Guides</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Popular Articles */}
                <Card className="border-none shadow-md rounded-3xl overflow-hidden bg-white/80 col-span-1 md:col-span-2 h-auto">
                  <CardHeader className="border-b border-slate-100 bg-white px-8 py-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl font-semibold text-blue-600">Popular Articles</CardTitle>
                        <CardDescription className="text-slate-600 mt-1">Most viewed help articles</CardDescription>
                      </div>
                      <Button variant="outline" className="rounded-xl border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 gap-1.5 text-sm hidden md:flex">
                        <Book className="h-4 w-4" />
                        View All Articles
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 px-6 pb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {helpArticles.map((article, index) => (
                        <ArticleCard key={index} article={article} />
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4 rounded-xl border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 gap-1.5 text-sm md:hidden">
                      <Book className="h-4 w-4 mr-1" />
                      View All Articles
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tickets Tab */}
            <TabsContent value="tickets" className="m-0 h-full">
              <div className="flex flex-col gap-6">
                {/* Tickets Overview */}
                <Card className="border-none shadow-md rounded-3xl overflow-hidden bg-white/80 w-full h-auto">
                  <CardHeader className="border-b border-slate-100 bg-white px-6 py-5">
                    <CardTitle className="text-lg font-semibold text-blue-600">Ticket Statistics</CardTitle>
                    <CardDescription className="text-slate-600 mt-1">Overview of your support requests</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-5 px-6 pb-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <StatCard 
                        icon={<AlertCircle className="h-5 w-5" />} 
                        count={ticketStats.open} 
                        title="Open Tickets" 
                        color="blue" 
                        percentage={ticketStats.openPercentage} 
                      />
                      <StatCard 
                        icon={<Clock className="h-5 w-5" />} 
                        count={ticketStats.inProgress} 
                        title="In Progress" 
                        color="amber" 
                        percentage={ticketStats.inProgressPercentage} 
                      />
                      <StatCard 
                        icon={<Clock className="h-5 w-5" />} 
                        count={ticketStats.pending} 
                        title="Pending" 
                        color="purple" 
                        percentage={ticketStats.pendingPercentage} 
                      />
                      <StatCard 
                        icon={<CheckCircle2 className="h-5 w-5" />} 
                        count={ticketStats.resolved} 
                        title="Resolved" 
                        color="green" 
                        percentage={ticketStats.resolvedPercentage} 
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 mt-5">
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-md rounded-xl flex items-center justify-center gap-2">
                        <Plus className="h-4 w-4" />
                        New Support Request
                      </Button>
                      <Button variant="outline" className="flex-1 border-slate-200 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 gap-1.5 text-sm rounded-xl">
                        View All Tickets
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Tickets List */}
                <Card className="border-none shadow-md rounded-3xl overflow-hidden bg-white/80 w-full h-auto">
                  <CardHeader className="border-b border-slate-100 bg-white px-8 py-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <CardTitle className="text-xl font-semibold text-blue-600">Your Support Tickets</CardTitle>
                        <CardDescription className="text-slate-600 mt-1">View and manage your support requests</CardDescription>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                          <Input 
                            placeholder="Search tickets..." 
                            className="pl-9 bg-white/80 border-slate-200 rounded-xl min-w-[200px]"
                          />
                        </div>
                        <Button variant="outline" size="icon" className="rounded-xl border-slate-200 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200">
                          <Filter className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 px-6 pb-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {tickets.map((ticket, index) => (
                        <TicketCard key={index} ticket={ticket} openTicketDialog={openTicketDialog} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Ticket Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden rounded-2xl border-none bg-white shadow-xl">
          {dialogContent}
        </DialogContent>
      </Dialog>
    </div>
  )
} 