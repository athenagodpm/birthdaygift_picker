'use client';

import { useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export default function LanguageHtmlUpdater() {
    const { language } = useTranslation();

    useEffect(() => {
        // 更新HTML lang属性
        const htmlElement = document.documentElement;
        const langMap = {
            zh: 'zh-CN',
            en: 'en-US'
        };

        htmlElement.lang = langMap[language];
        htmlElement.setAttribute('lang', langMap[language]);

        // 添加语言类名用于CSS选择器
        htmlElement.classList.remove('lang-zh', 'lang-en');
        htmlElement.classList.add(`lang-${language}`);

        // 添加切换动画类
        document.body.classList.add('switching');
        const timer = setTimeout(() => {
            document.body.classList.remove('switching');
        }, 300);

        return () => clearTimeout(timer);
    }, [language]);

    return null; // 这个组件不渲染任何内容
}