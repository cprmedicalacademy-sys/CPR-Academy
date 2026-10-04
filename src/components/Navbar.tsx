import React from 'react';
import { Profile, AcademySettings } from '../types';
import { LogOut, User, ShieldCheck, BookOpen, Menu } from 'lucide-react';
import { CprLogo } from './CprLogo';

interface NavbarProps {
  currentUser: Profile | null;
  settings: AcademySettings;
  onLogout: () => void;
  onOpenAuth: (mode: 'student-login' | 'admin-login') => void;
  onToggleMobileMenu?: () => void;
  onNavigateHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  settings,
  onLogout,
  onOpenAuth,
  onToggleMobileMenu,
  onNavigateHome,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            {currentUser && onToggleMobileMenu && (
              <button
                type="button"
                onClick={onToggleMobileMenu}
                className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                aria-label="Toggle navigation"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <button
              type="button"
              onClick={onNavigateHome}
              className="text-left flex items-center gap-2.5 group cursor-pointer"
            >
              <CprLogo size={38} className="shrink-0" />
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 group-hover:text-sky-700 transition-colors uppercase font-english">
                  {settings.academyName}
                </span>
                <span className="text-[11px] sm:text-xs font-semibold text-sky-800 tracking-wider font-english">
                  ONLINE EXAMINATION PORTAL
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation / Status info */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 font-english">
            <span className="text-sm text-slate-900 font-bangla font-bold tracking-normal bg-sky-50 px-3 py-1 rounded-md border border-sky-200">
              বিসিএস অনলাইন পরীক্ষা সিরিজ
            </span>
          </div>

          {/* Zone 3: Primary actions / User session */}
          <div className="flex items-center gap-2 sm:gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-xs font-english">
                  {currentUser.role === 'admin' ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <User className="w-4 h-4 text-sky-600 shrink-0" />
                  )}
                  <div className="text-left">
                    <p className="font-semibold text-slate-900 leading-tight truncate max-w-[120px] sm:max-w-[160px]">
                      {currentUser.fullName}
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                      {currentUser.role === 'admin' ? 'ADMINISTRATOR' : currentUser.studentId}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-red-700 hover:bg-red-50 border border-slate-200 rounded-md transition-colors font-english whitespace-nowrap cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => onOpenAuth('student-login')}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-sky-700 hover:bg-sky-800 rounded-md transition-colors font-english whitespace-nowrap cursor-pointer shadow-xs uppercase tracking-wider"
                >
                  Student Login
                </button>

                <button
                  type="button"
                  onClick={() => onOpenAuth('admin-login')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors font-english whitespace-nowrap cursor-pointer"
                  title="Academy Staff Portal"
                >
                  Admin Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
