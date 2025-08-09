'use client';

import React, { useState } from 'react';
import AgeInput from '@/components/forms/AgeInput';
import Button from '@/components/ui/Button';

export default function TestAgeInputPage() {
    const [age, setAge] = useState<number | undefined>(undefined);
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (message: string) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev, `${timestamp}: ${message}`]);
    };

    const handleAgeChange = (newAge: number | undefined) => {
        addLog(`年龄变更: ${age} -> ${newAge}`);
        setAge(newAge);
    };

    const clearLogs = () => {
        setLogs([]);
    };

    const setTestAge = (testAge: number) => {
        addLog(`手动设置年龄为: ${testAge}`);
        setAge(testAge);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">
                        🧪 年龄输入组件测试
                    </h1>

                    <div className="mb-6">
                        <p className="text-gray-600 mb-4">
                            当前年龄值: <span className="font-semibold text-blue-600">{age || '未设置'}</span>
                        </p>

                        <div className="flex flex-wrap gap-4 mb-6">
                            <Button onClick={() => setTestAge(25)} variant="secondary">
                                设置为25岁
                            </Button>
                            <Button onClick={() => setTestAge(150)} variant="secondary">
                                设置为150岁 (超出范围)
                            </Button>
                            <Button onClick={() => setTestAge(-5)} variant="secondary">
                                设置为-5岁 (超出范围)
                            </Button>
                            <Button onClick={() => setAge(undefined)} variant="outline">
                                清空年龄
                            </Button>
                            <Button onClick={clearLogs} variant="outline">
                                清空日志
                            </Button>
                        </div>
                    </div>

                    {/* 年龄输入组件 */}
                    <div className="mb-8 max-w-md">
                        <h3 className="text-lg font-semibold mb-4">年龄输入测试:</h3>
                        <AgeInput
                            value={age}
                            onChange={handleAgeChange}
                            error={undefined}
                        />
                    </div>

                    {/* 测试说明 */}
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">测试步骤:</h3>
                        <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                            <li>在输入框中输入一个年龄值（如25）</li>
                            <li>点击输入框外的其他地方（失去焦点）</li>
                            <li>观察年龄值是否意外改变 - <strong>应该保持不变</strong></li>
                            <li>尝试输入超出范围的值（如150或-5）</li>
                            <li>检查是否正确修正到有效范围内（150→120，-5→1）</li>
                            <li>输入正常值后再次失去焦点，确认不会被修改</li>
                        </ol>
                    </div>

                    {/* 当前问题说明 */}
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <h3 className="text-red-800 font-semibold mb-2">🐛 已修复的问题:</h3>
                        <p className="text-red-700 text-sm">
                            之前的版本中，用户输入年龄后点击其他地方会导致年龄值意外改变。
                            现在已经修复了这个问题，年龄值只有在真正需要修正时才会改变。
                        </p>
                    </div>

                    {/* 变更日志 */}
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
                        <h3 className="text-white mb-2">变更日志:</h3>
                        {logs.length === 0 ? (
                            <p className="text-gray-500">暂无变更记录</p>
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
                            去问卷页面
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}