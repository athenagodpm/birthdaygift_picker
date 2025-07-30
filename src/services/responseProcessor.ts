import { GiftResponse, GiftRecommendation } from '@/types';

export class ResponseProcessor {
    // 验证和清理响应数据
    static processGiftResponse(rawResponse: unknown): GiftResponse {
        try {
            // 基础结构验证
            if (!rawResponse || typeof rawResponse !== 'object') {
                throw new Error('响应数据格式不正确');
            }

            const { recommendations, blessing } = rawResponse as { recommendations: unknown; blessing: unknown };

            // 验证推荐数组
            if (!Array.isArray(recommendations)) {
                throw new Error('推荐数据格式不正确');
            }

            if (recommendations.length !== 3) {
                throw new Error('推荐数量不正确，应该是3个');
            }

            // 验证祝福语
            if (!blessing || typeof blessing !== 'string' || blessing.trim().length === 0) {
                throw new Error('祝福语格式不正确');
            }

            // 处理每个推荐
            const processedRecommendations: GiftRecommendation[] = (recommendations as unknown[]).map((rec: unknown, index: number) => {
                return this.processRecommendation(rec, index + 1);
            });

            // 处理祝福语
            const processedBlessing = this.processBlessing(blessing);

            return {
                recommendations: processedRecommendations,
                blessing: processedBlessing
            };

        } catch (error) {
            console.error('响应数据处理失败:', error);
            throw new Error(`响应数据处理失败: ${error instanceof Error ? error.message : '未知错误'}`);
        }
    }

    // 处理单个推荐
    private static processRecommendation(rec: unknown, index: number): GiftRecommendation {
        // 验证必要字段
        if (!rec || typeof rec !== 'object') {
            throw new Error(`推荐${index}格式不正确`);
        }

        const { giftName, reason, estimatedPrice } = rec as { giftName: unknown; reason: unknown; estimatedPrice: unknown };

        // 验证礼物名称
        if (!giftName || typeof giftName !== 'string' || giftName.trim().length === 0) {
            throw new Error(`推荐${index}的礼物名称不能为空`);
        }

        // 验证推荐理由
        if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
            throw new Error(`推荐${index}的推荐理由不能为空`);
        }

        // 验证价格
        if (!estimatedPrice || typeof estimatedPrice !== 'string' || estimatedPrice.trim().length === 0) {
            throw new Error(`推荐${index}的价格信息不能为空`);
        }

        // 清理和格式化数据
        return {
            giftName: this.cleanText(giftName),
            reason: this.cleanText(reason),
            estimatedPrice: this.formatPrice(estimatedPrice)
        };
    }

    // 处理祝福语
    private static processBlessing(blessing: string): string {
        let processed = this.cleanText(blessing);

        // 确保祝福语长度适中
        if (processed.length > 200) {
            processed = processed.substring(0, 200) + '...';
        }

        // 如果没有emoji，添加一个
        if (!this.hasEmoji(processed)) {
            processed += ' 🎂';
        }

        return processed;
    }

    // 清理文本
    private static cleanText(text: string): string {
        return text
            .trim()
            .replace(/\s+/g, ' ') // 合并多个空格
            .replace(/[""]/g, '"') // 统一引号
            .replace(/['']/g, "'"); // 统一撇号
    }

    // 格式化价格
    private static formatPrice(price: string): string {
        let formatted = this.cleanText(price);

        // 确保价格包含"元"
        if (!formatted.includes('元')) {
            formatted += '元';
        }

        // 验证价格格式
        const pricePattern = /^\d+(-\d+)?元(以上|以下)?$/;
        if (!pricePattern.test(formatted)) {
            // 尝试修复常见的价格格式问题
            formatted = this.fixPriceFormat(formatted);
        }

        return formatted;
    }

    // 修复价格格式
    private static fixPriceFormat(price: string): string {
        // 移除非数字、连字符、"元"、"以上"、"以下"之外的字符
        let cleaned = price.replace(/[^\d\-元以上下]/g, '');

        // 如果没有"元"，添加"元"
        if (!cleaned.includes('元')) {
            cleaned += '元';
        }

        // 如果格式仍然不正确，返回默认格式
        const pricePattern = /^\d+(-\d+)?元(以上|以下)?$/;
        if (!pricePattern.test(cleaned)) {
            return '价格面议';
        }

        return cleaned;
    }

    // 检查是否包含emoji
    private static hasEmoji(text: string): boolean {
        const emojiPattern = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
        return emojiPattern.test(text);
    }

    // 验证处理后的响应
    static validateProcessedResponse(response: GiftResponse): boolean {
        try {
            // 验证推荐数量
            if (!response.recommendations || response.recommendations.length !== 3) {
                return false;
            }

            // 验证每个推荐
            for (const rec of response.recommendations) {
                if (!rec.giftName || !rec.reason || !rec.estimatedPrice) {
                    return false;
                }

                if (rec.giftName.length === 0 || rec.reason.length === 0 || rec.estimatedPrice.length === 0) {
                    return false;
                }
            }

            // 验证祝福语
            if (!response.blessing || response.blessing.length === 0) {
                return false;
            }

            return true;
        } catch (error) {
            console.error('响应验证失败:', error);
            return false;
        }
    }

    // 生成响应摘要（用于日志）
    static generateResponseSummary(response: GiftResponse): string {
        const giftNames = response.recommendations.map(rec => rec.giftName).join(', ');
        const blessingPreview = response.blessing.length > 50
            ? response.blessing.substring(0, 50) + '...'
            : response.blessing;

        return `推荐礼物: ${giftNames}; 祝福语: ${blessingPreview}`;
    }
}