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
export type RuleCategory = 'brand' | 'platform' | 'fact';

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
  items: ReviewItem[];
  summary: { pass: number; warning: number; error: number };
}

// 生成器统一接口
export interface ContentGenerator {
  generate(ctx: PromptContext): Promise<GeneratedContent>;
}

// Prompt 上下文
export interface PromptContext {
  brand: Brand;
  product: Product;
  platform: Platform;
  goal: ContentGoal;
}

// 内容模板（用于 mockGenerator）
export interface ContentTemplate {
  productId: string;
  platformId: string;
  goalId: string;
  title: string;
  body: string;       // 可含占位符 {productName} {capacity} {material} {sellingPoint1} 等
  tags: string[];
  cta: string;
}

// ─── Agent 中间产物类型 ───

// Product Knowledge Agent 输出：产品简报
export interface ProductBrief {
  positioning: string;        // 产品定位
  targetUsers: string[];      // 目标用户
  useScenarios: string[];      // 使用场景
  coreSellingPoints: string[];// 核心卖点
  riskConstraints: string[];  // 风险表达约束（如"防泼水，不可表述为完全防水"）
}

// Platform Adaptation Agent 输出：平台简报
export interface PlatformBrief {
  expressionStyle: string;    // 平台表达风格
  bodyLengthAdvice: string;   // 内容长度建议
  tagAdvice: string;           // 标签建议
  ctaStyleAdvice: string;      // CTA 风格建议
}

// Content Strategy Agent 输出：内容策略
export interface ContentStrategy {
  mainThread: string;          // 内容主线
  angle: string;               // 表达切口
  infoOrder: string[];         // 信息排序
  structureAdvice: string;    // 结构建议
}

// Agent 上下文：承载完整 Brief/Strategy 链路，供生成与审核消费
export interface AgentContext {
  brand: Brand;
  product: Product;
  platform: Platform;
  goal: ContentGoal;
  productBrief: ProductBrief;
  platformBrief: PlatformBrief;
  contentStrategy: ContentStrategy;
}
