
import React from "react";
import { Trophy, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function WeeklyFocus() {
  return (
    <Card className="bg-card/50 backdrop-blur-xl border-border/50 shadow-lg">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1.5">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">This Week's Focus</h2>
            <p className="text-sm text-muted-foreground">Stay consistent with your daily goals</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex border-primary text-primary hover:bg-primary/10 transition-colors duration-300"
          >
            Edit Goals
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { title: "Exercise 4x", subtitle: "This week" },
            { title: "Read Daily", subtitle: "20 pages" },
            { title: "Meditate", subtitle: "10 minutes" }
          ].map((goal, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-4 rounded-lg bg-accent/50 backdrop-blur-sm border border-border/50 hover:bg-accent/60 transition-colors duration-300"
            >
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{goal.title}</p>
                <p className="text-sm text-muted-foreground">{goal.subtitle}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
