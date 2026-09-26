import React, { useState } from 'react';
import { SectionLabel } from '../components/ui/SectionLabel';
import { Reveal } from '../components/ui/Reveal';
import { CTASection } from '../components/sections/CTASection';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const Insights = () => {
  const [subscribed, setSubscribed] = useState(false);

  const featuredArticle = {
    id: "perception-over-content",
    title: "Why Content Without Perception Strategy Fails in Modern Feeds",
    category: "FEATURED ESSAY",
    date: "SEP 2026",
    readTime: "6 MIN READ",
    author: "ASN MEDIA STRATEGY TEAM",
    excerpt: "High-volume posting without visual restraint and narrative positioning creates noise rather than brand equity. Here is how leading brands curate perception, command pricing authority, and build lasting cultural affinity.",
    coverImage: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1800&auto=format&fit=crop"
  };

  const articles = [
    {
      id: "editorial-video-retention",
      title: "The Anatomy of High-Retention Short-Form Cinema",
      category: "PRODUCTION INSIGHT",
      date: "AUG 2026",
      readTime: "7 MIN READ",
      excerpt: "Pacing, sound design, color grading, and framing techniques that hold viewer attention beyond the 3-second threshold on modern algorithm feeds."
    },
    {
      id: "brand-growth-framework",
      title: "Building Digital Authority: A 2026 Founder's Playbook",
      category: "GROWTH FRAMEWORK",
      date: "JUL 2026",
      readTime: "8 MIN READ",
      excerpt: "How established brands combine continuous social media management with quarterly hero campaigns to drive compound organic growth."
    },
    {
      id: "visual-identity-systems",
      title: "Visual Identity Systems for High-Growth Digital Brands",
      category: "DESIGN SYSTEM",
      date: "JUN 2026",
      readTime: "5 MIN READ",
      excerpt: "Establishing typography hierarchies, color restraint, and editorial art direction that translate seamlessly from desktop web to mobile social feeds."
    },
    {
      id: "cinema-lighting-social",
      title: "Adapting Cinema Lighting Techniques for Vertical Mobile Screens",
      category: "STUDIO CRAFT",
      date: "MAY 2026",
      readTime: "6 MIN READ",
      excerpt: "How key light ratio, practical lamps, and anamorphic lens flares bring cinematic depth to short-form brand storytelling."
    }
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    setSubscribed(true);
  };

  return (
    <div className="bg-[#F7F5EF] text-[#0A0A0A] min-h-screen pt-28 sm:pt-36">
      <div className="container-custom">
        {/* 1. Page Header */}
        <div className="max-w-4xl mb-16 md:mb-24">
          <Reveal>
            <div className="flex items-center gap-3 mb-6">
              <SectionLabel>EDITORIAL & INSIGHTS</SectionLabel>

            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-normal leading-[1.03] tracking-tight text-[#0A0A0A] mb-8">
              Perspectives on <br />
              <span className="italic text-[#8E722A] font-normal">culture, growth</span> & production.
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-lg sm:text-xl text-[#66615A] font-body leading-relaxed max-w-2xl">
              Strategic breakdowns, design philosophy, and production essays from the ASN Media creative and strategy teams.
            </p>
          </Reveal>
        </div>

        {/* 2. Featured Lead Article Spread */}
        <Reveal delay={0.25}>
          <div className="mb-24 pb-20 border-b border-[#0A0A0A]/14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
              {/* Image Spread (7 Cols) */}
              <div className="lg:col-span-7">
                <div className="relative rounded-[8px] overflow-hidden bg-[#0A0A0A] aspect-[16/10] border border-[#0A0A0A]/10 shadow-xl group cursor-pointer">
                  <img
                    src={featuredArticle.coverImage}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-[#8E722A] text-white text-[10px] font-mono tracking-widest uppercase font-semibold rounded-sm">
                      {featuredArticle.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Text Spread (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col justify-center">
                <div className="flex items-center gap-3 text-xs font-mono text-[#8E722A] mb-3 font-semibold">
                  <span>{featuredArticle.date}</span>
                  <span>•</span>
                  <span>{featuredArticle.readTime}</span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl text-[#0A0A0A] leading-snug mb-4 group-hover:text-[#8E722A] transition-colors">
                  {featuredArticle.title}
                </h2>
                <p className="text-sm sm:text-base text-[#66615A] font-body leading-relaxed mb-6">
                  {featuredArticle.excerpt}
                </p>
                <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#0A0A0A] uppercase group cursor-pointer">
                  <span className="group-hover:text-[#8E722A] transition-colors">READ FULL ESSAY</span>
                  <ArrowUpRight className="w-4 h-4 text-[#8E722A] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* 3. Open Minimal Article Spreads */}
        <div className="mb-28">
          <Reveal>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#0A0A0A]/14">
              <span className="text-xs font-mono text-[#8E722A] tracking-[0.2em] uppercase font-bold">
                ALL ARTICLES & ESSAYS
              </span>
              <span className="text-xs font-mono text-[#66615A]">
                04 PAPERS
              </span>
            </div>
          </Reveal>

          <div className="flex flex-col">
            {articles.map((art, idx) => (
              <Reveal key={art.id} delay={0.08 * idx}>
                <article className="group relative py-8 sm:py-10 border-b border-[#0A0A0A]/12 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer">
                  <div className="max-w-3xl">
                    <div className="flex items-center gap-3 text-xs font-mono text-[#8E722A] mb-2 font-semibold">
                      <span>{art.category}</span>
                      <span>•</span>
                      <span>{art.date}</span>
                      <span>•</span>
                      <span>{art.readTime}</span>
                    </div>
                    <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[#0A0A0A] group-hover:text-[#8E722A] transition-colors mb-3 leading-tight">
                      {art.title}
                    </h3>
                    <p className="text-sm text-[#66615A] font-body leading-relaxed max-w-2xl">
                      {art.excerpt}
                    </p>
                  </div>

                  <div className="self-end md:self-center shrink-0">
                    <div className="w-10 h-10 rounded-full border border-[#0A0A0A]/16 flex items-center justify-center group-hover:bg-[#C8A13A] group-hover:border-[#C8A13A] transition-all duration-300">
                      <ArrowUpRight className="w-4 h-4 text-[#0A0A0A] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        {/* 4. Minimal Luxury Dispatch Newsletter Section */}
        {/* <Reveal>
          <div className="py-16 px-8 sm:px-12 bg-[#0A0A0A] text-[#F7F5EF] rounded-[12px] mb-28 relative overflow-hidden shadow-2xl">
            <div className="max-w-2xl relative z-10">
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#C8A13A] uppercase font-bold block mb-3">
                THE WEEKLY DISPATCH
              </span>
              <h3 className="font-display text-3xl sm:text-4xl text-white mb-4 leading-tight">
                Curated insights on brand positioning & visual craft.
              </h3>
              <p className="text-sm text-white/70 font-body mb-8 leading-relaxed">
                Join 5,000+ founders, creative directors, and brand leaders receiving our weekly analysis every Tuesday.
              </p>

              {subscribed ? (
                <div className="flex items-center gap-3 p-4 bg-white/10 rounded-md border border-[#C8A13A]/40 text-[#C8A13A] text-sm font-mono font-semibold">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Thank you for subscribing. Check your inbox for the latest edition.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    className="px-4 py-3 bg-white/10 text-white placeholder-white/40 text-sm font-body rounded-md border border-white/14 focus:outline-none focus:border-[#C8A13A] flex-grow"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#C8A13A] text-black text-xs font-mono font-bold tracking-widest uppercase rounded-md hover:bg-white transition-all shrink-0"
                  >
                    SUBSCRIBE
                  </button>
                </form>
              )}
            </div>
          </div>
        </Reveal> */}
      </div>

      {/* 5. CTA Section */}
      <CTASection />
    </div>
  );
};
