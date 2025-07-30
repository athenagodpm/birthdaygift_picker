'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RecommendationList from '@/components/results/RecommendationList';
import BlessingDisplay from '@/components/results/BlessingDisplay';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { GiftResponse, GiftRequest } from '@/types';

export default function ResultsPage() {
    const router = useRouter();
    const [giftResponse, setGiftResponse] = useState<GiftResponse | null>(null);
    const [giftRequest, setGiftRequest] = useState<GiftRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        // 从sessionStorage获取推荐结果
        console.log('📄 Results页面加载，开始读取数据...');
        try {
            const storedResponse = sessionStorage.getItem('giftRecommendations');
            const storedRequest = sessionStorage.getItem('giftRequest');

            console.log('📦 存储的响应数据:', storedResponse ? '存在' : '不存在');
            console.log('📦 存储的请求数据:', storedRequest ? '存在' : '不存在');

            if (!storedResponse) {
                console.error('❌ 未找到存储的推荐结果');
                setError('未找到推荐结果，请重新填写问卷');
                setLoading(false);
                return;
            }

            const response: GiftResponse = JSON.parse(storedResponse);
            const request: GiftRequest = storedRequest ? JSON.parse(storedRequest) : null;

            console.log('✅ 解析后的响应:', response);
            console.log('✅ 解析后的请求:', request);

            setGiftResponse(response);
            setGiftRequest(request);
            setLoading(false);
            console.log('🎉 数据设置完成');
        } catch (err) {
            console.error('❌ 解析推荐结果失败:', err);
            setError('推荐结果格式错误，请重新获取');
            setLoading(false);
        }
    }, []);

    const handleBackToQuestionnaire = () => {
        router.push('/questionnaire');
    };

    const handleStartOver = () => {
        // 清除存储的数据
        sessionStorage.removeItem('giftRecommendations');
        sessionStorage.removeItem('giftRequest');
        router.push('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <LoadingSpinner size="lg" className="mb-4" />
                    <p className="text-gray-600">正在加载推荐结果...</p>
                </div>
            </div>
        );
    }

    if (error || !giftResponse) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
                <div className="max-w-md mx-auto text-center">
                    <ErrorMessage message={error || '未找到推荐结果'} className="mb-6" />
                    <div className="space-y-3">
                        <Button onClick={handleBackToQuestionnaire} variant="primary" className="w-full">
                            重新填写问卷
                        </Button>
                        <Button onClick={handleStartOver} variant="outline" className="w-full">
                            返回首页
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
            {/* 头部 */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">礼物推荐结果</h1>
                            {giftRequest && (
                                <p className="text-sm text-gray-600 mt-1">
                                    为{giftRequest.age}岁{giftRequest.gender === 'male' ? '男性' : giftRequest.gender === 'female' ? '女性' : ''}的礼物推荐
                                </p>
                            )}
                        </div>
                        <Button onClick={handleStartOver} variant="outline" size="sm">
                            重新开始
                        </Button>
                    </div>
                </div>
            </div>

            {/* 主要内容 */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* 推荐列表 */}
                    <RecommendationList recommendations={giftResponse.recommendations} />

                    {/* 祝福语 */}
                    <BlessingDisplay blessing={giftResponse.blessing} />

                    {/* 操作按钮 */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                        <Button
                            onClick={handleBackToQuestionnaire}
                            variant="secondary"
                            size="lg"
                            className="sm:w-auto w-full"
                        >
                            🔄 重新推荐
                        </Button>
                        <Button
                            onClick={handleStartOver}
                            variant="primary"
                            size="lg"
                            className="sm:w-auto w-full"
                        >
                            ✨ 为其他人推荐
                        </Button>
                    </div>

                    {/* 底部说明 */}
                    <div className="text-center pt-8 border-t border-gray-200">
                        <p className="text-gray-500 text-sm mb-2">
                            🎁 希望这些推荐能帮你找到完美的生日礼物！
                        </p>
                        <p className="text-gray-400 text-xs">
                            记住，最好的礼物是你的心意 💝
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}