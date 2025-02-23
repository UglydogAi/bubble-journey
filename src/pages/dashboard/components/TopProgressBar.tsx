
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

  const getMilestoneMessage = (progress: number) => {
    if (progress === 100) return "YOU'RE ABSOLUTELY PAWSOME! 🌟";
    if (progress >= 75) return "ALMOST THERE, KEEP FETCHING! 🦴";
    if (progress >= 50) return "HALFWAY TO GREATNESS! 🐾";
    if (progress >= 25) return "GREAT START, LEGEND! 🐕";
    return "LET'S BEGIN OUR JOURNEY! 🐾";
  };

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
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto">
        <div className="flex items-center gap-4 px-4 py-3 bg-background/80 backdrop-blur-xl border-b border-border">
          {/* Profile Picture */}
          <div className="hidden md:block">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary/20">
              <img 
                src="/lovable-uploads/ce8e10ec-31c6-4d22-8be9-25e4d50d8206.png"
                alt="Profile"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Progress Bar Container */}
          <div className="flex-1 max-w-2xl">
            <div className="space-y-0.5">
              <div className="flex items-center justify-between text-xs">
                <p className="font-medium text-foreground/80">
                  {dailyProgress}% Complete
                </p>
                <p className="text-orange-400/90 font-medium animate-fade-in hidden md:block">
                  {getMilestoneMessage(dailyProgress)}
                </p>
              </div>

              <div className="relative h-4 rounded-full overflow-visible">
                <Progress 
                  value={dailyProgress} 
                  className="h-full relative overflow-visible"
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
                        bg-primary/80 text-white text-xs px-2 py-1 rounded
                        whitespace-nowrap animate-fade-in
                        before:absolute before:top-full before:left-1/2 
                        before:-translate-x-1/2 before:border-4 
                        before:border-transparent before:border-t-primary/80">
                        Woof! 🐾
                      </div>
                    )}
                    <div className={cn(
                      "w-5 h-5 bg-primary rounded-full",
                      "shadow-[0_0_10px_rgba(138,43,226,0.4)]",
                      "flex items-center justify-center",
                      "transition-all duration-300",
                      "animate-bounce"
                    )}>
                      <Dog 
                        className="w-3 h-3 text-white transform -scale-x-100" 
                        strokeWidth={2.5}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Message */}
            <p className="text-orange-400/90 font-medium text-xs mt-1.5 text-center md:hidden">
              {getMilestoneMessage(dailyProgress)}
            </p>
          </div>

          {/* Theme Toggle and Points */}
          <div className="flex items-center gap-3">
            <Toggle
              pressed={theme === "dark"}
              onPressedChange={(pressed) => setTheme(pressed ? "dark" : "light")}
              className="w-8 h-8 rounded-full bg-muted/50 hover:bg-muted/80 
                transition-colors duration-300"
            >
              {theme === "dark" ? (
                <Moon className="w-4 h-4 text-primary" />
              ) : (
                <Sun className="w-4 h-4 text-primary" />
              )}
            </Toggle>
            <div className="flex items-center gap-1.5 bg-primary/5 px-3 
              py-1.5 rounded-full">
              <Coins className="w-4 h-4 text-primary animate-pulse" />
              <span className="font-medium text-sm">{ogPoints}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
