
import React from "react";

interface WizLogoProps {
  className?: string;
}

const WizLogo: React.FC<WizLogoProps> = ({ className = "" }) => {
  // We've updated the SVG to be more wizard/panda themed
  return (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      className={className} 
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-8.5l3 3 7-7-1.41-1.41L9 13.17l-1.6-1.59L6 13.5z" />
      <path d="M12 8c-.55 0-1 .45-1 1v5c0 .55.45 1 1 1s1-.45 1-1v-5c0-.55-.45-1-1-1z" />
      <path d="M12 18c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z" />
    </svg>
  );
};

export default WizLogo;
