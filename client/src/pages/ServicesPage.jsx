import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { SectionLabel } from '../components/ui/SectionLabel';
import { Button } from '../components/ui/Button';
import { Reveal } from '../components/ui/Reveal';
import { servicesData } from '../data/services';
import { CTASection } from '../components/sections/CTASection';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export const ServicesPage = () => {
  const { slug } = useParams();

  // If a specific service slug is provided in URL, highlight or detail it
  const activeService = slug
    ? servicesData.find((s) => s.slug === slug)
    : null;

  return (
    <div className="pt-32 pb-20 md:pt-40">
      <div className="container-custom">
        {/* Page Header */}
        <div className="max-w-3xl mb-20">
          <Reveal>
            <SectionLabel>OUR CAPABILITIES & SERVICES</SectionLabel>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-[#0A0A0A] mb-6">
              Services engineered for growth & authority.
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-base sm:text-lg text-[#66615A] font-body leading-relaxed">
              We provide full-spectrum creative and strategic execution designed to transform how audiences perceive and engage with your brand.
            </p>
          </Reveal>
        </div>

        {/* Detailed Service Cards / Sections */}
        <div className="flex flex-col gap-24 mb-28">
          {servicesData.map((svc, index) => {
            const isTargeted = activeService && activeService.id === svc.id;
            return (
              <Reveal key={svc.id} y={30}>
                <div
                  id={svc.slug}
                  className={`p-8 sm:p-12 md:p-16 rounded-[8px] border transition-all duration-500 ${
                    isTargeted
                      ? 'bg-[#0A0A0A] text-[#F7F5EF] border-[#C8A13A]'
                      : 'bg-[#F7F5EF] text-[#0A0A0A] border-[#0A0A0A]/14'
                  }`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Info Column */}
                    <div className="lg:col-span-5 flex flex-col items-start">
                      <span
                        className={`font-mono text-sm font-semibold tracking-widest mb-3 ${
                          isTargeted ? 'text-[#C8A13A]' : 'text-[#8E722A]'
                        }`}
                      >
                        SERVICE {svc.number}
                      </span>
                      <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-tight mb-4">
                        {svc.title}
                      </h2>
                      <p
                        className={`text-base font-body leading-relaxed mb-8 ${
                          isTargeted ? 'text-white/80' : 'text-[#66615A]'
                        }`}
                      >
                        {svc.description}
                      </p>
                      <Button
                        to="/contact"
                        variant={isTargeted ? 'accent' : 'primary'}
                      >
                        Enquire for this service
                      </Button>
                    </div>

                    {/* Right Deliverables & Process Column */}
                    <div className="lg:col-span-7 flex flex-col gap-8">
                      <div>
                        <h3
                          className={`text-xs font-semibold tracking-[0.2em] uppercase mb-4 ${
                            isTargeted ? 'text-[#C8A13A]' : 'text-[#8E722A]'
                          }`}
                        >
                          WHAT WE DELIVER
                        </h3>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          {svc.deliverables.map((item, i) => (
                            <li
                              key={i}
                              className={`flex items-start gap-2.5 font-body ${
                                isTargeted ? 'text-white/90' : 'text-[#111111]'
                              }`}
                            >
                              <CheckCircle2
                                className={`w-4 h-4 mt-0.5 shrink-0 ${
                                  isTargeted ? 'text-[#C8A13A]' : 'text-[#8E722A]'
                                }`}
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Process Breakdown */}
                      <div className="pt-6 border-t border-current/10">
                        <h3
                          className={`text-xs font-semibold tracking-[0.2em] uppercase mb-4 ${
                            isTargeted ? 'text-[#C8A13A]' : 'text-[#8E722A]'
                          }`}
                        >
                          THE PROCESS
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {svc.process.map((pStep) => (
                            <div
                              key={pStep.step}
                              className={`p-4 rounded-sm border ${
                                isTargeted
                                  ? 'bg-white/5 border-white/10'
                                  : 'bg-black/5 border-black/10'
                              }`}
                            >
                              <span
                                className={`font-mono text-[10px] font-bold block mb-1 ${
                                  isTargeted ? 'text-[#C8A13A]' : 'text-[#8E722A]'
                                }`}
                              >
                                {pStep.step}
                              </span>
                              <h4 className="font-semibold text-xs mb-1">
                                {pStep.name}
                              </h4>
                              <p
                                className={`text-[11px] leading-snug ${
                                  isTargeted ? 'text-white/60' : 'text-[#66615A]'
                                }`}
                              >
                                {pStep.detail}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      <CTASection />
    </div>
  );
};
