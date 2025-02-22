
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
    <div className="w-64 h-full bg-sidebar-background/50 backdrop-blur-xl border-r border-sidebar-border overflow-y-auto">
      <div className="sticky top-0 bg-sidebar-background/50 backdrop-blur-xl z-10 p-4">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-sidebar-accent border border-sidebar-border">
          <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-sidebar-ring/30">
            <img 
              src="/lovable-uploads/ce8e10ec-31c6-4d22-8be9-25e4d50d8206.png"
              alt="Profile"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <p className="font-semibold text-sidebar-foreground">Legend</p>
            <p className="text-sm text-sidebar-foreground/70">Premium Member</p>
          </div>
        </div>
      </div>

      <nav className="space-y-2 p-4">
        {navigationItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-sidebar-foreground/70",
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
