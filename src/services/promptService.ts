import { GiftRequest } from '@/types';

export class PromptService {
    // 构造系统提示词（优化版 - 更简洁快速）
    static getSystemPrompt(): string {
        return `你是礼物推荐专家。根据用户信息推荐3个生日礼物和1个祝福语。

要求：
- 个性化：结合年龄、性别、兴趣
- 符合预算范围
- 避免重复已送礼物
- 简洁实用的推荐理由

必须返回JSON格式：
{
  "recommendations": [
    {"giftName": "礼物名", "reason": "推荐理由", "estimatedPrice": "价格范围"},
    {"giftName": "礼物名", "reason": "推荐理由", "estimatedPrice": "价格范围"},
    {"giftName": "礼物名", "reason": "推荐理由", "estimatedPrice": "价格范围"}
  ],
  "blessing": "生日祝福语"
}`;
    }

    // 构造用户提示词（优化版 - 更简洁快速）
    static buildUserPrompt(request: GiftRequest): string {
        const { gender, age, interests, budget, pastGifts = [], mbti } = request;

        const genderText = gender === 'male' ? '男性' : gender === 'female' ? '女性' : '其他';
        const interestsList = interests.length > 0 ? interests.join('、') : '无特殊兴趣';
        const pastGiftsList = pastGifts.length > 0 ? pastGifts.join('、') : '无';
        const mbtiText = mbti ? ` (${mbti}性格)` : '';

        return `收礼人信息：
- 性别：${genderText}
- 年龄：${age}岁${mbtiText}
- 兴趣：${interestsList}
- 预算：${budget}
- 已送过：${pastGiftsList}

请推荐3个生日礼物和祝福语，直接返回JSON格式。`;
    }

    // 性别描述
    private static getGenderDescription(gender: string): string {
        switch (gender) {
            case 'male':
                return '男性';
            case 'female':
                return '女性';
            case 'other':
                return '其他性别';
            default:
                return '未指定';
        }
    }

    // 年龄段描述
    private static getAgeDescription(age: number): string {
        if (age <= 12) {
            return '儿童期，注重安全性和教育意义';
        } else if (age <= 17) {
            return '青少年期，关注时尚和个性表达';
        } else if (age <= 25) {
            return '青年期，追求新潮和实用性';
        } else if (age <= 35) {
            return '青年成熟期，注重品质和意义';
        } else if (age <= 50) {
            return '中年期，重视实用性和健康';
        } else if (age <= 65) {
            return '中老年期，偏好传统和养生';
        } else {
            return '老年期，注重舒适和健康';
        }
    }

    // 兴趣爱好描述
    private static getInterestsDescription(interests: string[]): string {
        if (interests.length === 0) {
            return '未提供具体兴趣爱好';
        }

        const interestCategories = this.categorizeInterests(interests);
        const descriptions = [];

        if (interestCategories.sports.length > 0) {
            descriptions.push(`运动健身类：${interestCategories.sports.join('、')}`);
        }
        if (interestCategories.arts.length > 0) {
            descriptions.push(`艺术文化类：${interestCategories.arts.join('、')}`);
        }
        if (interestCategories.tech.length > 0) {
            descriptions.push(`科技数码类：${interestCategories.tech.join('、')}`);
        }
        if (interestCategories.lifestyle.length > 0) {
            descriptions.push(`生活方式类：${interestCategories.lifestyle.join('、')}`);
        }
        if (interestCategories.others.length > 0) {
            descriptions.push(`其他兴趣：${interestCategories.others.join('、')}`);
        }

        return descriptions.join('；');
    }

    // 兴趣分类
    private static categorizeInterests(interests: string[]) {
        const categories = {
            sports: [] as string[],
            arts: [] as string[],
            tech: [] as string[],
            lifestyle: [] as string[],
            others: [] as string[]
        };

        const sportKeywords = ['运动', '健身', '跑步', '游泳', '篮球', '足球', '瑜伽', '舞蹈', '登山', '骑行'];
        const artKeywords = ['阅读', '音乐', '绘画', '摄影', '书法', '电影', '戏剧', '收藏'];
        const techKeywords = ['游戏', '科技', '编程', '数码', '电子'];
        const lifestyleKeywords = ['烹饪', '旅行', '园艺', '手工', '时尚', '美妆', '咖啡', '茶艺', '宠物'];

        interests.forEach(interest => {
            if (sportKeywords.some(keyword => interest.includes(keyword))) {
                categories.sports.push(interest);
            } else if (artKeywords.some(keyword => interest.includes(keyword))) {
                categories.arts.push(interest);
            } else if (techKeywords.some(keyword => interest.includes(keyword))) {
                categories.tech.push(interest);
            } else if (lifestyleKeywords.some(keyword => interest.includes(keyword))) {
                categories.lifestyle.push(interest);
            } else {
                categories.others.push(interest);
            }
        });

        return categories;
    }

    // 预算分析
    private static getBudgetAnalysis(budget: string): string {
        const budgetMap: Record<string, string> = {
            '0-50元': '经济实惠型，注重性价比',
            '50-100元': '小额礼品，实用为主',
            '100-200元': '中等价位，品质与实用并重',
            '200-500元': '中高端礼品，注重品质和意义',
            '500-1000元': '高端礼品，追求品质和独特性',
            '1000元以上': '奢华礼品，注重品牌和纪念价值'
        };

        return budgetMap[budget] || '自定义预算范围';
    }

    // 已送礼物分析
    private static getPastGiftsAnalysis(pastGifts: string[]): string {
        if (pastGifts.length === 0) {
            return '无特殊限制，可以推荐各类礼物';
        }

        const categories = this.categorizePastGifts(pastGifts);
        const avoidList = [];

        if (categories.accessories.length > 0) {
            avoidList.push('配饰类');
        }
        if (categories.electronics.length > 0) {
            avoidList.push('电子产品类');
        }
        if (categories.clothing.length > 0) {
            avoidList.push('服装类');
        }
        if (categories.books.length > 0) {
            avoidList.push('书籍类');
        }
        if (categories.cosmetics.length > 0) {
            avoidList.push('美妆护肤类');
        }

        return `已送过：${pastGifts.join('、')}。请避免推荐${avoidList.join('、')}的礼物`;
    }

    // 已送礼物分类
    private static categorizePastGifts(pastGifts: string[]) {
        const categories = {
            accessories: [] as string[],
            electronics: [] as string[],
            clothing: [] as string[],
            books: [] as string[],
            cosmetics: [] as string[],
            others: [] as string[]
        };

        const accessoryKeywords = ['手表', '项链', '耳环', '戒指', '包包', '钱包'];
        const electronicKeywords = ['手机', '电脑', '耳机', '音响', '相机', '电子'];
        const clothingKeywords = ['衣服', '鞋子', '帽子', '围巾', '手套'];
        const bookKeywords = ['书', '书籍', '小说', '杂志'];
        const cosmeticKeywords = ['化妆品', '护肤品', '香水', '口红', '面膜'];

        pastGifts.forEach(gift => {
            if (accessoryKeywords.some(keyword => gift.includes(keyword))) {
                categories.accessories.push(gift);
            } else if (electronicKeywords.some(keyword => gift.includes(keyword))) {
                categories.electronics.push(gift);
            } else if (clothingKeywords.some(keyword => gift.includes(keyword))) {
                categories.clothing.push(gift);
            } else if (bookKeywords.some(keyword => gift.includes(keyword))) {
                categories.books.push(gift);
            } else if (cosmeticKeywords.some(keyword => gift.includes(keyword))) {
                categories.cosmetics.push(gift);
            } else {
                categories.others.push(gift);
            }
        });

        return categories;
    }

    // 生日日期分析
    private static getBirthdayAnalysis(birthdayDate?: string): string {
        if (!birthdayDate) return '';

        const [month, day] = birthdayDate.split('-').map(Number);
        const monthNum = month;

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

    // MBTI性格分析
    private static getMBTIAnalysis(mbti?: string): string {
        if (!mbti) return '';

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