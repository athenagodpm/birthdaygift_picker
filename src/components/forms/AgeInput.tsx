import React, { useState } from 'react';
import { FormFieldProps } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';

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
    const { t } = useTranslation();
    const [inputValue, setInputValue] = useState(value?.toString() || '');

    // 当外部value变化时，同步更新inputValue
    React.useEffect(() => {
        if (value !== undefined) {
            setInputValue(value.toString());
        } else {
            setInputValue('');
        }
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);

        // 只允许数字输入
        if (newValue === '') {
            if (value !== undefined) {
                onChange(undefined);
            }
            return;
        }

        const numValue = parseInt(newValue, 10);
        if (!isNaN(numValue) && numValue !== value) {
            onChange(numValue);
        }
    };

    const handleBlur = () => {
        // 在失去焦点时，确保输入值在有效范围内
        const currentInputValue = parseInt(inputValue, 10);

        if (!isNaN(currentInputValue) && currentInputValue !== value) {
            let correctedValue = currentInputValue;

            if (currentInputValue < 1) {
                correctedValue = 1;
            } else if (currentInputValue > 120) {
                correctedValue = 120;
            }

            onChange(correctedValue);
            setInputValue(correctedValue.toString());
        } else if (value !== undefined) {
            // 确保输入框显示的值与实际值一致
            setInputValue(value.toString());
        }
    };

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
                        placeholder={t('questionnaire.age.placeholder')}
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
                        {t('questionnaire.age.unit')}
                    </div>
                </div>
            </div>

            {/* 年龄提示 */}
            {value && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                        {value <= 12 && t('questionnaire.age.hints.child')}
                        {value >= 13 && value <= 17 && t('questionnaire.age.hints.teen')}
                        {value >= 18 && value <= 35 && t('questionnaire.age.hints.young')}
                        {value >= 36 && value <= 55 && t('questionnaire.age.hints.middle')}
                        {value >= 56 && t('questionnaire.age.hints.senior')}
                    </p>
                </div>
            )}

            {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
        </div>
    );
}