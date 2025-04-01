
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TopProgressBar } from "./components/TopProgressBar";
import { Sidebar } from "./components/Sidebar";
import { SettingsView } from "./components/SettingsView";
import { ChatView } from "./components/ChatView";
import { RewardsView } from "./components/RewardsView";
import ActionPlan from "./components/ActionPlan";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [dailyProgress, setDailyProgress] = useState(0);
  const [ogPoints, setOgPoints] = useState(1250);
  const [notificationPreference, setNotificationPreference] = useState("whatsapp");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState("profile"); // Default to profile view
  const [hasActionPlan, setHasActionPlan] = useState(false);
  const { theme } = useTheme();

  // Redirect to login page if user is not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/call');
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };

    // Check if user has an action plan
    const storedPlan = localStorage.getItem('wizActionPlan');
    setHasActionPlan(!!storedPlan);

    // Calculate progress based on action plan completion
    if (storedPlan) {
      try {
        const plan = JSON.parse(storedPlan);
        
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
          setDailyProgress(progress);
        }
      } catch (error) {
        console.error("Error calculating progress:", error);
      }
    }

    // Load saved points
    const savedPoints = localStorage.getItem('wizPoints');
    if (savedPoints) {
      setOgPoints(parseInt(savedPoints, 10));
    } else {
      localStorage.setItem('wizPoints', String(ogPoints));
    }

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Listen for changes in action plan to update progress
  useEffect(() => {
    const handleStorageChange = () => {
      const storedPlan = localStorage.getItem('wizActionPlan');
      setHasActionPlan(!!storedPlan);
      
      if (storedPlan) {
        try {
          const plan = JSON.parse(storedPlan);
          
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
            setDailyProgress(progress);
          }
        } catch (error) {
          console.error("Error calculating progress:", error);
        }
      }

      // Also check for points updates
      const savedPoints = localStorage.getItem('wizPoints');
      if (savedPoints) {
        setOgPoints(parseInt(savedPoints, 10));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check for changes within the same window
    const interval = setInterval(handleStorageChange, 2000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const renderActiveView = () => {
    switch (activeView) {
      case "settings":
        return (
          <SettingsView 
            notificationPreference={notificationPreference}
            onPreferenceChange={setNotificationPreference}
          />
        );
      case "chat":
        return <ChatView />;
      case "rewards":
        return <RewardsView />;
      case "profile":
      default:
        return (
          <div className="max-w-5xl mx-auto space-y-4 md:space-y-6 pt-1 md:pt-6">
            {hasActionPlan && <ActionPlan />}
            {/* WeeklyFocus and TaskCalendar components removed as requested */}
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-white text-foreground transition-colors duration-300`}>
      <div className="flex min-h-screen relative">
        <div className="hidden md:block w-[18%] min-h-screen border-r border-border/30">
          <Sidebar 
            activeView={activeView}
            onNavigate={setActiveView}
          />
        </div>

        <div className="w-full md:w-[82%] flex flex-col min-h-screen">
          <TopProgressBar 
            dailyProgress={dailyProgress} 
            ogPoints={ogPoints} 
          />

          <div className="flex-1 px-4 md:px-8 py-4 md:py-6 overflow-y-auto pb-20 md:pb-6">
            {renderActiveView()}
          </div>
        </div>

        <motion.nav 
          className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-border/30 md:hidden z-40"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <Sidebar 
            isMobile={true}
            activeView={activeView}
            onNavigate={setActiveView}
          />
        </motion.nav>
      </div>
    </div>
  );
}
