// AI服务配置
export const AI_CONFIG = {
    // 豆包配置
    DOUBAO: {
        BASE_URL: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
        API_KEY_ENV: 'ARK_API_KEY',
        MODEL_ENV: 'DOUBAO_MODEL_NAME',
        TIMEOUT: 30000,
        MAX_TOKENS: 1000,
        TEMPERATURE: 0.8
    },

    // OpenAI配置
    OPENAI: {
        API_KEY_ENV: 'OPENAI_API_KEY',
        MODEL: 'gpt-4o-mini',
        TIMEOUT: 30000,
        MAX_TOKENS: 1000,
        TEMPERATURE: 0.8
    },

    // 服务优先级
    PRIORITY: ['DOUBAO', 'OPENAI', 'MOCK'] as const
};

// 检查服务是否可用
export function isServiceAvailable(service: keyof typeof AI_CONFIG): boolean {
    switch (service) {
        case 'DOUBAO':
            return !!(process.env.ARK_API_KEY && process.env.DOUBAO_MODEL_NAME);
        case 'OPENAI':
            return !!process.env.OPENAI_API_KEY;
        default:
            return false;
    }
}

// 获取可用的服务列表
export function getAvailableServices(): string[] {
    return AI_CONFIG.PRIORITY.filter(service =>
        service === 'MOCK' || isServiceAvailable(service as keyof typeof AI_CONFIG)
    );
}