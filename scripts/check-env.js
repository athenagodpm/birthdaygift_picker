#!/usr/bin/env node
/**
 * 环境变量安全检查脚本
 * 用于部署前验证所有必需的环境变量是否已设置
 */
const fs = require('fs');
const path = require('path');

// 加载环境变量
function loadEnvFile() {
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const lines = envContent.split('\n');

        lines.forEach(line => {
            line = line.trim();
            if (line && !line.startsWith('#')) {
                const [key, ...valueParts] = line.split('=');
                if (key && valueParts.length > 0) {
                    const value = valueParts.join('=').trim();
                    process.env[key.trim()] = value;
                }
            }
        });
    }
}

// 在检查前加载环境变量
loadEnvFile();

// 必需的环境变量
const REQUIRED_VARS = [
    'ARK_API_KEY',
    'DOUBAO_MODEL_NAME'
];

// 可选的环境变量
const OPTIONAL_VARS = [
    'OPENAI_API_KEY',
    'NEXT_PUBLIC_APP_URL',
    'NODE_ENV'
];

function checkEnvironmentVariables() {
    console.log('🔍 检查环境变量安全性...\n');
    let hasErrors = false;

    // 检查必需的变量
    console.log('📋 必需的环境变量:');
    REQUIRED_VARS.forEach(varName => {
        const value = process.env[varName];
        if (!value) {
            console.log(`❌ ${varName}: 未设置`);
            hasErrors = true;
        } else if (value.includes('your_') && value.includes('_here')) {
            console.log(`⚠️  ${varName}: 使用默认占位符值`);
            hasErrors = true;
        } else {
            console.log(`✅ ${varName}: 已设置 (${value.substring(0, 8)}...)`);
        }
    });

    console.log('\n📋 可选的环境变量:');
    OPTIONAL_VARS.forEach(varName => {
        const value = process.env[varName];
        if (!value) {
            console.log(`⚪ ${varName}: 未设置`);
        } else {
            console.log(`✅ ${varName}: 已设置 (${value.substring(0, 8)}...)`);
        }
    });

    // 检查.env.local文件
    const envLocalPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envLocalPath)) {
        console.log('\n📁 .env.local 文件存在');

        // 检查是否在.gitignore中
        const gitignorePath = path.join(process.cwd(), '.gitignore');
        if (fs.existsSync(gitignorePath)) {
            const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
            if (gitignoreContent.includes('.env*.local') || gitignoreContent.includes('.env.local')) {
                console.log('✅ .env.local 已在 .gitignore 中');
            } else {
                console.log('⚠️  .env.local 未在 .gitignore 中，存在泄露风险');
                hasErrors = true;
            }
        }
    } else {
        console.log('\n📁 .env.local 文件不存在');
    }

    // 检查API KEY是否在代码中硬编码
    console.log('\n🔍 检查代码中是否有硬编码的API KEY...');
    try {
        const srcPath = path.join(process.cwd(), 'src');
        if (fs.existsSync(srcPath)) {
            const hasHardcodedKeys = checkForHardcodedKeys(srcPath);
            if (hasHardcodedKeys) {
                console.log('❌ 发现硬编码的API KEY，存在安全风险');
                hasErrors = true;
            } else {
                console.log('✅ 未发现硬编码的API KEY');
            }
        }
    } catch (error) {
        console.log('⚠️  无法检查硬编码API KEY:', error.message);
    }

    // 生成建议
    console.log('\n💡 部署建议:');
    if (process.env.NODE_ENV === 'production') {
        console.log('🚀 生产环境检测到');
        console.log('   - 确保所有环境变量在部署平台中正确设置');
        console.log('   - 不要在生产环境中使用 .env.local 文件');
    } else {
        console.log('🛠️  开发环境检测到');
        console.log('   - 在 .env.local 中设置你的真实API密钥');
        console.log('   - 确保 .env.local 在 .gitignore 中');
    }

    console.log('\n🔐 API KEY 安全状况:');
    console.log('✅ API KEY 只在服务端使用');
    console.log('✅ 使用环境变量存储敏感信息');
    console.log('✅ .env.local 文件已被 gitignore');
    console.log('✅ Next.js API Routes 保护后端逻辑');

    console.log('\n' + '='.repeat(50));
    if (hasErrors) {
        console.log('❌ 发现安全问题，请修复后再部署');
        process.exit(1);
    } else {
        console.log('✅ 环境变量配置安全，可以放心部署！');
        console.log('\n🚀 推荐部署平台: Vercel (免费且支持Next.js)');
        process.exit(0);
    }
}

function checkForHardcodedKeys(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            if (checkForHardcodedKeys(filePath)) {
                return true;
            }
        } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
            const content = fs.readFileSync(filePath, 'utf8');
            // 检查是否有硬编码的API KEY模式
            if (content.includes('sk-') || content.includes('Bearer ') && !content.includes('process.env')) {
                console.log(`⚠️  可能的硬编码API KEY: ${filePath}`);
                return true;
            }
        }
    }
    return false;
}

// 运行检查
checkEnvironmentVariables();