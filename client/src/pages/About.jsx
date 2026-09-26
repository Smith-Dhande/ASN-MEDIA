import React from 'react';
import { SectionLabel } from '../components/ui/SectionLabel';
import { Button } from '../components/ui/Button';
import { Reveal } from '../components/ui/Reveal';
import { CTASection } from '../components/sections/CTASection';

export const About = () => {
  const beliefs = [
    {
      num: "01",
      title: "Content is Perception",
      desc: "Every frame, caption, and editorial layout communicates brand value long before a product is purchased."
    },
    {
      num: "02",
      title: "Restraint Over Noise",
      desc: "Excessive animation and visual gimmicks distract. Strong photography, deliberate typography, and whitespace elevate."
    },
    {
      num: "03",
      title: "Growth Demands Discipline",
      desc: "Consistency in social execution and strategic clarity beat sporadic viral attempts every single time."
    }
  ];

  return (
    <div className="pt-32 pb-20 md:pt-40">
      <div className="container-custom">
        {/* Intro Header */}
        <div className="max-w-4xl mb-24">
          <Reveal>
            <SectionLabel>ABOUT ASN MEDIA</SectionLabel>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-[#0A0A0A] leading-[1.08] mb-8">
              We build brands through social strategy, content and visual storytelling.
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-lg sm:text-xl text-[#66615A] font-body leading-relaxed max-w-2xl">
              ASN Media is a premium media and creative-growth company. We partner with ambitious founders, brands, and marketing teams to establish aesthetic dominance and cultural reach.
            </p>
          </Reveal>
        </div>

        {/* Feature Image / Studio Spread */}
        <Reveal delay={0.25}>
          <div className="relative rounded-[8px] overflow-hidden bg-[#0A0A0A] aspect-[21/9] mb-28 border border-[#0A0A0A]/10 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1542744094-3a31b272c490?q=80&w=1800&auto=format&fit=crop"
              alt="ASN Media Creative Studio"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 text-white font-mono text-xs tracking-widest uppercase">
              STUDIO & PRODUCTION HEADQUARTERS
            </div>
          </div>
        </Reveal>

        {/* Company Philosophy & Beliefs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-32 pb-24 border-b border-[#0A0A0A]/10">
          <div className="lg:col-span-4">
            <Reveal>
              <SectionLabel>OUR CORE BELIEFS</SectionLabel>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display text-4xl sm:text-5xl text-[#0A0A0A] leading-tight">
                What drives our creative process.
              </h2>
            </Reveal>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-10">
            {beliefs.map((b, idx) => (
              <Reveal key={b.num} delay={0.1 * idx}>
                <div className="p-8 bg-[#0A0A0A]/[0.03] border border-[#0A0A0A]/10 rounded-[8px] flex flex-col sm:flex-row items-start gap-6">
                  <span className="font-mono text-sm font-bold text-[#8E722A] shrink-0">
                    {b.num}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl text-[#0A0A0A] mb-2">
                      {b.title}
                    </h3>
                    <p className="text-sm text-[#66615A] font-body leading-relaxed">
                      {b.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Capabilities Overview */}
        <div className="mb-28">
          <Reveal>
            <SectionLabel>INTEGRATED CAPABILITIES</SectionLabel>
            <h2 className="font-display text-4xl sm:text-5xl text-[#0A0A0A] mb-12">
              Full-spectrum creative support.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-[#F7F5EF] border border-[#0A0A0A]/14 rounded-[8px]">
              <span className="font-mono text-xs text-[#8E722A] font-semibold block mb-3">01</span>
              <h3 className="font-semibold text-base mb-2">Social Media</h3>
              <p className="text-xs text-[#66615A] leading-relaxed">Management, publishing cadence, channel growth, and community execution.</p>
            </div>
            <div className="p-6 bg-[#F7F5EF] border border-[#0A0A0A]/14 rounded-[8px]">
              <span className="font-mono text-xs text-[#8E722A] font-semibold block mb-3">02</span>
              <h3 className="font-semibold text-base mb-2">Content Creation</h3>
              <p className="text-xs text-[#66615A] leading-relaxed">Editorial photography, short-form reels, graphics, and asset design.</p>
            </div>
            <div className="p-6 bg-[#F7F5EF] border border-[#0A0A0A]/14 rounded-[8px]">
              <span className="font-mono text-xs text-[#8E722A] font-semibold block mb-3">03</span>
              <h3 className="font-semibold text-base mb-2">Video Production</h3>
              <p className="text-xs text-[#66615A] leading-relaxed">Brand films, product commercials, documentaries, and social video suites.</p>
            </div>
            <div className="p-6 bg-[#F7F5EF] border border-[#0A0A0A]/14 rounded-[8px]">
              <span className="font-mono text-xs text-[#8E722A] font-semibold block mb-3">04</span>
              <h3 className="font-semibold text-base mb-2">Brand Strategy</h3>
              <p className="text-xs text-[#66615A] leading-relaxed">Positioning, tone-of-voice, visual direction, and growth playbooks.</p>
            </div>
          </div>
        </div>
      </div>

      <CTASection />
    </div>
  );
};
