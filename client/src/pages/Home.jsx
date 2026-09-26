import React, { useState } from 'react';
import { Hero } from '../components/sections/Hero';
import { Showreel } from '../components/sections/Showreel';
import { ServiceList } from '../components/sections/ServiceList';
import { Philosophy } from '../components/sections/Philosophy';
import { SelectedWork } from '../components/sections/SelectedWork';
import { CTASection } from '../components/sections/CTASection';

export const Home = () => {
  const [showreelOpen, setShowreelOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Hero onOpenShowreel={() => setShowreelOpen(true)} />
      <Showreel />
      <ServiceList />
      <Philosophy />
      <SelectedWork />
      <CTASection />
    </div>
  );
};
