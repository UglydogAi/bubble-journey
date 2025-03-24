
import React from "react";

interface DocsIconProps {
  className?: string;
}

const DocsIcon: React.FC<DocsIconProps> = ({ className = "" }) => {
  return (
    <svg
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.59 12a8.12 8.12 0 0 1-1.52 4.77c-2.1 2.93-6.35 5.4-9.08 2.91-5.63-3.25-1.26-9.71-1.26-9.71s2.22 3.1 4.77 3.1c2.55 0 2.59-1.13 2.59-1.13s0 .24-.78.24c-1.8 0-4.14-2.82-4.14-5.86C11.16 2.69 14.52.12 17.21 2.75c2.44 2.36 2.41 5.91 2.41 5.91s-.14-1.92-1.09-1.92-1.36.54-1.36 2.05c0 1.51.96 2.11 1.84 2.11.88 0 1.58-1.1 1.58-1.1V12Z" />
    </svg>
  );
};

export default DocsIcon;
