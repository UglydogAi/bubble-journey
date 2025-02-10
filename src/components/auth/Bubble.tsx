
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BubbleProps {
  icon: LucideIcon;
  size?: "sm" | "md" | "lg";
  position: { x: number; y: number };
  delay?: number;
  message?: string;
}

const sizeMap = {
  sm: "w-12 h-12",
  md: "w-16 h-16",
  lg: "w-20 h-20",
};

export const Bubble = ({
  icon: Icon,
  size = "md",
  position,
  delay = 0,
  message,
}: BubbleProps) => {
  const bubbleVariants = {
    initial: { x: position.x, y: position.y, opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        delay,
        duration: 0.5,
      },
    },
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div
      className={cn(
        "absolute rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center cursor-pointer",
        sizeMap[size]
      )}
      style={{ left: position.x, top: position.y }}
      variants={bubbleVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      title={message}
    >
      <Icon className="text-white/80" size={size === "lg" ? 24 : size === "md" ? 20 : 16} />
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20" />
    </motion.div>
  );
};
