
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Key, Mail, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import InvitationCodeForm from "@/components/auth/InvitationCodeForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const CodeActivationPage: React.FC = () => {
  const [codeActivated, setCodeActivated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();
  const { signUp, login } = useAuth();
  
  const handleCodeSuccess = () => {
    setCodeActivated(true);
  };
  
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    
    setIsRegistering(true);
    
    try {
      if (password) {
        if (password !== confirmPassword) {
          toast.error("Passwords do not match");
          setIsRegistering(false);
          return;
        }
        
        // Sign up with new account
        await signUp(email, password);
        toast.success("Account created successfully!");
      } else {
        // Log in with existing account
        await login(email, password);
        toast.success("Logged in successfully!");
      }
      
      // Redirect to call page
      setTimeout(() => navigate('/call/chat'), 1000);
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error("Authentication failed. Please try again.");
    } finally {
      setIsRegistering(false);
    }
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
              {codeActivated ? <Mail className="h-8 w-8 text-[#8B5CF6]" /> : <Key className="h-8 w-8 text-[#8B5CF6]" />}
            </div>
          </div>
          
          {codeActivated ? (
            <motion.div 
              className="bg-[#1E293B]/80 border border-[#8B5CF6]/20 backdrop-blur-sm rounded-xl p-6 space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-semibold text-center">Create Your Account</h2>
              <p className="text-gray-300 text-center">
                Your code is valid! Complete your registration to continue.
              </p>
              
              <form onSubmit={handleAuthSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-200">Email</label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="bg-[#121A29]/80 border-[#8B5CF6]/20 focus:border-[#8B5CF6]/50 text-white"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-200">Password (optional for existing users)</label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="bg-[#121A29]/80 border-[#8B5CF6]/20 focus:border-[#8B5CF6]/50 text-white"
                  />
                </div>
                
                {password && (
                  <div className="space-y-2">
                    <label htmlFor="confirm-password" className="text-sm font-medium text-gray-200">Confirm Password</label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="bg-[#121A29]/80 border-[#8B5CF6]/20 focus:border-[#8B5CF6]/50 text-white"
                    />
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] hover:opacity-90 text-white mt-6"
                  disabled={isRegistering}
                >
                  {isRegistering ? "Processing..." : (password ? "Create Account" : "Login")}
                </Button>
                
                <p className="text-xs text-center text-gray-400 mt-4">
                  {password ? "Already have an account? " : "New to WIZ? "}
                  <button 
                    type="button" 
                    className="text-[#8B5CF6] hover:underline"
                    onClick={() => setPassword(password ? "" : "password")}
                  >
                    {password ? "Login instead" : "Create an account"}
                  </button>
                </p>
              </form>
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
