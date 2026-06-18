import { GeneratedContent, PromptContext, ReviewItem } from '@/engine/types';

// 规则函数统一签名：始终返回一个 ReviewItem（pass/warning/error）
type RuleFn = (content: GeneratedContent, ctx: PromptContext) => ReviewItem;

// 1. platform.tagCount — 标签数量检查
const tagCountRule: RuleFn = (content, ctx) => {
  const { min, max } = ctx.platform.tagRange;
  const count = content.tags.length;
  if (count < min || count > max) {
    return {
      id: 'platform_tag_count',
      category: 'platform',
      ruleName: 'platform.tagCount',
      severity: 'warning',
      message: '标签数量不在要求范围',
      evidence: `当前 ${count} 个，要求 ${min}-${max} 个`,
    };
  }
  return {
    id: 'platform_tag_count',
    category: 'platform',
    ruleName: 'platform.tagCount',
    severity: 'pass',
    message: `标签数量符合要求（${count} 个）`,
  };
};

// 计算中文字符占比
function chineseRatio(text: string): number {
  if (text.length === 0) return 0;
  const chineseChars = text.match(/[\u4e00-\u9fa5]/g);
  const chineseCount = chineseChars ? chineseChars.length : 0;
  return chineseCount / text.length;
}

// 2. platform.instagramLanguage — Instagram 语言检查
const instagramLanguageRule: RuleFn = (content, ctx) => {
  if (ctx.platform.id !== 'platform_ig') {
    return {
      id: 'platform_instagram_language',
      category: 'platform',
      ruleName: 'platform.instagramLanguage',
      severity: 'pass',
      message: '非 Instagram 平台，跳过语言检查',
    };
  }
  const text = content.title + content.body;
  const ratio = chineseRatio(text);
  if (ratio > 0.3) {
    return {
      id: 'platform_instagram_language',
      category: 'platform',
      ruleName: 'platform.instagramLanguage',
      severity: 'warning',
      message: '中文占比过高',
      evidence: `中文占比 ${(ratio * 100).toFixed(0)}%`,
      suggestion: 'Instagram 建议以英文为主',
    };
  }
  return {
    id: 'platform_instagram_language',
    category: 'platform',
    ruleName: 'platform.instagramLanguage',
    severity: 'pass',
    message: '语言占比符合要求',
  };
};

export const platformRules: RuleFn[] = [tagCountRule, instagramLanguageRule];
