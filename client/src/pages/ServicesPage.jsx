import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { SectionLabel } from '../components/ui/SectionLabel';
import { Button } from '../components/ui/Button';
import { Reveal } from '../components/ui/Reveal';
import { servicesData } from '../data/services';
import { CTASection } from '../components/sections/CTASection';

export const ServicesPage = () => {
  const { slug } = useParams();

  // Smooth scroll to targeted service section if slug is provided
  useEffect(() => {
    if (slug) {
      const element = document.getElementById(slug);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [slug]);

  return (
    <div className="bg-[#F7F5EF] text-[#0A0A0A] min-h-screen pt-28 sm:pt-36">
      {/* Editorial Page Header */}
      <section className="relative pb-16 md:pb-24 border-b border-[#0A0A0A]/12">
        <div className="container-custom">
          <div className="max-w-4xl">
            <Reveal>
              <div className="flex items-center gap-3 mb-6">
                <SectionLabel>SERVICES & CAPABILITIES</SectionLabel>
                <span className="w-1.5 h-1.5 rounded-full bg-[#8E722A]" />
                <span className="text-[11px] font-mono tracking-widest text-[#8E722A] uppercase font-semibold">
                  04 SPECIALIZED DISCIPLINES
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal leading-[1.03] tracking-tight text-[#0A0A0A] mb-8">
                Engineered for <br />
                <span className="italic text-[#8E722A] font-normal">authority, scale</span> & perception.
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-base sm:text-lg text-[#66615A] font-body leading-relaxed max-w-2xl">
                We combine strategic positioning, cinematic production, and data-informed execution to transform how audiences perceive and engage with your brand.
              </p>
            </Reveal>
          </div>

          {/* Minimal Quick Jump Category Bar */}
          <Reveal delay={0.3}>
            <div className="flex flex-wrap items-center gap-6 mt-12 pt-8 border-t border-[#0A0A0A]/12">
              <span className="text-xs font-mono text-[#8E722A] uppercase tracking-widest font-semibold">
                INDEX:
              </span>
              {servicesData.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(s.slug)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="text-xs font-mono tracking-wider uppercase text-[#66615A] hover:text-[#0A0A0A] hover:underline underline-offset-4 transition-colors"
                >
                  {s.number} • {s.title}
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Pure Editorial Minimal Service Spreads */}
      <section className="py-20 md:py-32">
        <div className="container-custom flex flex-col gap-28 md:gap-36">
          {servicesData.map((svc) => {
            const isTargeted = slug === svc.slug;
            return (
              <div
                key={svc.id}
                id={svc.slug}
                className="scroll-mt-32 pt-12 border-t border-[#0A0A0A]/16"
              >
                {/* 1. Header & Overview */}
                <Reveal>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start mb-14">
                    {/* Left: Number & Titles */}
                    <div className="lg:col-span-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-mono text-sm font-bold text-[#8E722A] tracking-widest uppercase">
                          DISCIPLINE {svc.number}
                        </span>
                        {isTargeted && (
                          <span className="px-2 py-0.5 bg-[#8E722A] text-white font-mono text-[9px] font-bold uppercase tracking-widest rounded-sm">
                            CURRENT SELECTION
                          </span>
                        )}
                      </div>
                      <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#0A0A0A] leading-[1.08] tracking-tight mb-4">
                        {svc.title}
                      </h2>
                      <p className="text-base sm:text-lg text-[#8E722A] font-body italic font-normal">
                        {svc.tagline}
                      </p>
                    </div>

                    {/* Right: Description & Action Link */}
                    <div className="lg:col-span-6 flex flex-col justify-between">
                      <p className="text-base text-[#55514B] font-body leading-relaxed mb-8 max-w-xl">
                        {svc.description}
                      </p>
                      <div>
                        <Button to="/contact" variant="primary" className="px-7 py-3.5 text-xs shadow-md">
                          Enquire for {svc.title}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Reveal>

                {/* 2. Sleek Wide Image Frame */}
                <Reveal delay={0.1}>
                  <div className="relative w-full rounded-[8px] overflow-hidden bg-[#0A0A0A] aspect-[21/9] sm:aspect-[24/9] mb-16 group">
                    <img
                      src={svc.featuredMedia}
                      alt={svc.title}
                      className="w-full h-full object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 sm:left-8">
                      <span className="text-xs font-mono tracking-widest text-[#F7F5EF] uppercase font-semibold bg-black/80 px-3 py-1.5 rounded-sm">
                        {svc.shortDesc}
                      </span>
                    </div>
                  </div>
                </Reveal>

                {/* 3. Open Editorial Columns (Deliverables & Process - NO CARDS!) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                  {/* Left: Deliverables List (5 Cols) */}
                  <div className="lg:col-span-5">
                    <Reveal delay={0.15}>
                      <span className="text-xs font-mono tracking-[0.2em] text-[#8E722A] uppercase font-bold block mb-6 pb-2 border-b border-[#0A0A0A]/12">
                        DELIVERABLE HIGHLIGHTS
                      </span>
                      <ul className="flex flex-col gap-4">
                        {svc.deliverables.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-[#0A0A0A] font-body leading-relaxed">
                            <span className="font-mono text-xs font-semibold text-[#8E722A] pt-0.5">
                              0{i + 1}
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </Reveal>
                  </div>

                  {/* Right: Process Breakdown Rows (7 Cols) */}
                  <div className="lg:col-span-7">
                    <Reveal delay={0.2}>
                      <span className="text-xs font-mono tracking-[0.2em] text-[#8E722A] uppercase font-bold block mb-6 pb-2 border-b border-[#0A0A0A]/12">
                        THE EXECUTION PROCESS
                      </span>
                    </Reveal>

                    <div className="flex flex-col border-b border-[#0A0A0A]/12">
                      {svc.process.map((pStep, pIdx) => (
                        <Reveal key={pStep.step} delay={0.06 * pIdx}>
                          <div className="py-5 border-t border-[#0A0A0A]/12 flex flex-col sm:flex-row sm:items-start justify-between gap-4 group">
                            <div className="flex items-start gap-4 sm:w-1/2">
                              <span className="font-mono text-xs font-bold text-[#8E722A] pt-1">
                                {pStep.step}
                              </span>
                              <h4 className="font-display text-lg text-[#0A0A0A] group-hover:text-[#8E722A] transition-colors">
                                {pStep.name}
                              </h4>
                            </div>
                            <p className="text-xs text-[#66615A] font-body leading-relaxed sm:w-1/2">
                              {pStep.detail}
                            </p>
                          </div>
                        </Reveal>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Call-to-Action */}
      <CTASection />
    </div>
  );
};
