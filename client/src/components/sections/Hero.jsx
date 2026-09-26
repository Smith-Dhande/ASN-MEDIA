import React from 'react';
import { SectionLabel } from '../ui/SectionLabel';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Reveal';
import { Play } from 'lucide-react';

export const Hero = ({ onOpenShowreel }) => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Hero Text Content (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <Reveal delay={0.1}>
              <SectionLabel>ASN MEDIA • SOCIAL • CONTENT • GROWTH</SectionLabel>
            </Reveal>

            <Reveal delay={0.2}>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-normal leading-[1.05] tracking-tight text-[#0A0A0A] mb-6">
                Your idea. <br />
                <span className="italic text-[#8E722A]">Our growth.</span>
              </h1>
            </Reveal>

            <Reveal delay={0.3}>
              <p className="text-base sm:text-lg text-[#66615A] leading-relaxed max-w-md mb-8">
                We build brands through social strategy, content and visual storytelling.
              </p>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="flex flex-wrap items-center gap-4">
                <Button to="/work" variant="primary">
                  Explore our work
                </Button>
                <Button to="/contact" variant="secondary">
                  Let's talk
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Hero Cinematic Media Frame (7 Cols) */}
          <div className="lg:col-span-7">
            <Reveal delay={0.3} y={40}>
              <div className="relative rounded-[8px] overflow-hidden shadow-2xl border border-[#0A0A0A]/10 bg-[#0A0A0A] group">
                <div className="aspect-[16/10] relative w-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600&auto=format&fit=crop"
                    alt="ASN Media Cinematic Studio Shoot"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  {/* Subtle Dark Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  {/* Media Eyebrow Label */}
                  <div className="absolute top-4 left-4 sm:top-6 sm:left-6 px-3 py-1 bg-black/70 backdrop-blur-md rounded-sm border border-white/10 text-[10px] font-mono tracking-widest text-[#F7F5EF] uppercase">
                    FEATURED SHOWCASE — 2026
                  </div>

                  {/* Play Button Trigger */}
                  <button
                    onClick={onOpenShowreel}
                    className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-[#C8A13A] text-black flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 focus:outline-none focus:ring-4 focus:ring-[#C8A13A]/50"
                    aria-label="Play Reel"
                  >
                    <Play className="w-6 h-6 fill-black ml-1" />
                  </button>

                  <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 right-4 sm:right-6 flex justify-between items-end text-white">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#C8A13A]">
                        LUMINA STUDIO
                      </p>
                      <p className="text-sm font-display italic text-white/90">
                        Brand Reel & Campaign Strategy
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-white/60">01:45</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};
