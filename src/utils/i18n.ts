import { Language } from '@/contexts/LanguageContext';

// 翻译文件类型定义
export interface TranslationFile {
    common: {
        loading: string;
        error: string;
        submit: string;
        cancel: string;
        save: string;
        delete: string;
        edit: string;
        confirm: string;
        back: string;
        next: string;
    };
    home: {
        title: string;
        subtitle: string;
        cta: string;
        footer: string;
        features: {
            questionnaire: {
                title: string;
                description: string;
            };
            analysis: {
                title: string;
                description: string;
            };
            recommendation: {
                title: string;
                description: string;
            };
        };
        description: string;
    };
    questionnaire: {
        title: string;
        age: {
            label: string;
            placeholder: string;
        };
        interests: {
            label: string;
            placeholder: string;
        };
        mbti: {
            label: string;
            types: Record<string, string>;
        };
        budget: {
            label: string;
            low: string;
            medium: string;
            high: string;
        };
        pastGifts: {
            label: string;
            placeholder: string;
        };
        birthday: {
            label: string;
        };
        submit: string;
    };
    results: {
        title: string;
        blessing: string;
        recommendations: string;
        share: string;
        backToHome: string;
        newRecommendation: string;
    };
    language: {
        switch: string;
        chinese: string;
        english: string;
    };
}

// 语言显示名称映射
export const LANGUAGE_NAMES: Record<Language, string> = {
    zh: '中文',
    en: 'English'
};

// 语言代码映射
export const LANGUAGE_CODES: Record<Language, string> = {
    zh: 'zh-CN',
    en: 'en-US'
};

// 检测浏览器语言
export function detectBrowserLanguage(): Language {
    if (typeof window === 'undefined') {
        return 'zh';
    }

    const browserLang = navigator.language.toLowerCase();

    if (browserLang.startsWith('en')) {
        return 'en';
    }

    // 默认返回中文
    return 'zh';
}

// 验证语言代码
export function isValidLanguage(lang: string): lang is Language {
    return lang === 'zh' || lang === 'en';
}

// 格式化日期（根据语言）
export function formatDate(date: Date, language: Language): string {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    return date.toLocaleDateString(LANGUAGE_CODES[language], options);
}

// 格式化数字（根据语言）
export function formatNumber(num: number, language: Language): string {
    return num.toLocaleString(LANGUAGE_CODES[language]);
}

// 格式化货币（根据语言）
export function formatCurrency(amount: number, language: Language): string {
    const currency = language === 'zh' ? 'CNY' : 'USD';
    const locale = LANGUAGE_CODES[language];

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
    }).format(amount);
}