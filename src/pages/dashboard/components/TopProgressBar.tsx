
import React from "react";
import { Sun, Moon, Coins } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Toggle } from "@/components/ui/toggle";
import { useTheme } from "next-themes";

interface TopProgressBarProps {
  dailyProgress: number;
  ogPoints: number;
}

export function TopProgressBar({ dailyProgress, ogPoints }: TopProgressBarProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4 py-2">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
          <div className="w-full sm:flex-1 sm:max-w-2xl">
            <Progress 
              value={dailyProgress} 
              className="h-2"
            />
            <p className="text-sm mt-1 text-muted-foreground text-center sm:text-left">
              {dailyProgress}% Complete – Keep Going, Legend!
            </p>
          </div>
          <div className="flex items-center gap-4 mt-2 sm:mt-0 sm:ml-4">
            <Toggle
              pressed={theme === "dark"}
              onPressedChange={(pressed) => setTheme(pressed ? "dark" : "light")}
              className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors duration-300"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-primary" />
              ) : (
                <Moon className="w-5 h-5 text-primary" />
              )}
            </Toggle>
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-primary" />
              <span className="font-bold">{ogPoints}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
