
import React from "react";
import { NotificationPreferences } from "./NotificationPreferences";

interface SettingsViewProps {
  notificationPreference: string;
  onPreferenceChange: (preference: string) => void;
}

export function SettingsView({ 
  notificationPreference, 
  onPreferenceChange 
}: SettingsViewProps) {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="space-y-1.5 mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>
      <NotificationPreferences
        preference={notificationPreference}
        onPreferenceChange={onPreferenceChange}
      />
    </div>
  );
}
