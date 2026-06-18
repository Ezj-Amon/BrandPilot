import { GeneratedContent, PromptContext, ReviewItem } from '@/engine/types';

// 规则函数统一签名：始终返回一个 ReviewItem（pass/warning/error）
type RuleFn = (content: GeneratedContent, ctx: PromptContext) => ReviewItem;

// 1. fact.waterExaggeration — 防泼水夸大检查
const waterExaggerationRule: RuleFn = (content, ctx) => {
  const fact = ctx.product.facts.find((f) => f.key === 'water_resistance');
  // 无该事实或非"防泼水"，跳过检查
  if (!fact || fact.value !== '防泼水') {
    return {
      id: 'fact_water_exaggeration',
      category: 'fact',
      ruleName: 'fact.waterExaggeration',
      severity: 'pass',
      message: '无需防水夸大检查',
    };
  }
  const text = content.title + content.body;
  const hit = fact.forbiddenExaggeration.find((w) => text.includes(w));
  if (hit) {
    return {
      id: 'fact_water_exaggeration',
      category: 'fact',
      ruleName: 'fact.waterExaggeration',
      severity: 'error',
      message: '防泼水表述夸大',
      evidence: hit,
      suggestion: "产品为'防泼水'，不能表述为'完全防水'等，建议改为'防泼水设计，应对小雨'",
    };
  }
  return {
    id: 'fact_water_exaggeration',
    category: 'fact',
    ruleName: 'fact.waterExaggeration',
    severity: 'pass',
    message: '防水表述符合事实',
  };
};

export const factRules: RuleFn[] = [waterExaggerationRule];
