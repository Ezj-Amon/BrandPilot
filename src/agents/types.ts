// BrandPilot 本地 Agent Engine 类型定义
// 这些类型是 5 个 Agent 之间传递的中间结果（Brief / Strategy）

import { Brand, Product, Platform, ContentGoal } from '@/engine/types';

// ProductKnowledgeAgent 的输出：Product Brief
export interface ProductBrief {
  productId: string;
  positioning: string;          // 产品定位
  targetUsers: string[];        // 目标用户
  scenarios: string[];          // 使用场景
  coreSellingPoints: string[];  // 核心卖点
  riskExpressions: string[];    // 风险表达（来自产品事实的 forbiddenExaggeration）
  generatedAt: string;
}

// PlatformAdaptationAgent 的输出：Platform Brief
export interface PlatformBrief {
  platformId: string;
  styleKeywords: string[];      // 平台表达风格
  bodyLengthAdvice: string;     // 内容长度建议
  tagAdvice: string;            // 标签建议
  ctaStyleAdvice: string;       // CTA 风格建议
  emojiPolicy: 'encouraged' | 'moderate' | 'minimal';
  language: 'zh' | 'en';
  tagRange: { min: number; max: number };
  bodyLengthRange: { min: number; max: number };
  generatedAt: string;
}

// ContentStrategyAgent 的输出：Content Strategy
export interface ContentStrategy {
  goalId: string;
  mainThread: string;           // 内容主线
  angle: string;                // 表达切口
  messageOrder: string[];       // 信息排序
  structureAdvice: string[];    // 结构建议
  generatedAt: string;
}

// ContentGenerationAgent 的输入
export interface GenerationContext {
  brand: Brand;
  product: Product;
  platform: Platform;
  goal: ContentGoal;
  productBrief: ProductBrief;
  platformBrief: PlatformBrief;
  contentStrategy: ContentStrategy;
}

// ReviewAgent 的输入
export interface ReviewContext {
  brand: Brand;
  product: Product;
  platform: Platform;
  goal: ContentGoal;
  productBrief: ProductBrief;
  platformBrief: PlatformBrief;
  contentStrategy: ContentStrategy;
}
