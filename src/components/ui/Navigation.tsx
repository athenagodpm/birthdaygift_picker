import React from 'react';
import Link from 'next/link';
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

interface NavigationProps {
    showBackButton?: boolean;
    backUrl?: string;
    backLabel?: string;
}

export default function Navigation({
    showBackButton = false,
    backUrl = '/',
    backLabel = '返回首页'
}: NavigationProps) {
    return (
        <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo/Brand */}
                    <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-gray-800 hover:text-pink-600 transition-colors">
                        <span className="text-2xl">🎁</span>
                        <span>生日礼物推荐</span>
                    </Link>

                    {/* Navigation Actions */}
                    <div className="flex items-center space-x-4">
                        {showBackButton && (
                            <Link
                                href={backUrl}
                                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeftIcon className="w-4 h-4" />
                                <span>{backLabel}</span>
                            </Link>
                        )}

                        <Link
                            href="/"
                            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <HomeIcon className="w-4 h-4" />
                            <span>首页</span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}