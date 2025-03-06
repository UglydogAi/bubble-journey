import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TopProgressBar } from "./components/TopProgressBar";
import { Sidebar } from "./components/Sidebar";
import { WeeklyFocus } from "./components/WeeklyFocus";
import { TaskCalendar } from "./components/TaskCalendar";
import { SettingsView } from "./components/SettingsView";
import { useEffect } from "react";
import { ChatView } from "./components/ChatView";
import { RewardsView } from "./components/RewardsView";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export default function DashboardPage() {
  const [dailyProgress] = useState(65);
  const [ogPoints] = useState(1250);
  const [notificationPreference, setNotificationPreference] = useState("whatsapp");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState("profile");

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const tasks = [
    { id: "1", title: "30-minute workout", completed: false },
    { id: "2", title: "10-minute meditation", completed: true },
    { id: "3", title: "Read 5 pages", completed: false },
    { id: "4", title: "Plan weekly meals", completed: true },
    
    { id: "5", title: "Team standup meeting", completed: false },
    { id: "6", title: "Update project documentation", completed: true },
    { id: "7", title: "1-hour focus block", completed: false },
    { id: "8", title: "Reply to important emails", completed: false },
    
    { id: "9", title: "Morning yoga", completed: true },
    { id: "10", title: "Review quarterly goals", completed: false },
    { id: "11", title: "Lunch with mentor", completed: false },
    { id: "12", title: "Update LinkedIn profile", completed: true },
    
    { id: "13", title: "Code review session", completed: false },
    { id: "14", title: "Research new tools", completed: true },
    { id: "15", title: "Write blog article", completed: false },
    { id: "16", title: "Evening workout", completed: false },
    
    { id: "17", title: "Weekly retrospective", completed: true },
    { id: "18", title: "Plan weekend activities", completed: false },
    { id: "19", title: "Call parents", completed: false },
    { id: "20", title: "Update personal website", completed: true },
    
    { id: "21", title: "Farmers market", completed: false },
    { id: "22", title: "House cleaning", completed: true },
    { id: "23", title: "Watch documentary", completed: false },
    { id: "24", title: "Prep meals for week", completed: false },
    
    { id: "25", title: "Morning walk", completed: true },
    { id: "26", title: "Review week ahead", completed: false },
    { id: "27", title: "Hobby time", completed: true },
    { id: "28", title: "Read book chapter", completed: false }
  ];

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
            <WeeklyFocus />
            <TaskCalendar tasks={tasks} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
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

        <motion.div 
          className="fixed bottom-24 right-6 z-50 md:bottom-8"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button 
            size="lg"
            className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 
              shadow-lg transition-colors duration-300
              shadow-primary/20"
          >
            <MessageSquare className="w-6 h-6" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
