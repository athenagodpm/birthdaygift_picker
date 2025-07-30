import { GiftRequest, GiftResponse } from '@/types';
import { FastResponseProcessor } from './fastResponseProcessor';

export class FastAIService {
    // 快速AI调用 - 并发请求多个服务，取最快响应
    static async generateGiftRecommendations(request: GiftRequest): Promise<GiftResponse> {
        console.log('🚀 启动快速AI服务...');

        // 创建多个AI服务的Promise
        const promises: Promise<GiftResponse>[] = [];

        // 豆包服务（如果配置了）
        if (process.env.ARK_API_KEY && process.env.DOUBAO_MODEL_NAME) {
            promises.push(this.callDoubaoFast(request));
        }

        // OpenAI服务（如果配置了）
        if (process.env.OPENAI_API_KEY) {
            promises.push(this.callOpenAIFast(request));
        }

        // 如果没有配置任何AI服务，直接返回智能模拟响应
        if (promises.length === 0) {
            console.log('⚠️ 未配置AI服务，使用智能模拟响应');
            return this.generateIntelligentMockResponse(request);
        }

        try {
            // 使用Promise.race获取最快的响应，设置总超时为20秒
            const racePromise = Promise.race(promises);
            const timeoutPromise = new Promise<never>((_, reject) => {
                setTimeout(() => reject(new Error('所有AI服务超时')), 20000);
            });

            const result = await Promise.race([racePromise, timeoutPromise]);
            console.log('✅ 快速AI服务成功');
            return result;

        } catch (error) {
            console.warn('⚠️ AI服务失败，使用智能模拟响应:', error);
            return this.generateIntelligentMockResponse(request);
        }
    }

    // 快速豆包调用
    private static async callDoubaoFast(request: GiftRequest): Promise<GiftResponse> {
        const prompt = this.buildFastPrompt(request);

        console.log('🔥 快速豆包API调用开始...');

        const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.ARK_API_KEY}`
            },
            body: JSON.stringify({
                model: process.env.DOUBAO_MODEL_NAME,
                messages: [
                    { role: "system", content: "你是礼物推荐专家，直接返回JSON格式的推荐结果。" },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 800, // 增加token数量确保JSON完整
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('快速豆包API错误:', response.status, errorText);
            throw new Error(`豆包API失败: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;

        if (!content) {
            throw new Error('豆包API返回空内容');
        }

        console.log('✅ 快速豆包API成功');

        // 使用快速响应处理器，带JSON修复功能
        try {
            // 尝试修复可能被截断的JSON
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

            console.log('✅ 快速豆包处理完成:', FastResponseProcessor.generateSummary(processedResult));
            return processedResult;
        } catch (parseError) {
            console.error('快速豆包处理失败:', parseError);
            console.error('原始内容:', content);
            throw new Error('AI响应处理失败');
        }
    }

    // 快速OpenAI调用
    private static async callOpenAIFast(request: GiftRequest): Promise<GiftResponse> {
        const prompt = this.buildFastPrompt(request);

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "你是礼物推荐专家，直接返回JSON格式的推荐结果。" },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 400,
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API失败: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;

        if (!content) {
            throw new Error('OpenAI API返回空内容');
        }

        // 使用快速响应处理器
        try {
            const rawResult = JSON.parse(content);
            const processedResult = FastResponseProcessor.processGiftResponse(rawResult);

            if (!FastResponseProcessor.validateResponse(processedResult)) {
                throw new Error('响应验证失败');
            }

            console.log('✅ 快速OpenAI处理完成:', FastResponseProcessor.generateSummary(processedResult));
            return processedResult;
        } catch (parseError) {
            console.error('快速OpenAI处理失败:', parseError, content);
            throw new Error('AI响应处理失败');
        }
    }

    // 构建增强快速prompt
    private static buildFastPrompt(request: GiftRequest): string {
        const { gender, age, interests, budget, pastGifts = [], birthdayDate, mbti } = request;

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
            'INTP': '好奇探索，适合创新智能的礼物',
            'ENTJ': '高效领导，喜欢品质实用的礼物',
            'ENTP': '创意热情，适合新奇有趣的礼物',
            'INFJ': '理想温暖，喜欢有意义的礼物',
            'INFP': '个性创意，适合艺术化的礼物',
            'ENFJ': '关爱他人，喜欢能分享的礼物',
            'ENFP': '热情灵感，适合激发创意的礼物',
            'ISTJ': '实用稳重，喜欢经典实用的礼物',
            'ISFJ': '贴心温暖，适合实用贴心的礼物',
            'ESTJ': '高效管理，喜欢提升效率的礼物',
            'ESFJ': '温馨合作，适合温馨实用的礼物',
            'ISTP': '实用探索，喜欢工具技术类礼物',
            'ISFP': '艺术灵活，适合美观个性的礼物',
            'ESTP': '活力行动，喜欢运动体验类礼物',
            'ESFP': '热情社交，适合有趣体验的礼物'
        };

        const mbtiInfo = mbti && mbtiTraits[mbti] ? `性格：${mbti}(${mbtiTraits[mbti]})` : '';

        return `为${age}岁${gender === 'male' ? '男性' : '女性'}推荐3个生日礼物：
兴趣：${interests.slice(0, 2).join('、') || '无'}
预算：${budget}
避免：${pastGifts.slice(0, 2).join('、') || '无'}
${seasonInfo ? `时节：${seasonInfo}` : ''}
${mbtiInfo}

要求：结合季节和性格特征，推荐理由简洁（25字内），祝福语简短（35字内）

返回JSON：
{
  "recommendations": [
    {"giftName": "礼物名", "reason": "简短理由", "estimatedPrice": "${budget}"},
    {"giftName": "礼物名", "reason": "简短理由", "estimatedPrice": "${budget}"},
    {"giftName": "礼物名", "reason": "简短理由", "estimatedPrice": "${budget}"}
  ],
  "blessing": "简短祝福"
}`;
    }

    // 智能模拟响应（作为fallback）
    private static generateIntelligentMockResponse(request: GiftRequest): GiftResponse {
        const { gender, age, interests, budget, birthdayDate, mbti } = request;
        const genderText = gender === 'male' ? '男性' : gender === 'female' ? '女性' : '朋友';

        // 季节信息
        let seasonPrefix = '';
        if (birthdayDate) {
            const [month] = birthdayDate.split('-').map(Number);
            if (month >= 3 && month <= 5) seasonPrefix = '春日';
            else if (month >= 6 && month <= 8) seasonPrefix = '夏日';
            else if (month >= 9 && month <= 11) seasonPrefix = '秋日';
            else seasonPrefix = '冬日';
        }

        // 基于兴趣的智能推荐
        const interestGifts: Record<string, string[]> = {
            '阅读': ['精装版经典文学', '电子书阅读器', '创意书签套装'],
            '音乐': ['蓝牙音响', '专业耳机', '音乐会门票'],
            '运动': ['运动装备', '健身手环', '运动水杯'],
            '旅行': ['旅行背包', '便携充电宝', '旅行收纳套装'],
            '摄影': ['相机配件', '摄影灯具', '照片打印机'],
            '烹饪': ['厨具套装', '料理书籍', '调料礼盒'],
            '游戏': ['游戏手柄', '游戏周边', '电竞椅'],
            '美妆': ['化妆品套装', '美容仪器', '香水礼盒']
        };

        const recommendations = [];
        const usedGifts = new Set<string>();

        // 基于兴趣推荐
        for (const interest of interests.slice(0, 2)) {
            const gifts = interestGifts[interest];
            if (gifts) {
                const gift = gifts[Math.floor(Math.random() * gifts.length)];
                if (!usedGifts.has(gift)) {
                    recommendations.push({
                        giftName: gift,
                        reason: `结合您提到的"${interest}"兴趣，这个礼物非常适合${age}岁的${genderText}`,
                        estimatedPrice: budget
                    });
                    usedGifts.add(gift);
                }
            }
        }

        // 补充通用推荐
        const universalGifts = [
            '定制化照片相册',
            '个性化马克杯',
            '香薰蜡烛套装',
            '植物盆栽',
            '手工巧克力',
            '丝巾围巾',
            '保温杯',
            '小夜灯'
        ];

        while (recommendations.length < 3) {
            const gift = universalGifts[Math.floor(Math.random() * universalGifts.length)];
            if (!usedGifts.has(gift)) {
                recommendations.push({
                    giftName: gift,
                    reason: `这是一个实用且有纪念意义的礼物，适合${age}岁的${genderText}`,
                    estimatedPrice: budget
                });
                usedGifts.add(gift);
            }
        }

        // 个性化祝福语
        const baseBlessings = [
            `🎂 祝${age}岁的${seasonPrefix}生日快乐！愿每一天都充满惊喜和快乐！`,
            `🎉 ${seasonPrefix}生日快乐！愿新的一岁带来更多美好和成长！`,
            `✨ 祝${seasonPrefix}生日快乐！愿所有的美好都如期而至！`,
            `🎈 ${age}岁${seasonPrefix}生日快乐！愿未来的每一天都比今天更精彩！`
        ];

        // 根据MBTI添加个性化元素
        let personalizedBlessing = baseBlessings[Math.floor(Math.random() * baseBlessings.length)];
        if (mbti) {
            const mbtiWishes: Record<string, string> = {
                'INTJ': '愿你的每个计划都能完美实现！',
                'INTP': '愿你的好奇心永远得到满足！',
                'ENTJ': '愿你的领导力带来更多成就！',
                'ENTP': '愿你的创意永远闪闪发光！',
                'INFJ': '愿你的理想都能照进现实！',
                'INFP': '愿你的内心世界永远丰富多彩！',
                'ENFJ': '愿你的温暖感染更多的人！',
                'ENFP': '愿你的热情点亮每一天！',
                'ISTJ': '愿你的努力都有美好回报！',
                'ISFJ': '愿你的善良得到世界的温柔以待！',
                'ESTJ': '愿你的目标都能顺利达成！',
                'ESFJ': '愿你的关爱得到同样的回馈！',
                'ISTP': '愿你的每次探索都有新发现！',
                'ISFP': '愿你的艺术天赋绽放光彩！',
                'ESTP': '愿你的每次冒险都精彩纷呈！',
                'ESFP': '愿你的快乐感染身边每个人！'
            };
            if (mbtiWishes[mbti]) {
                personalizedBlessing += ` ${mbtiWishes[mbti]}`;
            }
        }

        const blessings = [personalizedBlessing];

        return {
            recommendations: recommendations.slice(0, 3),
            blessing: blessings[Math.floor(Math.random() * blessings.length)]
        };
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