
import React from "react";
import { Trophy, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function WeeklyFocus() {
  return (
    <Card className="bg-card/50 backdrop-blur-xl border-border/30 shadow-lg mt-2 md:mt-0">
      <CardContent className="p-3 md:p-8">
        <div className="flex items-center justify-between mb-3 md:mb-8">
          <div className="space-y-0.5 md:space-y-2">
            <h2 className="text-lg md:text-xl font-semibold tracking-tight text-foreground">
              This Week's Focus
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground">
              Stay consistent with your daily goals
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex border-primary/50 text-primary 
              hover:bg-primary/10 transition-colors duration-300
              hover:border-primary"
          >
            Edit Goals
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
          {[
            { title: "Exercise 4x", subtitle: "This week" },
            { title: "Read Daily", subtitle: "20 pages" },
            { title: "Meditate", subtitle: "10 minutes" }
          ].map((goal, index) => (
            <div
              key={index}
              className="group flex items-center gap-2 md:gap-4 p-2.5 md:p-5 rounded-lg 
                bg-accent/30 backdrop-blur-sm border border-border/30 
                hover:bg-accent/40 transition-all duration-300
                hover:border-border/50"
            >
              <div className="w-9 h-9 md:w-12 md:h-12 rounded-full bg-primary/20 
                flex items-center justify-center shrink-0
                group-hover:bg-primary/30 transition-colors duration-300">
                <Trophy className="w-4.5 h-4.5 md:w-6 md:h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm md:text-base text-foreground truncate">{goal.title}</p>
                <p className="text-xs md:text-sm text-muted-foreground">{goal.subtitle}</p>
              </div>
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground/40 
                group-hover:text-muted-foreground/60 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
