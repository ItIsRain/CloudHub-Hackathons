"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { ArrowLeft, Mail, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const { theme } = useTheme();

  // Memoize logo source to prevent unnecessary rerenders
  const logoSrc = useMemo(() => theme === 'dark' ? "/CloudHubDark.svg" : "/CloudHub.svg", [theme]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  // Memoize the success view to prevent unnecessary rerenders
  const SuccessView = useMemo(() => (
    <div className="flex flex-col items-center justify-center space-y-5 py-8">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full blur-xl opacity-70"></div>
        <div className="relative rounded-full bg-gradient-to-br from-green-400 to-emerald-500 p-5 shadow-lg">
          <Check className="h-9 w-9 text-white" />
        </div>
      </div>
      <div className="text-center space-y-3 max-w-sm mx-auto">
        <p className="text-gray-600 dark:text-gray-300">
          If you don't see the email in your inbox, please check your spam folder or request another reset link.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          The link will expire in 30 minutes for security reasons.
        </p>
      </div>
    </div>
  ), []);

  // Memoize the request form to prevent unnecessary rerenders
  const RequestForm = useMemo(() => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
          Email Address
        </div>
        <div className="relative group">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          <Input
            id="email"
            placeholder="name@example.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            className="pl-10 border-slate-200 dark:border-slate-700 focus:border-blue-500 group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-colors h-11 rounded-lg shadow-sm"
            disabled={isLoading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>
      <Button 
        className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 shadow-md px-6 h-11 min-w-[140px] font-medium rounded-xl transition-all duration-300 border-0 group mt-4" 
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending...
          </div>
        ) : (
          <span className="flex items-center justify-center">
            Send reset link
          </span>
        )}
      </Button>
    </form>
  ), [email, isLoading, handleSubmit]);

  // Memoize the card footer content
  const CardFooterContent = useMemo(() => (
    <div className="w-full text-center">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {isSubmitted ? (
          <Button 
            variant="link" 
            className="p-0 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 underline-offset-4 font-medium"
            onClick={() => {
              setIsSubmitted(false);
              setEmail("");
            }}
          >
            Didn't receive the email? Try again
          </Button>
        ) : (
          <span>
            Remember your password?{" "}
            <Link 
              href="/login" 
              className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 transition-all duration-300 relative inline-block group"
            >
              Sign in
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </span>
        )}
      </p>
    </div>
  ), [isSubmitted]);

  // Footer links memoized to prevent rerenders
  const FooterLinks = useMemo(() => (
    <div className="flex items-center justify-center space-x-4 mt-6">
      <Link href="#" className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link>
      <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
      <Link href="#" className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</Link>
      <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
      <Link href="#" className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Help</Link>
    </div>
  ), []);

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center bg-gradient-to-b from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 overflow-hidden">
      {/* Modern decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient background */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent dark:from-blue-900/20"></div>
        
        {/* Decorative circles */}
        <div className="absolute top-20 right-[10%] w-72 h-72 rounded-full bg-gradient-to-br from-blue-200/20 to-purple-300/30 dark:from-blue-800/20 dark:to-purple-800/20 blur-3xl"></div>
        <div className="absolute bottom-20 left-[5%] w-96 h-96 rounded-full bg-gradient-to-tr from-indigo-200/20 to-blue-300/30 dark:from-indigo-900/20 dark:to-blue-800/20 blur-3xl"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] dark:bg-[linear-gradient(to_right,rgba(99,102,241,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.1)_1px,transparent_1px)]"></div>
        
        {/* SVG decorative elements */}
        <svg className="absolute -bottom-40 -left-40 text-blue-500/5 dark:text-blue-300/5" width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(300,300)">
            <path d="M153.6,-106.8C196,-53.1,226.2,13.5,214.5,72.8C202.7,132.1,149,184,81.7,217C14.3,249.9,-66.7,264,-133.2,236C-199.8,208,-251.8,138,-263.7,62.3C-275.5,-13.4,-247.1,-94.7,-196.7,-147.5C-146.2,-200.3,-73.1,-224.6,-5.5,-220.5C62.1,-216.4,111.3,-160.6,153.6,-106.8Z" fill="currentColor" />
          </g>
        </svg>
        <svg className="absolute -top-40 -right-40 text-indigo-500/5 dark:text-indigo-300/5" width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(300,300)">
            <path d="M172.4,-118.8C220.7,-58.4,255,13.3,240.9,72.6C226.7,132,164.2,178.9,97.7,200.8C31.2,222.6,-39.3,219.3,-95.8,190.8C-152.3,162.3,-194.9,108.6,-215.8,43.7C-236.7,-21.3,-236,-97.5,-199.1,-156.7C-162.2,-215.9,-89.2,-258.1,-14.9,-249.2C59.3,-240.2,124.1,-179.3,172.4,-118.8Z" fill="currentColor" />
          </g>
        </svg>
      </div>

      <div className="container relative mx-auto px-4 py-8 sm:px-6">
        <div className="flex justify-center mb-6">
          <Image 
            src={logoSrc} 
            alt="CloudHub Logo" 
            width={180} 
            height={36} 
            className="dark:invert" 
          />
        </div>
        
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent inline-block mx-auto">
              {isSubmitted ? "Check your email" : "Reset your password"}
            </h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2">
              {isSubmitted 
                ? `We've sent a password reset link to ${email}` 
                : "We'll send you a link to reset your password"}
            </p>
          </div>
          
          <Card className="border-none shadow-xl w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md mx-auto overflow-hidden rounded-2xl">
            <div className="px-6 pt-5 pb-0 flex items-center">
              <Link
                href="/login"
                className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Back to login
              </Link>
            </div>
            
            <CardContent className={`pt-5 px-6 sm:px-8 ${isSubmitted ? "pb-5" : "pb-6"}`}>
              {isSubmitted ? SuccessView : RequestForm}
            </CardContent>
            
            <CardFooter className="border-t border-slate-100 dark:border-slate-800 mt-1 py-4">
              {CardFooterContent}
            </CardFooter>
          </Card>
          
          {FooterLinks}
        </div>
      </div>
    </div>
  );
} 