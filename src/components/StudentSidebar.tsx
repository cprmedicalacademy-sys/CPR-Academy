import React from 'react';
import {
  LayoutDashboard,
  FileCheck2,
  UserCircle2,
  LogOut,
  CheckCircle2,
} from 'lucide-react';

export type StudentNavTab = 'dashboard' | 'available-exams' | 'profile';

interface StudentSidebarProps {
  currentTab: StudentNavTab;
  onSelectTab: (tab: StudentNavTab) => void;
  onLogout: () => void;
  availableExamsCount?: number;
}

export const StudentSidebar: React.FC<StudentSidebarProps> = ({
  currentTab,
  onSelectTab,
  onLogout,
  availableExamsCount = 0,
}) => {
  const navItems: {
    id: StudentNavTab;
    labelEn: string;
    labelBn: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }[] = [
    {
      id: 'dashboard',
      labelEn: 'Dashboard',
      labelBn: 'ড্যাশবোর্ড',
      icon: LayoutDashboard,
    },
    {
      id: 'available-exams',
      labelEn: 'Available Exams',
      labelBn: 'উপলব্ধ পরীক্ষা',
      icon: FileCheck2,
      badge: availableExamsCount,
    },
    {
      id: 'profile',
      labelEn: 'Profile',
      labelBn: 'প্রোফাইল',
      icon: UserCircle2,
    },
  ];

  return (
    <aside className="w-full lg:w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-8rem)] flex flex-col justify-between p-4">
      <div className="space-y-6">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2 font-english">
            Student Portal
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors text-left cursor-pointer ${
                    isActive
                      ? 'bg-sky-50 text-sky-800 font-semibold border-l-4 border-sky-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-sky-700' : 'text-slate-400'}`} />
                    <div>
                      <span className="block font-english leading-tight">{item.labelEn}</span>
                      <span className="block text-[11px] text-slate-500 font-bangla leading-tight">{item.labelBn}</span>
                    </div>
                  </div>
                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 tabular-nums">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick academic guidelines badge */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800 font-english">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Evaluation Notice</span>
          </div>
          <p className="font-bangla text-slate-600 text-[11px] leading-relaxed">
            নেগেটিভ মার্কিং: প্রতিটি ভুল উত্তরের জন্য ০.৫ নম্বর কাটা যাবে। উত্তর না দিলে ০ নম্বর।
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-600 hover:text-red-700 hover:bg-red-50 transition-colors text-left font-english cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Logout (লগআউট)</span>
        </button>
      </div>
    </aside>
  );
};
