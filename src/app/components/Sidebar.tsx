import { LayoutDashboard, Users, MessageSquare, BarChart3, LogOut } from 'lucide-react';

type Section = 'dashboard' | 'insights' | 'responses' | 'analytics';

interface SidebarProps {
  currentSection: Section;
  onSectionChange: (section: Section) => void;
  onLogout: () => void;
  urgentCount: number;
  businessName: string;
}

export function Sidebar({ currentSection, onSectionChange, onLogout, urgentCount, businessName }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard' as Section, icon: LayoutDashboard, label: 'Review Dashboard' },
    { id: 'insights' as Section, icon: Users, label: 'Customer Insights' },
    { id: 'responses' as Section, icon: MessageSquare, label: 'Review Responses', badge: urgentCount },
    { id: 'analytics' as Section, icon: BarChart3, label: 'Analytics' }
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col h-screen">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-semibold">Review Tracker KZ</h1>
        <p className="text-sm text-slate-400 mt-1">{businessName}</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Выйти</span>
        </button>
      </div>
    </div>
  );
}
