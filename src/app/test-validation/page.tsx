'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { validateSingleFieldI18n } from '@/utils/validation';
import Button from '@/components/ui/Button';

export default function TestValidationPage() {
    const { t, language, setLanguage } = useTranslation();
    const [testResults, setTestResults] = useState<string[]>([]);

    const addResult = (result: string) => {
        setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
    };

    const testValidation = () => {
        addResult(`Testing validation in language: ${language}`);

        // 测试必填字段
        const requiredError = validateSingleFieldI18n('gender', '', t);
        addResult(`Required field test: ${requiredError || 'No error'}`);

        // 测试数字范围
        const maxValueError = validateSingleFieldI18n('age', 150, t);
        addResult(`Max value test (age=150): ${maxValueError || 'No error'}`);

        const minValueError = validateSingleFieldI18n('age', -5, t);
        addResult(`Min value test (age=-5): ${minValueError || 'No error'}`);

        // 测试数组长度
        const minLengthError = validateSingleFieldI18n('interests', [], t);
        addResult(`Min length test (empty interests): ${minLengthError || 'No error'}`);

        const maxLengthError = validateSingleFieldI18n('interests', new Array(15).fill('test'), t);
        addResult(`Max length test (15 interests): ${maxLengthError || 'No error'}`);
    };

    const switchLanguageAndTest = async () => {
        const newLang = language === 'zh' ? 'en' : 'zh';
        addResult(`Switching to ${newLang}...`);
        await setLanguage(newLang);

        setTimeout(() => {
            testValidation();
        }, 500);
    };

    const clearResults = () => {
        setTestResults([]);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">
                        🔍 Validation Test Page
                    </h1>

                    <div className="mb-6">
                        <p className="text-gray-600 mb-4">
                            Current Language: <span className="font-semibold text-blue-600">{language}</span>
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Button onClick={testValidation} variant="primary">
                                Test Current Language Validation
                            </Button>
                            <Button onClick={switchLanguageAndTest} variant="secondary">
                                Switch Language & Test
                            </Button>
                            <Button onClick={clearResults} variant="outline">
                                Clear Results
                            </Button>
                        </div>
                    </div>

                    {/* Sample Validation Messages */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-semibold mb-3">Sample Validation Messages:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <strong>Required:</strong> {t('validation.required')}
                            </div>
                            <div>
                                <strong>Max Value:</strong> {t('validation.maxValue', { max: '120' })}
                            </div>
                            <div>
                                <strong>Min Value:</strong> {t('validation.minValue', { min: '1' })}
                            </div>
                            <div>
                                <strong>Max Length:</strong> {t('validation.maxLength', { max: '10' })}
                            </div>
                            <div>
                                <strong>Min Length:</strong> {t('validation.minLength', { min: '1' })}
                            </div>
                            <div>
                                <strong>Invalid Format:</strong> {t('validation.invalidFormat')}
                            </div>
                        </div>
                    </div>

                    {/* Test Results */}
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
                        <h3 className="text-white mb-2">Test Results:</h3>
                        {testResults.length === 0 ? (
                            <p className="text-gray-500">No tests run yet. Click a test button above.</p>
                        ) : (
                            testResults.map((result, index) => (
                                <div key={index} className="mb-1">
                                    {result}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Navigation */}
                    <div className="mt-8 flex gap-4">
                        <button onClick={() => window.location.href = '/'} className="text-blue-600 hover:text-blue-800 underline">
                            ← Back to Home
                        </button>
                        <button onClick={() => window.location.href = '/questionnaire'} className="text-blue-600 hover:text-blue-800 underline">
                            Go to Questionnaire
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}