import { useLanguage } from '@/contexts/LanguageContext';

// 重新导出useTranslation，保持API一致性
export function useTranslation() {
    return useLanguage();
}

// 导出类型
export type { Language } from '@/contexts/LanguageContext';