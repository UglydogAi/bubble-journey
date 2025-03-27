
import React from "react";
import InvitationCodeGenerator from "@/components/admin/InvitationCodeGenerator";
import InvitationCodeList from "@/components/admin/InvitationCodeList";
import AdminUserCreator from "@/components/admin/AdminUserCreator";
import { useAuth } from "@/contexts/AuthContext";
import { Shield } from "lucide-react";
import { motion } from "framer-motion";

const InvitationCodesPage: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="container mx-auto p-4 space-y-8 min-h-screen">
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">Invitation Code Management</h1>
        
        <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm shadow-sm">
          <Shield className="h-4 w-4" />
          <span>Admin Access</span>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <InvitationCodeGenerator className="bg-card h-full" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AdminUserCreator className="bg-card h-full" />
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <InvitationCodeList className="bg-card" />
      </motion.div>

      {/* Direct link to auth page at the bottom */}
      <motion.div 
        className="flex justify-center mt-12 pb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <a 
          href="/auth" 
          className="text-sm text-primary/80 hover:text-primary transition-colors"
        >
          Go to Authentication Page →
        </a>
      </motion.div>
    </div>
  );
};

export default InvitationCodesPage;
