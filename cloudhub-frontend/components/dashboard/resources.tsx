"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  FileSpreadsheet
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
  
  // Filter resources based on search and category
  const filteredResources = resourcesData.flatMap(category => 
    category.resources.filter(resource => 
      (selectedCategory === "all" || category.category === selectedCategory) &&
      (resource.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       resource.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
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

  return (
    <div className="space-y-8 pb-10 px-4">
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

      {/* API Token Generator Card */}
      <Card className="border-slate-200 bg-gradient-to-br from-white to-violet-50/30 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden rounded-xl relative">
        <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-br from-violet-200/10 to-indigo-300/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-violet-200/10 to-transparent rounded-full blur-3xl"></div>
        
        <CardHeader className="bg-gradient-to-r from-violet-50 to-slate-50 border-b border-slate-100 pb-6 pt-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-violet-400/30 to-indigo-400/30 rounded-full blur-sm animate-pulse"></div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-md relative">
                <Sparkles className="h-6 w-6" />
              </div>
            </div>
            <div>
              <CardTitle className="text-xl text-slate-800 mb-1">API Token Generator</CardTitle>
              <CardDescription className="text-slate-600">Generate secure API tokens to use CloudHub API Infrastructure</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-8 relative z-10">
          <div className="flex flex-col gap-6">
            <div className="flex-grow p-5 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/80 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0">
                  <div className="bg-violet-100 rounded-full p-1">
                    <CheckCircle className="h-4 w-4 text-violet-600" />
                  </div>
                </div>
                <div>
                  <p className="font-medium mb-2 text-slate-800">Using API Tokens</p>
                  <p className="text-sm text-slate-600 mb-3">Add your token to API requests with the Authorization header:</p>
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 font-mono text-sm overflow-x-auto shadow-inner mb-2">
                    <code className="text-violet-700">Authorization: Bearer {tokenResult || 'YOUR_API_TOKEN'}</code>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <div className="bg-emerald-100 rounded-full p-0.5">
                        <CheckCircle className="h-3 w-3 text-emerald-600" />
                      </div>
                      <span>Secure HTTPS encryption</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <div className="bg-emerald-100 rounded-full p-0.5">
                        <CheckCircle className="h-3 w-3 text-emerald-600" />
                      </div>
                      <span>Custom expiry options</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <div className="bg-emerald-100 rounded-full p-0.5">
                        <CheckCircle className="h-3 w-3 text-emerald-600" />
                      </div>
                      <span>Revoke tokens anytime</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Token List */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <h3 className="font-medium text-slate-800">Your API Tokens</h3>
                <p className="text-sm text-slate-500 mt-1">Manage your active API tokens</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 text-left">
                    <tr>
                      <th className="px-4 py-3 text-xs font-medium text-slate-500">Name</th>
                      <th className="px-4 py-3 text-xs font-medium text-slate-500">Token</th>
                      <th className="px-4 py-3 text-xs font-medium text-slate-500">Created</th>
                      <th className="px-4 py-3 text-xs font-medium text-slate-500">Expires</th>
                      <th className="px-4 py-3 text-xs font-medium text-slate-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="text-sm">
                      <td className="px-4 py-3 font-medium text-slate-700">Development Token</td>
                      <td className="px-4 py-3 font-mono text-violet-600 text-xs">hub_***************************</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">May 12, 2023</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700">
                          14 days left
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                    <tr className="text-sm">
                      <td className="px-4 py-3 font-medium text-slate-700">Production API</td>
                      <td className="px-4 py-3 font-mono text-violet-600 text-xs">hub_***************************</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">Apr 28, 2023</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700">
                          25 days left
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50/70">
                <Button 
                  onClick={() => setShowTokenForm(true)} 
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white flex items-center gap-2 rounded-lg px-4 py-2 h-auto text-sm font-medium shadow-sm hover:shadow-md transition-all"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  Generate New API Token
                </Button>
              </div>
            </div>
          </div>

          {/* Token Dialog */}
          <Dialog open={showTokenForm} onOpenChange={setShowTokenForm}>
            <DialogContent className="sm:max-w-md bg-white rounded-2xl border-slate-200 shadow-xl">
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <DialogTitle className="text-xl text-slate-800">Create New API Token</DialogTitle>
                </div>
                <DialogDescription className="text-slate-600">
                  Tokens provide secure access to the CloudHub AI API.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="tokenName" className="block text-sm font-medium text-slate-700 mb-1">
                      Token Name
                    </label>
                    <Input
                      id="tokenName"
                      placeholder="e.g., Development Token"
                      value={tokenName}
                      onChange={(e) => setTokenName(e.target.value)}
                      className="border-slate-200 w-full rounded-md bg-white text-sm focus-visible:ring-violet-500"
                      required
                    />
                    <p className="mt-1 text-xs text-slate-500">Give your token a descriptive name for easy identification.</p>
                  </div>
                  
                  <div>
                    <label htmlFor="tokenExpiry" className="block text-sm font-medium text-slate-700 mb-1">
                      Expiry Period
                    </label>
                    <select
                      id="tokenExpiry"
                      value={tokenExpiry}
                      onChange={(e) => setTokenExpiry(e.target.value)}
                      className="w-full rounded-md border border-slate-200 bg-white py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    >
                      <option value="1">1 day</option>
                      <option value="3">3 days</option>
                      <option value="7">7 days</option>
                      <option value="14">14 days</option>
                      <option value="30">1 month</option>
                    </select>
                    <p className="mt-1 text-xs text-slate-500">After this period, the token will expire and no longer work.</p>
                  </div>
                  
                  <div className="flex items-start gap-2 p-3 bg-violet-50 rounded-lg border border-violet-100">
                    <div className="mt-0.5">
                      <div className="bg-violet-100 rounded-full p-0.5">
                        <CheckCircle className="h-3.5 w-3.5 text-violet-600" />
                      </div>
                    </div>
                    <div className="text-sm text-violet-700">
                      <p>Your token will only be shown once after generation. Save it in a secure location.</p>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter className="flex sm:justify-between items-center gap-3">
                <Button
                  variant="outline"
                  className="text-slate-700 border-slate-200"
                  onClick={() => setShowTokenForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={generateToken}
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
                  disabled={!tokenName || isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Create Token
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Token Result Dialog */}
          <Dialog open={showToken} onOpenChange={setShowToken}>
            <DialogContent className="sm:max-w-md bg-white rounded-2xl border-slate-200 shadow-xl">
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-600 to-emerald-600 text-white">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl text-slate-800">Token Generated!</DialogTitle>
                    <p className="text-xs text-slate-500 mt-1">
                      {tokenName} • Expires in {tokenExpiry} days
                    </p>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 shadow-inner font-mono text-sm overflow-x-auto">
                  <div className="flex justify-between items-center">
                    <code className="text-violet-700 break-all">{tokenResult}</code>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => copyToClipboard(tokenResult)}
                      className="h-8 w-8 p-0 ml-2 hover:bg-violet-100 hover:text-violet-700 rounded-md flex-shrink-0"
                      title="Copy to clipboard"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <div className="mt-0.5">
                    <div className="bg-amber-100 rounded-full p-0.5">
                      <CheckCircle className="h-3.5 w-3.5 text-amber-600" />
                    </div>
                  </div>
                  <div className="text-sm text-amber-700">
                    <p className="font-medium">Important:</p>
                    <p>This token will only be shown once. Copy it and store it securely. For security, we don't store tokens in a readable format.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="mt-0.5">
                    <div className="bg-slate-100 rounded-full p-0.5">
                      <Code className="h-3.5 w-3.5 text-slate-600" />
                    </div>
                  </div>
                  <div className="text-sm text-slate-700">
                    <p className="font-medium">Using your token:</p>
                    <p className="mt-1">Add this token to your API requests with the Authorization header:</p>
                    <code className="mt-2 block text-xs bg-white px-2 py-1 rounded border border-slate-200">
                      Authorization: Bearer {tokenResult || 'YOUR_TOKEN'}
                    </code>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={hideToken}
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
                >
                  I've Saved My Token
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
        </CardContent>
      </Card>

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
            className="pl-10 border-slate-200 rounded-lg py-2 text-sm focus-visible:ring-violet-500 shadow-none"
          />
        </div>
        <Tabs 
          value={selectedCategory} 
          onValueChange={setSelectedCategory}
          className="min-w-[300px]"
        >
          <TabsList className="w-full bg-slate-100 p-1 rounded-lg">
            <TabsTrigger value="all" className="text-xs rounded-md data-[state=active]:bg-white data-[state=active]:text-violet-700 data-[state=active]:shadow-sm">All</TabsTrigger>
            <TabsTrigger value="notebooks" className="text-xs rounded-md data-[state=active]:bg-white data-[state=active]:text-violet-700 data-[state=active]:shadow-sm">Notebooks</TabsTrigger>
            <TabsTrigger value="tutorials" className="text-xs rounded-md data-[state=active]:bg-white data-[state=active]:text-violet-700 data-[state=active]:shadow-sm">Tutorials</TabsTrigger>
            <TabsTrigger value="resources" className="text-xs rounded-md data-[state=active]:bg-white data-[state=active]:text-violet-700 data-[state=active]:shadow-sm">Learning Resources</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Documentation Section */}
      <Card className="border-slate-200 bg-white shadow-md rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-indigo-50 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-slate-300/30 to-indigo-300/30 rounded-full blur-sm"></div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-800 text-white shadow-sm relative">
                <FileText className="h-5 w-5" />
              </div>
            </div>
            <div>
              <CardTitle className="text-lg text-slate-800">API Documentation</CardTitle>
              <CardDescription className="text-slate-600 text-sm">Learn how to use the CloudHub AI API</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-base font-medium text-slate-800">Authentication</h3>
              <p className="text-sm text-slate-600">All API requests require an API token for authentication. Add the token to your request headers:</p>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 font-mono text-sm overflow-x-auto shadow-inner">
                <code className="text-violet-700">Authorization: Bearer YOUR_API_TOKEN</code>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-base font-medium text-slate-800">Example Request</h3>
              <p className="text-sm text-slate-600">Here's an example of how to use the Code Generator API:</p>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 font-mono text-sm overflow-x-auto shadow-inner">
                <pre className="text-violet-700 text-xs">{`fetch('https://api.cloudhub.ai/code/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_TOKEN'
  },
  body: JSON.stringify({
    language: 'javascript',
    prompt: 'Create a function to sort an array of objects by date'
  })
})`}</pre>
              </div>
            </div>
            
            <div className="flex justify-center pt-2">
              <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white flex items-center gap-2 px-4 py-2.5 h-auto rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all">
                <span>View Full Documentation</span>
                <ExternalLink className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 