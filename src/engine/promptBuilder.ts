import { Brand, Product, Platform, ContentGoal, PromptContext } from '@/engine/types';

// 组装 Prompt 上下文，供生成器使用
export function buildPromptContext(
  brand: Brand,
  product: Product,
  platform: Platform,
  goal: ContentGoal
): PromptContext {
  return { brand, product, platform, goal };
}
