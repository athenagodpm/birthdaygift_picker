import React, { useState } from 'react';
import { FormFieldProps } from '@/types';

interface BirthdayDatePickerProps extends FormFieldProps {
    value?: string; // 格式: MM-DD
    onChange: (value: string) => void;
}

export default function BirthdayDatePicker({
    value,
    onChange,
    error,
    disabled = false,
    className = ''
}: BirthdayDatePickerProps) {
    const [month, setMonth] = useState(value ? value.split('-')[0] : '');
    const [day, setDay] = useState(value ? value.split('-')[1] : '');

    const months = [
        { value: '01', label: '1月' },
        { value: '02', label: '2月' },
        { value: '03', label: '3月' },
        { value: '04', label: '4月' },
        { value: '05', label: '5月' },
        { value: '06', label: '6月' },
        { value: '07', label: '7月' },
        { value: '08', label: '8月' },
        { value: '09', label: '9月' },
        { value: '10', label: '10月' },
        { value: '11', label: '11月' },
        { value: '12', label: '12月' }
    ];

    const getDaysInMonth = (monthValue: string) => {
        const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        const monthIndex = parseInt(monthValue) - 1;
        return daysInMonth[monthIndex] || 31;
    };

    const handleMonthChange = (newMonth: string) => {
        setMonth(newMonth);
        if (newMonth && day) {
            onChange(`${newMonth}-${day}`);
        }
    };

    const handleDayChange = (newDay: string) => {
        setDay(newDay);
        if (month && newDay) {
            onChange(`${month}-${newDay}`);
        }
    };

    const getSeasonEmoji = (monthValue: string) => {
        const monthNum = parseInt(monthValue);
        if (monthNum >= 3 && monthNum <= 5) return '🌸'; // 春天
        if (monthNum >= 6 && monthNum <= 8) return '☀️'; // 夏天
        if (monthNum >= 9 && monthNum <= 11) return '🍂'; // 秋天
        return '❄️'; // 冬天
    };

    const getSeasonGifts = (monthValue: string) => {
        const monthNum = parseInt(monthValue);
        if (monthNum >= 3 && monthNum <= 5) return '春季适合：鲜花、春游用品、轻薄服饰';
        if (monthNum >= 6 && monthNum <= 8) return '夏季适合：防晒用品、清凉饮品、户外装备';
        if (monthNum >= 9 && monthNum <= 11) return '秋季适合：保温用品、秋装、温暖饰品';
        return '冬季适合：保暖用品、热饮、室内娱乐';
    };

    return (
        <div className={className}>
            <div className="grid grid-cols-2 gap-4 mb-4">
                {/* 月份选择 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">月份</label>
                    <select
                        value={month}
                        onChange={(e) => handleMonthChange(e.target.value)}
                        disabled={disabled}
                        className={`
              w-full px-3 py-2 border rounded-lg transition-colors duration-200
              ${error
                                ? 'border-red-300 focus:border-red-500'
                                : 'border-gray-300 focus:border-pink-500'
                            }
              ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
              focus:outline-none focus:ring-2 focus:ring-pink-200
            `}
                    >
                        <option value="">选择月份</option>
                        {months.map((m) => (
                            <option key={m.value} value={m.value}>
                                {m.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 日期选择 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">日期</label>
                    <select
                        value={day}
                        onChange={(e) => handleDayChange(e.target.value)}
                        disabled={disabled || !month}
                        className={`
              w-full px-3 py-2 border rounded-lg transition-colors duration-200
              ${error
                                ? 'border-red-300 focus:border-red-500'
                                : 'border-gray-300 focus:border-pink-500'
                            }
              ${disabled || !month ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
              focus:outline-none focus:ring-2 focus:ring-pink-200
            `}
                    >
                        <option value="">选择日期</option>
                        {month && Array.from({ length: getDaysInMonth(month) }, (_, i) => {
                            const dayValue = String(i + 1).padStart(2, '0');
                            return (
                                <option key={dayValue} value={dayValue}>
                                    {i + 1}日
                                </option>
                            );
                        })}
                    </select>
                </div>
            </div>

            {/* 季节提示 */}
            {month && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl">{getSeasonEmoji(month)}</span>
                        <div>
                            <p className="text-sm font-medium text-blue-800">季节礼物建议</p>
                            <p className="text-xs text-blue-600">{getSeasonGifts(month)}</p>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
        </div>
    );
}