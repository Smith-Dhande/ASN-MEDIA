import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SectionLabel } from '../ui/SectionLabel';
import { Reveal } from '../ui/Reveal';
import { servicesData } from '../../data/services';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';

export const ServicesCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const totalServices = servicesData.length;

  // Auto-rotation every 2.5 seconds (pauses when hovered)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalServices);
    }, 2500);
    return () => clearInterval(timer);
  }, [totalServices, isPaused]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % totalServices);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + totalServices) % totalServices);
  };

  return (
    <section className="py-20 md:py-28 bg-[#0A0A0A] text-[#F7F5EF] relative overflow-hidden border-t border-white/10">
      <div className="container-custom relative z-20">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          {/* <Reveal>
            <SectionLabel>SERVICES SHOWCASE</SectionLabel>
          </Reveal> */}
          <Reveal delay={0.1}>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-tight">
              Explore Our Creative Capabilities
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-sm sm:text-base text-white/70 font-body mt-4 max-w-xl mx-auto">
              Swipe through our core service offerings designed to elevate brand identity, visual story, and digital performance.
            </p>
          </Reveal>
        </div>

        {/* 3D Perspective Carousel Deck Container */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="w-full max-w-[1360px] mx-auto relative z-20"
        >
          {/* 3D Perspective Deck Cards Grid */}
          <div className="relative min-h-[360px] sm:min-h-[380px] lg:min-h-[400px] flex items-center justify-center perspective-[1400px] py-4">
            {servicesData.map((service, idx) => {
              const offset = (idx - activeIndex + totalServices) % totalServices;

              let cardStyle = '';

              if (offset === 0) {
                // Active Center Card (Fully visible, gold border glow)
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

          {/* Controls Bar */}
          <div className="flex items-center justify-between mt-8 px-4 max-w-4xl mx-auto text-xs font-mono">
            <div className="flex items-center gap-3 text-white/70">
              <span className="text-[#C8A13A] font-bold">0{activeIndex + 1}</span>
              <span className="w-8 h-[1px] bg-white/20" />
              <span className="uppercase tracking-widest text-white/90 font-semibold">
                {servicesData[activeIndex].title}
              </span>
            </div>

            {/* Navigation Arrow Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                className="w-9 h-9 rounded-full bg-white/5 border border-white/14 text-white flex items-center justify-center hover:bg-[#C8A13A] hover:text-black hover:border-[#C8A13A] transition-all focus:outline-none shadow-md"
                aria-label="Previous Service"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[11px] text-white/40 font-mono tracking-widest">
                0{activeIndex + 1} / 0{totalServices}
              </span>
              <button
                onClick={handleNext}
                className="w-9 h-9 rounded-full bg-white/5 border border-white/14 text-white flex items-center justify-center hover:bg-[#C8A13A] hover:text-black hover:border-[#C8A13A] transition-all focus:outline-none shadow-md"
                aria-label="Next Service"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
