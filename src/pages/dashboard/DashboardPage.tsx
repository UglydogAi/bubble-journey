
import React, { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TopProgressBar } from "./components/TopProgressBar";
import { Sidebar } from "./components/Sidebar";
import { WeeklyFocus } from "./components/WeeklyFocus";
import { TaskCalendar } from "./components/TaskCalendar";
import { NotificationPreferences } from "./components/NotificationPreferences";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export default function DashboardPage() {
  const [dailyProgress] = useState(65);
  const [ogPoints] = useState(1250);
  const [notificationPreference, setNotificationPreference] = useState("whatsapp");

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

      <div className="pt-16 flex">
        <Sidebar />

        <div className="ml-64 flex-1 p-6">
          <WeeklyFocus />
          <TaskCalendar tasks={tasks} />
          <NotificationPreferences
            preference={notificationPreference}
            onPreferenceChange={setNotificationPreference}
          />
        </div>
      </div>

      <motion.div 
        className="fixed bottom-6 right-6"
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
