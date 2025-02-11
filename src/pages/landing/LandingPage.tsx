import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Skull, Zap, Brain, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    id: "ai",
    icon: <Brain size={50} className="text-[#0EA5E9]" />,
    title: "AI-Powered Mastery",
    description: "Unlock your superhuman potential.",
    color: "bg-[#0EA5E9]/10 border-[#0EA5E9]",
  },
  {
    id: "motivation",
    icon: <Zap size={50} className="text-[#D946EF]" />,
    title: "Relentless Drive",
    description: "No excuses. Only results.",
    color: "bg-[#D946EF]/10 border-[#D946EF]",
  },
  {
    id: "guidance",
    icon: <MessageSquare size={50} className="text-[#F97316]" />,
    title: "Brutal Honesty",
    description: "The truth you need to hear.",
    color: "bg-[#F97316]/10 border-[#F97316]",
  },
  {
    id: "transformation",
    icon: <Skull size={50} className="text-[#8B5CF6]" />,
    title: "Total Transformation",
    description: "Emerge stronger. Be superhuman.",
    color: "bg-[#8B5CF6]/10 border-[#8B5CF6]",
  },
];

export default function LandingPage() {
  const [answered, setAnswered] = useState(false);
  const [declining, setDeclining] = useState(false);
  const navigate = useNavigate();

  const handleAnswerCall = () => {
    setAnswered(true);
    setTimeout(() => {
      navigate('/call');
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1A1F2C] text-white px-4 relative overflow-hidden">
      {/* Matrix-like background effect */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEpIi8+PC9zdmc+')] opacity-20" />
      
      <AnimatePresence>
        {!answered && !declining ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center mb-10 relative z-10"
          >
            <motion.div
              animate={{ 
                rotate: [-5, 5, -5],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 0.5, 
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            >
              <Phone size={100} className="text-[#D946EF] animate-pulse filter drop-shadow-[0_0_10px_#D946EF]" />
            </motion.div>
            
            <motion.h2 
              className="text-4xl font-bold mt-8 mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#D946EF] to-[#8B5CF6]"
              animate={{ 
                opacity: [0.5, 1, 0.5],
                textShadow: [
                  "0 0 7px #D946EF",
                  "0 0 10px #D946EF",
                  "0 0 7px #D946EF"
                ]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity 
              }}
            >
              INCOMING CALL: UGLYDOG
            </motion.h2>
            
            <p className="text-xl text-gray-300 text-center max-w-2xl mt-4 leading-relaxed">
              "Most people ignore the call. They settle. They hesitate. But you're here for a reason. 
              If you answer, there is no going back. Are you ready to unlock the superhuman in you?"
            </p>

            <div className="flex gap-6 mt-12">
              <Button 
                variant="ghost"
                className="text-gray-400 hover:text-gray-200 transition-all"
                onClick={() => setDeclining(true)}
              >
                Decline Call
              </Button>
              <Button 
                className="px-8 py-6 bg-gradient-to-r from-[#D946EF] to-[#8B5CF6] hover:from-[#8B5CF6] hover:to-[#D946EF] text-white text-lg font-bold rounded-lg shadow-lg transition-all border-none"
                onClick={handleAnswerCall}
              >
                Answer The Call
              </Button>
            </div>
          </motion.div>
        ) : declining ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-2xl text-gray-400 text-center"
          >
            "Go back to mediocrity."
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl text-[#D946EF] text-center"
          >
            Entering UGLYDOG's world...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
