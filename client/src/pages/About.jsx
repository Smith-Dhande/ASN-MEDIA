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
      desc: "Every frame, caption, and editorial layout communicates brand value long before a product or service is purchased."
    },
    {
      num: "02",
      title: "Restraint Over Noise",
      desc: "Excessive visual gimmicks distract. Strong photography, deliberate typography, and whitespace elevate true authority."
    },
    {
      num: "03",
      title: "Growth Demands Discipline",
      desc: "Consistency in strategic social execution beats sporadic viral attempts every single time."
    }
  ];

  const stats = [
    { value: "50+", label: "BRAND CAMPAIGNS" },
    { value: "100M+", label: "ORGANIC IMPRESSIONS" },
    { value: "100%", label: "IN-HOUSE PRODUCTION" },
    { value: "GLOBAL", label: "CREATIVE NETWORK" }
  ];

  const capabilities = [
    {
      num: "01",
      title: "Social Media Strategy",
      desc: "Management, publishing cadence, channel growth, and proactive community execution."
    },
    {
      num: "02",
      title: "Content Creation",
      desc: "Editorial photography, short-form reels, graphics, and visual identity toolkits."
    },
    {
      num: "03",
      title: "Video Production",
      desc: "Brand films, product commercials, founder stories, and social video suites."
    },
    {
      num: "04",
      title: "Brand Strategy",
      desc: "Positioning, tone-of-voice, visual direction, and go-to-market playbooks."
    }
  ];

  return (
    <div className="bg-[#F7F5EF] text-[#0A0A0A] min-h-screen pt-28 sm:pt-36">
      <div className="container-custom">
        {/* 1. Editorial Hero Header */}
        <div className="max-w-4xl mb-20 md:mb-28">
          <Reveal>
            <div className="flex items-center gap-3 mb-6">
              <SectionLabel>ABOUT ASN MEDIA</SectionLabel>
              <span className="w-1.5 h-1.5 rounded-full bg-[#8E722A]" />
              <span className="text-[11px] font-mono tracking-widest text-[#8E722A] uppercase font-semibold">
                CREATIVE STUDIO & MEDIA AGENCY
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-normal leading-[1.03] tracking-tight text-[#0A0A0A] mb-8">
              We build brands through <br />
              <span className="italic text-[#8E722A] font-normal">social strategy</span>, content & story.
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-lg sm:text-xl text-[#66615A] font-body leading-relaxed max-w-2xl">
              ASN Media is a strategic media agency and creative production house. We partner with ambitious founders and brands to establish aesthetic dominance and cultural reach.
            </p>
          </Reveal>
        </div>

        {/* 2. Studio Widescreen Visual Spread */}
        <Reveal delay={0.25}>
          <div className="relative rounded-[8px] overflow-hidden bg-[#0A0A0A] aspect-[21/9] sm:aspect-[24/9] mb-28 border border-[#0A0A0A]/10 shadow-xl group">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfi_fYbjh0IDkXu9bZ1otCTAOctK_62lzMSTV--OavC-pgb7Lbf7o2nZI&s=10"
              alt="ASN Media Creative Studio"
              className="w-full h-full object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 text-white font-mono text-xs tracking-widest uppercase font-semibold bg-black/70 px-3 py-1.5 rounded-sm">
              STUDIO & PRODUCTION HEADQUARTERS
            </div>
          </div>
        </Reveal>

        {/* 3. Impact Metrics Spread */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-12 border-y border-[#0A0A0A]/14 mb-28">
          {stats.map((st, idx) => (
            <Reveal key={st.label} delay={0.08 * idx}>
              <div className="flex flex-col gap-1">
                <span className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#0A0A0A] tracking-tight">
                  {st.value}
                </span>
                <span className="font-mono text-[11px] tracking-widest text-[#8E722A] uppercase font-semibold">
                  {st.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        {/* 4. Company Philosophy & Beliefs (No Box Cards!) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-32 pb-24 border-b border-[#0A0A0A]/14">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionLabel>OUR CORE PHILOSOPHY</SectionLabel>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display text-4xl sm:text-5xl text-[#0A0A0A] leading-tight">
                What drives our creative process.
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-sm sm:text-base text-[#66615A] font-body leading-relaxed mt-4 max-w-sm">
                Every campaign, film, and strategy we deliver adheres to three foundational principles designed to elevate perception.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-7 flex flex-col">
            {beliefs.map((b, idx) => (
              <Reveal key={b.num} delay={0.1 * idx}>
                <div className="py-7 border-t border-[#0A0A0A]/12 flex flex-col sm:flex-row items-start justify-between gap-4 group">
                  <div className="flex items-start gap-4 sm:w-1/2">
                    <span className="font-mono text-xs font-bold text-[#8E722A] pt-1">
                      {b.num}
                    </span>
                    <h3 className="font-display text-2xl text-[#0A0A0A] group-hover:text-[#8E722A] transition-colors">
                      {b.title}
                    </h3>
                  </div>
                  <p className="text-sm text-[#66615A] font-body leading-relaxed sm:w-1/2">
                    {b.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* 5. Integrated Capabilities Overview (No Box Cards!) */}
        <div className="mb-28">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <SectionLabel>INTEGRATED CAPABILITIES</SectionLabel>
                <h2 className="font-display text-4xl sm:text-5xl text-[#0A0A0A] leading-tight">
                  Full-spectrum creative support.
                </h2>
              </div>
              <Button to="/services" variant="secondary">
                View detailed services
              </Button>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-6 border-t border-[#0A0A0A]/14">
            {capabilities.map((cap, idx) => (
              <Reveal key={cap.num} delay={0.08 * idx}>
                <div className="flex flex-col gap-3 group">
                  <span className="font-mono text-xs font-bold text-[#8E722A] tracking-wider">
                    {cap.num}
                  </span>
                  <h3 className="font-display text-2xl text-[#0A0A0A] group-hover:text-[#8E722A] transition-colors">
                    {cap.title}
                  </h3>
                  <p className="text-xs text-[#66615A] leading-relaxed font-body">
                    {cap.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* 6. CTA Section */}
      <CTASection />
    </div>
  );
};
