
import React, { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TopProgressBar } from "./components/TopProgressBar";
import { Sidebar } from "./components/Sidebar";
import { WeeklyFocus } from "./components/WeeklyFocus";
import { TaskCalendar } from "./components/TaskCalendar";
import { NotificationPreferences } from "./components/NotificationPreferences";
import { useEffect } from "react";

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

  // Close sidebar by default on mobile
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
    { id: "3", title: "Read 5 pages", completed: false }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <TopProgressBar 
        dailyProgress={dailyProgress} 
        ogPoints={ogPoints} 
      />

      <div className="pt-16 flex relative min-h-[calc(100vh-4rem)]">
        {/* Mobile menu button - improved positioning and visibility */}
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-20 left-4 z-50 md:hidden hover:bg-accent/50 transition-colors duration-300"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="h-6 w-6 text-foreground" />
        </Button>

        {/* Improved overlay for mobile */}
        <div 
          className={`
            fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-300 md:hidden
            ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `} 
          onClick={() => setIsSidebarOpen(false)} 
        />

        {/* Improved sidebar transition */}
        <div 
          className={`
            fixed md:static h-[calc(100vh-4rem)] z-50 transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:transform-none
          `}
        >
          <Sidebar />
        </div>

        {/* Main content with improved spacing and transitions */}
        <div 
          className={`
            flex-1 p-4 sm:p-6 transition-all duration-300 overflow-x-hidden
            ${isSidebarOpen ? 'md:ml-64' : 'ml-0'}
          `}
        >
          <div className="max-w-5xl mx-auto space-y-6">
            <WeeklyFocus />
            <TaskCalendar tasks={tasks} />
            <NotificationPreferences
              preference={notificationPreference}
              onPreferenceChange={setNotificationPreference}
            />
          </div>
        </div>
      </div>

      <motion.div 
        className="fixed bottom-6 right-6 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button 
          size="lg"
          className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 shadow-lg transition-colors duration-300"
        >
          <MessageSquare className="w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  );
}
