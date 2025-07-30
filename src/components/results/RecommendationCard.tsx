import React from 'react';
import { GiftRecommendation } from '@/types';

interface RecommendationCardProps {
    recommendation: GiftRecommendation;
    index: number;
}

export default function RecommendationCard({ recommendation, index }: RecommendationCardProps) {
    const { giftName, reason, estimatedPrice } = recommendation;

    // 为每个卡片分配不同的颜色主题
    const colorThemes = [
        'from-pink-500 to-rose-500',
        'from-purple-500 to-indigo-500',
        'from-blue-500 to-cyan-500'
    ];

    const bgThemes = [
        'bg-pink-50 border-pink-200',
        'bg-purple-50 border-purple-200',
        'bg-blue-50 border-blue-200'
    ];

    const textThemes = [
        'text-pink-700',
        'text-purple-700',
        'text-blue-700'
    ];

    const currentColorTheme = colorThemes[index % colorThemes.length];
    const currentBgTheme = bgThemes[index % bgThemes.length];
    const currentTextTheme = textThemes[index % textThemes.length];

    return (
        <div className={`${currentBgTheme} border-2 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-105`}>
            {/* 卡片头部 */}
            <div className="flex items-start justify-between mb-4">
                <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r ${currentColorTheme} text-white font-bold text-sm`}>
                    {index + 1}
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${currentBgTheme} ${currentTextTheme}`}>
                    {estimatedPrice}
                </div>
            </div>

            {/* 礼物名称 */}
            <h3 className="text-xl font-bold text-gray-800 mb-3 leading-tight">
                {giftName}
            </h3>

            {/* 推荐理由 */}
            <p className="text-gray-600 leading-relaxed mb-4">
                {reason}
            </p>

            {/* 底部装饰 */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                    <div className="text-2xl">🎁</div>
                    <span className="text-sm text-gray-500">精心推荐</span>
                </div>
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${currentColorTheme}`}></div>
            </div>
        </div>
    );
}