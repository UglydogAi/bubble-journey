
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-1.5 w-full overflow-hidden rounded-full bg-secondary/40",
      "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/10 before:to-orange-500/10 before:rounded-full",
      "border border-primary/10", // Added border for better visibility
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(
        "h-full w-full flex-1 bg-gradient-to-r from-primary to-orange-500 transition-all duration-300",
        "after:absolute after:inset-0 after:bg-gradient-to-b after:from-white/20 after:to-transparent after:rounded-full", 
        "shadow-[0_0_10px_rgba(138,43,226,0.4)]" // Enhanced shadow for visibility
      )}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
