import React from 'react';
import { Modal } from './Modal';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    confirmText?: string;
    onConfirm?: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
    isOpen,
    onClose,
    title,
    message,
    confirmText = '확인',
    onConfirm,
}) => {
    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md" showCloseButton={false}>
            <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                    <svg
                        className="h-10 w-10 text-green-600"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{title}</h3>
                <p className="text-base text-slate-600 mb-6 whitespace-pre-line">{message}</p>
                <button
                    onClick={handleConfirm}
                    className="w-full px-6 py-3 bg-brand-secondary text-white text-lg font-bold rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/50 transition-colors"
                >
                    {confirmText}
                </button>
            </div>
        </Modal>
    );
};
