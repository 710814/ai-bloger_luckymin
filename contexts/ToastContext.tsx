import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { ToastContainer } from '../components/ui/ToastContainer';
import { ToastData, ToastType } from '../components/ui/Toast';

interface ToastContextType {
    showToast: (type: ToastType, message: string, duration?: number) => void;
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
    warning: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const showToast = useCallback((type: ToastType, message: string, duration = 3000) => {
        const id = `toast-${Date.now()}-${Math.random()}`;
        const newToast: ToastData = { id, type, message, duration };
        setToasts((prev) => [...prev, newToast]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const success = useCallback((message: string) => showToast('success', message), [showToast]);
    const error = useCallback((message: string) => showToast('error', message), [showToast]);
    const info = useCallback((message: string) => showToast('info', message), [showToast]);
    const warning = useCallback((message: string) => showToast('warning', message), [showToast]);

    return (
        <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
            {children}
            <ToastContainer toasts={toasts} onClose={removeToast} />
        </ToastContext.Provider>
    );
};
