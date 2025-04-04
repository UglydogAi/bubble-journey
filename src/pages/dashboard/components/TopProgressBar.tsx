
import React, { useEffect, useState } from "react";
import { Sun, Moon, Coins } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Toggle } from "@/components/ui/toggle";
import { useTheme } from "next-themes";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

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
  const [userPoints, setUserPoints] = useState(ogPoints);
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    // This prevents hydration errors with next-themes
    setMounted(true);
  }, []);

  useEffect(() => {
    // First try to load from user context for persistence
    if (user?.profileData?.profileImage) {
      setProfileImage(user.profileData.profileImage);
    } else {
      // Fall back to localStorage if not in context
      const savedImage = localStorage.getItem('wizProfileImage');
      if (savedImage) {
        setProfileImage(savedImage);
      }
    }
    
    // Load points
    const savedPoints = localStorage.getItem('wizPoints');
    if (savedPoints) {
      setUserPoints(parseInt(savedPoints, 10));
    } else {
      // Initialize user points in localStorage if not set
      localStorage.setItem('wizPoints', String(ogPoints));
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
  }, [ogPoints, user]);

  // Award WIZ points when progress increases
  useEffect(() => {
    if (calculatedProgress > prevProgress) {
      const milestones = [25, 50, 75, 100];
      
      // Check if any milestone has been reached
      const reachedMilestone = milestones.find(
        milestone => 
          calculatedProgress >= milestone && 
          prevProgress < milestone
      );
      
      if (reachedMilestone) {
        // Award points based on milestone
        const pointsToAdd = reachedMilestone === 100 ? 500 : 100;
        const newPoints = userPoints + pointsToAdd;
        
        setUserPoints(newPoints);
        localStorage.setItem('wizPoints', String(newPoints));
        
        // Show celebration
        setShowMessage(true);
        confetti({
          particleCount: calculatedProgress === 100 ? 150 : 50,
          spread: 70,
          colors: ['#8A2BE2', '#FF7043'],
          origin: { y: 0.3 }
        });
        
        // Show toast notification
        toast({
          title: `Congratulations! 🎉`,
          description: `You've earned ${pointsToAdd} WIZ Points for reaching ${reachedMilestone}% progress.`,
          duration: 4000,
        });

        setTimeout(() => setShowMessage(false), 3000);
      } else if (calculatedProgress > prevProgress) {
        // Award smaller amounts for any progress increase
        const progressDiff = calculatedProgress - prevProgress;
        const pointsToAdd = Math.floor(progressDiff * 2); // 2 points per 1% progress
        
        if (pointsToAdd > 0) {
          const newPoints = userPoints + pointsToAdd;
          setUserPoints(newPoints);
          localStorage.setItem('wizPoints', String(newPoints));
          
          // Show toast for smaller point gains
          if (progressDiff >= 5) {
            toast({
              title: `Progress Reward!`,
              description: `You've earned ${pointsToAdd} WIZ Points for your continued progress.`,
              duration: 3000,
            });
          }
        }
      }

      setPrevProgress(calculatedProgress);
    }
  }, [calculatedProgress, prevProgress, userPoints, toast]);

  // Listen for profile image changes from settings
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'wizProfileImage') {
        setProfileImage(e.newValue);
      }
      if (e.key === 'wizPoints') {
        setUserPoints(parseInt(e.newValue || '0', 10));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check for changes within the same window
    const checkStorageChanges = () => {
      const currentImage = localStorage.getItem('wizProfileImage');
      const currentPoints = localStorage.getItem('wizPoints');
      
      if (currentImage !== profileImage) {
        setProfileImage(currentImage);
      }
      
      if (currentPoints && parseInt(currentPoints, 10) !== userPoints) {
        setUserPoints(parseInt(currentPoints, 10));
      }
    };
    
    const interval = setInterval(checkStorageChanges, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [profileImage, userPoints]);

  // Enhanced theme toggle with smooth transition
  const handleThemeChange = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    
    // Also save theme preference to user data if available
    if (user?.email) {
      const userDataKey = `wizUserData-${user.email}`;
      const existingData = JSON.parse(localStorage.getItem(userDataKey) || '{}');
      localStorage.setItem(userDataKey, JSON.stringify({
        ...existingData,
        theme: newTheme
      }));
    }
  };

  if (!mounted) {
    // Render a placeholder until the theme is available to prevent hydration mismatch
    return <div className="h-[4rem] md:h-[4.5rem]"></div>;
  }

  return (
    <div className="sticky top-0 w-full z-50">
      <div className="container mx-auto px-0">
        <div className="h-[4rem] md:h-[4.5rem] flex items-center 
          bg-background/95 backdrop-blur-xl border-b border-border/30 transition-colors duration-500">
          
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
              <AvatarFallback>
                {user?.email?.charAt(0).toUpperCase() || 'W'}
              </AvatarFallback>
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
              <motion.div 
                className="absolute top-1/2"
                style={{ 
                  left: `${Math.min(Math.max(calculatedProgress, 0), 100)}%`,
                }}
                initial={{ x: "-50%", y: "-50%" }}
                animate={{ 
                  x: "-50%", 
                  y: "-50%",
                  scale: showMessage ? 1.2 : 1 
                }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative">
                  {showMessage && (
                    <motion.div 
                      className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
                        bg-primary/90 text-primary-foreground text-xs px-3 py-1.5 rounded-full
                        whitespace-nowrap z-10
                        before:absolute before:top-full before:left-1/2 
                        before:-translate-x-1/2 before:border-4 
                        before:border-transparent before:border-t-primary/90"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      Great job! 🐼
                    </motion.div>
                  )}
                  <div className={cn(
                    "w-4 h-4 md:w-5 md:h-5 bg-primary rounded-full",
                    "shadow-[0_0_15px_rgba(138,43,226,0.5)]",
                    "flex items-center justify-center",
                    "transition-all duration-300",
                    showMessage ? "animate-bounce" : ""
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
                      <AvatarFallback className="w-full h-full text-[8px] text-white">
                        {user?.email?.charAt(0).toUpperCase() || 'W'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
            
          {/* Right Section: Points and Theme Toggle */}
          <div className="flex items-center gap-2 pr-4 md:pr-6 pl-2 md:pl-4 flex-shrink-0 border-l border-border/10 h-full">
            {/* Points Display */}
            <div className="flex items-center gap-1 bg-primary/10 px-2 py-1.5 
              rounded-full border border-primary/20 shadow-sm shadow-primary/10 transition-colors duration-300">
              <Coins className="w-3 h-3 text-primary animate-pulse" />
              <span className="font-medium text-xs">{userPoints}</span>
            </div>

            {/* Enhanced Theme Toggle with better animation */}
            <button
              onClick={handleThemeChange}
              className={cn(
                "w-7 h-7 md:w-8 md:h-8 rounded-full transition-all duration-500", 
                theme === "dark" 
                  ? "bg-slate-800 text-slate-200 hover:bg-slate-700 shadow-inner shadow-slate-900/50" 
                  : "bg-amber-100 text-amber-600 hover:bg-amber-200 shadow-sm shadow-amber-500/20"
              )}
              aria-label="Toggle theme"
            >
              <motion.div 
                initial={false}
                animate={{ rotateZ: theme === "dark" ? 180 : 0 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                className="h-full w-full flex items-center justify-center"
              >
                {theme === "dark" ? (
                  <Moon className="w-3.5 h-3.5" />
                ) : (
                  <Sun className="w-3.5 h-3.5" />
                )}
              </motion.div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
