import React, { useState } from 'react';
import { SectionLabel } from '../ui/SectionLabel';
import { Reveal } from '../ui/Reveal';
import { Play, X } from 'lucide-react';

export const Showreel = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="py-20 md:py-28 bg-[#F7F5EF] border-t border-[#0A0A0A]/10">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <Reveal>
              <SectionLabel>CINEMATIC SHOWCASE</SectionLabel>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#0A0A0A]">
                Stories that move people.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <p className="text-sm text-[#66615A] max-w-xs leading-relaxed font-body">
              Film-grade production and visual narrative engineered for attention and long-term brand memory.
            </p>
          </Reveal>
        </div>

        {/* Large Media Block */}
        <Reveal delay={0.2}>
          <div className="relative rounded-[8px] overflow-hidden bg-[#0A0A0A] shadow-xl group border border-[#0A0A0A]/10">
            <div className="aspect-[16/9] relative w-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1579165466741-7f35e4755660?q=80&w=1600&auto=format&fit=crop"
                alt="ASN Media Showreel Cover"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-500" />

              {/* Play Button */}
              <button
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-[#C8A13A] text-black flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110 focus:outline-none focus:ring-4 focus:ring-[#C8A13A]/50"
                aria-label="Play ASN Media Showreel"
              >
                <Play className="w-8 h-8 fill-black ml-1" />
              </button>

              {/* Metadata */}
              <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-center justify-between text-white gap-2">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#C8A13A] animate-pulse" />
                  <span className="text-xs font-mono tracking-widest uppercase text-white/90">
                    ASN MEDIA REEL 2026 — 4K DIRECTORS CUT
                  </span>
                </div>
                <span className="text-xs font-mono text-white/60">DURATION: 02:15</span>
              </div>
            </div>
          </div>
        </Reveal>
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
          <div className="w-full max-w-5xl aspect-[16/9] rounded-lg overflow-hidden bg-black shadow-2xl">
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
