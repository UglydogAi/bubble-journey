
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
    <div className="min-h-screen bg-[#0D0F18] text-[#EDEDED]">
      {/* Top Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0D0F18]/80 backdrop-blur-xl border-b border-[#A442F1]/20">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-2xl">
              <Progress 
                value={dailyProgress} 
                className="h-2 bg-[#1A1F2C]"
                style={{
                  background: "linear-gradient(90deg, #A442F1 0%, #D94FFF 100%)",
                  boxShadow: "0 0 20px rgba(164, 66, 241, 0.3)"
                }}
              />
              <p className="text-sm mt-1 text-[#B8B8B8]">
                {dailyProgress}% Complete – Keep Going, Legend!
              </p>
            </div>
            <div className="flex items-center gap-4 ml-4">
              <Toggle
                pressed={theme === "dark"}
                onPressedChange={(pressed) => setTheme(pressed ? "dark" : "light")}
                className="p-2 rounded-full bg-[#1A1F2C] hover:bg-[#A442F1]/20 transition-colors duration-300"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-[#D94FFF]" />
                ) : (
                  <Moon className="w-5 h-5 text-[#A442F1]" />
                )}
              </Toggle>
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-[#D94FFF]" />
                <span className="font-bold text-[#EDEDED]">{ogPoints}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="pt-16 flex">
        {/* Left Sidebar */}
        <div className="w-64 fixed left-0 top-16 bottom-0 bg-[#1A1F2C]/50 backdrop-blur-xl border-r border-[#A442F1]/20">
          <div className="flex items-center gap-3 m-4 p-3 rounded-lg bg-[#1A1F2C]/80 border border-[#A442F1]/20 shadow-[0_0_15px_rgba(164,66,241,0.1)]">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#A442F1]/30">
              <img 
                src="/lovable-uploads/ce8e10ec-31c6-4d22-8be9-25e4d50d8206.png"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-semibold text-[#EDEDED]">Legend</p>
              <p className="text-sm text-[#B8B8B8]">Premium Member</p>
            </div>
          </div>

          <nav className="space-y-2 p-4">
            {["Profile", "Settings", "Purchase", "Community"].map((item, index) => (
              <Button
                key={item}
                variant="ghost"
                className="w-full justify-start gap-3 text-[#B8B8B8] hover:text-[#EDEDED] hover:bg-[#A442F1]/10 transition-colors duration-300"
              >
                {[<UserRound />, <Settings />, <CreditCard />, <Users />][index]}
                {item}
              </Button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="ml-64 flex-1 p-6">
          {/* Action Plan Summary */}
          <Card className="bg-[#1A1F2C]/50 border-[#A442F1]/20 mb-6 shadow-[0_0_30px_rgba(164,66,241,0.1)]">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold mb-2 text-[#EDEDED]">This Week's Focus</h2>
                  <p className="text-[#B8B8B8]">Stay consistent with your daily goals</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#A442F1] text-[#A442F1] hover:bg-[#A442F1]/10 transition-colors duration-300"
                >
                  Edit Goals
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[#1A1F2C]/80 border border-[#A442F1]/20">
                  <div className="w-10 h-10 rounded-full bg-[#A442F1]/20 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-[#D94FFF]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#EDEDED]">Exercise 4x</p>
                    <p className="text-sm text-[#B8B8B8]">This week</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Smart Calendar */}
          <Card className="bg-[#1A1F2C]/50 border-[#A442F1]/20 mb-6 shadow-[0_0_30px_rgba(164,66,241,0.1)]">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-[#EDEDED]">Today's Tasks</h3>
                <div className="flex gap-2">
                  {weeklyGoals[0].tasks.map((task) => (
                    <Button
                      key={task.id}
                      variant={task.completed ? "default" : "outline"}
                      size="sm"
                      className={`
                        ${task.completed 
                          ? "bg-[#A442F1] hover:bg-[#A442F1]/90" 
                          : "border-[#A442F1] text-[#A442F1] hover:bg-[#A442F1]/10"
                        }
                        transition-colors duration-300
                      `}
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
                    className={`
                      p-4 rounded-lg border transition-colors duration-300
                      ${i === 0 
                        ? "bg-[#A442F1]/10 border-[#A442F1]" 
                        : "bg-[#1A1F2C]/80 border-[#A442F1]/20"
                      }
                    `}
                  >
                    <p className="text-sm font-medium mb-1 text-[#EDEDED]">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                    </p>
                    <div className="space-y-2">
                      <div className="w-full h-1 rounded bg-[#A442F1]/40" />
                      <div className="w-2/3 h-1 rounded bg-[#A442F1]/40" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notification Setup */}
          <Card className="bg-[#1A1F2C]/50 border-[#A442F1]/20 shadow-[0_0_30px_rgba(164,66,241,0.1)]">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-[#EDEDED]">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#1A1F2C]/80 border border-[#A442F1]/20">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-[#D94FFF]" />
                    <div>
                      <p className="font-medium text-[#EDEDED]">Daily Reminders</p>
                      <p className="text-sm text-[#B8B8B8]">Get notified about your tasks</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {["WhatsApp", "Telegram"].map((platform) => (
                      <Button
                        key={platform}
                        variant={notificationPreference === platform.toLowerCase() ? "default" : "outline"}
                        size="sm"
                        onClick={() => setNotificationPreference(platform.toLowerCase())}
                        className={`
                          ${notificationPreference === platform.toLowerCase()
                            ? "bg-[#D94FFF] hover:bg-[#D94FFF]/90"
                            : "border-[#D94FFF] text-[#D94FFF] hover:bg-[#D94FFF]/10"
                          }
                          transition-colors duration-300
                        `}
                      >
                        {platform}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floating Action Button */}
      <motion.div 
        className="fixed bottom-6 right-6"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button 
          size="lg"
          className="w-12 h-12 rounded-full bg-[#D94FFF] hover:bg-[#D94FFF]/90 shadow-[0_0_20px_rgba(217,79,255,0.3)] transition-colors duration-300"
        >
          <MessageSquare className="w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  );
}
