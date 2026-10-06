import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SectionLabel } from '../components/ui/SectionLabel';
import { Reveal } from '../components/ui/Reveal';
import { projectsData } from '../data/projects';
import { CTASection } from '../components/sections/CTASection';
import { ArrowUpRight } from 'lucide-react';

export const Work = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const categories = ['All', 'Video Production', 'Content Creation', 'Brand Strategy', 'Social Strategy'];

  const filteredProjects =
    selectedFilter === 'All'
      ? projectsData
      : projectsData.filter((p) =>
          p.services.some((s) => s.toLowerCase().includes(selectedFilter.toLowerCase()))
        );

  return (
    <div className="pt-32 pb-20 md:pt-40">
      <div className="container-custom">
        {/* Page Header */}
        <div className="max-w-3xl mb-16">
          <Reveal>
            <SectionLabel>PORTFOLIO & CASE STUDIES</SectionLabel>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-[#0A0A0A] mb-6">
              Selected Work
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-base sm:text-lg text-[#66615A] font-body leading-relaxed">
              Explore our curation of brand campaigns, social media systems, cinematic films, and visual identity projects.
            </p>
          </Reveal>
        </div>

        {/* Category Filters */}
        <Reveal delay={0.25}>
          <div className="flex flex-wrap items-center gap-3 mb-16 pb-6 border-b border-[#0A0A0A]/10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-all duration-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#C8A13A] ${
                  selectedFilter === cat
                    ? 'bg-[#0A0A0A] text-[#F7F5EF]'
                    : 'bg-transparent text-[#66615A] hover:text-[#0A0A0A] hover:bg-[#0A0A0A]/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Project Grid / Spreads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 mb-28">
          {filteredProjects.map((project, idx) => (
            <Reveal key={project.id} delay={0.1 * idx}>
              <Link
                to={`/work/${project.slug}`}
                className="group block relative flex flex-col gap-5"
              >
                <div className="relative rounded-[8px] overflow-hidden bg-[#0A0A0A] border border-[#0A0A0A]/10 aspect-[16/10]">
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
                  
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {project.services.slice(0, 2).map((svc) => (
                      <span
                        key={svc}
                        className="px-2.5 py-1 bg-black/70 backdrop-blur-sm text-[10px] font-mono tracking-wider text-white uppercase rounded-sm border border-white/10"
                      >
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs text-[#8E722A] font-semibold tracking-widest uppercase">
                      {project.client} • {project.year}
                    </span>
                    <h3 className="font-display text-2xl text-[#0A0A0A] group-hover:text-[#8E722A] transition-colors mt-1">
                      {project.title}
                    </h3>
                  </div>
                  <div className="w-9 h-9 rounded-full border border-[#0A0A0A]/20 flex items-center justify-center group-hover:bg-[#C8A13A] group-hover:border-[#C8A13A] transition-all">
                    <ArrowUpRight className="w-4 h-4 text-[#0A0A0A]" />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>

      <CTASection />
    </div>
  );
};
