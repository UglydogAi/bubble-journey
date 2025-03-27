
import React from "react";
import InvitationCodeGenerator from "@/components/admin/InvitationCodeGenerator";
import InvitationCodeList from "@/components/admin/InvitationCodeList";
import AdminUserCreator from "@/components/admin/AdminUserCreator";
import { useAuth } from "@/contexts/AuthContext";
import { Shield } from "lucide-react";

const InvitationCodesPage: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Invitation Code Management</h1>
        
        <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
          <Shield className="h-4 w-4" />
          <span>Admin Access</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InvitationCodeGenerator className="bg-card" />
        <AdminUserCreator className="bg-card" />
      </div>
      
      <InvitationCodeList className="bg-card" />
    </div>
  );
};

export default InvitationCodesPage;
