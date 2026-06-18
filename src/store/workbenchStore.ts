import { Brand, Product, Platform, ContentGoal, GeneratedContent, ReviewResult } from '@/engine/types';
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
  generatedContent: GeneratedContent | null;
  reviewResult: ReviewResult | null;
  loading: boolean;
  error: string | null;
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
};

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
    case 'SET_STEP':
      return { ...state, step: action.step };
    case 'SET_PRODUCT':
      return { ...state, product: { ...action.product } };
    case 'UPDATE_PRODUCT':
      return { ...state, product: { ...state.product, ...action.patch } };
    case 'UPDATE_BRAND':
      return { ...state, brand: { ...state.brand, ...action.patch } };
    case 'SET_PLATFORM':
      return { ...state, platform: action.platform, generatedContent: null, reviewResult: null };
    case 'SET_GOAL':
      return { ...state, goal: action.goal, generatedContent: null, reviewResult: null };
    case 'GENERATE_START':
      return { ...state, loading: true, error: null };
    case 'GENERATE_SUCCESS':
      return {
        ...state,
        loading: false,
        generatedContent: action.content,
        reviewResult: action.review,
        step: 5,  // 生成完成后自动跳到审核步
      };
    case 'GENERATE_ERROR':
      return { ...state, loading: false, error: action.error };
    case 'RESET':
      return { ...initialWorkbenchState };
    default:
      return state;
  }
}
