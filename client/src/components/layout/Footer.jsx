import React from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../../data/site';
import { servicesData } from '../../data/services';
import { ArrowUpRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#0A0A0A] text-[#F7F5EF] pt-20 pb-12 border-t border-white/10">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Brand Info & Circular Logo */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              {/* Full Circular ASN Logo Mark */}
              <div className="w-16 h-16 rounded-full border-2 border-[#C8A13A] bg-black/80 flex flex-col items-center justify-center p-2 text-center shadow-lg relative group">
                <span className="font-bold text-xs tracking-tighter text-[#C8A13A] font-body leading-none">
                  ASN
                </span>
                <span className="text-[7px] tracking-widest text-white/80 uppercase font-semibold mt-0.5">
                  MEDIA
                </span>
                <div className="absolute inset-0 rounded-full border border-[#C8A13A]/30 scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500" />
              </div>

              <div>
                <h3 className="font-semibold text-lg tracking-widest uppercase font-body text-white">
                  ASN MEDIA
                </h3>
                <p className="text-xs text-[#C8A13A] tracking-wider uppercase font-mono mt-0.5">
                  SOCIAL • CONTENT • GROWTH
                </p>
              </div>
            </div>

            <p className="font-display text-2xl md:text-3xl text-white/90 leading-tight max-w-md pt-2">
              Let's create something worth remembering.
            </p>

            <a
              href={`mailto:${siteConfig.email}`}
              className="inline-flex items-center gap-2 text-[#C8A13A] font-mono text-sm hover:underline tracking-wide group"
            >
              {siteConfig.email}
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <span className="text-[10px] tracking-[0.2em] text-[#C8A13A] uppercase font-semibold">
              NAVIGATION
            </span>
            <ul className="flex flex-col gap-2.5 text-sm text-[#F7F5EF]/80">
              {siteConfig.navLinks.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="hover:text-[#C8A13A] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/contact" className="hover:text-[#C8A13A] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <span className="text-[10px] tracking-[0.2em] text-[#C8A13A] uppercase font-semibold">
              SERVICES
            </span>
            <ul className="flex flex-col gap-2.5 text-sm text-[#F7F5EF]/80">
              {servicesData.map((svc) => (
                <li key={svc.id}>
                  <Link
                    to={`/services/${svc.slug}`}
                    className="hover:text-[#C8A13A] transition-colors"
                  >
                    {svc.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <span className="text-[10px] tracking-[0.2em] text-[#C8A13A] uppercase font-semibold">
              SOCIAL
            </span>
            <ul className="flex flex-col gap-2.5 text-sm text-[#F7F5EF]/80">
              {siteConfig.socials.map((soc) => (
                <li key={soc.label}>
                  <a
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#C8A13A] transition-colors inline-flex items-center gap-1.5"
                  >
                    {soc.label}
                    <ArrowUpRight className="w-3 h-3 opacity-60" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-[#66615A] gap-4">
          <p>{siteConfig.copyright}</p>
          <p className="font-mono text-[11px]">Designed with editorial restraint & cinematic focus.</p>
        </div>
      </div>
    </footer>
  );
};
