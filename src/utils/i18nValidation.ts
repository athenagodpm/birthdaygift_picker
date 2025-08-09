import { ValidationSchema } from '@/types';

// 多语言验证函数类型
export type I18nValidationFunction = (key: string, params?: Record<string, string>) => string;

// 礼物请求数据验证模式
export const giftRequestSchema: ValidationSchema = {
    gender: {
        required: true
    },
    age: {
        required: true,
        min: 1,
        max: 120
    },
    interests: {
        required: true,
        minLength: 1,
        maxLength: 10
    },
    pastGifts: {
        required: false,
        maxLength: 20
    },
    budget: {
        required: true,
        pattern: /^\d+-\d+元$|^\d+元以上$|^\d+元以下$|^\$\d+-\d+$|^\$\d+\+$/
    },
    birthday: {
        required: false
    }
};

// 多语言验证单个字段
export const validateFieldI18n = (
    fieldName: string,
    value: unknown,
    t: I18nValidationFunction
): string | null => {
    const rule = giftRequestSchema[fieldName];
    if (!rule) return null;

    // 必填验证
    if (rule.required && (!value || (Array.isArray(value) && value.length === 0) || (typeof value === 'string' && value.trim() === ''))) {
        return t('validation.required');
    }

    // 如果值不存在且不是必填，直接返回null
    if (!value && !rule.required) {
        return null;
    }

    // 数字范围验证
    if (typeof value === 'number') {
        if (rule.min !== undefined && value < rule.min) {
            return t('validation.minValue', { min: rule.min.toString() });
        }
        if (rule.max !== undefined && value > rule.max) {
            return t('validation.maxValue', { max: rule.max.toString() });
        }
    }

    // 数组长度验证
    if (Array.isArray(value)) {
        if (rule.minLength !== undefined && value.length < rule.minLength) {
            return t('validation.minLength', { min: rule.minLength.toString() });
        }
        if (rule.maxLength !== undefined && value.length > rule.maxLength) {
            return t('validation.maxLength', { max: rule.maxLength.toString() });
        }
    }

    // 正则表达式验证
    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
        return t('validation.invalidFormat');
    }

    // 自定义验证
    if (rule.custom && !rule.custom(value)) {
        return t('validation.validationFailed');
    }

    return null;
};