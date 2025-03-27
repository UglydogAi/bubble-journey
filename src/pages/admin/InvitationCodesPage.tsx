
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AdminDashboardHeader from "./AdminDashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TextField } from "@/components/ui/text-field";
import { InvitationCodeGenerator } from "@/components/admin/InvitationCodeGenerator";
import { InvitationCodeList } from "@/components/admin/InvitationCodeList";
import { AdminUserCreator } from "@/components/admin/AdminUserCreator";
import StatsOverview from "./dashboard/StatsOverview";
import InvitationChart from "./dashboard/InvitationChart";
import { Search, Plus, Download, Filter } from "lucide-react";
import { motion } from "framer-motion";

const InvitationCodesPage: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  
  return (
    <div className="min-h-screen bg-[#0D0F1A] text-white">
      {/* Animated background gradient */}
      <div 
        className="absolute inset-0 bg-[#0D0F1A] z-0 overflow-hidden"
        style={{
          backgroundImage: `
            radial-gradient(circle at 15% 50%, rgba(139,92,246,0.1) 0%, transparent 25%),
            radial-gradient(circle at 85% 30%, rgba(217,70,239,0.1) 0%, transparent 25%)
          `
        }}
      >
        {/* Stars */}
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
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-6 max-w-7xl">
        <AdminDashboardHeader 
          title="Admin Dashboard" 
          subtitle="Manage invitation codes and user access"
        />
        
        <div className="mt-8">
          <StatsOverview />
          
          <InvitationChart />
          
          <div className="mb-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-[#1E293B]/80 backdrop-blur-sm border border-[#8B5CF6]/20 rounded-xl p-5"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h3 className="text-lg font-semibold text-white">Generate Invitation Codes</h3>
                
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <Button
                    className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white w-full sm:w-auto"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Admin User
                  </Button>
                </div>
              </div>
              
              <AdminUserCreator />
              <InvitationCodeGenerator />
            </motion.div>
          </div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-[#1E293B]/80 backdrop-blur-sm border border-[#8B5CF6]/20 rounded-xl p-5"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h3 className="text-lg font-semibold text-white">Invitation Codes</h3>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search codes..."
                    className="pl-9 bg-[#121A29]/80 border-[#8B5CF6]/20 text-white w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="border-[#8B5CF6]/20 text-gray-400 hover:text-white">
                    <Filter className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="outline" size="icon" className="border-[#8B5CF6]/20 text-gray-400 hover:text-white">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="animate-fade-in">
              <InvitationCodeList searchTerm={searchTerm} />
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 10px rgba(139, 92, 246, 0.3); }
          50% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.6); }
        }
        
        .glow-effect {
          animation: glow 3s infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .float-animation {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default InvitationCodesPage;
