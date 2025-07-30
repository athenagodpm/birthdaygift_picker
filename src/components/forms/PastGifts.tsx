import React, { useState } from 'react';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { PAST_GIFT_SUGGESTIONS } from '@/constants';
import { FormFieldProps } from '@/types';

interface PastGiftsProps extends FormFieldProps {
    value?: string[];
    onChange: (value: string[]) => void;
}

export default function PastGifts({
    value = [],
    onChange,
    error,
    disabled = false,
    className = ''
}: PastGiftsProps) {
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    // 过滤建议，排除已选择的礼物
    const filteredSuggestions = PAST_GIFT_SUGGESTIONS.filter(
        suggestion =>
            !value.includes(suggestion) &&
            suggestion.toLowerCase().includes(inputValue.toLowerCase())
    );

    const addGift = (gift: string) => {
        if (gift.trim() && !value.includes(gift.trim()) && value.length < 20) {
            onChange([...value, gift.trim()]);
            setInputValue('');
            setShowSuggestions(false);
        }
    };

    const removeGift = (giftToRemove: string) => {
        onChange(value.filter(gift => gift !== giftToRemove));
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (inputValue.trim()) {
                addGift(inputValue);
            }
        } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
            // 当输入框为空且按下退格键时，删除最后一个标签
            removeGift(value[value.length - 1]);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        addGift(suggestion);
    };

    return (
        <div className={className}>
            {/* 说明文字 */}
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                    💡 告诉我们您之前送过的礼物，我们会避免重复推荐，让每次送礼都有新意！
                </p>
            </div>

            {/* 已选择的礼物标签 */}
            {value.length > 0 && (
                <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                        {value.map((gift, index) => (
                            <div
                                key={index}
                                className="inline-flex items-center px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm"
                            >
                                <span>{gift}</span>
                                {!disabled && (
                                    <button
                                        type="button"
                                        onClick={() => removeGift(gift)}
                                        className="ml-2 p-0.5 hover:bg-purple-200 rounded-full transition-colors"
                                    >
                                        <XMarkIcon className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        已添加 {value.length}/20 个礼物
                    </p>
                </div>
            )}

            {/* 输入框 */}
            <div className="relative">
                <div className={`
          flex items-center border-2 rounded-lg transition-colors duration-200
          ${error
                        ? 'border-red-300 focus-within:border-red-500'
                        : 'border-gray-300 focus-within:border-purple-500'
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
                        disabled={disabled || value.length >= 20}
                        placeholder={value.length >= 20 ? "已达到最大数量" : "输入已送过的礼物，按回车添加"}
                        className="flex-1 px-4 py-3 bg-transparent focus:outline-none disabled:cursor-not-allowed"
                    />
                    {inputValue && !disabled && (
                        <button
                            type="button"
                            onClick={() => addGift(inputValue)}
                            className="mr-2 p-2 text-purple-500 hover:bg-purple-50 rounded-lg transition-colors"
                        >
                            <PlusIcon className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* 建议下拉列表 */}
                {showSuggestions && filteredSuggestions.length > 0 && !disabled && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {filteredSuggestions.slice(0, 8).map((suggestion, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="w-full px-4 py-2 text-left hover:bg-purple-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* 快速选择常见礼物 */}
            {value.length === 0 && (
                <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-3">常见礼物类型：</p>
                    <div className="flex flex-wrap gap-2">
                        {PAST_GIFT_SUGGESTIONS.slice(0, 10).map((suggestion, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => !disabled && addGift(suggestion)}
                                disabled={disabled}
                                className={`
                  px-3 py-1.5 text-sm border rounded-full transition-colors
                  ${disabled
                                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'border-gray-300 text-gray-600 hover:border-purple-300 hover:bg-purple-50 cursor-pointer'
                                    }
                `}
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* 空状态提示 */}
            {value.length === 0 && (
                <div className="mt-4 text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">🎁</div>
                    <p className="text-sm">还没有添加过往礼物？没关系，跳过这一步也可以！</p>
                </div>
            )}

            {/* 提示信息 */}
            {value.length > 0 && (
                <p className="text-sm text-gray-500 mt-2">
                    ✨ 很好！我们会避免推荐这些类型的礼物，为您提供更多新颖的选择
                </p>
            )}

            {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
        </div>
    );
}