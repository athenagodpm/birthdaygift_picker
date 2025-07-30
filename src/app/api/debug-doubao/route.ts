import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const rawApiKey = process.env.ARK_API_KEY;
        const modelName = process.env.DOUBAO_MODEL_NAME;

        if (!rawApiKey || !modelName) {
            return NextResponse.json({
                error: '配置不完整',
                details: {
                    hasApiKey: !!rawApiKey,
                    hasModelName: !!modelName
                }
            });
        }

        // 处理API密钥
        let processedApiKey = rawApiKey;
        let wasDecoded = false;

        const base64Pattern = /^[A-Za-z0-9+/]+=*$/;
        if (base64Pattern.test(rawApiKey) && rawApiKey.length > 20) {
            try {
                const decoded = Buffer.from(rawApiKey, 'base64').toString('utf-8');
                if (decoded.length > 10 && decoded.length < rawApiKey.length) {
                    processedApiKey = decoded;
                    wasDecoded = true;
                }
            } catch (decodeError) {
                // 使用原始密钥
            }
        }

        // 测试API调用
        const testResponse = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${processedApiKey}`
            },
            body: JSON.stringify({
                model: modelName,
                messages: [{ role: "user", content: "Hello" }],
                max_tokens: 5
            })
        });

        const responseText = await testResponse.text();

        return NextResponse.json({
            success: testResponse.ok,
            status: testResponse.status,
            statusText: testResponse.statusText,
            response: responseText,
            debug: {
                rawApiKeyLength: rawApiKey.length,
                processedApiKeyLength: processedApiKey.length,
                wasDecoded,
                modelName,
                apiKeyPrefix: processedApiKey.substring(0, 10) + '...',
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        return NextResponse.json({
            error: '测试失败',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}