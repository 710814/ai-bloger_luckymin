import React from 'react';
import { Modal } from './Modal';

interface ErrorModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    showRetry?: boolean;
    onRetry?: () => void;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({
    isOpen,
    onClose,
    title,
    message,
    showRetry = false,
    onRetry,
}) => {
    const handleRetry = () => {
        if (onRetry) {
            onRetry();
        }
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md" showCloseButton={false}>
            <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                    <svg
                        className="h-10 w-10 text-red-600"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{title}</h3>
                <p className="text-base text-slate-600 mb-6 whitespace-pre-line">{message}</p>
                <div className="flex gap-3">
                    {showRetry && onRetry && (
                        <button
                            onClick={handleRetry}
                            className="flex-1 px-6 py-3 bg-brand-secondary text-white text-lg font-bold rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/50 transition-colors"
                        >
                            다시 시도
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className={`${showRetry ? 'flex-1' : 'w-full'} px-6 py-3 bg-slate-200 text-slate-700 text-lg font-bold rounded-xl hover:bg-slate-300 focus:outline-none focus:ring-4 focus:ring-slate-400/50 transition-colors`}
                    >
                        닫기
                    </button>
                </div>
            </div>
        </Modal>
    );
};
