
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  Gift,
  LogOut,
  User
} from 'lucide-react';
import WizLogo from '@/components/WizLogo';
import XLogo from '@/components/XLogo';
import { toast } from 'sonner';

interface SidebarProps {
  isMobile?: boolean;
  activeView: string;
  onNavigate: (view: string) => void;
}

export function Sidebar({ isMobile = false, activeView, onNavigate }: SidebarProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    }
  };
  
  const handleCallWiz = () => {
    navigate('/call/chat');
  };
  
  const handleXClick = () => {
    window.open('https://twitter.com/wizcoachapp', '_blank');
  };
  
  const navigationItems = [
    {
      id: 'profile',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      action: () => onNavigate('profile')
    },
    {
      id: 'chat',
      label: 'Wiz Chat',
      icon: <MessageSquare className="w-5 h-5" />,
      action: () => onNavigate('chat')
    },
    {
      id: 'rewards',
      label: 'Rewards',
      icon: <Gift className="w-5 h-5" />,
      action: () => onNavigate('rewards')
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      action: () => onNavigate('settings')
    },
  ];
  
  const bottomItems = [
    {
      id: 'twitter',
      label: 'X',
      icon: <XLogo className="w-5 h-5" />,
      action: handleXClick
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: <LogOut className="w-5 h-5" />,
      action: handleLogout
    },
  ];
  
  if (isMobile) {
    return (
      <div className="flex justify-around items-center px-4 py-2">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={item.action}
            className={`flex flex-col items-center justify-center px-2 py-1 rounded-lg ${
              activeView === item.id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.icon}
            <span className="text-[10px] mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full px-4 py-6">
      <div className="flex items-center gap-3 px-3 mb-8">
        <div className="bg-gradient-to-tr from-purple-600 to-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-md">
          <WizLogo className="text-white w-5 h-5" />
        </div>
        <span className="font-semibold tracking-tight text-lg">
          WIZ
        </span>
      </div>
      
      <div className="flex-1">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={item.action}
              className={`flex w-full items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                activeView === item.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
        
        {/* Call Wiz button - prominent in sidebar */}
        <div className="mt-6 px-3">
          <button
            onClick={handleCallWiz}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Call Wiz</span>
          </button>
        </div>
      </div>
      
      {/* Bottom items including logout - now at the bottom */}
      <div className="space-y-1 mt-auto">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            onClick={item.action}
            className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
