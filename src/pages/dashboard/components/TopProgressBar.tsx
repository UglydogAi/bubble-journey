
import React, { useEffect, useState } from "react";
import { Sun, Moon, Coins, Dog } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Toggle } from "@/components/ui/toggle";
import { useTheme } from "next-themes";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

interface TopProgressBarProps {
  dailyProgress: number;
  ogPoints: number;
}

export function TopProgressBar({ dailyProgress, ogPoints }: TopProgressBarProps) {
  const { theme, setTheme } = useTheme();
  const [showMessage, setShowMessage] = useState(false);
  const [prevProgress, setPrevProgress] = useState(dailyProgress);

  useEffect(() => {
    if (dailyProgress !== prevProgress) {
      const milestones = [25, 50, 75, 100];
      const hitMilestone = milestones.some(
        milestone => 
          dailyProgress >= milestone && 
          prevProgress < milestone
      );

      if (hitMilestone) {
        setShowMessage(true);
        confetti({
          particleCount: dailyProgress === 100 ? 150 : 50,
          spread: 70,
          colors: ['#8A2BE2', '#FF7043'],
          origin: { y: 0.3 }
        });

        setTimeout(() => setShowMessage(false), 3000);
      }

      setPrevProgress(dailyProgress);
    }
  }, [dailyProgress, prevProgress]);

  return (
    <div className="fixed top-0 right-0 w-full md:w-[82%] z-50">
      <div className="container mx-auto">
        <div className="h-[4.5rem] flex items-center justify-between px-4 md:px-8 py-4 
          bg-background/95 backdrop-blur-xl border-b border-border/30">
          {/* Left Section: Profile Picture */}
          <div className="shrink-0">
            <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-primary/20
              hover:ring-primary/40 transition-all duration-300">
              <img 
                src="/lovable-uploads/ce8e10ec-31c6-4d22-8be9-25e4d50d8206.png"
                alt="Profile"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Center Section: Progress Bar */}
          <div className="flex-1 max-w-[800px] mx-auto px-16">
            <div className="relative h-4">
              <Progress 
                value={dailyProgress} 
                className="h-full relative overflow-visible
                  before:absolute before:inset-0 before:bg-gradient-to-r 
                  before:from-primary/5 before:to-orange-500/5"
              />
              
              {/* UGLYDOG Character */}
              <div 
                className="absolute top-1/2 -translate-y-1/2"
                style={{ 
                  left: `${Math.min(Math.max(dailyProgress, 0), 100)}%`,
                  transform: `translateX(-50%) translateY(-50%)` 
                }}
              >
                <div className="relative">
                  {showMessage && (
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
                      bg-primary/90 text-white text-xs px-3 py-1.5 rounded-full
                      whitespace-nowrap animate-fade-in
                      before:absolute before:top-full before:left-1/2 
                      before:-translate-x-1/2 before:border-4 
                      before:border-transparent before:border-t-primary/90">
                      Woof! 🐾
                    </div>
                  )}
                  <div className={cn(
                    "w-6 h-6 bg-primary rounded-full",
                    "shadow-[0_0_15px_rgba(138,43,226,0.5)]",
                    "flex items-center justify-center",
                    "transition-all duration-300",
                    "animate-bounce"
                  )}>
                    <Dog 
                      className="w-3.5 h-3.5 text-white transform -scale-x-100" 
                      strokeWidth={2.5}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section: Points and Theme Toggle */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Points Display */}
            <div className="flex items-center gap-2 bg-primary/10 px-4 
              py-2 rounded-full border border-primary/20
              shadow-sm shadow-primary/10">
              <Coins className="w-4 h-4 text-primary animate-pulse" />
              <span className="font-medium text-sm">{ogPoints}</span>
            </div>

            {/* Theme Toggle */}
            <Toggle
              pressed={theme === "dark"}
              onPressedChange={(pressed) => setTheme(pressed ? "dark" : "light")}
              className="w-10 h-10 rounded-full bg-muted/50 hover:bg-muted/80 
                transition-colors duration-300"
            >
              {theme === "dark" ? (
                <Moon className="w-5 h-5 text-primary" />
              ) : (
                <Sun className="w-5 h-5 text-primary" />
              )}
            </Toggle>
          </div>
        </div>
      </div>
    </div>
  );
}
