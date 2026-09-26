import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Reveal';
import { servicesData } from '../../data/services';
import { ArrowUpRight } from 'lucide-react';

export const Hero = () => {
  // Select first 3 services for initial hero peek
  const heroServices = servicesData.slice(0, 3);

  return (
    <section className="relative min-h-[100vh] flex flex-col justify-between overflow-hidden bg-[#0A0A0A] text-[#F7F5EF] pt-32 sm:pt-36">
      {/* Full-width Cinematic Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1579165466741-7f35e4755660?q=80&w=2000&auto=format&fit=crop"
          alt="ASN Media Studio Production Background"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out opacity-40"
        />
        {/* Dark Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/65 to-[#0A0A0A] z-10" />
      </div>

      {/* Center Hero Content (Centered Vertically and Horizontally) */}
      <div className="container-custom relative z-20 flex flex-col items-center text-center my-auto pb-12">
        <Reveal delay={0.1}>
          <div className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8A13A] animate-pulse" />
            <span className="text-[10px] sm:text-xs font-mono font-semibold tracking-[0.22em] text-[#C8A13A] uppercase">
              ASN MEDIA · SOCIAL · CONTENT · GROWTH
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-normal leading-[1.02] tracking-tight mb-6 text-white">
            Your idea. <br />
            <span className="italic text-[#C8A13A] font-normal">Our growth.</span>
          </h1>
        </Reveal>

        <Reveal delay={0.3}>
          <p className="text-base sm:text-lg md:text-xl text-[#F7F5EF]/80 font-body leading-relaxed max-w-xl mb-10">
            We create brands through social strategy, content and visual storytelling.
          </p>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Button to="/contact" variant="accent" className="px-8 py-4 text-xs">
              START A PROJECT
            </Button>
            <Button to="/work" variant="secondary" className="border-white/30 text-white hover:bg-white hover:text-black px-7 py-4 text-xs">
              VIEW OUR WORK
            </Button>
          </div>
        </Reveal>
      </div>

      {/* Hero-to-Services Peek Transition Container */}
      {/* Exactly ~35-40% of the cards are visible in the initial viewport */}
      <div className="container-custom relative z-20 mt-auto translate-y-[62%] sm:translate-y-[60%] lg:translate-y-[58%] transition-transform duration-500">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {heroServices.map((service, idx) => (
            <Reveal key={service.id} delay={0.1 * idx}>
              <Link
                to={`/services/${service.slug}`}
                className="group block relative rounded-[8px] bg-[#0A0A0A] border border-white/16 overflow-hidden shadow-2xl transition-all duration-500 hover:border-[#C8A13A] h-[360px] sm:h-[380px] lg:h-[420px] flex flex-col justify-between p-6 sm:p-8"
              >
                {/* Card Background Media */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img
                    src={service.featuredMedia}
                    alt={service.title}
                    className="w-full h-full object-cover opacity-40 transition-transform duration-700 ease-out group-hover:scale-105 group-hover:opacity-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-black/40" />
                </div>

                {/* Card Top Content (Visible in Initial Hero Viewport Peek ~35-40%) */}
                <div className="relative z-10 flex flex-col items-start gap-2">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-mono text-xs font-bold text-[#C8A13A] tracking-widest">
                      {service.number}
                    </span>
                    <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#C8A13A] group-hover:bg-[#C8A13A] transition-all">
                      <ArrowUpRight className="w-3.5 h-3.5 text-white group-hover:text-black" />
                    </div>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl text-white group-hover:text-[#C8A13A] transition-colors leading-tight pt-1">
                    {service.title}
                  </h3>
                  <p className="text-xs text-[#F7F5EF]/70 font-body">
                    {service.shortDesc}
                  </p>
                </div>

                {/* Card Bottom Content (Revealed naturally as user scrolls) */}
                <div className="relative z-10 pt-6 border-t border-white/10 mt-auto">
                  <span className="text-[10px] font-mono tracking-widest text-[#C8A13A] uppercase block mb-1">
                    DELIVERABLE HIGHLIGHTS
                  </span>
                  <p className="text-xs text-white/80 line-clamp-2 font-body">
                    {service.tagline}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
