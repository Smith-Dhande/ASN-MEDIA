import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export const AdminLogin = () => {
  const [email, setEmail] = useState('sarah@asnmedia.in');
  const [password, setPassword] = useState('••••••••••••');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem('asn_admin_auth', 'true');
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F7F5EF] flex flex-col justify-between items-center p-6 selection:bg-[#C8A13A] selection:text-black">
      {/* Top Brand Header */}
      <div className="pt-8 flex items-center gap-3">
        <img
          src="/favicon.PNG"
          alt="ASN Media Logo"
          className="w-10 h-10 rounded-full object-cover border border-[#C8A13A] shadow-md"
        />
        <div className="flex flex-col">
          <span className="font-semibold text-sm tracking-[0.2em] font-body leading-none uppercase text-white">
            ASN MEDIA
          </span>
          <span className="text-[10px] tracking-[0.14em] uppercase text-[#C8A13A] mt-1 font-mono font-semibold">
            INTERNAL SYSTEM PORTAL
          </span>
        </div>
      </div>

      {/* Center Login Box */}
      <div className="w-full max-w-md my-auto bg-white/5 border border-white/14 rounded-[10px] p-8 backdrop-blur-md shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full text-[#C8A13A] mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-display text-3xl font-normal text-white mb-2">
            Admin Authentication
          </h1>
          <p className="text-xs text-white/70 font-body">
            Enter your credentials to access the ASN Digital Media Operations Panel.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono font-semibold uppercase tracking-wider text-[#C8A13A]">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-4 py-3 bg-white/10 text-white placeholder-white/40 text-xs font-body rounded-sm border border-white/14 focus:outline-none focus:border-[#C8A13A] focus:ring-1 focus:ring-[#C8A13A]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono font-semibold uppercase tracking-wider text-[#C8A13A]">
                PASSWORD
              </label>
              <span className="text-[11px] font-mono text-white/40">Phase 1 Mock Auth</span>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="px-4 py-3 bg-white/10 text-white placeholder-white/40 text-xs font-body rounded-sm border border-white/14 focus:outline-none focus:border-[#C8A13A] focus:ring-1 focus:ring-[#C8A13A]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 bg-[#C8A13A] text-black font-mono font-bold text-xs tracking-widest uppercase rounded-sm hover:bg-white transition-all flex items-center justify-center gap-2 shadow-xl group mt-2"
          >
            <span>ENTER ADMIN PANEL</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Phase 1 Security Notice */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-[10px] font-mono text-white/50">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C8A13A]" />
          <span>PHASE 1 FRONTEND DEMO ONLY • NO BACKEND CONNECTED</span>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="pb-6 text-center text-[11px] font-mono text-white/40">
        © ASN Digital Media Admin System • Confidential Internal Workspace
      </div>
    </div>
  );
};
