import { useReducer, useCallback } from 'react';
import {
  initialWorkbenchState,
  workbenchReducer,
  WorkbenchStep,
} from '@/store/workbenchStore';
import { Product, Platform, ContentGoal, Brand } from '@/engine/types';
import { buildPromptContext } from '@/engine/promptBuilder';
import { getGenerator } from '@/engine/generatorIndex';
import { reviewContent } from '@/engine/reviewEngine';

export function useWorkbench() {
  const [state, dispatch] = useReducer(workbenchReducer, initialWorkbenchState);

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

  // 生成内容并审核
  const generate = useCallback(async () => {
    dispatch({ type: 'GENERATE_START' });
    try {
      const ctx = buildPromptContext(state.brand, state.product, state.platform, state.goal);
      const generator = getGenerator();
      const content = await generator.generate(ctx);
      const review = reviewContent(content, ctx);
      dispatch({ type: 'GENERATE_SUCCESS', content, review });
    } catch (e) {
      dispatch({ type: 'GENERATE_ERROR', error: e instanceof Error ? e.message : '生成失败' });
    }
  }, [state.brand, state.product, state.platform, state.goal]);

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
