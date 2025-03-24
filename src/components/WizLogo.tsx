
import React from "react";

interface WizLogoProps {
  className?: string;
}

const WizLogo: React.FC<WizLogoProps> = ({ className = "" }) => {
  return (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      className={className} 
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12,2L9.1,7.4L3.5,8.5L7.75,12.6L6.7,18.2L12,15.6L17.3,18.2L16.25,12.6L20.5,8.5L14.9,7.4L12,2M15.89,8.31L20.5,9.2L17,12.39L17.88,17.03L13.38,14.92L12,14.27L10.62,14.92L6.12,17.03L7,12.39L3.5,9.2L8.11,8.31L11.17,4.04L12,2.38L12.83,4.04L15.89,8.31Z" />
      <path d="M10,14L12,12L14,14L12,16L10,14M15.5,9.5L17.5,7.5L19.5,9.5L17.5,11.5L15.5,9.5M8.5,9.5L10.5,7.5L12.5,9.5L10.5,11.5L8.5,9.5M4.5,9.5L6.5,7.5L8.5,9.5L6.5,11.5L4.5,9.5Z" />
    </svg>
  );
};

export default WizLogo;
