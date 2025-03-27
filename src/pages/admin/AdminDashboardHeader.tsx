
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  LogOut, 
  Bell, 
  Settings, 
  User as UserIcon 
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface AdminDashboardHeaderProps {
  title: string;
  subtitle?: string;
  hasNotifications?: boolean;
  onSettingsClick?: () => void;
  onNotificationsClick?: () => void;
}

const AdminDashboardHeader: React.FC<AdminDashboardHeaderProps> = ({ 
  title,
  subtitle = "Manage your application resources",
  hasNotifications = false,
  onSettingsClick,
  onNotificationsClick
}) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/auth');
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
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
            onClick={onNotificationsClick}
          >
            <Bell className="h-5 w-5 text-gray-400" />
            {hasNotifications && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onSettingsClick}
          >
            <Settings className="h-5 w-5 text-gray-400" />
          </Button>
          
          <div className="h-6 w-px bg-gray-700 mx-1"></div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer hover:opacity-80">
                <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-medium">
                  {user?.email?.charAt(0).toUpperCase() || 'A'}
                </div>
                
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-white">{user?.email || 'Admin'}</p>
                  <p className="text-xs text-gray-400">Administrator</p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="p-2 bg-[#1E293B] border-purple-500/20">
              <DropdownMenuItem className="flex items-center gap-2 text-gray-200 hover:text-white cursor-pointer">
                <UserIcon className="h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="flex items-center gap-2 text-red-400 hover:text-red-300 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
