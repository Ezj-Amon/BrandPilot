# 进度条节点可点击 + Agent 状态细化（输入就绪）

## 概述

两项调整：
1. 顶部 5 步进度条节点可点击，但仅「前置节点」（已完成、在当前步骤之前的步骤）可点击导航回去；当前步骤与未到达的后续节点不可点。
2. 细化 Agent 状态：步骤 1-3 当前 Agent 不再永远显示「等待输入」，新增「输入就绪」中间态——用户在当前步骤发生任何交互（选产品/平台/目标，或编辑产品/品牌字段）后即变为「输入就绪」；只有点击「下一步」离开该步后才变为「已完成」。所有涉及 Agent 状态的展示（侧边栏卡片、底部进度摘要）均需同步。

## 当前状态分析

### 状态推导（`src/data/agents.ts`）
`getAgentStatuses(step, contentGenerated, loading)` 当前逻辑：
- 前序步骤 → `completed`
- 当前步骤 1-3 → 永远 `waiting`（**问题所在**）
- 当前步骤 4 → `waiting` / `running` / `completed`
- 当前步骤 5 → `completed`
- 后续步骤 → `pending`

`AgentStatus` 类型：`'pending' | 'waiting' | 'running' | 'completed'`（缺 `ready`）。

### 状态消费点（需全部同步，用户明确要求「检查完全」）
- [src/pages/WorkbenchPage.tsx](file:///workspace/src/pages/WorkbenchPage.tsx#L29)：计算 `agentStatuses`，传给 `AgentProgressSummary`；并把状态相关 props 传给 `CurrentAgentCard`。
- [src/components/workbench/CurrentAgentCard.tsx](file:///workspace/src/components/workbench/CurrentAgentCard.tsx#L52)：自行调用 `getAgentStatuses` + `buildAgentRunNodes`，取 `nodes[step-1]`。`STATUS_BADGE` 是 `Record<AgentStatus, ...>`。
- [src/components/workbench/AgentProgressSummary.tsx](file:///workspace/src/components/workbench/AgentProgressSummary.tsx#L9)：`STATUS_META` 是 `Record<AgentStatus, ...>`。
- [src/components/workbench/AgentExecutionChain.tsx](file:///workspace/src/components/workbench/AgentExecutionChain.tsx#L8)：`STATUS_BADGE` 是 `Record<AgentRunNode['status'], ...>`（死代码，未被任何组件 import，但参与 `tsc` 类型检查，必须补全 `ready`）。

### 进度条（`src/components/layout/ProgressBar.tsx`）
单轨 5 步，节点为纯展示 `<div>`，无 `onClick`、无 `onStepClick` prop。

### 交互来源（确认「任何交互」可被捕获）
- 步骤 1：`ProductSelector` 点产品卡片 → `onProductSelect` → `SET_PRODUCT`；`ProductEditor` 编辑 → `onBrandChange`/`onProductChange` → `UPDATE_BRAND`/`UPDATE_PRODUCT`。
- 步骤 2：`PlatformStep` 点平台 Tab → `onSelect` → `SET_PLATFORM`。
- 步骤 3：`GoalStep` 点目标卡片 → `onSelect` → `SET_GOAL`。
- 这些 action 均在 `workbenchStore.ts` 的 reducer 中处理，是挂载「标记就绪」逻辑的唯一入口。

### 默认值注意
步骤 1-3 有预选默认值（Voyage Pack / 小红书 / 种草帖）。按用户确认：进入步骤时初始为「等待输入」，发生交互后才变「输入就绪」（不因默认值预选而直接就绪）。

## 实施方案

### 1. `src/store/workbenchStore.ts` — 新增 stepInputsReady 状态

在 `WorkbenchState` 增加：
```ts
stepInputsReady: Record<number, boolean>;
```

初始状态 `initialWorkbenchState` 增加：
```ts
stepInputsReady: {},
```

reducer 在以下 action 中标记对应步骤就绪（**持久化，导航不重置**，仅 `RESET` 清空）：
- `SET_PRODUCT` / `UPDATE_PRODUCT` / `UPDATE_BRAND` → `stepInputsReady: { ...state.stepInputsReady, 1: true }`
- `SET_PLATFORM` → 同上置 `2: true`（保留其清空 `generatedContent`/`reviewResult` 的现有行为）
- `SET_GOAL` → 同上置 `3: true`（保留其清空 `generatedContent`/`reviewResult` 的现有行为）
- `RESET` → 回到 `initialWorkbenchState`（自动清空）

> 注意：`SET_STEP`（点击进度条节点 / 点下一步）**不**改 `stepInputsReady`，保证「回看某步时该步仍显示已就绪/已完成」。

### 2. `src/data/agents.ts` — 新增 ready 状态 + 改造 getAgentStatuses

类型扩展：
```ts
export type AgentStatus = 'pending' | 'waiting' | 'ready' | 'running' | 'completed';
```

函数签名增加 `stepInputsReady` 参数：
```ts
export function getAgentStatuses(
  step: number,
  contentGenerated: boolean,
  loading: boolean = false,
  stepInputsReady: Record<number, boolean> = {}
): AgentStatus[]
```

当前步骤分支（步骤 1-3）改为：
```ts
result.push(stepInputsReady[step] ? 'ready' : 'waiting');
```
步骤 4 保持：`loading ? 'running' : contentGenerated ? 'completed' : 'waiting'`。步骤 5 保持 `completed`。前序 `completed`、后续 `pending` 不变。

### 3. `src/components/layout/ProgressBar.tsx` — 节点可点击（仅前置节点）

Props 增加：
```ts
interface ProgressBarProps {
  currentStep: 1 | 2 | 3 | 4 | 5
  onStepClick?: (step: 1 | 2 | 3 | 4 | 5) => void
}
```

每个节点：`canClick = onStepClick && step < currentStep`。
- `canClick` 时：外层包 `button`（或加 `role="button"` + onClick），`cursor-pointer`，`hover:ring-2 hover:ring-indigo-200 hover:bg-indigo-50 rounded-full`，`title={`返回第${step}步：${label}`}`，点击调 `onStepClick(step)`。
- 不可点击（当前/未来）：保持现样式，`cursor-default`，无 onClick。

### 4. `src/pages/WorkbenchPage.tsx` — 串接

- 计算：`const agentStatuses = getAgentStatuses(state.step, !!state.generatedContent, state.loading, state.stepInputsReady);`
- `<ProgressBar currentStep={state.step} onStepClick={setStep} />`
- `<CurrentAgentCard ... stepInputsReady={state.stepInputsReady} />`
- `<AgentProgressSummary statuses={agentStatuses} />`（已是这样，statuses 来源更新即可）

### 5. `src/components/workbench/CurrentAgentCard.tsx` — 接收就绪信息 + 补 ready 样式

- Props 增加 `stepInputsReady: Record<number, boolean>`。
- `getAgentStatuses` 调用改为 `getAgentStatuses(step, contentGenerated, loading, stepInputsReady)`。
- `STATUS_BADGE` 增加 `ready`：
```ts
ready: { label: '输入就绪', dotClass: 'bg-indigo-500', badgeClass: 'bg-indigo-100 text-indigo-700' },
```

### 6. `src/components/workbench/AgentProgressSummary.tsx` — 补 ready 样式

`STATUS_META` 增加：
```ts
ready: { label: '输入就绪', dot: 'bg-indigo-500', text: 'text-indigo-600' },
```

### 7. `src/components/workbench/AgentExecutionChain.tsx` — 补 ready 类型（死代码，仅过 tsc）

`STATUS_BADGE` 增加占位：
```ts
ready: { label: 'Ready', className: 'bg-indigo-100 text-indigo-700' },
```

## 假设与决策

1. **「前置节点」= 严格小于当前步骤的已完成步骤**（`step < currentStep`）。当前步骤节点本身不可点（用户已在该步）；未来节点不可点。
2. **「任何交互」的判定挂在 store action 上**：`SET_PRODUCT`/`UPDATE_PRODUCT`/`UPDATE_BRAND` 标记步骤 1；`SET_PLATFORM` 标记步骤 2；`SET_GOAL` 标记步骤 3。步骤 4 的交互是「点生成内容」，其状态走 `waiting→running→completed`，不使用 `ready`。
3. **`stepInputsReady` 持久化，导航不重置**：用户从步骤 2 退回步骤 1 时，步骤 1 仍显示「输入就绪」（曾交互过）；只有 `RESET` 清空。这样回看时状态符合直觉。
4. **默认值预选不等于就绪**：进入步骤 1 时即使 Voyage Pack 已预选，仍显示「等待输入」，直到用户发生交互。符合用户描述「当用户选择了…之后状态应该更新」。
5. **不改动各步骤组件内部交互逻辑**，只改 store reducer + 状态推导 + 展示层。
6. **`ready` 视觉用 indigo**，区别于 `waiting`(灰) 与 `completed`(emerald)。
7. 不接入真实 AI、不新增功能，仅状态细化与可点击导航。

## 验证步骤

1. `npm run build` 通过（`tsc && vite build`，无类型错误，特别注意 3 个 `Record<AgentStatus,...>` 均补全 `ready`）。
2. 步骤 1 进入：侧边栏卡片与底部摘要中 Product Knowledge Agent 显示「等待输入」。
3. 步骤 1 点任意产品卡片或编辑产品字段 → 状态变为「输入就绪」(indigo)。
4. 点「下一步」到步骤 2 → Agent 1 变「已完成」(emerald)，Agent 2「等待输入」。
5. 步骤 2 点平台 Tab → Agent 2「输入就绪」；步骤 3 点目标卡片 → Agent 3「输入就绪」。
6. 从步骤 3 退回步骤 1（点进度条节点 1）→ Agent 1 仍「已完成」（持久化），步骤 1 内容可编辑。
7. 步骤 4 未生成「等待输入」→ 点生成(loading)「运行中」→ 完成后「已完成」。
8. 进度条节点：仅 1..currentStep-1 可点击（cursor-pointer + hover ring），当前/未来节点不可点。
9. 点击可点节点能正确导航回对应步骤。
