
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDistance, format, addDays, differenceInCalendarDays, isAfter, isBefore, isSameDay, startOfDay } from "date-fns";
import { ArrowRight, Calendar, CheckCircle, Clock, LockIcon, Trophy, Unlock } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface DailyTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface WeeklyPlan {
  Monday: DailyTask[];
  Tuesday: DailyTask[];
  Wednesday: DailyTask[];
  Thursday: DailyTask[];
  Friday: DailyTask[];
  Saturday: DailyTask[];
  Sunday: DailyTask[];
}

interface ActionPlan {
  title: string;
  createdAt: string;
  duration: number;
  weeklyPlan: WeeklyPlan;
  goal: string;
  summary: string;
}

// Helper to get day name
const getDayName = (date: Date): keyof WeeklyPlan => {
  const dayName = format(date, 'EEEE') as keyof WeeklyPlan;
  return dayName;
};

export const ActionPlan = () => {
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [currentDay, setCurrentDay] = useState<keyof WeeklyPlan>(getDayName(new Date()));
  const [progress, setProgress] = useState(0);
  const [weekStartDate, setWeekStartDate] = useState<Date | null>(null);
  const [expandedDay, setExpandedDay] = useState<keyof WeeklyPlan | null>(null);
  
  useEffect(() => {
    // Load action plan from localStorage
    const storedPlan = localStorage.getItem('wizActionPlan');
    
    if (storedPlan) {
      try {
        const parsedPlan = JSON.parse(storedPlan);
        
        // If the plan doesn't have weeklyPlan structure, create a mock one
        if (!parsedPlan.weeklyPlan) {
          // Create a default structure
          const mockWeeklyPlan: WeeklyPlan = {
            Monday: [],
            Tuesday: [],
            Wednesday: [],
            Thursday: [],
            Friday: [],
            Saturday: [],
            Sunday: []
          };
          
          // Distribute existing tasks across days
          if (parsedPlan.tasks && Array.isArray(parsedPlan.tasks)) {
            const days = Object.keys(mockWeeklyPlan) as Array<keyof WeeklyPlan>;
            parsedPlan.tasks.forEach((task: DailyTask, index: number) => {
              const day = days[index % 7];
              mockWeeklyPlan[day].push(task);
            });
          }
          
          parsedPlan.weeklyPlan = mockWeeklyPlan;
          parsedPlan.goal = parsedPlan.summary || "Complete your weekly action plan";
          
          // Set week start date to today if not present
          if (!parsedPlan.weekStartDate) {
            // Set to the start of the current week (Monday)
            const today = new Date();
            const dayOfWeek = today.getDay(); // 0 for Sunday, 1 for Monday, etc.
            const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust for Monday as start of week
            const monday = new Date(today);
            monday.setDate(today.getDate() - diff);
            monday.setHours(0, 0, 0, 0);
            parsedPlan.weekStartDate = monday.toISOString();
          }
          
          // Update localStorage with converted plan
          localStorage.setItem('wizActionPlan', JSON.stringify(parsedPlan));
        }
        
        setActionPlan(parsedPlan);
        setWeekStartDate(new Date(parsedPlan.weekStartDate || parsedPlan.createdAt));
        
        // Automatically expand current day
        setExpandedDay(currentDay);
        
        // Count total and completed tasks
        let completed = 0;
        let total = 0;
        
        if (parsedPlan.weeklyPlan) {
          Object.values(parsedPlan.weeklyPlan).forEach((dayTasks: DailyTask[]) => {
            dayTasks.forEach(task => {
              total++;
              if (task.completed) completed++;
            });
          });
        }
        
        setCompletedTasks(completed);
        setTotalTasks(total);
        setProgress(total > 0 ? (completed / total) * 100 : 0);
        
      } catch (error) {
        console.error("Error parsing action plan:", error);
      }
    }
  }, [currentDay]);

  const isCurrentDayOrBefore = (day: keyof WeeklyPlan): boolean => {
    if (!weekStartDate) return false;
    
    const dayIndex = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(day);
    const dayDate = addDays(weekStartDate, dayIndex);
    const now = new Date();
    
    return !isAfter(startOfDay(dayDate), startOfDay(now));
  };
  
  const handleTaskToggle = (day: keyof WeeklyPlan, taskId: string) => {
    if (!actionPlan || !isCurrentDayOrBefore(day)) return;
    
    // Only allow toggling current day's tasks
    if (day !== currentDay) {
      toast.error("You can only complete tasks for the current day!");
      return;
    }
    
    const updatedWeeklyPlan = { ...actionPlan.weeklyPlan };
    const updatedDayTasks = updatedWeeklyPlan[day].map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    
    updatedWeeklyPlan[day] = updatedDayTasks;
    const updatedPlan = { ...actionPlan, weeklyPlan: updatedWeeklyPlan };
    setActionPlan(updatedPlan);
    
    // Count completed tasks
    let completed = 0;
    let total = 0;
    
    Object.values(updatedWeeklyPlan).forEach(dayTasks => {
      dayTasks.forEach(task => {
        total++;
        if (task.completed) completed++;
      });
    });
    
    setCompletedTasks(completed);
    setTotalTasks(total);
    setProgress(total > 0 ? (completed / total) * 100 : 0);
    
    // Save updated plan to localStorage
    localStorage.setItem('wizActionPlan', JSON.stringify(updatedPlan));
    
    // Trigger a storage event to notify other components about the change
    window.dispatchEvent(new Event('storage'));
    
    // Show toast message
    const isCompleted = updatedDayTasks.find(t => t.id === taskId)?.completed;
    if (isCompleted) {
      toast.success("Task marked as completed! Keep up the good work!");
      
      // Check if all tasks for the day are completed
      const allDayTasksCompleted = updatedDayTasks.every(task => task.completed);
      if (allDayTasksCompleted) {
        toast.success(`Great job! You've completed all tasks for ${day}!`, {
          duration: 5000,
          icon: <Trophy className="h-5 w-5 text-yellow-500" />
        });
      }
      
      // Check if all tasks for the week are completed
      if (completed === total) {
        toast.success("Congratulations! You've completed all tasks for the week and reached 100% progress toward your goal!", {
          duration: 8000,
          icon: <Trophy className="h-6 w-6 text-yellow-500" />
        });
      }
    }
  };
  
  const toggleDayExpansion = (day: keyof WeeklyPlan) => {
    if (expandedDay === day) {
      setExpandedDay(null);
    } else {
      setExpandedDay(day);
    }
  };
  
  if (!actionPlan) return null;
  
  const timeAgo = formatDistance(new Date(actionPlan.createdAt), new Date(), { addSuffix: true });
  const daysList = Object.keys(actionPlan.weeklyPlan) as Array<keyof WeeklyPlan>;
  
  return (
    <Card className="mb-6 border-border/40 bg-white shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg md:text-xl text-primary">{actionPlan.title}</CardTitle>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock size={14} className="mr-1" />
            Created {timeAgo}
          </div>
        </div>
        <CardDescription>
          Based on your {actionPlan.duration}s conversation with WIZ
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Goal */}
        <div className="mb-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium">Your Weekly Goal</h3>
          </div>
          <p className="text-sm text-muted-foreground">{actionPlan.goal}</p>
        </div>
        
        {/* Progress bar */}
        <div className="mb-6">
          <Progress value={progress} className="h-2 mb-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{completedTasks} of {totalTasks} tasks completed</span>
            <span>{progress.toFixed(0)}% complete</span>
          </div>
        </div>
        
        {/* Weekly Plan - Minimalistic version */}
        <div className="space-y-2">
          {daysList.map(day => {
            const dayTasks = actionPlan.weeklyPlan[day];
            const isAvailable = isCurrentDayOrBefore(day);
            const isToday = day === currentDay;
            const isExpanded = expandedDay === day;
            const completedDayTasks = dayTasks.filter(task => task.completed).length;
            const totalDayTasks = dayTasks.length;
            const dayProgress = totalDayTasks > 0 ? (completedDayTasks / totalDayTasks) * 100 : 0;
            
            return (
              <div 
                key={day}
                className={cn(
                  "rounded-lg border p-3",
                  isToday ? "border-primary/30 bg-primary/5" : "border-border/30",
                  !isAvailable && "opacity-60"
                )}
              >
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleDayExpansion(day)}
                >
                  <div className="flex items-center gap-2">
                    <h3 className={cn(
                      "font-medium",
                      isToday && "text-primary"
                    )}>
                      {day}
                      {isToday && (
                        <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                          Today
                        </span>
                      )}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-muted-foreground">
                      {completedDayTasks}/{totalDayTasks} tasks
                    </div>
                    
                    {!isAvailable ? (
                      <LockIcon size={14} className="text-muted-foreground" />
                    ) : (
                      isExpanded ? (
                        <ChevronUpIcon size={16} className="text-muted-foreground" />
                      ) : (
                        <ChevronDownIcon size={16} className="text-muted-foreground" />
                      )
                    )}
                  </div>
                </div>
                
                {/* Day progress mini-bar */}
                <div className="mt-2 mb-1">
                  <div className="h-1 w-full bg-muted/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary/60 rounded-full transition-all duration-300"
                      style={{ width: `${dayProgress}%` }}
                    />
                  </div>
                </div>
                
                {/* Expanded day tasks */}
                {isExpanded && (
                  <div className="mt-3 space-y-2 pt-2 border-t border-border/20">
                    {dayTasks.length === 0 ? (
                      <div className="text-sm text-muted-foreground p-2 text-center">
                        No tasks for this day
                      </div>
                    ) : (
                      dayTasks.map((task) => (
                        <div 
                          key={task.id} 
                          className={cn(
                            "flex items-start space-x-2 p-3 rounded-lg bg-background/50",
                            isAvailable ? "border border-border/30" : "border border-border/10"
                          )}
                        >
                          <Checkbox 
                            id={`task-${day}-${task.id}`} 
                            checked={task.completed}
                            onCheckedChange={() => handleTaskToggle(day, task.id)}
                            disabled={!isAvailable || day !== currentDay}
                            className="mt-1"
                          />
                          <div className="space-y-1">
                            <label 
                              htmlFor={`task-${day}-${task.id}`}
                              className={cn(
                                "font-medium cursor-pointer text-sm",
                                task.completed && "line-through text-muted-foreground"
                              )}
                            >
                              {task.title}
                            </label>
                            <p className="text-xs text-muted-foreground">{task.description}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Summary - condensed for minimalism */}
        <div className="mt-6 p-4 bg-muted/20 rounded-lg text-sm border border-border/20">
          <h3 className="font-medium mb-2">Plan Summary</h3>
          <p className="text-muted-foreground text-xs md:text-sm">{actionPlan.summary}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" size="sm" className="text-xs">
          <Calendar className="h-3 w-3 mr-1" />
          Add to calendar
        </Button>
        <Button variant="outline" size="sm" className="text-xs">
          Share progress
          <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

// Helper components for the icons
const ChevronDownIcon = ({ size = 24, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

const ChevronUpIcon = ({ size = 24, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m18 15-6-6-6 6"/>
  </svg>
);

export default ActionPlan;
