
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDistance } from "date-fns";
import { ArrowRight, Calendar, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";

interface ActionPlanTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface ActionPlan {
  title: string;
  createdAt: string;
  duration: number;
  tasks: ActionPlanTask[];
  summary: string;
}

export const ActionPlan = () => {
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [completedTasks, setCompletedTasks] = useState(0);
  
  useEffect(() => {
    // Load action plan from localStorage
    const storedPlan = localStorage.getItem('wizActionPlan');
    if (storedPlan) {
      try {
        const parsedPlan = JSON.parse(storedPlan);
        setActionPlan(parsedPlan);
        
        // Count completed tasks
        const completed = parsedPlan.tasks.filter((task: ActionPlanTask) => task.completed).length;
        setCompletedTasks(completed);
      } catch (error) {
        console.error("Error parsing action plan:", error);
      }
    }
  }, []);
  
  const handleTaskToggle = (taskId: string) => {
    if (!actionPlan) return;
    
    const updatedTasks = actionPlan.tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    
    const updatedPlan = { ...actionPlan, tasks: updatedTasks };
    setActionPlan(updatedPlan);
    
    // Count completed tasks
    const completed = updatedTasks.filter(task => task.completed).length;
    setCompletedTasks(completed);
    
    // Save updated plan to localStorage
    localStorage.setItem('wizActionPlan', JSON.stringify(updatedPlan));
    
    // Show toast message
    const isCompleted = updatedTasks.find(t => t.id === taskId)?.completed;
    if (isCompleted) {
      toast.success("Task marked as completed! Keep up the good work!");
    }
  };
  
  if (!actionPlan) return null;
  
  const totalTasks = actionPlan.tasks.length;
  const progress = (completedTasks / totalTasks) * 100;
  const timeAgo = formatDistance(new Date(actionPlan.createdAt), new Date(), { addSuffix: true });
  
  return (
    <Card className="mb-6 border-border/40 bg-card/40 backdrop-blur-sm">
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
        {/* Progress bar */}
        <div className="w-full bg-secondary/30 rounded-full h-2 mb-4">
          <div 
            className="bg-purple-500 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-muted-foreground mb-4">
          <span>{completedTasks} of {totalTasks} tasks completed</span>
          <span>{progress.toFixed(0)}% complete</span>
        </div>
        
        {/* Tasks */}
        <div className="space-y-3">
          {actionPlan.tasks.map(task => (
            <div key={task.id} className="flex items-start space-x-2 p-3 rounded-lg border border-border/30 bg-background/50">
              <Checkbox 
                id={`task-${task.id}`} 
                checked={task.completed}
                onCheckedChange={() => handleTaskToggle(task.id)}
                className="mt-1"
              />
              <div className="space-y-1">
                <label 
                  htmlFor={`task-${task.id}`}
                  className={`font-medium cursor-pointer ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                >
                  {task.title}
                </label>
                <p className="text-sm text-muted-foreground">{task.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Summary */}
        <div className="mt-4 p-4 bg-muted/40 rounded-lg text-sm">
          {actionPlan.summary}
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

export default ActionPlan;
