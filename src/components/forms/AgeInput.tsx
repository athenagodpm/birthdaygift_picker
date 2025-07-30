import React, { useState } from 'react';
import { FormFieldProps } from '@/types';

interface AgeInputProps extends FormFieldProps {
    value?: number;
    onChange: (value: number | undefined) => void;
}

export default function AgeInput({
    value,
    onChange,
    error,
    disabled = false,
    className = ''
}: AgeInputProps) {
    const [inputValue, setInputValue] = useState(value?.toString() || '');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);

        // 只允许数字输入
        if (newValue === '') {
            onChange(undefined);
            return;
        }

        const numValue = parseInt(newValue, 10);
        if (!isNaN(numValue)) {
            onChange(numValue);
        }
    };

    const handleBlur = () => {
        // 在失去焦点时，确保输入值在有效范围内
        if (value !== undefined) {
            if (value < 1) {
                onChange(1);
                setInputValue('1');
            } else if (value > 120) {
                onChange(120);
                setInputValue('120');
            }
        }
    };

    // 预设年龄段快速选择
    const ageRanges = [
        { label: '儿童 (3-12岁)', value: 8 },
        { label: '青少年 (13-17岁)', value: 15 },
        { label: '青年 (18-35岁)', value: 25 },
        { label: '中年 (36-55岁)', value: 45 },
        { label: '老年 (56岁以上)', value: 65 }
    ];

    return (
        <div className={className}>
            {/* 数字输入框 */}
            <div className="mb-4">
                <div className="relative">
                    <input
                        type="number"
                        value={inputValue}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        disabled={disabled}
                        min="1"
                        max="120"
                        placeholder="请输入年龄"
                        className={`
              w-full px-4 py-3 text-lg border-2 rounded-lg transition-colors duration-200
              ${error
                                ? 'border-red-300 focus:border-red-500'
                                : 'border-gray-300 focus:border-pink-500'
                            }
              ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
              focus:outline-none focus:ring-2 focus:ring-pink-200
            `}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        岁
                    </div>
                </div>
            </div>

            {/* 快速选择年龄段 */}
            <div>
                <p className="text-sm text-gray-600 mb-3">或选择年龄段：</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {ageRanges.map((range) => (
                        <button
                            key={range.value}
                            type="button"
                            onClick={() => !disabled && onChange(range.value)}
                            disabled={disabled}
                            className={`
                px-3 py-2 text-sm rounded-lg border transition-colors duration-200
                ${value === range.value
                                    ? 'border-pink-500 bg-pink-50 text-pink-700'
                                    : 'border-gray-200 bg-white text-gray-600 hover:border-pink-300 hover:bg-pink-25'
                                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 年龄提示 */}
            {value && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                        {value <= 12 && '🧒 为儿童推荐安全、教育性的礼物'}
                        {value >= 13 && value <= 17 && '🧑‍🎓 为青少年推荐时尚、科技类的礼物'}
                        {value >= 18 && value <= 35 && '👨‍💼 为年轻人推荐实用、个性化的礼物'}
                        {value >= 36 && value <= 55 && '👨‍💼 为中年人推荐品质、健康类的礼物'}
                        {value >= 56 && '👴 为长辈推荐健康、舒适类的礼物'}
                    </p>
                </div>
            )}

            {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
        </div>
    );
}