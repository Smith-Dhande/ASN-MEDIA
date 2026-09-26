import React, { useState } from 'react';
import { Calendar, Clock, AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const OperationalInsightPanel = ({ clients = [], payments = [], tasks = [] }) => {
  const [selectedDay, setSelectedDay] = useState(19);

  const days = [
    { day: 'Tue', date: 17 },
    { day: 'Wed', date: 18 },
    { day: 'Thu', date: 19, active: true, events: 3 },
    { day: 'Fri', date: 20, events: 1 },
    { day: 'Sat', date: 21 },
  ];

  const upcomingAlerts = [
    {
      id: 1,
      title: 'Horizon Ltd Package Expiry',
      type: 'expiry',
      date: 'Sep 24, 2026',
      badge: 'Expiring Soon',
      link: '/admin/clients/expiring',
    },
    {
      id: 2,
      title: 'Vanguard Media ($4,500)',
      type: 'payment',
      date: 'Sep 28, 2026',
      badge: 'Due Payment',
      link: '/admin/payments/due',
    },
    {
      id: 3,
      title: 'Social Media Reel Strategy',
      type: 'task',
      date: 'Sep 30, 2026',
      badge: 'High Priority',
      link: '/admin/tasks',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Top Panel: Calendar & Operational Timeline */}
      <div className="bg-white rounded-xl border border-[#0A0A0A]/08 p-4 shadow-2xs">
        {/* Calendar Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#0A0A0A]/06">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#8E722A]" />
            <h3 className="font-display text-base font-normal text-[#111111]">
              September 2026
            </h3>
          </div>
          <div className="flex items-center gap-0.5">
            <button
              className="p-1 rounded-md text-[#685C43] hover:text-[#111111] hover:bg-[#F7F5EF] transition-colors focus:outline-none"
              aria-label="Previous week"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              className="p-1 rounded-md text-[#685C43] hover:text-[#111111] hover:bg-[#F7F5EF] transition-colors focus:outline-none"
              aria-label="Next week"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Date Selector Row */}
        <div className="grid grid-cols-5 gap-1.5 my-3 text-center">
          {days.map((d) => {
            const isSelected = selectedDay === d.date;
            return (
              <button
                key={d.date}
                onClick={() => setSelectedDay(d.date)}
                className={`py-1.5 px-1 rounded-lg transition-all duration-200 cursor-pointer flex flex-col items-center justify-center ${
                  isSelected
                    ? 'bg-[#111111] text-[#F7F5EF] shadow-xs'
                    : 'bg-[#F7F5EF]/60 hover:bg-[#E5D9BC]/40 text-[#685C43]'
                }`}
              >
                <span className="text-[9px] font-mono uppercase tracking-wider block opacity-70">
                  {d.day}
                </span>
                <span className={`font-display text-sm font-semibold block mt-0.5 ${isSelected ? 'text-white' : 'text-[#111111]'}`}>
                  {d.date}
                </span>
                {d.events && (
                  <span
                    className={`w-1 h-1 rounded-full mt-0.5 ${
                      isSelected ? 'bg-[#C8A13A]' : 'bg-[#8E722A]'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Operational Schedule Item List */}
        <div className="space-y-2 pt-1">
          <span className="font-mono text-[9px] font-bold text-[#8E722A] uppercase tracking-wider block mb-1">
            MILESTONES & DEADLINES
          </span>

          {upcomingAlerts.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className="p-2.5 bg-[#FAF8F3] hover:bg-[#F7F5EF] rounded-lg border border-[#0A0A0A]/06 flex items-center justify-between group transition-all no-underline block"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-[#E5D9BC]/50 text-[#8E722A] shrink-0">
                  {item.type === 'expiry' && <Clock className="w-3.5 h-3.5" />}
                  {item.type === 'payment' && <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />}
                  {item.type === 'task' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-[#111111] group-hover:text-[#8E722A] transition-colors font-body leading-tight">
                    {item.title}
                  </h4>
                  <span className="text-[9px] font-mono text-[#685C43] block mt-0.5">
                    {item.date}
                  </span>
                </div>
              </div>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-white border border-[#0A0A0A]/10 text-[#221C11] shrink-0">
                {item.badge}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Panel: Retainer Retention & Progress Ring Gauge */}
      <div className="bg-white rounded-xl border border-[#0A0A0A]/08 p-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-mono text-[9px] font-bold text-[#8E722A] uppercase tracking-wider block">
              TARGET PERFORMANCE
            </span>
            <h3 className="font-display text-base font-normal text-[#111111] mt-0.5">
              Client Retainer Rate
            </h3>
            <span className="text-[11px] text-emerald-700 font-mono font-bold mt-0.5 inline-flex items-center gap-1">
              ↗ +2.4% vs last quarter
            </span>
          </div>

          {/* Radial SVG Gauge Ring */}
          <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#E5D9BC]/50"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#8E722A] transition-all duration-1000 ease-out"
                strokeDasharray="88, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute font-display text-sm font-bold text-[#111111]">
              88%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
