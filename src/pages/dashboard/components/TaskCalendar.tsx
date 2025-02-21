
import React from "react";
import { Check, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface TaskCalendarProps {
  tasks: Task[];
}

export function TaskCalendar({ tasks }: TaskCalendarProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-xl border-border/50 shadow-lg">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1.5">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">Today's Tasks</h3>
            <p className="text-sm text-muted-foreground">Track your daily progress</p>
          </div>
          <Calendar className="w-5 h-5 text-muted-foreground" />
        </div>

        <div className="space-y-3 mb-6">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 p-4 rounded-lg bg-accent/50 backdrop-blur-sm border border-border/50"
            >
              <Button
                variant={task.completed ? "default" : "outline"}
                size="sm"
                className={`
                  h-8 w-8 p-0 rounded-full shrink-0
                  ${task.completed 
                    ? "bg-primary hover:bg-primary/90" 
                    : "border-primary text-primary hover:bg-primary/10"
                  }
                  transition-colors duration-300
                `}
              >
                <Check className="w-4 h-4" />
              </Button>
              <span className={`flex-1 text-sm ${task.completed ? "text-muted-foreground line-through" : "text-foreground"}`}>
                {task.title}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 md:gap-4">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
            <div
              key={day}
              className={`
                p-3 md:p-4 rounded-lg border transition-colors duration-300 text-center
                ${i === 0 
                  ? "bg-primary/10 border-primary" 
                  : "bg-accent/50 backdrop-blur-sm border-border/50"
                }
              `}
            >
              <p className="text-xs md:text-sm font-medium mb-2 text-foreground">{day}</p>
              <div className="space-y-1.5">
                <div className="w-full h-1 rounded bg-primary/40" />
                <div className="w-2/3 h-1 rounded bg-primary/40" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
