import React from 'react';
import {
  LayoutDashboard,
  FileSpreadsheet,
  HelpCircle,
  FileUp,
  Users,
  Layers,
  Sliders,
  LogOut,
} from 'lucide-react';

export type AdminNavTab =
  | 'dashboard'
  | 'exams'
  | 'questions'
  | 'import-questions'
  | 'students'
  | 'batches'
  | 'settings';

interface AdminSidebarProps {
  currentTab: AdminNavTab;
  onSelectTab: (tab: AdminNavTab) => void;
  onLogout: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  onLogout,
}) => {
  const navItems: { id: AdminNavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'exams', label: 'Exams', icon: FileSpreadsheet },
    { id: 'questions', label: 'Questions', icon: HelpCircle },
    { id: 'import-questions', label: 'Import Questions', icon: FileUp },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'batches', label: 'Batches', icon: Layers },
    { id: 'settings', label: 'Settings', icon: Sliders },
  ];

  return (
    <aside className="w-full lg:w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-8rem)] flex flex-col justify-between p-4">
      <div className="space-y-6">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2 font-english">
            Admin Panel
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
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left font-english cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 font-english space-y-1">
          <p className="font-semibold">Negative Marking Rule</p>
          <p className="text-[11px] text-amber-800">
            0.5 per wrong MCQ enforced automatically across all evaluations.
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
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
