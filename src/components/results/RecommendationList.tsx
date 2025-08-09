import React from 'react';
import { GiftRecommendation } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';
import RecommendationCard from './RecommendationCard';

interface RecommendationListProps {
    recommendations: GiftRecommendation[];
}

export default function RecommendationList({ recommendations }: RecommendationListProps) {
    const { t } = useTranslation();

    if (!recommendations || recommendations.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">🤔</div>
                <p className="text-gray-500">{t('results.noResults')}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* 标题 */}
            <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                    {t('results.recommendationTitle')}
                </h2>
                <p className="text-gray-600">
                    {t('results.recommendationSubtitle', { count: recommendations.length.toString() })}
                </p>
            </div>

            {/* 推荐卡片网格 */}
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
                {recommendations.map((recommendation, index) => (
                    <RecommendationCard
                        key={index}
                        recommendation={recommendation}
                        index={index}
                    />
                ))}
            </div>

            {/* 底部提示 */}
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-3">
                    <div className="text-yellow-500 text-xl">💡</div>
                    <div>
                        <p className="text-yellow-800 font-medium mb-1">{t('results.tip.title')}</p>
                        <p className="text-yellow-700 text-sm">
                            {t('results.tip.content')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}