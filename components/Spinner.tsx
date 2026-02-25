
import React from 'react';

interface SpinnerProps {
  large?: boolean;
}

export const Spinner: React.FC<SpinnerProps> = ({ large = false }) => {
  const sizeClasses = large ? 'w-10 h-10' : 'w-5 h-5';
  const borderClasses = large ? 'border-4' : 'border-2';

  return (
    <div
      className={`${sizeClasses} ${borderClasses} border-t-transparent border-solid animate-spin rounded-full border-white`}
      role="status"
    >
        <span className="sr-only">Loading...</span>
    </div>
  );
};
