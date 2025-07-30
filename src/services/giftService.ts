import { GiftRequest, GiftResponse, ApiError } from '@/types';
import { API_CONFIG } from '@/constants';

export class GiftService {
    private static async fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    static async generateGiftRecommendations(request: GiftRequest): Promise<GiftResponse> {
        console.log('🚀 开始API请求，超时设置:', API_CONFIG.TIMEOUT, 'ms');

        return this.retryRequest(async () => {
            try {
                const response = await this.fetchWithTimeout(
                    API_CONFIG.ENDPOINTS.GENERATE_GIFT,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(request),
                    },
                    API_CONFIG.TIMEOUT
                );

                if (!response.ok) {
                    const errorData: ApiError = await response.json();
                    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
                }

                const data: GiftResponse = await response.json();
                console.log('✅ API请求成功');
                return data;
            } catch (error) {
                console.error('❌ API请求失败:', error);
                if (error instanceof Error) {
                    if (error.name === 'AbortError') {
                        throw new Error('请求超时，请稍后重试');
                    }
                    throw error;
                }
                throw new Error('网络请求失败');
            }
        });
    }

    static async retryRequest<T>(
        requestFn: () => Promise<T>,
        maxRetries: number = API_CONFIG.MAX_RETRIES
    ): Promise<T> {
        let lastError: Error;

        for (let i = 0; i <= maxRetries; i++) {
            try {
                return await requestFn();
            } catch (error) {
                lastError = error instanceof Error ? error : new Error('Unknown error');

                if (i === maxRetries) {
                    break;
                }

                // 指数退避延迟
                const delay = Math.pow(2, i) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        throw lastError!;
    }
}