'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import Button from '@/components/ui/Button';

export default function TestI18nPage() {
    const { t, language, setLanguage } = useTranslation();
    const [testResults, setTestResults] = useState<string[]>([]);

    const addResult = (result: string) => {
        setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
    };

    const testTranslations = () => {
        const testKeys = [
            'home.title',
            'questionnaire.title',
            'results.title',
            'common.loading',
            'questionnaire.gender.label',
            'questionnaire.age.hints.child',
            'questionnaire.mbti.types.INTJ',
            'results.blessing.title'
        ];

        addResult(`Testing translations for language: ${language}`);

        testKeys.forEach(key => {
            const translation = t(key);
            const status = translation === key ? '❌ MISSING' : '✅ OK';
            addResult(`${key}: ${status} - "${translation}"`);
        });
    };

    const testParameterInterpolation = () => {
        addResult('Testing parameter interpolation...');

        const testCases = [
            { key: 'results.forAge', params: { age: '25', gender: 'male' } as Record<string, string> },
            { key: 'results.recommendationSubtitle', params: { count: '3' } as Record<string, string> }
        ];

        testCases.forEach(({ key, params }) => {
            const result = t(key, params);
            addResult(`${key} with params ${JSON.stringify(params)}: "${result}"`);
        });
    };

    const testLanguageSwitching = async () => {
        addResult('Testing language switching...');

        const originalLang = language;
        const targetLang = language === 'zh' ? 'en' : 'zh';

        try {
            await setLanguage(targetLang);
            addResult(`✅ Switched to ${targetLang}`);

            // Test a translation in the new language
            const testTranslation = t('home.title');
            addResult(`Sample translation in ${targetLang}: "${testTranslation}"`);

            // Switch back
            setTimeout(async () => {
                await setLanguage(originalLang);
                addResult(`✅ Switched back to ${originalLang}`);
            }, 1000);
        } catch (error) {
            addResult(`❌ Language switching failed: ${error}`);
        }
    };

    const testErrorHandling = () => {
        addResult('Testing error handling...');

        // Test invalid keys
        const invalidKeys = [
            'nonexistent.key',
            'home.nonexistent',
            '',
            'a.b.c.d.e.f.g'
        ];

        invalidKeys.forEach(key => {
            const result = t(key);
            addResult(`Invalid key "${key}": "${result}"`);
        });
    };

    const clearResults = () => {
        setTestResults([]);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">
                        🌐 Internationalization Test Page
                    </h1>

                    <div className="mb-6">
                        <p className="text-gray-600 mb-4">
                            Current Language: <span className="font-semibold text-blue-600">{language}</span>
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Button onClick={testTranslations} variant="primary">
                                Test Basic Translations
                            </Button>
                            <Button onClick={testParameterInterpolation} variant="secondary">
                                Test Parameter Interpolation
                            </Button>
                            <Button onClick={testLanguageSwitching} variant="outline">
                                Test Language Switching
                            </Button>
                            <Button onClick={testErrorHandling} variant="outline">
                                Test Error Handling
                            </Button>
                            <Button onClick={clearResults} variant="outline">
                                Clear Results
                            </Button>
                        </div>
                    </div>

                    {/* Sample Translations Display */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-semibold mb-3">Sample Translations:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <strong>Home Title:</strong> {t('home.title')}
                            </div>
                            <div>
                                <strong>Questionnaire Title:</strong> {t('questionnaire.title')}
                            </div>
                            <div>
                                <strong>Loading Text:</strong> {t('common.loading')}
                            </div>
                            <div>
                                <strong>Gender Label:</strong> {t('questionnaire.gender.label')}
                            </div>
                            <div>
                                <strong>Age Hint:</strong> {t('questionnaire.age.hints.child')}
                            </div>
                            <div>
                                <strong>MBTI Type:</strong> {t('questionnaire.mbti.types.INTJ')}
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

                    {/* Debug Info */}
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Debug Info:</h3>
                        <p className="text-sm text-gray-600">
                            Open browser console and run <code className="bg-gray-200 px-1 rounded">debugTranslations()</code> for detailed translation debug info.
                        </p>
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