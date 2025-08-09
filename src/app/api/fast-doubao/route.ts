import { NextRequest, NextResponse } from 'next/server';
import { GiftRequest, GiftResponse, ApiError } from '@/types';
import { FastDoubaoService } from '@/services/fastDoubaoService';
import { Language } from '@/services/multilingualPromptService';

export async function POST(request: NextRequest) {
    try {
        console.log('🚀 快速豆包API调用开始:', new Date().toISOString());

        // 解析请求数据
        let body: GiftRequest & { language?: Language };
        try {
            body = await request.json();
            console.log('✅ 请求数据解析成功');
        } catch (parseError) {
            console.error('❌ JSON解析错误:', parseError);
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

        console.log('✅ 基础验证通过');

        // 使用快速豆包服务
        const response = await FastDoubaoService.generateGiftRecommendations(body, language);
        console.log('✅ 快速豆包服务成功');

        return NextResponse.json(response);

    } catch (error) {
        console.error('❌ 快速豆包API错误:', error);
        return NextResponse.json(
            { error: '快速豆包服务失败', details: error instanceof Error ? error.message : '未知错误' } as ApiError,
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: '快速豆包API服务',
        status: 'ready',
        features: [
            '绕过复杂的ResponseProcessor',
            '最小化响应处理时间',
            '简化的验证逻辑',
            '详细的性能监控'
        ],
        config: {
            hasApiKey: !!process.env.ARK_API_KEY,
            hasModelName: !!process.env.DOUBAO_MODEL_NAME,
            apiKeyLength: process.env.ARK_API_KEY?.length || 0,
            modelName: process.env.DOUBAO_MODEL_NAME || 'not configured'
        }
    });
}