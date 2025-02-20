
import React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface NotificationPreferencesProps {
  preference: string;
  onPreferenceChange: (preference: string) => void;
}

export function NotificationPreferences({ 
  preference, 
  onPreferenceChange 
}: NotificationPreferencesProps) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-accent border border-border">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Daily Reminders</p>
                <p className="text-sm text-muted-foreground">Get notified about your tasks</p>
              </div>
            </div>
            <div className="flex gap-2">
              {["WhatsApp", "Telegram"].map((platform) => (
                <Button
                  key={platform}
                  variant={preference === platform.toLowerCase() ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPreferenceChange(platform.toLowerCase())}
                  className={`
                    ${preference === platform.toLowerCase()
                      ? "bg-primary hover:bg-primary/90"
                      : "border-primary text-primary hover:bg-primary/10"
                    }
                    transition-colors duration-300
                  `}
                >
                  {platform}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
