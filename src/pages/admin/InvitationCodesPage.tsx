
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import InvitationCodeGenerator from "@/components/admin/InvitationCodeGenerator";
import InvitationCodeList from "@/components/admin/InvitationCodeList";
import AdminUserCreator from "@/components/admin/AdminUserCreator";
import AdminDashboardHeader from "./AdminDashboardHeader";
import AdminSettingsPanel from "@/components/admin/AdminSettingsPanel";
import AdminNotificationsPanel from "@/components/admin/AdminNotificationsPanel";

interface InvitationCodesPageProps {}

const InvitationCodesPage: React.FC<InvitationCodesPageProps> = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("list");
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(true);

  // Toggle notifications indicator after viewing notifications
  const handleNotificationsClose = () => {
    setShowNotifications(false);
    setHasNewNotifications(false);
  };

  return (
    <div className="min-h-screen bg-[#0D0F1A] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header with Logout */}
        <AdminDashboardHeader 
          title="Admin Dashboard" 
          subtitle="Manage invitation codes and admin accounts"
          hasNotifications={hasNewNotifications}
          onSettingsClick={() => setShowSettings(true)}
        />
        
        {/* Settings Dialog */}
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogContent className="sm:max-w-[600px] bg-transparent border-0 p-0">
            <AdminSettingsPanel onClose={() => setShowSettings(false)} />
          </DialogContent>
        </Dialog>
        
        {/* Notifications Dialog */}
        <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
          <DialogContent className="sm:max-w-[500px] bg-transparent border-0 p-0">
            <AdminNotificationsPanel onClose={handleNotificationsClose} />
          </DialogContent>
        </Dialog>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar/Stats Panel */}
          <Card className="bg-[#1E293B]/70 border-[#8B5CF6]/20 p-5 col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">Total Invitations</p>
                <p className="text-2xl font-bold">127</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-400">Used Invitations</p>
                <p className="text-2xl font-bold">98</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-400">Available Invitations</p>
                <p className="text-2xl font-bold text-green-400">29</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-400">Admin Users</p>
                <p className="text-2xl font-bold text-purple-400">3</p>
              </div>
            </div>
            
            {/* Button to open notifications panel */}
            <div className="mt-6">
              <button 
                onClick={() => setShowNotifications(true)}
                className="w-full py-2.5 px-4 rounded-md bg-purple-500/20 text-purple-200 hover:bg-purple-500/30 transition-colors flex items-center justify-center gap-2"
              >
                <span>View Notifications</span>
                {hasNewNotifications && (
                  <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                )}
              </button>
            </div>
          </Card>
          
          {/* Main Content Area */}
          <Card className="bg-[#1E293B]/70 border-[#8B5CF6]/20 p-5 md:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <TabsList className="bg-[#121927]/50">
                  <TabsTrigger value="list">Invitation Codes</TabsTrigger>
                  <TabsTrigger value="generate">Generate Codes</TabsTrigger>
                  <TabsTrigger value="admin">Admin Users</TabsTrigger>
                </TabsList>
                
                {activeTab === "list" && (
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      className="pl-8 bg-[#121927]/50 border-[#8B5CF6]/20 text-white w-full"
                      placeholder="Search codes or emails..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                )}
              </div>
              
              <TabsContent value="list" className="mt-0">
                <InvitationCodeList searchTerm={searchTerm} />
              </TabsContent>
              
              <TabsContent value="generate" className="mt-0">
                <InvitationCodeGenerator />
              </TabsContent>
              
              <TabsContent value="admin" className="mt-0">
                <AdminUserCreator />
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InvitationCodesPage;
