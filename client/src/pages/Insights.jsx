import React from 'react';
import { SectionLabel } from '../components/ui/SectionLabel';
import { Reveal } from '../components/ui/Reveal';
import { CTASection } from '../components/sections/CTASection';
import { ArrowUpRight } from 'lucide-react';

export const Insights = () => {
  const articles = [
    {
      id: "perception-over-content",
      title: "Why Content Without Perception Strategy Fails in Modern Feeds",
      category: "STRATEGY ESSAY",
      date: "SEP 2026",
      readTime: "5 MIN READ",
      excerpt: "High-volume posting without visual restraint and narrative positioning creates noise rather than brand equity. Here is how leading brands curate perception."
    },
    {
      id: "editorial-video-retention",
      title: "The Anatomy of High-Retention Short-Form Cinema",
      category: "PRODUCTION INSIGHT",
      date: "AUG 2026",
      readTime: "7 MIN READ",
      excerpt: "Pacing, sound design, and color grading techniques that hold viewer attention beyond the 3-second threshold on social algorithms."
    },
    {
      id: "brand-growth-framework",
      title: "Building Digital Authority: A 2026 Founder's Playbook",
      category: "GROWTH FRAMEWORK",
      date: "JUL 2026",
      readTime: "6 MIN READ",
      excerpt: "How established brands combine continuous social management with quarterly hero campaigns to drive compound organic growth."
    }
  ];

  return (
    <div className="pt-32 pb-20 md:pt-40">
      <div className="container-custom">
        {/* Header */}
        <div className="max-w-3xl mb-20">
          <Reveal>
            <SectionLabel>EDITORIAL & INSIGHTS</SectionLabel>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-[#0A0A0A] mb-6">
              Perspectives on culture, growth & production.
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-base sm:text-lg text-[#66615A] font-body leading-relaxed">
              Analysis and strategic breakdowns from ASN Media's creative and production teams.
            </p>
          </Reveal>
        </div>

        {/* Article Spreads */}
        <div className="flex flex-col gap-12 mb-28 border-t border-[#0A0A0A]/14">
          {articles.map((art, idx) => (
            <Reveal key={art.id} delay={0.1 * idx}>
              <article className="group relative py-10 border-b border-[#0A0A0A]/14 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-4 text-xs font-mono text-[#8E722A] mb-2">
                    <span>{art.category}</span>
                    <span>•</span>
                    <span>{art.date}</span>
                    <span>•</span>
                    <span>{art.readTime}</span>
                  </div>
                  <h2 className="font-display text-3xl sm:text-4xl text-[#0A0A0A] group-hover:text-[#8E722A] transition-colors mb-3">
                    {art.title}
                  </h2>
                  <p className="text-sm text-[#66615A] font-body leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>
                <div className="self-end md:self-center">
                  <div className="w-10 h-10 rounded-full border border-[#0A0A0A]/20 flex items-center justify-center group-hover:bg-[#C8A13A] group-hover:border-[#C8A13A] transition-all">
                    <ArrowUpRight className="w-4 h-4 text-[#0A0A0A]" />
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      <CTASection />
    </div>
  );
};
