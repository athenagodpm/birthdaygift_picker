'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import GiftQuestionnaireForm from '@/components/forms/GiftQuestionnaireForm';
import { useTranslation } from '@/hooks/useTranslation';
// import Navigation from '@/components/ui/Navigation';
// import ProgressIndicator from '@/components/ui/ProgressIndicator';
import { GiftRequest, GiftResponse } from '@/types';

// 本地回退数据生成函数
const generateLocalFallbackResponse = (data: GiftRequest, language: 'zh' | 'en'): GiftResponse => {
    if (language === 'en') {
        return {
            recommendations: [
                {
                    giftName: "Personalized Photo Album",
                    reason: "A thoughtful gift that captures precious memories, perfect for someone who values relationships and experiences.",
                    estimatedPrice: "$20-50"
                },
                {
                    giftName: "Premium Tea Set",
                    reason: "A relaxing and elegant gift that shows care and consideration, suitable for quiet moments of reflection.",
                    estimatedPrice: "$30-80"
                },
                {
                    giftName: "Customized Notebook",
                    reason: "A practical yet personal gift that can be used daily, perfect for someone who enjoys writing or planning.",
                    estimatedPrice: "$15-40"
                }
            ],
            blessing: "🎂 Wishing you a wonderful birthday filled with joy, laughter, and all the things that make you happiest! May this new year bring you amazing adventures and beautiful memories. Happy Birthday! 🎉✨"
        };
    } else {
        return {
            recommendations: [
                {
                    giftName: "定制相册",
                    reason: "一份充满回忆的贴心礼物，记录美好时光，适合重视感情和经历的人。",
                    estimatedPrice: "100-300元"
                },
                {
                    giftName: "精品茶具套装",
                    reason: "优雅而放松的礼物，体现关怀和体贴，适合享受宁静时光的人。",
                    estimatedPrice: "200-500元"
                },
                {
                    giftName: "个性化笔记本",
                    reason: "实用又个人化的礼物，可以日常使用，适合喜欢写作或规划的人。",
                    estimatedPrice: "80-200元"
                }
            ],
            blessing: "🎂 祝你生日快乐！愿你的每一天都充满欢声笑语，愿新的一岁带给你更多精彩的冒险和美好的回忆。生日快乐！🎉✨"
        };
    }
};

export default function QuestionnairePage() {
    const router = useRouter();
    const { t, language } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const handleFormSubmit = async (data: GiftRequest) => {
        try {
            setIsLoading(true);
            setError('');
            console.log('🚀 提交表单数据:', data);

            // 添加当前语言到请求数据
            const requestData = {
                ...data,
                language: language as 'zh' | 'en'
            };

            // 先尝试快速API，如果失败再用完整API
            let response: GiftResponse;

            // 优先使用豆包AI服务
            try {
                console.log('🔥 使用豆包AI服务...');
                console.log('📤 发送数据:', requestData);

                const doubaoResponse = await fetch('/api/fast-doubao', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestData),
                });

                console.log('📥 豆包API响应状态:', doubaoResponse.status);

                if (doubaoResponse.ok) {
                    response = await doubaoResponse.json();
                    console.log('✅ 豆包AI服务成功:', response);
                } else {
                    const errorText = await doubaoResponse.text();
                    console.error('❌ 豆包AI服务失败:', doubaoResponse.status, errorText);
                    throw new Error(`豆包AI服务失败: ${doubaoResponse.status} - ${errorText}`);
                }
            } catch (doubaoError) {
                console.warn('⚠️ 豆包AI服务失败，尝试智能模拟API:', doubaoError);

                try {
                    console.log('🧪 回退到智能模拟API...');
                    const quickResponse = await fetch('/api/quick-gift', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(requestData),
                    });

                    console.log('📥 模拟API响应状态:', quickResponse.status);

                    if (quickResponse.ok) {
                        response = await quickResponse.json();
                        console.log('✅ 智能模拟API成功:', response);
                    } else {
                        const errorText = await quickResponse.text();
                        console.error('❌ 智能模拟API失败:', quickResponse.status, errorText);
                        throw new Error(`智能模拟API失败: ${quickResponse.status} - ${errorText}`);
                    }
                } catch (quickError) {
                    console.warn('⚠️ 所有API都失败，使用本地回退数据:', quickError);

                    // 如果所有API都失败，使用本地模拟数据作为最后的回退
                    response = generateLocalFallbackResponse(data, language);
                    console.log('✅ 使用本地回退数据:', response);
                }
            }

            // 将结果存储到sessionStorage中
            try {
                console.log('💾 准备存储数据到sessionStorage:');
                console.log('📤 原始表单数据 (data):', data);
                console.log('📤 请求数据 (requestData):', requestData);
                console.log('📥 API响应数据 (response):', response);

                sessionStorage.setItem('giftRecommendations', JSON.stringify(response));
                sessionStorage.setItem('giftRequest', JSON.stringify(data));
                console.log('💾 数据已存储到sessionStorage');

                // 确保数据存储完成后再跳转
                setTimeout(() => {
                    console.log('🔄 跳转到results页面');
                    router.push('/results');
                }, 100);
            } catch (storageError) {
                console.error('❌ 存储数据失败:', storageError);
                setError('存储推荐结果失败，请重试');
            }
        } catch (err) {
            console.error('❌ 所有API调用都失败:', err);
            setError(err instanceof Error ? err.message : '获取推荐失败，请稍后重试');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
            {/* 简化的头部 */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 py-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between pr-16 md:pr-20">
                        <h1 className="text-xl md:text-2xl font-bold text-gray-800">🎁 {t('questionnaire.title')}</h1>
                        <button onClick={() => router.push('/')} className="text-gray-600 hover:text-gray-800 transition-colors duration-200 text-sm md:text-base">{t('results.backToHome')}</button>
                    </div>
                </div>
            </div>

            <div className="py-8 px-4">
                <div className="container mx-auto">
                    <GiftQuestionnaireForm
                        onSubmit={handleFormSubmit}
                        isLoading={isLoading}
                        error={error}
                    />
                </div>
            </div>
        </div>
    );
}