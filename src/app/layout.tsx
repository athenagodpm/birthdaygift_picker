import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "生日礼物送什么？- AI智能礼物推荐",
  description: "通过AI智能分析，为你推荐最贴心的生日礼物。解决送礼焦虑，让每一份礼物都充满心意。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased language-transition`}
      >
        <LanguageProvider>
          {/* 语言切换器 - 固定在右上角 */}
          <div className="fixed top-3 right-3 md:top-4 md:right-4 z-50">
            <LanguageSwitcher />
          </div>
          <div className="text-adaptive">
            {children}
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
