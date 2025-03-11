
import React, { useCallback, useState, useEffect } from "react";
import { NotificationPreferences } from "./NotificationPreferences";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface SettingsViewProps {
  notificationPreference: string;
  onPreferenceChange: (preference: string) => void;
}

interface Profile {
  id: string;
  avatar_url: string | null;
  updated_at?: string;
}

export function SettingsView({ 
  notificationPreference, 
  onPreferenceChange 
}: SettingsViewProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch the current user's profile on component mount
  useEffect(() => {
    async function fetchProfile() {
      setIsLoading(true);
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        
        if (!user) {
          setAuthError("You need to be logged in to view settings");
          setIsLoading(false);
          return;
        }
        
        // Use the correct table name based on what we created in the SQL migration
        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', user.id)
          .single();
        
        if (profileError) throw profileError;
        
        if (data?.avatar_url) {
          setAvatarUrl(data.avatar_url);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setAuthError("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const uploadAvatar = useCallback(async (file: File) => {
    try {
      setIsUploading(true);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "You need to be logged in to upload a profile picture",
          variant: "destructive",
        });
        return;
      }

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Use the correct table name based on what we created in the SQL migration
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

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto pt-20 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading settings...</span>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="max-w-5xl mx-auto pt-20">
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center p-6">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <h3 className="text-xl font-semibold mb-2">Authentication Required</h3>
              <p className="text-muted-foreground mb-4">{authError}</p>
              <Button onClick={() => window.location.href = "/auth"}>
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              <Avatar className="w-24 h-24">
                {avatarUrl ? (
                  <AvatarImage 
                    src={avatarUrl} 
                    alt="Profile" 
                    className="object-cover"
                  />
                ) : (
                  <AvatarFallback className="bg-primary/10">
                    <Camera className="w-8 h-8 text-muted-foreground" />
                  </AvatarFallback>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-background/80 rounded-full flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                )}
              </Avatar>
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
