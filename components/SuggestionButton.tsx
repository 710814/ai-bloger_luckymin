import React from 'react';

interface SuggestionButtonProps {
  text: string;
  onClick: () => void;
  isActive?: boolean;
}

export const SuggestionButton: React.FC<SuggestionButtonProps> = ({ text, onClick, isActive = false }) => {
  const baseClasses = "px-4 py-2 text-base font-semibold rounded-full transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-offset-0";
  const activeClasses = "bg-brand-primary text-white hover:bg-brand-dark focus:ring-brand-primary/50";
  const inactiveClasses = "bg-sky-100 text-sky-800 hover:bg-sky-200 focus:ring-sky-500/50";
  
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      {text}
    </button>
  );
};