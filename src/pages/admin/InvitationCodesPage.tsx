
import React from "react";
import InvitationCodeGenerator from "@/components/admin/InvitationCodeGenerator";
import InvitationCodeList from "@/components/admin/InvitationCodeList";

const InvitationCodesPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">Invitation Code Management</h1>
      
      <InvitationCodeGenerator className="bg-card" />
      
      <InvitationCodeList className="bg-card" />
    </div>
  );
};

export default InvitationCodesPage;
