# 🎁 生日礼物推荐系统

一个基于AI的智能生日礼物推荐系统，能够根据用户的个人信息、兴趣爱好、MBTI性格类型和生日季节，提供个性化的礼物推荐和祝福语。

## ✨ 功能特色

- 🤖 **AI智能推荐**：集成豆包和OpenAI，提供高质量的个性化推荐
- 🎯 **多维度分析**：结合年龄、性别、兴趣、预算、MBTI性格和生日季节
- ⚡ **快速响应**：多层级API架构，确保快速稳定的用户体验
- 🎨 **现代化UI**：基于Tailwind CSS的响应式设计
- 🔧 **智能修复**：自动修复AI响应中的JSON格式问题
- 📱 **移动友好**：完全响应式设计，支持各种设备

## 🛠️ 技术栈

- **前端框架**：Next.js 15 + React 18
- **样式**：Tailwind CSS
- **语言**：TypeScript
- **AI服务**：豆包API + OpenAI API
- **图标**：Heroicons

## 🚀 快速开始

### 环境要求

- Node.js 18+ 
- npm 或 yarn

### 安装步骤

1. **克隆项目**
```bash
git clone <your-repo-url>
cd birthday-gift-app
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**
创建 `.env.local` 文件：
```env
# 豆包API配置
ARK_API_KEY=your_doubao_api_key
DOUBAO_MODEL_NAME=your_doubao_model_name

# OpenAI API配置（可选）
OPENAI_API_KEY=your_openai_api_key
```

4. **启动开发服务器**
```bash
npm run dev
```

5. **访问应用**
打开 [http://localhost:3000](http://localhost:3000)

## 📖 使用指南

### 基本流程

1. **填写问卷**：访问 `/questionnaire` 页面
   - 输入基本信息（性别、年龄）
   - 选择兴趣爱好
   - 设置预算范围
   - 选择MBTI性格类型（可选）
   - 设置生日日期（可选）

2. **获取推荐**：系统会自动：
   - 调用AI服务生成个性化推荐
   - 结合季节和性格特征
   - 提供3个礼物推荐和祝福语

3. **查看结果**：在 `/results` 页面查看：
   - 详细的礼物推荐
   - 推荐理由
   - 价格估算
   - 个性化祝福语

### 测试功能

访问 `/test` 页面可以测试不同的API服务：
- ⚡ 快速豆包服务
- 🚀 快速AI服务  
- 🧪 基础测试API
- 🔄 完整API测试

## 🏗️ 项目架构

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API路由
│   ├── questionnaire/     # 问卷页面
│   ├── results/          # 结果页面
│   └── test/             # 测试页面
├── components/            # React组件
│   ├── forms/            # 表单组件
│   ├── results/          # 结果展示组件
│   └── ui/               # 基础UI组件
├── services/             # 服务层
│   ├── doubaoService.ts  # 豆包API服务
│   ├── openaiService.ts  # OpenAI API服务
│   ├── fastAIService.ts  # 快速AI服务
│   └── ...
├── types/                # TypeScript类型定义
└── constants/            # 常量配置
```

## 🔧 API服务

### 服务层级

1. **快速豆包服务** (`/api/fast-doubao`)
   - 直接调用豆包API
   - 优化的响应处理
   - 5-8秒响应时间

2. **快速AI服务** (`/api/fast-gift`)
   - 并发调用多个AI服务
   - 智能fallback机制
   - 12秒超时保护

3. **智能模拟API** (`/api/quick-gift`)
   - 基于输入的个性化推荐
   - 最后的保底方案
   - <1秒响应时间

## 🎯 核心特性

### MBTI性格匹配
支持16种MBTI性格类型，每种都有专门的礼物偏好：
- **INTJ**：理性独立，喜欢有深度的礼物
- **ENFP**：热情灵感，适合激发创意的礼物
- **ISFJ**：贴心温暖，适合实用贴心的礼物
- ...

### 季节性推荐
根据生日月份提供季节性建议：
- **春季**：清新温暖的礼物
- **夏季**：清爽实用的礼物
- **秋季**：温馨舒适的礼物
- **冬季**：保暖温暖的礼物

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

1. Fork项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
- [Heroicons](https://heroicons.com/) - 图标库
- [豆包API](https://www.volcengine.com/product/doubao) - AI服务
- [OpenAI](https://openai.com/) - AI服务

---

如果这个项目对你有帮助，请给个⭐️支持一下！
