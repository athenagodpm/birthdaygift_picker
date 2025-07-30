import { NextRequest, NextResponse } from 'next/server';
import { GiftRequest, GiftResponse, ApiError } from '@/types';
import { DoubaoService } from '@/services/doubaoService';
import { OpenAIService } from '@/services/openaiService';

export async function POST(request: NextRequest) {
    try {
        console.log('API called at:', new Date().toISOString());

        // 解析请求数据
        let body: GiftRequest;
        try {
            body = await request.json();
            console.log('Request body parsed successfully');
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            return NextResponse.json(
                { error: 'JSON解析失败', details: '请求体格式不正确' } as ApiError,
                { status: 400 }
            );
        }

        // 基础验证
        if (!body.gender || !body.age || !body.interests || !body.budget) {
            return NextResponse.json(
                { error: '请求数据不完整', details: '缺少必要的字段' } as ApiError,
                { status: 400 }
            );
        }

        console.log('Basic validation passed');

        // 尝试使用AI服务，按优先级：豆包 -> OpenAI -> 模拟响应
        let response: GiftResponse;

        // 设置总体超时时间为30秒
        const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error('API总体超时')), 30000);
        });

        try {
            response = await Promise.race([
                (async () => {
                    try {
                        // 优先尝试豆包，限时15秒
                        const doubaoPromise = DoubaoService.generateGiftRecommendations(body);
                        const doubaoTimeout = new Promise<never>((_, reject) => {
                            setTimeout(() => reject(new Error('豆包API超时')), 15000);
                        });

                        const result = await Promise.race([doubaoPromise, doubaoTimeout]);
                        console.log('豆包API response generated successfully');
                        return result;
                    } catch (doubaoError) {
                        console.warn('豆包API调用失败，尝试OpenAI:', doubaoError);

                        try {
                            // 备用OpenAI，限时10秒
                            const openaiPromise = OpenAIService.generateGiftRecommendations(body);
                            const openaiTimeout = new Promise<never>((_, reject) => {
                                setTimeout(() => reject(new Error('OpenAI API超时')), 10000);
                            });

                            const result = await Promise.race([openaiPromise, openaiTimeout]);
                            console.log('OpenAI API response generated successfully');
                            return result;
                        } catch (openaiError) {
                            console.warn('OpenAI API也调用失败，使用模拟响应:', openaiError);
                            // 最后使用模拟响应
                            const result = generateSimpleMockResponse(body);
                            console.log('Mock response generated as fallback');
                            return result;
                        }
                    }
                })(),
                timeoutPromise
            ]);
        } catch (error) {
            console.warn('所有服务都失败，使用模拟响应:', error);
            response = generateSimpleMockResponse(body);
            console.log('Final fallback mock response generated');
        }

        return NextResponse.json(response);

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: '服务器内部错误', details: '处理请求时发生错误' } as ApiError,
            { status: 500 }
        );
    }
}

// 简化的模拟响应生成
function generateSimpleMockResponse(request: GiftRequest): GiftResponse {
    const { gender, age, interests, budget } = request;

    console.log('Generating mock response for:', { gender, age, interestsCount: interests.length, budget });

    // 简单的推荐逻辑
    const recommendations = [
        {
            giftName: "定制化照片相册",
            reason: `根据您提供的信息，这是一个充满回忆和个人意义的礼物，适合${age}岁的${gender === 'male' ? '男性' : gender === 'female' ? '女性' : '朋友'}`,
            estimatedPrice: budget
        },
        {
            giftName: "精美手工艺品",
            reason: `结合您的兴趣爱好（${interests.slice(0, 2).join('、')}），这个礼物既实用又有纪念意义`,
            estimatedPrice: budget
        },
        {
            giftName: "个性化定制用品",
            reason: "独一无二的定制礼品，体现您的用心和对收礼人的了解",
            estimatedPrice: budget
        }
    ];

    const blessing = `愿你的每一天都像生日一样充满惊喜和快乐！🎂✨`;

    return {
        recommendations,
        blessing
    };
}

export async function GET() {
    return NextResponse.json(
        { error: '方法不允许', details: '请使用POST方法' } as ApiError,
        { status: 405 }
    );
}