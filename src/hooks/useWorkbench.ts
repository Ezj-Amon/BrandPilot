import { useReducer, useCallback } from 'react';
import {
  initialWorkbenchState,
  workbenchReducer,
  WorkbenchStep,
} from '@/store/workbenchStore';
import { Product, Platform, ContentGoal, Brand } from '@/engine/types';
import {
  runProductKnowledgeAgent,
  runPlatformAdaptationAgent,
  runContentStrategyAgent,
  runContentGenerationAgent,
  runReviewAgent,
} from '@/agents';

export function useWorkbench() {
  const [state, dispatch] = useReducer(workbenchReducer, initialWorkbenchState);

  const setStep = useCallback((step: WorkbenchStep) => {
    dispatch({ type: 'SET_STEP', step });
  }, []);

  // Step 1：选择产品后，调用 ProductKnowledgeAgent 生成 Product Brief
  const setProduct = useCallback((product: Product) => {
    dispatch({ type: 'SET_PRODUCT', product });
    runProductKnowledgeAgent(state.brand, product).then((brief) => {
      dispatch({ type: 'SET_PRODUCT_BRIEF', brief });
    });
  }, [state.brand]);

  // Step 1：编辑产品资料后，重新生成 Product Brief
  const updateProduct = useCallback((patch: Partial<Product>) => {
    dispatch({ type: 'UPDATE_PRODUCT', patch });
    const next = { ...state.product, ...patch };
    runProductKnowledgeAgent(state.brand, next).then((brief) => {
      dispatch({ type: 'SET_PRODUCT_BRIEF', brief });
    });
  }, [state.brand, state.product]);

  // Step 1：编辑品牌资料后，重新生成 Product Brief
  const updateBrand = useCallback((patch: Partial<Brand>) => {
    dispatch({ type: 'UPDATE_BRAND', patch });
    const nextBrand = { ...state.brand, ...patch };
    runProductKnowledgeAgent(nextBrand, state.product).then((brief) => {
      dispatch({ type: 'SET_PRODUCT_BRIEF', brief });
    });
  }, [state.brand, state.product]);

  // Step 2：选择平台后，调用 PlatformAdaptationAgent 生成 Platform Brief
  const setPlatform = useCallback((platform: Platform) => {
    dispatch({ type: 'SET_PLATFORM', platform });
    // Product Brief 可能尚未生成（用当前已存的，或临时生成）
    const brief = state.productBrief;
    if (brief) {
      runPlatformAdaptationAgent(brief, platform).then((pb) => {
        dispatch({ type: 'SET_PLATFORM_BRIEF', brief: pb });
      });
    } else {
      runProductKnowledgeAgent(state.brand, state.product).then((pBrief) => {
        dispatch({ type: 'SET_PRODUCT_BRIEF', brief: pBrief });
        runPlatformAdaptationAgent(pBrief, platform).then((pb) => {
          dispatch({ type: 'SET_PLATFORM_BRIEF', brief: pb });
        });
      });
    }
  }, [state.productBrief, state.brand, state.product]);

  // Step 3：选择内容目标后，调用 ContentStrategyAgent 生成 Content Strategy
  const setGoal = useCallback((goal: ContentGoal) => {
    dispatch({ type: 'SET_GOAL', goal });
    const pBrief = state.productBrief;
    const plBrief = state.platformBrief;
    if (pBrief && plBrief) {
      runContentStrategyAgent(pBrief, plBrief, goal).then((strategy) => {
        dispatch({ type: 'SET_CONTENT_STRATEGY', strategy });
      });
    }
  }, [state.productBrief, state.platformBrief]);

  // Step 4：点击生成内容，调用 ContentGenerationAgent
  const generate = useCallback(async () => {
    // 确保上游 Brief / Strategy 已就绪
    let pBrief = state.productBrief;
    let plBrief = state.platformBrief;
    let strategy = state.contentStrategy;

    if (!pBrief) {
      pBrief = await runProductKnowledgeAgent(state.brand, state.product);
      dispatch({ type: 'SET_PRODUCT_BRIEF', brief: pBrief });
    }
    if (!plBrief && pBrief) {
      plBrief = await runPlatformAdaptationAgent(pBrief, state.platform);
      if (plBrief) dispatch({ type: 'SET_PLATFORM_BRIEF', brief: plBrief });
    }
    if (!strategy && pBrief && plBrief) {
      strategy = await runContentStrategyAgent(pBrief, plBrief, state.goal);
      dispatch({ type: 'SET_CONTENT_STRATEGY', strategy });
    }

    if (!pBrief || !plBrief || !strategy) {
      dispatch({ type: 'GENERATE_ERROR', error: '上游 Agent 输出缺失，无法生成内容' });
      return;
    }

    dispatch({ type: 'GENERATE_START' });
    try {
      const content = await runContentGenerationAgent({
        brand: state.brand,
        product: state.product,
        platform: state.platform,
        goal: state.goal,
        productBrief: pBrief,
        platformBrief: plBrief,
        contentStrategy: strategy,
      });
      dispatch({ type: 'GENERATE_SUCCESS', content });
    } catch (e) {
      dispatch({ type: 'GENERATE_ERROR', error: e instanceof Error ? e.message : '生成失败' });
    }
  }, [state.brand, state.product, state.platform, state.goal, state.productBrief, state.platformBrief, state.contentStrategy]);

  // Step 5：进入发布前审核，调用 ReviewAgent 生成审核报告
  const review = useCallback(async () => {
    const content = state.generatedContent;
    const pBrief = state.productBrief;
    const plBrief = state.platformBrief;
    const strategy = state.contentStrategy;
    if (!content || !pBrief || !plBrief || !strategy) return;

    dispatch({ type: 'REVIEW_START' });
    try {
      const reviewResult = await runReviewAgent(content, {
        brand: state.brand,
        product: state.product,
        platform: state.platform,
        goal: state.goal,
        productBrief: pBrief,
        platformBrief: plBrief,
        contentStrategy: strategy,
      });
      dispatch({ type: 'REVIEW_SUCCESS', review: reviewResult });
    } catch {
      // 审核失败时给出空结果占位，避免界面卡死
      dispatch({ type: 'REVIEW_SUCCESS', review: {
        sessionId: content.sessionId,
        contentId: content.id,
        status: 'error' as const,
        score: 0,
        items: [],
        summary: { pass: 0, warning: 0, error: 0 },
        suggestions: ['审核执行失败，请重试'],
      } });
    }
  }, [state.generatedContent, state.productBrief, state.platformBrief, state.contentStrategy, state.brand, state.product, state.platform, state.goal]);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
    // 重新生成初始 Product Brief
    runProductKnowledgeAgent(state.brand, state.product).then((brief) => {
      dispatch({ type: 'SET_PRODUCT_BRIEF', brief });
    });
  }, [state.brand, state.product]);

  return {
    state,
    setStep,
    setProduct,
    updateProduct,
    updateBrand,
    setPlatform,
    setGoal,
    generate,
    review,
    reset,
  };
}
