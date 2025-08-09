import { GiftRequest, GiftResponse } from '@/types';
import { FastResponseProcessor } from './fastResponseProcessor';
import { MultilingualPromptService, Language } from './multilingualPromptService';

export class FastDoubaoService {
    private static readonly BASE_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';

    static async generateGiftRecommendations(request: GiftRequest, language: Language = 'zh'): Promise<GiftResponse> {
        try {
            // 检查配置
            if (!process.env.ARK_API_KEY || !process.env.DOUBAO_MODEL_NAME) {
                throw new Error('豆包服务未配置');
            }

            console.log('🔥 快速豆包服务启动...');
            const startTime = Date.now();

            // 使用多语言提示词服务
            const systemPrompt = MultilingualPromptService.getSystemPrompt(language);
            const userPrompt = MultilingualPromptService.buildUserPrompt(request, language);

            // 调用豆包API
            const response = await fetch(this.BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.ARK_API_KEY}`
                },
                body: JSON.stringify({
                    model: process.env.DOUBAO_MODEL_NAME,
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userPrompt }
                    ],
                    temperature: 0.7,
                    max_tokens: 800,
                    response_format: { type: "json_object" }
                })
            });

            const apiTime = Date.now() - startTime;
            console.log(`⏱️ 豆包API调用耗时: ${apiTime}ms`);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('豆包API错误:', response.status, errorText);
                throw new Error(`豆包API失败: ${response.status}`);
            }

            const data = await response.json();
            const content = data.choices?.[0]?.message?.content;

            if (!content) {
                throw new Error('豆包API返回空内容');
            }

            console.log('✅ 豆包API响应成功');

            // 快速处理响应，带JSON修复功能
            let fixedContent = content;
            if (!content.trim().endsWith('}')) {
                console.log('⚠️ 检测到JSON可能被截断，尝试修复...');
                fixedContent = this.fixTruncatedJSON(content);
            }

            const rawResult = JSON.parse(fixedContent);
            const processedResult = FastResponseProcessor.processGiftResponse(rawResult);

            if (!FastResponseProcessor.validateResponse(processedResult)) {
                throw new Error('响应验证失败');
            }

            const totalTime = Date.now() - startTime;
            console.log(`🎉 快速豆包服务完成! 总耗时: ${totalTime}ms`);
            console.log('📝 响应摘要:', FastResponseProcessor.generateSummary(processedResult));

            return processedResult;

        } catch (error) {
            console.error('快速豆包服务失败:', error);
            throw error;
        }
    }

    // 测试连接
    static async testConnection(): Promise<boolean> {
        try {
            if (!process.env.ARK_API_KEY || !process.env.DOUBAO_MODEL_NAME) {
                return false;
            }

            const response = await fetch(this.BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.ARK_API_KEY}`
                },
                body: JSON.stringify({
                    model: process.env.DOUBAO_MODEL_NAME,
                    messages: [{ role: "user", content: "Hello" }],
                    max_tokens: 5
                })
            });

            return response.ok;
        } catch (error) {
            return false;
        }
    }

    // 修复被截断的JSON
    private static fixTruncatedJSON(content: string): string {
        console.log('🔧 尝试修复被截断的JSON...');

        let fixed = content.trim();

        // 如果JSON在字符串中间被截断，尝试闭合字符串
        const lastQuoteIndex = fixed.lastIndexOf('"');
        const lastBraceIndex = fixed.lastIndexOf('}');
        const lastBracketIndex = fixed.lastIndexOf(']');

        // 如果最后一个引号在最后一个大括号之后，说明字符串被截断了
        if (lastQuoteIndex > Math.max(lastBraceIndex, lastBracketIndex)) {
            // 找到被截断的字符串的开始位置
            const beforeLastQuote = fixed.substring(0, lastQuoteIndex);
            const secondLastQuoteIndex = beforeLastQuote.lastIndexOf('"');

            if (secondLastQuoteIndex !== -1) {
                // 截断到完整的字符串
                fixed = fixed.substring(0, secondLastQuoteIndex + 1);
                console.log('🔧 截断了不完整的字符串');
            }
        }

        // 确保JSON结构完整
        const openBraces = (fixed.match(/{/g) || []).length;
        const closeBraces = (fixed.match(/}/g) || []).length;
        const openBrackets = (fixed.match(/\[/g) || []).length;
        const closeBrackets = (fixed.match(/\]/g) || []).length;

        // 添加缺失的闭合括号
        for (let i = 0; i < openBrackets - closeBrackets; i++) {
            fixed += ']';
        }

        // 添加缺失的闭合大括号
        for (let i = 0; i < openBraces - closeBraces; i++) {
            fixed += '}';
        }

        console.log('🔧 JSON修复完成');
        return fixed;
    }
}