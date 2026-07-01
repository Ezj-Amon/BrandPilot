import { Brand, Product, Platform, ContentGoal, GeneratedContent, ReviewResult } from '@/engine/types';
import { ProductBrief, PlatformBrief, ContentStrategy } from '@/agents/types';
import { lumaCarry } from '@/data/brands';
import { voyagePack } from '@/data/products';
import { xiaohongshu } from '@/data/platforms';
import { seedingPost } from '@/data/goals';

// 工作台步骤
export type WorkbenchStep = 1 | 2 | 3 | 4 | 5;

// 工作台状态
export interface WorkbenchState {
  step: WorkbenchStep;
  brand: Brand;
  product: Product;          // 当前选中的产品（可编辑副本）
  platform: Platform;
  goal: ContentGoal;
  // Agent Engine 中间结果
  productBrief: ProductBrief | null;
  platformBrief: PlatformBrief | null;
  contentStrategy: ContentStrategy | null;
  generatedContent: GeneratedContent | null;
  reviewResult: ReviewResult | null;
  loading: boolean;          // 内容生成中
  reviewing: boolean;        // 审核中
  error: string | null;
}

// 初始状态
export const initialWorkbenchState: WorkbenchState = {
  step: 1,
  brand: { ...lumaCarry },
  product: { ...voyagePack },
  platform: xiaohongshu,
  goal: seedingPost,
  productBrief: null,
  platformBrief: null,
  contentStrategy: null,
  generatedContent: null,
  reviewResult: null,
  loading: false,
  reviewing: false,
  error: null,
};

// Action 类型
export type WorkbenchAction =
  | { type: 'SET_STEP'; step: WorkbenchStep }
  | { type: 'SET_PRODUCT'; product: Product }
  | { type: 'UPDATE_PRODUCT'; patch: Partial<Product> }
  | { type: 'UPDATE_BRAND'; patch: Partial<Brand> }
  | { type: 'SET_PLATFORM'; platform: Platform }
  | { type: 'SET_GOAL'; goal: ContentGoal }
  | { type: 'SET_PRODUCT_BRIEF'; brief: ProductBrief }
  | { type: 'SET_PLATFORM_BRIEF'; brief: PlatformBrief }
  | { type: 'SET_CONTENT_STRATEGY'; strategy: ContentStrategy }
  | { type: 'GENERATE_START' }
  | { type: 'GENERATE_SUCCESS'; content: GeneratedContent }
  | { type: 'GENERATE_ERROR'; error: string }
  | { type: 'REVIEW_START' }
  | { type: 'REVIEW_SUCCESS'; review: ReviewResult }
  | { type: 'RESET' };

// reducer
export function workbenchReducer(state: WorkbenchState, action: WorkbenchAction): WorkbenchState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.step };
    case 'SET_PRODUCT':
      // 切换产品时清空下游结果
      return {
        ...state,
        product: { ...action.product },
        productBrief: null,
        platformBrief: null,
        contentStrategy: null,
        generatedContent: null,
        reviewResult: null,
      };
    case 'UPDATE_PRODUCT':
      // 编辑产品资料时清空下游结果（brief 需重新生成）
      return {
        ...state,
        product: { ...state.product, ...action.patch },
        productBrief: null,
        platformBrief: null,
        contentStrategy: null,
        generatedContent: null,
        reviewResult: null,
      };
    case 'UPDATE_BRAND':
      return {
        ...state,
        brand: { ...state.brand, ...action.patch },
        productBrief: null,
        generatedContent: null,
        reviewResult: null,
      };
    case 'SET_PLATFORM':
      // 切换平台时清空下游结果
      return {
        ...state,
        platform: action.platform,
        platformBrief: null,
        contentStrategy: null,
        generatedContent: null,
        reviewResult: null,
      };
    case 'SET_GOAL':
      return {
        ...state,
        goal: action.goal,
        contentStrategy: null,
        generatedContent: null,
        reviewResult: null,
      };
    case 'SET_PRODUCT_BRIEF':
      return { ...state, productBrief: action.brief };
    case 'SET_PLATFORM_BRIEF':
      return { ...state, platformBrief: action.brief };
    case 'SET_CONTENT_STRATEGY':
      return { ...state, contentStrategy: action.strategy };
    case 'GENERATE_START':
      return { ...state, loading: true, error: null, reviewResult: null };
    case 'GENERATE_SUCCESS':
      // 生成完成后停留在第四步，展示生成结果，由用户点击"查看审核结果"再进入第五步
      return {
        ...state,
        loading: false,
        generatedContent: action.content,
        reviewResult: null,
        step: 4,
      };
    case 'GENERATE_ERROR':
      return { ...state, loading: false, error: action.error };
    case 'REVIEW_START':
      return { ...state, reviewing: true };
    case 'REVIEW_SUCCESS':
      return { ...state, reviewing: false, reviewResult: action.review };
    case 'RESET':
      return { ...initialWorkbenchState };
    default:
      return state;
  }
}
