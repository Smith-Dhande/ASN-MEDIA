import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SectionLabel } from '../ui/SectionLabel';
import { Reveal } from '../ui/Reveal';
import { servicesData } from '../../data/services';
import { ArrowRight } from 'lucide-react';

export const ServiceList = () => {
  const [activeHover, setActiveHover] = useState(null);

  return (
    <section className="pt-64 sm:pt-72 lg:pt-80 pb-24 md:pb-32 bg-[#F7F5EF] text-[#0A0A0A] relative z-10">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 pt-8 border-t border-[#0A0A0A]/10">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionLabel>FULL CAPABILITIES</SectionLabel>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#0A0A0A] leading-tight">
                Designed for brand growth & perception.
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-7 flex items-end">
            <Reveal delay={0.2}>
              <p className="text-base text-[#66615A] leading-relaxed max-w-lg">
                We combine analytical positioning with high-craft production to build digital presence that commands authority in modern channels.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Complete Editorial Service List (Reveals all 4 Services) */}
        <div className="border-t border-[#0A0A0A]/20">
          {servicesData.map((service, index) => (
            <Reveal key={service.id} delay={0.08 * index}>
              <Link
                to={`/services/${service.slug}`}
                onMouseEnter={() => setActiveHover(service.id)}
                onMouseLeave={() => setActiveHover(null)}
                className="group relative flex flex-col md:flex-row md:items-center justify-between py-10 md:py-12 border-b border-[#0A0A0A]/14 transition-colors duration-300 hover:bg-[#0A0A0A]/[0.02] px-4 -mx-4 rounded-sm"
              >
                {/* Left: Number & Title */}
                <div className="flex items-start md:items-center gap-6 md:gap-10">
                  <span className="font-mono text-sm sm:text-base font-semibold text-[#8E722A] tracking-wider pt-1 md:pt-0">
                    {service.number}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[#0A0A0A] group-hover:text-[#8E722A] transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#66615A] mt-1 font-body">
                      {service.shortDesc}
                    </p>
                  </div>
                </div>

                {/* Right: Interactive Arrow & Preview Indicator */}
                <div className="flex items-center gap-6 mt-4 md:mt-0 self-end md:self-auto">
                  <span className="text-xs font-semibold tracking-widest uppercase text-[#0A0A0A]/60 group-hover:text-[#0A0A0A] transition-colors">
                    EXPLORE SERVICE
                  </span>
                  <div className="w-10 h-10 rounded-full border border-[#0A0A0A]/20 group-hover:border-[#C8A13A] group-hover:bg-[#C8A13A] flex items-center justify-center transition-all duration-300">
                    <ArrowRight className="w-4 h-4 text-[#0A0A0A] group-hover:translate-x-0.5 transition-transform duration-300" />
                  </div>
                </div>

                {/* Subtle Gold Hover Line Indicator */}
                <div className="absolute left-0 bottom-0 top-0 w-[3px] bg-[#C8A13A] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
