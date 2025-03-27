
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogOut, Bell, User, Settings } from "lucide-react";
import { motion } from "framer-motion";
import WizLogo from "@/components/WizLogo";

interface AdminDashboardHeaderProps {
  title: string;
  subtitle?: string;
}

const AdminDashboardHeader: React.FC<AdminDashboardHeaderProps> = ({ 
  title,
  subtitle = "Manage your application resources"
}) => {
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center">
          <div className="relative w-10 h-10 flex items-center justify-center mr-3">
            <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-md"></div>
            <LayoutDashboard className="w-5 h-5 text-purple-400" />
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            <p className="text-sm text-gray-400">{subtitle}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="relative"
          >
            <Bell className="h-5 w-5 text-gray-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
          >
            <Settings className="h-5 w-5 text-gray-400" />
          </Button>
          
          <div className="h-6 w-px bg-gray-700 mx-1"></div>
          
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-medium">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            
            <div className="hidden md:block">
              <p className="text-sm font-medium text-white">{user?.email || 'Admin'}</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleLogout}
            className="text-gray-400 hover:text-white hover:bg-red-500/20"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <motion.div 
        className="h-px w-full bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
};

export default AdminDashboardHeader;
