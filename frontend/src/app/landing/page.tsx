'use client';

import React, { useState, useEffect } from 'react';
import HeroSection from '@/components/landing/Hero';
import Navbar from '@/components/landing/Navbar';
import FeaturesSection from '@/components/landing/Features';
import IntegrationsSection from '@/components/landing/Integrations';
import HowItWorksSection from '@/components/landing/How-it-works';
import TeamSection from '@/components/landing/Team';
import Footer from '@/components/landing/Footer';
import LoadingScreen from '@/components/loading-screen';
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
