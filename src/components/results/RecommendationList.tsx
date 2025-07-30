import React from 'react';
import { GiftRecommendation } from '@/types';
import RecommendationCard from './RecommendationCard';

interface RecommendationListProps {
    recommendations: GiftRecommendation[];
}

export default function RecommendationList({ recommendations }: RecommendationListProps) {
    if (!recommendations || recommendations.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">🤔</div>
                <p className="text-gray-500">暂无推荐结果</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* 标题 */}
            <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                    为你精选的礼物推荐 ✨
                </h2>
                <p className="text-gray-600">
                    基于收礼人的特点，我们为你推荐以下{recommendations.length}个贴心礼物
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
                        <p className="text-yellow-800 font-medium mb-1">贴心提示</p>
                        <p className="text-yellow-700 text-sm">
                            这些推荐都是基于收礼人的个人特点量身定制的。你可以根据实际情况和个人喜好进行调整，
                            最重要的是心意！记得在礼物上附上温馨的祝福语哦～
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}