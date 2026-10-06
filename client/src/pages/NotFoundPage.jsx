import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, Globe, Briefcase, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-[70vh] bg-[#F7F5EF] text-[#111111] flex items-center justify-center p-6 font-body relative overflow-hidden selection:bg-[#C8A13A] selection:text-black">
      {/* Decorative Subtle Background Ambient Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#8E722A]/05 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full text-center space-y-8 relative z-10 my-auto">
        {/* Brand Badge Header */}
        <div className="flex items-center justify-center gap-2">
          <img
            src="/favicon.PNG"
            alt="ASN Media"
            className="w-10 h-10 rounded-full border border-[#8E722A] object-cover bg-black"
          />
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#8E722A]">
            ASN MEDIA
          </span>
        </div>

        {/* Large Expressive 404 Typography */}
        <div className="space-y-2">
          <div className="font-display text-8xl sm:text-9xl font-normal text-[#111111] tracking-tighter leading-none select-none">
            4<span className="text-[#8E722A] italic">0</span>4
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#111111]">
            Page Not Found
          </h1>
          <p className="text-xs font-mono text-[#66615A] max-w-sm mx-auto">
            {isAdmin
              ? "The requested administrative route or module does not exist in the ASN Media portal."
              : "The page you are looking for doesn't exist, has been removed, or the link is broken."}
          </p>
        </div>

        {/* Action Buttons - Contextually Styled */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 font-mono text-xs">
          {isAdmin ? (
            <>
              <Link
                to="/admin/dashboard"
                className="w-full sm:w-auto px-5 py-3 bg-[#111111] text-[#F7F5EF] hover:bg-[#8E722A] rounded-xs transition-all duration-300 font-bold uppercase tracking-wider flex items-center justify-center gap-2 no-underline shadow-xs"
              >
                <LayoutDashboard className="w-4 h-4 text-[#C8A13A]" />
                <span>Back to Dashboard</span>
              </Link>

              <Link
                to="/"
                className="w-full sm:w-auto px-5 py-3 bg-[#F7F5EF] text-[#111111] border border-[#0A0A0A]/14 hover:bg-[#0A0A0A] hover:text-[#F7F5EF] rounded-xs transition-all duration-300 font-bold uppercase tracking-wider flex items-center justify-center gap-2 no-underline"
              >
                <Globe className="w-4 h-4 text-[#8E722A]" />
                <span>Visit Main Website</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/"
                className="w-full sm:w-auto px-5 py-3 bg-[#111111] text-[#F7F5EF] hover:bg-[#8E722A] rounded-xs transition-all duration-300 font-bold uppercase tracking-wider flex items-center justify-center gap-2 no-underline shadow-xs"
              >
                <Home className="w-4 h-4 text-[#C8A13A]" />
                <span>Return to Home</span>
              </Link>

              <Link
                to="/work"
                className="w-full sm:w-auto px-5 py-3 bg-[#F7F5EF] text-[#111111] border border-[#0A0A0A]/14 hover:bg-[#0A0A0A] hover:text-[#F7F5EF] rounded-xs transition-all duration-300 font-bold uppercase tracking-wider flex items-center justify-center gap-2 no-underline"
              >
                <Briefcase className="w-4 h-4 text-[#8E722A]" />
                <span>Explore Work</span>
              </Link>
            </>
          )}
        </div>

        {/* Footnote */}
        <div className="pt-6 border-t border-[#0A0A0A]/08 text-[11px] font-mono text-[#888]">
          <span>{isAdmin ? 'ASN Media Admin System' : 'ASN Media Digital Platform'}</span>
        </div>
      </div>
    </div>
  );
};
