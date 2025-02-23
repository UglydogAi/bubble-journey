
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
          <div className="max-w-5xl mx-auto space-y-6">
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
        <div className="hidden md:block w-[15%] min-h-screen">
          <Sidebar 
            activeView={activeView}
            onNavigate={setActiveView}
          />
        </div>

        {/* Right Panel with Header and Content */}
        <div className="flex-1 w-[85%] flex flex-col min-h-screen">
          {/* Top Header with Profile and Progress */}
          <div className="sticky top-0 z-50">
            <TopProgressBar 
              dailyProgress={dailyProgress} 
              ogPoints={ogPoints} 
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 px-4 py-6 overflow-y-auto">
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
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            >
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 20 }}
                className="w-4/5 h-full absolute right-0 bg-background border-l border-border"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 space-y-4">
                  <h2 className="text-lg font-semibold mb-4">Menu</h2>
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
          className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border md:hidden z-40"
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
          className="fixed bottom-20 right-6 z-50 md:bottom-6"
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
    </div>
  );
}

