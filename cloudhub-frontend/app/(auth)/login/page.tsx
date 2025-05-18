"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Mail, Lock, Github, Eye, EyeOff, ShieldCheck, Globe, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState("email");
  const [countryCode, setCountryCode] = useState("+971");
  const [phone, setPhone] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1500);
  };

  // Determine which logo to use based on theme
  const logoSrc = theme === 'dark' ? "/CloudHubDark.svg" : "/CloudHub.svg";

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
            {/* Simplified tab switcher */}
            <div className="pt-6 px-6 pb-4">
              <div className="mx-auto max-w-[280px] bg-slate-100/70 dark:bg-slate-800/50 rounded-full p-0.5 flex relative shadow-sm">
                <div 
                  className={`absolute inset-0 m-0.5 ${loginMethod === 'email' ? 'translate-x-0' : 'translate-x-full'} bg-white dark:bg-slate-700 rounded-full transition-transform duration-300 ease-out shadow-sm`} 
                  style={{width: 'calc(50% - 2px)'}}
                ></div>
                <button
                  type="button"
                  onClick={() => setLoginMethod('email')}
                  className={`flex items-center justify-center w-1/2 h-10 rounded-full relative z-10 transition-colors duration-200 ${loginMethod === 'email' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  <span className="font-medium text-sm">Email</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('phone')}
                  className={`flex items-center justify-center w-1/2 h-10 rounded-full relative z-10 transition-colors duration-200 ${loginMethod === 'phone' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  <span className="font-medium text-sm">Phone</span>
                </button>
              </div>
            </div>
            
            <CardContent className="pt-3 px-6 sm:px-8">
              <form onSubmit={handleEmailLogin} className="space-y-4">
                {loginMethod === "email" ? (
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
                ) : (
                  <div className="space-y-3">
                    <Label htmlFor="phone" className="text-sm font-medium flex items-center">
                      Phone Number <Phone className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
                    </Label>
                    <div className="flex space-x-2">
                      <div className="w-24">
                        <Select value={countryCode} onValueChange={setCountryCode}>
                          <SelectTrigger className="border-slate-200 dark:border-slate-700 focus:border-blue-500 hover:border-blue-400 dark:hover:border-blue-500 transition-colors h-11 rounded-lg shadow-sm">
                            <SelectValue placeholder="+1" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="+1">+1 (US/Canada)</SelectItem>
                            <SelectItem value="+44">+44 (UK)</SelectItem>
                            <SelectItem value="+91">+91 (India)</SelectItem>
                            <SelectItem value="+61">+61 (Australia)</SelectItem>
                            <SelectItem value="+86">+86 (China)</SelectItem>
                            <SelectItem value="+49">+49 (Germany)</SelectItem>
                            <SelectItem value="+33">+33 (France)</SelectItem>
                            <SelectItem value="+81">+81 (Japan)</SelectItem>
                            <SelectItem value="+7">+7 (Russia)</SelectItem>
                            <SelectItem value="+55">+55 (Brazil)</SelectItem>
                            <SelectItem value="+52">+52 (Mexico)</SelectItem>
                            <SelectItem value="+966">+966 (Saudi Arabia)</SelectItem>
                            <SelectItem value="+971">+971 (UAE)</SelectItem>
                            <SelectItem value="+65">+65 (Singapore)</SelectItem>
                            <SelectItem value="+82">+82 (South Korea)</SelectItem>
                            <SelectItem value="+234">+234 (Nigeria)</SelectItem>
                            <SelectItem value="+27">+27 (South Africa)</SelectItem>
                            <SelectItem value="+20">+20 (Egypt)</SelectItem>
                            <SelectItem value="+34">+34 (Spain)</SelectItem>
                            <SelectItem value="+39">+39 (Italy)</SelectItem>
                            <SelectItem value="+31">+31 (Netherlands)</SelectItem>
                            <SelectItem value="+90">+90 (Turkey)</SelectItem>
                            <SelectItem value="+92">+92 (Pakistan)</SelectItem>
                            <SelectItem value="+62">+62 (Indonesia)</SelectItem>
                            <SelectItem value="+60">+60 (Malaysia)</SelectItem>
                            <SelectItem value="+63">+63 (Philippines)</SelectItem>
                            <SelectItem value="+84">+84 (Vietnam)</SelectItem>
                            <SelectItem value="+66">+66 (Thailand)</SelectItem>
                            <SelectItem value="+48">+48 (Poland)</SelectItem>
                            <SelectItem value="+46">+46 (Sweden)</SelectItem>
                            <SelectItem value="+41">+41 (Switzerland)</SelectItem>
                            <SelectItem value="+43">+43 (Austria)</SelectItem>
                            <SelectItem value="+32">+32 (Belgium)</SelectItem>
                            <SelectItem value="+45">+45 (Denmark)</SelectItem>
                            <SelectItem value="+64">+64 (New Zealand)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="relative group flex-1">
                        <Input
                          id="phone"
                          placeholder="(555) 123-4567"
                          type="tel"
                          className="border-slate-200 dark:border-slate-700 focus:border-blue-500 group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-colors h-11 rounded-lg shadow-sm"
                          disabled={isLoading}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" />
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

                <div className="relative flex items-center justify-center my-4">
                  <div className="absolute inset-y-0 left-0 w-1/3 bg-slate-200 dark:bg-slate-700 h-px" />
                  <span className="relative text-sm text-slate-500 dark:text-slate-400 px-2">or continue with</span>
                  <div className="absolute inset-y-0 right-0 w-1/3 bg-slate-200 dark:bg-slate-700 h-px" />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <Button variant="outline" className="h-11 border-slate-200 dark:border-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 text-slate-700 dark:text-slate-300 transition-colors rounded-lg shadow-sm" disabled={isLoading}>
                    <svg className="h-5 w-5 mr-1.5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z" fill="#4285F4" />
                      <path d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z" fill="#34A853" />
                      <path d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z" fill="#FBBC04" />
                      <path d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z" fill="#EA4335" />
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