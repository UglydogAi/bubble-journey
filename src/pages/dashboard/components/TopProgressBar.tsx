
import React, { useEffect, useState } from "react";
import { Sun, Moon, Coins } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Toggle } from "@/components/ui/toggle";
import { useTheme } from "next-themes";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface TopProgressBarProps {
  dailyProgress: number;
  ogPoints: number;
}

export function TopProgressBar({ dailyProgress, ogPoints }: TopProgressBarProps) {
  const { theme, setTheme } = useTheme();
  const [showMessage, setShowMessage] = useState(false);
  const [prevProgress, setPrevProgress] = useState(dailyProgress);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [calculatedProgress, setCalculatedProgress] = useState(dailyProgress);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // This prevents hydration errors with next-themes
    setMounted(true);
  }, []);

  useEffect(() => {
    // Load profile image from localStorage
    const savedImage = localStorage.getItem('wizProfileImage');
    if (savedImage) {
      setProfileImage(savedImage);
    }

    // Calculate progress based on action plan completion
    try {
      const actionPlan = localStorage.getItem('wizActionPlan');
      if (actionPlan) {
        const plan = JSON.parse(actionPlan);
        
        // Count total and completed tasks
        let totalTasks = 0;
        let completedTasks = 0;
        
        if (plan.weeklyPlan) {
          Object.values(plan.weeklyPlan).forEach((dayTasks: any[]) => {
            dayTasks.forEach(task => {
              totalTasks++;
              if (task.completed) completedTasks++;
            });
          });
        }
        
        // Update progress
        if (totalTasks > 0) {
          const progress = Math.round((completedTasks / totalTasks) * 100);
          setCalculatedProgress(progress);
        }
      }
    } catch (error) {
      console.error("Error calculating progress:", error);
    }
  }, []);

  useEffect(() => {
    if (calculatedProgress !== prevProgress) {
      const milestones = [25, 50, 75, 100];
      const hitMilestone = milestones.some(
        milestone => 
          calculatedProgress >= milestone && 
          prevProgress < milestone
      );

      if (hitMilestone) {
        setShowMessage(true);
        confetti({
          particleCount: calculatedProgress === 100 ? 150 : 50,
          spread: 70,
          colors: ['#8A2BE2', '#FF7043'],
          origin: { y: 0.3 }
        });

        setTimeout(() => setShowMessage(false), 3000);
      }

      setPrevProgress(calculatedProgress);
    }
  }, [calculatedProgress, prevProgress]);

  // Listen for profile image changes from settings
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'wizProfileImage') {
        setProfileImage(e.newValue);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check for changes within the same window
    const checkProfileImage = () => {
      const currentImage = localStorage.getItem('wizProfileImage');
      if (currentImage !== profileImage) {
        setProfileImage(currentImage);
      }
    };
    
    const interval = setInterval(checkProfileImage, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [profileImage]);

  const handleThemeChange = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  if (!mounted) {
    // Render a placeholder until the theme is available to prevent hydration mismatch
    return <div className="h-[4rem] md:h-[4.5rem]"></div>;
  }

  return (
    <div className="sticky top-0 w-full z-50">
      <div className="container mx-auto px-0">
        <div className="h-[4rem] md:h-[4.5rem] flex items-center 
          bg-background/95 backdrop-blur-xl border-b border-border/30">
          
          {/* Left Section: Container that holds profile picture */}
          <div className="px-4 md:px-6 flex-shrink-0 border-r border-border/10 h-full flex items-center justify-center">
            <Avatar className="w-9 h-9 md:w-10 md:h-10 ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-300">
              {profileImage ? (
                <AvatarImage 
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <AvatarImage 
                  src="/lovable-uploads/db35f051-e13b-4656-92f1-843b07d7584b.png"
                  alt="Wiz Panda"
                  className="w-full h-full object-cover"
                />
              )}
              <AvatarFallback>WP</AvatarFallback>
            </Avatar>
          </div>

          {/* Middle Section: Progress Bar (contained in the right panel) */}
          <div className="flex-1 px-4 md:px-6 flex items-center">
            <div className="w-full relative h-2.5 md:h-3">
              <Progress 
                value={calculatedProgress} 
                className="h-full relative"
              />
              
              {/* Character Avatar */}
              <div 
                className="absolute top-1/2"
                style={{ 
                  left: `${Math.min(Math.max(calculatedProgress, 0), 100)}%`,
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
                      Great job! 🐼
                    </div>
                  )}
                  <div className={cn(
                    "w-4 h-4 md:w-5 md:h-5 bg-primary rounded-full",
                    "shadow-[0_0_15px_rgba(138,43,226,0.5)]",
                    "flex items-center justify-center",
                    "transition-all duration-300",
                    "animate-bounce"
                  )}>
                    <Avatar 
                      className="w-full h-full"
                    >
                      {profileImage ? (
                        <AvatarImage 
                          src={profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <AvatarImage 
                          src="/lovable-uploads/db35f051-e13b-4656-92f1-843b07d7584b.png"
                          alt="Wiz Panda"
                          className="w-full h-full object-cover"
                        />
                      )}
                      <AvatarFallback className="w-full h-full text-[8px] text-white">WP</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </div>
            </div>
          </div>
            
          {/* Right Section: Points and Theme Toggle */}
          <div className="flex items-center gap-2 pr-4 md:pr-6 pl-2 md:pl-4 flex-shrink-0 border-l border-border/10 h-full">
            {/* Points Display */}
            <div className="flex items-center gap-1 bg-primary/10 px-2 py-1.5 
              rounded-full border border-primary/20 shadow-sm shadow-primary/10">
              <Coins className="w-3 h-3 text-primary animate-pulse" />
              <span className="font-medium text-xs">{ogPoints}</span>
            </div>

            {/* Theme Toggle */}
            <Toggle
              pressed={theme === "dark"}
              onPressedChange={handleThemeChange}
              className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-muted/50 hover:bg-muted/80 
                transition-colors duration-300"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Moon className="w-3.5 h-3.5 text-primary" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-primary" />
              )}
            </Toggle>
          </div>
        </div>
      </div>
    </div>
  );
}
