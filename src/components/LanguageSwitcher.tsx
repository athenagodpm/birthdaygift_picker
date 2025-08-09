'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, LanguageIcon } from '@heroicons/react/24/outline';
import { useTranslation, Language } from '@/hooks/useTranslation';
import { LANGUAGE_NAMES } from '@/utils/i18n';

interface LanguageSwitcherProps {
    className?: string;
}

export default function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
    const { language, setLanguage, t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // 点击外部关闭下拉菜单
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLanguageChange = async (newLanguage: Language) => {
        if (newLanguage !== language) {
            // 添加加载状态指示
            const button = document.querySelector('[aria-label="' + t('language.switch') + '"]') as HTMLButtonElement;
            if (button) {
                button.style.opacity = '0.7';
                button.style.pointerEvents = 'none';
            }

            try {
                await setLanguage(newLanguage);
            } finally {
                // 恢复按钮状态
                if (button) {
                    button.style.opacity = '1';
                    button.style.pointerEvents = 'auto';
                }
            }
        }
        setIsOpen(false);
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {/* 切换按钮 */}
            <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all duration-200 text-gray-700 hover:text-gray-900"
                aria-label={t('language.switch')}
            >
                <LanguageIcon className="w-4 h-4" />
                <span className="text-sm font-medium">
                    {LANGUAGE_NAMES[language]}
                </span>
                <ChevronDownIcon
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                        }`}
                />
            </button>

            {/* 下拉菜单 */}
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-32 bg-white/90 backdrop-blur-md border border-white/30 rounded-lg shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="py-1">
                        {Object.entries(LANGUAGE_NAMES).map(([langCode, langName]) => {
                            const lang = langCode as Language;
                            const isSelected = lang === language;

                            return (
                                <button
                                    key={lang}
                                    onClick={() => handleLanguageChange(lang)}
                                    className={`w-full text-left px-4 py-2 text-sm transition-all duration-200 transform hover:scale-105 ${isSelected
                                        ? 'bg-pink-50 text-pink-600 font-medium'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>{langName}</span>
                                        {isSelected && (
                                            <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}