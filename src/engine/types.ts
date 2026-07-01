// BrandPilot 引擎核心类型定义

// 品牌资料
export interface Brand {
  id: string;
  name: string;                  // 可编辑
  tagline: string;
  toneKeywords: string[];        // 例如 ["简约","实用","城市感"]
  antiToneKeywords: string[];    // 例如 ["奢华","炫富"]
  bannedWords: string[];         // 可编辑
}

// 产品事实（用于事实一致性检查）
export interface ProductFact {
  key: string;                   // 例如 "water_resistance"
  label: string;                 // 例如 "防水性能"
  value: string;                 // 例如 "防泼水"
  forbiddenExaggeration: string[]; // 例如 ["完全防水","可浸泡","潜水"]
}

// 产品资料
export interface Product {
  id: string;
  brandId: string;
  name: string;                  // 可编辑
  type: string;                  // 可编辑，例如 "短途旅行背包"
  capacity?: string;
  material?: string;
  coreSellingPoints: string[];   // 可编辑
  targetUsers: string[];
  facts: ProductFact[];
  supported: boolean;            // 是否第一阶段支持生成（Voyage Pack true，其他 false）
}

// 平台风格规则
export interface PlatformStyleRule {
  id: string;
  label: string;
  description: string;
}

// 平台
export interface Platform {
  id: string;
  name: string;
  language: 'zh' | 'en';
  tagRange: { min: number; max: number };
  bodyLengthRange: { min: number; max: number };
  emojiPolicy: 'encouraged' | 'moderate' | 'minimal';
  ctaStyle: string;
  styleRules: PlatformStyleRule[];
}

// 内容目标
export interface ContentGoal {
  id: string;
  name: string;
  description: string;
  focusPoints: string[];
}

// 生成内容
export interface GeneratedContent {
  id: string;
  sessionId: string;
  productId: string;
  platformId: string;
  goalId: string;
  title: string;
  body: string;
  tags: string[];
  cta: string;
  createdAt: string;
}

// 审核相关
export type Severity = 'pass' | 'warning' | 'error';
export type RuleCategory = 'brand' | 'platform' | 'fact' | 'cta' | 'tag' | 'sellingPoint';

export interface ReviewItem {
  id: string;
  category: RuleCategory;
  ruleName: string;
  severity: Severity;
  message: string;
  suggestion?: string;
  evidence?: string;             // 命中的具体文本片段
}

export interface ReviewResult {
  sessionId: string;
  contentId: string;
  status: Severity;              // 总体状态：pass / warning / error
  score: number;                 // 审核总分 0-100
  items: ReviewItem[];
  summary: { pass: number; warning: number; error: number };
  suggestions: string[];         // 修改建议（取非 pass 项）
}
