'use client';

import React, { useState } from 'react';
import { GiftRequest, FormState } from '@/types';
import { validateGiftRequestI18n } from '@/utils/validation';
import { useTranslation } from '@/hooks/useTranslation';
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
    const { t } = useTranslation();
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
        console.log(`🔄 updateFormData called: ${field} = ${JSON.stringify(value)}`);
        console.log(`📊 Current formState.data:`, formState.data);

        const newData = { ...formState.data, [field]: value };
        console.log(`📦 New data after update:`, newData);

        // 检查年龄是否意外改变
        if (field !== 'age' && formState.data.age !== newData.age) {
            console.error(`🚨 年龄意外改变! 字段: ${field}, 原年龄: ${formState.data.age}, 新年龄: ${newData.age}`);
        }

        const validation = validateGiftRequestI18n(newData, t);
        console.log(`✅ Validation result:`, validation);

        setFormState(prev => ({
            ...prev,
            data: newData,
            errors: validation.errors,
            isValid: validation.isValid
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validation = validateGiftRequestI18n(formState.data, t);
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
                    {t('questionnaire.title')} 🎯
                </h2>
                <p className="text-gray-600">
                    {t('questionnaire.description')}
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
                        {t('questionnaire.gender.label')} <span className="text-red-500">*</span>
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
                        {t('questionnaire.age.label')} <span className="text-red-500">*</span>
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
                        {t('questionnaire.birthday.label')} <span className="text-gray-400">({t('questionnaire.optional')})</span>
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
                        {t('questionnaire.interests.label')} <span className="text-red-500">*</span>
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
                        {t('questionnaire.mbti.label')} <span className="text-gray-400">({t('questionnaire.optional')})</span>
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
                        {t('questionnaire.budget.label')} <span className="text-red-500">*</span>
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
                        {t('questionnaire.pastGifts.label')} <span className="text-gray-400">({t('questionnaire.optional')})</span>
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
                                {t('questionnaire.analyzing')}
                            </div>
                        ) : (
                            t('questionnaire.getRecommendations')
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}