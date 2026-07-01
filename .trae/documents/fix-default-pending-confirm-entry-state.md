# 修复默认值预选导致的无意义「待确认」状态

## 概述

步骤 1-3 进入时默认选中项本身就是有效输入，但当前入口态设为 `pending_confirm`（待确认），强制用户重新点击一次才能变「输入就绪」。尤其步骤 1 只有 1 个可支持产品（Voyage Pack），无法选择其他，重新点击毫无意义。

修复方案：将步骤 1-3 的入口态从 `pending_confirm` 改为 `ready`（输入就绪）。`pending_confirm` 保留但语义收窄为「输入不完整/无效，需修正」——仅当用户清空必填字段时才出现。

## 当前状态分析

### 问题代码（[src/store/workbenchStore.ts](file:///workspace/src/store/workbenchStore.ts)）

1. **初始状态**（第 38 行）：
   ```ts
   stepStatuses: { 1: 'pending_confirm', 2: 'pending', 3: 'pending', 4: 'pending', 5: 'pending' },
   ```
   步骤 1 初始为 `pending_confirm`，但 Voyage Pack + LumaCarry 品牌默认值均通过 `isStep1InputValid` 校验，应直接 `ready`。

2. **`promoteOnEnter`**（第 60-68 行）：进入步骤 1-3 时从 `pending` 提升为 `pending_confirm`：
   ```ts
   const entry: AgentStatus = step === 4 ? 'ready' : step === 5 ? 'completed' : 'pending_confirm';
   ```
   步骤 2/3 为固定列表选择，默认值始终有效，进入即应 `ready`。步骤 1 需校验当前输入有效性。

### 数据确认
- 步骤 1：[products.ts](file:///workspace/src/data/products.ts) 中仅 Voyage Pack `supported: true`，Metro Pack / Flex Sleeve 均 `supported: false`（`cursor-not-allowed`），用户无可选替代。
- 步骤 2：[platforms.ts](file:///workspace/src/data/platforms.ts) 3 个平台，默认小红书。
- 步骤 3：[goals.ts](file:///workspace/src/data/goals.ts) 2 个目标，默认种草帖。
- 三步默认值均有效，进入即应显示「输入就绪」。

### UI 无需改动
5 个状态（`pending`/`pending_confirm`/`ready`/`running`/`completed`）的样式映射已在 [CurrentAgentCard.tsx](file:///workspace/src/components/workbench/CurrentAgentCard.tsx#L16)、[AgentProgressSummary.tsx](file:///workspace/src/components/workbench/AgentProgressSummary.tsx#L9)、[AgentExecutionChain.tsx](file:///workspace/src/components/workbench/AgentExecutionChain.tsx#L8) 中全部定义，`pending_confirm` 保留供「输入无效」场景使用。

## 实施方案

### `src/store/workbenchStore.ts` — 两处改动

#### 1. 初始状态：步骤 1 从 `pending_confirm` → `ready`

```ts
// 步骤 1 默认 Voyage Pack + LumaCarry 均有效 → 输入就绪；2-5 未到达
stepStatuses: { 1: 'ready', 2: 'pending', 3: 'pending', 4: 'pending', 5: 'pending' },
```

#### 2. `promoteOnEnter`：步骤 1-3 入口态从 `pending_confirm` → `ready`

当前函数签名只接收 `(stepStatuses, step)`，步骤 1 需校验输入有效性，改为接收完整 state：

```ts
function promoteOnEnter(
  state: WorkbenchState,
  step: WorkbenchStep
): Record<WorkbenchStep, AgentStatus> {
  if (state.stepStatuses[step] !== 'pending') return state.stepStatuses;
  // 步骤 4：上游已完成，进入即就绪
  if (step === 4) return { ...state.stepStatuses, 4: 'ready' };
  // 步骤 5：审核随生成完成，进入即已完成
  if (step === 5) return { ...state.stepStatuses, 5: 'completed' };
  // 步骤 1：校验当前输入有效性
  if (step === 1) {
    const valid = isStep1InputValid(state.brand, state.product);
    return { ...state.stepStatuses, 1: valid ? 'ready' : 'pending_confirm' };
  }
  // 步骤 2/3：固定列表选择，默认值始终有效 → ready
  return { ...state.stepStatuses, [step]: 'ready' };
}
```

调用处（`SET_STEP` case）改为 `promoteOnEnter(state, next)`。

### 不改动的部分

- `SET_PRODUCT`/`UPDATE_*`/`UPDATE_BRAND`：仍按 `isStep1InputValid` 判定 → 有效 `ready` / 无效 `pending_confirm`。这是 `pending_confirm` 唯一出现的场景（用户清空必填字段）。
- `SET_PLATFORM`/`SET_GOAL`：仍直接 `ready`。
- 其余 reducer 逻辑不变。
- UI 组件均不改动。

## 假设与决策

1. **默认值即有效输入**：步骤 1-3 的预选默认值本身通过校验，进入即「输入就绪」(ready)，不强制重新点击。这是本次修复的核心。
2. **`pending_confirm` 语义收窄**：从「有默认值但未交互」改为「输入不完整/无效，需修正」。仅当用户在步骤 1 清空 brand.name/product.name/product.type/coreSellingPoints 时出现。状态保留不删除，UI 样式已存在无需改动。
3. **步骤 1 进入时校验**：`promoteOnEnter` 对步骤 1 调用 `isStep1InputValid`，确保回退到步骤 1 时若之前清空过字段则显示「待确认」。
4. **步骤 2/3 始终 ready**：固定列表选择，无空值可能，进入即 `ready`。
5. **不改动 UI、不改动其他 reducer 分支**，最小化影响面。

## 验证步骤

1. `npm run build` 通过。
2. 进入步骤 1：侧边栏/底部摘要 Product Knowledge Agent 显示「输入就绪」(ready, indigo)，不再显示「待确认」。
3. 步骤 1 点「下一步」到步骤 2：Agent 1「已完成」，Agent 2 进入即「输入就绪」(ready)，无需重新点平台。
4. 步骤 2 点「下一步」到步骤 3：Agent 3 进入即「输入就绪」(ready)。
5. 步骤 1 编辑产品名清空：状态回退「待确认」(pending_confirm)，重新填写后恢复「输入就绪」。
6. 从步骤 4 经进度条回步骤 1：Agent 1 仍「已完成」（后退不改状态），可编辑。
7. 回退修改产品后步骤 4/5 仍正确失效为「未开始」(pending)。
