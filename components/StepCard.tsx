import React from 'react';
import { CheckIcon, ChevronDownIcon } from './icons';

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  children: React.ReactNode;
  isActive: boolean;
  isCompleted: boolean;
  onClickHeader: () => void;
  summary?: React.ReactNode;
}

export const StepCard: React.FC<StepCardProps> = ({ number, title, description, children, isActive, isCompleted, onClickHeader, summary }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-lg transition-all duration-300 ease-in-out ${isActive ? 'ring-2 ring-brand-primary shadow-xl' : 'hover:shadow-xl'}`}>
      <button 
        onClick={onClickHeader} 
        className="w-full text-left p-6 sm:p-8"
        aria-expanded={isActive}
      >
        <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-5">
                <div className={`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full font-bold text-xl transition-colors ${
                    isCompleted ? 'bg-green-500 text-white' : isActive ? 'bg-brand-primary text-white' : 'bg-brand-light text-brand-dark'
                }`}>
                    {isCompleted ? <CheckIcon className="w-7 h-7" /> : number}
                </div>
                <div className="text-left">
                    <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
                    <p className="mt-1 text-base text-slate-500">{description}</p>
                </div>
            </div>
            <ChevronDownIcon className={`w-8 h-8 text-slate-400 flex-shrink-0 ml-4 transform transition-transform duration-200 ${isActive ? 'rotate-180' : 'rotate-0'}`} />
        </div>
      </button>

      {isActive && (
        <div className="px-6 sm:px-8 pb-8 pt-0 animate-fade-in">
          <div className="border-t border-slate-200 pt-8">
            {children}
          </div>
        </div>
      )}

      {!isActive && isCompleted && summary && (
          <div className="px-6 sm:px-8 pb-8 pt-0">
            <div className="border-t border-slate-200 pt-8">
                {summary}
            </div>
          </div>
      )}
    </div>
  );
};