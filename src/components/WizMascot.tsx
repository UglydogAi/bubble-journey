
import React from "react";
import { motion } from "framer-motion";

interface WizMascotProps {
  className?: string;
  isProcessing?: boolean;
}

const WizMascot: React.FC<WizMascotProps> = ({ 
  className = "", 
  isProcessing = false 
}) => {
  // Animation variants for the mascot
  const mascotVariants = {
    idle: {
      y: [0, -5, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    processing: {
      y: [0, -3, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Animation for the magical particles
  const particleVariants = {
    animate: (i: number) => ({
      y: [0, -15, 0],
      x: [0, i % 2 === 0 ? 8 : -8, 0],
      opacity: [0, 0.8, 0],
      scale: [0.6, 1, 0.6],
      transition: {
        duration: 2 + (i * 0.3),
        repeat: Infinity,
        ease: "easeInOut",
        delay: i * 0.2
      }
    })
  };

  // Animation for the staff's orb
  const orbGlowVariants = {
    animate: {
      opacity: [0.5, 1, 0.5],
      scale: [1, 1.05, 1],
      boxShadow: [
        "0 0 8px rgba(255, 215, 0, 0.5)",
        "0 0 15px rgba(255, 215, 0, 0.7)",
        "0 0 8px rgba(255, 215, 0, 0.5)"
      ],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Animation for the cloak
  const cloakVariants = {
    animate: {
      rotate: [-0.5, 0.5, -0.5],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main mascot image */}
      <motion.div
        variants={isProcessing ? mascotVariants.processing : mascotVariants.idle}
        initial="initial"
        animate="idle"
        className="relative z-10"
      >
        <img 
          src="/lovable-uploads/0e0dc07d-b4ae-40b8-98be-23fa96e2ce61.png" 
          alt="Wiz the Panda" 
          className="w-40 h-40 sm:w-48 sm:h-48 object-contain" 
        />
      </motion.div>

      {/* Magic particles */}
      {Array.from({ length: 6 }).map((_, index) => (
        <motion.div
          key={`particle-${index}`}
          custom={index}
          variants={particleVariants}
          initial={{ opacity: 0 }}
          animate="animate"
          className="absolute w-2 h-2 rounded-full bg-yellow-400"
          style={{
            top: `${50 + Math.random() * 30}%`,
            left: `${45 + (index * 5) - 15 + (Math.random() * 10)}%`,
            filter: "blur(1px)"
          }}
        />
      ))}

      {/* Staff orb glow effect */}
      <motion.div
        variants={orbGlowVariants}
        initial={{ opacity: 0.5 }}
        animate="animate"
        className="absolute top-[35%] right-[15%] w-6 h-6 rounded-full bg-yellow-400/30"
        style={{ filter: "blur(4px)" }}
      />

      {/* Cloak animation container - slightly rotates to simulate flowing */}
      <motion.div
        variants={cloakVariants}
        initial={{ rotate: 0 }}
        animate="animate"
        className="absolute inset-0 z-0 opacity-0"
      />
    </div>
  );
};

export default WizMascot;
