import React, { useState } from 'react';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { INTEREST_SUGGESTIONS } from '@/constants';
import { FormFieldProps } from '@/types';

interface InterestTagsProps extends FormFieldProps {
    value?: string[];
    onChange: (value: string[]) => void;
}

export default function InterestTags({
    value = [],
    onChange,
    error,
    disabled = false,
    className = ''
}: InterestTagsProps) {
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    // 过滤建议，保持所有建议可见，只根据输入内容过滤
    const filteredSuggestions = INTEREST_SUGGESTIONS.filter(
        suggestion =>
            suggestion.toLowerCase().includes(inputValue.toLowerCase())
    );

    const addInterest = (interest: string) => {
        if (interest.trim() && !value.includes(interest.trim()) && value.length < 10) {
            onChange([...value, interest.trim()]);
            setInputValue('');
            setShowSuggestions(false);
        }
    };

    const removeInterest = (interestToRemove: string) => {
        onChange(value.filter(interest => interest !== interestToRemove));
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (inputValue.trim()) {
                addInterest(inputValue);
            }
        } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
            // 当输入框为空且按下退格键时，删除最后一个标签
            removeInterest(value[value.length - 1]);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        addInterest(suggestion);
    };

    return (
        <div className={className}>
            {/* 已选择的兴趣标签 */}
            {value.length > 0 && (
                <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                        {value.map((interest, index) => (
                            <div
                                key={index}
                                className="inline-flex items-center px-3 py-1.5 bg-pink-100 text-pink-800 rounded-full text-sm transition-all duration-200 hover:scale-105 hover:shadow-md"
                            >
                                <span>{interest}</span>
                                {!disabled && (
                                    <button
                                        type="button"
                                        onClick={() => removeInterest(interest)}
                                        className="ml-2 p-0.5 hover:bg-pink-200 rounded-full transition-all duration-200 hover:scale-110"
                                    >
                                        <XMarkIcon className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        已选择 {value.length}/10 个兴趣爱好
                    </p>
                </div>
            )}

            {/* 输入框 */}
            <div className="relative">
                <div className={`
          flex items-center border-2 rounded-lg transition-colors duration-200
          ${error
                        ? 'border-red-300 focus-within:border-red-500'
                        : 'border-gray-300 focus-within:border-pink-500'
                    }
          ${disabled ? 'bg-gray-100' : 'bg-white'}
        `}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleInputKeyDown}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        disabled={disabled || value.length >= 10}
                        placeholder={value.length >= 10 ? "已达到最大数量" : "输入兴趣爱好，按回车添加"}
                        className="flex-1 px-4 py-3 bg-transparent focus:outline-none disabled:cursor-not-allowed"
                    />
                    {inputValue && !disabled && (
                        <button
                            type="button"
                            onClick={() => addInterest(inputValue)}
                            className="mr-2 p-2 text-pink-500 hover:bg-pink-50 rounded-lg transition-colors"
                        >
                            <PlusIcon className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* 建议下拉列表 */}
                {showSuggestions && filteredSuggestions.length > 0 && !disabled && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {filteredSuggestions.slice(0, 8).map((suggestion, index) => {
                            const isSelected = value.includes(suggestion);
                            return (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => isSelected ? removeInterest(suggestion) : handleSuggestionClick(suggestion)}
                                    className={`
                    w-full px-4 py-2 text-left transition-colors first:rounded-t-lg last:rounded-b-lg
                    ${isSelected
                                            ? 'bg-pink-50 text-pink-700 hover:bg-pink-100'
                                            : 'hover:bg-pink-50'
                                        }
                  `}
                                >
                                    <span className="flex items-center justify-between">
                                        <span>{suggestion}</span>
                                        {isSelected && <span className="text-pink-500 text-sm">✓</span>}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 快速选择常见兴趣 */}
            <div className="mt-4">
                <p className="text-sm text-gray-600 mb-3">常见兴趣爱好：</p>
                <div className="flex flex-wrap gap-2">
                    {INTEREST_SUGGESTIONS.slice(0, 12).map((suggestion, index) => {
                        const isSelected = value.includes(suggestion);
                        return (
                            <button
                                key={index}
                                type="button"
                                onClick={() => !disabled && (isSelected ? removeInterest(suggestion) : addInterest(suggestion))}
                                disabled={disabled}
                                className={`
                  px-3 py-1.5 text-sm border rounded-full transition-all duration-200
                  ${disabled
                                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                                        : isSelected
                                            ? 'border-pink-500 bg-pink-100 text-pink-700 hover:bg-pink-200'
                                            : 'border-gray-300 text-gray-600 hover:border-pink-300 hover:bg-pink-50 cursor-pointer'
                                    }
                `}
                            >
                                {suggestion}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 提示信息 */}
            {value.length > 0 && value.length < 10 && (
                <p className="text-sm text-gray-500 mt-2">
                    💡 添加更多兴趣爱好可以获得更精准的推荐
                </p>
            )}

            {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
        </div>
    );
}