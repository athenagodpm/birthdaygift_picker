# AI服务配置指南

本应用支持多种AI服务，按优先级自动降级：豆包 → OpenAI → 模拟响应

## 豆包配置（推荐）

1. 获取豆包API密钥：
   - 访问 [豆包开放平台](https://console.volcengine.com/ark)
   - 创建应用并获取API Key
   - 选择或创建模型

2. 在 `.env.local` 文件中配置：
```bash
# 豆包 API Configuration
ARK_API_KEY=your_ark_api_key_here
DOUBAO_MODEL_NAME=your_model_name_here
```

## OpenAI配置（备用）

1. 获取OpenAI API密钥：
   - 访问 [OpenAI Platform](https://platform.openai.com/api-keys)
   - 创建API Key

2. 在 `.env.local` 文件中配置：
```bash
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here
```

## 测试API连接

应用启动后，可以通过以下方式测试：

1. 访问 `http://localhost:3000/api/test` 测试基础API
2. 填写问卷表单测试完整流程
3. 查看控制台日志了解使用的AI服务

## 服务降级策略

- **豆包可用**：使用豆包生成推荐
- **豆包不可用，OpenAI可用**：使用OpenAI生成推荐  
- **都不可用**：使用智能模拟响应

## 成本说明

- **豆包**：相对经济，中文支持更好
- **OpenAI**：功能强大，但成本较高
- **模拟响应**：免费，基于规则生成

## 常见问题

### Q: 如何知道当前使用的是哪个AI服务？
A: 查看浏览器控制台或服务器日志，会显示使用的服务类型。

### Q: 豆包API调用失败怎么办？
A: 检查API密钥和模型名称是否正确，网络是否正常。应用会自动降级到OpenAI或模拟响应。

### Q: 可以只使用模拟响应吗？
A: 可以，不配置任何API密钥即可。模拟响应基于用户输入智能生成，质量也很不错。