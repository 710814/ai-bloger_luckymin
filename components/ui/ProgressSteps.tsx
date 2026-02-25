import React from 'react';

export interface Step {
    id: number;
    label: string;
    description?: string;
    status: 'completed' | 'current' | 'upcoming';
}

interface ProgressStepsProps {
    steps: Step[];
    onStepClick?: (stepId: number) => void;
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({ steps, onStepClick }) => {
    return (
        <div className="bg-white border-b border-slate-200 py-6">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav aria-label="Progress">
                    <ol className="flex items-center justify-center gap-4 md:gap-8">
                        {steps.map((step, index) => {
                            const isClickable = step.status === 'completed' && onStepClick;

                            return (
                                <li key={step.id} className="flex items-center">
                                    <button
                                        onClick={() => isClickable && onStepClick(step.id)}
                                        disabled={!isClickable}
                                        className={`flex items-center gap-3 ${isClickable ? 'cursor-pointer hover:opacity-75' : 'cursor-default'} transition-opacity`}
                                    >
                                        <div className="flex items-center">
                                            <div
                                                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${step.status === 'completed'
                                                        ? 'bg-green-600 border-green-600'
                                                        : step.status === 'current'
                                                            ? 'bg-brand-secondary border-brand-secondary'
                                                            : 'bg-white border-slate-300'
                                                    }`}
                                            >
                                                {step.status === 'completed' ? (
                                                    <svg
                                                        className="w-6 h-6 text-white"
                                                        fill="none"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path d="M5 13l4 4L19 7"></path>
                                                    </svg>
                                                ) : (
                                                    <span
                                                        className={`text-lg font-bold ${step.status === 'current' ? 'text-white' : 'text-slate-400'
                                                            }`}
                                                    >
                                                        {step.id}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-left hidden sm:block">
                                            <p
                                                className={`text-sm font-semibold ${step.status === 'upcoming' ? 'text-slate-400' : 'text-slate-900'
                                                    }`}
                                            >
                                                {step.label}
                                            </p>
                                            {step.description && (
                                                <p className="text-xs text-slate-500">{step.description}</p>
                                            )}
                                        </div>
                                    </button>
                                    {index < steps.length - 1 && (
                                        <div
                                            className={`hidden md:block w-12 lg:w-20 h-0.5 mx-4 ${step.status === 'completed' ? 'bg-green-600' : 'bg-slate-200'
                                                }`}
                                        />
                                    )}
                                </li>
                            );
                        })}
                    </ol>
                </nav>
            </div>
        </div>
    );
};
