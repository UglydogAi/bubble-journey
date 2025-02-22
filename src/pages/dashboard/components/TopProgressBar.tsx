
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

  // Milestone messages from UGLYDOG with emojis
  const getMilestoneMessage = (progress: number) => {
    if (progress === 100) return "YOU'RE ABSOLUTELY PAWSOME! 🌟";
    if (progress >= 75) return "ALMOST THERE, KEEP FETCHING! 🦴";
    if (progress >= 50) return "HALFWAY TO GREATNESS! 🐾";
    if (progress >= 25) return "GREAT START, LEGEND! 🐕";
    return "LET'S BEGIN OUR JOURNEY! 🐾";
  };

  // Trigger confetti and show message when hitting milestones
  useEffect(() => {
    if (dailyProgress !== prevProgress) {
      // Check for milestone achievements
      const milestones = [25, 50, 75, 100];
      const hitMilestone = milestones.some(
        milestone => 
          dailyProgress >= milestone && 
          prevProgress < milestone
      );

      if (hitMilestone) {
        setShowMessage(true);
        // Trigger confetti for milestones
        confetti({
          particleCount: dailyProgress === 100 ? 150 : 50,
          spread: 70,
          colors: ['#8B5CF6', '#FF7043'],
          origin: { y: 0.3 }
        });

        // Hide message after animation
        setTimeout(() => setShowMessage(false), 3000);
      }

      setPrevProgress(dailyProgress);
    }
  }, [dailyProgress, prevProgress]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:flex-1 relative">
            {/* Progress Bar Container */}
            <div 
              className="relative h-6 sm:h-8 rounded-full overflow-visible
                shadow-[0_0_20px_rgba(138,43,226,0.2)]"
            >
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
                  {/* Speech Bubble */}
                  {showMessage && (
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
                      bg-primary/90 text-white text-xs px-3 py-1.5 rounded-lg 
                      whitespace-nowrap animate-fade-in shadow-lg
                      before:absolute before:top-full before:left-1/2 
                      before:-translate-x-1/2 before:border-8 
                      before:border-transparent before:border-t-primary/90">
                      Woof! 🐾
                    </div>
                  )}
                  {/* Dog Icon Container */}
                  <div className={cn(
                    "w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-full",
                    "shadow-[0_0_15px_rgba(138,43,226,0.6)]",
                    "flex items-center justify-center",
                    "transition-all duration-300",
                    "animate-bounce"
                  )}>
                    <Dog 
                      className="w-5 h-5 sm:w-6 sm:h-6 text-white 
                        transform -scale-x-100" 
                      strokeWidth={2.5}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Text and Message */}
            <div className="mt-3 flex flex-col sm:flex-row sm:items-center 
              sm:justify-between text-sm gap-2">
              <p className="font-bold text-center sm:text-left text-lg">
                {dailyProgress}% Complete
              </p>
              <p className="text-orange-400 font-semibold animate-fade-in 
                text-center sm:text-left">
                {getMilestoneMessage(dailyProgress)}
              </p>
            </div>
          </div>

          {/* Theme Toggle and Points */}
          <div className="flex items-center gap-4">
            <Toggle
              pressed={theme === "dark"}
              onPressedChange={(pressed) => setTheme(pressed ? "dark" : "light")}
              className="p-2 rounded-full bg-muted hover:bg-muted/80 
                transition-colors duration-300"
            >
              {theme === "dark" ? (
                <Moon className="w-5 h-5 text-primary" />
              ) : (
                <Sun className="w-5 h-5 text-primary" />
              )}
            </Toggle>
            <div className="flex items-center gap-2 bg-primary/10 px-4 
              py-2 rounded-full shadow-lg">
              <Coins className="w-5 h-5 text-primary animate-pulse" />
              <span className="font-bold text-lg">{ogPoints}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
