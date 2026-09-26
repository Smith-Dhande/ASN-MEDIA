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
          {/* Brand Info & Larger Circular Logo */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <div className="flex items-center gap-5">
              {/* Official Large Circular ASN Logo Image */}
              <img
                src="/favicon.PNG"
                alt="ASN Media Official Logo"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-[#C8A13A] shadow-2xl transition-transform duration-300 hover:scale-105 shrink-0 bg-black"
              />

              <div>
                <h3 className="font-bold text-xl sm:text-2xl tracking-[0.18em] uppercase font-body text-white">
                  ASN MEDIA
                </h3>
                <p className="text-xs text-[#C8A13A] tracking-[0.16em] uppercase font-mono mt-1 font-semibold">
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
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
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
