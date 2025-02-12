import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Trophy, MessageSquare, UserRound, Settings, 
  TrendingUp, Coins, Calendar, CheckSquare,
  CreditCard, Users, Bell, ChevronRight,
  Check, ArrowRight, Moon, Sun
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toggle } from "@/components/ui/toggle";
import { useTheme } from "next-themes";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface DayGoal {
  date: string;
  tasks: Task[];
}

export default function DashboardPage() {
  const [dailyProgress] = useState(65);
  const [ogPoints] = useState(1250);
  const [selectedTab, setSelectedTab] = useState("today");
  const [notificationPreference, setNotificationPreference] = useState("whatsapp");
  const { theme, setTheme } = useTheme();
  
  const weeklyGoals: DayGoal[] = [
    {
      date: "Monday",
      tasks: [
        { id: "1", title: "30-minute workout", completed: false },
        { id: "2", title: "10-minute meditation", completed: true },
        { id: "3", title: "Read 5 pages", completed: false }
      ]
    },
    // ... Additional days would go here
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1F2C] to-[#0c1015] dark:from-[#1A1F2C] dark:to-[#0c1015] light:from-white light:to-gray-100 text-gray-900 dark:text-white transition-colors duration-300">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-2xl">
              <Progress 
                value={dailyProgress} 
                className="h-2 bg-gray-200 dark:bg-gray-700"
                style={{
                  background: "linear-gradient(90deg, #D946EF 0%, #8B5CF6 100%)",
                  boxShadow: "0 0 10px rgba(217, 70, 239, 0.5)"
                }}
              />
              <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">
                {dailyProgress}% Complete – Keep Going, Legend!
              </p>
            </div>
            <div className="flex items-center gap-4 ml-4">
              <Toggle
                pressed={theme === "dark"}
                onPressedChange={(pressed) => setTheme(pressed ? "dark" : "light")}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700" />
                )}
              </Toggle>
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-[#D946EF]" />
                <span className="font-bold text-gray-900 dark:text-white">{ogPoints}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-16 flex">
        <div className="w-64 fixed left-0 top-16 bottom-0 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm border-r border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3 mb-8 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img 
                src="/lovable-uploads/ce8e10ec-31c6-4d22-8be9-25e4d50d8206.png"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Legend</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Premium Member</p>
            </div>
          </div>

          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start gap-3 text-gray-700 dark:text-gray-300">
              <UserRound className="w-5 h-5" /> Profile
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 text-gray-700 dark:text-gray-300">
              <Settings className="w-5 h-5" /> Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 text-gray-700 dark:text-gray-300">
              <CreditCard className="w-5 h-5" /> Purchase
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 text-gray-700 dark:text-gray-300">
              <Users className="w-5 h-5" /> Community
            </Button>
          </nav>
        </div>

        <div className="ml-64 flex-1 p-6">
          <Card className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">This Week's Focus</h2>
                  <p className="text-gray-600 dark:text-gray-300">Stay consistent with your daily goals</p>
                </div>
                <Button variant="outline" size="sm">
                  Edit Goals
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100/30 dark:bg-gray-700/30">
                  <div className="w-10 h-10 rounded-full bg-[#D946EF]/20 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-[#D946EF]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Exercise 4x</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">This week</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Today's Tasks</h3>
                <div className="flex gap-2">
                  {weeklyGoals[0].tasks.map((task) => (
                    <Button
                      key={task.id}
                      variant={task.completed ? "default" : "outline"}
                      size="sm"
                      className={task.completed ? "bg-[#D946EF]" : ""}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      {task.title}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-4 mb-6">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-lg ${
                      i === 0 ? "bg-[#D946EF]/20 border-2 border-[#D946EF]" : "bg-gray-100/30 dark:bg-gray-700/30"
                    }`}
                  >
                    <p className="text-sm font-medium mb-1">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                    </p>
                    <div className="space-y-2">
                      <div className="w-full h-1 rounded bg-[#D946EF]/40" />
                      <div className="w-2/3 h-1 rounded bg-[#D946EF]/40" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-100/30 dark:bg-gray-700/30">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-[#D946EF]" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Daily Reminders</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Get notified about your tasks</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={notificationPreference === "whatsapp" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNotificationPreference("whatsapp")}
                      className={notificationPreference === "whatsapp" ? "bg-[#D946EF]" : ""}
                    >
                      WhatsApp
                    </Button>
                    <Button
                      variant={notificationPreference === "telegram" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNotificationPreference("telegram")}
                      className={notificationPreference === "telegram" ? "bg-[#D946EF]" : ""}
                    >
                      Telegram
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <motion.div 
        className="fixed bottom-6 right-6"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button 
          size="lg"
          className="w-12 h-12 rounded-full bg-[#D946EF] hover:bg-[#D946EF]/80 p-0"
        >
          <MessageSquare className="w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  );
}
