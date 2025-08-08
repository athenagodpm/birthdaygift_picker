import React from 'react';
import { MBTI_OPTIONS } from '@/constants';
import { FormFieldProps } from '@/types';
import MBTICard from './MBTICard';

interface MBTISelectorProps extends FormFieldProps {
    value?: string;
    onChange: (value: string) => void;
}

export default function MBTISelector({
    value,
    onChange,
    error,
    disabled = false,
    className = ''
}: MBTISelectorProps) {
    const handleSelect = (mbtiValue: string) => {
        // 如果点击的是已选中的项，则取消选择
        if (value === mbtiValue) {
            onChange('');
        } else {
            onChange(mbtiValue);
        }
    };

    return (
        <div className={className}>
            {/* MBTI卡片网格 */}
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-3">
                {MBTI_OPTIONS.map((option) => (
                    <MBTICard
                        key={option.value}
                        option={option}
                        isSelected={value === option.value}
                        onClick={() => handleSelect(option.value)}
                        disabled={disabled}
                    />
                ))}
            </div>

            {/* 简化的提示 */}
            <div className="text-center">
                <p className="text-xs text-gray-500">
                    💡 不确定MBTI类型可跳过此选项
                    {value && (
                        <button
                            type="button"
                            onClick={() => onChange('')}
                            disabled={disabled}
                            className="ml-2 text-purple-500 hover:text-purple-700 underline"
                        >
                            清除选择
                        </button>
                    )}
                </p>
            </div>

            {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
        </div>
    );
}