import { BudgetOption, GenderOption, MBTIOption } from '@/types';

// 预算选项配置
export const BUDGET_OPTIONS: BudgetOption[] = [
    { label: '50元以下', value: '0-50元', min: 0, max: 50 },
    { label: '50-100元', value: '50-100元', min: 50, max: 100 },
    { label: '100-200元', value: '100-200元', min: 100, max: 200 },
    { label: '200-500元', value: '200-500元', min: 200, max: 500 },
    { label: '500-1000元', value: '500-1000元', min: 500, max: 1000 },
    { label: '1000元以上', value: '1000元以上', min: 1000, max: 10000 }
];

// 性别选项配置
export const GENDER_OPTIONS: GenderOption[] = [
    { label: '男性', value: 'male', icon: '👨' },
    { label: '女性', value: 'female', icon: '👩' },
    { label: '其他', value: 'other', icon: '👤' }
];

// MBTI性格类型选项
export const MBTI_OPTIONS: MBTIOption[] = [
    { label: 'INTJ - 建筑师', value: 'INTJ', description: '独立思考，追求完美', traits: ['理性', '独立', '有远见', '追求效率'] },
    { label: 'INTP - 思想家', value: 'INTP', description: '好奇心强，喜欢探索', traits: ['逻辑性强', '创新', '灵活', '求知欲强'] },
    { label: 'ENTJ - 指挥官', value: 'ENTJ', description: '天生的领导者', traits: ['果断', '自信', '有组织力', '目标导向'] },
    { label: 'ENTP - 辩论家', value: 'ENTP', description: '充满创意和热情', traits: ['创新', '灵活', '善于交际', '喜欢挑战'] },
    { label: 'INFJ - 提倡者', value: 'INFJ', description: '理想主义，富有同情心', traits: ['有洞察力', '理想主义', '有创造力', '关心他人'] },
    { label: 'INFP - 调停者', value: 'INFP', description: '忠于自己的价值观', traits: ['有创造力', '理想主义', '开放', '灵活'] },
    { label: 'ENFJ - 主人公', value: 'ENFJ', description: '天生的领袖和导师', traits: ['有魅力', '利他主义', '有组织力', '善于激励'] },
    { label: 'ENFP - 竞选者', value: 'ENFP', description: '热情洋溢，富有创造力', traits: ['热情', '创新', '善于交际', '灵活'] },
    { label: 'ISTJ - 物流师', value: 'ISTJ', description: '实用主义，事实导向', traits: ['可靠', '负责任', '实际', '有条理'] },
    { label: 'ISFJ - 守护者', value: 'ISFJ', description: '温暖贴心，乐于助人', traits: ['关心他人', '负责任', '勤奋', '忠诚'] },
    { label: 'ESTJ - 总经理', value: 'ESTJ', description: '优秀的管理者', traits: ['有组织力', '实际', '逻辑性强', '果断'] },
    { label: 'ESFJ - 执政官', value: 'ESFJ', description: '关心他人，善于合作', traits: ['关心他人', '合作', '负责任', '和谐'] },
    { label: 'ISTP - 鉴赏家', value: 'ISTP', description: '实用主义的探索者', traits: ['实际', '灵活', '好奇', '冷静'] },
    { label: 'ISFP - 探险家', value: 'ISFP', description: '灵活友善的艺术家', traits: ['有创造力', '灵活', '关心他人', '开放'] },
    { label: 'ESTP - 企业家', value: 'ESTP', description: '精力充沛，喜欢行动', traits: ['实际', '灵活', '善于交际', '适应性强'] },
    { label: 'ESFP - 娱乐家', value: 'ESFP', description: '热情友好，喜欢帮助他人', traits: ['热情', '友好', '灵活', '善于交际'] }
];

// 常见兴趣爱好建议
export const INTEREST_SUGGESTIONS = [
    '阅读', '运动', '音乐', '电影', '旅行', '摄影', '绘画', '烹饪',
    '游戏', '健身', '瑜伽', '舞蹈', '书法', '园艺', '手工', '收藏',
    '宠物', '科技', '时尚', '美妆', '咖啡', '茶艺', '钓鱼', '登山'
];

// 常见已送礼物建议
export const PAST_GIFT_SUGGESTIONS = [
    '鲜花', '巧克力', '香水', '手表', '项链', '耳环', '包包', '衣服',
    '鞋子', '书籍', '电子产品', '化妆品', '护肤品', '玩具', '装饰品',
    '文具', '运动用品', '乐器', '艺术品', '食品'
];

// 表单验证错误消息
export const VALIDATION_MESSAGES = {
    REQUIRED: '此字段为必填项',
    INVALID_AGE: '年龄必须在1-120岁之间',
    INVALID_EMAIL: '请输入有效的邮箱地址',
    TOO_MANY_INTERESTS: '兴趣爱好最多只能添加10个',
    TOO_MANY_PAST_GIFTS: '已送礼物最多只能添加20个',
    INVALID_BUDGET: '请选择有效的预算范围'
};

// API配置
export const API_CONFIG = {
    TIMEOUT: 60000, // 60秒超时
    MAX_RETRIES: 2,
    ENDPOINTS: {
        GENERATE_GIFT: '/api/generate-gift'
    }
};