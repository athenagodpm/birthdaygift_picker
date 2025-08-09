'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import LanguageHtmlUpdater from '@/components/LanguageHtmlUpdater';

// 语言类型定义
export type Language = 'zh' | 'en';

// Context类型定义
interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string, params?: Record<string, string>) => string;
}

// 语言偏好存储接口
interface LanguagePreference {
    language: Language;
    timestamp: number;
}

// 创建Context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 本地存储键名
const LANGUAGE_STORAGE_KEY = 'birthday-gift-language';

// 翻译数据存储
const translations: Record<Language, Record<string, unknown>> = {
    zh: {},
    en: {}
};

// 翻译缓存，提升性能
const translationCache = new Map<string, string>();

// 加载翻译文件的函数
const loadTranslations = async (language: Language): Promise<boolean> => {
    try {
        const response = await fetch(`/locales/${language}.json`);
        if (response.ok) {
            const data = await response.json();
            translations[language] = data;
            console.log(`✅ Loaded translations for ${language}`);
            return true;
        } else {
            console.warn(`❌ Failed to load translations for ${language}: HTTP ${response.status}`);
            return false;
        }
    } catch (error) {
        console.error(`❌ Error loading translations for ${language}:`, error);
        return false;
    }
};

// Provider组件Props
interface LanguageProviderProps {
    children: ReactNode;
}

// Provider组件
export function LanguageProvider({ children }: LanguageProviderProps) {
    const [language, setLanguageState] = useState<Language>('zh');
    const [isInitialized, setIsInitialized] = useState(false);

    // 初始化语言设置
    useEffect(() => {
        const initializeLanguage = async () => {
            let initialLanguage: Language = 'zh';

            try {
                // 尝试从localStorage读取语言偏好
                const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
                if (stored) {
                    try {
                        const preference: LanguagePreference = JSON.parse(stored);
                        // 验证存储的语言是否有效
                        if (preference.language === 'zh' || preference.language === 'en') {
                            initialLanguage = preference.language;
                        } else {
                            console.warn('Invalid language preference in storage, using default');
                            localStorage.removeItem(LANGUAGE_STORAGE_KEY);
                        }
                    } catch (parseError) {
                        console.warn('Failed to parse language preference, clearing storage:', parseError);
                        localStorage.removeItem(LANGUAGE_STORAGE_KEY);
                    }
                } else {
                    // 检测浏览器语言
                    const browserLang = navigator.language.toLowerCase();
                    if (browserLang.startsWith('en')) {
                        initialLanguage = 'en';
                    }
                }
            } catch (error) {
                console.warn('Failed to access localStorage, using default language:', error);
            }

            // 加载翻译文件，确保至少加载中文作为回退
            const loadSuccess = await loadTranslations(initialLanguage);

            // 如果初始语言加载失败，回退到中文
            if (!loadSuccess && initialLanguage !== 'zh') {
                console.warn(`Failed to load ${initialLanguage}, falling back to Chinese`);
                initialLanguage = 'zh';
                await loadTranslations('zh');
            }

            // 预加载另一种语言以提升用户体验
            const otherLanguage: Language = initialLanguage === 'zh' ? 'en' : 'zh';
            loadTranslations(otherLanguage).catch(error => {
                console.warn(`Failed to preload ${otherLanguage} translations:`, error);
            });

            setLanguageState(initialLanguage);
            setIsInitialized(true);
        };

        initializeLanguage();
    }, []);

    // 设置语言的函数
    const setLanguage = async (lang: Language) => {
        try {
            // 验证语言参数
            if (lang !== 'zh' && lang !== 'en') {
                console.error('Invalid language:', lang);
                return;
            }

            // 如果翻译文件尚未加载，先加载
            if (!translations[lang] || Object.keys(translations[lang]).length === 0) {
                const loadSuccess = await loadTranslations(lang);
                if (!loadSuccess) {
                    console.error(`Failed to load translations for ${lang}, keeping current language`);
                    return;
                }
            }

            // 保存到localStorage
            try {
                const preference: LanguagePreference = {
                    language: lang,
                    timestamp: Date.now()
                };
                localStorage.setItem(LANGUAGE_STORAGE_KEY, JSON.stringify(preference));
            } catch (storageError) {
                console.warn('Failed to save language preference to localStorage:', storageError);
                // 继续执行，不阻止语言切换
            }

            // 清理旧语言的缓存
            const oldCacheKeys = Array.from(translationCache.keys()).filter(key => key.startsWith(`${language}:`));
            oldCacheKeys.forEach(key => translationCache.delete(key));

            // 更新状态
            setLanguageState(lang);
            console.log(`✅ Language switched to ${lang}`);
        } catch (error) {
            console.error('Failed to set language:', error);
        }
    };

    // 翻译函数
    const t = (key: string, params?: Record<string, string>): string => {
        try {
            // 验证输入
            if (!key || typeof key !== 'string') {
                console.warn('Invalid translation key:', key);
                return String(key || '');
            }

            // 检查缓存（仅对无参数的翻译使用缓存）
            const cacheKey = `${language}:${key}`;
            if (!params && translationCache.has(cacheKey)) {
                return translationCache.get(cacheKey)!;
            }

            // 按点分割键名，支持嵌套对象
            const keys = key.split('.');
            let value: unknown = translations[language];

            // 检查当前语言的翻译是否存在
            if (!value || Object.keys(value).length === 0) {
                console.warn(`No translations loaded for language: ${language}`);
                // 尝试使用中文作为回退
                value = translations.zh;
            }

            for (const k of keys) {
                if (value && typeof value === 'object' && k in value) {
                    value = (value as Record<string, unknown>)[k];
                } else {
                    // 翻译缺失，尝试回退到中文
                    if (language !== 'zh' && translations.zh) {
                        let fallbackValue: unknown = translations.zh;
                        for (const fallbackKey of keys) {
                            if (fallbackValue && typeof fallbackValue === 'object' && fallbackKey in fallbackValue) {
                                fallbackValue = (fallbackValue as Record<string, unknown>)[fallbackKey];
                            } else {
                                fallbackValue = null;
                                break;
                            }
                        }
                        if (fallbackValue && typeof fallbackValue === 'string') {
                            // 开发模式下警告回退使用
                            if (process.env.NODE_ENV === 'development') {
                                console.warn(`Using fallback translation for key: ${key} (${language} -> zh)`);
                            }
                            value = fallbackValue;
                            break;
                        }
                    }

                    // 开发模式下警告翻译缺失
                    if (process.env.NODE_ENV === 'development') {
                        console.warn(`Translation missing for key: ${key} in language: ${language}`);
                    }

                    // 返回友好的回退文本
                    return key.split('.').pop() || key;
                }
            }

            if (typeof value === 'string') {
                // 处理参数插值
                if (params) {
                    try {
                        const result = value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
                            return params[paramKey] !== undefined ? String(params[paramKey]) : match;
                        });
                        return result;
                    } catch (interpolationError) {
                        console.warn('Parameter interpolation error:', interpolationError);
                        return value; // 返回未插值的原始字符串
                    }
                } else {
                    // 缓存无参数的翻译结果
                    translationCache.set(cacheKey, value);
                }
                return value;
            }

            // 如果值不是字符串，返回键名的最后一部分
            return key.split('.').pop() || key;
        } catch (error) {
            console.error('Translation error for key:', key, error);
            return key.split('.').pop() || key;
        }
    };

    // 开发模式调试功能
    const debugTranslations = () => {
        if (process.env.NODE_ENV === 'development') {
            console.group('🌐 Translation Debug Info');
            console.log('Current language:', language);
            console.log('Available languages:', Object.keys(translations));
            console.log('Current translations keys:', Object.keys(translations[language] || {}));
            console.log('Fallback translations keys:', Object.keys(translations.zh || {}));
            console.groupEnd();
        }
    };

    // 在初始化完成前显示加载状态
    if (!isInitialized) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontSize: '16px',
                color: '#666'
            }}>
                Loading translations...
            </div>
        );
    }

    const contextValue: LanguageContextType = {
        language,
        setLanguage,
        t
    };

    // 开发模式下暴露调试功能到全局
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
        (window as unknown as Record<string, unknown>).debugTranslations = debugTranslations;
    }

    return (
        <LanguageContext.Provider value={contextValue}>
            <LanguageHtmlUpdater />
            {children}
        </LanguageContext.Provider>
    );
}

// 自定义Hook
export function useLanguage(): LanguageContextType {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}

// 便捷的翻译Hook
export function useTranslation() {
    const { t, language, setLanguage } = useLanguage();
    return { t, language, setLanguage };
}