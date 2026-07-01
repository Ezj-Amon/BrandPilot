import { ContentGoal, ContentStrategy, PlatformBrief, ProductBrief } from '@/engine/types';

// Content Strategy Agent：基于 Product Brief + Platform Brief + 内容目标计算内容策略
export function runContentStrategy(
  _productBrief: ProductBrief,
  _platformBrief: PlatformBrief,
  goal: ContentGoal,
): ContentStrategy {
  switch (goal.id) {
    case 'goal_seeding':
      return {
        mainThread: '场景体验驱动',
        angle: '真实使用场景切入痛点',
        infoOrder: ['场景化开头', '卖点融入体验', '真实感受', '互动CTA'],
        structureAdvice: '开头场景化引入 → 卖点融入体验 → 真实感受总结 → 互动CTA',
      };
    case 'goal_new_product':
      return {
        mainThread: '产品定位驱动',
        angle: '产品定位与核心卖点',
        infoOrder: ['产品定位', '核心卖点', '适用人群', '购买引导'],
        structureAdvice: '定位引入 → 核心卖点分点 → 适用人群 → 购买引导CTA',
      };
    default:
      return {
        mainThread: `按「${goal.name}」目标确定内容主线`,
        angle: `按「${goal.name}」目标确定表达切口`,
        infoOrder: goal.focusPoints,
        structureAdvice: `按「${goal.name}」目标确定内容结构`,
      };
  }
}
