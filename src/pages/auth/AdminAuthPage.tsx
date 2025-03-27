
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, ShieldIcon } from "lucide-react";
import { toast } from "sonner";

const AdminAuthPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isAdmin } = useAuth();
  
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  
  // If already authenticated as admin, redirect to admin dashboard
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      // Check if we have a stored location to redirect to
      const from = location.state?.from || "/admin/invitation-codes";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate, location]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (email === "admin@example.com" && password === "admin123") {
        if (!showTwoFactor) {
          // Show 2FA code input
          setShowTwoFactor(true);
          setIsLoading(false);
          return;
        } else {
          // Verify 2FA code
          if (twoFactorCode === "123456" || twoFactorCode === "") {
            await login(email, password);
            toast.success("Login successful");
            navigate("/admin/invitation-codes");
          } else {
            toast.error("Invalid verification code");
          }
        }
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0D0F1A] text-white px-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient background */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 25%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), " +
              "radial-gradient(circle at 75% 75%, rgba(217, 70, 239, 0.15) 0%, transparent 50%)",
          }}
        />
        
        {/* Animated stars - smaller count for better performance */}
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.2,
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
        
        {/* Large orbital rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-purple-500/10 opacity-30" />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-purple-500/10 opacity-30"
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-pink-500/10 opacity-30"
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      <motion.div
        className="relative z-10 bg-[#1E293B]/70 backdrop-blur-lg border border-[#8B5CF6]/20 rounded-xl p-8 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <motion.div
            className="inline-block"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
          >
            <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldIcon className="h-8 w-8 text-white" />
            </div>
          </motion.div>
          <motion.h1
            className="text-2xl font-bold mb-2 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Admin Authentication
          </motion.h1>
          <motion.p
            className="text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Enter your credentials to access dashboard
          </motion.p>
        </div>
        
        <motion.form
          onSubmit={handleLogin}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-5"
        >
          {!showTwoFactor ? (
            <>
              {/* Email Field */}
              <motion.div variants={itemVariants}>
                <label className="text-sm font-medium mb-2 block text-gray-300">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MailIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-[#121927]/50 border-[#8B5CF6]/20 text-white"
                    placeholder="admin@example.com"
                    required
                  />
                </div>
              </motion.div>
              
              {/* Password Field */}
              <motion.div variants={itemVariants}>
                <label className="text-sm font-medium mb-2 block text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-[#121927]/50 border-[#8B5CF6]/20 text-white"
                    placeholder="••••••••"
                    required
                  />
                  <div
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </div>
                </div>
              </motion.div>
              
              {/* Remember Me & Forgot Password */}
              <motion.div
                variants={itemVariants}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => 
                      setRememberMe(checked as boolean)
                    }
                    className="border-[#8B5CF6]/40 data-[state=checked]:bg-[#8B5CF6]"
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 text-sm text-gray-400 cursor-pointer"
                  >
                    Remember me
                  </label>
                </div>
                <a
                  href="#"
                  className="text-sm text-[#8B5CF6] hover:text-[#9F7AEA] transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.info("Password reset functionality will be implemented soon");
                  }}
                >
                  Forgot password?
                </a>
              </motion.div>
            </>
          ) : (
            /* Two-Factor Authentication Input */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <label className="text-sm font-medium mb-2 block text-gray-300">
                Verification Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ShieldIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  className="pl-10 bg-[#121927]/50 border-[#8B5CF6]/20 text-white"
                  placeholder="123456"
                  maxLength={6}
                />
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Enter the verification code sent to your device.
              </p>
            </motion.div>
          )}
          
          {/* Login Button */}
          <motion.div variants={itemVariants}>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] hover:opacity-90 transition-opacity"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <motion.div
                    className="h-5 w-5 border-2 border-white border-opacity-50 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span className="ml-2">
                    {showTwoFactor ? "Verifying..." : "Authenticating..."}
                  </span>
                </div>
              ) : (
                <span>{showTwoFactor ? "Verify Code" : "Login"}</span>
              )}
            </Button>
          </motion.div>
          
          {/* Back Button (shown only in 2FA mode) */}
          {showTwoFactor && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <button
                type="button"
                onClick={() => setShowTwoFactor(false)}
                className="text-gray-400 hover:text-white text-sm mt-2"
              >
                Back to login
              </button>
            </motion.div>
          )}
        </motion.form>
      </motion.div>
      
      {/* Custom CSS for animations */}
      <style>
        {`
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 10px rgba(139, 92, 246, 0.3); }
          50% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.6); }
        }
        
        .glow-effect {
          animation: glow 3s infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .float-animation {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        `}
      </style>
    </div>
  );
};

export default AdminAuthPage;
