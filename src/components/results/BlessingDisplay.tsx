import React, { useState } from 'react';
import { ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';

interface BlessingDisplayProps {
    blessing: string;
}

export default function BlessingDisplay({ blessing }: BlessingDisplayProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(blessing);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('复制失败:', error);
        }
    };

    return (
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-8 text-center relative overflow-hidden">
            {/* 背景装饰 */}
            <div className="absolute top-4 left-4 text-4xl opacity-20">🎂</div>
            <div className="absolute top-4 right-4 text-4xl opacity-20">🎉</div>
            <div className="absolute bottom-4 left-4 text-4xl opacity-20">✨</div>
            <div className="absolute bottom-4 right-4 text-4xl opacity-20">🎁</div>

            {/* 标题 */}
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    专属生日祝福语 💝
                </h3>
                <p className="text-gray-600 text-sm">
                    为这份特别的礼物配上温馨的祝福
                </p>
            </div>

            {/* 祝福语内容 */}
            <div className="relative z-10 mb-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-yellow-100">
                    <p className="text-lg md:text-xl text-gray-800 leading-relaxed font-medium">
                        "{blessing}"
                    </p>
                </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex justify-center space-x-4">
                <button
                    onClick={handleCopy}
                    className={`
            flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200
            ${copied
                            ? 'bg-green-500 text-white'
                            : 'bg-yellow-500 hover:bg-yellow-600 text-white hover:shadow-md'
                        }
          `}
                >
                    {copied ? (
                        <>
                            <CheckIcon className="w-5 h-5" />
                            <span>已复制</span>
                        </>
                    ) : (
                        <>
                            <ClipboardDocumentIcon className="w-5 h-5" />
                            <span>复制祝福语</span>
                        </>
                    )}
                </button>
            </div>

            {/* 使用提示 */}
            <div className="mt-6 text-sm text-gray-500">
                <p>💌 你可以将这句祝福语写在贺卡上，或者发送给收礼人</p>
            </div>

            {/* 装饰性边框 */}
            <div className="absolute inset-0 rounded-2xl border-4 border-transparent bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 opacity-20 -z-10"></div>
        </div>
    );
}