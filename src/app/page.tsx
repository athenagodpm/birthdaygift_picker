'use client';

import {
  DocumentTextIcon,
  CpuChipIcon,
  SparklesIcon,
  GiftIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from '@/hooks/useTranslation';

export default function Home() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative overflow-hidden flex items-center justify-center p-4">
      {/* 装饰性圆圈 */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-pink-200/30 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-200/30 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-10 w-24 h-24 bg-blue-200/30 rounded-full blur-xl"></div>
      <div className="absolute top-32 right-32 w-28 h-28 bg-indigo-200/25 rounded-full blur-xl"></div>
      <div className="absolute bottom-32 left-32 w-36 h-36 bg-rose-200/25 rounded-full blur-xl"></div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Hero Section */}
        <div>
          <div className="mb-4">
            <GiftIcon className="w-16 h-16 mx-auto mb-4 text-pink-500" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent leading-tight">
              {t('home.title')}
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-600 mb-4 leading-relaxed">
            {t('home.subtitle')}
          </p>

          {/* CTA Button - 更突出 */}
          <a
            href="/questionnaire"
            className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white px-12 py-5 rounded-full text-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl mb-8"
          >
            {t('home.cta')}
          </a>
        </div>

        {/* Features Section - 弱化 */}
        <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-6 mb-12 shadow-lg">
          <div className="grid grid-cols-3 gap-6 mb-4">
            <div className="text-center">
              <DocumentTextIcon className="w-8 h-8 mx-auto mb-2 text-pink-500" />
              <h3 className="text-sm font-medium text-gray-700 mb-1">{t('home.features.questionnaire.title')}</h3>
              <p className="text-xs text-gray-500">{t('home.features.questionnaire.description')}</p>
            </div>
            <div className="text-center">
              <CpuChipIcon className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <h3 className="text-sm font-medium text-gray-700 mb-1">{t('home.features.analysis.title')}</h3>
              <p className="text-xs text-gray-500">{t('home.features.analysis.description')}</p>
            </div>
            <div className="text-center">
              <SparklesIcon className="w-8 h-8 mx-auto mb-2 text-pink-500" />
              <h3 className="text-sm font-medium text-gray-700 mb-1">{t('home.features.recommendation.title')}</h3>
              <p className="text-xs text-gray-500">{t('home.features.recommendation.description')}</p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm text-gray-600 leading-relaxed">
              {t('home.description')}
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-gray-400 text-xs">
          {t('home.footer')}
        </p>
      </div>
    </div>
  );
}