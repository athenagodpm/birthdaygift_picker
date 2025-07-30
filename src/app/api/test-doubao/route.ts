import { NextRequest, NextResponse } from 'next/server';
import { GiftRequest, GiftResponse, ApiError } from '@/types';

export async function POST(request: NextRequest) {
    try {
        console.log('🧪 豆包测试API调用开始:', new Date().toISOString());

        // 解析请求数据
        let body: GiftRequest;
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

        // 检查豆包配置
        if (!process.env.ARK_API_KEY || !process.env.DOUBAO_MODEL_NAME) {
            return NextResponse.json(
                { error: '豆包服务未配置', details: '缺少API密钥或模型名称' } as ApiError,
                { status: 500 }
            );
        }

        console.log('✅ 豆包配置检查通过');
        console.log('API Key长度:', process.env.ARK_API_KEY.length);
        console.log('模型名称:', process.env.DOUBAO_MODEL_NAME);

        // 构建简化的prompt
        const { gender, age, interests, budget } = body;
        const prompt = `为${age}岁${gender === 'male' ? '男性' : '女性'}推荐3个生日礼物：
兴趣：${interests.join('、') || '无'}
预算：${budget}

返回JSON格式：
{
  "recommendations": [
    {"giftName": "礼物名", "reason": "理由", "estimatedPrice": "${budget}"},
    {"giftName": "礼物名", "reason": "理由", "estimatedPrice": "${budget}"},
    {"giftName": "礼物名", "reason": "理由", "estimatedPrice": "${budget}"}
  ],
  "blessing": "生日祝福"
}`;

        console.log('🚀 开始调用豆包API...');
        const startTime = Date.now();

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
                max_tokens: 300,
                response_format: { type: "json_object" }
            })
        });

        const apiCallTime = Date.now() - startTime;
        console.log(`⏱️ 豆包API调用耗时: ${apiCallTime}ms`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ 豆包API错误:', response.status, errorText);
            return NextResponse.json(
                { error: `豆包API调用失败: ${response.status}`, details: errorText } as ApiError,
                { status: 500 }
            );
        }

        console.log('✅ 豆包API响应成功');

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;

        if (!content) {
            console.error('❌ 豆包API返回空内容');
            return NextResponse.json(
                { error: '豆包API返回空内容', details: '响应中没有内容' } as ApiError,
                { status: 500 }
            );
        }

        console.log('📝 豆包API原始响应:', content);

        // 解析JSON
        let result: GiftResponse;
        try {
            result = JSON.parse(content);
            console.log('✅ JSON解析成功');
        } catch (parseError) {
            console.error('❌ JSON解析失败:', parseError);
            console.error('原始内容:', content);
            return NextResponse.json(
                { error: 'JSON解析失败', details: '豆包返回的内容不是有效的JSON格式' } as ApiError,
                { status: 500 }
            );
        }

        // 验证响应格式
        if (!result.recommendations || !Array.isArray(result.recommendations) || !result.blessing) {
            console.error('❌ 响应格式验证失败:', result);
            return NextResponse.json(
                { error: '响应格式不正确', details: '缺少必要的字段' } as ApiError,
                { status: 500 }
            );
        }

        const totalTime = Date.now() - startTime;
        console.log(`🎉 豆包测试成功! 总耗时: ${totalTime}ms`);

        return NextResponse.json({
            ...result,
            _debug: {
                apiCallTime: `${apiCallTime}ms`,
                totalTime: `${totalTime}ms`,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('❌ 豆包测试API错误:', error);
        return NextResponse.json(
            { error: '服务器内部错误', details: error instanceof Error ? error.message : '未知错误' } as ApiError,
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: '豆包测试API',
        status: 'ready',
        config: {
            hasApiKey: !!process.env.ARK_API_KEY,
            hasModelName: !!process.env.DOUBAO_MODEL_NAME,
            apiKeyLength: process.env.ARK_API_KEY?.length || 0,
            modelName: process.env.DOUBAO_MODEL_NAME || 'not configured'
        }
    });
}