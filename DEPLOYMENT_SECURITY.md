# 🔒 安全部署指南

## API KEY 安全性分析

### ✅ 当前安全状况

**好消息！你的API KEY是安全的！** 🎉

1. **服务端使用**: API KEY只在服务端的API路由中使用（`/api/*`）
2. **环境变量保护**: API KEY存储在`.env.local`文件中，不会被打包到客户端
3. **Next.js保护**: Next.js确保只有服务端代码能访问不以`NEXT_PUBLIC_`开头的环境变量

### 🔍 安全验证

我们的代码中：
- ✅ API KEY只在服务端使用（`src/services/fastDoubaoService.ts`）
- ✅ 没有在客户端组件中暴露API KEY
- ✅ 使用了正确的环境变量命名（不是`NEXT_PUBLIC_`开头）
- ✅ API调用都通过内部API路由（`/api/fast-doubao`）

## 🚀 部署平台推荐

### 1. Vercel（推荐）⭐

**优势**：
- 专为Next.js优化
- 自动HTTPS
- 全球CDN
- 简单的环境变量管理

**部署步骤**：
```bash
# 1. 安装Vercel CLI
npm i -g vercel

# 2. 登录Vercel
vercel login

# 3. 部署项目
vercel

# 4. 在Vercel Dashboard中设置环境变量
```

**环境变量设置**：
- 登录 [vercel.com](https://vercel.com)
- 进入项目设置 → Environment Variables
- 添加：
  - `ARK_API_KEY`: `13d34bf3-0577-46db-9acd-182a9e42cfb7`
  - `DOUBAO_MODEL_NAME`: `doubao-seed-1-6-flash-250715`
  - `NODE_ENV`: `production`

### 2. Netlify

**部署步骤**：
```bash
# 1. 构建项目
npm run build
npm run export

# 2. 上传dist文件夹到Netlify
```

### 3. Railway

**优势**：
- 支持数据库
- 简单的环境变量管理
- 自动部署

## 🛡️ 安全最佳实践

### 1. 环境变量安全

```bash
# ✅ 正确的环境变量命名
ARK_API_KEY=your_secret_key
DOUBAO_MODEL_NAME=your_model

# ❌ 错误的命名（会暴露到客户端）
NEXT_PUBLIC_ARK_API_KEY=your_secret_key
```

### 2. 添加API限制

在部署前，建议添加API使用限制：

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 添加速率限制
  const ip = request.ip ?? '127.0.0.1'
  
  // 这里可以添加IP限制、速率限制等
  
  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
```

### 3. 移除调试页面

在生产环境中，建议移除或保护调试页面：

```typescript
// 在生产环境中隐藏调试页面
if (process.env.NODE_ENV === 'production') {
  // 重定向到首页或返回404
}
```

## 📋 部署前检查清单

### 必须完成 ✅

- [ ] 确认`.env.local`不会被提交到Git
- [ ] 在部署平台设置环境变量
- [ ] 测试生产环境构建：`npm run build`
- [ ] 验证API KEY不会出现在客户端代码中

### 建议完成 📝

- [ ] 添加API速率限制
- [ ] 移除或保护调试页面
- [ ] 添加错误监控（如Sentry）
- [ ] 设置自定义域名
- [ ] 配置HTTPS（大多数平台自动提供）

## 🔧 部署配置文件

### vercel.json
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

### netlify.toml
```toml
[build]
  command = "npm run build"
  publish = "out"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

## 🚨 安全警告

### 绝对不要做的事情：

1. **❌ 不要在客户端代码中使用API KEY**
```typescript
// 错误示例
const apiKey = process.env.NEXT_PUBLIC_ARK_API_KEY // 会暴露到客户端！
```

2. **❌ 不要将.env.local提交到Git**
```bash
# 确保.gitignore包含
.env.local
.env*.local
```

3. **❌ 不要在前端组件中直接调用外部API**
```typescript
// 错误示例
const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
  headers: { 'Authorization': `Bearer ${apiKey}` } // 暴露API KEY！
})
```

## ✅ 正确的架构

```
用户浏览器 → Next.js前端 → Next.js API路由 → 豆包API
                                ↑
                            API KEY在这里使用
                            （服务端，安全）
```

## 🎯 总结

你的项目架构是安全的！API KEY只在服务端使用，不会暴露给客户端。你可以放心地部署到任何支持Next.js的平台。

推荐使用Vercel进行部署，它为Next.js提供了最佳的支持和安全性。

记住：**永远不要在客户端代码中使用API KEY！** 🔒