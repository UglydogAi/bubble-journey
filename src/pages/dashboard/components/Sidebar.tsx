
import React from "react";
import { UserRound, Settings, CreditCard, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import XLogo from "@/components/XLogo";

interface SidebarProps {
  isMobile?: boolean;
  activeView: string;
  onNavigate: (view: string) => void;
}

export function Sidebar({ isMobile = false, activeView, onNavigate }: SidebarProps) {
  const navigationItems = [
    { icon: <UserRound />, label: "Profile", view: "profile" },
    { icon: <Settings />, label: "Settings", view: "settings" },
    { icon: <CreditCard />, label: "Purchase", view: "purchase" },
    { icon: <Users />, label: "Community", view: "community" }
  ];

  const socialIcons = [
    { 
      icon: <BookOpen className="w-[18px] h-[18px]" />,
      label: "Docs", 
      url: "https://docs.uglydog.ai"
    },
    { 
      icon: <XLogo className="w-[18px] h-[18px]" />,
      label: "X", 
      url: "https://x.com/uglydogai" 
    }
  ];

  if (isMobile) {
    return (
      <div className="flex justify-around items-center p-2 backdrop-blur-xl">
        {navigationItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            size="lg"
            className={cn(
              "flex-col gap-1 h-16 px-2 transition-colors duration-300",
              activeView === item.view && "bg-[#8A2BE2] text-white"
            )}
            onClick={() => onNavigate(item.view)}
          >
            {item.icon}
            <span className="text-xs font-medium">{item.label}</span>
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-between bg-sidebar-background/50 backdrop-blur-xl 
      border-r border-sidebar-border">
      <nav className="space-y-1.5 p-2.5">
        {navigationItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-sidebar-foreground/70",
              "hover:text-white hover:bg-[#8A2BE2]/90",
              "transition-colors duration-300 px-2.5 py-2.5",
              activeView === item.view && "bg-[#8A2BE2] text-white"
            )}
            onClick={() => onNavigate(item.view)}
          >
            {item.icon}
            {item.label}
          </Button>
        ))}
      </nav>
      
      {/* Social Icons at Bottom */}
      <div className="p-2.5 border-t border-sidebar-border/30 mt-auto">
        <div className="flex items-center justify-around">
          {socialIcons.map((item) => (
            <a 
              key={item.label}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-2 rounded-full transition-all duration-300 
                hover:bg-[#8A2BE2]/10 focus:outline-none"
              aria-label={item.label}
            >
              <div className="text-sidebar-foreground/50 group-hover:text-[#8A2BE2] 
                transition-all duration-300 transform group-hover:scale-110
                group-hover:drop-shadow-[0_0_8px_rgba(138,43,226,0.7)]">
                {item.icon}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
