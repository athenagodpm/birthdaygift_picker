import React, { useState } from 'react';
import { BUDGET_OPTIONS } from '@/constants';
import { FormFieldProps } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';

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
    const { t } = useTranslation();
    const [customBudget, setCustomBudget] = useState({ min: '', max: '' });
    const [showCustomInput, setShowCustomInput] = useState(false);

    // 获取本地化的预算标签
    const getBudgetLabel = (option: typeof BUDGET_OPTIONS[0]) => {
        const key = option.value.replace('元', '').replace('以下', '').replace('以上', '+').replace('-', '-');
        if (option.min === 0) return t('questionnaire.budget.options.0-50');
        if (option.max === 100) return t('questionnaire.budget.options.50-100');
        if (option.max === 200) return t('questionnaire.budget.options.100-200');
        if (option.max === 500) return t('questionnaire.budget.options.200-500');
        if (option.max === 1000) return t('questionnaire.budget.options.500-1000');
        return t('questionnaire.budget.options.1000+');
    };

    // 获取预算描述
    const getBudgetDescription = (option: typeof BUDGET_OPTIONS[0]) => {
        if (option.min === 0) return t('questionnaire.budget.descriptions.affordable');
        if (option.max <= 200) return t('questionnaire.budget.descriptions.valueForMoney');
        if (option.max <= 500) return t('questionnaire.budget.descriptions.quality');
        if (option.max <= 1000) return t('questionnaire.budget.descriptions.premium');
        return t('questionnaire.budget.descriptions.luxury');
    };

    // 获取推荐类型
    const getRecommendationType = (option: typeof BUDGET_OPTIONS[0]) => {
        if (option.max <= 100) return t('questionnaire.budget.recommendations.practical');
        if (option.max <= 300) return t('questionnaire.budget.recommendations.memorable');
        if (option.max <= 500) return t('questionnaire.budget.recommendations.quality');
        return t('questionnaire.budget.recommendations.premium');
    };

    const handlePresetSelect = (budgetValue: string) => {
        onChange(budgetValue);
        setShowCustomInput(false);
    };

    const handleCustomBudgetSubmit = () => {
        const min = parseInt(customBudget.min);
        const max = parseInt(customBudget.max);

        if (min && max && min < max) {
            const customValue = `${min}-${max}${t('questionnaire.budget.currency')}`;
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
                            {getBudgetLabel(option)}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                            {getBudgetDescription(option)}
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
                        + {t('questionnaire.budget.custom')}
                    </button>
                ) : (
                    <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-700">{t('questionnaire.budget.custom')}：</p>
                        <div className="flex items-center space-x-3">
                            <div className="flex-1">
                                <input
                                    type="number"
                                    value={customBudget.min}
                                    onChange={(e) => setCustomBudget(prev => ({ ...prev, min: e.target.value }))}
                                    placeholder={t('questionnaire.budget.customMin')}
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
                                    placeholder={t('questionnaire.budget.customMax')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none"
                                    disabled={disabled}
                                />
                            </div>
                            <span className="text-gray-500">{t('questionnaire.budget.currency')}</span>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                type="button"
                                onClick={handleCustomBudgetSubmit}
                                disabled={disabled || !customBudget.min || !customBudget.max}
                                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {t('questionnaire.budget.confirm')}
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
                                {t('questionnaire.budget.cancel')}
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
                            <p className="font-medium text-blue-800">{t('questionnaire.budget.selected')}{getBudgetLabel(selectedInfo)}</p>
                            <p className="text-sm text-blue-600 mt-1">
                                {t('questionnaire.budget.budgetHint')}{getRecommendationType(selectedInfo)}
                            </p>
                        </div>
                        {!disabled && (
                            <button
                                type="button"
                                onClick={() => onChange('')}
                                className="text-blue-600 hover:text-blue-800 text-sm underline"
                            >
                                {t('questionnaire.budget.reselect')}
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