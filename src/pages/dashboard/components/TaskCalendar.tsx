import React, { useState } from "react";
import { Check, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface TaskCalendarProps {
  tasks: Task[];
}

export function TaskCalendar({ tasks }: TaskCalendarProps) {
  const [selectedDay, setSelectedDay] = useState(0);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  const scrollContainer = React.useRef<HTMLDivElement>(null);
  
  const handleScrollLeft = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({ left: -100, behavior: 'smooth' });
    }
  };
  
  const handleScrollRight = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({ left: 100, behavior: 'smooth' });
    }
  };

  const handleDaySelect = (index: number) => {
    setSelectedDay(index);
  };

  const filteredTasks = tasks.filter((_, index) => {
    return index % days.length === selectedDay;
  });

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
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-4 rounded-lg bg-accent/50 backdrop-blur-sm border border-border/50 animate-fade-in"
              >
                <Button
                  variant={task.completed ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "h-8 w-8 p-0 rounded-full shrink-0",
                    task.completed 
                      ? "bg-primary hover:bg-primary/90" 
                      : "border-primary text-primary hover:bg-primary/10",
                    "transition-colors duration-300"
                  )}
                >
                  <Check className="w-4 h-4" />
                </Button>
                <span className={`flex-1 text-sm ${task.completed ? "text-muted-foreground line-through" : "text-foreground"}`}>
                  {task.title}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No tasks for this day
            </div>
          )}
        </div>

        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 md:hidden bg-background/80 backdrop-blur-sm"
            onClick={handleScrollLeft}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div 
            ref={scrollContainer}
            className="flex overflow-x-auto md:grid md:grid-cols-7 gap-2 md:gap-4 no-scrollbar pb-1"
          >
            {days.map((day, i) => (
              <div
                key={day}
                className={cn(
                  "p-2.5 md:p-4 rounded-lg border transition-all duration-300 min-w-[60px] md:min-w-0 text-center cursor-pointer hover:bg-primary/20",
                  i === selectedDay 
                    ? "bg-primary/20 border-primary" 
                    : "bg-accent/50 backdrop-blur-sm border-border/50",
                  "transform hover:scale-105 active:scale-95"
                )}
                onClick={() => handleDaySelect(i)}
              >
                <p className="text-xs md:text-sm font-medium mb-2 text-foreground">{day}</p>
                <div className="space-y-1.5">
                  <div className={cn(
                    "w-full h-1 rounded", 
                    i === selectedDay ? "bg-primary/70" : "bg-primary/40"
                  )} />
                  <div className={cn(
                    "w-2/3 h-1 rounded", 
                    i === selectedDay ? "bg-primary/70" : "bg-primary/40"
                  )} />
                </div>
              </div>
            ))}
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 md:hidden bg-background/80 backdrop-blur-sm"
            onClick={handleScrollRight}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <style jsx>{`
          .no-scrollbar {
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none; /* Chrome, Safari, Opera */
          }
        `}</style>
      </CardContent>
    </Card>
  );
}
