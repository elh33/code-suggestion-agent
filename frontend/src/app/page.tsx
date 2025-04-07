import React from 'react';
import HeroSection from '@/components/landing/Hero';
import Navbar from '@/components/landing/Navbar';
import FeaturesSection from '@/components/landing/Features';
const HomePage = () => {
  return (
    <main className="bg-[#1E1C26] text-foreground min-h-screen">
       
      <Navbar></Navbar>
      <HeroSection></HeroSection>
      <FeaturesSection></FeaturesSection>
    </main>
  );
};

export default HomePage;
