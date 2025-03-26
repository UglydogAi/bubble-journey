
import React from "react";

interface GitBookIconProps {
  className?: string;
}

const GitBookIcon: React.FC<GitBookIconProps> = ({ className = "" }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.802 17.77a.703.703 0 0 1-.588.622.673.673 0 0 1-.564-.209L6.114 14.57a.37.37 0 0 1-.001-.522l2.97-2.97a.495.495 0 0 0-.35-.845H7.558a.495.495 0 0 0-.35.145l-4.669 4.67a.373.373 0 0 0 0 .525l7.953 7.953a.373.373 0 0 0 .525 0l7.952-7.953a.374.374 0 0 0 0-.525l-7.952-7.953a.373.373 0 0 0-.525 0l-4.67 4.67a.495.495 0 0 0 .35.844h1.175a.495.495 0 0 0 .35-.145l2.97-2.97a.37.37 0 0 1 .523 0l3.535 3.535a.67.67 0 0 1 .21.563.699.699 0 0 1-.62.588L10.8 17.77z"
      />
    </svg>
  );
};

export default GitBookIcon;
