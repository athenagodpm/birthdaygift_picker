import { GiftRequest, GiftResponse } from '@/types';
import { PromptService } from './promptService';
import { ResponseProcessor } from './responseProcessor';

export class DoubaoService {
    private static readonly BASE_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';



    static async generateGiftRecommendations(request: GiftRequest): Promise<GiftResponse> {
        try {
            // 检查API密钥和模型名称
            if (!process.env.ARK_API_KEY) {
                throw new Error('豆包 API密钥未配置');
            }

            if (!process.env.DOUBAO_MODEL_NAME) {
                throw new Error('豆包模型名称未配置');
            }

            const apiKey = process.env.ARK_API_KEY;

            const systemPrompt = PromptService.getSystemPrompt();
            const userPrompt = PromptService.buildUserPrompt(request);

            console.log('Calling Doubao API...');
            console.log('API Key length:', apiKey.length);
            console.log('Model name:', process.env.DOUBAO_MODEL_NAME);

            const response = await fetch(this.BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: process.env.DOUBAO_MODEL_NAME,
                    messages: [
                        {
                            role: "system",
                            content: systemPrompt
                        },
                        {
                            role: "user",
                            content: userPrompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 1000,
                    response_format: { type: "json_object" }
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Doubao API error:', response.status, errorText);
                throw new Error(`豆包API调用失败: ${response.status} - ${errorText}`);
            }

            const responseData = await response.json();
            const responseContent = responseData.choices?.[0]?.message?.content;

            if (!responseContent) {
                throw new Error('豆包API返回空响应');
            }

            console.log('Doubao API response received');

            // 解析和处理JSON响应
            let rawResponse: any;
            try {
                rawResponse = JSON.parse(responseContent);
            } catch (parseError) {
                console.error('JSON解析失败:', responseContent);
                throw new Error('AI响应格式不正确');
            }

            // 使用响应处理器处理数据
            const processedResponse = ResponseProcessor.processGiftResponse(rawResponse);

            // 验证处理后的响应
            if (!ResponseProcessor.validateProcessedResponse(processedResponse)) {
                throw new Error('处理后的响应验证失败');
            }

            // 记录响应摘要
            const summary = ResponseProcessor.generateResponseSummary(processedResponse);
            console.log('豆包响应摘要:', summary);

            return processedResponse;

        } catch (error) {
            console.error('豆包API调用失败:', error);

            // 根据错误类型抛出不同的错误
            if (error instanceof Error) {
                if (error.message.includes('API密钥') || error.message.includes('模型名称')) {
                    throw new Error('AI服务配置错误');
                } else if (error.message.includes('quota') || error.message.includes('billing')) {
                    throw new Error('AI服务暂时不可用，请稍后重试');
                } else if (error.message.includes('timeout')) {
                    throw new Error('AI服务响应超时，请稍后重试');
                } else {
                    throw new Error(`豆包API调用失败: ${error.message}`);
                }
            }

            throw new Error('AI服务调用失败');
        }
    }

    // 测试API连接
    static async testConnection(): Promise<boolean> {
        try {
            if (!process.env.ARK_API_KEY || !process.env.DOUBAO_MODEL_NAME) {
                return false;
            }

            const apiKey = process.env.ARK_API_KEY;

            const response = await fetch(this.BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: process.env.DOUBAO_MODEL_NAME,
                    messages: [{ role: "user", content: "Hello" }],
                    max_tokens: 5
                })
            });

            return response.ok;
        } catch (error) {
            console.error('豆包连接测试失败:', error);
            return false;
        }
    }
}