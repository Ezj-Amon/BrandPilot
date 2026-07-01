# Local Rule-Based Agent Engine Spec

## Why

当前 BrandPilot 的生成与审核是「模板查找 + 填空」模式：`mockGenerator` 从 `templates.ts` 按 `productId × platformId × goalId` 查找预写文案做占位符替换，审核是 6 条静态规则。这导致：不同组合之间缺乏真正的规则推导，Agent 面板只展示静态说明文本而非真实中间产物。需要升级为本地可运行的 Rule-based Agent Engine，让每个 Agent 计算真实的中间结果（Product Brief / Platform Brief / Content Strategy），生成基于规则差异化，审核基于生成内容动态判定。

## What Changes

- 新增 `src/agents/` 目录，包含 5 个 Agent 模块，各自计算结构化中间产物
- 新增 Brief / Strategy 类型定义到 `src/engine/types.ts`
- 新增 `src/agents/agentEngine.ts` 统一编排入口，串联 5 个 Agent
- 改造 `useWorkbench` hook：步骤 1-3 进入时分别调用前 3 个 Agent 生成 Brief/Strategy 并存入 state；步骤 4 生成时使用已计算的 Brief/Strategy
- 改造 `mockGenerator`：基于 Product Brief / Platform Brief / Content Strategy 按规则拼装文案，不同平台/目标产出不同风格（不再是单一模板查找）
- 改造 `reviewEngine`：审核项基于生成内容做规则判断（CTA 硬度、标签数量、场景词缺失、风险表达、卖点数量、平台风格），保留现有 6 条规则并新增基于 Brief/Strategy 的检查
- 改造 `CurrentAgentCard`：展示对应 Agent 的真实输出摘要（Product Brief / Platform Brief / Content Strategy 摘要），而非静态 sample 文本
- 更新首页 Hero MVP 声明文案，明确为「本地规则驱动的 Agent Workflow」

## Impact

- Affected specs: brandpilot-phase1-mvp（其 Engine 分层架构需求被扩展为 Agent Engine）
- Affected code:
  - 新增：`src/agents/`（5 个 Agent 模块 + agentEngine.ts）
  - 修改：`src/engine/types.ts`（新增 Brief/Strategy 类型）、`src/engine/mockGenerator.ts`（规则化生成）、`src/engine/reviewEngine.ts`（动态审核）、`src/store/workbenchStore.ts`（新增 briefs/strategy 字段）、`src/hooks/useWorkbench.ts`（分步调用 Agent）、`src/components/workbench/CurrentAgentCard.tsx`（展示真实输出）、`src/data/agents.ts`（buildAgentRunNodes 接收真实中间产物）、`src/components/home/Hero.tsx`（MVP 声明）

## ADDED Requirements

### Requirement: 本地 Agent Engine 模块
系统 SHALL 在 `src/agents/` 下提供 5 个独立 Agent 模块，每个 Agent 接收上游输入并计算结构化中间产物，不调用任何外部 API。

#### Scenario: ProductKnowledgeAgent 生成 Product Brief
- **WHEN** 步骤 1 选定产品（或进入工作台）
- **THEN** ProductKnowledgeAgent 基于当前产品资料 + 品牌资料计算 Product Brief，包含：产品定位、目标用户、使用场景、核心卖点、风险表达约束

#### Scenario: PlatformAdaptationAgent 生成 Platform Brief
- **WHEN** 步骤 2 选定平台
- **THEN** PlatformAdaptationAgent 基于 Product Brief + 平台规则计算 Platform Brief，包含：平台表达风格、内容长度建议、标签建议、CTA 风格建议

#### Scenario: ContentStrategyAgent 生成 Content Strategy
- **WHEN** 步骤 3 选定内容目标
- **THEN** ContentStrategyAgent 基于 Product Brief + Platform Brief + 内容目标计算 Content Strategy，包含：内容主线、表达切口、信息排序、结构建议

#### Scenario: ContentGenerationAgent 生成差异化文案
- **WHEN** 步骤 4 点击「生成内容」
- **THEN** ContentGenerationAgent 基于 Product Brief + Platform Brief + Content Strategy 生成标题/正文/标签/CTA/生成时间/Session ID，不同平台与不同内容目标产出不同风格结果

#### Scenario: ReviewAgent 基于生成内容做规则审核
- **WHEN** 内容生成完成
- **THEN** ReviewAgent 基于生成文案 + Brief + Strategy + 风险规则计算审核结果，至少检查：CTA 是否过硬、标签数量是否过少、文案是否缺少场景词、是否包含风险表达、卖点数量是否过多、是否符合平台内容风格

### Requirement: Agent 中间结果展示
系统 SHALL 在每一步的 Agent 面板中展示对应 Agent 的真实输出摘要，而非纯静态说明文本。

#### Scenario: 步骤 1 展示 Product Brief 摘要
- **WHEN** 用户在步骤 1
- **THEN** CurrentAgentCard 展示 ProductKnowledgeAgent 已计算的 Product Brief 摘要（定位/卖点/风险约束）

#### Scenario: 步骤 4 展示上游输入来源
- **WHEN** 用户在步骤 4 且已生成内容
- **THEN** GenerateStep 的上游摘要标签反映真实使用的 Brief/Strategy

### Requirement: MVP 透明说明
系统 SHALL 在首页保留明确说明当前版本为本地规则驱动的 Agent Workflow，未接入真实大模型 API。

#### Scenario: 首页声明可见
- **WHEN** 用户访问首页
- **THEN** Hero 区域显示「当前版本为参赛 MVP，使用本地规则驱动的 Agent Workflow 模拟 AI 内容生成与发布前审核流程，暂未接入真实大模型 API。后续版本可将 Content Generation Agent 与 Review Agent 替换为真实大模型调用」

## MODIFIED Requirements

### Requirement: Engine 分层架构（brandpilot-phase1-mvp）
原：engine 层包含 promptBuilder / mockGenerator / aiGenerator / generatorIndex / reviewEngine。
现：新增 `src/agents/` Agent Engine 层，engine 层的 mockGenerator 与 reviewEngine 改为调用 Agent 模块计算结果，promptBuilder 仍组装上下文。保留 generatorIndex 的 mock/ai 切换能力。

### Requirement: 审核规则（brandpilot-phase1-mvp）
原：6 条静态规则（绝对化用语、禁用词、标签数量、Instagram 语言、防泼水夸大、CTA 强销售）。
现：保留原 6 条 + 新增基于生成内容的动态规则（场景词缺失、卖点数量过多、平台风格匹配），审核结果基于真实生成内容判定。

## REMOVED Requirements
无（全部为新增与修改，不删除现有功能）。
