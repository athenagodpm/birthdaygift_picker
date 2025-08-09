# 🚀 生日礼物推荐应用 - 部署指南

## ✅ 安全状况确认

你的API KEY配置是**完全安全**的：
- ✅ API KEY只在服务端使用，永远不会暴露给用户
- ✅ 使用环境变量存储，不会被打包到前端代码
- ✅ .env.local文件已在.gitignore中，不会被提交到Git
- ✅ 代码中没有硬编码的API KEY

## 🌐 推荐部署方案：Vercel

Vercel是最适合Next.js应用的部署平台，免费且简单。

### 步骤1：准备部署

```bash
# 1. 确保项目可以正常构建
npm run build

# 2. 运行安全检查
npm run check-env
```

### 步骤2：部署到Vercel

#### 方法A：通过Vercel网站（推荐）

1. 访问 [vercel.com](https://vercel.com)
2. 使用GitHub账号登录
3. 点击 "New Project"
4. 导入你的GitHub仓库
5. Vercel会自动检测到Next.js项目

#### 方法B：使用Vercel CLI

```bash
# 安装Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

### 步骤3：设置环境变量

在Vercel项目设置中添加以下环境变量：

```
ARK_API_KEY=13d34bf3-0577-46db-9acd-182a9e42cfb7
DOUBAO_MODEL_NAME=doubao-seed-1-6-flash-250715
NODE_ENV=production
```

**重要**：不要设置 `NEXT_PUBLIC_APP_URL`，Vercel会自动提供域名。

### 步骤4：验证部署

部署完成后：
1. 访问Vercel提供的域名
2. 测试礼物推荐功能
3. 检查API调用是否正常

## 🔧 其他部署选项

### Netlify
1. 连接GitHub仓库
2. 构建命令：`npm run build`
3. 发布目录：`.next`
4. 在环境变量中设置API KEY

### Railway
1. 连接GitHub仓库
2. 在Variables中添加环境变量
3. Railway会自动部署

## 🛡️ 部署后安全建议

### 1. 监控API使用
- 定期检查豆包API的使用量
- 设置使用限制和警报

### 2. 域名和HTTPS
- Vercel自动提供HTTPS
- 可以绑定自定义域名

### 3. 性能监控
- 使用Vercel Analytics监控访问情况
- 关注API响应时间

## 🆘 常见问题

### Q: API KEY会被用户看到吗？
A: 不会！API KEY只在服务端使用，用户永远看不到。

### Q: 如果API KEY泄露怎么办？
A: 立即在豆包控制台重新生成API KEY，然后更新Vercel环境变量。

### Q: 部署失败怎么办？
A: 检查构建日志，通常是环境变量未设置或代码错误。

## 📞 支持

如果遇到问题：
1. 运行 `npm run check-env` 检查配置
2. 查看Vercel部署日志
3. 确认API KEY是否有效

---

🎉 **你的应用已经可以安全部署了！API KEY完全受保护，可以放心上线。**