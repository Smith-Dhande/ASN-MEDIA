import React, { useState } from 'react';
import { SectionLabel } from '../ui/SectionLabel';
import { Reveal } from '../ui/Reveal';
import { Play, X, Film } from 'lucide-react';

export const Showreel = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="py-20 md:py-28 bg-[#F7F5EF] border-t border-[#0A0A0A]/10">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Editorial Details */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <Reveal>
              <SectionLabel>CINEMATIC SHOWCASE</SectionLabel>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="font-display text-4xl sm:text-5xl text-[#0A0A0A] leading-tight mb-4">
                Stories that move people.
              </h2>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-sm sm:text-base text-[#66615A] leading-relaxed font-body mb-8 max-w-md">
                Film-grade production and visual narrative engineered for attention and long-term brand memory.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="flex items-center gap-4 p-4 rounded-md bg-[#0A0A0A]/[0.04] border border-[#0A0A0A]/10 font-mono text-xs text-[#0A0A0A]">
                <div className="w-8 h-8 rounded-full bg-[#C8A13A]/20 text-[#8E722A] flex items-center justify-center shrink-0">
                  <Film className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-[#0A0A0A] uppercase tracking-wider text-[11px]">
                    2026 DIRECTORS CUT
                  </p>
                  <p className="text-[#66615A] text-[10px] mt-0.5">
                    DURATION: 02:15 • 4K ULTRA HD
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Sleek Compact Video Preview Frame */}
          <div className="lg:col-span-7">
            <Reveal delay={0.25}>
              <div className="relative rounded-[8px] overflow-hidden bg-[#0A0A0A] shadow-xl group border border-[#0A0A0A]/14 aspect-[16/10] max-w-2xl ml-auto">
                <img
                  src="https://images.unsplash.com/photo-1579165466741-7f35e4755660?q=80&w=1200&auto=format&fit=crop"
                  alt="ASN Media Showreel Cover"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors duration-500" />

                {/* Sleek Play Button */}
                <button
                  onClick={() => setIsPlaying(true)}
                  className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-[#C8A13A] text-black flex items-center justify-center shadow-xl transition-all duration-300 group-hover:scale-110 focus:outline-none focus:ring-4 focus:ring-[#C8A13A]/50"
                  aria-label="Play ASN Media Showreel"
                >
                  <Play className="w-6 h-6 fill-black ml-1" />
                </button>

                {/* Corner Eyebrow Tag */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-mono">
                  <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md rounded-sm border border-white/10 uppercase text-[10px] tracking-wider text-[#C8A13A]">
                    SHOWCASE REEL
                  </span>
                  <span className="text-white/70 text-[10px]">CLICK TO PLAY</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Video Modal Player */}
      {isPlaying && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 sm:p-8 animate-fadeIn">
          <button
            onClick={() => setIsPlaying(false)}
            className="absolute top-6 right-6 p-3 text-white/80 hover:text-white bg-white/10 rounded-full transition-colors focus:outline-none"
            aria-label="Close Showreel Modal"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="w-full max-w-4xl aspect-[16/9] rounded-lg overflow-hidden bg-black shadow-2xl">
            <iframe
              src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&mute=0"
              title="ASN Media Showreel"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
};
