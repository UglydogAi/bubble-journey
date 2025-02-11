
import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Trophy, Star, MessageSquare, PhoneCall, UserRound, 
  TrendingUp, Coins, ListCheck, Calendar, CheckSquare 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

interface Goal {
  id: string;
  title: string;
  category: string;
  progress: number;
  steps: string[];
}

export default function DashboardPage() {
  const [dailyProgress] = useState(65);
  const [ogPoints] = useState(1250);
  const [goals] = useState<Goal[]>([
    {
      id: "1",
      title: "Morning Workout Routine",
      category: "Fitness",
      progress: 75,
      steps: ["20 min cardio", "15 min strength", "5 min stretching"]
    },
    {
      id: "2",
      title: "Mindfulness Practice",
      category: "Mental Health",
      progress: 50,
      steps: ["10 min meditation", "Gratitude journal", "Evening reflection"]
    },
    {
      id: "3",
      title: "Relationship Building",
      category: "Personal Growth",
      progress: 30,
      steps: ["Call a friend", "Family dinner", "Active listening practice"]
    }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1F2C] to-[#0c1015] text-white p-6">
      {/* User Overview Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-6 mb-6">
          <div className="w-16 h-16 rounded-full overflow-hidden">
            <img 
              src="/lovable-uploads/ce8e10ec-31c6-4d22-8be9-25e4d50d8206.png"
              alt="UGLYDOG"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-1">Welcome back, Legend!</h1>
            <p className="text-gray-400">Let's unlock the superhuman in you.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Daily Progress</span>
                <TrendingUp className="text-[#D946EF]" />
              </div>
              <Progress value={dailyProgress} className="h-2 mb-2" />
              <span className="text-sm text-gray-400">{dailyProgress}% Complete</span>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">OG Points</span>
                <Coins className="text-[#D946EF]" />
              </div>
              <p className="text-2xl font-bold mt-2">{ogPoints}</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Goal Setting Board */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-xl font-bold mb-4">This Week's Goals</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {goals.map((goal) => (
            <Card key={goal.id} className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{goal.title}</h3>
                <p className="text-sm text-gray-400 mb-3">{goal.category}</p>
                <Progress value={goal.progress} className="h-1.5 mb-3" />
                <div className="space-y-2">
                  {goal.steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckSquare className="w-4 h-4 text-gray-400" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-8">
        <Button 
          className="bg-[#D946EF] hover:bg-[#D946EF]/80"
          size="lg"
        >
          Start Today's Task
        </Button>
        <Button 
          variant="outline"
          size="lg"
          className="border-[#D946EF] text-[#D946EF] hover:bg-[#D946EF]/10"
        >
          Check In with UGLYDOG
        </Button>
      </div>

      {/* Floating Action Button */}
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
