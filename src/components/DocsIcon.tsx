
import React from "react";

interface DocsIconProps {
  className?: string;
}

const DocsIcon: React.FC<DocsIconProps> = ({ className = "" }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.386 2.17a3.205 3.205 0 0 0-4.536 0L2.845 14.175a1.63 1.63 0 0 0-.481 1.175v4.043c0 .9.73 1.63 1.631 1.63h4.044c.442 0 .865-.176 1.177-.481L21.22 8.538a3.205 3.205 0 0 0 0-4.536L19.386 2.17ZM13.196 3.85l1.458 1.458-8.403 8.403-1.458-1.458L13.196 3.85Zm-8.403 11.319 4.373 4.373H3.995v-4.373Zm5.83 3.893-1.458-1.458 8.403-8.403 1.458 1.458-8.402 8.403Z" />
    </svg>
  );
};

export default DocsIcon;
