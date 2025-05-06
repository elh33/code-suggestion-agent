'use client';

import type React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Github, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const { login, error: authError, loading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    const success = await login({ email, password });
    if (success) {
      router.push('/dashboard'); // Redirect to dashboard on success
    }
  };

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
          <div className="absolute top-[15%] left-[10%] w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/30 to-indigo-500/30 blur-sm"></div>
          <div className="absolute bottom-[20%] right-[15%] w-24 h-24 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 blur-sm"></div>
          <div className="absolute top-[60%] left-[20%] w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 blur-sm"></div>

          {/* Curved paths */}
          <svg
            className="absolute h-full w-full opacity-10"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,20 Q40,40 70,35 T100,70"
              stroke="rgba(147, 51, 234, 0.5)"
              strokeWidth="0.5"
            />
            <path
              d="M100,25 Q70,45 40,40 T0,75"
              stroke="rgba(139, 92, 246, 0.5)"
              strokeWidth="0.5"
            />
            <path
              d="M0,30 Q45,35 75,30 T100,65"
              stroke="rgba(79, 70, 229, 0.5)"
              strokeWidth="0.5"
            />
          </svg>
        </div>

        <div className="relative z-10 grid md:grid-cols-2 gap-0">
          {/* Left side - Custom illustration and tagline */}
          <div className="p-8 md:p-12 flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative w-full h-[300px] md:h-[400px] flex items-center justify-center">
                {/* Custom SVG illustration related to AI code assistance */}
                <svg
                  viewBox="0 0 500 400"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  {/* Base/Platform */}
                  <ellipse
                    cx="250"
                    cy="330"
                    rx="120"
                    ry="30"
                    fill="url(#platform-gradient)"
                    opacity="0.6"
                  />

                  {/* Desk */}
                  <rect
                    x="180"
                    y="230"
                    width="140"
                    height="10"
                    rx="2"
                    fill="#2A2A3C"
                  />
                  <rect
                    x="190"
                    y="240"
                    width="120"
                    height="60"
                    rx="2"
                    fill="#1E1E2A"
                  />
                  <rect x="200" y="240" width="100" height="2" fill="#3A3A4C" />

                  {/* Computer */}
                  <rect
                    x="210"
                    y="180"
                    width="80"
                    height="50"
                    rx="2"
                    fill="#2A2A3C"
                  />
                  <rect
                    x="215"
                    y="185"
                    width="70"
                    height="40"
                    rx="1"
                    fill="#0F0F17"
                  />

                  {/* Code on screen */}
                  <rect
                    x="220"
                    y="190"
                    width="40"
                    height="2"
                    fill="#6366F1"
                    opacity="0.8"
                  />
                  <rect
                    x="220"
                    y="195"
                    width="30"
                    height="2"
                    fill="#8B5CF6"
                    opacity="0.8"
                  />
                  <rect
                    x="225"
                    y="200"
                    width="45"
                    height="2"
                    fill="#EC4899"
                    opacity="0.8"
                  />
                  <rect
                    x="220"
                    y="205"
                    width="35"
                    height="2"
                    fill="#6366F1"
                    opacity="0.8"
                  />
                  <rect
                    x="230"
                    y="210"
                    width="25"
                    height="2"
                    fill="#8B5CF6"
                    opacity="0.8"
                  />
                  <rect
                    x="220"
                    y="215"
                    width="50"
                    height="2"
                    fill="#EC4899"
                    opacity="0.8"
                  />

                  {/* Developer character */}
                  <circle cx="300" cy="220" r="25" fill="#8B5CF6" />
                  <circle cx="300" cy="220" r="22" fill="#1E1E2A" />
                  <circle cx="300" cy="180" r="15" fill="#6366F1" />
                  <rect
                    x="285"
                    y="195"
                    width="30"
                    height="40"
                    rx="10"
                    fill="#6366F1"
                  />
                  <rect
                    x="290"
                    y="235"
                    width="8"
                    height="25"
                    rx="4"
                    fill="#6366F1"
                  />
                  <rect
                    x="302"
                    y="235"
                    width="8"
                    height="25"
                    rx="4"
                    fill="#6366F1"
                  />

                  {/* AI Suggestion bubbles */}
                  <g className="suggestion-bubble" opacity="0.9">
                    <rect
                      x="130"
                      y="150"
                      width="60"
                      height="40"
                      rx="8"
                      fill="url(#suggestion-gradient)"
                    />
                    <rect
                      x="135"
                      y="155"
                      width="50"
                      height="3"
                      rx="1.5"
                      fill="#FFFFFF"
                      opacity="0.7"
                    />
                    <rect
                      x="135"
                      y="162"
                      width="40"
                      height="3"
                      rx="1.5"
                      fill="#FFFFFF"
                      opacity="0.7"
                    />
                    <rect
                      x="135"
                      y="169"
                      width="45"
                      height="3"
                      rx="1.5"
                      fill="#FFFFFF"
                      opacity="0.7"
                    />
                    <rect
                      x="135"
                      y="176"
                      width="30"
                      height="3"
                      rx="1.5"
                      fill="#FFFFFF"
                      opacity="0.7"
                    />
                    <path
                      d="M130 180L120 195L135 185"
                      fill="url(#suggestion-gradient)"
                    />
                  </g>

                  <g className="suggestion-bubble" opacity="0.9">
                    <rect
                      x="320"
                      y="120"
                      width="60"
                      height="40"
                      rx="8"
                      fill="url(#suggestion-gradient-2)"
                    />
                    <rect
                      x="325"
                      y="125"
                      width="50"
                      height="3"
                      rx="1.5"
                      fill="#FFFFFF"
                      opacity="0.7"
                    />
                    <rect
                      x="325"
                      y="132"
                      width="40"
                      height="3"
                      rx="1.5"
                      fill="#FFFFFF"
                      opacity="0.7"
                    />
                    <rect
                      x="325"
                      y="139"
                      width="45"
                      height="3"
                      rx="1.5"
                      fill="#FFFFFF"
                      opacity="0.7"
                    />
                    <rect
                      x="325"
                      y="146"
                      width="30"
                      height="3"
                      rx="1.5"
                      fill="#FFFFFF"
                      opacity="0.7"
                    />
                    <path
                      d="M320 150L310 165L325 155"
                      fill="url(#suggestion-gradient-2)"
                    />
                  </g>

                  {/* Floating code elements */}
                  <g className="floating-element" opacity="0.8">
                    <rect
                      x="370"
                      y="200"
                      width="40"
                      height="30"
                      rx="4"
                      fill="#1E1E2A"
                      stroke="#6366F1"
                      strokeWidth="1"
                    />
                    <rect
                      x="375"
                      y="205"
                      width="30"
                      height="2"
                      rx="1"
                      fill="#6366F1"
                    />
                    <rect
                      x="375"
                      y="210"
                      width="20"
                      height="2"
                      rx="1"
                      fill="#8B5CF6"
                    />
                    <rect
                      x="375"
                      y="215"
                      width="25"
                      height="2"
                      rx="1"
                      fill="#EC4899"
                    />
                    <rect
                      x="375"
                      y="220"
                      width="15"
                      height="2"
                      rx="1"
                      fill="#6366F1"
                    />
                  </g>

                  <g className="floating-element" opacity="0.8">
                    <rect
                      x="150"
                      y="220"
                      width="40"
                      height="30"
                      rx="4"
                      fill="#1E1E2A"
                      stroke="#8B5CF6"
                      strokeWidth="1"
                    />
                    <rect
                      x="155"
                      y="225"
                      width="30"
                      height="2"
                      rx="1"
                      fill="#8B5CF6"
                    />
                    <rect
                      x="155"
                      y="230"
                      width="20"
                      height="2"
                      rx="1"
                      fill="#6366F1"
                    />
                    <rect
                      x="155"
                      y="235"
                      width="25"
                      height="2"
                      rx="1"
                      fill="#EC4899"
                    />
                    <rect
                      x="155"
                      y="240"
                      width="15"
                      height="2"
                      rx="1"
                      fill="#8B5CF6"
                    />
                  </g>

                  <g className="floating-element" opacity="0.8">
                    <rect
                      x="250"
                      y="100"
                      width="40"
                      height="30"
                      rx="4"
                      fill="#1E1E2A"
                      stroke="#EC4899"
                      strokeWidth="1"
                    />
                    <rect
                      x="255"
                      y="105"
                      width="30"
                      height="2"
                      rx="1"
                      fill="#EC4899"
                    />
                    <rect
                      x="255"
                      y="110"
                      width="20"
                      height="2"
                      rx="1"
                      fill="#8B5CF6"
                    />
                    <rect
                      x="255"
                      y="115"
                      width="25"
                      height="2"
                      rx="1"
                      fill="#6366F1"
                    />
                    <rect
                      x="255"
                      y="120"
                      width="15"
                      height="2"
                      rx="1"
                      fill="#EC4899"
                    />
                  </g>

                  {/* AI Brain/Neural network */}
                  <circle
                    cx="250"
                    cy="60"
                    r="20"
                    fill="url(#brain-gradient)"
                    opacity="0.9"
                  />

                  {/* Neural connections */}
                  <line
                    x1="250"
                    y1="80"
                    x2="250"
                    y2="100"
                    stroke="#8B5CF6"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  <line
                    x1="250"
                    y1="80"
                    x2="320"
                    y2="120"
                    stroke="#6366F1"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  <line
                    x1="250"
                    y1="80"
                    x2="190"
                    y2="150"
                    stroke="#EC4899"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  <line
                    x1="250"
                    y1="80"
                    x2="370"
                    y2="200"
                    stroke="#8B5CF6"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  <line
                    x1="250"
                    y1="80"
                    x2="150"
                    y2="220"
                    stroke="#6366F1"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />

                  {/* Small floating particles */}
                  <circle cx="280" cy="90" r="2" fill="#6366F1" />
                  <circle cx="220" cy="120" r="2" fill="#8B5CF6" />
                  <circle cx="330" cy="180" r="2" fill="#EC4899" />
                  <circle cx="180" cy="190" r="2" fill="#6366F1" />
                  <circle cx="290" cy="150" r="2" fill="#8B5CF6" />
                  <circle cx="200" cy="170" r="2" fill="#EC4899" />

                  {/* Gradients */}
                  <defs>
                    <linearGradient
                      id="platform-gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#6366F1" stopOpacity="0.3" />
                      <stop
                        offset="50%"
                        stopColor="#8B5CF6"
                        stopOpacity="0.3"
                      />
                      <stop
                        offset="100%"
                        stopColor="#EC4899"
                        stopOpacity="0.3"
                      />
                    </linearGradient>
                    <linearGradient
                      id="suggestion-gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#6366F1" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                    <linearGradient
                      id="suggestion-gradient-2"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                    <linearGradient
                      id="brain-gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#6366F1" />
                      <stop offset="50%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                  </defs>

                  {/* Animation keyframes */}
                  <style>
                    {`
                      @keyframes float {
                        0% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
                        100% { transform: translateY(0px); }
                      }
                      @keyframes pulse {
                        0% { opacity: 0.7; }
                        50% { opacity: 1; }
                        100% { opacity: 0.7; }
                      }
                      .floating-element {
                        animation: float 6s ease-in-out infinite;
                      }
                      .floating-element:nth-child(1) {
                        animation-delay: 0s;
                      }
                      .floating-element:nth-child(2) {
                        animation-delay: 1s;
                      }
                      .floating-element:nth-child(3) {
                        animation-delay: 2s;
                      }
                      .suggestion-bubble {
                        animation: pulse 4s ease-in-out infinite;
                      }
                      .suggestion-bubble:nth-child(2) {
                        animation-delay: 2s;
                      }
                    `}
                  </style>
                </svg>
              </div>

              <div className="mt-8 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  Turn your ideas into reality
                </h2>
                <p className="text-gray-400 max-w-md mx-auto">
                  Start for free and get innovative AI-powered code suggestions
                  to enhance your development workflow.
                </p>
              </div>
            </div>

            <div className="mt-8 text-center text-sm text-gray-500">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Sign up for free
              </Link>
            </div>
          </div>

          {/* Right side - Login form */}
          <div className="bg-[#0a0a12]/50 backdrop-blur-sm p-8 md:p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Login to your Account
                </h1>
                <p className="text-gray-400">
                  Welcome back! Please enter your details to continue.
                </p>
              </div>

              {/* Add error message display */}
              {(localError || authError) && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-md text-red-300 text-sm">
                  {localError || authError}
                </div>
              )}

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-300"
                  >
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
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-300"
                    >
                      Password
                    </label>
                  </div>
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

                <div className="flex items-center space-x-2">
                  <label htmlFor="rememberMe" className="text-sm text-gray-400">
                    Remember me
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                >
                  {loading ? 'Logging in...' : 'Login'}
                  {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
