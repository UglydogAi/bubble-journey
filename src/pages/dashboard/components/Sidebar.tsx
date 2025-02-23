
import React from "react";
import { UserRound, Settings, CreditCard, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    <div className="h-full bg-sidebar-background/50 backdrop-blur-xl 
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
    </div>
  );
}

