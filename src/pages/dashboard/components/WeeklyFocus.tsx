
import React from "react";
import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function WeeklyFocus() {
  return (
    <Card className="bg-card/50 backdrop-blur-xl border-border/50 mb-6 shadow-lg">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold mb-2 text-foreground">This Week's Focus</h2>
            <p className="text-muted-foreground">Stay consistent with your daily goals</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-primary text-primary hover:bg-primary/10 transition-colors duration-300"
          >
            Edit Goals
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50 backdrop-blur-sm border border-border/50">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Exercise 4x</p>
              <p className="text-sm text-muted-foreground">This week</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
