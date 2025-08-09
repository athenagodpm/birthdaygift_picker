import React from 'react';
import { GENDER_OPTIONS } from '@/constants';
import { FormFieldProps } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';

interface GenderSelectorProps extends FormFieldProps {
    value?: 'male' | 'female' | 'other';
    onChange: (value: 'male' | 'female' | 'other') => void;
}

export default function GenderSelector({
    value,
    onChange,
    error,
    disabled = false,
    className = ''
}: GenderSelectorProps) {
    const { t } = useTranslation();

    return (
        <div className={className}>
            <div className="grid grid-cols-3 gap-4">
                {GENDER_OPTIONS.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => !disabled && onChange(option.value)}
                        disabled={disabled}
                        className={`
              relative p-6 rounded-xl border-2 transition-all duration-200 
              ${value === option.value
                                ? 'border-pink-500 bg-pink-50 shadow-lg transform scale-105'
                                : 'border-gray-200 bg-white hover:border-pink-300 hover:bg-pink-25'
                            }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}
            `}
                    >
                        <div className="text-center">
                            <div className="text-4xl mb-3">{option.icon}</div>
                            <div className={`font-semibold ${value === option.value ? 'text-pink-700' : 'text-gray-700'
                                }`}>
                                {t(`questionnaire.gender.options.${option.value}`)}
                            </div>
                        </div>

                        {/* 选中状态指示器 */}
                        {value === option.value && (
                            <div className="absolute top-2 right-2">
                                <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
        </div>
    );
}