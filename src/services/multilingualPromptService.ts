import { GiftRequest } from '@/types';

export type Language = 'zh' | 'en';

export class MultilingualPromptService {
    // 获取系统提示词（支持多语言）
    static getSystemPrompt(language: Language = 'zh'): string {
        const prompts = {
            zh: `你是礼物推荐专家。根据用户信息推荐3个生日礼物和1个祝福语。

要求：
- 个性化：结合年龄、性别、兴趣
- 符合预算范围
- 避免重复已送礼物
- 简洁实用的推荐理由
- 回答必须使用中文

必须返回JSON格式：
{
  "recommendations": [
    {"giftName": "礼物名", "reason": "推荐理由", "estimatedPrice": "价格范围"},
    {"giftName": "礼物名", "reason": "推荐理由", "estimatedPrice": "价格范围"},
    {"giftName": "礼物名", "reason": "推荐理由", "estimatedPrice": "价格范围"}
  ],
  "blessing": "生日祝福语"
}`,
            en: `You are a gift recommendation expert. Based on user information, recommend 3 birthday gifts and 1 blessing message.

Requirements:
- Personalized: Consider age, gender, interests
- Within budget range
- Avoid duplicate gifts already given
- Concise and practical recommendation reasons
- All responses must be in English

Must return JSON format:
{
  "recommendations": [
    {"giftName": "Gift Name", "reason": "Recommendation reason", "estimatedPrice": "Price range"},
    {"giftName": "Gift Name", "reason": "Recommendation reason", "estimatedPrice": "Price range"},
    {"giftName": "Gift Name", "reason": "Recommendation reason", "estimatedPrice": "Price range"}
  ],
  "blessing": "Birthday blessing message"
}`
        };

        return prompts[language];
    }

    // 构造用户提示词（支持多语言）
    static buildUserPrompt(request: GiftRequest, language: Language = 'zh'): string {
        const { gender, age, interests, budget, pastGifts = [], mbti, birthdayDate } = request;

        if (language === 'en') {
            return this.buildEnglishPrompt(request);
        } else {
            return this.buildChinesePrompt(request);
        }
    }

    // 构造中文提示词
    private static buildChinesePrompt(request: GiftRequest): string {
        const { gender, age, interests, budget, pastGifts = [], mbti, birthdayDate } = request;

        const genderText = gender === 'male' ? '男性' : gender === 'female' ? '女性' : '其他';
        const interestsList = interests.length > 0 ? interests.join('、') : '无特殊兴趣';
        const pastGiftsList = pastGifts.length > 0 ? pastGifts.join('、') : '无';
        const mbtiText = mbti ? ` (${mbti}性格)` : '';
        const birthdayText = birthdayDate ? this.getBirthdayAnalysis(birthdayDate, 'zh') : '';

        return `收礼人信息：
- 性别：${genderText}
- 年龄：${age}岁${mbtiText}
- 兴趣：${interestsList}
- 预算：${budget}
- 已送过：${pastGiftsList}
${birthdayText ? `- 生日：${birthdayText}` : ''}

请推荐3个生日礼物和祝福语，直接返回JSON格式。`;
    }

    // 构造英文提示词
    private static buildEnglishPrompt(request: GiftRequest): string {
        const { gender, age, interests, budget, pastGifts = [], mbti, birthdayDate } = request;

        const genderText = gender === 'male' ? 'Male' : gender === 'female' ? 'Female' : 'Other';
        const interestsList = interests.length > 0 ? interests.join(', ') : 'No specific interests';
        const pastGiftsList = pastGifts.length > 0 ? pastGifts.join(', ') : 'None';
        const mbtiText = mbti ? ` (${mbti} personality)` : '';
        const budgetText = this.convertBudgetToEnglish(budget);
        const birthdayText = birthdayDate ? this.getBirthdayAnalysis(birthdayDate, 'en') : '';

        return `Recipient Information:
- Gender: ${genderText}
- Age: ${age} years old${mbtiText}
- Interests: ${interestsList}
- Budget: ${budgetText}
- Previously given gifts: ${pastGiftsList}
${birthdayText ? `- Birthday: ${birthdayText}` : ''}

Please recommend 3 birthday gifts and a blessing message, return in JSON format directly.`;
    }

    // 将中文预算转换为英文
    private static convertBudgetToEnglish(budget: string): string {
        const budgetMap: Record<string, string> = {
            '0-50元': '$0-50',
            '50-100元': '$50-100',
            '100-200元': '$100-200',
            '200-500元': '$200-500',
            '500-1000元': '$500-1000',
            '1000元以上': '$1000+'
        };

        // 检查是否是自定义预算格式（如 "100-300元"）
        const customBudgetMatch = budget.match(/(\d+)-(\d+)元/);
        if (customBudgetMatch) {
            return `$${customBudgetMatch[1]}-${customBudgetMatch[2]}`;
        }

        return budgetMap[budget] || budget;
    }

    // 生日日期分析（支持多语言）
    private static getBirthdayAnalysis(birthdayDate: string, language: Language): string {
        if (!birthdayDate) return '';

        const [month, day] = birthdayDate.split('-').map(Number);
        const monthNum = month;

        if (language === 'en') {
            let season = '';
            let seasonalGifts = '';

            if (monthNum >= 3 && monthNum <= 5) {
                season = 'Spring';
                seasonalGifts = 'Spring-appropriate gifts: flowers, outdoor gear, light clothing, sports equipment';
            } else if (monthNum >= 6 && monthNum <= 8) {
                season = 'Summer';
                seasonalGifts = 'Summer-appropriate gifts: sunscreen, cool drinks, swimming gear, outdoor equipment';
            } else if (monthNum >= 9 && monthNum <= 11) {
                season = 'Autumn';
                seasonalGifts = 'Autumn-appropriate gifts: warm items, fall fashion, cozy accessories, indoor items';
            } else {
                season = 'Winter';
                seasonalGifts = 'Winter-appropriate gifts: warm items, hot drinks, indoor entertainment, cozy accessories';
            }

            return `${season} birthday (${this.getMonthName(month, 'en')} ${day}), ${seasonalGifts}`;
        } else {
            let season = '';
            let seasonalGifts = '';

            if (monthNum >= 3 && monthNum <= 5) {
                season = '春季';
                seasonalGifts = '适合春天的礼物：鲜花、春游用品、轻薄服饰、户外运动装备';
            } else if (monthNum >= 6 && monthNum <= 8) {
                season = '夏季';
                seasonalGifts = '适合夏天的礼物：防晒用品、清凉饮品、游泳用品、户外装备';
            } else if (monthNum >= 9 && monthNum <= 11) {
                season = '秋季';
                seasonalGifts = '适合秋天的礼物：保温用品、秋装、温暖饰品、室内用品';
            } else {
                season = '冬季';
                seasonalGifts = '适合冬天的礼物：保暖用品、热饮相关、室内娱乐、温暖配饰';
            }

            return `${season}生日（${month}月${day}日），${seasonalGifts}`;
        }
    }

    // 获取月份名称
    private static getMonthName(month: number, language: Language): string {
        const monthNames = {
            zh: ['', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            en: ['', 'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December']
        };

        return monthNames[language][month] || month.toString();
    }

    // 获取MBTI性格分析（支持多语言）
    static getMBTIAnalysis(mbti: string, language: Language): string {
        if (language === 'en') {
            const mbtiTraits: Record<string, string> = {
                'INTJ': 'Architect - Independent thinker, perfectionist, prefers deep and practical gifts',
                'INTP': 'Thinker - Curious and innovative, suitable for intellectual and creative gifts',
                'ENTJ': 'Commander - Natural leader, prefers efficient, practical, high-quality gifts',
                'ENTP': 'Debater - Creative and enthusiastic, likes novel, interesting, and creative gifts',
                'INFJ': 'Advocate - Idealistic and empathetic, prefers meaningful and heartwarming gifts',
                'INFP': 'Mediator - Value-driven and creative, likes personalized and artistic gifts',
                'ENFJ': 'Protagonist - Caring and inspiring, prefers gifts that can be shared or help others',
                'ENFP': 'Campaigner - Enthusiastic and creative, likes fun and inspiring gifts',
                'ISTJ': 'Logistician - Practical and fact-oriented, prefers useful, high-quality, classic gifts',
                'ISFJ': 'Defender - Warm and helpful, likes thoughtful, practical, memorable gifts',
                'ESTJ': 'Executive - Excellent manager, prefers practical, quality, efficiency-enhancing gifts',
                'ESFJ': 'Consul - Caring and cooperative, likes warm, practical, shareable gifts',
                'ISTP': 'Virtuoso - Practical explorer, likes tools, technical, hands-on gifts',
                'ISFP': 'Adventurer - Flexible and artistic, likes beautiful, personalized, artistic gifts',
                'ESTP': 'Entrepreneur - Energetic and action-oriented, suitable for sports, experience, practical gifts',
                'ESFP': 'Entertainer - Enthusiastic and helpful, suitable for fun, social, experience gifts'
            };

            return mbtiTraits[mbti] || `${mbti} personality type, please recommend gifts based on this personality`;
        } else {
            const mbtiTraits: Record<string, string> = {
                'INTJ': '建筑师型 - 独立思考，追求完美，喜欢有深度和实用价值的礼物',
                'INTP': '思想家型 - 好奇心强，喜欢探索，适合智力挑战和创新类礼物',
                'ENTJ': '指挥官型 - 天生领导者，喜欢高效实用、有品质感的礼物',
                'ENTP': '辩论家型 - 充满创意和热情，喜欢新奇有趣、富有创意的礼物',
                'INFJ': '提倡者型 - 理想主义，富有同情心，喜欢有意义、温暖贴心的礼物',
                'INFP': '调停者型 - 忠于价值观，有创造力，喜欢个性化、艺术性的礼物',
                'ENFJ': '主人公型 - 关心他人，善于激励，喜欢能分享或帮助他人的礼物',
                'ENFP': '竞选者型 - 热情洋溢，富有创造力，喜欢有趣、能激发灵感的礼物',
                'ISTJ': '物流师型 - 实用主义，事实导向，喜欢实用、高质量、经典的礼物',
                'ISFJ': '守护者型 - 温暖贴心，乐于助人，喜欢贴心、实用、有纪念意义的礼物',
                'ESTJ': '总经理型 - 优秀管理者，喜欢实用、有品质、能提升效率的礼物',
                'ESFJ': '执政官型 - 关心他人，善于合作，喜欢温馨、实用、能分享的礼物',
                'ISTP': '鉴赏家型 - 实用主义探索者，喜欢工具类、技术类、动手类礼物',
                'ISFP': '探险家型 - 灵活友善的艺术家，喜欢美观、个性化、艺术性的礼物',
                'ESTP': '企业家型 - 精力充沛，喜欢行动，适合运动、体验类、实用的礼物',
                'ESFP': '娱乐家型 - 热情友好，喜欢帮助他人，适合有趣、社交、体验类礼物'
            };

            return mbtiTraits[mbti] || `${mbti}性格类型，请根据该性格特征推荐合适的礼物`;
        }
    }
}