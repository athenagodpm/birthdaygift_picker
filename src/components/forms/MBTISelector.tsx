import React, { useState } from 'react';
import { MBTI_OPTIONS } from '@/constants';
import { FormFieldProps } from '@/types';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

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
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const selectedMBTI = MBTI_OPTIONS.find(option => option.value === value);

    const filteredOptions = MBTI_OPTIONS.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.traits.some(trait => trait.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleSelect = (mbtiValue: string) => {
        onChange(mbtiValue);
        setIsExpanded(false);
        setSearchTerm('');
    };

    const clearSelection = () => {
        onChange('');
        setIsExpanded(false);
    };

    return (
        <div className={className}>
            {/* 当前选择显示 */}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => !disabled && setIsExpanded(!isExpanded)}
                    disabled={disabled}
                    className={`
            w-full p-4 border-2 rounded-lg text-left transition-colors duration-200
            ${error
                            ? 'border-red-300 focus:border-red-500'
                            : 'border-gray-300 focus:border-purple-500'
                        }
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white cursor-pointer hover:border-purple-300'}
            focus:outline-none focus:ring-2 focus:ring-purple-200
          `}
                >
                    {selectedMBTI ? (
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-semibold text-purple-700">{selectedMBTI.label}</div>
                                <div className="text-sm text-gray-600 mt-1">{selectedMBTI.description}</div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {selectedMBTI.traits.map((trait, index) => (
                                        <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                                            {trait}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!disabled) {
                                            clearSelection();
                                        }
                                    }}
                                    className={`text-sm cursor-pointer ${disabled ? 'text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    清除
                                </span>
                                {isExpanded ? (
                                    <ChevronUpIcon className="w-5 h-5 text-gray-400" />
                                ) : (
                                    <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between">
                            <div className="text-gray-500">
                                <div className="font-medium">选择MBTI性格类型（可选）</div>
                                <div className="text-sm">帮助AI更好地理解性格特征</div>
                            </div>
                            {isExpanded ? (
                                <ChevronUpIcon className="w-5 h-5 text-gray-400" />
                            ) : (
                                <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                            )}
                        </div>
                    )}
                </button>

                {/* 下拉选项 */}
                {isExpanded && !disabled && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-hidden">
                        {/* 搜索框 */}
                        <div className="p-3 border-b border-gray-200">
                            <input
                                type="text"
                                placeholder="搜索MBTI类型..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                            />
                        </div>

                        {/* 选项列表 */}
                        <div className="max-h-80 overflow-y-auto">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => handleSelect(option.value)}
                                        className={`
                      w-full p-4 text-left hover:bg-purple-50 transition-colors border-b border-gray-100 last:border-b-0
                      ${value === option.value ? 'bg-purple-100' : ''}
                    `}
                                    >
                                        <div className="font-semibold text-purple-700">{option.label}</div>
                                        <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {option.traits.map((trait, index) => (
                                                <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                                                    {trait}
                                                </span>
                                            ))}
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="p-4 text-center text-gray-500">
                                    没有找到匹配的MBTI类型
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* MBTI说明 */}
            {!selectedMBTI && (
                <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-600">
                        💡 <strong>什么是MBTI？</strong> MBTI是一种性格分类指标，包含16种不同的性格类型。
                        选择您的MBTI类型可以帮助AI更好地理解您的性格特征，从而推荐更符合个性的礼物。
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                        不确定自己的MBTI？可以搜索关键词或跳过此选项。
                    </p>
                </div>
            )}

            {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
        </div>
    );
}