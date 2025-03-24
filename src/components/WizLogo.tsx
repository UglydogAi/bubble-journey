
import React from "react";

interface WizLogoProps {
  className?: string;
}

const WizLogo: React.FC<WizLogoProps> = ({ className = "" }) => {
  // Updated SVG to be more magical and wizard/panda themed
  return (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      className={className} 
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Staff/wand shape */}
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
      <path d="M12 6c-.55 0-1 .45-1 1v5c0 .55.45 1 1 1s1-.45 1-1V7c0-.55-.45-1-1-1z" />
      <path d="M12 15c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
      {/* Magical sparkle elements */}
      <path d="M17 8.5l-1.5-1.5 1.5-1.5L15.5 4 14 5.5 12.5 4 11 5.5 9.5 4 8 5.5 6.5 4 5 5.5 6.5 7 5 8.5 6.5 10 8 8.5 9.5 10 11 8.5 12.5 10 14 8.5 15.5 10 17 8.5z" opacity="0.7" />
    </svg>
  );
};

export default WizLogo;
