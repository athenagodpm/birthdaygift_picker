'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';

export default function DebugDataFlowPage() {
    const [sessionData, setSessionData] = useState<{
        giftRequest: any;
        giftRecommendations: any;
    } | null>(null);

    const loadSessionData = () => {
        try {
            const giftRequest = sessionStorage.getItem('giftRequest');
            const giftRecommendations = sessionStorage.getItem('giftRecommendations');

            setSessionData({
                giftRequest: giftRequest ? JSON.parse(giftRequest) : null,
                giftRecommendations: giftRecommendations ? JSON.parse(giftRecommendations) : null
            });
        } catch (error) {
            console.error('解析sessionStorage数据失败:', error);
        }
    };

    const clearSessionData = () => {
        sessionStorage.removeItem('giftRequest');
        sessionStorage.removeItem('giftRecommendations');
        setSessionData(null);
    };

    const testDataFlow = async () => {
        const testData = {
            gender: 'female',
            age: 25,
            interests: ['reading', 'music'],
            budget: '100-200元',
            pastGifts: [],
            language: 'zh'
        };

        console.log('🧪 测试数据流 - 原始数据:', testData);

        try {
            // 测试API调用
            const response = await fetch('/api/quick-gift', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testData),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('✅ API响应:', result);

                // 模拟存储过程
                sessionStorage.setItem('giftRequest', JSON.stringify(testData));
                sessionStorage.setItem('giftRecommendations', JSON.stringify(result));
                console.log('💾 数据已存储到sessionStorage');

                // 重新加载数据
                loadSessionData();
            } else {
                console.error('❌ API调用失败:', response.status);
            }
        } catch (error) {
            console.error('❌ 测试失败:', error);
        }
    };

    useEffect(() => {
        loadSessionData();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">
                        🔍 数据流调试工具
                    </h1>

                    <div className="mb-6">
                        <div className="flex flex-wrap gap-4">
                            <Button onClick={testDataFlow} variant="primary">
                                测试数据流 (年龄25)
                            </Button>
                            <Button onClick={loadSessionData} variant="secondary">
                                重新加载SessionStorage
                            </Button>
                            <Button onClick={clearSessionData} variant="outline">
                                清空SessionStorage
                            </Button>
                        </div>
                    </div>

                    {/* SessionStorage数据显示 */}
                    {sessionData && (
                        <div className="space-y-6">
                            {/* 请求数据 */}
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <h3 className="text-blue-800 font-semibold mb-2">
                                    📤 存储的请求数据 (giftRequest):
                                </h3>
                                {sessionData.giftRequest ? (
                                    <div className="space-y-2">
                                        <p><strong>年龄:</strong> <span className="text-red-600 font-bold">{sessionData.giftRequest.age}</span></p>
                                        <p><strong>性别:</strong> {sessionData.giftRequest.gender}</p>
                                        <p><strong>兴趣:</strong> {JSON.stringify(sessionData.giftRequest.interests)}</p>
                                        <p><strong>预算:</strong> {sessionData.giftRequest.budget}</p>
                                        <details className="mt-2">
                                            <summary className="cursor-pointer text-blue-600">查看完整数据</summary>
                                            <pre className="mt-2 p-2 bg-white rounded text-xs overflow-x-auto">
                                                {JSON.stringify(sessionData.giftRequest, null, 2)}
                                            </pre>
                                        </details>
                                    </div>
                                ) : (
                                    <p className="text-gray-500">无数据</p>
                                )}
                            </div>

                            {/* 响应数据 */}
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                <h3 className="text-green-800 font-semibold mb-2">
                                    📥 存储的响应数据 (giftRecommendations):
                                </h3>
                                {sessionData.giftRecommendations ? (
                                    <div className="space-y-2">
                                        <p><strong>推荐数量:</strong> {sessionData.giftRecommendations.recommendations?.length || 0}</p>
                                        <p><strong>祝福语:</strong> {sessionData.giftRecommendations.blessing?.substring(0, 50)}...</p>
                                        <details className="mt-2">
                                            <summary className="cursor-pointer text-green-600">查看完整数据</summary>
                                            <pre className="mt-2 p-2 bg-white rounded text-xs overflow-x-auto">
                                                {JSON.stringify(sessionData.giftRecommendations, null, 2)}
                                            </pre>
                                        </details>
                                    </div>
                                ) : (
                                    <p className="text-gray-500">无数据</p>
                                )}
                            </div>
                        </div>
                    )}

                    {!sessionData && (
                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                            <p className="text-gray-500">暂无SessionStorage数据</p>
                        </div>
                    )}

                    {/* 说明 */}
                    <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h3 className="text-yellow-800 font-semibold mb-2">🐛 调试说明:</h3>
                        <ul className="text-yellow-700 text-sm space-y-1 list-disc list-inside">
                            <li>这个工具可以帮助追踪年龄数据在整个流程中的变化</li>
                            <li>点击"测试数据流"会发送年龄为25的测试数据</li>
                            <li>检查存储的请求数据中的年龄是否仍然是25</li>
                            <li>如果年龄发生了变化，说明问题出现在API处理或存储过程中</li>
                        </ul>
                    </div>

                    {/* 导航 */}
                    <div className="mt-8 flex gap-4">
                        <button
                            onClick={() => window.location.href = '/'}
                            className="text-blue-600 hover:text-blue-800 underline"
                        >
                            ← 返回首页
                        </button>
                        <button
                            onClick={() => window.location.href = '/questionnaire'}
                            className="text-blue-600 hover:text-blue-800 underline"
                        >
                            去问卷页面
                        </button>
                        <button
                            onClick={() => window.location.href = '/results'}
                            className="text-blue-600 hover:text-blue-800 underline"
                        >
                            去结果页面
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}