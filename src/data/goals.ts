import { ContentGoal } from '@/engine/types';

// 种草帖目标
export const seedingPost: ContentGoal = {
  id: 'goal_seeding',
  name: '种草帖',
  description: '突出使用场景与真实体验感',
  focusPoints: ['场景化开头', '卖点融入体验', '真实感受', '互动 CTA'],
};

// 新品介绍目标
export const newProductIntro: ContentGoal = {
  id: 'goal_new_product',
  name: '新品介绍',
  description: '突出产品定位与核心卖点',
  focusPoints: ['产品定位', '核心卖点', '适用人群', '购买引导'],
};

// 全部内容目标列表
export const goals: ContentGoal[] = [seedingPost, newProductIntro];
