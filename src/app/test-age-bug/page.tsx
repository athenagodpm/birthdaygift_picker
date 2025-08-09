'use client';

import React, { useState } from 'react';
import AgeInput from '@/components/forms/AgeInput';
import Button from '@/components/ui/Button';

export default function TestAgeBugPage() {
    const [formData, setFormData] = useState({
        age: undefined as number | undefined
    });
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (message: string) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev, `${timestamp}: ${message}`]);
        console.log(message);
    };

    const handleAgeChange = (newAge: number | undefined) => {
        addLog(`🔄 年龄变更: ${formData.age} -> ${newAge}`);
        setFormData(prev => ({ ...prev, age: newAge }));
    };

    const simulateFormSubmit = () => {
        addLog(`📤 模拟表单提交 - 当前年龄: ${formData.age}`);

        // 模拟问卷页面的数据处理
        const requestData = {
            ...formData,
            gender: 'female',
            interests: ['reading'],
            budget: '100-200元',
            language: 'zh'
        };

        addLog(`📦 请求数据: ${JSON.stringify(requestData)}`);

        // 模拟存储到sessionStorage
        try {
            sessionStorage.setItem('testGiftRequest', JSON.stringify(formData));
            addLog(`💾 数据已存储到sessionStorage`);

            // 立即读取验证
            const stored = sessionStorage.getItem('testGiftRequest');
            if (stored) {
                const parsed = JSON.parse(stored);
                addLog(`📥 从sessionStorage读取的年龄: ${parsed.age}`);

                if (parsed.age !== formData.age) {
                    addLog(`❌ 年龄数据不一致! 原始: ${formData.age}, 存储后: ${parsed.age}`);
                } else {
                    addLog(`✅ 年龄数据一致: ${parsed.age}`);
                }
            }
        } catch (error) {
            addLog(`❌ 存储失败: ${error}`);
        }
    };

    const testParseInt = () => {
        const testValues = ['25', '23', '025', '25.5', '25abc'];
        testValues.forEach(val => {
            const parsed = parseInt(val, 10);
            addLog(`🧪 parseInt('${val}', 10) = ${parsed}`);
        });
    };

    const testJSONSerialization = () => {
        const testData = { age: 25, name: 'test' };
        addLog(`🧪 原始数据: ${JSON.stringify(testData)}`);

        const serialized = JSON.stringify(testData);
        addLog(`🧪 序列化后: ${serialized}`);

        const deserialized = JSON.parse(serialized);
        addLog(`🧪 反序列化后: ${JSON.stringify(deserialized)}`);
        addLog(`🧪 年龄类型: ${typeof deserialized.age}, 值: ${deserialized.age}`);

        // 测试边界情况
        const edgeCases = [
            { age: 25 },
            { age: '25' },
            { age: 25.0 },
            { age: parseInt('25', 10) }
        ];

        edgeCases.forEach((data, index) => {
            const serialized = JSON.stringify(data);
            const deserialized = JSON.parse(serialized);
            addLog(`🧪 测试${index + 1}: ${JSON.stringify(data)} -> ${JSON.stringify(deserialized)} (类型: ${typeof deserialized.age})`);
        });
    };

    const clearLogs = () => {
        setLogs([]);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">
                        🐛 年龄Bug专项测试
                    </h1>

                    <div className="mb-6">
                        <p className="text-gray-600 mb-4">
                            当前表单年龄: <span className="font-bold text-red-600 text-xl">{formData.age || '未设置'}</span>
                        </p>

                        <div className="flex flex-wrap gap-4 mb-6">
                            <Button onClick={simulateFormSubmit} variant="primary">
                                模拟表单提交
                            </Button>
                            <Button onClick={testParseInt} variant="secondary">
                                测试parseInt
                            </Button>
                            <Button onClick={testJSONSerialization} variant="secondary">
                                测试JSON序列化
                            </Button>
                            <Button onClick={clearLogs} variant="outline">
                                清空日志
                            </Button>
                        </div>
                    </div>

                    {/* 年龄输入 */}
                    <div className="mb-8 max-w-md">
                        <h3 className="text-lg font-semibold mb-4">年龄输入:</h3>
                        <AgeInput
                            value={formData.age}
                            onChange={handleAgeChange}
                            error={undefined}
                        />
                    </div>

                    {/* 测试步骤 */}
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <h3 className="text-red-800 font-semibold mb-2">🎯 重现Bug的步骤:</h3>
                        <ol className="text-red-700 text-sm space-y-1 list-decimal list-inside">
                            <li>在年龄输入框中输入 <strong>25</strong></li>
                            <li>点击其他地方让输入框失去焦点</li>
                            <li>观察"当前表单年龄"是否仍然是25</li>
                            <li>点击"模拟表单提交"按钮</li>
                            <li>检查日志中的年龄数据是否一致</li>
                        </ol>
                    </div>

                    {/* 日志显示 */}
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
                        <h3 className="text-white mb-2">调试日志:</h3>
                        {logs.length === 0 ? (
                            <p className="text-gray-500">暂无日志记录</p>
                        ) : (
                            logs.map((log, index) => (
                                <div key={index} className="mb-1">
                                    {log}
                                </div>
                            ))
                        )}
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
                            去问卷页面测试
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}