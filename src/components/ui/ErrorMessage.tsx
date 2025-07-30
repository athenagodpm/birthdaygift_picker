import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ErrorMessageProps {
    message: string;
    details?: string;
    className?: string;
}

export default function ErrorMessage({ message, details, className = '' }: ErrorMessageProps) {
    return (
        <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
            <div className="flex items-start">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                    <p className="text-red-800 font-medium">{message}</p>
                    {details && (
                        <p className="text-red-600 text-sm mt-1">{details}</p>
                    )}
                </div>
            </div>
        </div>
    );
}