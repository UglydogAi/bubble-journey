
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
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Top Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-2xl">
              <Progress 
                value={dailyProgress} 
                className="h-2"
                indicatorClassName="bg-primary transition-all duration-300"
              />
              <p className="text-sm mt-1 text-muted-foreground">
                {dailyProgress}% Complete – Keep Going, Legend!
              </p>
            </div>
            <div className="flex items-center gap-4 ml-4">
              <Toggle
                pressed={theme === "dark"}
                onPressedChange={(pressed) => setTheme(pressed ? "dark" : "light")}
                className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors duration-300"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-primary" />
                ) : (
                  <Moon className="w-5 h-5 text-primary" />
                )}
              </Toggle>
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-primary" />
                <span className="font-bold">{ogPoints}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="pt-16 flex">
        {/* Left Sidebar */}
        <div className="w-64 fixed left-0 top-16 bottom-0 bg-sidebar-background/50 backdrop-blur-xl border-r border-sidebar-border">
          <div className="flex items-center gap-3 m-4 p-3 rounded-lg bg-sidebar-accent border border-sidebar-border">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-sidebar-ring/30">
              <img 
                src="/lovable-uploads/ce8e10ec-31c6-4d22-8be9-25e4d50d8206.png"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-semibold text-sidebar-foreground">Legend</p>
              <p className="text-sm text-sidebar-foreground/70">Premium Member</p>
            </div>
          </div>

          <nav className="space-y-2 p-4">
            {["Profile", "Settings", "Purchase", "Community"].map((item, index) => (
              <Button
                key={item}
                variant="ghost"
                className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors duration-300"
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
          <Card className="bg-card border-border mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold mb-2">This Week's Focus</h2>
                  <p className="text-muted-foreground">Stay consistent with your daily goals</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary text-primary hover:bg-primary/10 transition-colors duration-300"
                >
                  Edit Goals
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent border border-border">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Exercise 4x</p>
                    <p className="text-sm text-muted-foreground">This week</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Smart Calendar */}
          <Card className="bg-card border-border mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Today's Tasks</h3>
                <div className="flex gap-2">
                  {weeklyGoals[0].tasks.map((task) => (
                    <Button
                      key={task.id}
                      variant={task.completed ? "default" : "outline"}
                      size="sm"
                      className={`
                        ${task.completed 
                          ? "bg-primary hover:bg-primary/90" 
                          : "border-primary text-primary hover:bg-primary/10"
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
                        ? "bg-primary/10 border-primary" 
                        : "bg-accent border-border"
                      }
                    `}
                  >
                    <p className="text-sm font-medium mb-1">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                    </p>
                    <div className="space-y-2">
                      <div className="w-full h-1 rounded bg-primary/40" />
                      <div className="w-2/3 h-1 rounded bg-primary/40" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notification Setup */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-accent border border-border">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Daily Reminders</p>
                      <p className="text-sm text-muted-foreground">Get notified about your tasks</p>
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
                            ? "bg-primary hover:bg-primary/90"
                            : "border-primary text-primary hover:bg-primary/10"
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
          className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 shadow-lg transition-colors duration-300"
        >
          <MessageSquare className="w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  );
}
