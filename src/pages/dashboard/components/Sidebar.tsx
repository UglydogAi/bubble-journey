
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
              activeView === item.view && "bg-accent text-accent-foreground"
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
    <div className="w-64 md:w-72 h-full bg-sidebar-background/50 backdrop-blur-xl 
      border-r border-sidebar-border overflow-y-auto">
      <nav className="space-y-2 p-4">
        {navigationItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-sidebar-foreground/70 h-12",
              "hover:text-sidebar-foreground hover:bg-sidebar-accent",
              "transition-colors duration-300",
              activeView === item.view && "bg-accent text-accent-foreground"
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
