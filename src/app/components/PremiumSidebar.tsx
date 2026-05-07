import { LayoutDashboard, Users, MessageSquare, TrendingUp, Settings } from 'lucide-react';

type Section = 'dashboard' | 'insights' | 'responses' | 'analytics';

interface PremiumSidebarProps {
  currentSection: Section;
  onSectionChange: (section: Section) => void;
  onLogout: () => void;
  urgentCount: number;
  businessName: string;
  userName: string;
}

export function PremiumSidebar({ 
  currentSection, 
  onSectionChange, 
  onLogout, 
  urgentCount, 
  businessName,
  userName 
}: PremiumSidebarProps) {
  const menuItems = [
    { id: 'dashboard' as Section, icon: LayoutDashboard, label: 'Главная аналитика' },
    { id: 'insights' as Section, icon: Users, label: 'Отзывы клиентов' },
    { id: 'responses' as Section, icon: MessageSquare, label: 'Ответы на отзывы', badge: urgentCount },
    { id: 'analytics' as Section, icon: TrendingUp, label: 'Аналитика трендов' }
  ];

  return (
    <div 
      className="w-72 text-white flex flex-col h-screen sticky top-0"
      style={{ background: 'linear-gradient(180deg, #1E3A8A 0%, #1E40AF 100%)' }}
    >
      {/* Logo Section */}
      <div className="px-6 py-8 border-b border-white/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">ReviewAI</h1>
          </div>
        </div>
        <p className="text-sm text-white/60 ml-[52px]">{businessName}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-white/10 text-white shadow-lg backdrop-blur-sm'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-6">
          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/5 hover:text-white transition-all"
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            <span className="flex-1 text-left text-sm font-medium">Настройки</span>
          </button>
        </div>
      </nav>

      {/* User Profile Section */}
      <div className="px-4 py-6 border-t border-white/10">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{userName}</p>
            <button
              onClick={onLogout}
              className="text-xs text-white/60 hover:text-white transition-colors"
            >
              Выйти
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
