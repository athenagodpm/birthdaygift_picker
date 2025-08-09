# 🚀 部署指南

## 环境变量安全性

### ✅ 当前安全状态
- API密钥存储在 `.env.local` 文件中
- 该文件已被 `.gitignore` 忽略，不会提交到Git
- API密钥只在服务端使用，前端无法访问

## 部署到生产环境

### 1. 推荐的部署平台

#### Vercel (推荐)
```bash
# 安装Vercel CLI
npm i -g vercel

# 部署
vercel

# 设置环境变量
vercel env add ARK_API_KEY
vercel env add DOUBAO_MODEL_NAME
vercel env add NEXT_PUBLIC_APP_URL
```

#### Netlify
1. 连接GitHub仓库
2. 在Site settings > Environment variables中添加：
   - `ARK_API_KEY`: 你的豆包API密钥
   - `DOUBAO_MODEL_NAME`: doubao-seed-1-6-flash-250715
   - `NEXT_PUBLIC_APP_URL`: 你的网站URL

### 2. 环境变量配置

在部署平台中设置以下环境变量：

```bash
ARK_API_KEY=你的豆包API密钥
DOUBAO_MODEL_NAME=doubao-seed-1-6-flash-250715
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://你的域名.com
```

### 3. 安全检查清单

- [ ] ✅ `.env.local` 在 `.gitignore` 中
- [ ] ✅ API密钥不在代码中硬编码
- [ ] ✅ 环境变量在部署平台中正确配置
- [ ] ✅ 生产环境URL已更新
- [ ] ✅ API密钥有适当的权限限制

### 4. 部署后验证

1. 访问你的网站
2. 测试礼物推荐功能
3. 检查浏览器开发者工具，确认API密钥不会暴露
4. 测试多语言切换功能

### 5. 监控和维护

- 定期检查API使用量
- 监控错误日志
- 定期更新依赖包
- 备份重要配置

## 故障排除

### 常见问题

1. **API调用失败**
   - 检查环境变量是否正确设置
   - 验证API密钥是否有效
   - 查看服务器日志

2. **多语言不工作**
   - 确认翻译文件已正确部署
   - 检查浏览器控制台错误

3. **样式问题**
   - 清除浏览器缓存
   - 检查CSS文件是否正确加载

## 安全最佳实践

1. **永远不要**：
   - 在代码中硬编码API密钥
   - 将 `.env.local` 提交到Git
   - 在前端代码中使用敏感信息

2. **始终要**：
   - 使用环境变量存储敏感信息
   - 定期轮换API密钥
   - 监控API使用情况
   - 设置适当的CORS策略

## 联系支持

如果遇到部署问题，可以：
1. 检查部署平台的文档
2. 查看项目的GitHub Issues
3. 联系相关API服务的技术支持