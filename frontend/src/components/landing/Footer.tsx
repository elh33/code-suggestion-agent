import {
  Mail,
  Github,
  Twitter,
  Linkedin,
  Instagram,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full overflow-hidden bg-[#0a0a12] border-t border-gray-800">
      {/* Gradient accent at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>

      {/* Background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-5">
        <svg
          className="absolute h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Curved paths */}
          <path
            d="M0,10 Q30,30 60,25 T100,50"
            stroke="rgba(147, 51, 234, 0.5)"
            strokeWidth="0.5"
          />
          <path
            d="M0,30 Q40,50 70,45 T100,70"
            stroke="rgba(139, 92, 246, 0.5)"
            strokeWidth="0.5"
          />
          <path
            d="M100,20 Q60,40 30,35 T0,60"
            stroke="rgba(79, 70, 229, 0.5)"
            strokeWidth="0.5"
          />
          <path
            d="M100,40 Q70,60 40,55 T0,80"
            stroke="rgba(59, 130, 246, 0.5)"
            strokeWidth="0.5"
          />
        </svg>
      </div>

      {/* Main footer content */}
      <div className="container relative z-10 mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 mb-16">
          {/* Brand column */}
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-3">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <h2 className="text-white text-xl font-bold">EnsaAi</h2>
            </div>
            <p className="text-gray-400">
              Empowering developers with AI-driven code suggestions and tools to
              enhance productivity and creativity.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-indigo-600 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4 text-white" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-indigo-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-indigo-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-indigo-400 transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-indigo-400 transition-colors"
                >
                  How it Works
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-indigo-400 transition-colors"
                >
                  Our Team
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-6">Resources</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-indigo-400 transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-indigo-400 transition-colors"
                >
                  API Reference
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section with copyright and legal links */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-500 text-sm mb-4 md:mb-0">
              © {currentYear} EnsaAi. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center space-x-6">
              <Link
                href="#"
                className="text-gray-500 hover:text-indigo-400 text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-gray-500 hover:text-indigo-400 text-sm transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-gray-500 hover:text-indigo-400 text-sm transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
