
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Shield, Mail, Lock, Eye, EyeOff, Info, Key, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import WizLogo from "@/components/WizLogo";

const AdminAuthPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated as admin
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate("/admin/invitation-codes");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const validateEmail = (email: string): boolean => {
    if (!email) {
      setEmailError("Email is required");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    
    setEmailError("");
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    }
    
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    
    setPasswordError("");
    return true;
  };

  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    if (!password) return { strength: 0, label: "None", color: "bg-gray-500" };
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    const labels = ["Weak", "Fair", "Good", "Strong"];
    const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"];
    
    return {
      strength,
      label: labels[strength],
      color: colors[strength]
    };
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (!isEmailValid || !isPasswordValid) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(email, password);
      // Redirection will be handled by the useEffect
    } catch (error) {
      console.error("Login error:", error);
      // Handle specific errors with custom animations
      toast.error("Invalid credentials. Please try again.");
      // Add shake animation to password field
      const passwordField = document.getElementById("admin-password");
      if (passwordField) {
        passwordField.classList.add("shake");
        setTimeout(() => {
          passwordField.classList.remove("shake");
        }, 500);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(password);

  // Don't render if already authenticated as admin (prevent flash)
  if (isAuthenticated && isAdmin) {
    return null;
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0D0F1A] text-white">
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
        
        {/* Main content - auth form */}
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
              <Shield className="h-8 w-8 text-[#8B5CF6]" />
            </div>
          </div>
          
          <Card className="bg-[#1E293B]/80 border-[#8B5CF6]/20 backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-white">Admin Access</CardTitle>
              <CardDescription className="text-gray-300">
                Sign in with your admin credentials to access the dashboard
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <TextField
                  label="Email"
                  id="admin-email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) validateEmail(e.target.value);
                  }}
                  icon={<Mail className="h-4 w-4" />}
                  error={emailError}
                  className="bg-[#121A29]/80 border-[#8B5CF6]/20 focus:border-[#8B5CF6]/50 text-white"
                />
                
                <div className="space-y-2">
                  <div className="relative">
                    <TextField
                      label="Password"
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (passwordError) validatePassword(e.target.value);
                      }}
                      icon={<Lock className="h-4 w-4" />}
                      error={passwordError}
                      className={`bg-[#121A29]/80 border-[#8B5CF6]/20 focus:border-[#8B5CF6]/50 text-white pr-10 ${
                        passwordError ? "shake" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-[34px] text-gray-400 hover:text-white focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  
                  {/* Password strength meter */}
                  {password && (
                    <div className="space-y-1 mt-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400">Strength: {passwordStrength.label}</span>
                      </div>
                      <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${passwordStrength.color} transition-all duration-300`} 
                          style={{ width: `${(passwordStrength.strength + 1) * 25}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="remember-me" 
                      checked={rememberMe} 
                      onCheckedChange={setRememberMe}
                    />
                    <label 
                      htmlFor="remember-me" 
                      className="text-sm text-gray-300 cursor-pointer"
                    >
                      Remember me
                    </label>
                  </div>
                  
                  <a 
                    href="#" 
                    className="text-sm text-[#A78BFA] hover:text-[#8B5CF6] transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
              </CardContent>
            
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] hover:opacity-90 text-white group relative overflow-hidden"
                  disabled={isLoading}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in
                      </>
                    ) : (
                      <>
                        <Key className="mr-2 h-4 w-4" />
                        Sign In
                      </>
                    )}
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] opacity-0 group-hover:opacity-100 group-hover:animate-pulse-soft transition-opacity"></span>
                </Button>
              </CardFooter>
            </form>
          </Card>
          
          <div className="mt-8 bg-[#1E293B]/50 p-4 rounded-xl border border-[#8B5CF6]/20">
            <div className="flex items-center mb-2">
              <Info className="h-4 w-4 text-[#A78BFA] mr-2" />
              <p className="text-sm text-[#A78BFA] font-medium">Secure Access Only</p>
            </div>
            <p className="text-xs text-gray-400">
              This area is restricted to authorized administrators only. If you're looking for user access, please use the regular login page.
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
      
      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .shake {
          animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
        
        @keyframes pulse-soft {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default AdminAuthPage;
