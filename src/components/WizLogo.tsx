
import React from "react";

interface WizLogoProps {
  className?: string;
  showText?: boolean;
  subtitle?: boolean;
}

export const WizLogo: React.FC<WizLogoProps> = ({ className = "", showText = false, subtitle = false }) => {
  return (
    <div className="flex items-center">
      {!showText ? (
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          className={className} 
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M21.94 4.88C21.76 4.35 21.25 4 20.68 4H19.6l-1.66 6.03L15.38 4h-2.95l-2.74 6.2-1.85-6.2H6.68c-.58 0-1.08.35-1.26.88-.19.56.01 1.17.48 1.5l5.15 3.68-1.64 5.95c-.17.61.03 1.25.53 1.6.25.17.54.26.83.26.31 0 .61-.11.86-.32l5.03-4.13 4.76 4.13c.25.21.55.32.86.32.29 0 .58-.09.83-.26.5-.35.7-.99.53-1.6l-1.64-5.95 5.15-3.68c.47-.33.67-.94.48-1.5z" />
        </svg>
      ) : (
        <div className="flex flex-col items-center">
          <h2 className="text-5xl font-bold text-purple-500">WIZ</h2>
          {subtitle && <p className="text-sm text-gray-300 mt-1">Your AI Assistant</p>}
        </div>
      )}
    </div>
  );
};

export default WizLogo;
