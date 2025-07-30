import { GiftRequest, GiftResponse } from '@/types';
import { FastResponseProcessor } from './fastResponseProcessor';

export class FastDoubaoService {
    private static readonly BASE_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';

    static async generateGiftRecommendations(request: GiftRequest): Promise<GiftResponse> {
        try {
            // 检查配置
            if (!process.env.ARK_API_KEY || !process.env.DOUBAO_MODEL_NAME) {
                throw new Error('豆包服务未配置');
            }

            console.log('🔥 快速豆包服务启动...');
            const startTime = Date.now();

            // 构建增强prompt
            const { gender, age, interests, budget, birthdayDate, mbti } = request;

            // 生日季节分析
            let seasonInfo = '';
            if (birthdayDate) {
                const [month] = birthdayDate.split('-').map(Number);
                if (month >= 3 && month <= 5) seasonInfo = '春季生日，适合清新温暖的礼物';
                else if (month >= 6 && month <= 8) seasonInfo = '夏季生日，适合清爽实用的礼物';
                else if (month >= 9 && month <= 11) seasonInfo = '秋季生日，适合温馨舒适的礼物';
                else seasonInfo = '冬季生日，适合保暖温暖的礼物';
            }

            // MBTI性格特征
            const mbtiTraits: Record<string, string> = {
                'INTJ': '理性独立，喜欢有深度的礼物',
                'INTP': '好奇探索，喜欢创新有趣的礼物',
                'ENTJ': '高效领导，喜欢实用高品质的礼物',
                'ENTP': '创意热情，喜欢新奇有挑战的礼物',
                'INFJ': '理想温暖，喜欢有意义的礼物',
                'INFP': '个性创意，喜欢独特艺术的礼物',
                'ENFJ': '关爱他人，喜欢能分享的礼物',
                'ENFP': '热情灵感，喜欢有趣体验的礼物',
                'ISTJ': '实用稳重，喜欢经典实用的礼物',
                'ISFJ': '贴心温暖，喜欢实用温馨的礼物',
                'ESTJ': '高效管理，喜欢提升效率的礼物',
                'ESFJ': '和谐合作，喜欢温馨实用的礼物',
                'ISTP': '实用探索，喜欢工具技术的礼物',
                'ISFP': '艺术灵活，喜欢美观个性的礼物',
                'ESTP': '行动活力，喜欢运动体验的礼物',
                'ESFP': '热情社交，喜欢有趣互动的礼物'
            };

            const mbtiInfo = mbti && mbtiTraits[mbti] ? `性格：${mbti}(${mbtiTraits[mbti]})` : '';

            const prompt = `为${age}岁${gender === 'male' ? '男性' : '女性'}推荐3个生日礼物：
兴趣：${interests.slice(0, 2).join('、') || '无'}
预算：${budget}
${seasonInfo ? `时节：${seasonInfo}` : ''}
${mbtiInfo}

要求：结合季节和性格特征，给出推荐理由（60字内），和用心的祝福语（60字内）

返回JSON：
{
  "recommendations": [
    {"giftName": "礼物名", "reason": "理由", "estimatedPrice": "${budget}"},
    {"giftName": "礼物名", "reason": "理由", "estimatedPrice": "${budget}"},
    {"giftName": "礼物名", "reason": "理由", "estimatedPrice": "${budget}"}
  ],
  "blessing": "简短祝福"
}`;

            // 调用豆包API
            const response = await fetch(this.BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.ARK_API_KEY}`
                },
                body: JSON.stringify({
                    model: process.env.DOUBAO_MODEL_NAME,
                    messages: [
                        { role: "system", content: "你是生日礼物推荐专家，很会根据不同的用户推荐最适合他们的礼物，直接返回JSON格式结果。" },
                        { role: "user", content: prompt }
                    ],
                    temperature: 0.7,
                    max_tokens: 800,
                    response_format: { type: "json_object" }
                })
            });

            const apiTime = Date.now() - startTime;
            console.log(`⏱️ 豆包API调用耗时: ${apiTime}ms`);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('豆包API错误:', response.status, errorText);
                throw new Error(`豆包API失败: ${response.status}`);
            }

            const data = await response.json();
            const content = data.choices?.[0]?.message?.content;

            if (!content) {
                throw new Error('豆包API返回空内容');
            }

            console.log('✅ 豆包API响应成功');

            // 快速处理响应，带JSON修复功能
            let fixedContent = content;
            if (!content.trim().endsWith('}')) {
                console.log('⚠️ 检测到JSON可能被截断，尝试修复...');
                fixedContent = this.fixTruncatedJSON(content);
            }

            const rawResult = JSON.parse(fixedContent);
            const processedResult = FastResponseProcessor.processGiftResponse(rawResult);

            if (!FastResponseProcessor.validateResponse(processedResult)) {
                throw new Error('响应验证失败');
            }

            const totalTime = Date.now() - startTime;
            console.log(`🎉 快速豆包服务完成! 总耗时: ${totalTime}ms`);
            console.log('📝 响应摘要:', FastResponseProcessor.generateSummary(processedResult));

            return processedResult;

        } catch (error) {
            console.error('快速豆包服务失败:', error);
            throw error;
        }
    }

    // 测试连接
    static async testConnection(): Promise<boolean> {
        try {
            if (!process.env.ARK_API_KEY || !process.env.DOUBAO_MODEL_NAME) {
                return false;
            }

            const response = await fetch(this.BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.ARK_API_KEY}`
                },
                body: JSON.stringify({
                    model: process.env.DOUBAO_MODEL_NAME,
                    messages: [{ role: "user", content: "Hello" }],
                    max_tokens: 5
                })
            });

            return response.ok;
        } catch (error) {
            return false;
        }
    }

    // 修复被截断的JSON
    private static fixTruncatedJSON(content: string): string {
        console.log('🔧 尝试修复被截断的JSON...');

        let fixed = content.trim();

        // 如果JSON在字符串中间被截断，尝试闭合字符串
        const lastQuoteIndex = fixed.lastIndexOf('"');
        const lastBraceIndex = fixed.lastIndexOf('}');
        const lastBracketIndex = fixed.lastIndexOf(']');

        // 如果最后一个引号在最后一个大括号之后，说明字符串被截断了
        if (lastQuoteIndex > Math.max(lastBraceIndex, lastBracketIndex)) {
            // 找到被截断的字符串的开始位置
            const beforeLastQuote = fixed.substring(0, lastQuoteIndex);
            const secondLastQuoteIndex = beforeLastQuote.lastIndexOf('"');

            if (secondLastQuoteIndex !== -1) {
                // 截断到完整的字符串
                fixed = fixed.substring(0, secondLastQuoteIndex + 1);
                console.log('🔧 截断了不完整的字符串');
            }
        }

        // 确保JSON结构完整
        const openBraces = (fixed.match(/{/g) || []).length;
        const closeBraces = (fixed.match(/}/g) || []).length;
        const openBrackets = (fixed.match(/\[/g) || []).length;
        const closeBrackets = (fixed.match(/\]/g) || []).length;

        // 添加缺失的闭合括号
        for (let i = 0; i < openBrackets - closeBrackets; i++) {
            fixed += ']';
        }

        // 添加缺失的闭合大括号
        for (let i = 0; i < openBraces - closeBraces; i++) {
            fixed += '}';
        }

        console.log('🔧 JSON修复完成');
        return fixed;
    }
}