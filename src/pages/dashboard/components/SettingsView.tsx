
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BellRing, Mail, MessageSquare, Upload, User, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface SettingsViewProps {
  notificationPreference: string;
  onPreferenceChange: (preference: string) => void;
}

export function SettingsView({ 
  notificationPreference, 
  onPreferenceChange 
}: SettingsViewProps) {
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load profile image from localStorage if exists
    const savedImage = localStorage.getItem('wizProfileImage');
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          const imageData = event.target.result as string;
          setProfileImage(imageData);
          // Save to localStorage for persistence
          localStorage.setItem('wizProfileImage', imageData);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = () => {
    setSaving(true);
    
    // Simulate saving settings
    setTimeout(() => {
      toast.success("Settings saved successfully");
      setSaving(false);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold">Settings</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Profile Settings
            </CardTitle>
            <CardDescription>
              Manage your personal information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-background bg-muted">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted text-4xl text-muted-foreground">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              
              <Label htmlFor="profile-image" className="cursor-pointer">
                <div className="flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-muted/50 hover:bg-muted transition-colors">
                  <Upload className="h-4 w-4" />
                  <span>Upload Photo</span>
                </div>
                <Input 
                  id="profile-image" 
                  type="file" 
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="display-name">Display Name</Label>
              <Input 
                id="display-name" 
                defaultValue={user?.email?.split('@')[0] || 'User'} 
                className="bg-card/50" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                value={user?.email || 'user@example.com'} 
                disabled 
                className="bg-card/50" 
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Card */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BellRing className="h-5 w-5 text-primary" />
              Notification Settings
            </CardTitle>
            <CardDescription>
              Manage how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={notificationPreference}
              onValueChange={onPreferenceChange}
              className="space-y-4"
            >
              <div className="flex items-start space-x-3 space-y-0">
                <RadioGroupItem value="email" id="email" />
                <div className="flex flex-col gap-1">
                  <Label
                    htmlFor="email"
                    className="font-normal cursor-pointer flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Email
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 space-y-0">
                <RadioGroupItem value="whatsapp" id="whatsapp" />
                <div className="flex flex-col gap-1">
                  <Label
                    htmlFor="whatsapp"
                    className="font-normal cursor-pointer flex items-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    WhatsApp
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Receive notifications via WhatsApp
                  </p>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>

      <Button 
        onClick={handleSaveSettings} 
        className="w-full md:w-auto px-8"
        disabled={saving}
      >
        {saving ? (
          <>
            <span className="mr-2">Saving...</span>
          </>
        ) : (
          <>
            <Check className="mr-2 h-4 w-4" />
            Save Changes
          </>
        )}
      </Button>
    </div>
  );
}
