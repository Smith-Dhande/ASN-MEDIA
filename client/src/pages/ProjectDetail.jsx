import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { SectionLabel } from '../components/ui/SectionLabel';
import { Button } from '../components/ui/Button';
import { Reveal } from '../components/ui/Reveal';
import { projectsData } from '../data/projects';
import { ArrowLeft, ArrowRight, Play } from 'lucide-react';

export const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const projectIndex = projectsData.findIndex((p) => p.slug === slug);
  const project = projectsData[projectIndex] || projectsData[0];

  const nextProjectIndex = (projectIndex + 1) % projectsData.length;
  const nextProject = projectsData[nextProjectIndex];

  return (
    <div className="pt-32 pb-24 md:pt-40">
      <div className="container-custom">
        {/* Back Link */}
        <div className="mb-10">
          <button
            onClick={() => navigate('/work')}
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-[#66615A] hover:text-[#0A0A0A] uppercase transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK TO ALL WORK
          </button>
        </div>

        {/* Project Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-8">
            <Reveal>
              <SectionLabel>{project.category}</SectionLabel>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl text-[#0A0A0A] leading-tight mb-6">
                {project.title}
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-lg text-[#66615A] font-body leading-relaxed max-w-2xl">
                {project.description}
              </p>
            </Reveal>
          </div>

          {/* Specs Column */}
          <div className="lg:col-span-4 flex flex-col gap-6 p-8 bg-[#0A0A0A]/[0.03] border border-[#0A0A0A]/10 rounded-[8px]">
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#8E722A] block mb-1">
                CLIENT
              </span>
              <p className="font-semibold text-base text-[#0A0A0A]">{project.client}</p>
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#8E722A] block mb-1">
                YEAR
              </span>
              <p className="font-semibold text-base text-[#0A0A0A]">{project.year}</p>
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#8E722A] block mb-1">
                SERVICES DELIVERED
              </span>
              <ul className="flex flex-wrap gap-2 pt-1">
                {project.services.map((svc) => (
                  <li
                    key={svc}
                    className="px-2.5 py-1 bg-[#0A0A0A] text-[#F7F5EF] text-[10px] font-mono uppercase rounded-sm"
                  >
                    {svc}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Primary Hero Media */}
        <Reveal delay={0.25}>
          <div className="relative rounded-[8px] overflow-hidden bg-[#0A0A0A] aspect-[16/9] mb-20 shadow-2xl border border-[#0A0A0A]/10">
            {project.videoUrl ? (
              <video
                src={project.videoUrl}
                poster={project.coverImage}
                controls
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={project.coverImage}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </Reveal>

        {/* Narrative / Overview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24 pb-20 border-b border-[#0A0A0A]/10">
          <div className="lg:col-span-4">
            <SectionLabel>CREATIVE APPROACH</SectionLabel>
            <h2 className="font-display text-3xl sm:text-4xl text-[#0A0A0A] leading-tight">
              Perception built by intentional design.
            </h2>
          </div>
          <div className="lg:col-span-8 flex flex-col gap-6 text-base text-[#66615A] leading-relaxed font-body">
            <p>{project.overview}</p>
            <p>
              By aligning visual language with tight social editing cadences, the campaign delivered organic engagement across targeted demographics while retaining high-end editorial positioning.
            </p>
          </div>
        </div>

        {/* Project Gallery Spreads */}
        {project.gallery && project.gallery.length > 0 && (
          <div className="mb-28">
            <Reveal>
              <SectionLabel>CAMPAIGN GALLERY</SectionLabel>
              <h2 className="font-display text-3xl sm:text-4xl text-[#0A0A0A] mb-12">
                Visual Assets & Stills
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {project.gallery.map((imgUrl, i) => (
                <Reveal key={i} delay={0.1 * i}>
                  <div className="rounded-[8px] overflow-hidden bg-[#0A0A0A] aspect-[4/3] border border-[#0A0A0A]/10">
                    <img
                      src={imgUrl}
                      alt={`${project.title} still ${i + 1}`}
                      className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500"
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {/* Next Project Footer Link */}
        <div className="pt-16 border-t border-[#0A0A0A]/14 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#8E722A] uppercase block mb-1">
              NEXT PROJECT
            </span>
            <Link
              to={`/work/${nextProject.slug}`}
              className="font-display text-3xl sm:text-4xl text-[#0A0A0A] hover:text-[#8E722A] transition-colors"
            >
              {nextProject.title} →
            </Link>
          </div>
          <Button to={`/work/${nextProject.slug}`} variant="secondary">
            Next case study
          </Button>
        </div>
      </div>
    </div>
  );
};
