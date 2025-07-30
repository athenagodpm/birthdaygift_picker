'use client';

import React, { useState } from 'react';
import { GiftService } from '@/services/giftService';
import { GiftRequest, GiftResponse } from '@/types';

export default function TestPage() {
    const [result, setResult] = useState<GiftResponse | null>(null);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const testData: GiftRequest = {
        gender: 'female',
        age: 25,
        interests: ['阅读', '音乐', '旅行'],
        pastGifts: ['鲜花', '巧克力'],
        budget: '100-200元',
        mbti: 'INFP'
    };

    const handleTest = async () => {
        try {
            setLoading(true);
            setError('');
            console.log('🧪 开始测试API调用...');

            const response = await GiftService.generateGiftRecommendations(testData);
            console.log('✅ 测试成功，响应:', response);

            setResult(response);
        } catch (err) {
            console.error('❌ 测试失败:', err);
            setError(err instanceof Error ? err.message : '测试失败');
        } finally {
            setLoading(false);
        }
    };

    const handleTestSimple = async () => {
        try {
            setLoading(true);
            setError('');
            console.log('🧪 开始测试简单API调用...');

            const response = await fetch('/api/test-gift', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ 简单测试成功，响应:', data);

            setResult(data);
        } catch (err) {
            console.error('❌ 简单测试失败:', err);
            setError(err instanceof Error ? err.message : '简单测试失败');
        } finally {
            setLoading(false);
        }
    };

    const handleTestQuick = async () => {
        try {
            setLoading(true);
            setError('');
            console.log('🧪 开始测试快速API调用...');

            const response = await fetch('/api/quick-gift', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ 快速测试成功，响应:', data);

            setResult(data);
        } catch (err) {
            console.error('❌ 快速测试失败:', err);
            setError(err instanceof Error ? err.message : '快速测试失败');
        } finally {
            setLoading(false);
        }
    };

    const handleTestFastAI = async () => {
        try {
            setLoading(true);
            setError('');
            console.log('🧪 开始测试快速AI调用...');

            const response = await fetch('/api/fast-gift', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ 快速AI测试成功，响应:', data);

            setResult(data);
        } catch (err) {
            console.error('❌ 快速AI测试失败:', err);
            setError(err instanceof Error ? err.message : '快速AI测试失败');
        } finally {
            setLoading(false);
        }
    };

    const handleTestDoubao = async () => {
        try {
            setLoading(true);
            setError('');
            console.log('🧪 开始测试豆包API调用...');

            const response = await fetch('/api/test-doubao', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP ${response.status}: ${errorData.error || '未知错误'}`);
            }

            const data = await response.json();
            console.log('✅ 豆包测试成功，响应:', data);

            setResult(data);
        } catch (err) {
            console.error('❌ 豆包测试失败:', err);
            setError(err instanceof Error ? err.message : '豆包测试失败');
        } finally {
            setLoading(false);
        }
    };

    const handleTestFastDoubao = async () => {
        try {
            setLoading(true);
            setError('');
            console.log('🧪 开始测试快速豆包API调用...');

            const response = await fetch('/api/fast-doubao', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP ${response.status}: ${errorData.error || '未知错误'}`);
            }

            const data = await response.json();
            console.log('✅ 快速豆包测试成功，响应:', data);

            setResult(data);
        } catch (err) {
            console.error('❌ 快速豆包测试失败:', err);
            setError(err instanceof Error ? err.message : '快速豆包测试失败');
        } finally {
            setLoading(false);
        }
    };

    const testSessionStorage = () => {
        console.log('🧪 测试SessionStorage...');

        // 测试存储
        const testData = { test: 'data', timestamp: Date.now() };
        sessionStorage.setItem('test', JSON.stringify(testData));
        console.log('✅ 数据已存储');

        // 测试读取
        const retrieved = sessionStorage.getItem('test');
        if (retrieved) {
            const parsed = JSON.parse(retrieved);
            console.log('✅ 数据读取成功:', parsed);
        } else {
            console.error('❌ 数据读取失败');
        }

        // 清理
        sessionStorage.removeItem('test');
        console.log('🧹 测试数据已清理');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">🧪 API测试页面</h1>

                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">测试数据</h2>
                    <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                        {JSON.stringify(testData, null, 2)}
                    </pre>
                </div>

                <div className="space-y-4 mb-6">
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={handleTestFastDoubao}
                            disabled={loading}
                            className="bg-pink-500 hover:bg-pink-600 disabled:bg-gray-400 text-white px-6 py-2 rounded"
                        >
                            {loading ? '测试中...' : '⚡ 快速豆包服务'}
                        </button>

                        <button
                            onClick={handleTestDoubao}
                            disabled={loading}
                            className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white px-6 py-2 rounded"
                        >
                            {loading ? '测试中...' : '🔥 豆包专项测试'}
                        </button>

                        <button
                            onClick={handleTestFastAI}
                            disabled={loading}
                            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-6 py-2 rounded"
                        >
                            {loading ? '测试中...' : '🚀 快速AI服务'}
                        </button>

                        <button
                            onClick={handleTestQuick}
                            disabled={loading}
                            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-2 rounded"
                        >
                            {loading ? '测试中...' : '⚡ 智能模拟API'}
                        </button>

                        <button
                            onClick={handleTestSimple}
                            disabled={loading}
                            className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white px-6 py-2 rounded"
                        >
                            {loading ? '测试中...' : '🧪 基础测试API'}
                        </button>

                        <button
                            onClick={handleTest}
                            disabled={loading}
                            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-2 rounded"
                        >
                            {loading ? '测试中...' : '🔄 完整API测试'}
                        </button>

                        <button
                            onClick={testSessionStorage}
                            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded"
                        >
                            🗄️ 测试SessionStorage
                        </button>
                    </div>

                    <div className="text-sm text-gray-600">
                        <p>• <strong>快速豆包服务</strong>: 绕过复杂处理器，最快的豆包调用</p>
                        <p>• <strong>豆包专项测试</strong>: 使用完整处理器的豆包测试</p>
                        <p>• <strong>快速AI服务</strong>: 并发调用真实AI服务，12秒内响应</p>
                        <p>• <strong>智能模拟API</strong>: 基于输入生成个性化推荐，响应最快</p>
                        <p>• <strong>基础测试API</strong>: 简单模拟响应，用于基础测试</p>
                        <p>• <strong>完整API测试</strong>: 调用完整的AI服务链路，可能较慢</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
                        <h3 className="text-red-800 font-semibold">❌ 错误</h3>
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {result && (
                    <div className="bg-green-50 border border-green-200 rounded p-4">
                        <h3 className="text-green-800 font-semibold mb-4">✅ 成功响应</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-medium">推荐列表:</h4>
                                <ul className="list-disc list-inside space-y-2 mt-2">
                                    {result.recommendations.map((rec, index) => (
                                        <li key={index} className="text-sm">
                                            <strong>{rec.giftName}</strong> - {rec.estimatedPrice}
                                            <br />
                                            <span className="text-gray-600">{rec.reason}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-medium">祝福语:</h4>
                                <p className="text-sm text-gray-600 mt-1">{result.blessing}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-8 text-center">
                    <a href="/questionnaire" className="text-blue-500 hover:underline">
                        ← 返回问卷页面
                    </a>
                </div>
            </div>
        </div>
    );
}