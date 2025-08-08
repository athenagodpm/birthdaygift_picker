'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import GiftQuestionnaireForm from '@/components/forms/GiftQuestionnaireForm';
// import Navigation from '@/components/ui/Navigation';
// import ProgressIndicator from '@/components/ui/ProgressIndicator';
import { GiftRequest, GiftResponse } from '@/types';

export default function QuestionnairePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const handleFormSubmit = async (data: GiftRequest) => {
        try {
            setIsLoading(true);
            setError('');
            console.log('🚀 提交表单数据:', data);

            // 先尝试快速API，如果失败再用完整API
            let response: GiftResponse;

            // 测试模式：优先使用智能模拟API
            try {
                console.log('🧪 测试模式：使用智能模拟API...');
                const quickResponse = await fetch('/api/quick-gift', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                if (quickResponse.ok) {
                    response = await quickResponse.json();
                    console.log('✅ 智能模拟API成功:', response);
                } else {
                    throw new Error('智能模拟API失败');
                }
            } catch (quickError) {
                console.warn('⚠️ 智能模拟API失败，尝试快速豆包服务:', quickError);

                try {
                    const fastDoubaoResponse = await fetch('/api/fast-doubao', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    });

                    if (fastDoubaoResponse.ok) {
                        response = await fastDoubaoResponse.json();
                        console.log('✅ 快速豆包成功:', response);
                    } else {
                        throw new Error('快速豆包失败');
                    }
                } catch (fastDoubaoError) {
                    console.warn('⚠️ 快速豆包失败，尝试快速AI服务:', fastDoubaoError);

                    const quickResponse = await fetch('/api/quick-gift', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    });

                    if (quickResponse.ok) {
                        response = await quickResponse.json();
                        console.log('✅ 智能模拟API成功:', response);
                    } else {
                        throw new Error('所有服务都失败了');
                    }
                }
            }

            // 将结果存储到sessionStorage中
            try {
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
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-800">🎁 生日礼物推荐</h1>
                        <a href="/" className="text-gray-600 hover:text-gray-800">返回首页</a>
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