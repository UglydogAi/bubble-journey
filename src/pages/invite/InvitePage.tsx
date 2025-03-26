
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles, ChevronRight, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const InvitePage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate request process
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Invitation request submitted successfully");
      setEmail("");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0C121D] text-white">
      {/* Animated stars/particles background */}
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
      
      {/* Radial gradient bg */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(circle at center, rgba(59,130,246,0.3) 0%, rgba(12,18,29,0) 70%)",
        }}
      />
      
      <div className="relative container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 flex flex-col items-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-lg">
            MANUS
          </h1>
          <div className="mt-1 w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full" />
        </motion.div>
        
        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md backdrop-blur-lg bg-black/30 p-8 rounded-2xl border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Unlock the Future with Manus & Wiz
          </h2>
          
          <p className="text-gray-300 text-center mb-8">
            Manus is currently in private beta. Meet Wiz, your personal AI assistant, 
            designed to help with a wide range of tasks. Enter your email below to 
            request an exclusive invitation.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-[#1E293B] border-blue-500/40 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 text-white placeholder:text-gray-400"
                required
              />
              <Sparkles className="absolute right-3 top-3.5 h-5 w-5 text-blue-400 opacity-70" />
            </div>
            
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium rounded-md flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
            >
              {isSubmitting ? (
                "Processing..."
              ) : (
                <>
                  Request Invitation
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => navigate("/call")}
              className="text-blue-300 hover:text-blue-200 text-sm flex items-center justify-center mx-auto gap-1 transition-colors duration-200"
            >
              Already have a code? Activate Account
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
        
        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-auto pt-8 text-xs text-gray-400 text-center"
        >
          © 2024 Wiz | Privacy | Terms
        </motion.div>
      </div>
    </div>
  );
};

export default InvitePage;
