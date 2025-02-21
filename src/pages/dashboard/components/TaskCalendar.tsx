
import React from "react";
import { Check } from "lucide-react";
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
    <Card className="bg-card/50 backdrop-blur-xl border-border/50 mb-6 shadow-lg">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-foreground">Today's Tasks</h3>
          <div className="flex gap-2">
            {tasks.map((task) => (
              <Button
                key={task.id}
                variant={task.completed ? "default" : "outline"}
                size="sm"
                className={`
                  ${task.completed 
                    ? "bg-primary hover:bg-primary/90" 
                    : "border-primary text-primary hover:bg-primary/10"
                  }
                  transition-colors duration-300
                `}
              >
                <Check className="w-4 h-4 mr-2" />
                {task.title}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-4 mb-6">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className={`
                p-4 rounded-lg border transition-colors duration-300
                ${i === 0 
                  ? "bg-primary/10 border-primary" 
                  : "bg-accent/50 backdrop-blur-sm border-border/50"
                }
              `}
            >
              <p className="text-sm font-medium mb-1 text-foreground">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
              </p>
              <div className="space-y-2">
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
