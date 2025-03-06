
import React from "react";
import { UserRound, Settings, CreditCard, MessageSquare, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import XLogo from "@/components/XLogo";
import DocsIcon from "@/components/DocsIcon";
import DiscordIcon from "@/components/DiscordIcon";

interface SidebarProps {
  isMobile?: boolean;
  activeView: string;
  onNavigate: (view: string) => void;
}

export function Sidebar({ isMobile = false, activeView, onNavigate }: SidebarProps) {
  const navigationItems = [
    { icon: <UserRound />, label: "Profile", view: "profile" },
    { icon: <MessageSquare />, label: "Chat", view: "chat" },
    { icon: <Award />, label: "Rewards", view: "rewards" },
    { icon: <Settings />, label: "Settings", view: "settings" },
    { icon: <CreditCard />, label: "Purchase", view: "purchase" }
  ];

  const socialItems = [
    { 
      icon: <DocsIcon />, 
      label: "Docs", 
      url: "https://docs.uglydog.ai" 
    },
    { 
      icon: <DiscordIcon />, 
      label: "Discord", 
      url: "https://discord.gg/uglydogai" 
    },
    { 
      icon: <XLogo />, 
      label: "Twitter", 
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
      {/* Main Navigation */}
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
      
      {/* Social Links (Bottom) */}
      <nav className="mt-auto p-2.5 border-t border-sidebar-border/30">
        {socialItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-sidebar-foreground/70",
              "hover:text-white hover:bg-[#8A2BE2]/90",
              "transition-colors duration-300 px-2.5 py-2.5 mt-1.5"
            )}
            asChild
          >
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              {item.icon}
              {item.label}
            </a>
          </Button>
        ))}
      </nav>
    </div>
  );
}
