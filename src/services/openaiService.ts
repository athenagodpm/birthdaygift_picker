import OpenAI from 'openai';
import { GiftRequest, GiftResponse } from '@/types';
import { PromptService } from './promptService';
import { ResponseProcessor } from './responseProcessor';

// OpenAI客户端将在需要时初始化
let openai: OpenAI | null = null;

// 获取或初始化OpenAI客户端
function getOpenAIClient(): OpenAI {
    if (!openai) {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OpenAI API密钥未配置');
        }
        openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
    return openai;
}

export class OpenAIService {
    static async generateGiftRecommendations(request: GiftRequest): Promise<GiftResponse> {
        try {
            // 检查API密钥
            if (!process.env.OPENAI_API_KEY) {
                throw new Error('OpenAI API密钥未配置');
            }

            const systemPrompt = PromptService.getSystemPrompt();
            const userPrompt = PromptService.buildUserPrompt(request);

            console.log('Calling OpenAI API...');

            const client = getOpenAIClient();
            const completion = await client.chat.completions.create({
                model: "gpt-4o-mini", // 使用更经济的模型
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
            });

            const responseContent = completion.choices[0]?.message?.content;

            if (!responseContent) {
                throw new Error('OpenAI API返回空响应');
            }

            console.log('OpenAI API response received');

            // 解析和处理JSON响应
            let rawResponse: unknown;
            try {
                rawResponse = JSON.parse(responseContent);
            } catch {
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
            console.log('OpenAI响应摘要:', summary);

            return processedResponse;

        } catch (error) {
            console.error('OpenAI API调用失败:', error);

            // 根据错误类型抛出不同的错误
            if (error instanceof Error) {
                if (error.message.includes('API密钥')) {
                    throw new Error('AI服务配置错误');
                } else if (error.message.includes('quota') || error.message.includes('billing')) {
                    throw new Error('AI服务暂时不可用，请稍后重试');
                } else if (error.message.includes('timeout')) {
                    throw new Error('AI服务响应超时，请稍后重试');
                } else {
                    throw new Error('AI服务暂时繁忙，请稍后重试');
                }
            }

            throw new Error('AI服务调用失败');
        }
    }

    // 测试API连接
    static async testConnection(): Promise<boolean> {
        try {
            if (!process.env.OPENAI_API_KEY) {
                return false;
            }

            const client = getOpenAIClient();
            const completion = await client.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: "Hello" }],
                max_tokens: 5
            });

            return !!completion.choices[0]?.message?.content;
        } catch (error) {
            console.error('OpenAI连接测试失败:', error);
            return false;
        }
    }
}