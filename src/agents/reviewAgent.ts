// Review Agent
// 输入：生成文案 + Product Brief + Platform Brief + Content Strategy + 风险表达规则
// 输出：审核总分/状态 + 品牌一致性 + 平台风格匹配 + 卖点数量 + 事实风险 + CTA + 标签 + 修改建议
//
// 审核结果基于生成内容做规则判断（CTA 是否过硬、标签是否过少、是否缺少场景词、
// 是否包含风险表达、卖点数量是否过多、是否符合平台风格），不是完全写死。

import { GeneratedContent, ReviewResult, ReviewItem, Severity } from '@/engine/types';
import { ReviewContext } from './types';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 规则函数签名
type RuleFn = (content: GeneratedContent, ctx: ReviewContext) => ReviewItem;

// ── 扫描词表 ──────────────────────────────────────────────
const absoluteWords = [
  '最', '第一', '唯一', '顶级', '全网最低', '绝对', '最佳', '全网最好', '极品', '神器', '最强', '冠军',
];
const hardSellWords = ['立即下单', '抢购', '赶紧买', '马上抢', '限时抢', '速来抢', '马上下单', '立刻购买'];
const sceneHintWords = ['周末', '出行', '通勤', '旅行', '短途', '出行', '场景', 'trip', 'weekend', 'travel'];

// 中文字符占比
function chineseRatio(text: string): number {
  if (text.length === 0) return 0;
  const chineseChars = text.match(/[\u4e00-\u9fa5]/g);
  return chineseChars ? chineseChars.length / text.length : 0;
}

// 统计正文中出现的卖点数量
function countSellingPoints(content: GeneratedContent, ctx: ReviewContext): number {
  const text = content.body;
  return ctx.product.coreSellingPoints.filter((sp) => text.includes(sp)).length;
}

// ── 1. brand.absolute：绝对化用语检查 ──────────────────────
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
  return { id: 'brand_absolute', category: 'brand', ruleName: 'brand.absolute', severity: 'pass', message: '未检测到绝对化用语' };
};

// ── 2. brand.banned：品牌禁用词检查 ────────────────────────
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
  return { id: 'brand_banned', category: 'brand', ruleName: 'brand.banned', severity: 'pass', message: '未检测到品牌禁用词' };
};

// ── 3. brand.tone：品牌语气一致性检查 ──────────────────────
const toneRule: RuleFn = (content, ctx) => {
  const text = content.title + content.body + content.cta;
  const hit = ctx.brand.antiToneKeywords.find((w) => text.includes(w));
  if (hit) {
    return {
      id: 'brand_tone',
      category: 'brand',
      ruleName: 'brand.tone',
      severity: 'warning',
      message: '文案出现与品牌调性冲突的表达',
      evidence: hit,
      suggestion: `品牌调性为 ${ctx.brand.toneKeywords.join('、')}，避免使用「${hit}」类表达`,
    };
  }
  return { id: 'brand_tone', category: 'brand', ruleName: 'brand.tone', severity: 'pass', message: '品牌语气一致性良好' };
};

// ── 4. platform.tagCount：标签数量检查 ─────────────────────
const tagCountRule: RuleFn = (content, ctx) => {
  const { min, max } = ctx.platform.tagRange;
  const count = content.tags.length;
  if (count < min) {
    return {
      id: 'platform_tag_count',
      category: 'tag',
      ruleName: 'tag.count',
      severity: 'warning',
      message: '标签数量过少',
      evidence: `当前 ${count} 个，要求 ${min}-${max} 个`,
      suggestion: `建议补充 ${min - count} 个场景/产品相关标签`,
    };
  }
  if (count > max) {
    return {
      id: 'platform_tag_count',
      category: 'tag',
      ruleName: 'tag.count',
      severity: 'warning',
      message: '标签数量过多',
      evidence: `当前 ${count} 个，要求 ${min}-${max} 个`,
      suggestion: `建议删减 ${count - max} 个标签`,
    };
  }
  return { id: 'platform_tag_count', category: 'tag', ruleName: 'tag.count', severity: 'pass', message: `标签数量符合要求（${count} 个）` };
};

// ── 5. tag.relevance：标签相关性检查 ───────────────────────
const tagRelevanceRule: RuleFn = (content, ctx) => {
  const keywordPool = [
    ctx.product.name,
    ctx.product.type,
    ...ctx.productBrief.scenarios,
    ...ctx.productBrief.coreSellingPoints,
  ].filter(Boolean);
  // 标签去掉 # 后是否包含任一关键词或被关键词包含
  const relevantCount = content.tags.filter((tag) => {
    const t = tag.replace(/^#/, '').toLowerCase();
    return keywordPool.some((k) => t.includes(k.toLowerCase()) || k.toLowerCase().includes(t));
  }).length;
  const ratio = content.tags.length === 0 ? 0 : relevantCount / content.tags.length;
  if (ratio < 0.5) {
    return {
      id: 'tag_relevance',
      category: 'tag',
      ruleName: 'tag.relevance',
      severity: 'warning',
      message: '标签与产品/场景相关性偏低',
      evidence: `${relevantCount}/${content.tags.length} 个标签与产品相关`,
      suggestion: '建议增加与产品名、使用场景相关的标签',
    };
  }
  return { id: 'tag_relevance', category: 'tag', ruleName: 'tag.relevance', severity: 'pass', message: `标签相关性良好（${relevantCount}/${content.tags.length}）` };
};

// ── 6. platform.bodyLength：正文长度检查 ───────────────────
const bodyLengthRule: RuleFn = (content, ctx) => {
  const { min, max } = ctx.platform.bodyLengthRange;
  const len = content.body.length;
  if (len < min) {
    return {
      id: 'platform_body_length',
      category: 'platform',
      ruleName: 'platform.bodyLength',
      severity: 'warning',
      message: '正文长度偏短',
      evidence: `当前 ${len} 字，要求 ${min}-${max} 字`,
      suggestion: `建议补充 ${min - len} 字左右的内容`,
    };
  }
  if (len > max) {
    return {
      id: 'platform_body_length',
      category: 'platform',
      ruleName: 'platform.bodyLength',
      severity: 'warning',
      message: '正文长度偏长',
      evidence: `当前 ${len} 字，要求 ${min}-${max} 字`,
      suggestion: `建议精简 ${len - max} 字左右`,
    };
  }
  return { id: 'platform_body_length', category: 'platform', ruleName: 'platform.bodyLength', severity: 'pass', message: `正文长度符合要求（${len} 字）` };
};

// ── 7. platform.language：平台语言检查（Instagram 中文占比）─
const languageRule: RuleFn = (content, ctx) => {
  if (ctx.platform.id !== 'platform_ig') {
    return { id: 'platform_language', category: 'platform', ruleName: 'platform.language', severity: 'pass', message: '非 Instagram 平台，跳过语言检查' };
  }
  const text = content.title + content.body;
  const ratio = chineseRatio(text);
  if (ratio > 0.3) {
    return {
      id: 'platform_language',
      category: 'platform',
      ruleName: 'platform.language',
      severity: 'warning',
      message: '中文占比过高',
      evidence: `中文占比 ${(ratio * 100).toFixed(0)}%`,
      suggestion: 'Instagram 建议以英文为主',
    };
  }
  return { id: 'platform_language', category: 'platform', ruleName: 'platform.language', severity: 'pass', message: '语言占比符合要求' };
};

// ── 8. fact.exaggeration：事实风险检查 ─────────────────────
const factExaggerationRule: RuleFn = (content, ctx) => {
  const text = content.title + content.body;
  for (const fact of ctx.product.facts) {
    const hit = fact.forbiddenExaggeration.find((w) => text.includes(w));
    if (hit) {
      return {
        id: 'fact_exaggeration',
        category: 'fact',
        ruleName: 'fact.exaggeration',
        severity: 'error',
        message: `${fact.label}表述夸大`,
        evidence: hit,
        suggestion: `产品${fact.label}为「${fact.value}」，不能表述为「${hit}」`,
      };
    }
  }
  return { id: 'fact_exaggeration', category: 'fact', ruleName: 'fact.exaggeration', severity: 'pass', message: '事实表述合规' };
};

// ── 9. cta.hardSell：CTA 表达检查 ──────────────────────────
const ctaHardSellRule: RuleFn = (content, _ctx) => {
  const hit = hardSellWords.find((w) => content.cta.includes(w));
  if (hit) {
    return {
      id: 'cta_hard_sell',
      category: 'cta',
      ruleName: 'cta.hardSell',
      severity: 'warning',
      message: 'CTA 含强销售用语',
      evidence: hit,
      suggestion: "建议 CTA 改为互动引导，如'评论区告诉我你的想法'",
    };
  }
  return { id: 'cta_hard_sell', category: 'cta', ruleName: 'cta.hardSell', severity: 'pass', message: 'CTA 未含强销售用语' };
};

// ── 10. sellingPoint.count：卖点数量检查 ───────────────────
const sellingPointCountRule: RuleFn = (content, ctx) => {
  const count = countSellingPoints(content, ctx);
  if (count > 4) {
    return {
      id: 'selling_point_count',
      category: 'sellingPoint',
      ruleName: 'sellingPoint.count',
      severity: 'warning',
      message: '正文堆叠卖点过多',
      evidence: `正文出现 ${count} 个卖点`,
      suggestion: '建议聚焦 2-3 个核心卖点，避免功能堆砌感',
    };
  }
  if (count === 0) {
    return {
      id: 'selling_point_count',
      category: 'sellingPoint',
      ruleName: 'sellingPoint.count',
      severity: 'warning',
      message: '正文未体现产品卖点',
      evidence: '0 个卖点被提及',
      suggestion: '建议至少融入 1-2 个核心卖点',
    };
  }
  return { id: 'selling_point_count', category: 'sellingPoint', ruleName: 'sellingPoint.count', severity: 'pass', message: `卖点数量合理（${count} 个）` };
};

// ── 11. content.scene：场景词检查 ──────────────────────────
const sceneWordRule: RuleFn = (content, _ctx) => {
  const text = content.title + content.body;
  const hit = sceneHintWords.find((w) => text.toLowerCase().includes(w.toLowerCase()));
  if (!hit) {
    return {
      id: 'content_scene',
      category: 'platform',
      ruleName: 'content.scene',
      severity: 'warning',
      message: '文案缺少场景词',
      evidence: '未检测到出行/通勤/旅行等场景词',
      suggestion: '建议在标题或开头加入使用场景词，增强代入感',
    };
  }
  return { id: 'content_scene', category: 'platform', ruleName: 'content.scene', severity: 'pass', message: '文案包含场景词' };
};

// 全部规则
const allRules: RuleFn[] = [
  absoluteRule,
  bannedRule,
  toneRule,
  tagCountRule,
  tagRelevanceRule,
  bodyLengthRule,
  languageRule,
  factExaggerationRule,
  ctaHardSellRule,
  sellingPointCountRule,
  sceneWordRule,
];

// 计算审核总分（0-100）
function calcScore(items: ReviewItem[]): number {
  let score = 100;
  for (const item of items) {
    if (item.severity === 'error') score -= 25;
    else if (item.severity === 'warning') score -= 8;
  }
  return Math.max(0, score);
}

// 推导总体状态
function deriveStatus(items: ReviewItem[]): Severity {
  if (items.some((i) => i.severity === 'error')) return 'error';
  if (items.some((i) => i.severity === 'warning')) return 'warning';
  return 'pass';
}

// 汇总修改建议（取非 pass 项的 suggestion，最多 5 条）
function collectSuggestions(items: ReviewItem[]): string[] {
  return items
    .filter((i) => i.severity !== 'pass' && i.suggestion)
    .slice(0, 5)
    .map((i) => i.suggestion as string);
}

// 执行审核
export async function runReviewAgent(
  content: GeneratedContent,
  ctx: ReviewContext,
): Promise<ReviewResult> {
  await delay(500);

  const items: ReviewItem[] = allRules.map((rule) => rule(content, ctx));
  const summary = {
    pass: items.filter((i) => i.severity === 'pass').length,
    warning: items.filter((i) => i.severity === 'warning').length,
    error: items.filter((i) => i.severity === 'error').length,
  };

  return {
    sessionId: content.sessionId,
    contentId: content.id,
    status: deriveStatus(items),
    score: calcScore(items),
    items,
    summary,
    suggestions: collectSuggestions(items),
  };
}
