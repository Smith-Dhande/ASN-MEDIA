import React from 'react';
import { SectionLabel } from '../ui/SectionLabel';
import { Reveal } from '../ui/Reveal';
import { siteConfig } from '../../data/site';

export const Philosophy = () => {
  const { eyebrow, headline, principles } = siteConfig.philosophy;

  return (
    <section className="py-24 md:py-36 bg-[#0A0A0A] text-[#F7F5EF] relative overflow-hidden border-y border-white/10">
      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-20">
          <Reveal>
            <SectionLabel dark>{eyebrow}</SectionLabel>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.1] tracking-tight whitespace-pre-line">
              {headline}
            </h2>
          </Reveal>
        </div>

        {/* 3 Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 pt-12 border-t border-white/16">
          {principles.map((item, idx) => (
            <Reveal key={item.number} delay={0.1 * idx}>
              <div className="flex flex-col gap-4 group">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold text-[#C8A13A] tracking-wider">
                    {item.number}
                  </span>
                  <span className="w-8 h-[1px] bg-white/20 group-hover:bg-[#C8A13A] transition-colors duration-300" />
                  <h3 className="font-body text-sm font-semibold tracking-[0.2em] text-white uppercase">
                    {item.title}
                  </h3>
                </div>
                <p className="text-sm text-[#F7F5EF]/70 leading-relaxed font-body font-light pt-2">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
