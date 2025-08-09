'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RecommendationList from '@/components/results/RecommendationList';
import BlessingDisplay from '@/components/results/BlessingDisplay';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { useTranslation } from '@/hooks/useTranslation';
import { GiftResponse, GiftRequest } from '@/types';

export default function ResultsPage() {
    const router = useRouter();
    const { t } = useTranslation();
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
                setError(t('results.error'));
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
            setError(t('results.error'));
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
                    <p className="text-gray-600">{t('results.loading')}</p>
                </div>
            </div>
        );
    }

    if (error || !giftResponse) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
                <div className="max-w-md mx-auto text-center">
                    <ErrorMessage message={error || t('results.error')} className="mb-6" />
                    <div className="space-y-3">
                        <Button onClick={handleBackToQuestionnaire} variant="primary" className="w-full">
                            {t('results.backToQuestionnaire')}
                        </Button>
                        <Button onClick={handleStartOver} variant="outline" className="w-full">
                            {t('results.backToHome')}
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
                    <div className="flex items-center justify-between pr-16 md:pr-20">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl md:text-2xl font-bold text-gray-800">{t('results.title')}</h1>
                            {giftRequest && (
                                <p className="text-xs md:text-sm text-gray-600 mt-1 truncate">
                                    {t('results.forAge', {
                                        age: giftRequest.age?.toString() || '',
                                        gender: giftRequest.gender === 'male' ? t('results.genderMale') :
                                            giftRequest.gender === 'female' ? t('results.genderFemale') :
                                                t('results.genderOther')
                                    })}
                                </p>
                            )}
                        </div>
                        <Button onClick={handleStartOver} variant="outline" size="sm" className="ml-4 flex-shrink-0">
                            {t('results.startOver')}
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
                            {t('results.newRecommendation')}
                        </Button>
                        <Button
                            onClick={handleStartOver}
                            variant="primary"
                            size="lg"
                            className="sm:w-auto w-full"
                        >
                            {t('results.forOthers')}
                        </Button>
                    </div>

                    {/* 底部说明 */}
                    <div className="text-center pt-8 border-t border-gray-200">
                        <p className="text-gray-500 text-sm mb-2">
                            {t('results.footer.main')}
                        </p>
                        <p className="text-gray-400 text-xs">
                            {t('results.footer.sub')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}