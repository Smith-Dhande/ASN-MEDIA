import React from 'react';
import { Link } from 'react-router-dom';
import { SectionLabel } from '../ui/SectionLabel';
import { Reveal } from '../ui/Reveal';
import { servicesData } from '../../data/services';
import { ArrowUpRight } from 'lucide-react';

export const ServiceList = () => {
  return (
    <section className="py-24 md:py-36 bg-[#F7F5EF] text-[#0A0A0A] relative z-10 border-t border-[#0A0A0A]/10">
      <div className="container-custom">
        {/* Minimal Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16 md:mb-24 items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <SectionLabel>FULL CAPABILITIES</SectionLabel>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#0A0A0A] leading-[1.08] tracking-tight mt-4">
                Designed for <br className="hidden sm:block" />
                <span className="italic font-normal text-[#8E722A]">brand growth</span> & perception.
              </h2>
            </Reveal>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-end">
            <Reveal delay={0.2}>
              <p className="text-base text-[#66615A] leading-relaxed font-body max-w-md">
                We combine analytical positioning with high-craft production to build digital presence that commands authority in modern channels.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Ultra-Clean Minimal Editorial Service List */}
        <div className="border-t border-[#0A0A0A]/16">
          {servicesData.map((service, index) => (
            <Reveal key={service.id} delay={0.08 * index}>
              <Link
                to={`/services/${service.slug}`}
                className="group relative flex flex-col md:flex-row md:items-center justify-between py-8 sm:py-10 border-b border-[#0A0A0A]/14 transition-all duration-300 hover:px-4 -mx-4 rounded-sm"
              >
                {/* Left: Number & Service Title */}
                <div className="flex items-start md:items-center gap-6 sm:gap-12">
                  <span className="font-mono text-sm sm:text-base font-semibold text-[#8E722A] tracking-widest pt-1 md:pt-0">
                    {service.number}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[#0A0A0A] group-hover:text-[#8E722A] transition-colors duration-300 leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#66615A] mt-1.5 font-body">
                      {service.tagline}
                    </p>
                  </div>
                </div>

                {/* Right: Minimal Arrow Link */}
                <div className="flex items-center gap-4 mt-4 md:mt-0 self-end md:self-auto">
                  <span className="text-[11px] font-mono tracking-widest uppercase text-[#0A0A0A]/50 group-hover:text-[#0A0A0A] transition-colors font-semibold">
                    EXPLORE
                  </span>
                  <div className="w-9 h-9 rounded-full border border-[#0A0A0A]/16 group-hover:border-[#C8A13A] group-hover:bg-[#C8A13A] flex items-center justify-center transition-all duration-300">
                    <ArrowUpRight className="w-4 h-4 text-[#0A0A0A] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
