
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import WizLogo from "@/components/WizLogo";
import { XCircle } from "lucide-react";
import { formatDuration } from "@/lib/utils";
import JotformEmbedHandler from "@/components/JotformEmbedHandler";
import { toast } from "sonner";

export default function CallPage() {
  const navigate = useNavigate();
  const [duration, setDuration] = useState(0);
  
  // Timer for call duration
  useEffect(() => {
    const timer = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const handleEndCall = async () => {
    try {
      // Get the current date to set as the week start date (assuming Monday start)
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0 for Sunday, 1 for Monday, etc.
      const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust for Monday as start of week
      const monday = new Date(today);
      monday.setDate(today.getDate() - diff);
      monday.setHours(0, 0, 0, 0);
      
      // Generate a more detailed 7-day action plan based on call duration
      const actionPlan = {
        title: "Your 7-Day Action Plan",
        createdAt: new Date().toISOString(),
        duration: duration,
        weekStartDate: monday.toISOString(),
        goal: "Establish a balanced routine with focus on wellness and productivity",
        weeklyPlan: {
          Monday: [
            { 
              id: "mon-1", 
              title: "Morning meditation", 
              description: "Start your day with a 10-minute guided meditation focused on intention setting", 
              completed: false 
            },
            { 
              id: "mon-2", 
              title: "Plan your week", 
              description: "Outline your key priorities and schedule important tasks", 
              completed: false 
            },
            { 
              id: "mon-3", 
              title: "Evening reflection", 
              description: "Write down 3 things that went well and 3 areas to improve", 
              completed: false 
            }
          ],
          Tuesday: [
            { 
              id: "tue-1", 
              title: "30-minute workout", 
              description: "Focus on cardio and body weight exercises", 
              completed: false 
            },
            { 
              id: "tue-2", 
              title: "Read a book chapter", 
              description: "Dedicate 20 minutes to reading something that develops your skills", 
              completed: false 
            }
          ],
          Wednesday: [
            { 
              id: "wed-1", 
              title: "Midweek check-in", 
              description: "Review your weekly goals and adjust priorities if needed", 
              completed: false 
            },
            { 
              id: "wed-2", 
              title: "Mindful meal preparation", 
              description: "Cook a nutritious meal with focus on fresh ingredients", 
              completed: false 
            },
            { 
              id: "wed-3", 
              title: "Digital detox hour", 
              description: "Spend one hour away from all screens", 
              completed: false 
            }
          ],
          Thursday: [
            { 
              id: "thu-1", 
              title: "Strength training session", 
              description: "Focus on resistance exercises for major muscle groups", 
              completed: false 
            },
            { 
              id: "thu-2", 
              title: "Learning activity", 
              description: "Spend 30 minutes developing a new skill or deepening existing knowledge", 
              completed: false 
            }
          ],
          Friday: [
            { 
              id: "fri-1", 
              title: "Weekly review", 
              description: "Evaluate progress on weekly goals and celebrate achievements", 
              completed: false 
            },
            { 
              id: "fri-2", 
              title: "Social connection", 
              description: "Reach out to a friend or family member you haven't spoken to recently", 
              completed: false 
            },
            { 
              id: "fri-3", 
              title: "Plan relaxing weekend activity", 
              description: "Schedule something enjoyable that recharges your energy", 
              completed: false 
            }
          ],
          Saturday: [
            { 
              id: "sat-1", 
              title: "Nature exposure", 
              description: "Spend at least 30 minutes outdoors in a natural setting", 
              completed: false 
            },
            { 
              id: "sat-2", 
              title: "Hobby time", 
              description: "Dedicate 1 hour to a creative or recreational activity you enjoy", 
              completed: false 
            }
          ],
          Sunday: [
            { 
              id: "sun-1", 
              title: "Weekly preparation", 
              description: "Prepare meals and organize your space for the week ahead", 
              completed: false 
            },
            { 
              id: "sun-2", 
              title: "Reflection and gratitude", 
              description: "Write down 3 things you're grateful for from the past week", 
              completed: false 
            },
            { 
              id: "sun-3", 
              title: "Set intentions for next week", 
              description: "Identify your top 3 priorities for the upcoming week", 
              completed: false 
            }
          ]
        },
        summary: "This personalized weekly plan is designed to help you establish balance between productivity, wellness, and personal growth. Each day builds on the previous day's progress, helping you develop consistent habits that contribute to your overall wellbeing and success. Completing these tasks will help you create momentum toward your long-term goals while maintaining balance in your daily life."
      };
      
      // Store action plan in local storage
      localStorage.setItem('wizActionPlan', JSON.stringify(actionPlan));
      
      // Notify user about their plan
      toast.success("Your 7-day action plan is ready on the dashboard!");
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error("Error ending call:", error);
      toast.error("There was an issue saving your action plan");
      navigate('/dashboard');
    }
  };
  
  return (
    <div className="relative flex flex-col h-screen w-full bg-[#0C121D] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 z-10">
        {/* WIZ logo and timer */}
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
            <WizLogo className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-purple-500 font-bold">WIZ</span>
            <span className="text-gray-400 text-xs">{formatDuration(duration)}</span>
          </div>
        </div>
        
        {/* End call button */}
        <button 
          onClick={handleEndCall}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full flex items-center transition-all"
        >
          <XCircle className="w-4 h-4 mr-1" />
          End Call
        </button>
      </div>
      
      {/* Main content area with WIZ AI Agent iframe */}
      <div className="relative flex-1 overflow-hidden">
        {/* Stars background */}
        <div className="absolute inset-0">
          {Array.from({ length: 100 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                width: Math.random() * 2 + 1,
                height: Math.random() * 2 + 1,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
        
        {/* WIZ AI Voice Agent iframe */}
        <div className="absolute inset-0 flex items-center justify-center">
          <iframe 
            id="JotFormIFrame-0195e880c2ea769390c02b8ff81559532b37" 
            title="WIZ: Life Coach"
            onLoad={() => window.parent.scrollTo(0,0)} 
            allowTransparency={true}
            allow="geolocation; microphone; camera; fullscreen"
            src="https://agent.jotform.com/0195e880c2ea769390c02b8ff81559532b37/voice?embedMode=iframe&background=1&shadow=1"
            frameBorder="0" 
            style={{
              minWidth: "100%",
              maxWidth: "100%",
              height: "calc(100vh - 88px)",
              border: "none",
              width: "100%"
            }}
            scrolling="no"
          />
        </div>
        
        {/* Add the JotForm embed handler */}
        <JotformEmbedHandler formId="0195e880c2ea769390c02b8ff81559532b37" />
      </div>
    </div>
  );
}
