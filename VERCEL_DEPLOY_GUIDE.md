# 🚀 Vercel 部署详细指南

## ✅ 部署前确认

你的项目已经准备好部署了：
- ✅ 构建成功
- ✅ API KEY 安全配置
- ✅ 环境变量正确设置
- ✅ .env.local 已在 .gitignore 中

## 📋 部署步骤

### 第一步：访问 Vercel 网站

1. 打开浏览器，访问：https://vercel.com
2. 点击右上角的 **"Sign Up"** 或 **"Login"**

### 第二步：使用 GitHub 账号登录

1. 选择 **"Continue with GitHub"**
2. 如果没有 GitHub 账号，先注册一个
3. 授权 Vercel 访问你的 GitHub 账号

### 第三步：确保代码已推送到 GitHub

在你的项目目录运行：
```bash
# 如果还没有 Git 仓库，初始化一个
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "Ready for Vercel deployment"

# 如果还没有远程仓库，创建一个
# 然后推送代码
git push origin main
```

### 第四步：在 Vercel 中导入项目

1. 在 Vercel Dashboard 中，点击 **"New Project"**
2. 选择 **"Import Git Repository"**
3. 找到你的 `birthday-gift-app` 仓库
4. 点击 **"Import"**

### 第五步：配置项目设置

Vercel 会自动检测到这是一个 Next.js 项目：

1. **Project Name**: 可以改为 `birthday-gift-recommender` 或保持默认
2. **Framework Preset**: 应该自动选择 "Next.js"
3. **Root Directory**: 保持默认 "./"
4. **Build Command**: 保持默认 "npm run build"
5. **Output Directory**: 保持默认 ".next"

### 第六步：设置环境变量 🔑

这是最重要的步骤！

1. 在项目配置页面，找到 **"Environment Variables"** 部分
2. 添加以下环境变量：

```
Name: ARK_API_KEY
Value: 13d34bf3-0577-46db-9acd-182a9e42cfb7
Environment: Production, Preview, Development
```

```
Name: DOUBAO_MODEL_NAME
Value: doubao-seed-1-6-flash-250715
Environment: Production, Preview, Development
```

```
Name: NODE_ENV
Value: production
Environment: Production
```

**重要提示**：
- 不要设置 `NEXT_PUBLIC_APP_URL`，Vercel 会自动提供域名
- 确保 `ARK_API_KEY` 是你的真实 API 密钥

### 第七步：部署

1. 点击 **"Deploy"** 按钮
2. 等待部署完成（通常需要 2-3 分钟）
3. 部署成功后，你会看到 🎉 庆祝页面

### 第八步：获取你的网站地址

部署成功后，你会得到类似这样的地址：
```
https://birthday-gift-recommender.vercel.app
```

## 🧪 测试部署

### 1. 访问你的网站
点击 Vercel 提供的链接，确保网站可以正常打开

### 2. 测试礼物推荐功能
1. 填写问卷表单
2. 点击生成推荐
3. 确保 AI 推荐功能正常工作

### 3. 检查 API 调用
在浏览器开发者工具中：
1. 打开 Network 标签
2. 提交表单
3. 确保 API 调用成功（状态码 200）

## 🔧 常见问题解决

### 问题1：部署失败
**可能原因**：构建错误
**解决方案**：
1. 在本地运行 `npm run build` 确保无错误
2. 检查 Vercel 的构建日志
3. 修复错误后重新推送代码

### 问题2：API 调用失败
**可能原因**：环境变量未设置
**解决方案**：
1. 检查 Vercel 项目设置中的环境变量
2. 确保 `ARK_API_KEY` 和 `DOUBAO_MODEL_NAME` 正确设置
3. 重新部署项目

### 问题3：页面显示错误
**可能原因**：路由问题
**解决方案**：
1. 检查 Next.js 路由配置
2. 确保所有页面文件正确命名

## 🎯 部署后的下一步

### 1. 自定义域名（可选）
如果你有自己的域名：
1. 在 Vercel 项目设置中点击 "Domains"
2. 添加你的域名
3. 按照指示配置 DNS

### 2. 监控和分析
1. 在 Vercel Dashboard 查看访问统计
2. 监控 API 调用次数
3. 关注错误日志

### 3. 持续部署
每次你推送代码到 GitHub，Vercel 会自动重新部署：
```bash
git add .
git commit -m "Update features"
git push origin main
```

## 🎉 恭喜！

你的生日礼物推荐应用现在已经在线了！

**你的应用地址**：`https://your-project-name.vercel.app`

现在你可以：
- 分享给朋友测试
- 收集用户反馈
- 继续改进功能

---

## 📞 需要帮助？

如果遇到任何问题：
1. 检查 Vercel 的部署日志
2. 运行本地测试确保功能正常
3. 检查环境变量配置

祝你部署成功！🚀