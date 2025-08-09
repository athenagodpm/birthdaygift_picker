'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';

export default function TestDoubaoPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<string>('');
    const [error, setError] = useState<string>('');

    const testDoubaoAPI = async () => {
        setIsLoading(true);
        setError('');
        setResult('');

        try {
            const testData = {
                gender: 'female',
                age: 25,
                interests: ['reading', 'music'],
                budget: '100-200元',
                pastGifts: [],
                language: 'zh'
            };

            console.log('🧪 测试豆包API...');
            console.log('📤 发送数据:', testData);

            const response = await fetch('/api/fast-doubao', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testData),
            });

            console.log('📥 响应状态:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('✅ 豆包API成功:', data);
                setResult(JSON.stringify(data, null, 2));
            } else {
                const errorText = await response.text();
                console.error('❌ 豆包API失败:', response.status, errorText);
                setError(`API失败: ${response.status} - ${errorText}`);
            }
        } catch (err) {
            console.error('❌ 请求失败:', err);
            setError(err instanceof Error ? err.message : '未知错误');
        } finally {
            setIsLoading(false);
        }
    };

    const testQuickAPI = async () => {
        setIsLoading(true);
        setError('');
        setResult('');

        try {
            const testData = {
                gender: 'female',
                age: 25,
                interests: ['reading', 'music'],
                budget: '100-200元',
                pastGifts: [],
                language: 'zh'
            };

            console.log('🧪 测试快速API...');
            const response = await fetch('/api/quick-gift', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('✅ 快速API成功:', data);
                setResult(JSON.stringify(data, null, 2));
            } else {
                const errorText = await response.text();
                console.error('❌ 快速API失败:', response.status, errorText);
                setError(`API失败: ${response.status} - ${errorText}`);
            }
        } catch (err) {
            console.error('❌ 请求失败:', err);
            setError(err instanceof Error ? err.message : '未知错误');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">
                        🧪 豆包API测试页面
                    </h1>

                    <div className="mb-6">
                        <div className="flex flex-wrap gap-4">
                            <Button
                                onClick={testDoubaoAPI}
                                variant="primary"
                                disabled={isLoading}
                            >
                                {isLoading ? '测试中...' : '测试豆包API'}
                            </Button>
                            <Button
                                onClick={testQuickAPI}
                                variant="secondary"
                                disabled={isLoading}
                            >
                                {isLoading ? '测试中...' : '测试快速API'}
                            </Button>
                        </div>
                    </div>

                    {/* 错误信息 */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <h3 className="text-red-800 font-semibold mb-2">错误信息:</h3>
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    {/* 结果显示 */}
                    {result && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <h3 className="text-green-800 font-semibold mb-2">API响应结果:</h3>
                            <pre className="text-green-700 text-sm overflow-x-auto whitespace-pre-wrap">
                                {result}
                            </pre>
                        </div>
                    )}

                    {/* 环境信息 */}
                    <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <h3 className="text-gray-800 font-semibold mb-2">环境信息:</h3>
                        <div className="text-sm text-gray-600 space-y-1">
                            <p>豆包API密钥: {process.env.ARK_API_KEY ? '已配置' : '未配置'}</p>
                            <p>豆包模型: {process.env.DOUBAO_MODEL_NAME || '未配置'}</p>
                            <p>环境: {process.env.NODE_ENV}</p>
                        </div>
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
                    </div>
                </div>
            </div>
        </div>
    );
}