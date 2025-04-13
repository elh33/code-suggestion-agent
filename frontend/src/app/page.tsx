'use client';
import React from 'react';
import HeroSection from '@/components/landing/Hero';
import Navbar from '@/components/landing/Navbar';
import FeaturesSection from '@/components/landing/Features';
import IntegrationsSection from '@/components/landing/Integrations';
import HowItWorksSection from '@/components/landing/How-it-works';
import TeamSection from '@/components/landing/Team';
import Footer from '@/components/landing/Footer';
import LoginPage from '@/components/login/page';
import SignupPage from '@/components/signup/page';
import LoadingScreen from '@/components/loading-screen';
import DashboardPage from './dashboard/page';
import DashboardLayout from './dashboard/layout';
const HomePage = () => {
  const [loading, setLoading] = React.useState(true);
  const finishLoading = () => {
    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <LoadingScreen finishLoading={finishLoading} />
      ) : (
        <main className="min-h-screen bg-[#0e0d14]">
          <DashboardPage></DashboardPage>
        </main>
      )}
    </>
  );
};

export default HomePage;
