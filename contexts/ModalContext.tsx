import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SuccessModal } from '../components/ui/SuccessModal';
import { ErrorModal } from '../components/ui/ErrorModal';
import { ConfirmModal } from '../components/ui/ConfirmModal';

interface ModalState {
    type: 'success' | 'error' | 'confirm' | null;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    showRetry?: boolean;
    onConfirm?: () => void;
    onRetry?: () => void;
    variant?: 'danger' | 'warning' | 'info';
}

interface ModalContextType {
    showSuccess: (title: string, message: string, onConfirm?: () => void) => void;
    showError: (title: string, message: string, showRetry?: boolean, onRetry?: () => void) => void;
    showConfirm: (title: string, message: string, onConfirm: () => void, variant?: 'danger' | 'warning' | 'info') => void;
    closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [modalState, setModalState] = useState<ModalState>({
        type: null,
        title: '',
        message: '',
    });

    const showSuccess = (title: string, message: string, onConfirm?: () => void) => {
        setModalState({
            type: 'success',
            title,
            message,
            onConfirm,
        });
    };

    const showError = (title: string, message: string, showRetry = false, onRetry?: () => void) => {
        setModalState({
            type: 'error',
            title,
            message,
            showRetry,
            onRetry,
        });
    };

    const showConfirm = (
        title: string,
        message: string,
        onConfirm: () => void,
        variant: 'danger' | 'warning' | 'info' = 'warning'
    ) => {
        setModalState({
            type: 'confirm',
            title,
            message,
            onConfirm,
            variant,
        });
    };

    const closeModal = () => {
        setModalState({
            type: null,
            title: '',
            message: '',
        });
    };

    return (
        <ModalContext.Provider value={{ showSuccess, showError, showConfirm, closeModal }}>
            {children}
            <SuccessModal
                isOpen={modalState.type === 'success'}
                onClose={closeModal}
                title={modalState.title}
                message={modalState.message}
                onConfirm={modalState.onConfirm}
            />
            <ErrorModal
                isOpen={modalState.type === 'error'}
                onClose={closeModal}
                title={modalState.title}
                message={modalState.message}
                showRetry={modalState.showRetry}
                onRetry={modalState.onRetry}
            />
            <ConfirmModal
                isOpen={modalState.type === 'confirm'}
                onClose={closeModal}
                title={modalState.title}
                message={modalState.message}
                onConfirm={modalState.onConfirm || (() => { })}
                variant={modalState.variant}
            />
        </ModalContext.Provider>
    );
};
