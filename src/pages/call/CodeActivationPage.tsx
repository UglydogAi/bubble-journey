
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Key } from "lucide-react";
import InvitationCodeForm from "@/components/auth/InvitationCodeForm";

const CodeActivationPage: React.FC = () => {
  const [codeActivated, setCodeActivated] = useState(false);
  const navigate = useNavigate();
  
  const handleCodeSuccess = () => {
    setCodeActivated(true);
    setTimeout(() => navigate('/call/chat'), 2000);
  };
  
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0C121D] text-white">
      {/* Animated stars/particles background - same as InvitePage */}
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
        
        {/* Main content - activation form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md relative"
        >
          {/* Soft glow behind form */}
          <div className="absolute inset-0 blur-[30px] bg-[#8B5CF6]/10 rounded-2xl -z-10" />
          
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#1E293B] flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              <Key className="h-8 w-8 text-[#8B5CF6]" />
            </div>
          </div>
          
          {codeActivated ? (
            <motion.div 
              className="text-center space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-semibold">Access Granted!</h2>
              <p className="text-gray-300">
                Welcome to WIZ. Redirecting you to connect with Wiz...
              </p>
              <div className="flex justify-center pt-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#8B5CF6]"></div>
              </div>
            </motion.div>
          ) : (
            <InvitationCodeForm onSuccess={handleCodeSuccess} />
          )}
          
          <div className="mt-8 bg-[#1E293B]/50 p-4 rounded-xl border border-[#8B5CF6]/20">
            <p className="text-xs text-gray-400 text-center">
              <span className="text-[#A78BFA] font-medium">No code yet?</span> WIZ is currently in private beta. <button 
                onClick={() => navigate('/invite')}
                className="text-[#8B5CF6] hover:underline"
              >
                Request access
              </button> to join our waitlist.
            </p>
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

export default CodeActivationPage;
