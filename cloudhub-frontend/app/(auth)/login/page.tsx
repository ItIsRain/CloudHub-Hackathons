"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Mail, Lock, Github, Eye, EyeOff, ShieldCheck, Globe, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { authAPI } from "@/lib/api/auth";
import { toast } from "sonner";
import CountryCodeSelect from '@/components/selects/CountryCodeSelect';

// Country code options for phone login
const countryCodes = [
  { value: "+1", label: "+1 (US/Canada)" },
  { value: "+44", label: "+44 (UK)" },
  { value: "+91", label: "+91 (India)" },
  { value: "+61", label: "+61 (Australia)" },
  { value: "+86", label: "+86 (China)" },
  { value: "+49", label: "+49 (Germany)" },
  { value: "+33", label: "+33 (France)" },
  { value: "+81", label: "+81 (Japan)" },
  { value: "+7", label: "+7 (Russia)" },
  { value: "+55", label: "+55 (Brazil)" },
  { value: "+52", label: "+52 (Mexico)" },
  { value: "+966", label: "+966 (Saudi Arabia)" },
  { value: "+971", label: "+971 (UAE)" },
  { value: "+65", label: "+65 (Singapore)" },
  { value: "+82", label: "+82 (South Korea)" },
  { value: "+234", label: "+234 (Nigeria)" },
  { value: "+27", label: "+27 (South Africa)" },
  { value: "+20", label: "+20 (Egypt)" },
  { value: "+34", label: "+34 (Spain)" },
  { value: "+39", label: "+39 (Italy)" },
  { value: "+31", label: "+31 (Netherlands)" },
  { value: "+90", label: "+90 (Turkey)" },
  { value: "+92", label: "+92 (Pakistan)" },
  { value: "+62", label: "+62 (Indonesia)" },
  { value: "+60", label: "+60 (Malaysia)" },
  { value: "+63", label: "+63 (Philippines)" },
  { value: "+84", label: "+84 (Vietnam)" },
  { value: "+66", label: "+66 (Thailand)" },
  { value: "+48", label: "+48 (Poland)" },
  { value: "+46", label: "+46 (Sweden)" },
  { value: "+41", label: "+41 (Switzerland)" },
  { value: "+43", label: "+43 (Austria)" },
  { value: "+32", label: "+32 (Belgium)" },
  { value: "+45", label: "+45 (Denmark)" },
  { value: "+64", label: "+64 (New Zealand)" }
];

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    full_name: string;
    role: string;
    avatar?: string;
  };
}

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { theme, systemTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [countryCode, setCountryCode] = useState('+1');
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Check for session expired error in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get('error');
    if (errorParam === 'session_expired') {
      toast.error('Your session has expired. Please log in again.', {
        duration: 5000,
        position: 'bottom-center',
      });
      // Remove the error parameter from the URL without refreshing the page
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  // Memoize the logo source to prevent unnecessary rerenders
  const logoSrc = useMemo(() => {
    const currentTheme = theme === 'system' ? systemTheme : theme;
    return currentTheme === 'dark' ? "/CloudHubDark.svg" : "/CloudHub.svg";
  }, [theme, systemTheme]);

  // Handle redirect in useEffect to avoid re-renders
  useEffect(() => {
    if (shouldRedirect) {
      router.push('/dashboard');
      setShouldRedirect(false);
    }
  }, [shouldRedirect, router]);

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    // Validate input
    if (loginMethod === 'email' && !email) {
      setError('Email is required');
      toast.error('Email is required', {
        duration: 5000,
        position: 'bottom-center',
      });
      return;
    }
    if (loginMethod === 'phone' && !phone) {
      setError('Phone number is required');
      toast.error('Phone number is required', {
        duration: 5000,
        position: 'bottom-center',
      });
      return;
    }
    if (!password) {
      setError('Password is required');
      toast.error('Password is required', {
        duration: 5000,
        position: 'bottom-center',
      });
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      let username = email;
      if (loginMethod === 'phone') {
        // Remove any non-digit characters from phone number
        const cleanPhone = phone.replace(/\D/g, '');
        username = `${countryCode}${cleanPhone}@phone.cloudhub.com`;
      }

      const response = await authAPI.login({
        username,
        password
      });

      // Check if we have both tokens before proceeding
      if (!response.access_token || !response.refresh_token) {
        throw new Error('Authentication failed');
      }

      // Store tokens and user data
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      
      if (response.user) {
        // Store user data
        const userData = {
          id: response.user.id,
          email: response.user.email,
          full_name: response.user.full_name,
          role: response.user.role,
          avatar: response.user.avatar || null
        };
        localStorage.setItem('user', JSON.stringify(userData));

        // Set cookies for server-side access
        document.cookie = `access_token=${response.access_token}; path=/`;
        document.cookie = `refresh_token=${response.refresh_token}; path=/`;
        document.cookie = `user=${JSON.stringify(userData)}; path=/`;

        // Show success message
        toast.success("Successfully logged in!");

        // Check for redirect parameter
        const params = new URLSearchParams(window.location.search);
        const redirectPath = params.get('redirect') || '/dashboard';
        
        // Use router.push to redirect
        router.push(redirectPath);
      } else {
        throw new Error('User data not received');
      }
    } catch (err: any) {
      setIsLoading(false);
      let errorMessage = 'Invalid email/phone or password';
      
      if (err.response?.status === 401) {
        errorMessage = 'Invalid email/phone or password';
      } else if (err.response?.status === 422) {
        // Handle validation errors
        const validationErrors = err.response.data;
        if (typeof validationErrors === 'object') {
          const messages = [];
          for (const key in validationErrors) {
            if (Array.isArray(validationErrors[key])) {
              messages.push(...validationErrors[key]);
            } else if (typeof validationErrors[key] === 'string') {
              messages.push(validationErrors[key]);
            }
          }
          errorMessage = messages.join(', ') || 'Invalid input data';
        } else if (err.response.data.detail) {
          errorMessage = err.response.data.detail;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      // Set error state and show toast with longer duration
      setError(errorMessage);
      toast.error(errorMessage, {
        duration: 5000,
        position: 'bottom-center',
      });
      return; // Return early to prevent further execution
    }
  }, [loginMethod, email, phone, countryCode, password, router]);

  // Memoize tab switcher to prevent rerenders when other state changes
  const TabSwitcher = useMemo(() => (
    <div className="relative flex items-center justify-center p-1 mb-6">
      <div className="flex items-center justify-center bg-slate-100/70 dark:bg-slate-800/50 rounded-2xl p-1.5 w-full max-w-xs relative">
        {/* Background highlight for active tab */}
        <div
          className={`absolute inset-1.5 w-[calc(50%-6px)] ${
            loginMethod === 'email' ? 'left-1.5' : 'left-[calc(50%+3px)]'
          } h-[calc(100%-12px)] bg-white dark:bg-slate-700 rounded-xl shadow-sm transition-all duration-300 ease-out`}
        />
        
        {/* Email Tab */}
        <button
          type="button"
          onClick={() => setLoginMethod('email')}
          className={`flex items-center justify-center w-1/2 h-11 rounded-xl relative z-10 transition-all duration-200 ${
            loginMethod === 'email'
              ? 'text-blue-600 dark:text-blue-400 scale-100'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 scale-95'
          }`}
        >
          <div className={`flex items-center space-x-2 transition-transform duration-200 ${
            loginMethod === 'email' ? 'transform scale-105' : ''
          }`}>
            <Mail className={`h-4 w-4 transition-colors duration-200 ${
              loginMethod === 'email' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'
            }`} />
            <span className="font-medium text-sm">Email</span>
          </div>
        </button>
        
        {/* Phone Tab */}
        <button
          type="button"
          onClick={() => setLoginMethod('phone')}
          className={`flex items-center justify-center w-1/2 h-11 rounded-xl relative z-10 transition-all duration-200 ${
            loginMethod === 'phone'
              ? 'text-blue-600 dark:text-blue-400 scale-100'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 scale-95'
          }`}
        >
          <div className={`flex items-center space-x-2 transition-transform duration-200 ${
            loginMethod === 'phone' ? 'transform scale-105' : ''
          }`}>
            <Phone className={`h-4 w-4 transition-colors duration-200 ${
              loginMethod === 'phone' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'
            }`} />
            <span className="font-medium text-sm">Phone</span>
          </div>
        </button>
      </div>
    </div>
  ), [loginMethod]);

  // Memoize email login form
  const EmailLoginForm = useMemo(() => (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-sm font-medium flex items-center">
          Email Address <Mail className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
        </Label>
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

      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-sm font-medium flex items-center">
          Password <Lock className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
        </Label>
        <div className="relative group">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          <Input
            id="password"
            placeholder="••••••••"
            type={showPassword ? "text" : "password"}
            autoCapitalize="none"
            autoComplete="current-password"
            className="pl-10 pr-10 border-slate-200 dark:border-slate-700 focus:border-blue-500 group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-colors h-11 rounded-lg shadow-sm"
            disabled={isLoading}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button 
            type="button"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors" 
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  ), [isLoading, showPassword, email, password]);

  // Memoize phone login form
  const PhoneLoginForm = useMemo(() => (
    <div className="space-y-3">
      <Label htmlFor="phone" className="-mb-1.5 text-sm font-medium flex items-center">
        Phone Number <Phone className="h-3 w-3 ml-1 text-muted-foreground" />
      </Label>
      <div className="flex space-x-2">
        <div className="w-[120px]">
          <CountryCodeSelect 
            value={countryCode} 
            onValueChange={(value: string) => setCountryCode(value)} 
          />
        </div>
        <div className="relative group flex-1">
          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          <Input
            id="phone"
            placeholder="(555) 123-4567"
            type="tel"
            className="pl-10 border-slate-200 dark:border-slate-700 focus:border-blue-500 group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-colors h-11 rounded-lg shadow-sm"
            disabled={isLoading}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-sm font-medium flex items-center">
          Password <Lock className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
        </Label>
        <div className="relative group">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          <Input
            id="password"
            placeholder="••••••••"
            type={showPassword ? "text" : "password"}
            autoCapitalize="none"
            autoComplete="current-password"
            className="pl-10 pr-10 border-slate-200 dark:border-slate-700 focus:border-blue-500 group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-colors h-11 rounded-lg shadow-sm"
            disabled={isLoading}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button 
            type="button"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors" 
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  ), [countryCode, phone, password, showPassword, isLoading]);

  // Memoize loading button for performance
  const SubmitButton = useMemo(() => (
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
          Signing in...
        </div>
      ) : (
        <span className="flex items-center justify-center">
          Sign In
        </span>
      )}
    </Button>
  ), [isLoading]);

  // Memoize social login buttons
  const SocialLoginButtons = useMemo(() => (
    <>
      <div className="relative flex items-center justify-center my-4">
        <div className="absolute inset-y-0 left-0 w-1/3 bg-slate-200 dark:bg-slate-700 h-px" />
        <span className="relative text-sm text-slate-500 dark:text-slate-400 px-2">or continue with</span>
        <div className="absolute inset-y-0 right-0 w-1/3 bg-slate-200 dark:bg-slate-700 h-px" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Button variant="outline" className="h-11 border-slate-200 dark:border-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 text-slate-700 dark:text-slate-300 transition-colors rounded-lg shadow-sm" disabled={isLoading}>
          <svg className="h-5 w-5 mr-1.5" aria-hidden="true" focusable="false" data-icon="google" viewBox="0 0 488 512">
            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
          </svg>
          Google
        </Button>
        
        <Button variant="outline" className="h-11 border-slate-200 dark:border-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 text-slate-700 dark:text-slate-300 transition-colors rounded-lg shadow-sm" disabled={isLoading}>
          <svg className="h-5 w-5 mr-1.5" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23">
            <path d="M21.1 0H12v9.1h9.1V0zM9.1 0H0v9.1h9.1V0zM21.1 12H12v9.1h9.1V12zM9.1 12H0v9.1h9.1V12z" />
          </svg>
          Microsoft
        </Button>
        
        <Button variant="outline" className="h-11 border-slate-200 dark:border-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 text-slate-700 dark:text-slate-300 transition-colors rounded-lg shadow-sm" disabled={isLoading}>
          <Github className="h-5 w-5 mr-1.5" />
          GitHub
        </Button>
      </div>
    </>
  ), [isLoading]);

  // Render the optimized UI
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
        <div className="flex justify-center mb-3">
          <Image 
            src={logoSrc} 
            alt="CloudHub Logo" 
            width={200} 
            height={36} 
            className="dark:invert" 
          />
        </div>
        
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-6">
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-2">
              Sign in to your account to continue
            </p>
          </div>
          
          <Card className="border-none shadow-xl w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md mx-auto overflow-hidden rounded-2xl">
            <CardContent className="pt-6 px-6 sm:px-8">
              {TabSwitcher}
              
              <form onSubmit={handleLogin} className="space-y-4">
                {loginMethod === "email" ? EmailLoginForm : PhoneLoginForm}

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg border border-red-100 dark:border-red-800/30 text-sm text-red-600 dark:text-red-400 flex items-start">
                    <div className="shrink-0 mr-2 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">{error}</div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember" 
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked === true)}
                    />
                    <Label 
                      htmlFor="remember" 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Remember me
                    </Label>
                  </div>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 transition-all duration-300 relative inline-block group"
                  >
                    Forgot password?
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </div>

                {SubmitButton}

                <div className="bg-blue-50/70 dark:bg-blue-900/30 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30 flex items-center text-sm text-blue-700 dark:text-blue-300 mt-4 shadow-sm">
                  <ShieldCheck className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p>This login is secured with advanced encryption. Your connection is secure.</p>
                </div>
              </form>
            </CardContent>

            <CardFooter className="border-t border-slate-100 dark:border-slate-800 mt-1 py-4">
              <div className="w-full text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{" "}
                  <Link
                    href="/register"
                    className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 transition-all duration-300 relative inline-block group"
                  >
                    Create an account
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </p>
              </div>
            </CardFooter>
          </Card>
          
          <div className="flex items-center justify-center space-x-4 mt-6">
            <Link href="#" className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link>
            <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
            <Link href="#" className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</Link>
            <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
            <Link href="#" className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Help</Link>
          </div>
        </div>
      </div>
    </div>
  );
} 