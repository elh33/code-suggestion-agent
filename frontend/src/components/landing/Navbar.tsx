"use client";
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50  backdrop-blur-md  shadow-md">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold text-gray-900">
            <span className='text-white'>EnsaAi</span>
        </div>

        <ul
          className={`sm:flex space-x-6 text-lg text-gray-800 ${isMobileMenuOpen ? 'flex' : 'hidden'} sm:block`}
        >
          <li>
            <Link href="/" className="text-white hover:text-blue-600">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="text-white hover:text-blue-600">
              About
            </Link>
          </li>
          <li>
            <Link href="/features" className="text-white hover:text-blue-600">
              Features
            </Link>
          </li>
          <li>
            <Link href="/pricing" className="text-white hover:text-blue-600">
              Pricing
            </Link>
          </li>
          <li>
            <Link href="/blog" className="text-white hover:text-blue-600">
              Blog
            </Link>
          </li>
        </ul>

        {/* Buttons (Login and Signup) */}
        <div className="hidden sm:flex space-x-4">
        <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white hover:from-blue-600 hover:to-purple-700"
              asChild
            >
              <Link href="/get-started">Signup</Link>
            </Button>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 rounded-2xl hover:to-purple-700"
              asChild
            >
              <Link href="/get-started">Login</Link>
            </Button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="sm:hidden flex items-center">
          <button onClick={toggleMobileMenu} className="text-gray-800">
            {isMobileMenuOpen ? '✖' : '☰'}
          </button>
        </div>
      </nav>
    </header>
  );
}
