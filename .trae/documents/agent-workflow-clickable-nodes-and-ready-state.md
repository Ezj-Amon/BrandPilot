# 进度条节点可点击 + Agent 状态机重构（待确认/输入就绪/已完成）

## 概述

两项功能 + 状态架构重构：
1. 顶部 5 步进度条节点可点击，但仅「前置节点」（`step < currentStep`，已完成）可点击导航回去；当前步骤与未到达节点不可点。
2. Agent 状态从「只依赖 step/contentGenerated/loading 推导」重构为「显式 per-step 状态机」作为唯一真相源，并细化状态语义：
   - `pending`（未开始）/ `pending_confirm`（待确认）/ `ready`（输入就绪）/ `running`（运行中）/ `completed`（已完成）
3. 第四步保持不展示完整 Agent 链路（沿用上一轮方向，本次不改动 GenerateStep 结构）。

## 当前状态分析

### 状态推导（问题根源）
[src/data/agents.ts](file:///workspace/src/data/agents.ts#L122) 的 `getAgentStatuses(step, contentGenerated, loading)` 把所有状态从 step 派生：
- 当前步骤 1-3 永远 `waiting` → 与界面已预选默认值矛盾（用户反馈点 1）。
- 无「待确认」「输入就绪」中间态。
- 无 per-step 真相源，下游失效需手工清字段（用户反馈点 2、4）。

### 状态消费点（需全量同步，用户要求「检查完全」）
- [src/pages/WorkbenchPage.tsx](file:///workspace/src/pages/WorkbenchPage.tsx#L29)：`getAgentStatuses(...)` 计算后传给 `AgentProgressSummary` 与 `CurrentAgentCard`。
- [src/components/workbench/CurrentAgentCard.tsx](file:///workspace/src/components/workbench/CurrentAgentCard.tsx#L52)：自调 `getAgentStatuses` + `buildAgentRunNodes` 取 `nodes[step-1]`，`STATUS_BADGE` 为 `Record<AgentStatus,...>`。
- [src/components/workbench/AgentProgressSummary.tsx](file:///workspace/src/components/workbench/AgentProgressSummary.tsx#L9)：`STATUS_META` 为 `Record<AgentStatus,...>`。
- [src/components/workbench/AgentExecutionChain.tsx](file:///workspace/src/components/workbench/AgentExecutionChain.tsx#L8)：死代码（无 import），但参与 `tsc`，`STATUS_BADGE` 为 `Record<AgentRunNode['status'],...>`。

### store（[src/store/workbenchStore.ts](file:///workspace/src/store/workbenchStore.ts)）
- 现有 actions：`SET_STEP`/`SET_PRODUCT`/`UPDATE_PRODUCT`/`UPDATE_BRAND`/`SET_PLATFORM`/`SET_GOAL`/`GENERATE_START`/`GENERATE_SUCCESS`/`GENERATE_ERROR`/`RESET`。
- 现有失效：仅 `SET_PLATFORM`/`SET_GOAL` 清 `generatedContent`/`reviewResult`；`SET_PRODUCT`/`UPDATE_*` **不清**（用户反馈点 2 漏洞）。
- 无 per-step 状态字段。

### 可编辑字段（用于「输入有效性」判定，用户反馈点 3）
[src/components/product/ProductEditor.tsx](file:///workspace/src/components/product/ProductEditor.tsx) 在步骤 1 可编辑：`brand.name`、`product.name`、`product.type`、`product.coreSellingPoints`、`brand.bannedWords`。其中前 4 项为必填（bannedWords 可空）。步骤 2/3 为固定列表选择，选中即有效。

### 默认值（用户反馈点 1）
步骤 1-3 初始均有预选值（Voyage Pack / 小红书 / 种草帖），但用户未交互确认 → 用 `pending_confirm`（待确认）表达，消除「已选中却显示等待输入」的矛盾。

## 实施方案

### 1. `src/data/agents.ts` — 重定义状态联合 + 移除派生函数

```ts
// 5 态状态机：per-step 真相源
export type AgentStatus =
  | 'pending'          // 未开始（未到达）
  | 'pending_confirm'  // 待确认（有默认值/已到达但用户未有效交互）
  | 'ready'            // 输入就绪（有效交互 + 输入有效）
  | 'running'          // 运行中（生成中）
  | 'completed';       // 已完成
```

- **移除** `getAgentStatuses`（不再从 step 派生）。
- 保留 `buildAgentRunNodes(brand, product, platform, goal, statuses?)`（CurrentAgentCard 仍需用它取节点详情，statuses 由 store 传入）。

### 2. `src/store/workbenchStore.ts` — 引入 stepStatuses 真相源

类型与初始状态：
```ts
import { AgentStatus } from '@/data/agents';

export interface WorkbenchState {
  // ...现有字段
  stepStatuses: Record<WorkbenchStep, AgentStatus>; // 新增：唯一真相源
}

export const initialWorkbenchState: WorkbenchState = {
  // ...现有
  stepStatuses: { 1: 'pending_confirm', 2: 'pending', 3: 'pending', 4: 'pending', 5: 'pending' },
};
```
> 步骤 1 初始为 `pending_confirm`（有默认产品但未交互）；2-5 未到达 `pending`。

**输入有效性判定（用户反馈点 3）：**
```ts
function isStep1InputValid(brand: Brand, product: Product): boolean {
  return (
    brand.name.trim() !== '' &&
    product.name.trim() !== '' &&
    product.type.trim() !== '' &&
    product.coreSellingPoints.length > 0
  );
}
```

**reducer 转换规则（核心）：**

| Action | stepStatuses 变更 | 其它 |
|---|---|---|
| `SET_PRODUCT` | 1: `isStep1InputValid? ready : pending_confirm`；4,5 → `pending` | product 更新；清 generatedContent/reviewResult |
| `UPDATE_PRODUCT`/`UPDATE_BRAND` | 同上（按新值判定 1） | 同上 |
| `SET_PLATFORM` | 2 → `ready`；4,5 → `pending` | platform 更新；清 generatedContent/reviewResult（沿用） |
| `SET_GOAL` | 3 → `ready`；4,5 → `pending` | goal 更新；清 generatedContent/reviewResult（沿用） |
| `SET_STEP`（N） | 若 `N > prev`（前进/下一步）：`prev → completed`；若 `stepStatuses[N]==='pending'` 则提升：1-3→`pending_confirm`、4→`ready`、5→`completed` | 仅前进完成左步；后退不改状态 |
| `GENERATE_START` | 4 → `running` | loading=true |
| `GENERATE_SUCCESS` | 4 → `completed`；5 → `completed` | 设 content/review；step 保持 4 |
| `GENERATE_ERROR` | 4 → `ready`（可重试） | loading=false |
| `RESET` | 回到 initial | 全部重置 |

> 用户反馈点 2（下游失效）：任何 1/2/3 的修改都把 4,5 → `pending` 并清 content/review，且依赖链只影响 4,5（2,3 互相独立，修改产品不影响平台/目标，保持原状态）。

### 3. `src/components/layout/ProgressBar.tsx` — 前置节点可点击

```ts
interface ProgressBarProps {
  currentStep: 1 | 2 | 3 | 4 | 5
  onStepClick?: (step: 1 | 2 | 3 | 4 | 5) => void
}
```
每个节点：`canClick = !!onStepClick && step < currentStep`。
- 可点：`cursor-pointer`，`hover:ring-2 hover:ring-indigo-200 hover:bg-indigo-50 rounded-full`，`title={`返回第${step}步`}`，onClick → `onStepClick(step)`。
- 不可点（当前/未来）：保持样式，`cursor-default`，无 onClick。
> 进度条仅能向后导航（点已完成步骤回看）；前进只能通过各步「下一步」按钮。

### 4. `src/pages/WorkbenchPage.tsx` — 从 stepStatuses 派生 + 串接

```ts
// 真相源直接转数组（1-1 映射 agent i ↔ step i）
const agentStatuses: AgentStatus[] = ([1,2,3,4,5] as WorkbenchStep[]).map(i => state.stepStatuses[i]);

<ProgressBar currentStep={state.step} onStepClick={setStep} />
<CurrentAgentCard step={state.step} brand={...} product={...} platform={...} goal={...} statuses={agentStatuses} />
<AgentProgressSummary statuses={agentStatuses} />
```
> 移除 `getAgentStatuses` 调用；agentStatuses 完全来自 `state.stepStatuses`。

### 5. `src/components/workbench/CurrentAgentCard.tsx` — 接收 statuses + 补全状态映射

- Props 改为 `statuses: AgentStatus[]`（移除 `contentGenerated`/`loading`，不再自调 `getAgentStatuses`）。
- `useMemo`：`buildAgentRunNodes(brand, product, platform, goal, statuses)` → `nodes[step-1]`。
- `STATUS_BADGE` 补全 5 态：
```ts
pending: { label:'未开始', dotClass:'bg-gray-300', badgeClass:'bg-gray-100 text-gray-500' },
pending_confirm: { label:'待确认', dotClass:'bg-gray-400', badgeClass:'bg-gray-100 text-gray-600' },
ready: { label:'输入就绪', dotClass:'bg-indigo-500', badgeClass:'bg-indigo-100 text-indigo-700' },
running: { label:'运行中', dotClass:'bg-amber-500 animate-pulse', badgeClass:'bg-amber-100 text-amber-700' },
completed: { label:'已完成', dotClass:'bg-emerald-500', badgeClass:'bg-emerald-100 text-emerald-700' },
```

### 6. `src/components/workbench/AgentProgressSummary.tsx` — 补全 STATUS_META

```ts
pending: { label:'未开始', dot:'bg-gray-300', text:'text-gray-400' },
pending_confirm: { label:'待确认', dot:'bg-gray-400', text:'text-gray-500' },
ready: { label:'输入就绪', dot:'bg-indigo-500', text:'text-indigo-600' },
running: { label:'运行中', dot:'bg-amber-500 animate-pulse', text:'text-amber-600' },
completed: { label:'已完成', dot:'bg-emerald-500', text:'text-emerald-600' },
```

### 7. `src/components/workbench/AgentExecutionChain.tsx` — 补全 STATUS_BADGE（死代码过 tsc）

补 `pending_confirm`/`ready` 占位项。

### 8. `src/components/workbench/GenerateStep.tsx` — 不改动（用户反馈点 5）

保持上一轮结果：第四步仅展示 Content Generation Agent（侧边栏）、上游输入摘要标签、生成结果，**不渲染** `AgentExecutionChain`。本次不改动此文件。

## 假设与决策

1. **5 个 Agent 与 5 个步骤 1:1 映射**：agent i 的状态 = `stepStatuses[step i]`。因此移除 `getAgentStatuses`，状态完全由 `stepStatuses` 驱动（用户反馈点 4）。
2. **「待确认」解决默认值矛盾**（用户反馈点 1）：进入步骤 1-3 时即便有预选默认值，也显示 `pending_confirm`（待确认），而非「等待输入」，消除界面已选中却显示等待输入的矛盾。
3. **`ready` 需有效交互 + 输入有效**（用户反馈点 3）：步骤 1 用 `isStep1InputValid`（brand.name/product.name/product.type/coreSellingPoints 非空）判定；步骤 2/3 为固定列表选择，选中即有效 → `ready`。
4. **下游失效**（用户反馈点 2）：SET_PRODUCT/UPDATE_*/SET_PLATFORM/SET_GOAL 均将 4,5 → `pending` 并清 generatedContent/reviewResult；2,3 互相独立，修改产品不影响平台/目标状态。
5. **前进才完成左步**：`SET_STEP` 仅当 `N > prev`（即「下一步」前进）时把左步置 `completed`；后退/进度条回看不改状态，保留「已完成」便于回看。
6. **`下一步` 不加有效性闸门**：保持现有可前进行为；`ready` 仅影响状态显示，不阻塞导航（避免超出本次范围）。如未来需闸门可再扩展。
7. **step 4 到达即 `ready`**：上游 1-3 已完成，输入就绪，点「生成内容」→ `running` → `completed`。
8. **不接入真实 AI、不新增功能**，仅状态机重构 + 可点击导航 + 保持第 4 步无完整链路。

## 验证步骤

1. `npm run build` 通过（`tsc && vite build`，3 个 `Record<AgentStatus,...>` 均补全 5 态）。
2. **默认值矛盾解决**：进入步骤 1，侧边栏/底部摘要 Product Knowledge Agent 显示「待确认」(pending_confirm, 灰)，而非「等待输入」。
3. **输入就绪（有效交互）**：步骤 1 点产品卡片或填写有效字段 → 「输入就绪」(ready, indigo)；若把产品名清空 → 回退「待确认」。
4. **步骤 2/3**：点平台 Tab → 「输入就绪」；点目标卡片 → 「输入就绪」。
5. **前进完成**：点「下一步」→ 左步「已完成」(emerald)，右步进入「待确认」。
6. **下游失效**：从步骤 4（已生成）经进度条回步骤 1，改产品 → 生成内容/审核清空，Agent 4,5 回退「未开始」(pending)，Agent 2,3 保持「已完成」。
7. **进度条可点击**：仅 `step < currentStep` 节点可点（cursor-pointer + hover ring）；当前/未来节点不可点；点击回看正确导航。
8. **第四步无完整链路**：第四步仍只展示上游摘要 + 生成结果，无 `AgentExecutionChain`。
9. **生成流程**：步骤 4「输入就绪」→ 点生成「运行中」→ 完成「已完成」；点「查看审核结果」进步骤 5。
