// 核心数据类型定义

export interface GiftRequest {
    gender: 'male' | 'female' | 'other';
    age: number;
    interests: string[];
    pastGifts: string[];
    budget: string;
    birthday?: string;
    birthdayDate?: string; // 格式: MM-DD
    mbti?: string; // MBTI性格类型
}

export interface GiftRecommendation {
    giftName: string;
    reason: string;
    estimatedPrice: string;
}

export interface GiftResponse {
    recommendations: GiftRecommendation[];
    blessing: string;
}

export interface ApiError {
    error: string;
    details?: string;
}

// 表单状态管理
export interface FormState {
    data: Partial<GiftRequest>;
    errors: Record<string, string>;
    isSubmitting: boolean;
    isValid: boolean;
}

// 错误处理类型
export enum ErrorType {
    VALIDATION_ERROR = 'validation_error',
    API_ERROR = 'api_error',
    NETWORK_ERROR = 'network_error',
    LLM_ERROR = 'llm_error'
}

// 预算选项类型
export interface BudgetOption {
    label: string;
    value: string;
    min: number;
    max: number;
}

// 性别选项类型
export interface GenderOption {
    label: string;
    value: 'male' | 'female' | 'other';
    icon: string;
}

// MBTI选项类型
export interface MBTIOption {
    label: string;
    value: string;
    description: string;
    traits: string[];
}

// 表单验证规则
export interface ValidationRule {
    required?: boolean;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: unknown) => boolean;
}

export interface ValidationSchema {
    [key: string]: ValidationRule;
}

// API响应状态
export enum ApiStatus {
    IDLE = 'idle',
    LOADING = 'loading',
    SUCCESS = 'success',
    ERROR = 'error'
}

// 组件Props类型
export interface BaseComponentProps {
    className?: string;
    children?: React.ReactNode;
}

// 表单字段Props
export interface FormFieldProps extends BaseComponentProps {
    label?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
}