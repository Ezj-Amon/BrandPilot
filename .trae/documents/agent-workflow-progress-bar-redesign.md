# 工作台 Agent 执行链路可视化重构计划

## 概述

将 Agent 执行链路从"集中在第四步展示"重构为"贯穿整个工作台流程的动态可视化"，通过**双轨进度条**（工作台步骤 + Agent 节点）和**每步 Agent 详情卡片**让用户在每一步都能感知到对应 Agent 的存在与状态，第四步的完整链路改为渐进式状态展示。

## 当前状态分析

### 工作台步骤与 Agent 的对应关系

| 工作台步骤 | 对应 Agent | Agent 在步骤中的语义 |
|-----------|-----------|---------------------|
| Step 1 产品资料 | Product Knowledge Agent | 用户选择产品时，Agent 读取产品资料库 |
| Step 2 选择平台 | Platform Adaptation Agent | 用户选择平台时，Agent 应用平台规则 |
| Step 3 内容目标 | Content Goal Agent | 用户选择目标时，Agent 确定内容结构 |
| Step 4 生成内容 | Content Generation Agent | 用户点击生成时，Agent 生成文案 |
| Step 5 发布前审核 | Review Agent | 用户查看审核时，Agent 输出审核结果 |

### 现有问题
1. 5 个 Agent 信息全部堆在第四步 `AgentExecutionChain` 中，前三步用户完全感知不到 Agent 的存在
2. `buildAgentRunNodes()` 将所有 Agent 状态硬编码为 `completed`，无动态感
3. 顶部 `ProgressBar` 只显示工作台步骤，与 Agent 编排毫无关联

### 关键文件
- `src/data/agents.ts` — Agent 定义、`buildAgentRunNodes()` 构建 5 个运行时节点
- `src/components/layout/ProgressBar.tsx` — 5 步进度条（仅工作台步骤）
- `src/components/workbench/AgentExecutionChain.tsx` — 时间线组件（第四步展示）
- `src/components/workbench/GenerateStep.tsx` — 第四步，调用 `buildAgentRunNodes` 并渲染 `AgentExecutionChain`
- `src/pages/WorkbenchPage.tsx` — 工作台容器，渲染 ProgressBar + 各步骤组件
- `src/store/workbenchStore.ts` — 状态管理，`WorkbenchStep = 1|2|3|4|5`

## Agent 状态推导逻辑

新增函数 `getAgentStatuses(step, contentGenerated)`，返回 5 个 Agent 的状态数组：

| 当前步骤 | contentGenerated | Agent 1 | Agent 2 | Agent 3 | Agent 4 | Agent 5 |
|---------|-------------------|---------|---------|---------|---------|---------|
| Step 1  | -                 | running | pending | pending | pending | pending |
| Step 2  | -                 | completed| running | pending | pending | pending |
| Step 3  | -                 | completed| completed| running | pending | pending |
| Step 4  | false             | completed| completed| completed| running | pending |
| Step 4  | true              | completed| completed| completed| completed| pending |
| Step 5  | -                 | completed| completed| completed| completed| completed |

规则：
- `i < step - 1` → `completed`（当前步骤之前的 Agent 均已完成）
- `i === step - 1` → 当前步骤的 Agent：
  - Step 4 时：`contentGenerated ? completed : running`
  - Step 5 时：`completed`
  - 其他步骤：`running`
- `i > step - 1` → `pending`（后续步骤的 Agent 等待中）

## 实施方案

### 1. `src/data/agents.ts` — 新增状态推导函数 + 改造 buildAgentRunNodes

**新增导出函数：**
```ts
import { WorkbenchStep } from '@/store/workbenchStore';

// 根据当前步骤推导 5 个 Agent 的状态
export function getAgentStatuses(
  step: number,
  contentGenerated: boolean
): AgentStatus[] {
  const result: AgentStatus[] = [];
  for (let i = 0; i < 5; i++) {
    if (i < step - 1) {
      result.push('completed');
    } else if (i === step - 1) {
      if (step === 4) {
        result.push(contentGenerated ? 'completed' : 'running');
      } else if (step === 5) {
        result.push('completed');
      } else {
        result.push('running');
      }
    } else {
      result.push('pending');
    }
  }
  return result;
}
```

**改造 `buildAgentRunNodes`：** 增加可选参数 `statuses?: AgentStatus[]`，在返回前将状态应用到各节点：
```ts
export function buildAgentRunNodes(
  brand: Brand,
  product: Product,
  platform: Platform,
  goal: ContentGoal,
  statuses?: AgentStatus[]  // 新增
): AgentRunNode[] {
  // ... 现有构建逻辑不变，各节点仍默认 status: 'completed' ...
  const nodes: AgentRunNode[] = [ /* 现有 5 个节点 */ ];
  if (statuses) {
    return nodes.map((node, i) => ({ ...node, status: statuses[i] ?? node.status }));
  }
  return nodes;
}
```

### 2. `src/components/layout/ProgressBar.tsx` — 升级为双轨进度条

**Props 变更：**
```ts
interface ProgressBarProps {
  currentStep: 1 | 2 | 3 | 4 | 5
  agentStatuses: AgentStatus[]  // 新增：5 个 Agent 的状态
}
```

**布局结构：** 两行垂直排列，共享相同的 flex 结构以保持列对齐
- **上行（工作台步骤）**：保持现有设计不变 — 圆形数字 + 步骤标签 + 连接线
- **下行（Agent 节点）**：状态圆点 + Agent 中文名 + 连接线
  - 圆点颜色：`completed` = emerald-500 / `running` = amber-500 + animate-pulse / `pending` = gray-300
  - 圆点大小：w-2.5 h-2.5（比步骤圆小，视觉层级清晰）
  - Agent 名称：从 `AGENT_DEFINITIONS` 取 `nameZh`（产品知识 Agent / 平台适配 Agent / 内容目标 Agent / 内容生成 Agent / 发布前审核 Agent）
  - 连接线颜色：左侧 Agent 为 completed 时显示 emerald-200，否则 gray-200

**间距：** 两行之间 `space-y-2`，保持紧凑

### 3. `src/components/workbench/CurrentAgentCard.tsx` — 新增组件

在每一步内容区顶部展示当前步骤对应 Agent 的紧凑卡片。

**Props：**
```ts
interface CurrentAgentCardProps {
  step: WorkbenchStep
  brand: Brand
  product: Product
  platform: Platform
  goal: ContentGoal
  contentGenerated: boolean
}
```

**逻辑：**
1. 调用 `getAgentStatuses(step, contentGenerated)` 获取状态数组
2. 调用 `buildAgentRunNodes(brand, product, platform, goal, statuses)` 获取节点
3. 取 `nodes[step - 1]` 作为当前 Agent
4. 用 `useMemo` 缓存

**卡片设计：**
```
┌─────────────────────────────────────────────────────────────┐
│ [●运行中] Product Knowledge Agent · 产品知识 Agent          │
│                                                             │
│ 职责：读取产品资料库中的产品定位、目标用户、使用场景...      │
│ ┌─ 示例输出 ──────────────────────────────────────────────┐ │
│ │ 识别出「Voyage Pack」的内容重点是...                    │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ⓘ 当前 Demo 中产品资料来自静态数据，模拟 Agent 读取结果     │
└─────────────────────────────────────────────────────────────┘
```
- 左侧 4px 状态色边框（emerald / amber / gray）
- 状态徽章复用 `AgentExecutionChain` 中的 STATUS_BADGE 样式
- 示例输出区背景 indigo-50（与 AgentExecutionChain 一致）

### 4. `src/pages/WorkbenchPage.tsx` — 集成双轨进度条 + Agent 卡片

**变更：**
- 导入 `getAgentStatuses`、`CurrentAgentCard`
- 计算 `agentStatuses = getAgentStatuses(state.step, !!state.generatedContent)`
- 传 `agentStatuses` 给 `ProgressBar`
- 在 `<main>` 内、各步骤组件之前渲染 `CurrentAgentCard`：

```tsx
<main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
  {/* 当前步骤对应的 Agent 详情卡片 */}
  <div className="mb-6">
    <CurrentAgentCard
      step={state.step}
      brand={state.brand}
      product={state.product}
      platform={state.platform}
      goal={state.goal}
      contentGenerated={!!state.generatedContent}
    />
  </div>

  {/* 各步骤组件... */}
  {state.step === 1 && <ProductStep ... />}
  ...
</main>
```

### 5. `src/components/workbench/GenerateStep.tsx` — 渐进式状态

**变更：**
- 导入 `getAgentStatuses`
- 将 `buildAgentRunNodes` 调用改为传入渐进式状态：
```tsx
const agentStatuses = getAgentStatuses(4, !!content);
const agentNodes = useMemo(
  () => buildAgentRunNodes(brand, product, platform, goal, agentStatuses),
  [brand, product, platform, goal, content]
);
```
- `AgentExecutionChain` 仍在 `content !== null` 时渲染（生成后展示完整链路，此时 Agent 4 = completed、Agent 5 = pending）

### 6. `src/components/workbench/AgentExecutionChain.tsx` — 动态摘要文案

**变更：**
- 头部摘要文案从硬编码"全部 Completed"改为根据实际状态动态计算：
```tsx
const completedCount = nodes.filter(n => n.status === 'completed').length;
const runningCount = nodes.filter(n => n.status === 'running').length;
// 显示：共 5 个 Agent · {completedCount} 已完成 / {runningCount} 进行中
```
- 底部说明文案微调：强调"当前展示的 Agent 状态随工作台步骤动态变化"

## 假设与决策

1. **不修改各步骤组件内部**：`CurrentAgentCard` 由 `WorkbenchPage` 统一渲染，不需要改动 `ProductStep`、`PlatformStep`、`GoalStep`、`ReviewStep` 的内部代码
2. **AgentExecutionChain 保留在第四步**：生成内容后展示完整链路，作为详细视图；前三步的 Agent 感知由顶部进度条 + CurrentAgentCard 承载
3. **`buildAgentRunNodes` 向后兼容**：`statuses` 参数可选，不传时默认全部 completed，不影响其他调用方
4. **状态推导为纯前端逻辑**：基于 `step` 和 `contentGenerated` 推导，不涉及后端或真实 Agent 执行
5. **WorkbenchStep 类型导入**：`getAgentStatuses` 参数用 `number` 类型以避免 agents.ts 对 store 的循环依赖（store 已导入 data 层），实际调用时传入 `WorkbenchStep`

## 验证步骤

1. **步骤 1**：页面顶部双轨进度条显示步骤 1 高亮，Agent 1 圆点为琥珀色脉动（running），其余为灰色（pending）；内容区顶部显示 Product Knowledge Agent 卡片
2. **步骤 2**：Agent 1 圆点变绿色（completed），Agent 2 变琥珀色（running）；卡片切换为 Platform Adaptation Agent
3. **步骤 3**：Agent 1-2 绿色，Agent 3 琥珀色；卡片切换为 Content Goal Agent
4. **步骤 4（未生成）**：Agent 1-3 绿色，Agent 4 琥珀色，Agent 5 灰色；卡片显示 Content Generation Agent（running）
5. **步骤 4（已生成）**：Agent 4 变绿色，Agent 5 仍灰色；AgentExecutionChain 展示完整链路，Agent 4 = completed、Agent 5 = pending；摘要文案显示"4 已完成 / 0 进行中"
6. **步骤 5**：所有 Agent 圆点绿色；卡片显示 Review Agent（completed）
7. **`/workflow` 页面不受影响**：仍使用 `AGENT_DEFINITIONS` 和 `ARCHITECTURE_NODES`，不依赖 `buildAgentRunNodes`
8. **构建验证**：`npm run build` 无类型错误
