import { NextRequest, NextResponse } from 'next/server';
import { GiftRequest, GiftResponse, ApiError } from '@/types';
import { MultilingualPromptService, Language } from '@/services/multilingualPromptService';

export async function POST(request: NextRequest) {
    try {
        console.log('🚀 Quick API called at:', new Date().toISOString());

        // 解析请求数据
        let body: GiftRequest & { language?: Language };
        try {
            body = await request.json();
            console.log('✅ Request body parsed successfully');
        } catch (parseError) {
            console.error('❌ JSON parse error:', parseError);
            return NextResponse.json(
                { error: 'JSON解析失败', details: '请求体格式不正确' } as ApiError,
                { status: 400 }
            );
        }

        // 获取语言参数，默认为中文
        const language: Language = body.language || 'zh';

        // 基础验证
        if (!body.gender || !body.age || !body.interests || !body.budget) {
            return NextResponse.json(
                { error: '请求数据不完整', details: '缺少必要的字段' } as ApiError,
                { status: 400 }
            );
        }

        console.log('✅ Basic validation passed');

        // 直接生成智能模拟响应
        const response = generateIntelligentMockResponse(body, language);
        console.log('✅ Intelligent mock response generated');

        return NextResponse.json(response);

    } catch (error) {
        console.error('❌ API Error:', error);
        return NextResponse.json(
            { error: '服务器内部错误', details: '处理请求时发生错误' } as ApiError,
            { status: 500 }
        );
    }
}

// 智能模拟响应生成
function generateIntelligentMockResponse(request: GiftRequest, language: Language = 'zh'): GiftResponse {
    const { gender, age, interests, budget, mbti, pastGifts = [] } = request;

    console.log('🎁 Generating intelligent mock response for:', {
        gender,
        age,
        interestsCount: interests.length,
        budget,
        mbti,
        pastGiftsCount: pastGifts.length,
        language
    });

    if (language === 'en') {
        return generateEnglishMockResponse(request);
    } else {
        return generateChineseMockResponse(request);
    }
}

// 生成中文模拟响应
function generateChineseMockResponse(request: GiftRequest): GiftResponse {
    const { gender, age, interests, budget, mbti, pastGifts = [] } = request;

    const genderText = gender === 'male' ? '男性' : gender === 'female' ? '女性' : '朋友';
    const ageGroup = age < 18 ? '青少年' : age < 30 ? '年轻人' : age < 50 ? '中年人' : '长者';

    // 根据兴趣爱好生成个性化推荐
    const recommendations: Array<{ giftName: string, reason: string, estimatedPrice: string }> = [];

    // 第一个推荐：基于主要兴趣
    const mainInterest = interests[0] || '生活';
    const interestGifts: Record<string, string> = {
        '阅读': '精装版经典文学套装',
        '音乐': '高品质蓝牙耳机',
        '运动': '专业运动装备套装',
        '旅行': '多功能旅行背包',
        '摄影': '便携式三脚架套装',
        '绘画': '专业绘画工具套装',
        '烹饪': '高端厨具套装',
        '游戏': '游戏周边收藏品',
        '健身': '智能健身手环',
        '瑜伽': '高端瑜伽垫套装',
        '舞蹈': '专业舞蹈服装',
        '书法': '名家书法套装',
        '园艺': '精美园艺工具套装',
        '手工': '高级手工材料包',
        '收藏': '限量版收藏品',
        '宠物': '宠物智能用品',
        '科技': '最新科技产品',
        '时尚': '设计师品牌配饰',
        '美妆': '高端化妆品套装',
        '咖啡': '专业咖啡器具套装',
        '茶艺': '精品茶具套装',
        '钓鱼': '专业钓鱼装备',
        '登山': '户外登山装备'
    };

    recommendations.push({
        giftName: interestGifts[mainInterest] || `${mainInterest}主题定制礼品`,
        reason: `根据您提到的"${mainInterest}"兴趣，这个礼物完美契合${ageGroup}${genderText}的爱好，既实用又能体现您的用心。`,
        estimatedPrice: budget
    });

    // 第二个推荐：基于MBTI性格
    if (mbti) {
        const mbtiGifts: Record<string, { name: string, reason: string }> = {
            'INTJ': { name: '智能规划日记本', reason: '适合喜欢规划和思考的建筑师性格' },
            'INTP': { name: '科学实验套装', reason: '满足思想家的好奇心和探索欲' },
            'ENTJ': { name: '高端商务配件', reason: '符合指挥官的领导气质' },
            'ENTP': { name: '创意DIY套装', reason: '激发辩论家的创新思维' },
            'INFJ': { name: '艺术创作工具', reason: '适合提倡者的理想主义和创造力' },
            'INFP': { name: '个性化定制相册', reason: '符合调停者重视个人价值的特质' },
            'ENFJ': { name: '团队活动游戏', reason: '适合主人公喜欢激励他人的特质' },
            'ENFP': { name: '多功能创意工具', reason: '满足竞选者的热情和创造力' },
            'ISTJ': { name: '高品质实用工具', reason: '符合物流师实用主义的特点' },
            'ISFJ': { name: '温馨家居用品', reason: '适合守护者温暖贴心的性格' },
            'ESTJ': { name: '专业管理工具', reason: '符合总经理的组织管理能力' },
            'ESFJ': { name: '社交聚会用品', reason: '适合执政官善于合作的特质' },
            'ISTP': { name: '精密手工工具', reason: '满足鉴赏家的实用探索需求' },
            'ISFP': { name: '艺术创作材料', reason: '适合探险家的创造力和灵活性' },
            'ESTP': { name: '户外运动装备', reason: '符合企业家精力充沛的特质' },
            'ESFP': { name: '社交娱乐用品', reason: '适合娱乐家热情友好的性格' }
        };

        const mbtiGift = mbtiGifts[mbti];
        if (mbtiGift) {
            recommendations.push({
                giftName: mbtiGift.name,
                reason: `基于${mbti}性格类型，${mbtiGift.reason}，这个礼物能够很好地契合TA的个性特点。`,
                estimatedPrice: budget
            });
        }
    }

    // 第三个推荐：避开已送礼物，推荐新颖的
    const avoidedGifts = pastGifts.length > 0 ? `避开了之前送过的${pastGifts.slice(0, 2).join('、')}等礼物，` : '';
    recommendations.push({
        giftName: '定制化体验礼券',
        reason: `${avoidedGifts}这是一个独特的体验型礼物，让TA可以根据自己的喜好选择想要的体验，既新颖又贴心。`,
        estimatedPrice: budget
    });

    // 生成个性化祝福语
    const blessings = [
        `🎂 祝愿这位${age}岁的${genderText}生日快乐！愿每一天都像生日一样充满惊喜和快乐！`,
        `✨ 在这个特别的日子里，愿所有的美好都围绕着TA，生日快乐！`,
        `🎉 ${age}岁的新篇章开始了，愿未来的每一天都比今天更精彩！`,
        `💝 最好的礼物是心意，最美的祝福是真诚，生日快乐！`
    ];

    const blessing = blessings[Math.floor(Math.random() * blessings.length)];

    return {
        recommendations: recommendations.slice(0, 3), // 确保只返回3个推荐
        blessing
    };
}

// 生成英文模拟响应
function generateEnglishMockResponse(request: GiftRequest): GiftResponse {
    const { gender, age, interests, budget, mbti, pastGifts = [] } = request;

    const genderText = gender === 'male' ? 'male' : gender === 'female' ? 'female' : 'friend';
    const ageGroup = age < 18 ? 'teenager' : age < 30 ? 'young adult' : age < 50 ? 'middle-aged person' : 'senior';

    // 根据兴趣爱好生成个性化推荐
    const recommendations: Array<{ giftName: string, reason: string, estimatedPrice: string }> = [];

    // 第一个推荐：基于主要兴趣
    const mainInterest = interests[0] || 'lifestyle';
    const interestGifts: Record<string, string> = {
        'Reading': 'Premium Classic Literature Set',
        'Music': 'High-Quality Bluetooth Headphones',
        'Sports': 'Professional Sports Equipment Set',
        'Travel': 'Multi-functional Travel Backpack',
        'Photography': 'Portable Tripod Set',
        'Painting': 'Professional Art Supply Set',
        'Cooking': 'Premium Kitchen Utensil Set',
        'Gaming': 'Gaming Collectibles',
        'Fitness': 'Smart Fitness Tracker',
        'Yoga': 'Premium Yoga Mat Set',
        'Dancing': 'Professional Dance Wear',
        'Calligraphy': 'Master Calligraphy Set',
        'Gardening': 'Elegant Garden Tool Set',
        'Handicrafts': 'Premium Craft Material Kit',
        'Collecting': 'Limited Edition Collectible',
        'Pets': 'Smart Pet Accessories',
        'Technology': 'Latest Tech Gadget',
        'Fashion': 'Designer Brand Accessories',
        'Beauty': 'Premium Cosmetics Set',
        'Coffee': 'Professional Coffee Equipment Set',
        'Tea': 'Premium Tea Set',
        'Fishing': 'Professional Fishing Gear',
        'Hiking': 'Outdoor Hiking Equipment'
    };

    // 转换预算格式
    const budgetText = budget.replace('元', '').replace('-', '-$').replace(/^/, '$');

    recommendations.push({
        giftName: interestGifts[mainInterest] || `${mainInterest} Themed Custom Gift`,
        reason: `Based on your mention of "${mainInterest}" interest, this gift perfectly matches the hobbies of this ${ageGroup} ${genderText}, being both practical and thoughtful.`,
        estimatedPrice: budgetText
    });

    // 第二个推荐：基于MBTI性格
    if (mbti) {
        const mbtiGifts: Record<string, { name: string, reason: string }> = {
            'INTJ': { name: 'Smart Planning Journal', reason: 'Perfect for the strategic architect personality' },
            'INTP': { name: 'Science Experiment Kit', reason: 'Satisfies the thinker\'s curiosity and exploration' },
            'ENTJ': { name: 'Premium Business Accessories', reason: 'Matches the commander\'s leadership style' },
            'ENTP': { name: 'Creative DIY Kit', reason: 'Stimulates the debater\'s innovative thinking' },
            'INFJ': { name: 'Art Creation Tools', reason: 'Suits the advocate\'s idealism and creativity' },
            'INFP': { name: 'Personalized Custom Photo Album', reason: 'Reflects the mediator\'s personal values' },
            'ENFJ': { name: 'Team Activity Games', reason: 'Perfect for the protagonist\'s inspiring nature' },
            'ENFP': { name: 'Multi-functional Creative Tools', reason: 'Satisfies the campaigner\'s enthusiasm and creativity' },
            'ISTJ': { name: 'High-Quality Practical Tools', reason: 'Matches the logistician\'s practical nature' },
            'ISFJ': { name: 'Cozy Home Accessories', reason: 'Suits the defender\'s warm and caring personality' },
            'ESTJ': { name: 'Professional Management Tools', reason: 'Reflects the executive\'s organizational skills' },
            'ESFJ': { name: 'Social Gathering Supplies', reason: 'Perfect for the consul\'s cooperative nature' },
            'ISTP': { name: 'Precision Hand Tools', reason: 'Satisfies the virtuoso\'s practical exploration needs' },
            'ISFP': { name: 'Art Creation Materials', reason: 'Suits the adventurer\'s creativity and flexibility' },
            'ESTP': { name: 'Outdoor Sports Equipment', reason: 'Matches the entrepreneur\'s energetic nature' },
            'ESFP': { name: 'Social Entertainment Items', reason: 'Perfect for the entertainer\'s friendly personality' }
        };

        const mbtiGift = mbtiGifts[mbti];
        if (mbtiGift) {
            recommendations.push({
                giftName: mbtiGift.name,
                reason: `Based on the ${mbti} personality type, ${mbtiGift.reason}, this gift aligns well with their personality traits.`,
                estimatedPrice: budgetText
            });
        }
    }

    // 第三个推荐：避开已送礼物，推荐新颖的
    const avoidedGifts = pastGifts.length > 0 ? `Avoiding previously given gifts like ${pastGifts.slice(0, 2).join(', ')}, ` : '';
    recommendations.push({
        giftName: 'Customized Experience Voucher',
        reason: `${avoidedGifts}this is a unique experiential gift that allows them to choose their preferred experience based on their interests, both novel and thoughtful.`,
        estimatedPrice: budgetText
    });

    // 生成个性化祝福语
    const blessings = [
        `🎂 Happy birthday to this wonderful ${age}-year-old ${genderText}! May every day be as full of surprises and joy as your birthday!`,
        `✨ On this special day, may all the beautiful things surround you. Happy birthday!`,
        `🎉 A new chapter at ${age} begins! May every day ahead be more wonderful than today!`,
        `💝 The best gift is thoughtfulness, the most beautiful blessing is sincerity. Happy birthday!`
    ];

    const blessing = blessings[Math.floor(Math.random() * blessings.length)];

    return {
        recommendations: recommendations.slice(0, 3), // 确保只返回3个推荐
        blessing
    };
}

export async function GET() {
    return NextResponse.json({
        message: '快速礼物推荐API正常运行',
        timestamp: new Date().toISOString(),
        status: 'ok'
    });
}