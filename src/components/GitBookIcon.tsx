
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.25 2C4.18 2 2.5 3.68 2.5 5.75V18.25C2.5 20.32 4.18 22 6.25 22H17.75C19.82 22 21.5 20.32 21.5 18.25V5.75C21.5 3.68 19.82 2 17.75 2H6.25ZM11.47 15.133C11.167 15.133 10.92 15.011 10.73 14.765L7.955 11.24C7.833 11.083 7.77 10.902 7.77 10.699C7.77 10.289 8.093 9.966 8.503 9.966C8.73 9.966 8.933 10.061 9.09 10.265L11.47 13.301L14.91 8.603C15.067 8.385 15.27 8.268 15.497 8.268C15.907 8.268 16.23 8.591 16.23 9.001C16.23 9.194 16.157 9.397 16.025 9.553L12.233 14.732C12.053 14.989 11.785 15.133 11.47 15.133Z"
      />
    </svg>
  );
};

export default GitBookIcon;
