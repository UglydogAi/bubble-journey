
import React, { useEffect, useState } from "react";
import { Sun, Moon, Coins } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Toggle } from "@/components/ui/toggle";
import { useTheme } from "next-themes";
import confetti from "canvas-confetti";

interface TopProgressBarProps {
  dailyProgress: number;
  ogPoints: number;
}

export function TopProgressBar({ dailyProgress, ogPoints }: TopProgressBarProps) {
  const { theme, setTheme } = useTheme();
  const [showMessage, setShowMessage] = useState(false);

  // Milestone messages from UGLYDOG
  const getMilestoneMessage = (progress: number) => {
    if (progress === 100) return "WOOF! You're Amazing! 🎉";
    if (progress >= 75) return "Almost There, Champ! 🐾";
    if (progress >= 50) return "Halfway, Keep Going! 🦴";
    if (progress >= 25) return "Great Start, Legend! 🐕";
    return "Let's Get Started! 🐾";
  };

  // Trigger confetti at 100%
  useEffect(() => {
    if (dailyProgress === 100) {
      const colors = ['#8B5CF6', '#FF7043'];
      confetti({
        particleCount: 100,
        spread: 70,
        colors,
        origin: { y: 0.3 }
      });
    }
  }, [dailyProgress]);

  // Show message with animation
  useEffect(() => {
    setShowMessage(true);
    const timer = setTimeout(() => setShowMessage(false), 3000);
    return () => clearTimeout(timer);
  }, [dailyProgress]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4 py-2">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
          <div className="w-full sm:flex-1 sm:max-w-2xl relative">
            {/* Progress Bar Container */}
            <div className="relative">
              <Progress 
                value={dailyProgress} 
                className="h-3 sm:h-4 relative overflow-visible
                  before:absolute before:inset-0 before:bg-gradient-to-r 
                  before:from-primary/20 before:to-orange-500/20 
                  before:animate-pulse before:rounded-full"
              />
              
              {/* UGLYDOG Character - Moves with progress */}
              <div 
                className="absolute top-1/2 -translate-y-1/2"
                style={{ 
                  left: `${Math.min(Math.max(dailyProgress, 0), 100)}%`,
                  transform: `translateX(-50%) translateY(-50%)` 
                }}
              >
                <div className="relative">
                  {/* Speech Bubble */}
                  {showMessage && (
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-primary/90 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap animate-fade-in">
                      Woof! 🐾
                    </div>
                  )}
                  {/* Dog Icon */}
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full shadow-glow flex items-center justify-center
                    animate-bounce transition-transform duration-300">
                    🐕
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Text and Message */}
            <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm">
              <p className="font-semibold text-center sm:text-left">
                {dailyProgress}% Complete
              </p>
              <p className="text-orange-400 animate-fade-in text-center sm:text-left">
                {getMilestoneMessage(dailyProgress)}
              </p>
            </div>
          </div>

          {/* Theme Toggle and Points */}
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <Toggle
              pressed={theme === "dark"}
              onPressedChange={(pressed) => setTheme(pressed ? "dark" : "light")}
              className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors duration-300"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-primary" />
              ) : (
                <Moon className="w-5 h-5 text-primary" />
              )}
            </Toggle>
            <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-full">
              <Coins className="w-5 h-5 text-primary animate-pulse" />
              <span className="font-bold">{ogPoints}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
