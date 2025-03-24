
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
      rotate: [-1, 1, -1],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    processing: {
      y: [0, -3, 0],
      rotate: [0, 0, 0],
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
      y: [0, -20, 0],
      x: [0, i % 2 === 0 ? 10 : -10, 0],
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
      scale: [1, 1.1, 1],
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
      rotate: [-1, 1, -1],
      scale: [1, 1.02, 1],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Animation for the paw wave
  const pawWaveVariants = {
    animate: {
      rotate: [0, 5, 0, 5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.2, 0.4, 0.6, 1]
      }
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main mascot image with 3D float animation */}
      <motion.div
        variants={isProcessing ? mascotVariants.processing : mascotVariants.idle}
        animate="idle"
        className="relative z-10"
      >
        <img 
          src="/lovable-uploads/28201889-82c5-4c8b-9cb7-47064b3a1d22.png" 
          alt="Wiz the Panda" 
          className="w-48 h-48 sm:w-56 sm:h-56 object-contain transform-gpu" 
        />
      </motion.div>

      {/* Magic particles floating around */}
      {Array.from({ length: 8 }).map((_, index) => (
        <motion.div
          key={`particle-${index}`}
          custom={index}
          variants={particleVariants}
          initial={{ opacity: 0 }}
          animate="animate"
          className="absolute w-2 h-2 rounded-full bg-yellow-400"
          style={{
            top: `${40 + Math.random() * 30}%`,
            left: `${35 + (index * 5) - 10 + (Math.random() * 15)}%`,
            filter: "blur(1px)"
          }}
        />
      ))}

      {/* Staff orb glow effect */}
      <motion.div
        variants={orbGlowVariants}
        initial={{ opacity: 0.5 }}
        animate="animate"
        className="absolute top-[30%] right-[22%] w-8 h-8 rounded-full bg-yellow-400/30"
        style={{ filter: "blur(4px)" }}
      />

      {/* Cloak animation - subtle flowing effect */}
      <motion.div
        variants={cloakVariants}
        initial={{ rotate: 0 }}
        animate="animate"
        className="absolute top-[40%] left-[43%] w-24 h-24 rounded-full opacity-0"
      />

      {/* Paw wave animation container */}
      <motion.div
        variants={pawWaveVariants}
        animate="animate"
        className="absolute top-[42%] left-[30%] w-12 h-12 opacity-0"
      />
    </div>
  );
};

export default WizMascot;
