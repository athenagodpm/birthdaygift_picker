import { NextRequest, NextResponse } from 'next/server';
import { GiftRequest, GiftResponse, ApiError } from '@/types';

export async function POST(request: NextRequest) {
    try {
        console.log('🧪 Test API called at:', new Date().toISOString());

        // 解析请求数据
        let body: GiftRequest;
        try {
            body = await request.json();
            console.log('✅ Request body parsed successfully:', body);
        } catch (parseError) {
            console.error('❌ JSON parse error:', parseError);
            return NextResponse.json(
                { error: 'JSON解析失败', details: '请求体格式不正确' } as ApiError,
                { status: 400 }
            );
        }

        // 基础验证
        if (!body.gender || !body.age || !body.interests || !body.budget) {
            console.error('❌ Validation failed:', {
                hasGender: !!body.gender,
                hasAge: !!body.age,
                hasInterests: !!body.interests,
                hasBudget: !!body.budget
            });
            return NextResponse.json(
                { error: '请求数据不完整', details: '缺少必要的字段' } as ApiError,
                { status: 400 }
            );
        }

        console.log('✅ Basic validation passed');

        // 立即返回模拟响应，不调用任何外部服务
        const response = generateTestMockResponse(body);
        console.log('✅ Mock response generated:', response);

        return NextResponse.json(response);

    } catch (error) {
        console.error('❌ API Error:', error);
        return NextResponse.json(
            { error: '服务器内部错误', details: '处理请求时发生错误' } as ApiError,
            { status: 500 }
        );
    }
}

// 测试用的模拟响应生成
function generateTestMockResponse(request: GiftRequest): GiftResponse {
    const { gender, age, interests, budget } = request;

    console.log('🎁 Generating test mock response for:', {
        gender,
        age,
        interestsCount: interests.length,
        budget,
        interests: interests.slice(0, 3)
    });

    // 基于输入数据生成个性化推荐
    const genderText = gender === 'male' ? '男性' : gender === 'female' ? '女性' : '朋友';
    const mainInterest = interests[0] || '生活';
    const secondInterest = interests[1] || '娱乐';

    const recommendations = [
        {
            giftName: `${mainInterest}主题定制礼品`,
            reason: `根据您提到的"${mainInterest}"兴趣，这个定制礼品非常适合${age}岁的${genderText}，既实用又有纪念意义。`,
            estimatedPrice: budget
        },
        {
            giftName: `${secondInterest}相关精美用品`,
            reason: `结合"${secondInterest}"爱好，这个礼物能够满足日常需求，体现您的贴心关怀。`,
            estimatedPrice: budget
        },
        {
            giftName: "个性化生日纪念品",
            reason: `专门为${age}岁生日设计的纪念品，独一无二，充满个人意义和温暖回忆。`,
            estimatedPrice: budget
        }
    ];

    const blessing = `🎂 祝愿这位${age}岁的${genderText}生日快乐！愿每一天都像生日一样充满惊喜和快乐！✨`;

    return {
        recommendations,
        blessing
    };
}

export async function GET() {
    return NextResponse.json({
        message: '测试API正常运行',
        timestamp: new Date().toISOString(),
        status: 'ok'
    });
}