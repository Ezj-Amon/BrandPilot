import { Brand, Product, Platform, ContentGoal, GeneratedContent, ReviewResult } from '@/engine/types';
import { lumaCarry } from '@/data/brands';
import { voyagePack } from '@/data/products';
import { xiaohongshu } from '@/data/platforms';
import { seedingPost } from '@/data/goals';
import { AgentStatus } from '@/data/agents';

// 工作台步骤
export type WorkbenchStep = 1 | 2 | 3 | 4 | 5;

// 工作台状态
export interface WorkbenchState {
  step: WorkbenchStep;
  brand: Brand;
  product: Product;          // 当前选中的产品（可编辑副本）
  platform: Platform;
  goal: ContentGoal;
  generatedContent: GeneratedContent | null;
  reviewResult: ReviewResult | null;
  loading: boolean;
  error: string | null;
  // per-step 状态机：5 个步骤的 Agent 状态唯一真相源（agent i ↔ step i 1:1 映射）
  stepStatuses: Record<WorkbenchStep, AgentStatus>;
}

// 初始状态
export const initialWorkbenchState: WorkbenchState = {
  step: 1,
  brand: { ...lumaCarry },
  product: { ...voyagePack },
  platform: xiaohongshu,
  goal: seedingPost,
  generatedContent: null,
  reviewResult: null,
  loading: false,
  error: null,
  // 步骤 1 默认 Voyage Pack + LumaCarry 均有效 → 输入就绪；2-5 未到达 → 未开始
  stepStatuses: { 1: 'ready', 2: 'pending', 3: 'pending', 4: 'pending', 5: 'pending' },
};

// 步骤 1 输入有效性判定（必填字段非空）
// brand.name / product.name / product.type / coreSellingPoints 为必填；bannedWords 可空
function isStep1InputValid(brand: Brand, product: Product): boolean {
  return (
    brand.name.trim() !== '' &&
    product.name.trim() !== '' &&
    product.type.trim() !== '' &&
    product.coreSellingPoints.length > 0
  );
}

// 导出步骤 1 有效性判定，供需要的地方复用
export { isStep1InputValid };

// 下游步骤（内容生成 / 审核）依赖产品、平台、目标；修改任一上游需失效 4,5 并清空结果
function invalidateDownstream(stepStatuses: Record<WorkbenchStep, AgentStatus>): Record<WorkbenchStep, AgentStatus> {
  return { ...stepStatuses, 4: 'pending', 5: 'pending' };
}

// 进入某步骤时，若该步为 pending 则提升为对应入口态
// 步骤 1-3 默认值有效 → ready；步骤 1 校验输入有效性，无效则 pending_confirm
function promoteOnEnter(
  state: WorkbenchState,
  step: WorkbenchStep
): Record<WorkbenchStep, AgentStatus> {
  const { stepStatuses } = state;
  if (stepStatuses[step] !== 'pending') return stepStatuses;
  if (step === 4) return { ...stepStatuses, 4: 'ready' };
  if (step === 5) return { ...stepStatuses, 5: 'completed' };
  // 步骤 1：校验当前输入有效性
  if (step === 1) {
    const valid = isStep1InputValid(state.brand, state.product);
    return { ...stepStatuses, 1: valid ? 'ready' : 'pending_confirm' };
  }
  // 步骤 2/3：固定列表选择，默认值始终有效 → ready
  return { ...stepStatuses, [step]: 'ready' };
}

// Action 类型
export type WorkbenchAction =
  | { type: 'SET_STEP'; step: WorkbenchStep }
  | { type: 'SET_PRODUCT'; product: Product }
  | { type: 'UPDATE_PRODUCT'; patch: Partial<Product> }
  | { type: 'UPDATE_BRAND'; patch: Partial<Brand> }
  | { type: 'SET_PLATFORM'; platform: Platform }
  | { type: 'SET_GOAL'; goal: ContentGoal }
  | { type: 'GENERATE_START' }
  | { type: 'GENERATE_SUCCESS'; content: GeneratedContent; review: ReviewResult }
  | { type: 'GENERATE_ERROR'; error: string }
  | { type: 'RESET' };

// reducer
export function workbenchReducer(state: WorkbenchState, action: WorkbenchAction): WorkbenchState {
  switch (action.type) {
    case 'SET_STEP': {
      const prev = state.step;
      const next = action.step;
      let stepStatuses = { ...state.stepStatuses };
      // 前进（下一步）：完成左步
      if (next > prev) {
        stepStatuses = { ...stepStatuses, [prev]: 'completed' as AgentStatus };
      }
      // 后退不改状态，保留「已完成」便于回看
      // 目的地若为 pending 则提升为入口态（传入已更新的 stepStatuses，避免丢失 prev→completed）
      stepStatuses = promoteOnEnter({ ...state, stepStatuses }, next);
      return { ...state, step: next, stepStatuses };
    }
    case 'SET_PRODUCT': {
      const product = { ...action.product };
      const step1Status: AgentStatus = isStep1InputValid(state.brand, product) ? 'ready' : 'pending_confirm';
      return {
        ...state,
        product,
        generatedContent: null,
        reviewResult: null,
        stepStatuses: invalidateDownstream({ ...state.stepStatuses, 1: step1Status }),
      };
    }
    case 'UPDATE_PRODUCT': {
      const product = { ...state.product, ...action.patch };
      const step1Status: AgentStatus = isStep1InputValid(state.brand, product) ? 'ready' : 'pending_confirm';
      return {
        ...state,
        product,
        generatedContent: null,
        reviewResult: null,
        stepStatuses: invalidateDownstream({ ...state.stepStatuses, 1: step1Status }),
      };
    }
    case 'UPDATE_BRAND': {
      const brand = { ...state.brand, ...action.patch };
      const step1Status: AgentStatus = isStep1InputValid(brand, state.product) ? 'ready' : 'pending_confirm';
      return {
        ...state,
        brand,
        generatedContent: null,
        reviewResult: null,
        stepStatuses: invalidateDownstream({ ...state.stepStatuses, 1: step1Status }),
      };
    }
    case 'SET_PLATFORM':
      // 平台为固定列表选择，选中即有效 → ready；下游失效
      return {
        ...state,
        platform: action.platform,
        generatedContent: null,
        reviewResult: null,
        stepStatuses: invalidateDownstream({ ...state.stepStatuses, 2: 'ready' }),
      };
    case 'SET_GOAL':
      // 内容目标为固定列表选择，选中即有效 → ready；下游失效
      return {
        ...state,
        goal: action.goal,
        generatedContent: null,
        reviewResult: null,
        stepStatuses: invalidateDownstream({ ...state.stepStatuses, 3: 'ready' }),
      };
    case 'GENERATE_START':
      return { ...state, loading: true, error: null, stepStatuses: { ...state.stepStatuses, 4: 'running' } };
    case 'GENERATE_SUCCESS':
      // 生成完成后停留在第四步，展示生成结果，由用户点击"查看审核结果"再进入第五步
      return {
        ...state,
        loading: false,
        generatedContent: action.content,
        reviewResult: action.review,
        step: 4,
        stepStatuses: { ...state.stepStatuses, 4: 'completed', 5: 'completed' },
      };
    case 'GENERATE_ERROR':
      // 失败后回到 ready，可重试
      return { ...state, loading: false, error: action.error, stepStatuses: { ...state.stepStatuses, 4: 'ready' } };
    case 'RESET':
      return { ...initialWorkbenchState };
    default:
      return state;
  }
}
