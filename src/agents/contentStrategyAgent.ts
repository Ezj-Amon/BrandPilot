// Content Strategy Agent
// 输入：Product Brief + Platform Brief + 用户选择的内容目标
// 输出：Content Strategy（内容主线、表达切口、信息排序、结构建议）

import { ContentGoal } from '@/engine/types';
import { ProductBrief, PlatformBrief, ContentStrategy } from './types';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 推导内容主线
function inferMainThread(goal: ContentGoal, productBrief: ProductBrief): string {
  const topPoints = productBrief.coreSellingPoints.slice(0, 2).join('与');
  switch (goal.id) {
    case 'goal_seeding':
      return `以「${productBrief.scenarios[0]}」真实体验为主线，自然融入${topPoints}`;
    case 'goal_new_product':
      return `以产品定位为主线，突出${productBrief.coreSellingPoints.slice(0, 3).join('、')}`;
    default:
      return `围绕「${goal.name}」展开，突出产品核心价值`;
  }
}

// 推导表达切口
function inferAngle(goal: ContentGoal): string {
  switch (goal.id) {
    case 'goal_seeding':
      return '从真实使用场景切入，先讲痛点再讲解决方案';
    case 'goal_new_product':
      return '从产品定位切入，先讲是什么再讲为什么需要';
    default:
      return '从用户关注点切入';
  }
}

// 推导信息排序
function inferMessageOrder(goal: ContentGoal, productBrief: ProductBrief): string[] {
  switch (goal.id) {
    case 'goal_seeding':
      return [
        `场景：${productBrief.scenarios[0]}`,
        `痛点：${productBrief.targetUsers[0]}的常见困扰`,
        ...productBrief.coreSellingPoints.slice(0, 3).map((s, i) => `卖点${i + 1}：${s}`),
        '互动引导',
      ];
    case 'goal_new_product':
      return [
        `定位：${productBrief.positioning}`,
        ...productBrief.coreSellingPoints.slice(0, 4).map((s, i) => `卖点${i + 1}：${s}`),
        `适用人群：${productBrief.targetUsers.join('、')}`,
        '购买引导',
      ];
    default:
      return [...productBrief.coreSellingPoints];
  }
}

// 推导结构建议
function inferStructureAdvice(goal: ContentGoal, platformBrief: PlatformBrief): string[] {
  const advice: string[] = [];
  switch (goal.id) {
    case 'goal_seeding':
      advice.push('开头场景化，用一个具体的出行画面引入');
      advice.push('卖点融入体验过程，避免罗列');
      advice.push('结尾设置互动问题，引导评论');
      break;
    case 'goal_new_product':
      advice.push('开头明确产品定位与适用人群');
      advice.push('卖点逐条展开，每条配一句场景说明');
      advice.push('结尾给出明确的了解/购买引导');
      break;
  }
  if (platformBrief.language === 'en') {
    advice.push('正文以英文为主，中文占比不超过 30%');
  }
  if (platformBrief.emojiPolicy === 'moderate') {
    advice.push('适度使用 emoji 增加亲和力');
  } else if (platformBrief.emojiPolicy === 'minimal') {
    advice.push('emoji 尽量少用，保持品牌质感');
  }
  return advice;
}

// 生成 Content Strategy
export async function runContentStrategyAgent(
  productBrief: ProductBrief,
  platformBrief: PlatformBrief,
  goal: ContentGoal,
): Promise<ContentStrategy> {
  await delay(300);

  return {
    goalId: goal.id,
    mainThread: inferMainThread(goal, productBrief),
    angle: inferAngle(goal),
    messageOrder: inferMessageOrder(goal, productBrief),
    structureAdvice: inferStructureAdvice(goal, platformBrief),
    generatedAt: new Date().toISOString(),
  };
}
