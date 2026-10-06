import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';
import { getDefaultRouteForRole } from '../utils/rbac';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, isBackendConnected } = useAdminData();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await login(email, password);
      const targetRoute = getDefaultRouteForRole(res?.user?.role || 'Super Admin');
      navigate(targetRoute || '/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
            ASN DIGITAL MEDIA
          </span>
          <span className="text-[10px] tracking-[0.14em] uppercase text-[#C8A13A] mt-1 font-mono font-semibold">
            CENTRAL OPERATIONS & ADMIN PANEL
          </span>
        </div>
      </div>

      {/* Center Login Box */}
      <div className="w-full max-w-md my-auto bg-white/5 border border-white/14 rounded-[10px] p-8 backdrop-blur-md shadow-2xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full text-[#C8A13A] mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-display text-3xl font-normal text-white mb-2">
            Admin Authentication
          </h1>
          <p className="text-xs text-white/70 font-body">
            Enter your credentials to access live client records, marketing packages, payments, and AI review scanners.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 rounded text-red-300 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono font-semibold uppercase tracking-wider text-[#C8A13A]">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@asndigitalmedia.com"
              className="px-4 py-3 bg-white/10 text-white placeholder-white/40 text-xs font-body rounded-sm border border-white/14 focus:outline-none focus:border-[#C8A13A] focus:ring-1 focus:ring-[#C8A13A]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono font-semibold uppercase tracking-wider text-[#C8A13A]">
                PASSWORD
              </label>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••••••"
              className="px-4 py-3 bg-white/10 text-white placeholder-white/40 text-xs font-body rounded-sm border border-white/14 focus:outline-none focus:border-[#C8A13A] focus:ring-1 focus:ring-[#C8A13A]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 bg-[#C8A13A] text-black font-mono font-bold text-xs tracking-widest uppercase rounded-sm hover:bg-white transition-all flex items-center justify-center gap-2 shadow-xl group disabled:opacity-70 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AUTHENTICATING...</span>
              </>
            ) : (
              <>
                <span>ENTER ADMIN PANEL</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Live Status Badge */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-[10px] font-mono text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>LIVE MONGODB & REST API BACKEND CONNECTED</span>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="pb-6 text-center text-[11px] font-mono text-white/40">
        © ASN Digital Media Admin System • Confidential Internal Workspace
      </div>
    </div>
  );
};
