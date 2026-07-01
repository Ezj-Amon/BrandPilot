import { AgentContext, GeneratedContent, ReviewItem, ReviewResult } from '@/engine/types';
import { brandRules } from '@/engine/rules/brandRules';
import { platformRules } from '@/engine/rules/platformRules';
import { factRules } from '@/engine/rules/factRules';

// 复用现有 6 条规则（AgentContext 结构上兼容 PromptContext）
const existingRules = [...brandRules, ...platformRules, ...factRules];

// 场景词列表（中文 + 英文）
const sceneWordsZh = ['周末', '旅行', '出行'];
const sceneWordsEn = ['weekend', 'trip', 'travel'];
const sceneWords = [...sceneWordsZh, ...sceneWordsEn];

// 计算中文字符占比
function chineseRatio(text: string): number {
  if (text.length === 0) return 0;
  const chineseChars = text.match(/[\u4e00-\u9fa5]/g);
  return (chineseChars ? chineseChars.length : 0) / text.length;
}

// 7. content.sceneWordCheck — 场景词缺失检查
function sceneWordCheck(content: GeneratedContent, ctx: AgentContext): ReviewItem {
  const text = (content.title + content.body).toLowerCase();
  const hit = sceneWords.find((w) => text.includes(w.toLowerCase()));
  const scenarioHit = ctx.productBrief.useScenarios.some((s) => content.body.includes(s));
  if (!hit && !scenarioHit) {
    return {
      id: 'content_scene_word',
      category: 'fact',
      ruleName: 'content.sceneWordCheck',
      severity: 'warning',
      message: '正文缺少场景词',
      suggestion: '建议在正文中加入场景词，如周末、旅行、出行、weekend、trip 等',
    };
  }
  return {
    id: 'content_scene_word',
    category: 'fact',
    ruleName: 'content.sceneWordCheck',
    severity: 'pass',
    message: '正文包含场景词',
  };
}

// 8. content.sellingPointCount — 卖点数量过多检查
function sellingPointCountRule(content: GeneratedContent, ctx: AgentContext): ReviewItem {
  const body = content.body;
  const count = ctx.productBrief.coreSellingPoints.filter((sp) => body.includes(sp)).length;
  if (count > 3) {
    return {
      id: 'content_selling_point_count',
      category: 'brand',
      ruleName: 'content.sellingPointCount',
      severity: 'warning',
      message: `正文提及 ${count} 个卖点，数量过多`,
      evidence: `${count} 个卖点`,
      suggestion: '建议正文聚焦 2-3 个核心卖点，其余放入标签或图片说明',
    };
  }
  return {
    id: 'content_selling_point_count',
    category: 'brand',
    ruleName: 'content.sellingPointCount',
    severity: 'pass',
    message: `卖点数量适中（${count} 个）`,
  };
}

// 9. content.platformStyleMatch — 平台风格匹配检查
function platformStyleMatchRule(content: GeneratedContent, ctx: AgentContext): ReviewItem {
  const { platform } = ctx;
  if (platform.id === 'platform_ig') {
    // Instagram：检查英文占比是否充足（中文占比过高则不匹配）
    const ratio = chineseRatio(content.title + content.body);
    if (ratio > 0.3) {
      return {
        id: 'content_platform_style',
        category: 'platform',
        ruleName: 'content.platformStyleMatch',
        severity: 'warning',
        message: 'Instagram 英文占比不足',
        evidence: `中文占比 ${(ratio * 100).toFixed(0)}%`,
        suggestion: 'Instagram 建议以英文为主',
      };
    }
    return {
      id: 'content_platform_style',
      category: 'platform',
      ruleName: 'content.platformStyleMatch',
      severity: 'pass',
      message: 'Instagram 语言风格匹配',
    };
  }
  if (platform.id === 'platform_xhs') {
    // 小红书：检查标题是否包含场景词
    const hasScene = sceneWords.some((w) => content.title.includes(w));
    if (!hasScene) {
      return {
        id: 'content_platform_style',
        category: 'platform',
        ruleName: 'content.platformStyleMatch',
        severity: 'warning',
        message: '小红书标题缺少场景词',
        suggestion: '标题建议包含使用场景词，如周末、出行、旅行',
      };
    }
    return {
      id: 'content_platform_style',
      category: 'platform',
      ruleName: 'content.platformStyleMatch',
      severity: 'pass',
      message: '小红书标题风格匹配',
    };
  }
  if (platform.id === 'platform_wechat') {
    // 微信公众号：检查正文长度是否充足
    const len = content.body.length;
    const { min, max } = platform.bodyLengthRange;
    if (len < min || len > max) {
      return {
        id: 'content_platform_style',
        category: 'platform',
        ruleName: 'content.platformStyleMatch',
        severity: 'warning',
        message: '微信公众号正文长度不在范围',
        evidence: `当前 ${len} 字，要求 ${min}-${max} 字`,
        suggestion: '建议调整为适合长文阅读的篇幅',
      };
    }
    return {
      id: 'content_platform_style',
      category: 'platform',
      ruleName: 'content.platformStyleMatch',
      severity: 'pass',
      message: '微信公众号篇幅匹配',
    };
  }
  return {
    id: 'content_platform_style',
    category: 'platform',
    ruleName: 'content.platformStyleMatch',
    severity: 'pass',
    message: '平台风格匹配',
  };
}

// Review Agent：基于生成内容 + Brief/Strategy + 风险规则计算审核结果
export function runReview(content: GeneratedContent, ctx: AgentContext): ReviewResult {
  const items: ReviewItem[] = existingRules.map((rule, idx) => {
    const item = rule(content, ctx);
    return { ...item, id: item.id || `review_${idx}` };
  });

  items.push(sceneWordCheck(content, ctx));
  items.push(sellingPointCountRule(content, ctx));
  items.push(platformStyleMatchRule(content, ctx));

  const summary = {
    pass: items.filter((i) => i.severity === 'pass').length,
    warning: items.filter((i) => i.severity === 'warning').length,
    error: items.filter((i) => i.severity === 'error').length,
  };

  return {
    sessionId: content.sessionId,
    contentId: content.id,
    items,
    summary,
  };
}
