import React, { useState } from 'react';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { PAST_GIFT_SUGGESTIONS } from '@/constants';
import { FormFieldProps } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';

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
    const { t, language } = useTranslation();
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    // 获取本地化的礼物建议
    const getLocalizedGiftSuggestions = () => {
        if (language === 'en') {
            // 英文礼物建议
            return [
                'Flowers', 'Chocolate', 'Perfume', 'Watch', 'Necklace', 'Earrings',
                'Handbag', 'Clothing', 'Shoes', 'Books', 'Electronics', 'Cosmetics',
                'Skincare', 'Toys', 'Decorations', 'Stationery', 'Sports Equipment',
                'Musical Instruments', 'Artwork', 'Food'
            ];
        }
        return PAST_GIFT_SUGGESTIONS;
    };

    const localizedGiftSuggestions = getLocalizedGiftSuggestions();

    // 过滤建议，保持所有建议可见，只根据输入内容过滤
    const filteredSuggestions = localizedGiftSuggestions.filter(
        suggestion =>
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
                    {t('questionnaire.pastGifts.hint')}
                </p>
            </div>

            {/* 已选择的礼物标签 */}
            {value.length > 0 && (
                <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                        {value.map((gift, index) => (
                            <div
                                key={index}
                                className="inline-flex items-center px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm transition-all duration-200 hover:scale-105 hover:shadow-md"
                            >
                                <span>{gift}</span>
                                {!disabled && (
                                    <button
                                        type="button"
                                        onClick={() => removeGift(gift)}
                                        className="ml-2 p-0.5 hover:bg-purple-200 rounded-full transition-all duration-200 hover:scale-110"
                                    >
                                        <XMarkIcon className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        {t('questionnaire.pastGifts.added')} {value.length}{t('questionnaire.pastGifts.of')}20 {t('questionnaire.pastGifts.items')}
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
                        placeholder={value.length >= 20 ? t('questionnaire.pastGifts.maxReached') : t('questionnaire.pastGifts.inputPlaceholder')}
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
                        {filteredSuggestions.slice(0, 8).map((suggestion, index) => {
                            const isSelected = value.includes(suggestion);
                            return (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => isSelected ? removeGift(suggestion) : handleSuggestionClick(suggestion)}
                                    className={`
                    w-full px-4 py-2 text-left transition-colors first:rounded-t-lg last:rounded-b-lg
                    ${isSelected
                                            ? 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                                            : 'hover:bg-purple-50'
                                        }
                  `}
                                >
                                    <span className="flex items-center justify-between">
                                        <span>{suggestion}</span>
                                        {isSelected && <span className="text-purple-500 text-sm">✓</span>}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 快速选择常见礼物 */}
            <div className="mt-4">
                <p className="text-sm text-gray-600 mb-3">{t('questionnaire.pastGifts.common')}</p>
                <div className="flex flex-wrap gap-2">
                    {localizedGiftSuggestions.slice(0, 10).map((suggestion, index) => {
                        const isSelected = value.includes(suggestion);
                        return (
                            <button
                                key={index}
                                type="button"
                                onClick={() => !disabled && (isSelected ? removeGift(suggestion) : addGift(suggestion))}
                                disabled={disabled}
                                className={`
                  px-3 py-1.5 text-sm border rounded-full transition-all duration-200
                  ${disabled
                                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                                        : isSelected
                                            ? 'border-purple-500 bg-purple-100 text-purple-700 hover:bg-purple-200'
                                            : 'border-gray-300 text-gray-600 hover:border-purple-300 hover:bg-purple-50 cursor-pointer'
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
            {value.length > 0 && (
                <p className="text-sm text-gray-500 mt-2">
                    {t('questionnaire.pastGifts.successHint')}
                </p>
            )}

            {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
        </div>
    );
}