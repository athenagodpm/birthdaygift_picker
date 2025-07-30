import React, { useState } from 'react';
import { BUDGET_OPTIONS } from '@/constants';
import { FormFieldProps } from '@/types';

interface BudgetSliderProps extends FormFieldProps {
    value?: string;
    onChange: (value: string) => void;
}

export default function BudgetSlider({
    value,
    onChange,
    error,
    disabled = false,
    className = ''
}: BudgetSliderProps) {
    const [customBudget, setCustomBudget] = useState({ min: '', max: '' });
    const [showCustomInput, setShowCustomInput] = useState(false);

    const handlePresetSelect = (budgetValue: string) => {
        onChange(budgetValue);
        setShowCustomInput(false);
    };

    const handleCustomBudgetSubmit = () => {
        const min = parseInt(customBudget.min);
        const max = parseInt(customBudget.max);

        if (min && max && min < max) {
            const customValue = `${min}-${max}元`;
            onChange(customValue);
            setShowCustomInput(false);
            setCustomBudget({ min: '', max: '' });
        }
    };

    const getSelectedBudgetInfo = () => {
        const selectedOption = BUDGET_OPTIONS.find(option => option.value === value);
        return selectedOption;
    };

    const selectedInfo = getSelectedBudgetInfo();

    return (
        <div className={className}>
            {/* 预设预算选项 */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                {BUDGET_OPTIONS.map((option, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => !disabled && handlePresetSelect(option.value)}
                        disabled={disabled}
                        className={`
              p-4 rounded-lg border-2 transition-all duration-200 text-center
              ${value === option.value
                                ? 'border-pink-500 bg-pink-50 shadow-md'
                                : 'border-gray-200 bg-white hover:border-pink-300 hover:bg-pink-25'
                            }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-sm'}
            `}
                    >
                        <div className={`font-semibold ${value === option.value ? 'text-pink-700' : 'text-gray-700'
                            }`}>
                            {option.label}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                            {option.min === 0 ? '经济实惠' :
                                option.max <= 200 ? '性价比高' :
                                    option.max <= 500 ? '品质之选' :
                                        option.max <= 1000 ? '精品推荐' : '奢华礼品'}
                        </div>
                    </button>
                ))}
            </div>

            {/* 自定义预算输入 */}
            <div className="border-t pt-4">
                {!showCustomInput ? (
                    <button
                        type="button"
                        onClick={() => !disabled && setShowCustomInput(true)}
                        disabled={disabled}
                        className={`
              w-full p-3 border-2 border-dashed rounded-lg transition-colors
              ${disabled
                                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                                : 'border-gray-300 text-gray-600 hover:border-pink-300 hover:bg-pink-25 cursor-pointer'
                            }
            `}
                    >
                        + 自定义预算范围
                    </button>
                ) : (
                    <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-700">自定义预算范围：</p>
                        <div className="flex items-center space-x-3">
                            <div className="flex-1">
                                <input
                                    type="number"
                                    value={customBudget.min}
                                    onChange={(e) => setCustomBudget(prev => ({ ...prev, min: e.target.value }))}
                                    placeholder="最低金额"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none"
                                    disabled={disabled}
                                />
                            </div>
                            <span className="text-gray-500">-</span>
                            <div className="flex-1">
                                <input
                                    type="number"
                                    value={customBudget.max}
                                    onChange={(e) => setCustomBudget(prev => ({ ...prev, max: e.target.value }))}
                                    placeholder="最高金额"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none"
                                    disabled={disabled}
                                />
                            </div>
                            <span className="text-gray-500">元</span>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                type="button"
                                onClick={handleCustomBudgetSubmit}
                                disabled={disabled || !customBudget.min || !customBudget.max}
                                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                确定
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowCustomInput(false);
                                    setCustomBudget({ min: '', max: '' });
                                }}
                                disabled={disabled}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                取消
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* 选中预算的详细信息 */}
            {selectedInfo && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-blue-800">已选择预算：{selectedInfo.label}</p>
                            <p className="text-sm text-blue-600 mt-1">
                                💰 在这个价位，我们会为您推荐{
                                    selectedInfo.max <= 100 ? '实用性强的小礼品' :
                                        selectedInfo.max <= 300 ? '有纪念意义的精美礼品' :
                                            selectedInfo.max <= 500 ? '品质优良的特色礼品' :
                                                '高端精品或定制化礼品'
                                }
                            </p>
                        </div>
                        {!disabled && (
                            <button
                                type="button"
                                onClick={() => onChange('')}
                                className="text-blue-600 hover:text-blue-800 text-sm underline"
                            >
                                重新选择
                            </button>
                        )}
                    </div>
                </div>
            )}

            {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
        </div>
    );
}