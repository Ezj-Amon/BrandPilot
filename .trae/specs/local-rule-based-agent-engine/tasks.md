# Tasks

- [x] Task 1: 定义 Agent 中间产物类型
  - [x] SubTask 1.1: 在 `src/engine/types.ts` 新增 ProductBrief、PlatformBrief、ContentStrategy 接口（产品定位/目标用户/使用场景/核心卖点/风险表达；平台表达风格/内容长度建议/标签建议/CTA 风格建议；内容主线/表达切口/信息排序/结构建议）
  - [x] SubTask 1.2: 扩展 PromptContext 或新增 AgentContext 类型，承载 Brief/Strategy 链路，供生成与审核消费

- [x] Task 2: 实现 5 个 Agent 模块
  - [x] SubTask 2.1: 新建 `src/agents/productKnowledgeAgent.ts`，输入产品+品牌，输出 ProductBrief（从 product.facts 提取风险表达、从 coreSellingPoints 提取卖点、从 targetUsers 提取场景）
  - [x] SubTask 2.2: 新建 `src/agents/platformAdaptationAgent.ts`，输入 ProductBrief+Platform，输出 PlatformBrief（按 platform.id 映射表达风格、用 tagRange/bodyLengthRange/ctaStyle 生成建议）
  - [x] SubTask 2.3: 新建 `src/agents/contentStrategyAgent.ts`，输入 ProductBrief+PlatformBrief+ContentGoal，输出 ContentStrategy（按 goal.id 映射内容主线/信息排序/结构建议，区分种草帖 vs 新品介绍）
  - [x] SubTask 2.4: 新建 `src/agents/contentGenerationAgent.ts`，输入三个 Brief/Strategy，按平台语言(zh/en)与目标风格规则拼装标题/正文/标签/CTA，不同组合产出不同结果，生成 Session ID 与时间戳
  - [x] SubTask 2.5: 新建 `src/agents/reviewAgent.ts`，输入生成内容+三个 Brief/Strategy+风险规则，输出 ReviewResult（保留原 6 条 + 新增场景词缺失/卖点过多/平台风格匹配检查）

- [x] Task 3: 实现 Agent Engine 编排入口
  - [x] SubTask 3.1: 新建 `src/agents/agentEngine.ts`，导出 runProductKnowledge / runPlatformAdaptation / runContentStrategy / runContentGeneration / runReview 函数，各自调用对应 Agent 模块

- [x] Task 4: 改造工作台状态与流程对接
  - [x] SubTask 4.1: 在 `src/store/workbenchStore.ts` 的 WorkbenchState 新增 productBrief / platformBrief / contentStrategy 字段（初始 null），新增对应 action（SET_PRODUCT_BRIEF / SET_PLATFORM_BRIEF / SET_CONTENT_STRATEGY）
  - [x] SubTask 4.2: 在 `src/hooks/useWorkbench.ts` 中，SET_PRODUCT 后调用 runProductKnowledge 生成 ProductBrief 并 dispatch；SET_PLATFORM 后调用 runPlatformAdaptation 生成 PlatformBrief；SET_GOAL 后调用 runContentStrategy 生成 ContentStrategy
  - [x] SubTask 4.3: 改造 generate()：使用 state 中的 Brief/Strategy 调用 runContentGeneration 生成内容，调用 runReview 生成审核

- [x] Task 5: 改造生成器与审核引擎复用 Agent
  - [x] SubTask 5.1: useWorkbench 直接调用 agentEngine（runContentGeneration），mockGenerator 保留但不再被工作台使用
  - [x] SubTask 5.2: reviewAgent 复用 engine/rules/* 规则并新增 3 条动态规则

- [x] Task 6: 改造 Agent 面板展示真实输出
  - [x] SubTask 6.1: 改造 `src/components/workbench/CurrentAgentCard.tsx`，接收 productBrief/platformBrief/contentStrategy/generatedContent/reviewResult，展示对应 Agent 的真实输出摘要（步骤 1 展示 Brief 摘要、步骤 2 展示 Platform Brief、步骤 3 展示 Strategy、步骤 4 展示上游来源、步骤 5 展示审核依据）
  - [x] SubTask 6.2: WorkbenchPage 传入 5 个新 props；data/agents.ts 保持不变（静态元数据仍用于职责/输入/输出展示）

- [x] Task 7: 更新 MVP 声明文案
  - [x] SubTask 7.1: 更新 `src/components/home/Hero.tsx` 的 MVP 声明为「当前版本为参赛 MVP，使用本地规则驱动的 Agent Workflow 模拟 AI 内容生成与发布前审核流程，暂未接入真实大模型 API。后续版本可将 Content Generation Agent 与 Review Agent 替换为真实大模型调用」

- [x] Task 8: 构建验证
  - [x] SubTask 8.1: 运行 `npm run build`，确认 tsc + vite build 无错误（76 模块，exit code 0）

# Task Dependencies
- Task 2 depends on Task 1（Agent 模块需要类型定义）
- Task 3 depends on Task 2（编排入口调用 Agent 模块）
- Task 4 depends on Task 3（store/hook 调用 agentEngine）
- Task 5 depends on Task 2、Task 3（mockGenerator/reviewEngine 复用 Agent 逻辑）
- Task 6 depends on Task 4（展示真实 Brief/Strategy 需 state 已有数据）
- Task 7 无依赖，可与 Task 2-6 并行
- Task 8 depends on all
