import { useReducer, useCallback, useEffect } from 'react';
import {
  initialWorkbenchState,
  workbenchReducer,
  WorkbenchStep,
} from '@/store/workbenchStore';
import { Product, Platform, ContentGoal, Brand, AgentContext } from '@/engine/types';
import { runProductKnowledge, runPlatformAdaptation, runContentStrategy, runContentGeneration, runReview } from '@/agents/agentEngine';

export function useWorkbench() {
  const [state, dispatch] = useReducer(workbenchReducer, initialWorkbenchState);

  // Agent 中间产物在对应上游变化且被失效（置 null）时重新计算
  useEffect(() => {
    if (state.productBrief === null) {
      const brief = runProductKnowledge(state.product, state.brand);
      dispatch({ type: 'SET_PRODUCT_BRIEF', brief });
    }
  }, [state.product, state.brand, state.productBrief]);

  useEffect(() => {
    if (state.platformBrief === null && state.productBrief !== null) {
      const brief = runPlatformAdaptation(state.productBrief, state.platform);
      dispatch({ type: 'SET_PLATFORM_BRIEF', brief });
    }
  }, [state.productBrief, state.platform, state.platformBrief]);

  useEffect(() => {
    if (state.contentStrategy === null && state.platformBrief !== null) {
      const strategy = runContentStrategy(state.productBrief!, state.platformBrief, state.goal);
      dispatch({ type: 'SET_CONTENT_STRATEGY', strategy });
    }
  }, [state.platformBrief, state.goal, state.contentStrategy, state.productBrief]);

  const setStep = useCallback((step: WorkbenchStep) => {
    dispatch({ type: 'SET_STEP', step });
  }, []);

  const setProduct = useCallback((product: Product) => {
    dispatch({ type: 'SET_PRODUCT', product });
  }, []);

  const updateProduct = useCallback((patch: Partial<Product>) => {
    dispatch({ type: 'UPDATE_PRODUCT', patch });
  }, []);

  const updateBrand = useCallback((patch: Partial<Brand>) => {
    dispatch({ type: 'UPDATE_BRAND', patch });
  }, []);

  const setPlatform = useCallback((platform: Platform) => {
    dispatch({ type: 'SET_PLATFORM', platform });
  }, []);

  const setGoal = useCallback((goal: ContentGoal) => {
    dispatch({ type: 'SET_GOAL', goal });
  }, []);

  // 生成内容并审核：直接走 Agent Engine（Brief/Strategy 链路已在 useEffect 中计算就绪）
  const generate = useCallback(async () => {
    dispatch({ type: 'GENERATE_START' });
    try {
      const ctx: AgentContext = {
        brand: state.brand,
        product: state.product,
        platform: state.platform,
        goal: state.goal,
        productBrief: state.productBrief!,
        platformBrief: state.platformBrief!,
        contentStrategy: state.contentStrategy!,
      };
      const content = runContentGeneration(ctx);
      const review = runReview(content, ctx);
      dispatch({ type: 'GENERATE_SUCCESS', content, review });
    } catch (e) {
      dispatch({ type: 'GENERATE_ERROR', error: e instanceof Error ? e.message : '生成失败' });
    }
  }, [state.brand, state.product, state.platform, state.goal, state.productBrief, state.platformBrief, state.contentStrategy]);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return {
    state,
    setStep,
    setProduct,
    updateProduct,
    updateBrand,
    setPlatform,
    setGoal,
    generate,
    reset,
  };
}
