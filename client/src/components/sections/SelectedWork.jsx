import React from 'react';
import { Link } from 'react-router-dom';
import { SectionLabel } from '../ui/SectionLabel';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Reveal';
import { projectsData } from '../../data/projects';
import { ArrowUpRight } from 'lucide-react';

export const SelectedWork = () => {
  const featuredProjects = projectsData.filter((p) => p.featured);

  return (
    <section className="py-24 md:py-36 bg-[#F7F5EF]">
      <div className="container-custom">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <Reveal>
              <SectionLabel>PORTFOLIO</SectionLabel>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#0A0A0A]">
                Selected Work
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <Button to="/work" variant="secondary">
              View all projects
            </Button>
          </Reveal>
        </div>

        {/* Editorial Project Rhythms */}
        <div className="flex flex-col gap-24 md:gap-36">
          {featuredProjects.map((project, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <Reveal key={project.id} y={40}>
                <div
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center ${
                    isEven ? '' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Media Column (7 Cols) */}
                  <div
                    className={`lg:col-span-7 ${
                      isEven ? 'lg:order-1' : 'lg:order-2'
                    }`}
                  >
                    <Link
                      to={`/work/${project.slug}`}
                      className="group block relative rounded-[8px] overflow-hidden bg-[#0A0A0A] border border-[#0A0A0A]/10 shadow-lg"
                    >
                      <div className="aspect-[16/10] relative w-full overflow-hidden">
                        <img
                          src={project.coverImage}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
                        
                        {/* Service Tags */}
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
                    </Link>
                  </div>

                  {/* Text Details Column (5 Cols) */}
                  <div
                    className={`lg:col-span-5 flex flex-col items-start ${
                      isEven ? 'lg:order-2' : 'lg:order-1'
                    }`}
                  >
                    <span className="font-mono text-xs font-semibold text-[#8E722A] tracking-widest mb-2">
                      0{idx + 1} — {project.year}
                    </span>
                    <h3 className="font-display text-3xl sm:text-4xl text-[#0A0A0A] mb-3 leading-tight">
                      {project.title}
                    </h3>
                    <p className="text-xs font-semibold tracking-widest text-[#0A0A0A]/60 uppercase mb-4">
                      CLIENT: {project.client}
                    </p>
                    <p className="text-sm text-[#66615A] leading-relaxed mb-6 font-body">
                      {project.description}
                    </p>
                    <Link
                      to={`/work/${project.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider text-[#0A0A0A] hover:text-[#8E722A] transition-colors group"
                    >
                      <span>View project</span>
                      <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
