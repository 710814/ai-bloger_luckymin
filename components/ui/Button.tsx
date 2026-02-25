import React from 'react';
import { Spinner } from '../Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    children: React.ReactNode;
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    loading = false,
    children,
    fullWidth = false,
    disabled,
    className = '',
    ...props
}) => {
    const baseClasses = 'inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all transform focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
        primary: 'bg-brand-secondary text-white hover:bg-blue-600 focus:ring-blue-600/50 shadow-md hover:scale-105',
        secondary: 'bg-brand-primary text-white hover:bg-brand-dark focus:ring-brand-primary/50 shadow-md hover:scale-105',
        outline: 'bg-white text-brand-primary border-2 border-brand-primary hover:bg-brand-light focus:ring-brand-primary/50 shadow-md hover:scale-105',
        ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-400/50',
    };

    const sizeClasses = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? <Spinner /> : children}
        </button>
    );
};
