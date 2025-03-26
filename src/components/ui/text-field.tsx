
import React, { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface TextFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ className, label, error, icon, id, ...props }, ref) => {
    const inputId = id || React.useId();
    
    return (
      <div className="space-y-2">
        {label && (
          <Label 
            htmlFor={inputId}
            className="text-sm font-medium text-gray-200"
          >
            {label}
          </Label>
        )}
        
        <div className="relative">
          <Input
            id={inputId}
            className={cn(
              "bg-background/80 border-input/50 focus:border-primary/70 focus:ring-2 ring-primary/30 transition-all duration-200",
              error && "border-red-500/50 focus:border-red-500/70 focus:ring-red-500/30",
              icon && "pl-10",
              className
            )}
            ref={ref}
            {...props}
          />
          
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/70">
              {icon}
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-xs text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

TextField.displayName = "TextField";

export { TextField };
