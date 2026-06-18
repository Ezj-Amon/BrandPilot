import { GeneratedContent, PromptContext, ReviewItem } from '@/engine/types';

// 规则函数统一签名：始终返回一个 ReviewItem（pass/warning/error）
type RuleFn = (content: GeneratedContent, ctx: PromptContext) => ReviewItem;

// 绝对化用语扫描词列表
const absoluteWords = [
  '最',
  '第一',
  '唯一',
  '顶级',
  '全网最低',
  '绝对',
  '最佳',
  '全网最好',
  '极品',
  '神器',
  '最强',
  '冠军',
];

// 1. brand.absolute — 绝对化用语检查
const absoluteRule: RuleFn = (content, _ctx) => {
  const text = content.title + content.body;
  const hit = absoluteWords.find((w) => text.includes(w));
  if (hit) {
    return {
      id: 'brand_absolute',
      category: 'brand',
      ruleName: 'brand.absolute',
      severity: 'error',
      message: '检测到绝对化用语',
      evidence: hit,
      suggestion: '建议删除绝对化用语，改用具体场景描述',
    };
  }
  return {
    id: 'brand_absolute',
    category: 'brand',
    ruleName: 'brand.absolute',
    severity: 'pass',
    message: '未检测到绝对化用语',
  };
};

// 2. brand.banned — 品牌禁用词检查
const bannedRule: RuleFn = (content, ctx) => {
  const text = content.title + content.body + content.cta;
  const hit = ctx.brand.bannedWords.find((w) => text.includes(w));
  if (hit) {
    return {
      id: 'brand_banned',
      category: 'brand',
      ruleName: 'brand.banned',
      severity: 'error',
      message: '检测到品牌禁用词',
      evidence: hit,
      suggestion: '请删除禁用词，遵守品牌规范',
    };
  }
  return {
    id: 'brand_banned',
    category: 'brand',
    ruleName: 'brand.banned',
    severity: 'pass',
    message: '未检测到品牌禁用词',
  };
};

// CTA 强销售扫描词列表
const hardSellWords = ['立即下单', '抢购', '赶紧买', '马上抢', '限时抢', '速来抢', '马上下单', '立刻购买'];

// 3. brand.ctaHardSell — CTA 强销售检查
const ctaHardSellRule: RuleFn = (content, _ctx) => {
  const hit = hardSellWords.find((w) => content.cta.includes(w));
  if (hit) {
    return {
      id: 'brand_cta_hard_sell',
      category: 'brand',
      ruleName: 'brand.ctaHardSell',
      severity: 'warning',
      message: 'CTA 含强销售用语',
      evidence: hit,
      suggestion: "建议 CTA 改为互动引导，如'评论区告诉我你的想法'",
    };
  }
  return {
    id: 'brand_cta_hard_sell',
    category: 'brand',
    ruleName: 'brand.ctaHardSell',
    severity: 'pass',
    message: 'CTA 未含强销售用语',
  };
};

export const brandRules: RuleFn[] = [absoluteRule, bannedRule, ctaHardSellRule];
