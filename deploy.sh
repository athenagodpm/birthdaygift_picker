#!/bin/bash

# 生日礼物推荐应用部署脚本

echo "🚀 开始部署生日礼物推荐应用..."

# 检查Node.js版本
echo "📋 检查Node.js版本..."
node --version
npm --version

# 安装依赖
echo "📦 安装依赖..."
npm install

# 运行构建
echo "🔨 构建应用..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ 构建成功！"
    echo ""
    echo "🎯 部署提醒："
    echo "1. 确保在部署平台设置以下环境变量："
    echo "   - ARK_API_KEY=你的豆包API密钥"
    echo "   - DOUBAO_MODEL_NAME=doubao-seed-1-6-flash-250715"
    echo "   - NODE_ENV=production"
    echo ""
    echo "2. 推荐的部署平台："
    echo "   - Vercel (推荐): vercel --prod"
    echo "   - Netlify: 上传 .next 文件夹"
    echo "   - Railway: railway up"
    echo ""
    echo "3. 部署后测试："
    echo "   - 访问首页确认正常加载"
    echo "   - 测试问卷功能"
    echo "   - 验证AI推荐功能"
    echo ""
    echo "🔒 安全提醒："
    echo "- 测试页面在生产环境中已被自动保护"
    echo "- API KEY只在服务端使用，不会暴露给客户端"
    echo "- 建议设置自定义域名和HTTPS"
else
    echo "❌ 构建失败！请检查错误信息。"
    exit 1
fi