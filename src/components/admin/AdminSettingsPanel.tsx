
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { TextField } from "@/components/ui/text-field";
import { toast } from "sonner";
import { 
  Save, 
  Bell, 
  ShieldAlert, 
  Fingerprint, 
  Database, 
  ActivitySquare,
  CheckCircle
} from "lucide-react";

interface AdminSettingsPanelProps {
  onClose: () => void;
}

const AdminSettingsPanel: React.FC<AdminSettingsPanelProps> = ({ onClose }) => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [auditLogging, setAuditLogging] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [apiKey, setApiKey] = useState("sk_live_wiz_admin_xxxxxxxxxxxxx");
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Settings saved successfully", {
        description: "Your admin dashboard settings have been updated.",
        icon: <CheckCircle className="h-4 w-4 text-green-500" />
      });
      onClose();
    }, 800);
  };
  
  return (
    <Card className="bg-[#1E293B]/70 border-purple-500/20 shadow-lg w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl text-white flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-purple-400" />
          Admin Dashboard Settings
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-md font-medium text-gray-200 flex items-center gap-2">
            <Bell className="h-4 w-4 text-purple-400" />
            Notification Settings
          </h3>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications" className="text-sm text-gray-300">
                Email Notifications
              </Label>
              <Switch 
                id="email-notifications" 
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="audit-logging" className="text-sm text-gray-300">
                Audit Logging
              </Label>
              <Switch 
                id="audit-logging" 
                checked={auditLogging}
                onCheckedChange={setAuditLogging}
              />
            </div>
          </div>
        </div>
        
        <Separator className="bg-gray-700" />
        
        <div className="space-y-4">
          <h3 className="text-md font-medium text-gray-200 flex items-center gap-2">
            <Fingerprint className="h-4 w-4 text-purple-400" />
            Security Settings
          </h3>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="two-factor" className="text-sm text-gray-300">
                Two-Factor Authentication
              </Label>
              <Switch 
                id="two-factor" 
                checked={twoFactorAuth}
                onCheckedChange={setTwoFactorAuth}
              />
            </div>
          </div>
        </div>
        
        <Separator className="bg-gray-700" />
        
        <div className="space-y-4">
          <h3 className="text-md font-medium text-gray-200 flex items-center gap-2">
            <Database className="h-4 w-4 text-purple-400" />
            API Configuration
          </h3>
          <TextField
            label="API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            icon={<ActivitySquare className="h-4 w-4" />}
            className="bg-[#121927]/50 border-gray-700"
          />
        </div>
        
        <div className="flex justify-end gap-3 pt-4">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveSettings} 
            disabled={isSaving}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isSaving ? "Saving..." : "Save Settings"}
            {!isSaving && <Save className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminSettingsPanel;
