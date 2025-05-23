"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Award,
  Users,
  Trophy,
  Star,
  CheckCircle2,
  Clock,
  Scale,
  BarChart2,
  Lightbulb,
  Gauge,
  ArrowUpRight,
  Github,
  FileText,
  Link as LinkIcon,
  ChevronRight,
  ChevronLeft,
  UserCircle2,
  Sparkles,
  MessageSquare,
  X
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import * as DialogPrimitive from "@radix-ui/react-dialog"

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

interface Project {
  id: string;
  name: string;
  team: string;
  teamMembers: TeamMember[];
  description: string;
  techStack: string[];
  category: string;
  submittedAt: string;
  status: "pending" | "reviewed";
  score: number | null;
  githubUrl: string;
  submissionFiles: string[];
}

interface Scores {
  innovation: number;
  technical: number;
  impact: number;
  presentation: number;
}

interface JudgeScore {
  judgeName: string;
  scores: Scores;
  timestamp: string;
}

export default function JudgingPage() {
  const [projects] = useState<Project[]>([
    {
      id: "1",
      name: "AI-Powered Health Monitor",
      team: "HealthTech Innovators",
      teamMembers: [
        { id: "1", name: "John Doe", avatar: "/avatars/john.png", role: "Team Lead" },
        { id: "2", name: "Jane Smith", avatar: "/avatars/jane.png", role: "ML Engineer" },
        { id: "3", name: "Mike Johnson", avatar: "/avatars/mike.png", role: "Frontend Developer" }
      ],
      description: "An innovative health monitoring system using artificial intelligence to predict potential health issues before they become serious.",
      techStack: ["Python", "TensorFlow", "React", "AWS"],
      category: "Healthcare",
      submittedAt: "2024-03-15T10:30:00",
      status: "pending",
      score: null,
      githubUrl: "https://github.com/healthtech/ai-monitor",
      submissionFiles: ["presentation.pdf", "demo-video.mp4", "architecture.png"],
    },
    {
      id: "2",
      name: "EcoTrack",
      team: "Green Solutions",
      teamMembers: [],
      description: "A blockchain-based platform for tracking carbon emissions and incentivizing eco-friendly practices in businesses.",
      techStack: ["Solidity", "Ethereum", "Node.js", "React"],
      category: "Sustainability",
      submittedAt: "2024-03-14T15:45:00",
      status: "reviewed",
      score: 92,
      githubUrl: "https://github.com/green-solutions/eco-track",
      submissionFiles: ["whitepaper.pdf", "demo-video.mp4", "architecture.png"],
    },
    {
      id: "3",
      name: "Smart Learning Assistant",
      team: "EduTech Pioneers",
      teamMembers: [],
      description: "An AI-powered learning assistant that adapts to individual student needs and provides personalized education paths.",
      techStack: ["Python", "OpenAI", "Vue.js", "MongoDB"],
      category: "Education",
      submittedAt: "2024-03-15T09:15:00",
      status: "pending",
      score: null,
      githubUrl: "https://github.com/edu-tech/smart-learning-assistant",
      submissionFiles: ["presentation.pdf", "demo-video.mp4", "architecture.png"],
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [scores, setScores] = useState<Scores>({
    innovation: 0,
    technical: 0,
    impact: 0,
    presentation: 0
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const steps = [
    { number: 1, title: "Project Overview", icon: Sparkles },
    { number: 2, title: "Evaluation", icon: Scale },
    { number: 3, title: "Review & Submit", icon: MessageSquare }
  ];

  const ProgressBar = ({ value, color = "purple" }: { value: number; color?: string }) => (
    <div className="relative w-full h-2 bg-slate-100 rounded-full overflow-hidden">
      <div 
        className={`absolute left-0 top-0 h-full bg-${color}-500 transition-all duration-300 rounded-full`}
        style={{ width: `${value}%` }}
      />
    </div>
  );

  const handleReviewClick = (project: Project) => {
    setSelectedProject(project);
    setIsDialogOpen(true);
  };

  const StepIndicator = () => (
    <div className="mb-8">
      <div className="flex justify-between">
        {steps.map((step, idx) => (
          <div key={step.number} className="flex flex-col items-center">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= step.number 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              <step.icon className="w-4 h-4" />
            </div>
            <span className={`text-xs mt-2 font-medium ${
              currentStep >= step.number 
                ? 'text-slate-800' 
                : 'text-slate-400'
            }`}>
              {step.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const [otherJudgesScores] = useState<JudgeScore[]>([
    {
      judgeName: "Alice Johnson",
      scores: {
        innovation: 85,
        technical: 90,
        impact: 88,
        presentation: 92
      },
      timestamp: "2024-03-15T14:30:00"
    },
    {
      judgeName: "Bob Smith",
      scores: {
        innovation: 92,
        technical: 88,
        impact: 85,
        presentation: 87
      },
      timestamp: "2024-03-15T15:45:00"
    }
  ]);

  const calculateAverageScore = (criterion: keyof Scores) => {
    const allScores = [...otherJudgesScores.map(judge => judge.scores[criterion]), scores[criterion]];
    return allScores.reduce((acc, curr) => acc + curr, 0) / allScores.length;
  };

  return (
    <div className="space-y-8 pb-10 px-6">
      {/* Modern Header Section with Stats */}
      <div className="relative overflow-hidden rounded-2xl shadow-lg mt-6 mb-8">
        {/* Gradient background with animated elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/20"></div>
        
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-1/3 h-4/5 bg-gradient-to-b from-white/10 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-2/3 h-1/2 bg-gradient-to-t from-blue-400/10 to-transparent rounded-full blur-3xl"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-[10%] w-12 h-12 rounded-full bg-purple-500/10 backdrop-blur-md border border-white/10"></div>
        <div className="absolute bottom-1/4 right-[15%] w-20 h-20 rounded-full bg-blue-500/10 backdrop-blur-md border border-white/10"></div>
          
        <div className="relative p-8 sm:p-10">
          <div className="grid gap-6 md:grid-cols-2 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-1.5 rounded-full mb-5 text-white text-sm border border-white/20 shadow-xl">
                <Scale className="h-4 w-4 text-purple-200" />
                <span className="font-medium tracking-wide">Judging Dashboard</span>
              </div>
              
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-3 tracking-tight">Project Evaluation</h1>
              
              <p className="text-white/90 text-lg mb-6 max-w-lg font-light">
                Review and score hackathon projects based on innovation, technical complexity, and impact.
              </p>
              
              <div className="space-x-2">
                <Button className="bg-white/10 backdrop-blur-md text-white border border-white/25 hover:bg-white/20 shadow-lg transition-all group px-5 py-2 h-auto text-sm font-medium rounded-xl">
                  <Star className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  Start Judging
                </Button>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 text-center shadow-xl">
                  <h3 className="text-3xl font-bold text-white">24</h3>
                  <p className="text-xs text-white/80 mt-1">Projects to Review</p>
                  <div className="text-xs text-purple-300 mt-2 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-purple-400/30 flex items-center justify-center mr-1">
                      <span className="text-[8px]">↑</span>
                    </div>
                    8 new submissions
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 text-center shadow-xl">
                  <h3 className="text-3xl font-bold text-white">16</h3>
                  <p className="text-xs text-white/80 mt-1">Reviewed Projects</p>
                  <div className="text-xs text-emerald-300 mt-2 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-emerald-400/30 flex items-center justify-center mr-1">
                      <span className="text-[8px]">+</span>
                    </div>
                    67% completion
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 text-center shadow-xl">
                  <h3 className="text-3xl font-bold text-white">85.4</h3>
                  <p className="text-xs text-white/80 mt-1">Average Score</p>
                  <div className="text-xs text-blue-300 mt-2 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-blue-400/30 flex items-center justify-center mr-1">
                      <span className="text-[8px]">!</span>
                    </div>
                    Top score: 98.5
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 text-center shadow-xl">
                  <h3 className="text-3xl font-bold text-white">4.2h</h3>
                  <p className="text-xs text-white/80 mt-1">Avg. Review Time</p>
                  <div className="text-xs text-emerald-300 mt-2 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-emerald-400/30 flex items-center justify-center mr-1">
                      <span className="text-[8px]">↓</span>
                    </div>
                    -1.5h from avg
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Projects to Review */}
        <Card className="col-span-2 border-slate-200 shadow-lg overflow-hidden rounded-xl">
          <CardHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-sm">
                  <Lightbulb className="h-4 w-4 text-white" />
                </div>
                <CardTitle className="text-lg font-semibold text-slate-800">Projects to Review</CardTitle>
              </div>
              <Button variant="outline" size="sm" className="h-8 border-purple-200 text-purple-700 hover:bg-purple-50">
                <ArrowUpRight className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id}>
                  <div 
                    className="group rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                    onClick={() => handleReviewClick(project)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-slate-800">{project.name}</h3>
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            {project.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">{project.description}</p>
                        <div className="flex items-center gap-2 mb-3">
                          <Users className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-600">{project.team}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {project.techStack.map((tech) => (
                            <span 
                              key={tech}
                              className="px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Dialog open={isDialogOpen && selectedProject?.id === project.id} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0 border-none shadow-2xl rounded-2xl bg-white overflow-hidden" hideCloseButton>
                      <DialogTitle className="sr-only">
                        Project Review: {project.name}
                      </DialogTitle>
                      
                      {/* Header Section - More compact */}
                      <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 px-8 py-6">
                        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
                        <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/20" />
                        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 blur-3xl transform rotate-12 translate-x-1/2" />
                        
                        <div className="relative">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="outline" className="bg-white/10 text-white border-white/20 px-3 py-1 text-sm rounded-full backdrop-blur-sm">
                              {project.category}
                            </Badge>
                            <Badge variant="outline" className="bg-white/10 text-white border-white/20 px-3 py-1 text-sm rounded-full backdrop-blur-sm">
                              TechInnovate 2024
                            </Badge>
                          </div>
                          <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">{project.name}</h2>
                          <p className="text-white/90 text-base max-w-2xl leading-relaxed">{project.description}</p>
                        </div>
                      </div>

                      {/* Progress Steps - More compact */}
                      <div className="px-8 py-4 border-b border-slate-100 bg-white">
                        <div className="flex justify-between items-center max-w-3xl mx-auto">
                          {steps.map((step) => (
                            <div key={step.number} className="flex flex-col items-center">
                              <div 
                                className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-all duration-200 ${
                                  currentStep >= step.number 
                                    ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-purple-100' 
                                    : 'bg-slate-50 text-slate-400 border border-slate-100'
                                }`}
                              >
                                <step.icon className="w-4 h-4" />
                              </div>
                              <span className={`text-xs mt-2 font-medium transition-colors duration-200 ${
                                currentStep >= step.number 
                                  ? 'text-slate-800' 
                                  : 'text-slate-400'
                              }`}>
                                {step.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Main Content Area */}
                      <div className="flex-1 min-h-0 flex flex-col">
                        <ScrollArea className="flex-1 px-8 py-6">
                          {currentStep === 1 && (
                            <div className="space-y-8 max-w-4xl mx-auto">
                              {/* Team Members */}
                              <div className="rounded-2xl border border-slate-100 p-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                                <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                                  <Users className="h-5 w-5 text-purple-500" />
                                  Team Members
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {project.teamMembers.map((member) => (
                                    <div 
                                      key={member.id}
                                      className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50"
                                    >
                                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                        {member.avatar ? (
                                          <img 
                                            src={member.avatar} 
                                            alt={member.name} 
                                            className="h-10 w-10 rounded-full object-cover"
                                          />
                                        ) : (
                                          <UserCircle2 className="h-6 w-6 text-purple-600" />
                                        )}
                                      </div>
                                      <div>
                                        <h4 className="font-medium text-slate-800">{member.name}</h4>
                                        <p className="text-sm text-slate-600">{member.role}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Tech Stack */}
                              <div className="rounded-2xl border border-slate-100 p-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                                <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                                  <Sparkles className="h-5 w-5 text-purple-500" />
                                  Tech Stack
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                  {project.techStack.map((tech) => (
                                    <div 
                                      key={tech}
                                      className="px-3 py-1.5 rounded-lg text-sm font-medium bg-purple-50 text-purple-700 border border-purple-100"
                                    >
                                      {tech}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Project Resources */}
                              <div className="rounded-2xl border border-slate-100 p-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                                <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                                  <LinkIcon className="h-5 w-5 text-purple-500" />
                                  Project Resources
                                </h3>
                                <div className="space-y-4">
                                  <a 
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-purple-200 hover:bg-purple-50 transition-colors group"
                                  >
                                    <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-purple-100">
                                      <Github className="h-5 w-5 text-slate-600 group-hover:text-purple-600" />
                                    </div>
                                    <div>
                                      <h4 className="font-medium text-slate-800 group-hover:text-purple-600">GitHub Repository</h4>
                                      <p className="text-sm text-slate-600">View project source code</p>
                                    </div>
                                  </a>
                                  
                                  <div className="space-y-3">
                                    <h4 className="font-medium text-slate-800">Submission Files</h4>
                                    {project.submissionFiles.map((file) => (
                                      <a 
                                        key={file}
                                        href="#"
                                        className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-purple-200 hover:bg-purple-50 transition-colors group"
                                      >
                                        <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-purple-100">
                                          <FileText className="h-5 w-5 text-slate-600 group-hover:text-purple-600" />
                                        </div>
                                        <div>
                                          <h4 className="font-medium text-slate-800 group-hover:text-purple-600">{file}</h4>
                                          <p className="text-sm text-slate-600">View submission file</p>
                                        </div>
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {currentStep === 2 && (
                            <div className="space-y-10 max-w-3xl mx-auto">
                              {/* Current Judge's Evaluation - Fixed slider implementation */}
                              <div className="rounded-2xl border border-slate-100 p-8 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                                <h3 className="text-lg font-semibold text-slate-800 mb-8 flex items-center gap-2">
                                  <Scale className="h-5 w-5 text-purple-500" />
                                  Your Evaluation
                                </h3>
                                <div className="space-y-8">
                                  {/* Innovation & Creativity */}
                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                      <label className="text-sm font-medium text-slate-700">Innovation & Creativity (30%)</label>
                                      <span className="text-sm font-medium text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg">{scores.innovation}</span>
                                    </div>
                                    <div className="relative h-2">
                                      <div 
                                        className="absolute left-0 top-0 h-2 bg-purple-600/20 rounded-full" 
                                        style={{ width: '100%' }}
                                      />
                                      <div 
                                        className="absolute left-0 top-0 h-2 bg-purple-600 rounded-full" 
                                        style={{ width: `${scores.innovation}%` }}
                                      />
                                      <input 
                                        type="range" 
                                        min="0" 
                                        max="100" 
                                        value={scores.innovation} 
                                        onChange={(e) => setScores({...scores, innovation: parseInt(e.target.value)})}
                                        className="absolute w-full h-2 opacity-0 cursor-pointer"
                                      />
                                    </div>
                                    <p className="text-sm text-slate-500">Evaluate the uniqueness and creative approach to solving problems</p>
                                  </div>

                                  {/* Technical Complexity */}
                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                      <label className="text-sm font-medium text-slate-700">Technical Complexity (25%)</label>
                                      <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">{scores.technical}</span>
                                    </div>
                                    <div className="relative h-2">
                                      <div 
                                        className="absolute left-0 top-0 h-2 bg-blue-600/20 rounded-full" 
                                        style={{ width: '100%' }}
                                      />
                                      <div 
                                        className="absolute left-0 top-0 h-2 bg-blue-600 rounded-full" 
                                        style={{ width: `${scores.technical}%` }}
                                      />
                                      <input 
                                        type="range" 
                                        min="0" 
                                        max="100" 
                                        value={scores.technical} 
                                        onChange={(e) => setScores({...scores, technical: parseInt(e.target.value)})}
                                        className="absolute w-full h-2 opacity-0 cursor-pointer"
                                      />
                                    </div>
                                    <p className="text-sm text-slate-500">Assess the implementation difficulty and technical sophistication</p>
                                  </div>

                                  {/* Impact & Usefulness */}
                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                      <label className="text-sm font-medium text-slate-700">Impact & Usefulness (25%)</label>
                                      <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">{scores.impact}</span>
                                    </div>
                                    <div className="relative h-2">
                                      <div 
                                        className="absolute left-0 top-0 h-2 bg-indigo-600/20 rounded-full" 
                                        style={{ width: '100%' }}
                                      />
                                      <div 
                                        className="absolute left-0 top-0 h-2 bg-indigo-600 rounded-full" 
                                        style={{ width: `${scores.impact}%` }}
                                      />
                                      <input 
                                        type="range" 
                                        min="0" 
                                        max="100" 
                                        value={scores.impact} 
                                        onChange={(e) => setScores({...scores, impact: parseInt(e.target.value)})}
                                        className="absolute w-full h-2 opacity-0 cursor-pointer"
                                      />
                                    </div>
                                    <p className="text-sm text-slate-500">Consider the potential impact and practical applicability</p>
                                  </div>

                                  {/* Presentation */}
                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                      <label className="text-sm font-medium text-slate-700">Presentation (20%)</label>
                                      <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">{scores.presentation}</span>
                                    </div>
                                    <div className="relative h-2">
                                      <div 
                                        className="absolute left-0 top-0 h-2 bg-emerald-600/20 rounded-full" 
                                        style={{ width: '100%' }}
                                      />
                                      <div 
                                        className="absolute left-0 top-0 h-2 bg-emerald-600 rounded-full" 
                                        style={{ width: `${scores.presentation}%` }}
                                      />
                                      <input 
                                        type="range" 
                                        min="0" 
                                        max="100" 
                                        value={scores.presentation} 
                                        onChange={(e) => setScores({...scores, presentation: parseInt(e.target.value)})}
                                        className="absolute w-full h-2 opacity-0 cursor-pointer"
                                      />
                                    </div>
                                    <p className="text-sm text-slate-500">Rate the quality of documentation and demonstration</p>
                                  </div>
                                </div>
                              </div>

                              {/* Other Judges' Scores - Redesigned layout */}
                              <div className="rounded-2xl border border-slate-100 p-8 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                                <h3 className="text-lg font-semibold text-slate-800 mb-8 flex items-center gap-2">
                                  <Users className="h-5 w-5 text-purple-500" />
                                  Other Judges' Scores
                                </h3>
                                <div className="space-y-6">
                                  {otherJudgesScores.map((judge, index) => (
                                    <div key={index} className="p-6 rounded-xl bg-slate-50 border border-slate-200">
                                      <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                            <UserCircle2 className="h-6 w-6 text-purple-600" />
                                          </div>
                                          <div>
                                            <h4 className="font-medium text-slate-800">{judge.judgeName}</h4>
                                            <p className="text-sm text-slate-500">
                                              Reviewed {new Date(judge.timestamp).toLocaleDateString()}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                          <span className="text-2xl font-bold text-purple-600">
                                            {((judge.scores.innovation * 0.3) + 
                                              (judge.scores.technical * 0.25) + 
                                              (judge.scores.impact * 0.25) + 
                                              (judge.scores.presentation * 0.2)).toFixed(1)}
                                          </span>
                                          <span className="text-sm text-slate-500">Overall Score</span>
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                          <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">Innovation</span>
                                            <span className="text-sm font-medium px-2.5 py-1 rounded-lg bg-purple-50 text-purple-600">
                                              {judge.scores.innovation}
                                            </span>
                                          </div>
                                          <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">Technical</span>
                                            <span className="text-sm font-medium px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600">
                                              {judge.scores.technical}
                                            </span>
                                          </div>
                                        </div>
                                        <div className="space-y-4">
                                          <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">Impact</span>
                                            <span className="text-sm font-medium px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600">
                                              {judge.scores.impact}
                                            </span>
                                          </div>
                                          <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">Presentation</span>
                                            <span className="text-sm font-medium px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600">
                                              {judge.scores.presentation}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Average Scores */}
                              <div className="rounded-2xl border border-slate-100 p-8 bg-white shadow-sm transition-shadow duration-200">
                                <h3 className="text-lg font-semibold text-slate-800 mb-8 flex items-center gap-2">
                                  <BarChart2 className="h-5 w-5 text-purple-500" />
                                  Average Scores
                                </h3>
                                <div className="space-y-8">
                                  <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Innovation</span>
                                        <span className="font-medium text-purple-600">{calculateAverageScore('innovation').toFixed(1)}</span>
                                      </div>
                                      <ProgressBar value={calculateAverageScore('innovation')} color="purple" />
                                    </div>
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Technical</span>
                                        <span className="font-medium text-blue-600">{calculateAverageScore('technical').toFixed(1)}</span>
                                      </div>
                                      <ProgressBar value={calculateAverageScore('technical')} color="blue" />
                                    </div>
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Impact</span>
                                        <span className="font-medium text-indigo-600">{calculateAverageScore('impact').toFixed(1)}</span>
                                      </div>
                                      <ProgressBar value={calculateAverageScore('impact')} color="indigo" />
                                    </div>
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">Presentation</span>
                                        <span className="font-medium text-emerald-600">{calculateAverageScore('presentation').toFixed(1)}</span>
                                      </div>
                                      <ProgressBar value={calculateAverageScore('presentation')} color="emerald" />
                                    </div>
                                  </div>

                                  <div className="pt-4 border-t border-slate-200">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-medium text-slate-700">Overall Average Score</span>
                                      <span className="text-lg font-semibold text-purple-600">
                                        {(
                                          (calculateAverageScore('innovation') * 0.3) +
                                          (calculateAverageScore('technical') * 0.25) +
                                          (calculateAverageScore('impact') * 0.25) +
                                          (calculateAverageScore('presentation') * 0.2)
                                        ).toFixed(1)}
                                      </span>
                                    </div>
                                    <ProgressBar 
                                      value={
                                        (calculateAverageScore('innovation') * 0.3) +
                                        (calculateAverageScore('technical') * 0.25) +
                                        (calculateAverageScore('impact') * 0.25) +
                                        (calculateAverageScore('presentation') * 0.2)
                                      } 
                                      color="purple"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {currentStep === 3 && (
                            <div className="space-y-8 max-w-3xl mx-auto pb-4">
                              {/* Final Review Summary */}
                              <div className="rounded-2xl border border-slate-100 p-8 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                                <div className="flex items-center justify-between mb-8">
                                  <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-purple-500" />
                                    Final Review Summary
                                  </h3>
                                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 px-3 py-1">
                                    Final Step
                                  </Badge>
                                </div>

                                {/* Your Evaluation Summary */}
                                <div className="space-y-6">
                                  <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-slate-50 border border-purple-100">
                                    <div className="flex items-center justify-between mb-6">
                                      <h4 className="font-medium text-slate-800">Your Evaluation</h4>
                                      <div className="flex flex-col items-end">
                                        <span className="text-3xl font-bold text-purple-600">
                                          {((scores.innovation * 0.3) + 
                                            (scores.technical * 0.25) + 
                                            (scores.impact * 0.25) + 
                                            (scores.presentation * 0.2)).toFixed(1)}
                                        </span>
                                        <span className="text-sm text-slate-600">Overall Score</span>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                      <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                          <span className="text-sm text-slate-600">Innovation (30%)</span>
                                          <span className="text-sm font-medium px-2.5 py-1 rounded-lg bg-purple-50 text-purple-600">
                                            {scores.innovation}
                                          </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <span className="text-sm text-slate-600">Technical (25%)</span>
                                          <span className="text-sm font-medium px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600">
                                            {scores.technical}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                          <span className="text-sm text-slate-600">Impact (25%)</span>
                                          <span className="text-sm font-medium px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600">
                                            {scores.impact}
                                          </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <span className="text-sm text-slate-600">Presentation (20%)</span>
                                          <span className="text-sm font-medium px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600">
                                            {scores.presentation}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Score Comparison */}
                                  <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
                                    <h4 className="font-medium text-slate-800 mb-6">Comparison with Other Judges</h4>
                                    <div className="space-y-6">
                                      <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                          <span className="text-slate-600">Your Overall Score</span>
                                          <span className="font-medium text-purple-600">
                                            {((scores.innovation * 0.3) + 
                                              (scores.technical * 0.25) + 
                                              (scores.impact * 0.25) + 
                                              (scores.presentation * 0.2)).toFixed(1)}
                                          </span>
                                        </div>
                                        <div className="space-y-2">
                                          <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-600">Average Score (All Judges)</span>
                                            <span className="font-medium text-slate-700">
                                              {(
                                                (calculateAverageScore('innovation') * 0.3) +
                                                (calculateAverageScore('technical') * 0.25) +
                                                (calculateAverageScore('impact') * 0.25) +
                                                (calculateAverageScore('presentation') * 0.2)
                                              ).toFixed(1)}
                                            </span>
                                          </div>
                                          <ProgressBar 
                                            value={
                                              (calculateAverageScore('innovation') * 0.3) +
                                              (calculateAverageScore('technical') * 0.25) +
                                              (calculateAverageScore('impact') * 0.25) +
                                              (calculateAverageScore('presentation') * 0.2)
                                            } 
                                            color="purple"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Comments Section */}
                              <div className="rounded-2xl border border-slate-100 p-8 bg-white shadow-sm transition-shadow duration-200">
                                <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                                  <MessageSquare className="h-5 w-5 text-purple-500" />
                                  Additional Comments
                                </h3>
                                <div className="space-y-4">
                                  <textarea
                                    className="w-full h-32 px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-400 focus:ring focus:ring-purple-100 transition-all resize-none"
                                    placeholder="Add any additional feedback or comments about the project..."
                                  />
                                  <p className="text-sm text-slate-500">
                                    Your comments will be visible to the project team and other judges.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </ScrollArea>

                        {/* Navigation Footer */}
                        <div className="flex justify-between items-center gap-4 px-8 py-5 border-t border-slate-100 bg-white">
                          {currentStep > 1 ? (
                            <Button 
                              variant="outline" 
                              onClick={() => setCurrentStep(step => step - 1)}
                              className="flex items-center gap-2 px-5 py-2.5 h-11 rounded-xl border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors duration-200"
                            >
                              <ChevronLeft className="w-4 h-4" />
                              Previous Step
                            </Button>
                          ) : (
                            <div />
                          )}
                          {currentStep < totalSteps ? (
                            <Button 
                              onClick={() => setCurrentStep(step => step + 1)}
                              className="flex items-center gap-2 px-5 py-2.5 h-11 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-sm hover:shadow transition-all duration-200 ml-auto"
                            >
                              Next Step
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button 
                              className="px-5 py-2.5 h-11 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-sm hover:shadow transition-all duration-200 ml-auto"
                            >
                              Submit Review
                            </Button>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Judging Criteria */}
        <Card className="border-slate-200 shadow-lg overflow-hidden rounded-xl">
          <CardHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                <Scale className="h-4 w-4 text-white" />
              </div>
              <CardTitle className="text-lg font-semibold text-slate-800">Judging Criteria</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">Innovation & Creativity</label>
                  <span className="text-sm text-slate-600">30%</span>
                </div>
                <ProgressBar value={30} color="purple" />
                <p className="text-xs text-slate-500">Uniqueness and creative approach to solving problems</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">Technical Complexity</label>
                  <span className="text-sm text-slate-600">25%</span>
                </div>
                <ProgressBar value={25} color="blue" />
                <p className="text-xs text-slate-500">Implementation difficulty and technical sophistication</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">Impact & Usefulness</label>
                  <span className="text-sm text-slate-600">25%</span>
                </div>
                <ProgressBar value={25} color="indigo" />
                <p className="text-xs text-slate-500">Potential impact and practical applicability</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">Presentation</label>
                  <span className="text-sm text-slate-600">20%</span>
                </div>
                <ProgressBar value={20} color="emerald" />
                <p className="text-xs text-slate-500">Quality of documentation and demonstration</p>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="rounded-lg bg-purple-50 border border-purple-200 p-4">
                  <div className="flex items-center gap-3 text-purple-800">
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <Trophy className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-bold">International Hackathon Scoring System (IHSS)</h4>
                      <p className="text-sm text-purple-700 mt-0.5">90-100: Exceptional</p>
                      <p className="text-sm text-purple-700">80-89: Excellent</p>
                      <p className="text-sm text-purple-700">70-79: Proficient</p>
                      <p className="text-sm text-purple-700">50-69: Developing</p>
                      <p className="text-sm text-purple-700">Below 50: Needs Improvement</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistics Section */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 mt-6">
        {/* Review Progress */}
        <Card className="border-slate-200 shadow-lg overflow-hidden rounded-xl">
          <CardHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-sm">
                <Gauge className="h-4 w-4 text-white" />
              </div>
              <CardTitle className="text-lg font-semibold text-slate-800">Review Progress</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Category Progress */}
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-4">Progress by Category</h4>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Healthcare</span>
                      <span className="text-sm font-medium text-slate-700">8/12 Reviewed</span>
                    </div>
                    <div className="relative">
                      <ProgressBar value={66.7} />
                      <span className="absolute right-0 top-2.5 text-xs text-slate-500">66.7%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Sustainability</span>
                      <span className="text-sm font-medium text-slate-700">5/6 Reviewed</span>
                    </div>
                    <div className="relative">
                      <ProgressBar value={83.3} />
                      <span className="absolute right-0 top-2.5 text-xs text-slate-500">83.3%</span>
                    </div>
                  </div>
                  <div className="space-y-2 pb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Education</span>
                      <span className="text-sm font-medium text-slate-700">3/6 Reviewed</span>
                    </div>
                    <div className="relative">
                      <ProgressBar value={50} />
                      <span className="absolute right-0 top-2.5 text-xs text-slate-500">50%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Time Distribution */}
              <div className="pt-6 border-t border-slate-200">
                <h4 className="text-sm font-medium text-slate-700 mb-4">Review Time Distribution</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg bg-purple-50 border border-purple-200 p-3 text-center">
                    <p className="text-2xl font-bold text-purple-700">2.5h</p>
                    <p className="text-xs text-purple-600 mt-1">Minimum</p>
                  </div>
                  <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-center">
                    <p className="text-2xl font-bold text-blue-700">4.2h</p>
                    <p className="text-xs text-blue-600 mt-1">Average</p>
                  </div>
                  <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-center">
                    <p className="text-2xl font-bold text-emerald-700">6.8h</p>
                    <p className="text-xs text-emerald-600 mt-1">Maximum</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score Distribution */}
        <Card className="border-slate-200 shadow-lg overflow-hidden rounded-xl">
          <CardHeader className="bg-gradient-to-r from-slate-50 via-purple-50 to-blue-50 border-b border-slate-200 p-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                <BarChart2 className="h-4 w-4 text-white" />
              </div>
              <CardTitle className="text-lg font-semibold text-slate-800">Score Distribution</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Score Ranges */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">90-100</span>
                    <span className="text-sm font-medium text-slate-700">4 Projects</span>
                  </div>
                  <div className="relative">
                    <ProgressBar value={25} />
                    <span className="absolute right-0 top-2.5 text-xs text-slate-500">25%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">80-89</span>
                    <span className="text-sm font-medium text-slate-700">6 Projects</span>
                  </div>
                  <div className="relative">
                    <ProgressBar value={37.5} />
                    <span className="absolute right-0 top-2.5 text-xs text-slate-500">37.5%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">70-79</span>
                    <span className="text-sm font-medium text-slate-700">4 Projects</span>
                  </div>
                  <div className="relative">
                    <ProgressBar value={25} />
                    <span className="absolute right-0 top-2.5 text-xs text-slate-500">25%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Below 70</span>
                    <span className="text-sm font-medium text-slate-700">2 Projects</span>
                  </div>
                  <div className="relative">
                    <ProgressBar value={12.5} />
                    <span className="absolute right-0 top-2.5 text-xs text-slate-500">12.5%</span>
                  </div>
                </div>
              </div>

              {/* Average Scores */}
              <div className="pt-6 border-t border-slate-200">
                <h4 className="text-sm font-medium text-slate-700 mb-4">Average Scores by Criteria</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Innovation & Creativity</span>
                    <span className="font-medium text-slate-700">87.5</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Technical Complexity</span>
                    <span className="font-medium text-slate-700">82.3</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Impact & Usefulness</span>
                    <span className="font-medium text-slate-700">85.7</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Presentation</span>
                    <span className="font-medium text-slate-700">89.2</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 