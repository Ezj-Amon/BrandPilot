// BrandPilot 本地 Agent Engine 入口
// 5 个 Agent 模块串联组成内容生产与审核流水线：
//   ProductKnowledgeAgent → PlatformAdaptationAgent → ContentStrategyAgent
//   → ContentGenerationAgent → ReviewAgent
//
// 当前为参赛 MVP，使用本地规则驱动，暂未接入真实大模型 API。
// 后续可将 ContentGenerationAgent 与 ReviewAgent 替换为真实大模型调用。

export { runProductKnowledgeAgent } from './productKnowledgeAgent';
export { runPlatformAdaptationAgent } from './platformAdaptationAgent';
export { runContentStrategyAgent } from './contentStrategyAgent';
export { runContentGenerationAgent } from './contentGenerationAgent';
export { runReviewAgent } from './reviewAgent';

export type {
  ProductBrief,
  PlatformBrief,
  ContentStrategy,
  GenerationContext,
  ReviewContext,
} from './types';
