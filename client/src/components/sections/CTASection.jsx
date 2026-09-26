import React from 'react';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Reveal';

export const CTASection = () => {
  return (
    <section className="py-24 md:py-36 bg-[#C8A13A] text-[#0A0A0A] relative overflow-hidden">
      {/* Subtle Pattern Background Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#8E722A_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

      <div className="container-custom relative z-10 text-center flex flex-col items-center max-w-4xl mx-auto">
        <Reveal>
          <span className="inline-block px-3 py-1 bg-[#0A0A0A] text-[#C8A13A] text-[10px] font-mono tracking-[0.2em] uppercase rounded-sm mb-6 font-semibold">
            LET'S COLLABORATE
          </span>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal leading-[1.02] tracking-tight mb-8">
            Your idea. <br />
            <span className="italic font-normal">Our growth.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="text-base sm:text-lg text-[#0A0A0A]/80 max-w-xl mb-10 font-body leading-relaxed">
            Ready to establish aesthetic dominance and scale your brand's digital reach? Let's build something extraordinary together.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <Button to="/contact" variant="primary" className="shadow-2xl text-xs py-4 px-8">
            Start a project
          </Button>
        </Reveal>
      </div>
    </section>
  );
};
