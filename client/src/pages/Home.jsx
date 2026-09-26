import React from 'react';
import { Hero } from '../components/sections/Hero';
import { ServiceList } from '../components/sections/ServiceList';
import { Showreel } from '../components/sections/Showreel';
import { Philosophy } from '../components/sections/Philosophy';
import { SelectedWork } from '../components/sections/SelectedWork';
import { ServicesCarousel } from '../components/sections/ServicesCarousel';
import { CTASection } from '../components/sections/CTASection';

export const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <ServiceList />
      <ServicesCarousel />
      <Showreel />
      <Philosophy />
      <SelectedWork />
      <CTASection />
    </div>
  );
};

