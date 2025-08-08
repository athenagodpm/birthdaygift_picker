'use client';

import React, { useState } from 'react';
import { GiftRequest, FormState } from '@/types';
import { validateGiftRequest } from '@/utils/validation';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import GenderSelector from '@/components/forms/GenderSelector';
import AgeInput from '@/components/forms/AgeInput';
import InterestTags from '@/components/forms/InterestTags';
import BudgetSlider from '@/components/forms/BudgetSlider';
import PastGifts from '@/components/forms/PastGifts';
import BirthdayDatePicker from '@/components/forms/BirthdayDatePicker';
import MBTISelector from '@/components/forms/MBTISelector';

interface GiftQuestionnaireFormProps {
    onSubmit: (data: GiftRequest) => Promise<void>;
    isLoading?: boolean;
    error?: string;
}

export default function GiftQuestionnaireForm({
    onSubmit,
    isLoading = false,
    error
}: GiftQuestionnaireFormProps) {
    const [formState, setFormState] = useState<FormState>({
        data: {
            gender: undefined,
            age: undefined,
            interests: [],
            pastGifts: [],
            budget: '',
            birthday: '',
            birthdayDate: '',
            mbti: ''
        },
        errors: {},
        isSubmitting: false,
        isValid: false
    });

    const updateFormData = (field: keyof GiftRequest, value: unknown) => {
        const newData = { ...formState.data, [field]: value };
        const validation = validateGiftRequest(newData);

        setFormState(prev => ({
            ...prev,
            data: newData,
            errors: validation.errors,
            isValid: validation.isValid
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validation = validateGiftRequest(formState.data);
        if (!validation.isValid) {
            setFormState(prev => ({
                ...prev,
                errors: validation.errors
            }));
            return;
        }

        try {
            setFormState(prev => ({ ...prev, isSubmitting: true }));
            await onSubmit(formState.data as GiftRequest);
        } catch (error) {
            console.error('Form submission error:', error);
        } finally {
            setFormState(prev => ({ ...prev, isSubmitting: false }));
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    告诉我们收礼人的信息 🎯
                </h2>
                <p className="text-gray-600">
                    几个简单问题，帮你找到最贴心的礼物
                </p>
            </div>

            {error && (
                <ErrorMessage
                    message={error}
                    className="mb-6"
                />
            )}

            <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-500">
                {/* 性别选择 */}
                <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-4">
                        收礼人性别 <span className="text-red-500">*</span>
                    </label>
                    <GenderSelector
                        value={formState.data.gender}
                        onChange={(value) => updateFormData('gender', value)}
                        error={formState.errors.gender}
                        disabled={isLoading || formState.isSubmitting}
                    />
                </div>

                {/* 年龄输入 */}
                <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-4">
                        收礼人年龄 <span className="text-red-500">*</span>
                    </label>
                    <AgeInput
                        value={formState.data.age}
                        onChange={(value) => updateFormData('age', value)}
                        error={formState.errors.age}
                        disabled={isLoading || formState.isSubmitting}
                    />
                </div>

                {/* 生日日期 */}
                <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-4">
                        生日日期 <span className="text-gray-400">(可选)</span>
                    </label>
                    <BirthdayDatePicker
                        value={formState.data.birthdayDate}
                        onChange={(value) => updateFormData('birthdayDate', value)}
                        error={formState.errors.birthdayDate}
                        disabled={isLoading || formState.isSubmitting}
                    />
                </div>

                {/* 兴趣爱好 */}
                <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-4">
                        兴趣爱好 <span className="text-red-500">*</span>
                    </label>
                    <InterestTags
                        value={formState.data.interests}
                        onChange={(value) => updateFormData('interests', value)}
                        error={formState.errors.interests}
                        disabled={isLoading || formState.isSubmitting}
                    />
                </div>

                {/* MBTI性格类型 */}
                <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-4">
                        MBTI性格类型 <span className="text-gray-400">(可选)</span>
                    </label>
                    <MBTISelector
                        value={formState.data.mbti}
                        onChange={(value) => updateFormData('mbti', value)}
                        error={formState.errors.mbti}
                        disabled={isLoading || formState.isSubmitting}
                    />
                </div>

                {/* 预算范围 */}
                <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-4">
                        预算范围 <span className="text-red-500">*</span>
                    </label>
                    <BudgetSlider
                        value={formState.data.budget}
                        onChange={(value) => updateFormData('budget', value)}
                        error={formState.errors.budget}
                        disabled={isLoading || formState.isSubmitting}
                    />
                </div>

                {/* 已送礼物 */}
                <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-4">
                        已送过的礼物 <span className="text-gray-400">(可选)</span>
                    </label>
                    <PastGifts
                        value={formState.data.pastGifts}
                        onChange={(value) => updateFormData('pastGifts', value)}
                        error={formState.errors.pastGifts}
                        disabled={isLoading || formState.isSubmitting}
                    />
                </div>

                {/* 提交按钮 */}
                <div className="pt-6">
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={!formState.isValid || isLoading || formState.isSubmitting}
                        className="w-full"
                    >
                        {isLoading || formState.isSubmitting ? (
                            <div className="flex items-center justify-center">
                                <LoadingSpinner size="sm" className="mr-2" />
                                AI正在分析中...
                            </div>
                        ) : (
                            '获取礼物推荐 🎁'
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}