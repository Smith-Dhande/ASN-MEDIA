import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Reveal';

const HERO_BACKGROUNDS = [
  {
    url: 'https://images.unsplash.com/photo-1579165466741-7f35e4755660?q=80&w=2000&auto=format&fit=crop',
    alt: 'Studio Production & Cinema Lighting'
  },
  {
    url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2000&auto=format&fit=crop',
    alt: 'Cinematic Filming & Creative Direction'
  },
  {
    url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=2000&auto=format&fit=crop',
    alt: 'Video Editing & Content Creation'
  },
  {
    url: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=2000&auto=format&fit=crop',
    alt: 'Professional Cinema Camera Rig Set'
  },
  {
    url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2000&auto=format&fit=crop',
    alt: 'High Impact Film & Storytelling'
  }
];

export const Hero = () => {
  const [bgIndex, setBgIndex] = useState(0);

  // Auto-change background image every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % HERO_BACKGROUNDS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full max-w-full left-0 right-0 m-0 min-h-[100dvh] sm:min-h-[85vh] lg:min-h-[90vh] flex flex-col justify-between items-center bg-[#0A0A0A] text-[#F7F5EF] pt-24 sm:pt-32 lg:pt-36 pb-6 sm:pb-12 overflow-x-hidden z-10">
      {/* Full-width Cinematic Background Image Crossfader */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden select-none pointer-events-none">
        {HERO_BACKGROUNDS.map((bg, idx) => (
          <img
            key={bg.url}
            src={bg.url}
            alt={bg.alt}
            loading={idx === 0 ? "eager" : "lazy"}
            decoding="async"
            className={`absolute inset-0 w-full h-full object-cover object-center scale-105 transition-opacity duration-1000 ease-in-out ${
              idx === bgIndex ? 'opacity-35' : 'opacity-0'
            }`}
          />
        ))}
        {/* Dark Overlay Gradient */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-black/90 via-black/70 to-[#0A0A0A] z-10" />
      </div>

      {/* Center Hero Content */}
      <div className="container-custom relative z-20 flex flex-col items-center text-center my-auto py-6 sm:py-12 lg:py-16 w-full max-w-full">
        <Reveal delay={0.2} className="w-full flex flex-col items-center">
          <h1 className="font-display text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal leading-[1.04] sm:leading-[1.03] tracking-tight mb-4 sm:mb-8 text-white max-w-4xl mx-auto">
            Your idea. <br className="block" />
            <span className="italic text-[#C8A13A] font-normal">Our growth.</span>
          </h1>
        </Reveal>

        <Reveal delay={0.3} className="w-full flex flex-col items-center">
          <p className="text-xs sm:text-base md:text-lg text-[#F7F5EF]/85 max-w-xs sm:max-w-xl mb-6 sm:mb-8 md:mb-10 font-body leading-relaxed px-1 sm:px-0">
            We partner with visionary brands to produce compelling content, high-impact campaigns, and digital experiences that scale.
          </p>
        </Reveal>

        <Reveal delay={0.4} className="w-full flex flex-col items-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 w-full max-w-[280px] sm:max-w-none mx-auto">
            <Button
              to="/contact"
              variant="accent"
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 text-xs shadow-xl"
            >
              START A PROJECT
            </Button>
            <Button
              to="/work"
              variant="secondary"
              className="w-full sm:w-auto border-white/30 text-white hover:bg-white hover:text-black px-6 sm:px-7 py-3.5 sm:py-4 text-xs"
            >
              VIEW OUR WORK
            </Button>
          </div>
        </Reveal>
      </div>

      {/* Subtle Background Slide Indicator Dots */}
      <div className="relative z-20 flex items-center justify-center gap-1.5 sm:gap-2 mt-auto pt-4 pb-6 sm:pb-8">
        {HERO_BACKGROUNDS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setBgIndex(idx)}
            className="p-1.5 sm:p-2 focus:outline-none group cursor-pointer"
            aria-label={`Switch to background slide ${idx + 1}`}
          >
            <span
              className={`block h-1.5 rounded-full transition-all duration-500 ${
                idx === bgIndex
                  ? 'w-8 bg-[#C8A13A]'
                  : 'w-1.5 bg-white/30 group-hover:bg-white/60'
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
};
