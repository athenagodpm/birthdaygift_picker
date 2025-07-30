import { NextRequest, NextResponse } from 'next/server';
import { GiftRequest, GiftResponse, ApiError } from '@/types';
import { FastAIService } from '@/services/fastAIService';

export async function POST(request: NextRequest) {
    try {
        console.log('⚡ Fast AI API called at:', new Date().toISOString());

        // 解析请求数据
        let body: GiftRequest;
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

        // 基础验证
        if (!body.gender || !body.age || !body.interests || !body.budget) {
            return NextResponse.json(
                { error: '请求数据不完整', details: '缺少必要的字段' } as ApiError,
                { status: 400 }
            );
        }

        console.log('✅ Basic validation passed');

        // 使用快速AI服务
        const response = await FastAIService.generateGiftRecommendations(body);
        console.log('✅ Fast AI response generated');

        return NextResponse.json(response);

    } catch (error) {
        console.error('❌ Fast AI API Error:', error);
        return NextResponse.json(
            { error: '服务器内部错误', details: '处理请求时发生错误' } as ApiError,
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: '快速AI礼物推荐API正常运行',
        timestamp: new Date().toISOString(),
        status: 'ok',
        features: [
            '并发调用多个AI服务',
            '5秒超时保护',
            '智能fallback机制',
            '优化的prompt设计'
        ]
    });
}