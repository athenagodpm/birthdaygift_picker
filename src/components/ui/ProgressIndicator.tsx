import React from 'react';

interface Step {
    id: string;
    label: string;
    completed: boolean;
    current: boolean;
}

interface ProgressIndicatorProps {
    steps: Step[];
}

export default function ProgressIndicator({ steps }: ProgressIndicatorProps) {
    return (
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 py-4">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-center">
                    {steps.map((step, index) => (
                        <React.Fragment key={step.id}>
                            {/* Step Circle */}
                            <div className="flex items-center">
                                <div
                                    className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                    ${step.completed
                                            ? 'bg-green-500 text-white'
                                            : step.current
                                                ? 'bg-pink-500 text-white'
                                                : 'bg-gray-200 text-gray-500'
                                        }
                  `}
                                >
                                    {step.completed ? (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        index + 1
                                    )}
                                </div>

                                {/* Step Label */}
                                <span
                                    className={`
                    ml-2 text-sm font-medium
                    ${step.current ? 'text-pink-600' : step.completed ? 'text-green-600' : 'text-gray-500'}
                  `}
                                >
                                    {step.label}
                                </span>
                            </div>

                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div
                                    className={`
                    mx-4 h-0.5 w-12 transition-colors
                    ${steps[index + 1].completed || steps[index + 1].current ? 'bg-pink-300' : 'bg-gray-200'}
                  `}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
}