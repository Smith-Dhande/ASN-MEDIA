import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Reveal';
import { servicesData } from '../../data/services';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';

export const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const totalServices = servicesData.length;

  // Auto-rotation every 2 seconds (pauses when hovered)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalServices);
    }, 2000);
    return () => clearInterval(timer);
  }, [totalServices, isPaused]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % totalServices);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + totalServices) % totalServices);
  };

  return (
    <section className="relative min-h-[100vh] flex flex-col justify-between bg-[#0A0A0A] text-[#F7F5EF] pt-28 sm:pt-32 pb-16 overflow-hidden">
      {/* Full-width Cinematic Background Image Container */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1579165466741-7f35e4755660?q=80&w=2000&auto=format&fit=crop"
          alt="ASN Media Studio Production Background"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out opacity-35"
        />
        {/* Dark Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-[#0A0A0A] z-10" />
      </div>

      {/* Center Hero Content (Spacious Vertical Layout) */}
      <div className="container-custom relative z-20 flex flex-col items-center text-center my-auto pt-6 pb-12 sm:pb-16 lg:pb-20">
        <Reveal delay={0.1}>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal leading-[1.03] tracking-tight mb-8 text-white">
            Your idea. <br />
            <span className="italic text-[#C8A13A] font-normal">Our growth.</span>
          </h1>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Button to="/contact" variant="accent" className="px-8 py-4 text-xs shadow-xl">
              START A PROJECT
            </Button>
            <Button to="/work" variant="secondary" className="border-white/30 text-white hover:bg-white hover:text-black px-7 py-4 text-xs">
              VIEW OUR WORK
            </Button>
          </div>
        </Reveal>
      </div>

      {/* 3D Perspective Carousel Deck Container (Generous Breathing Room Above) */}
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-20 mt-auto pt-8 sm:pt-12 pb-6"
      >
        {/* 3D Perspective Deck Cards Grid */}
        <div className="relative min-h-[350px] sm:min-h-[370px] lg:min-h-[390px] flex items-center justify-center perspective-[1400px] py-2">
          {servicesData.map((service, idx) => {
            const offset = (idx - activeIndex + totalServices) % totalServices;

            let cardStyle = '';

            if (offset === 0) {
              // Active Center Card (Fully visible, premium border glow)
              cardStyle =
                'z-30 scale-100 sm:scale-105 opacity-100 translate-x-0 border-2 border-[#C8A13A] shadow-[0_20px_50px_rgba(200,161,58,0.25)] bg-[#0A0A0A]';
            } else if (offset === 1 || offset === -3) {
              // Right Card Preview
              cardStyle =
                'z-20 scale-85 opacity-50 translate-x-[72%] sm:translate-x-[82%] lg:translate-x-[90%] rotate-y-[-10deg] border-white/14 hidden sm:flex';
            } else if (offset === totalServices - 1 || offset === -1) {
              // Left Card Preview
              cardStyle =
                'z-20 scale-85 opacity-50 -translate-x-[72%] sm:-translate-x-[82%] lg:-translate-x-[90%] rotate-y-[10deg] border-white/14 hidden sm:flex';
            } else {
              // Inactive Hidden Cards
              cardStyle = 'z-10 scale-75 opacity-0 pointer-events-none absolute';
            }

            return (
              <div
                key={service.id}
                onClick={() => setActiveIndex(idx)}
                className={`absolute w-[94%] sm:w-[440px] md:w-[490px] lg:w-[520px] rounded-[14px] border overflow-hidden transition-all duration-700 ease-out cursor-pointer h-[320px] sm:h-[340px] lg:h-[360px] flex flex-col justify-between p-6 sm:p-7 ${cardStyle}`}
              >
                {/* High-Resolution Media Background */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img
                    src={service.featuredMedia}
                    alt={service.title}
                    className="w-full h-full object-cover opacity-45 transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/85 to-black/30" />
                </div>

                {/* Card Top Header */}
                <div className="relative z-10 flex flex-col items-start gap-1.5">
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-mono text-xs font-bold text-[#C8A13A] tracking-widest bg-black/80 px-2.5 py-1 rounded-sm border border-[#C8A13A]/40 shadow-sm">
                      {service.number}
                    </span>
                    <Link
                      to={`/services/${service.slug}`}
                      className="w-9 h-9 rounded-full border border-[#C8A13A]/50 bg-black/60 flex items-center justify-center hover:border-[#C8A13A] hover:bg-[#C8A13A] transition-all group shadow-md"
                      aria-label={`View ${service.title}`}
                    >
                      <ArrowUpRight className="w-4 h-4 text-white group-hover:text-black" />
                    </Link>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl text-white group-hover:text-[#C8A13A] transition-colors leading-tight">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#F7F5EF]/85 font-body leading-snug">
                    {service.shortDesc}
                  </p>
                </div>

                {/* Card Bottom Details */}
                <div className="relative z-10 pt-4 border-t border-white/14 mt-4">
                  <span className="text-[10px] font-mono tracking-widest text-[#C8A13A] uppercase block mb-1 font-semibold">
                    DELIVERABLE HIGHLIGHTS
                  </span>
                  <p className="text-xs text-white/90 line-clamp-2 font-body leading-relaxed">
                    {service.tagline}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sleek Minimal Controls Bar (Positioned AT THE BOTTOM of the Carousel Deck) */}
        <div className="flex items-center justify-between mt-6 px-4 max-w-4xl mx-auto text-xs font-mono">
          <div className="flex items-center gap-3 text-white/70">
            <span className="text-[#C8A13A] font-bold">0{activeIndex + 1}</span>
            <span className="w-8 h-[1px] bg-white/20" />
            <span className="uppercase tracking-widest text-white/90 font-semibold">
              {servicesData[activeIndex].title}
            </span>
          </div>

          {/* Minimal Arrow Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              className="w-9 h-9 rounded-full bg-white/5 border border-white/14 text-white flex items-center justify-center hover:bg-[#C8A13A] hover:text-black hover:border-[#C8A13A] transition-all focus:outline-none shadow-md"
              aria-label="Previous Category"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] text-white/40 font-mono tracking-widest">
              0{activeIndex + 1} / 0{totalServices}
            </span>
            <button
              onClick={handleNext}
              className="w-9 h-9 rounded-full bg-white/5 border border-white/14 text-white flex items-center justify-center hover:bg-[#C8A13A] hover:text-black hover:border-[#C8A13A] transition-all focus:outline-none shadow-md"
              aria-label="Next Category"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
