import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // 在生产环境中保护调试和测试页面
    if (process.env.NODE_ENV === 'production') {
        const protectedPaths = [
            '/test',
            '/test-age-bug',
            '/test-age-input',
            '/test-birthday-age-bug',
            '/test-doubao',
            '/test-i18n',
            '/test-validation',
            '/debug-data-flow'
        ]

        // 检查是否访问受保护的路径
        if (protectedPaths.some(path => pathname.startsWith(path))) {
            // 重定向到首页
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    // API路由的基本保护（可选）
    if (pathname.startsWith('/api/')) {
        // 这里可以添加API限制逻辑
        // 例如：速率限制、IP白名单等

        // 添加CORS头
        const response = NextResponse.next()
        response.headers.set('Access-Control-Allow-Origin', '*')
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

        return response
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}