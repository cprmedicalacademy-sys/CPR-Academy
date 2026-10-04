import React from 'react';
import { CprLogo } from './CprLogo';
import { MapPin, Phone, Building2 } from 'lucide-react';

export const TopHeaderBar: React.FC = () => {
  return (
    <div className="w-full bg-[#f0f4f9] border-b border-slate-200/90 py-3.5 px-4 sm:px-6 lg:px-8 select-none text-slate-800 font-english">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Block: Direct Calling & WhatsApp */}
        <div className="flex items-center gap-3 shrink-0 order-2 md:order-1">
          <div className="w-11 h-11 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md shrink-0 ring-4 ring-red-100">
            <Phone className="w-5 h-5 fill-current" />
          </div>
          <div className="text-left font-mono font-bold leading-tight text-slate-950">
            <div className="flex items-center gap-1.5 text-sm sm:text-base tracking-tight">
              <a
                href="tel:01898938981"
                className="hover:text-red-700 transition-colors"
                title="Call 01898-938981"
              >
                01898-938981
              </a>
              <a
                href="https://wa.me/8801898938981"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-sans font-semibold rounded-xs border border-emerald-300 hover:bg-emerald-200 transition-colors shadow-2xs"
                title="Chat on WhatsApp"
              >
                <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                </svg>
                <span>WhatsApp</span>
              </a>
            </div>
            <div className="text-sm sm:text-base tracking-tight text-slate-800">
              <a
                href="tel:01898938982"
                className="hover:text-red-700 transition-colors"
                title="Call 01898-938982"
              >
                01898-938982
              </a>
            </div>
          </div>
        </div>

        {/* Center: CPR Medical Academy Official Logo */}
        <div className="shrink-0 flex items-center justify-center order-1 md:order-2">
          <CprLogo size="md" />
        </div>

        {/* Right Block: Detailed Campus Location & Address */}
        <div className="flex items-center gap-3 shrink-0 text-left order-3">
          <div className="w-11 h-11 rounded-full bg-white text-red-600 border border-red-200 flex items-center justify-center shadow-md shrink-0 ring-4 ring-red-50">
            <MapPin className="w-5 h-5 fill-red-600 text-white" />
          </div>
          <div className="font-bangla leading-snug text-slate-900">
            <p className="font-bold text-sm sm:text-base text-slate-950 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-red-600 shrink-0 inline" />
              <span>মতি টাওয়ার (৫ম তলা)</span>
            </p>
            <p className="text-xs sm:text-sm font-semibold text-slate-800">
              গুলজার মোড়, চকবাজার, চট্টগ্রাম
            </p>
            <p className="text-[11px] text-slate-600 font-medium">
              EBL ব্যাংকের ATM বুথের ডান পাশে লিফটের ৪ তলা
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
