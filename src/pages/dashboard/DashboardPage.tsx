
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState("profile");

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

  const renderActiveView = () => {
    switch (activeView) {
      case "settings":
        return (
          <SettingsView 
            notificationPreference={notificationPreference}
            onPreferenceChange={setNotificationPreference}
          />
        );
      case "profile":
      default:
        return (
          <div className="max-w-5xl mx-auto space-y-8 pt-20">
            <WeeklyFocus />
            <TaskCalendar tasks={tasks} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="flex min-h-screen">
        {/* Left Sidebar - Navigation Only */}
        <div className="hidden md:block w-[18%] min-h-screen border-r border-border/30">
          <Sidebar 
            activeView={activeView}
            onNavigate={setActiveView}
          />
        </div>

        {/* Right Panel with Header and Content */}
        <div className="w-full md:w-[82%] flex flex-col min-h-screen">
          {/* Top Header with Profile and Progress */}
          <TopProgressBar 
            dailyProgress={dailyProgress} 
            ogPoints={ogPoints} 
          />

          {/* Main Content Area */}
          <div className="flex-1 px-4 md:px-8 py-6 overflow-y-auto">
            {renderActiveView()}
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            >
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 20 }}
                className="w-4/5 h-full absolute right-0 bg-background/95 border-l border-border/30"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 space-y-4">
                  <h2 className="text-lg font-semibold mb-6">Menu</h2>
                  <Sidebar 
                    activeView={activeView}
                    onNavigate={setActiveView}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Bottom Navigation */}
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

        {/* Floating Action Button */}
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
