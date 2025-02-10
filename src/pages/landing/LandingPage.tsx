
import React from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Brain, Heart, Eye, Activity, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  {
    id: "wealth",
    icon: <Banknote size={50} className="text-yellow-400" />, 
    title: "Wealth",
    description: "Build the life you deserve.",
    color: "bg-yellow-500/10 border-yellow-400",
  },
  {
    id: "relationships",
    icon: <Heart size={50} className="text-red-400" />, 
    title: "Relationships",
    description: "Love, Friendship, and Connection.",
    color: "bg-red-500/10 border-red-400",
  },
  {
    id: "spirituality",
    icon: <Eye size={50} className="text-purple-400" />, 
    title: "Spirituality",
    description: "Find Clarity and Purpose.",
    color: "bg-purple-500/10 border-purple-400",
  },
  {
    id: "health",
    icon: <Activity size={50} className="text-green-400" />, 
    title: "Health",
    description: "Mind & Body Optimization.",
    color: "bg-green-500/10 border-green-400",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white px-4">
      <motion.div 
        initial={{ scale: 0.8 }} 
        animate={{ scale: 1 }} 
        transition={{ type: "spring", stiffness: 300 }}
        className="flex flex-col items-center justify-center mb-10"
      >
        <Brain size={80} className="text-blue-500 animate-pulse" />
        <h2 className="text-2xl font-bold mt-4">The Call for Change</h2>
        <p className="text-lg text-gray-300 text-center max-w-md mt-2">
          "This is it. The moment you decide. Answer, and there's no turning back. Keep scrolling, and you stay the same. Choose wisely."
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className={`border ${category.color} p-6 rounded-2xl shadow-lg flex flex-col items-center text-center bg-gray-900/50 backdrop-blur-sm`}> 
              {category.icon}
              <h3 className="text-xl font-semibold mt-4">{category.title}</h3>
              <p className="text-gray-300 mt-2">{category.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <Button 
        className="mt-8 px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg font-bold rounded-lg shadow-lg transition-all"
        size="lg"
      >
        Get Roasted. Get Motivated.
      </Button>
    </div>
  );
}
