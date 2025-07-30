import { ErrorType } from '@/types';

export const handleError = (error: Error, type: ErrorType) => {
    const errorMessages = {
        [ErrorType.VALIDATION_ERROR]: '请检查输入信息是否完整正确',
        [ErrorType.API_ERROR]: '服务暂时不可用，请稍后重试',
        [ErrorType.NETWORK_ERROR]: '网络连接异常，请检查网络设置',
        [ErrorType.LLM_ERROR]: 'AI服务暂时繁忙，请稍后重试'
    };

    return {
        message: errorMessages[type] || '发生未知错误',
        details: error.message
    };
};