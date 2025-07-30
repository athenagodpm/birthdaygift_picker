import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    className?: string;
}

export default function Button({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    size = 'md',
    disabled = false,
    className = ''
}: ButtonProps) {
    const baseClasses = 'font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variantClasses = {
        primary: 'bg-pink-500 hover:bg-pink-600 text-white focus:ring-pink-500',
        secondary: 'bg-purple-500 hover:bg-purple-600 text-white focus:ring-purple-500',
        outline: 'border-2 border-pink-500 text-pink-500 hover:bg-pink-50 focus:ring-pink-500'
    };

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg'
    };

    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
        >
            {children}
        </button>
    );
}