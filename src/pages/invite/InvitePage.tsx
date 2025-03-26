
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles, ChevronRight, ArrowRight } from "lucide-react";
import { TextField } from "@/components/ui/text-field";
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
      
      // Navigate to call page after successful submission
      setTimeout(() => {
        navigate('/call');
      }, 2000);
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
      
      {/* Enhanced radial gradient bg */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          background: "radial-gradient(circle at center, rgba(139,92,246,0.4) 0%, rgba(12,18,29,0) 70%)",
        }}
      />
      
      <div className="relative container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen">
        {/* Logo with enhanced glow */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 flex flex-col items-center relative"
        >
          <div className="absolute inset-0 blur-[20px] bg-[#8B5CF6]/30 rounded-full scale-150" />
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-white drop-shadow-lg relative z-10">
            WIZ
          </h1>
          <div className="mt-1 w-16 h-1 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] rounded-full" />
        </motion.div>
        
        {/* Main content - seamlessly integrated with background */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md relative"
        >
          {/* Soft glow behind form */}
          <div className="absolute inset-0 blur-[30px] bg-[#8B5CF6]/10 rounded-2xl -z-10" />
          
          <h2 className="text-2xl md:text-3xl font-light text-center mb-2 tracking-wide">
            Become Limitless
          </h2>
          
          <p className="text-gray-300 text-center mb-8 leading-relaxed">
            WIZ is currently in private beta. Your personal AI coach, built to 
            push limits, break barriers, and unlock your true potential. Enter 
            your email below to request exclusive access.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-[#1E293B]/80 backdrop-blur-sm border-[#8B5CF6]/30 focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/30 text-white placeholder:text-gray-400 rounded-xl transition-all"
              icon={<Sparkles className="h-5 w-5 text-[#8B5CF6] opacity-70" />}
              required
            />
            
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] hover:from-[#D946EF] hover:to-[#8B5CF6] text-white font-normal rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_0_15px_rgba(139,92,246,0.3)] backdrop-blur-sm border border-white/10"
            >
              {isSubmitting ? (
                "Processing..."
              ) : (
                <>
                  Request Exclusive Access
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => navigate("/call")}
              className="text-[#8B5CF6] hover:text-[#A78BFA] text-sm flex items-center justify-center mx-auto gap-1 transition-colors duration-200"
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
}

export default InvitePage;
