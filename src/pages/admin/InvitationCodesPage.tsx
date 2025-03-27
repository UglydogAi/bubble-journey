
import React, { useEffect, useState } from "react";
import InvitationCodeGenerator from "@/components/admin/InvitationCodeGenerator";
import InvitationCodeList from "@/components/admin/InvitationCodeList";
import AdminUserCreator from "@/components/admin/AdminUserCreator";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, Key, Lock, UserPlus, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Navigate, useNavigate } from "react-router-dom";

const InvitationCodesPage: React.FC = () => {
  const { isAdmin, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showAdminCreator, setShowAdminCreator] = useState(true);
  
  // Check if authenticated and admin, redirect if not
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('/auth');
      } else if (!isAdmin) {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-amber-950">
        <div className="text-amber-400 flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-transparent border-amber-400 rounded-full animate-spin mb-4"></div>
          <p>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // If not admin or not authenticated, don't render anything (redirect will happen due to useEffect)
  if (!isAuthenticated || !isAdmin) {
    return null;
  }
  
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-amber-950 via-orange-900 to-amber-900 text-amber-50">
      {/* Animated particles background - different from auth page */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-amber-500 rounded-full opacity-20"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              repeatType: "reverse",
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>
      
      {/* Centered radial gradient */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(circle at center, rgba(251,146,60,0.4) 0%, rgba(0,0,0,0) 70%)",
        }}
      />
      
      <div className="container mx-auto p-6 space-y-8 relative z-10">
        <motion.div
          className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 p-6 rounded-xl border border-amber-500/30 shadow-lg backdrop-blur-sm mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center mr-3 shadow-inner">
                <Lock className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-amber-50">Admin Control Panel</h1>
                <p className="text-amber-200/70">System administration dashboard for invitation codes and admin access</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline"
                size="sm"
                className="flex items-center gap-2 border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                asChild
              >
                <a href="/dashboard">
                  <UserPlus className="h-4 w-4" />
                  <span>Dashboard</span>
                </a>
              </Button>
              
              <div className="flex items-center gap-2 bg-amber-500/20 text-amber-400 px-4 py-2 rounded-full text-sm shadow-inner">
                <Shield className="h-4 w-4" />
                <span className="font-medium">Admin Area</span>
              </div>
            </div>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <InvitationCodeGenerator className="bg-amber-900/40 backdrop-blur-sm border-amber-500/20 shadow-lg shadow-amber-900/20 h-full" />
          </motion.div>
          
          {showAdminCreator && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <AdminUserCreator className="h-full" onSuccess={() => setShowAdminCreator(false)} />
            </motion.div>
          )}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <InvitationCodeList className="bg-amber-900/40 backdrop-blur-sm border border-amber-500/20 shadow-lg shadow-amber-900/20" />
        </motion.div>

        {/* Information panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-amber-900/40 backdrop-blur-sm border border-amber-500/20 shadow-lg shadow-amber-900/20 p-4 rounded-lg mt-8"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex-shrink-0 flex items-center justify-center">
              <Key className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-amber-100">Admin Dashboard</h3>
              <p className="text-amber-200/70 text-sm mt-1">
                This dashboard is only accessible to admin users. Here you can manage invitation codes and create new admin accounts.
              </p>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-amber-900/40 p-3 rounded-lg border border-amber-500/30">
                  <h4 className="text-amber-300 font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Admin Management
                  </h4>
                  <p className="text-amber-200/70 text-xs mt-1">
                    Create new administrator accounts with full system access
                  </p>
                </div>
                <div className="bg-amber-900/40 p-3 rounded-lg border border-amber-500/30">
                  <h4 className="text-amber-300 font-medium flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    Invitation Codes
                  </h4>
                  <p className="text-amber-200/70 text-xs mt-1">
                    Generate and manage invitation codes for new user registrations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InvitationCodesPage;
