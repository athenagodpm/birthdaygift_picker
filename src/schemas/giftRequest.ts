import { ValidationSchema } from '@/types';

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
        pattern: /^\d+-\d+元$|^\d+元以上$|^\d+元以下$/
    },
    birthday: {
        required: false
    }
};

// 验证单个字段
export const validateField = (fieldName: string, value: unknown): string | null => {
    const rule = giftRequestSchema[fieldName];
    if (!rule) return null;

    // 必填验证
    if (rule.required && (!value || (Array.isArray(value) && value.length === 0) || (typeof value === 'string' && value.trim() === ''))) {
        return '此字段为必填项';
    }

    // 如果值不存在且不是必填，直接返回null
    if (!value && !rule.required) {
        return null;
    }

    // 数字范围验证
    if (typeof value === 'number') {
        if (rule.min !== undefined && value < rule.min) {
            return `值不能小于 ${rule.min}`;
        }
        if (rule.max !== undefined && value > rule.max) {
            return `值不能大于 ${rule.max}`;
        }
    }

    // 数组长度验证
    if (Array.isArray(value)) {
        if (rule.minLength !== undefined && value.length < rule.minLength) {
            return `至少需要 ${rule.minLength} 个项目`;
        }
        if (rule.maxLength !== undefined && value.length > rule.maxLength) {
            return `最多只能有 ${rule.maxLength} 个项目`;
        }
    }

    // 正则表达式验证
    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
        return '格式不正确';
    }

    // 自定义验证
    if (rule.custom && !rule.custom(value)) {
        return '验证失败';
    }

    return null;
};