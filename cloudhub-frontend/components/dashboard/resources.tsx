"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ChevronRight,
  Copy,
  Sparkles,
  Zap,
  Code,
  FileText,
  MessageSquare,
  Brain,
  Terminal,
  Bot,
  PencilLine,
  Lightbulb,
  LineChart,
  BarChart,
  CheckCircle,
  Search,
  RefreshCw,
  Star,
  ArrowRight,
  ExternalLink,
  X,
  Book,
  FileCode,
  Github,
  Database,
  Laptop,
  School,
  Video,
  FileSpreadsheet,
  Plus,
  BarChartHorizontal,
  Gauge,
  Rocket,
  Download,
  Upload
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"

// Define tool interface for type safety
interface Resource {
  id: string;
  name: string;
  description: string;
  icon: any;
  link: string;
  featured?: boolean;
  popular?: boolean;
  new?: boolean;
  premium?: boolean;
}

interface ResourceCategory {
  category: string;
  title: string;
  resources: Resource[];
}

interface AITool {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: string;
  rateLimit: {
    requests: number;
    period: string;
    used: number;
  };
  pricing: string;
  popular?: boolean;
  new?: boolean;
}

// AI Tools data with rate limits
const aiToolsData: AITool[] = [
  {
    id: "text-generation",
    name: "Text Generation API",
    description: "Generate human-like text for various applications",
    icon: MessageSquare,
    category: "natural-language",
    rateLimit: {
      requests: 1000,
      period: "day",
      used: 320
    },
    pricing: "Free",
    popular: true
  },
  {
    id: "image-generation",
    name: "Image Generation API",
    description: "Create original images from text descriptions",
    icon: PencilLine,
    category: "computer-vision",
    rateLimit: {
      requests: 500,
      period: "day",
      used: 125
    },
    pricing: "Free",
    popular: true
  },
  {
    id: "code-generation",
    name: "Code Generation API",
    description: "Generate code snippets from natural language",
    icon: Code,
    category: "coding",
    rateLimit: {
      requests: 800,
      period: "day",
      used: 410
    },
    pricing: "Free"
  },
  {
    id: "data-analysis",
    name: "Data Analysis API",
    description: "Analyze and visualize data through AI",
    icon: BarChart,
    category: "data",
    rateLimit: {
      requests: 600,
      period: "day",
      used: 180
    },
    pricing: "Free"
  },
  {
    id: "chat-api",
    name: "Conversational AI",
    description: "Build chatbots and conversational interfaces",
    icon: Bot,
    category: "natural-language",
    rateLimit: {
      requests: 1500,
      period: "day",
      used: 870
    },
    pricing: "Free",
    new: true
  },
  {
    id: "speech-to-text",
    name: "Speech Recognition API",
    description: "Convert spoken language to written text",
    icon: FileText,
    category: "audio",
    rateLimit: {
      requests: 300,
      period: "day",
      used: 85
    },
    pricing: "Free",
    new: true
  }
];

// Resource categories with their respective resources
const resourcesData: ResourceCategory[] = [
  {
    category: "notebooks",
    title: "Google Colab Notebooks",
    resources: [
      {
        id: "intro-notebook",
        name: "Intro to Machine Learning",
        description: "Learn the fundamentals of ML with practical examples",
        icon: Laptop,
        link: "https://colab.research.google.com/drive/1X2n-pJqHu8XnhIQgz9qdRW6QiBTf4cw-",
        featured: true,
        popular: true,
      },
      {
        id: "data-analysis",
        name: "Data Analysis Toolkit",
        description: "Analyze datasets with pandas and visualization libraries",
        icon: Database,
        link: "https://colab.research.google.com/drive/1rZcJ7NNfXl-Aer6X2XlUJhe7xr2-VIhO",
        new: true,
      },
      {
        id: "nlp-notebook",
        name: "NLP Fundamentals",
        description: "Natural language processing techniques and models",
        icon: Book,
        link: "https://colab.research.google.com/drive/1vH9i5QMsVrZCJvfHF-Lx4v1Z5uxiPXm2",
      },
    ],
  },
  {
    category: "tutorials",
    title: "Tutorials & Guides",
    resources: [
      {
        id: "api-tutorial",
        name: "API Integration Guide",
        description: "Step-by-step guide to integrate CloudHub APIs",
        icon: FileCode,
        link: "https://docs.cloudhub.dev/tutorials/api-integration",
        featured: true,
      },
      {
        id: "data-viz",
        name: "Data Visualization Guide",
        description: "Create compelling visualizations from your data",
        icon: FileSpreadsheet,
        link: "https://docs.cloudhub.dev/tutorials/data-visualization",
      },
    ],
  },
  {
    category: "resources",
    title: "Learning Resources",
    resources: [
      {
        id: "video-course",
        name: "Video Course Library",
        description: "Complete video courses on machine learning and AI",
        icon: Video,
        link: "https://learn.cloudhub.dev/courses",
        featured: true,
        premium: true,
      },
      {
        id: "github-repo",
        name: "Project Templates",
        description: "Starter templates for hackathon projects",
        icon: Github,
        link: "https://github.com/cloudhub-tutorials/project-templates",
        new: true,
      },
      {
        id: "workshop",
        name: "Interactive Workshops",
        description: "Hands-on workshops led by industry experts",
        icon: School,
        link: "https://cloudhub.dev/workshops",
        premium: true,
      },
    ],
  },
];

export default function Resources() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [tokenResult, setTokenResult] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [animateToken, setAnimateToken] = useState(false);
  const [visibleResources, setVisibleResources] = useState<Resource[]>([]);
  const [showTokenForm, setShowTokenForm] = useState(false);
  const [tokenName, setTokenName] = useState("");
  const [tokenExpiry, setTokenExpiry] = useState("7");
  const [showToken, setShowToken] = useState(false);
  const [showCreateNotebook, setShowCreateNotebook] = useState(false);
  const [notebookName, setNotebookName] = useState("");
  const [notebookDescription, setNotebookDescription] = useState("");
  const [notebookTemplate, setNotebookTemplate] = useState("blank");
  const [isCreatingNotebook, setIsCreatingNotebook] = useState(false);
  const [showMarketplace, setShowMarketplace] = useState(false);
  const [aiToolsFilter, setAIToolsFilter] = useState("all");
  
  // Filter resources based on search and category
  const filteredResources = resourcesData.flatMap(category => 
    category.resources.filter(resource => 
      (selectedCategory === "all" || category.category === selectedCategory) &&
      (resource.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       resource.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  );

  // Filter AI tools based on search and category
  const filteredAITools = aiToolsData.filter(tool =>
    (aiToolsFilter === "all" || tool.category === aiToolsFilter) &&
    (tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     tool.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Animate resources appearing
  useEffect(() => {
    setVisibleResources([]);
    
    // Add resources with a staggered delay
    const timeout = setTimeout(() => {
      setVisibleResources(filteredResources);
    }, 100);
    
    return () => clearTimeout(timeout);
  }, [searchTerm, selectedCategory]);

  // Generate a token
  const generateToken = () => {
    if (!tokenName) return;
    
    setIsGenerating(true);
    setAnimateToken(false);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const randomToken = `hub_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      setTokenResult(randomToken);
      setIsGenerating(false);
      setAnimateToken(true);
      setShowToken(true);
      setShowTokenForm(false);
    }, 1500);
  };

  // Copy token to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowCopied(true);
    setTimeout(() => {
      setShowCopied(false);
    }, 2000);
  };

  // Hide token after it's been viewed
  const hideToken = () => {
    setShowToken(false);
    setTokenResult("");
    setTokenName("");
    setTokenExpiry("7");
  };

  // Create a new notebook
  const createNotebook = () => {
    if (!notebookName) return;
    
    setIsCreatingNotebook(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setIsCreatingNotebook(false);
      setShowCreateNotebook(false);
      
      // Reset form
      setNotebookName("");
      setNotebookDescription("");
      setNotebookTemplate("blank");
      
      // Add a notification (could be implemented)
    }, 1500);
  };

  return (
    <div className="space-y-8 mb-10 px-6 mt-6">
      {/* Hero Section */}
      <section className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-1/3 h-4/5 bg-gradient-to-b from-white/10 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-2/3 h-1/2 bg-gradient-to-t from-blue-400/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-[10%] w-12 h-12 rounded-lg bg-gradient-to-tr from-blue-500/30 to-transparent backdrop-blur-sm border border-white/10 animate-float-slow"></div>
        <div className="absolute bottom-16 right-[15%] w-16 h-16 rounded-lg bg-gradient-to-br from-indigo-500/20 to-transparent backdrop-blur-sm border border-white/10 animate-float"></div>
        <div className="absolute top-1/2 left-[30%] w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-transparent backdrop-blur-sm border border-white/10 animate-float-slow"></div>
        
        <div className="relative p-8 sm:p-12">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-1.5 rounded-full mb-5 text-white text-sm border border-white/20 shadow-xl">
                <Book className="h-4 w-4 text-blue-200" />
                <span className="font-medium tracking-wide">Learning Materials</span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
                Enhance Your Projects with{" "}
                <span className="relative">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">CloudHub Resources</span>
                  <span className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400/30 to-indigo-400/30 rounded-full blur-sm"></span>
                </span>
              </h1>
              
              <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl font-light leading-relaxed">
                Access our curated collection of AI tools, notebooks, tutorials, and learning materials to supercharge your hackathon projects.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button className="bg-white text-indigo-700 hover:bg-white/90 shadow-md transition-all group px-4 py-2.5 h-auto text-sm font-medium rounded-lg border border-white/50">
                  <span>Browse All Resources</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
            
            <div className="relative w-full max-w-xs md:max-w-sm xl:max-w-md">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl opacity-50 blur-xl animate-pulse"></div>
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10">
                <div className="p-5 space-y-4">
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <Laptop className="h-4 w-4" />
                    <span>Google Colab Notebook</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-3/4 rounded-full bg-white/10"></div>
                    <div className="h-3 w-full rounded-full bg-white/10"></div>
                    <div className="h-3 w-2/3 rounded-full bg-white/10"></div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 p-3 rounded-lg border border-white/10">
                    <div className="space-y-1">
                      <div className="h-2 w-full rounded-full bg-white/10"></div>
                      <div className="h-2 w-3/4 rounded-full bg-white/10"></div>
                      <div className="h-2 w-5/6 rounded-full bg-white/10"></div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="h-8 w-24 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 opacity-80"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Header with AI Tools & Notebooks Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Resources</h1>
          <p className="text-slate-500">Access AI tools, notebooks, and learning resources</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
                        <Button 
            onClick={() => setShowMarketplace(true)}
            className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white border-0 flex items-center gap-2"
          >
                    <Sparkles className="h-4 w-4" />
            <span>AI Tools Marketplace</span>
                </Button>
                <Button
            onClick={() => setShowCreateNotebook(true)}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 flex items-center gap-2"
                >
            <Plus className="h-4 w-4" />
            <span>Create Notebook</span>
        </Button>
          </div>
        </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <Input 
            placeholder="Search resources..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-slate-200/80 bg-gradient-to-r from-white to-slate-50/80 rounded-lg py-2 h-10 text-sm focus-visible:ring-violet-400 focus-visible:ring-opacity-25 shadow-sm transition-all hover:border-slate-300 focus-visible:border-violet-300"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              className="absolute inset-y-0 right-0 h-full px-3 text-slate-400 hover:text-slate-600"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="min-w-[300px] bg-gradient-to-r from-slate-50/80 to-white rounded-lg border border-slate-200/80 shadow-sm h-10 overflow-hidden">
        <Tabs 
          value={selectedCategory} 
          onValueChange={setSelectedCategory}
            className="w-full h-full"
          >
            <TabsList className="w-full bg-transparent grid grid-cols-4 h-full p-0">
              <TabsTrigger 
                value="all" 
                className="text-xs font-medium rounded-none text-slate-600 data-[state=active]:bg-white data-[state=active]:text-violet-700 data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-violet-500 h-full hover:bg-white/60 hover:text-violet-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-violet-500/0 after:transition-opacity hover:after:bg-violet-500/40"
              >
                All
              </TabsTrigger>
              <TabsTrigger 
                value="notebooks" 
                className="text-xs font-medium rounded-none text-slate-600 data-[state=active]:bg-white data-[state=active]:text-violet-700 data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-violet-500 h-full hover:bg-white/60 hover:text-violet-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-violet-500/0 after:transition-opacity hover:after:bg-violet-500/40"
              >
                Notebooks
              </TabsTrigger>
              <TabsTrigger 
                value="tutorials" 
                className="text-xs font-medium rounded-none text-slate-600 data-[state=active]:bg-white data-[state=active]:text-violet-700 data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-violet-500 h-full hover:bg-white/60 hover:text-violet-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-violet-500/0 after:transition-opacity hover:after:bg-violet-500/40"
              >
                Tutorials
              </TabsTrigger>
              <TabsTrigger 
                value="resources" 
                className="text-xs font-medium rounded-none text-slate-600 data-[state=active]:bg-white data-[state=active]:text-violet-700 data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-violet-500 h-full hover:bg-white/60 hover:text-violet-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-violet-500/0 after:transition-opacity hover:after:bg-violet-500/40"
              >
                Learning Resources
              </TabsTrigger>
          </TabsList>
        </Tabs>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create New Notebook Card (always visible) */}
        <Card className="group border border-blue-200 bg-gradient-to-br from-white to-blue-50 hover:shadow-md transition-all duration-300 overflow-hidden rounded-xl animate-fade-up">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100">
                <Plus className="h-6 w-6 text-blue-600" />
              </div>
              <Badge className="bg-blue-100 hover:bg-blue-200 text-blue-700 border-0">
                New
              </Badge>
            </div>
            
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Create New Notebook</h3>
            <p className="text-slate-600 text-sm mb-6">Start a new Google Colab notebook hosted by CloudHub</p>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-slate-600">Hosted on our servers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-slate-600">Easy sharing with team</span>
              </div>
            </div>
            
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0 py-2 h-auto rounded-lg text-sm font-medium transition-all group"
              onClick={() => setShowCreateNotebook(true)}
            >
              <span>Create notebook</span>
              <Plus className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </Card>

        {visibleResources.map((resource, index) => (
          <Card 
            key={resource.id} 
            className="group border border-slate-200 bg-white hover:shadow-md transition-all duration-300 overflow-hidden rounded-xl animate-fade-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="p-6">
              {/* Icon and badges */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  resource.premium ? "bg-violet-100" : 
                  resource.new ? "bg-green-100" : 
                  resource.popular ? "bg-amber-100" : "bg-blue-100"
                }`}>
                  <resource.icon className={`h-6 w-6 ${
                    resource.premium ? "text-violet-600" : 
                    resource.new ? "text-green-600" : 
                    resource.popular ? "text-amber-600" : "text-blue-600"
                  }`} />
                </div>
                <div className="flex gap-2">
                  {resource.new && (
                    <Badge className="bg-green-100 hover:bg-green-200 text-green-700 border-0">
                      New
                    </Badge>
                  )}
                  {resource.popular && (
                    <Badge className="bg-amber-100 hover:bg-amber-200 text-amber-700 border-0">
                      Popular
                    </Badge>
                  )}
                  {resource.premium && (
                    <Badge className="bg-violet-100 hover:bg-violet-200 text-violet-700 border-0">
                      Premium
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Resource name and description */}
              <h3 className="text-lg font-semibold text-slate-800 mb-2">{resource.name}</h3>
              <p className="text-slate-600 text-sm mb-6">{resource.description}</p>
              
              {/* Resource Link */}
              <div className="font-mono text-xs p-3 bg-slate-50 border border-slate-100 rounded-lg text-slate-600 mb-5 truncate">
                {resource.link}
              </div>
              
              {/* Features */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-slate-600">Documentation available</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-slate-600">Beginner friendly</span>
                </div>
              </div>
              
              {/* Button */}
              <Button 
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 border-0 py-2 h-auto rounded-lg text-sm font-medium transition-all group"
                onClick={() => window.open(resource.link, '_blank')}
              >
                <span>Open resource</span>
                <ExternalLink className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* AI Tools Marketplace Dialog */}
      <Dialog open={showMarketplace} onOpenChange={setShowMarketplace}>
        <DialogContent className="sm:max-w-6xl p-0 rounded-xl border-none overflow-hidden bg-gradient-to-b from-slate-50 to-white shadow-lg">
          <div className="relative py-6 px-6 sm:px-8 border-b border-slate-100 bg-gradient-to-r from-white via-white to-slate-50/80">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.015]"></div>
            <DialogHeader className="mb-0 relative">
          <div className="flex items-center gap-3">
            <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-br from-violet-400/20 to-indigo-400/20 rounded-full blur-md animate-pulse-slow"></div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white relative">
                    <Sparkles className="h-5 w-5" />
              </div>
            </div>
            <div>
                  <DialogTitle className="text-2xl font-bold text-slate-800 flex items-center">
                    AI Tools Marketplace
                    <Badge className="ml-3 bg-gradient-to-r from-indigo-100 to-sky-100 text-indigo-700 border-0 px-2">Beta</Badge>
                  </DialogTitle>
                  <DialogDescription className="text-slate-500">
                    Explore our curated collection of AI tools with detailed usage limits and documentation
                  </DialogDescription>
            </div>
          </div>
            </DialogHeader>
          </div>

          <div className="px-6 sm:px-8 pt-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <Input 
                  placeholder="Search AI tools by name or description..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-slate-200/80 bg-gradient-to-r from-white to-slate-50/80 rounded-lg py-2 h-10 text-sm focus-visible:ring-violet-400 focus-visible:ring-opacity-25 shadow-sm transition-all hover:border-slate-300 focus-visible:border-violet-300"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    className="absolute inset-y-0 right-0 h-full px-3 text-slate-400 hover:text-slate-600"
                    onClick={() => setSearchTerm("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="min-w-[350px] bg-gradient-to-r from-slate-50/80 to-white rounded-lg border border-slate-200/80 shadow-sm h-10 overflow-hidden">
                <Tabs 
                  value={aiToolsFilter} 
                  onValueChange={setAIToolsFilter}
                  className="w-full h-full"
                >
                  <TabsList className="w-full bg-transparent grid grid-cols-6 h-full p-0">
                    <TabsTrigger 
                      value="all" 
                      className="text-xs font-medium rounded-none text-slate-600 data-[state=active]:bg-white data-[state=active]:text-violet-700 data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-violet-500 h-full hover:bg-white/60 hover:text-violet-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-violet-500/0 after:transition-opacity hover:after:bg-violet-500/40"
                    >
                      All Tools
                    </TabsTrigger>
                    <TabsTrigger 
                      value="natural-language" 
                      className="text-xs font-medium rounded-none text-slate-600 data-[state=active]:bg-white data-[state=active]:text-violet-700 data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-violet-500 h-full hover:bg-white/60 hover:text-violet-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-violet-500/0 after:transition-opacity hover:after:bg-violet-500/40"
                    >
                      Language
                    </TabsTrigger>
                    <TabsTrigger 
                      value="computer-vision" 
                      className="text-xs font-medium rounded-none text-slate-600 data-[state=active]:bg-white data-[state=active]:text-violet-700 data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-violet-500 h-full hover:bg-white/60 hover:text-violet-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-violet-500/0 after:transition-opacity hover:after:bg-violet-500/40"
                    >
                      Vision
                    </TabsTrigger>
                    <TabsTrigger 
                      value="coding" 
                      className="text-xs font-medium rounded-none text-slate-600 data-[state=active]:bg-white data-[state=active]:text-violet-700 data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-violet-500 h-full hover:bg-white/60 hover:text-violet-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-violet-500/0 after:transition-opacity hover:after:bg-violet-500/40"
                    >
                      Coding
                    </TabsTrigger>
                    <TabsTrigger 
                      value="data" 
                      className="text-xs font-medium rounded-none text-slate-600 data-[state=active]:bg-white data-[state=active]:text-violet-700 data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-violet-500 h-full hover:bg-white/60 hover:text-violet-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-violet-500/0 after:transition-opacity hover:after:bg-violet-500/40"
                    >
                      Data
                    </TabsTrigger>
                    <TabsTrigger 
                      value="audio" 
                      className="text-xs font-medium rounded-none text-slate-600 data-[state=active]:bg-white data-[state=active]:text-violet-700 data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-violet-500 h-full hover:bg-white/60 hover:text-violet-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-violet-500/0 after:transition-opacity hover:after:bg-violet-500/40"
                    >
                      Audio
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
            
            {filteredAITools.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-slate-50/40 rounded-xl border border-slate-100/80 shadow-sm">
                <div className="relative w-16 h-16 mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-200/50 to-slate-100/30 rounded-full opacity-70 animate-pulse"></div>
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm border border-slate-200/60">
                    <Search className="h-7 w-7 text-slate-400" />
              </div>
            </div>
                <h3 className="text-lg font-medium text-slate-800 mb-1.5">No AI tools found</h3>
                <p className="text-slate-500 max-w-md mb-4">Try adjusting your search or filter to find what you're looking for.</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-sm border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-violet-700 hover:border-violet-200"
                  onClick={() => {
                    setSearchTerm('');
                    setAIToolsFilter('all');
                  }}
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                  Reset filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto pr-2 pb-6 marketplace-grid">
                {filteredAITools.map((tool, index) => (
                  <Card 
                    key={tool.id} 
                    className="group border border-slate-200/80 hover:border-violet-200 bg-white hover:shadow-md transition-all duration-300 overflow-hidden rounded-xl animate-fade-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="p-6 relative">
                      {/* Subtle gradient background effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/80 via-white to-white pointer-events-none"></div>
                      
                      {/* Header with Icon and Title */}
                      <div className="flex items-start relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tool.new ? "bg-gradient-to-br from-green-50 to-emerald-50 ring-1 ring-green-200/70" : 
                          tool.popular ? "bg-gradient-to-br from-amber-50 to-orange-50 ring-1 ring-amber-200/70" : 
                          "bg-gradient-to-br from-violet-50 to-indigo-50 ring-1 ring-violet-200/70"
                        }`}>
                          <tool.icon className={`h-5 w-5 ${
                            tool.new ? "text-green-600" : 
                            tool.popular ? "text-amber-600" : "text-violet-600"
                          }`} />
                        </div>
                        <div className="ml-3 flex-1">
                          <h3 className="text-base font-semibold text-slate-800 group-hover:text-violet-700 transition-colors flex items-center gap-2">
                            {tool.name}
                            {tool.new && (
                              <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-0 ml-1">
                                New
                              </Badge>
                            )}
                          </h3>
                          <div className="flex items-center mt-0.5 gap-2">
                            {tool.popular && (
                              <Badge className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border-0 px-1.5 py-0 h-5 text-[10px]">
                                Popular
                              </Badge>
                            )}
                            <Badge className="bg-gradient-to-r from-blue-100 to-sky-100 text-blue-700 border-0 px-1.5 py-0 h-5 text-[10px]">
                              {tool.pricing}
                            </Badge>
                            <span className="text-xs text-slate-500">
                              {tool.category === "natural-language" ? "Language" : 
                               tool.category === "computer-vision" ? "Vision" : 
                               tool.category.charAt(0).toUpperCase() + tool.category.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-slate-600 text-xs mt-3 min-h-[32px] relative">{tool.description}</p>

                      {/* Usage Metrics */}
                      <div className="mt-4 pb-1 relative">
                        <div className="flex justify-between items-center mb-1.5 text-sm">
                          <div className="font-medium text-slate-700">
                            Usage <span className="text-violet-700 font-semibold">{tool.rateLimit.used}</span>/<span className="font-semibold">{tool.rateLimit.requests}</span> requests
                          </div>
                          {tool.rateLimit.used / tool.rateLimit.requests > 0.8 ? (
                            <div className="text-xs font-medium px-1.5 py-0.5 rounded-md text-white bg-gradient-to-r from-red-500 to-rose-500 shadow-sm">
                              {Math.round((tool.rateLimit.used / tool.rateLimit.requests) * 100)}%
                            </div>
                          ) : tool.rateLimit.used / tool.rateLimit.requests > 0.6 ? (
                            <div className="text-xs font-medium px-1.5 py-0.5 rounded-md text-white bg-gradient-to-r from-amber-500 to-orange-500 shadow-sm">
                              {Math.round((tool.rateLimit.used / tool.rateLimit.requests) * 100)}%
                            </div>
                          ) : (
                            <div className="text-xs font-medium px-1.5 py-0.5 rounded-md text-white bg-gradient-to-r from-emerald-500 to-green-500 shadow-sm">
                              {Math.round((tool.rateLimit.used / tool.rateLimit.requests) * 100)}%
                            </div>
                          )}
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                          <div 
                            className={`h-full ${
                              tool.rateLimit.used / tool.rateLimit.requests > 0.8 
                                ? "bg-gradient-to-r from-red-500 to-rose-500" 
                                : tool.rateLimit.used / tool.rateLimit.requests > 0.6 
                                  ? "bg-gradient-to-r from-amber-500 to-orange-500" 
                                  : "bg-gradient-to-r from-emerald-500 to-green-500"
                            }`}
                            style={{ width: `${(tool.rateLimit.used / tool.rateLimit.requests) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Resets daily at midnight (+4 GMT Abu Dhabi time)</p>
                      </div>

                      {/* API Endpoint */}
                      <div className="px-3 py-2 mt-4 bg-gradient-to-r from-slate-50 to-slate-100/80 border border-slate-200/60 rounded-lg flex items-center shadow-sm relative">
                        <div className="font-mono text-xs text-slate-700 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                          api.cloudhub.ai/{tool.id}/v1
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0 rounded-md text-slate-400 hover:text-violet-700 hover:bg-violet-50 ml-1 flex-shrink-0"
                          onClick={() => copyToClipboard(`api.cloudhub.ai/${tool.id}/v1`)}
                        >
                          <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>

                      {/* Action Buttons */}
                      <div className="mt-4 flex gap-2 relative">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-9 text-xs border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-violet-200 hover:text-violet-700 flex-1 transition-all shadow-sm"
                        >
                          <FileText className="h-3.5 w-3.5 mr-1.5" />
                          Documentation
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-9 text-xs border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-violet-200 hover:text-violet-700 flex-1 transition-all shadow-sm"
                        >
                          <Code className="h-3.5 w-3.5 mr-1.5" />
                          Examples
                        </Button>
          </div>
                      
                      <Button 
                        className="w-full h-9 text-sm bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0 transition-all group mt-2 shadow-sm relative"
                      >
                        <div className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <Zap className="h-4 w-4 mr-2" />
                        <span>Try This API</span>
                        <ArrowRight className="h-3.5 w-3.5 ml-2 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                      </Button>
                    </div>
      </Card>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6 px-6 sm:px-8 py-4 border-t border-slate-100 bg-gradient-to-r from-slate-50/80 to-white">
            <div className="text-sm text-slate-500 flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
              Found {filteredAITools.length} AI tool{filteredAITools.length !== 1 ? 's' : ''} for your needs
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowMarketplace(false)} 
                className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 shadow-sm"
              >
                Close Marketplace
              </Button>
              <Button 
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-sm"
                onClick={() => {
                  setShowMarketplace(false);
                  setShowTokenForm(true);
                }}
              >
                <Zap className="h-4 w-4 mr-2" />
                <span>Generate API Token</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Notebook Dialog */}
      <Dialog open={showCreateNotebook} onOpenChange={setShowCreateNotebook}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              <div className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-blue-600" />
                <span>Create New Notebook</span>
              </div>
            </DialogTitle>
            <DialogDescription>
              Create a new Google Colab notebook hosted by CloudHub
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Notebook Name</label>
              <Input 
                placeholder="My New Notebook" 
                value={notebookName}
                onChange={(e) => setNotebookName(e.target.value)}
                className="border-slate-200"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Description (Optional)</label>
              <Textarea 
                placeholder="Describe the purpose of this notebook" 
                value={notebookDescription}
                onChange={(e) => setNotebookDescription(e.target.value)}
                className="border-slate-200 resize-none"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Template</label>
              <Select value={notebookTemplate} onValueChange={setNotebookTemplate}>
                <SelectTrigger className="border-slate-200">
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blank">Blank Notebook</SelectItem>
                  <SelectItem value="data-analysis">Data Analysis</SelectItem>
                  <SelectItem value="machine-learning">Machine Learning</SelectItem>
                  <SelectItem value="nlp">Natural Language Processing</SelectItem>
                  <SelectItem value="computer-vision">Computer Vision</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-between gap-3 flex-wrap">
            <Button variant="outline" onClick={() => setShowCreateNotebook(false)} className="border-slate-200">
              Cancel
            </Button>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              onClick={createNotebook}
              disabled={!notebookName || isCreatingNotebook}
            >
              {isCreatingNotebook ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Laptop className="h-4 w-4 mr-2" />
                  <span>Create Notebook</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showCopied && (
        <div className="fixed bottom-4 right-4 px-4 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg animate-fade-in z-50 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-400" />
          Token copied to clipboard!
        </div>
      )}
    </div>
  )
} 