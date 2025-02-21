
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
    <Card className="bg-card/50 backdrop-blur-xl border-border/50 shadow-lg">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1.5">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">Notification Preferences</h3>
            <p className="text-sm text-muted-foreground">Choose how you want to be notified</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-accent/50 backdrop-blur-sm border border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Daily Reminders</p>
                <p className="text-sm text-muted-foreground">Get notified about your tasks</p>
              </div>
            </div>
            <div className="flex gap-2 self-end sm:self-auto">
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
