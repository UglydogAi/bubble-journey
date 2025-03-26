
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
        d="M3 6C3 4.34315 4.34315 3 6 3H18C19.6569 3 21 4.34315 21 6V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6Z"
        fill="currentColor"
      />
      <path 
        d="M11.4133 15.7487C11.0333 15.7487 10.7533 15.6087 10.5333 15.3287L7.44333 11.4587C7.30333 11.2787 7.23333 11.0787 7.23333 10.8587C7.23333 10.3787 7.61333 9.99866 8.09333 9.99866C8.35333 9.99866 8.57333 10.1187 8.75333 10.3787L11.4133 13.7987L15.2733 8.57866C15.4533 8.33866 15.6733 8.20866 15.9333 8.20866C16.4133 8.20866 16.7933 8.58866 16.7933 9.06866C16.7933 9.28866 16.7033 9.52866 16.5533 9.71866L12.3133 15.2787C12.1133 15.5587 11.7933 15.7487 11.4133 15.7487Z"
        fill="white"
      />
    </svg>
  );
};

export default GitBookIcon;
