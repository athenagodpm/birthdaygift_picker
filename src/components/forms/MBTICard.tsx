import React from 'react';
import { MBTIOption } from '@/types';
import { MBTI_VISUAL_CONFIG } from '@/constants';

interface MBTICardProps {
    option: MBTIOption;
    isSelected: boolean;
    onClick: () => void;
    disabled?: boolean;
}

export default function MBTICard({ option, isSelected, onClick, disabled = false }: MBTICardProps) {
    const visualConfig = MBTI_VISUAL_CONFIG[option.value as keyof typeof MBTI_VISUAL_CONFIG];

    // 颜色主题映射 - 只保留四种颜色
    const colorThemes = {
        purple: 'border-purple-300 bg-purple-50 hover:border-purple-400 text-purple-700', // NT类型
        green: 'border-green-300 bg-green-50 hover:border-green-400 text-green-700',     // NF类型
        blue: 'border-blue-300 bg-blue-50 hover:border-blue-400 text-blue-700',         // SF类型
        yellow: 'border-yellow-300 bg-yellow-50 hover:border-yellow-400 text-yellow-700' // ST类型
    };

    const selectedThemes = {
        purple: 'border-purple-500 bg-purple-100 text-purple-800', // NT类型
        green: 'border-green-500 bg-green-100 text-green-800',     // NF类型
        blue: 'border-blue-500 bg-blue-100 text-blue-800',         // SF类型
        yellow: 'border-yellow-500 bg-yellow-100 text-yellow-800'  // ST类型
    };

    const currentTheme = isSelected
        ? selectedThemes[visualConfig.color as keyof typeof selectedThemes]
        : colorThemes[visualConfig.color as keyof typeof colorThemes];

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`
                relative p-3 border-2 rounded-lg transition-all duration-300 text-center w-full
                ${disabled
                    ? 'opacity-50 cursor-not-allowed border-gray-200 bg-gray-50'
                    : `cursor-pointer hover:shadow-md hover:scale-105 ${currentTheme}`
                }
                ${isSelected ? 'ring-2 ring-opacity-50 shadow-md transform scale-105' : ''}
            `}
        >
            {/* 图标 */}
            <div className="text-2xl mb-2">{visualConfig.icon}</div>

            {/* MBTI类型 */}
            <div className="font-bold text-sm mb-1">{option.value}</div>

            {/* 选中标记 */}
            {isSelected && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-current rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                </div>
            )}
        </button>
    );
}