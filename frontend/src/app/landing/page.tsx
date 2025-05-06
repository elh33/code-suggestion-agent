'use client';

import React, { useState, useEffect } from 'react';
import HeroSection from '@/app/landing/Hero';
import Navbar from '@/app/landing/Navbar';
import FeaturesSection from '@/app/landing/Features';
import IntegrationsSection from '@/app/landing/Integrations';
import HowItWorksSection from '@/app/landing/How-it-works';
import TeamSection from '@/app/landing/Team';
import Footer from '@/app/landing/Footer';
import LoadingScreen from '@/app/loading-screen';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LandingPage() {
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const finishLoading = () => {
    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <LoadingScreen finishLoading={finishLoading} />
      ) : (
        <div className="min-h-screen bg-[#0e0d14]">
          
          <Navbar />
          <HeroSection />
          <FeaturesSection />
          <HowItWorksSection />
          <IntegrationsSection />
          <TeamSection />
          <Footer />
        </div>
      )}
    </>
  );
}
