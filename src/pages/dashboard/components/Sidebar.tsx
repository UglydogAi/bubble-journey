
import React, { useState } from "react";
import { UserRound, Settings, CreditCard, MessageSquare, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import XLogo from "@/components/XLogo";
import DocsIcon from "@/components/DocsIcon";
import DiscordIcon from "@/components/DiscordIcon";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  isMobile?: boolean;
  activeView: string;
  onNavigate: (view: string) => void;
}

export function Sidebar({ isMobile = false, activeView, onNavigate }: SidebarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { icon: <UserRound />, label: "Profile", view: "profile" },
    { icon: <MessageSquare />, label: "Chat", view: "chat" },
    { icon: <Award />, label: "Rewards", view: "rewards" },
    { icon: <Settings />, label: "Settings", view: "settings" },
    { icon: <CreditCard />, label: "Purchase", view: "purchase" }
  ];

  const socialItems = [
    { 
      icon: <DocsIcon className="h-4 w-4" />, 
      label: "Docs", 
      url: "https://uglydog-1.gitbook.io/uglydog/" 
    },
    { 
      icon: <DiscordIcon className="h-4 w-4" />, 
      label: "Discord", 
      url: "https://discord.gg/uglydogai" 
    },
    { 
      icon: <XLogo className="h-4 w-4" />, 
      label: "Twitter", 
      url: "https://x.com/uglydogai" 
    }
  ];

  // Mobile sidebar menu
  const MobileSidebar = () => (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        >
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 20 }}
            className="w-[250px] h-full bg-background/95 border-r border-border/30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              {/* Main Navigation */}
              <nav className="space-y-1.5 p-4 mt-14">
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
                    onClick={() => {
                      onNavigate(item.view);
                      setIsMenuOpen(false);
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </Button>
                ))}
              </nav>
              
              {/* Social Links (Bottom) */}
              <nav className="mt-auto p-4 border-t border-sidebar-border/30">
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (isMobile) {
    return (
      <div className="grid grid-cols-5 items-center p-2 backdrop-blur-xl w-full">
        {navigationItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            size="icon"
            className={cn(
              "flex flex-col items-center justify-center gap-1 h-16 w-full px-1",
              "transition-colors duration-300",
              activeView === item.view && "bg-[#8A2BE2] text-white"
            )}
            onClick={() => onNavigate(item.view)}
          >
            {item.icon}
            <span className="text-[10px] font-medium">{item.label}</span>
          </Button>
        ))}
      </div>
    );
  }

  return (
    <>
      <MobileSidebar />
      
      <div className="h-full flex flex-col justify-between bg-sidebar-background/50 backdrop-blur-xl 
        border-r border-sidebar-border hidden md:flex">
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
                <span className="ml-0.5">{item.label}</span>
              </a>
            </Button>
          ))}
        </nav>
      </div>
    </>
  );
}
