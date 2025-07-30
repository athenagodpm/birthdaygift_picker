import { GiftRequest } from '@/types';
import { validateField } from '@/schemas/giftRequest';

export const validateGiftRequest = (data: Partial<GiftRequest>): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};

    // 使用统一的验证函数验证每个字段
    const fieldsToValidate: (keyof GiftRequest)[] = ['gender', 'age', 'interests', 'pastGifts', 'budget'];

    fieldsToValidate.forEach(field => {
        const error = validateField(field, data[field]);
        if (error) {
            errors[field] = error;
        }
    });

    // 特殊验证逻辑已经在validateField中处理

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// 验证单个字段的便捷函数
export const validateSingleField = (fieldName: keyof GiftRequest, value: unknown): string | null => {
    return validateField(fieldName, value);
};