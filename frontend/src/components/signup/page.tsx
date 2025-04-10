"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Github, Mail, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle signup logic here
    console.log({ name, email, password, confirmPassword, agreeToTerms })
  }

  return (
    <div className="min-h-screen bg-[#0a0a12] flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-6xl bg-[#0e0d14] rounded-2xl overflow-hidden shadow-2xl border border-gray-800 relative">
        {/* Gradient border effect */}
        <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-sm pointer-events-none"></div>

        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Stars */}
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                opacity: Math.random() * 0.7 + 0.3,
              }}
            ></div>
          ))}

          {/* Planets */}
          <div className="absolute top-[15%] right-[10%] w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/30 to-indigo-500/30 blur-sm"></div>
          <div className="absolute bottom-[20%] left-[15%] w-24 h-24 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 blur-sm"></div>
          <div className="absolute top-[60%] right-[20%] w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 blur-sm"></div>

          {/* Curved paths */}
          <svg
            className="absolute h-full w-full opacity-10"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M100,20 Q60,40 30,35 T0,70" stroke="rgba(147, 51, 234, 0.5)" strokeWidth="0.5" />
            <path d="M0,25 Q30,45 60,40 T100,75" stroke="rgba(139, 92, 246, 0.5)" strokeWidth="0.5" />
            <path d="M100,30 Q55,35 25,30 T0,65" stroke="rgba(79, 70, 229, 0.5)" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="relative z-10 grid md:grid-cols-2 gap-0">
          {/* Left side - Signup form */}
          <div className="bg-[#0a0a12]/50 backdrop-blur-sm p-8 md:p-12 flex flex-col justify-center order-2 md:order-1">
            <div className="max-w-md mx-auto w-full">
              <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Create your Account</h1>
                <p className="text-gray-400">Join thousands of developers enhancing their coding with AI assistance.</p>
              </div>

              <div className="space-y-4 mb-6">
                <Button
                  variant="outline"
                  className="w-full bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 text-white"
                >
                  <Github className="mr-2 h-4 w-4" />
                  Sign up with GitHub
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 text-white"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Sign up with Google
                </Button>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-[#0a0a12] text-gray-400">Or continue with</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-300">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-gray-800/50 border-gray-700 text-white focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-300">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-gray-800/50 border-gray-700 text-white focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-gray-800/50 border-gray-700 text-white focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="bg-gray-800/50 border-gray-700 text-white focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-start space-x-2 mt-6">
                  <Checkbox
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                    className="data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500 mt-1"
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-300"
                  >
                    I agree to the{" "}
                    <Link href="/terms" className="text-indigo-400 hover:text-indigo-300">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={!agreeToTerms}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              <div className="mt-8 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
                  Log in
                </Link>
              </div>
            </div>
          </div>

          {/* Right side - Custom illustration and tagline */}
          <div className="p-8 md:p-12 flex flex-col order-1 md:order-2">
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative w-full h-[300px] md:h-[400px] flex items-center justify-center">
                {/* Custom SVG illustration related to AI code assistance */}
                <svg viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  {/* Central AI Hub */}
                  <circle cx="250" cy="150" r="40" fill="url(#hub-gradient)" opacity="0.9" />
                  <circle cx="250" cy="150" r="35" fill="#1E1E2A" />
                  <circle cx="250" cy="150" r="30" fill="url(#hub-gradient)" opacity="0.4" />

                  {/* Orbiting code elements */}
                  <g className="orbit-element">
                    <circle cx="250" cy="150" r="80" stroke="#6366F1" strokeWidth="1" strokeDasharray="4 4" />
                    <circle cx="330" cy="150" r="15" fill="#1E1E2A" stroke="#6366F1" strokeWidth="1" />
                    <rect x="322" y="145" width="16" height="2" rx="1" fill="#6366F1" />
                    <rect x="322" y="150" width="12" height="2" rx="1" fill="#6366F1" />
                    <rect x="322" y="155" width="14" height="2" rx="1" fill="#6366F1" />
                  </g>

                  <g className="orbit-element" style={{ transform: "rotate(120deg)", transformOrigin: "250px 150px" }}>
                    <circle cx="250" cy="150" r="100" stroke="#8B5CF6" strokeWidth="1" strokeDasharray="4 4" />
                    <circle cx="350" cy="150" r="15" fill="#1E1E2A" stroke="#8B5CF6" strokeWidth="1" />
                    <rect x="342" y="145" width="16" height="2" rx="1" fill="#8B5CF6" />
                    <rect x="342" y="150" width="12" height="2" rx="1" fill="#8B5CF6" />
                    <rect x="342" y="155" width="14" height="2" rx="1" fill="#8B5CF6" />
                  </g>

                  <g className="orbit-element" style={{ transform: "rotate(240deg)", transformOrigin: "250px 150px" }}>
                    <circle cx="250" cy="150" r="120" stroke="#EC4899" strokeWidth="1" strokeDasharray="4 4" />
                    <circle cx="370" cy="150" r="15" fill="#1E1E2A" stroke="#EC4899" strokeWidth="1" />
                    <rect x="362" y="145" width="16" height="2" rx="1" fill="#EC4899" />
                    <rect x="362" y="150" width="12" height="2" rx="1" fill="#EC4899" />
                    <rect x="362" y="155" width="14" height="2" rx="1" fill="#EC4899" />
                  </g>

                  {/* User profiles joining */}
                  <g className="user-profile">
                    <circle cx="150" cy="250" r="25" fill="#1E1E2A" stroke="#6366F1" strokeWidth="1" />
                    <circle cx="150" cy="235" r="10" fill="#6366F1" />
                    <rect x="135" y="245" width="30" height="15" rx="7.5" fill="#6366F1" />
                    <line x1="150" y1="250" x2="220" y2="180" stroke="#6366F1" strokeWidth="1" strokeDasharray="3 3" />
                  </g>

                  <g className="user-profile">
                    <circle cx="350" cy="250" r="25" fill="#1E1E2A" stroke="#8B5CF6" strokeWidth="1" />
                    <circle cx="350" cy="235" r="10" fill="#8B5CF6" />
                    <rect x="335" y="245" width="30" height="15" rx="7.5" fill="#8B5CF6" />
                    <line x1="350" y1="250" x2="280" y2="180" stroke="#8B5CF6" strokeWidth="1" strokeDasharray="3 3" />
                  </g>

                  <g className="user-profile">
                    <circle cx="250" cy="320" r="25" fill="#1E1E2A" stroke="#EC4899" strokeWidth="1" />
                    <circle cx="250" cy="305" r="10" fill="#EC4899" />
                    <rect x="235" y="315" width="30" height="15" rx="7.5" fill="#EC4899" />
                    <line x1="250" y1="320" x2="250" y2="190" stroke="#EC4899" strokeWidth="1" strokeDasharray="3 3" />
                  </g>

                  {/* Success checkmarks */}
                  <g className="success-mark">
                    <circle cx="180" cy="200" r="15" fill="#1E1E2A" stroke="#10B981" strokeWidth="1" />
                    <path
                      d="M175 200L178 203L186 195"
                      stroke="#10B981"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>

                  <g className="success-mark">
                    <circle cx="320" cy="200" r="15" fill="#1E1E2A" stroke="#10B981" strokeWidth="1" />
                    <path
                      d="M315 200L318 203L326 195"
                      stroke="#10B981"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>

                  <g className="success-mark">
                    <circle cx="250" cy="250" r="15" fill="#1E1E2A" stroke="#10B981" strokeWidth="1" />
                    <path
                      d="M245 250L248 253L256 245"
                      stroke="#10B981"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>

                  {/* Small floating particles */}
                  <circle cx="200" cy="120" r="2" fill="#6366F1" />
                  <circle cx="300" cy="120" r="2" fill="#8B5CF6" />
                  <circle cx="220" cy="180" r="2" fill="#EC4899" />
                  <circle cx="280" cy="180" r="2" fill="#6366F1" />
                  <circle cx="190" cy="220" r="2" fill="#8B5CF6" />
                  <circle cx="310" cy="220" r="2" fill="#EC4899" />

                  {/* Gradients */}
                  <defs>
                    <linearGradient id="hub-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366F1" />
                      <stop offset="50%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                  </defs>

                  {/* Animation keyframes */}
                  <style>
                    {`
                      @keyframes orbit {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                      }
                      @keyframes pulse {
                        0% { opacity: 0.7; transform: scale(1); }
                        50% { opacity: 1; transform: scale(1.05); }
                        100% { opacity: 0.7; transform: scale(1); }
                      }
                      @keyframes float {
                        0% { transform: translateY(0px); }
                        50% { transform: translateY(-5px); }
                        100% { transform: translateY(0px); }
                      }
                      .orbit-element {
                        animation: orbit 20s linear infinite;
                      }
                      .orbit-element:nth-child(2) {
                        animation-duration: 25s;
                      }
                      .orbit-element:nth-child(3) {
                        animation-duration: 30s;
                      }
                      .user-profile {
                        animation: float 6s ease-in-out infinite;
                      }
                      .user-profile:nth-child(2) {
                        animation-delay: 1s;
                      }
                      .user-profile:nth-child(3) {
                        animation-delay: 2s;
                      }
                      .success-mark {
                        animation: pulse 4s ease-in-out infinite;
                      }
                      .success-mark:nth-child(2) {
                        animation-delay: 1s;
                      }
                      .success-mark:nth-child(3) {
                        animation-delay: 2s;
                      }
                    `}
                  </style>
                </svg>
              </div>

              <div className="mt-8 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Join our AI-powered community</h2>
                <p className="text-gray-400 max-w-md mx-auto">
                  Connect with developers worldwide and experience the future of coding with intelligent AI assistance.
                </p>
              </div>
            </div>

            {/* Feature highlights */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-indigo-400" />
                </div>
                <div className="text-sm text-gray-400">Smart code suggestions tailored to your style</div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-indigo-400" />
                </div>
                <div className="text-sm text-gray-400">Seamless integration with your workflow</div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-indigo-400" />
                </div>
                <div className="text-sm text-gray-400">Continuous learning from your coding patterns</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
