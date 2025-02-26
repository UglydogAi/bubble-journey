
import React, { useCallback, useState } from "react";
import { NotificationPreferences } from "./NotificationPreferences";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SettingsViewProps {
  notificationPreference: string;
  onPreferenceChange: (preference: string) => void;
}

export function SettingsView({ 
  notificationPreference, 
  onPreferenceChange 
}: SettingsViewProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch the current user's profile on component mount
  React.useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', user.id)
          .single();
        
        if (profile?.avatar_url) {
          setAvatarUrl(profile.avatar_url);
        }
      }
    }
    fetchProfile();
  }, []);

  const uploadAvatar = useCallback(async (file: File) => {
    try {
      setIsUploading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile picture",
        variant: "destructive",
      });
      console.error('Error:', error);
    } finally {
      setIsUploading(false);
    }
  }, [toast]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Error",
          description: "File size should be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      uploadAvatar(file);
    }
  }, [uploadAvatar, toast]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pt-16 md:pt-20">
      <div className="space-y-1.5">
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight">Settings</h2>
        <p className="text-sm md:text-base text-muted-foreground">Manage your account preferences</p>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Profile Picture</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-muted">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10">
                    <Camera className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              {isUploading && (
                <div className="absolute inset-0 bg-background/80 rounded-full flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Button
                variant="outline"
                className="relative"
                disabled={isUploading}
              >
                Upload New Picture
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </Button>
              <p className="text-sm text-muted-foreground">
                Recommended: Square image, maximum 5MB
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <NotificationPreferences
        preference={notificationPreference}
        onPreferenceChange={onPreferenceChange}
      />
    </div>
  );
}
