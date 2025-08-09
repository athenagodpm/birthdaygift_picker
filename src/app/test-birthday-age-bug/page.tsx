'use client';

import React, { useState } from 'react';
import AgeInput from '@/components/forms/AgeInput';
import BirthdayDatePicker from '@/components/forms/BirthdayDatePicker';
import Button from '@/components/ui/Button';

export default function TestBirthdayAgeBugPage() {
    const [formData, setFormData] = useState({
        age: undefined as number | undefined,
        birthdayDate: '' as string
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

    const handleBirthdayChange = (newBirthday: string) => {
        addLog(`📅 生日日期变更: "${formData.birthdayDate}" -> "${newBirthday}"`);
        setFormData(prev => ({ ...prev, birthdayDate: newBirthday }));

        // 检查年龄是否意外改变
        setTimeout(() => {
            if (formData.age !== undefined) {
                addLog(`🔍 生日变更后年龄检查: ${formData.age}`);
            }
        }, 100);
    };

    const simulateFormUpdate = (field: string, value: any) => {
        addLog(`📝 模拟表单更新: ${field} = ${JSON.stringify(value)}`);

        // 模拟updateFormData函数的行为
        const newData = { ...formData, [field]: value };
        addLog(`📦 新的表单数据: ${JSON.stringify(newData)}`);

        // 检查是否有意外的字段变化
        Object.keys(newData).forEach(key => {
            if (key !== field && newData[key as keyof typeof newData] !== formData[key as keyof typeof formData]) {
                addLog(`⚠️ 意外的字段变化: ${key} 从 ${formData[key as keyof typeof formData]} 变为 ${newData[key as keyof typeof newData]}`);
            }
        });

        setFormData(newData);
    };

    const testSequence = () => {
        addLog('🧪 开始测试序列...');

        // 步骤1: 设置年龄为81
        setTimeout(() => {
            addLog('步骤1: 设置年龄为81');
            simulateFormUpdate('age', 81);
        }, 500);

        // 步骤2: 选择月份
        setTimeout(() => {
            addLog('步骤2: 选择月份为03');
            simulateFormUpdate('birthdayDate', '03-');
        }, 1500);

        // 步骤3: 选择日期
        setTimeout(() => {
            addLog('步骤3: 选择日期为15');
            simulateFormUpdate('birthdayDate', '03-15');
        }, 2500);
    };

    const clearLogs = () => {
        setLogs([]);
    };

    const resetForm = () => {
        setFormData({ age: undefined, birthdayDate: '' });
        addLog('🔄 表单已重置');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">
                        🐛 生日日期影响年龄Bug测试
                    </h1>

                    <div className="mb-6">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <strong>当前年龄:</strong>
                                <span className="font-bold text-red-600 text-xl ml-2">
                                    {formData.age || '未设置'}
                                </span>
                            </div>
                            <div>
                                <strong>生日日期:</strong>
                                <span className="font-bold text-blue-600 text-xl ml-2">
                                    {formData.birthdayDate || '未设置'}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 mb-6">
                            <Button onClick={testSequence} variant="primary">
                                自动测试序列
                            </Button>
                            <Button onClick={resetForm} variant="secondary">
                                重置表单
                            </Button>
                            <Button onClick={clearLogs} variant="outline">
                                清空日志
                            </Button>
                        </div>
                    </div>

                    {/* 表单组件 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        {/* 年龄输入 */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">年龄输入:</h3>
                            <AgeInput
                                value={formData.age}
                                onChange={handleAgeChange}
                                error={undefined}
                            />
                        </div>

                        {/* 生日日期选择 */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">生日日期:</h3>
                            <BirthdayDatePicker
                                value={formData.birthdayDate}
                                onChange={handleBirthdayChange}
                                error={undefined}
                            />
                        </div>
                    </div>

                    {/* 重现步骤 */}
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <h3 className="text-red-800 font-semibold mb-2">🎯 重现Bug的步骤:</h3>
                        <ol className="text-red-700 text-sm space-y-1 list-decimal list-inside">
                            <li>在年龄输入框中输入 <strong>81</strong></li>
                            <li>在生日日期中选择任意月份（如3月）</li>
                            <li>观察年龄是否从81变成79</li>
                            <li>或者点击"自动测试序列"按钮自动执行</li>
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
                            去问卷页面验证
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}