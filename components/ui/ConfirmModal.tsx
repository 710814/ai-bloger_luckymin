import React from 'react';
import { Modal } from './Modal';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    title,
    message,
    confirmText = '확인',
    cancelText = '취소',
    onConfirm,
    variant = 'warning',
}) => {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    const iconColors = {
        danger: 'bg-red-100 text-red-600',
        warning: 'bg-yellow-100 text-yellow-600',
        info: 'bg-blue-100 text-blue-600',
    };

    const buttonColors = {
        danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-600/50',
        warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-600/50',
        info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-600/50',
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md" showCloseButton={false}>
            <div className="text-center">
                <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${iconColors[variant]} mb-4`}>
                    <svg
                        className="h-10 w-10"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{title}</h3>
                <p className="text-base text-slate-600 mb-6 whitespace-pre-line">{message}</p>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 text-lg font-bold rounded-xl hover:bg-slate-300 focus:outline-none focus:ring-4 focus:ring-slate-400/50 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className={`flex-1 px-6 py-3 text-white text-lg font-bold rounded-xl focus:outline-none focus:ring-4 transition-colors ${buttonColors[variant]}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
};
