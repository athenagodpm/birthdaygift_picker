import { GiftResponse, GiftRecommendation } from '@/types';

export class FastResponseProcessor {
    // 快速处理响应数据 - 最小化验证和处理
    static processGiftResponse(rawResponse: unknown): GiftResponse {
        try {
            // 基础验证
            if (!rawResponse || typeof rawResponse !== 'object') {
                throw new Error('响应格式不正确');
            }

            const { recommendations, blessing } = rawResponse as { recommendations: unknown; blessing: unknown };

            // 快速验证推荐数组
            if (!Array.isArray(recommendations) || recommendations.length === 0) {
                throw new Error('推荐数据不正确');
            }

            // 快速验证祝福语
            if (!blessing || typeof blessing !== 'string') {
                throw new Error('祝福语不正确');
            }

            // 快速处理推荐 - 最小化处理
            const processedRecommendations: GiftRecommendation[] = recommendations.slice(0, 3).map((rec: any) => ({
                giftName: String(rec.giftName || '精美礼品').trim(),
                reason: String(rec.reason || '精心挑选的礼物').trim(),
                estimatedPrice: String(rec.estimatedPrice || '价格面议').trim()
            }));

            // 确保有3个推荐
            while (processedRecommendations.length < 3) {
                processedRecommendations.push({
                    giftName: '个性化定制礼品',
                    reason: '根据您的需求精心挑选',
                    estimatedPrice: '价格面议'
                });
            }

            return {
                recommendations: processedRecommendations,
                blessing: String(blessing).trim()
            };

        } catch (error) {
            console.error('快速响应处理失败:', error);
            throw error;
        }
    }

    // 快速验证 - 只检查必要字段
    static validateResponse(response: GiftResponse): boolean {
        return !!(
            response &&
            response.recommendations &&
            Array.isArray(response.recommendations) &&
            response.recommendations.length >= 1 &&
            response.blessing &&
            typeof response.blessing === 'string'
        );
    }

    // 生成简单摘要
    static generateSummary(response: GiftResponse): string {
        const firstGift = response.recommendations[0]?.giftName || '未知';
        const blessingPreview = response.blessing.substring(0, 30) + '...';
        return `首个推荐: ${firstGift}; 祝福: ${blessingPreview}`;
    }
}