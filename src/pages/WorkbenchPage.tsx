import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProgressBar from '@/components/layout/ProgressBar';
import ProductStep from '@/components/workbench/ProductStep';
import PlatformStep from '@/components/workbench/PlatformStep';
import GoalStep from '@/components/workbench/GoalStep';
import GenerateStep from '@/components/workbench/GenerateStep';
import ReviewStep from '@/components/workbench/ReviewStep';
import CurrentAgentCard from '@/components/workbench/CurrentAgentCard';
import AgentProgressSummary from '@/components/workbench/AgentProgressSummary';
import { useWorkbench } from '@/hooks/useWorkbench';
import { WorkbenchStep } from '@/store/workbenchStore';
import { AgentStatus } from '@/data/agents';

// 工作台页面：5 步流程的容器组件
// 视觉层级：步骤进度 > 当前操作 > 操作结果 > Agent 辅助说明 > Agent 进度摘要
export default function WorkbenchPage() {
  const {
    state,
    setStep,
    setProduct,
    updateProduct,
    updateBrand,
    setPlatform,
    setGoal,
    generate,
    reset,
  } = useWorkbench();

  // Agent 状态完全来自 per-step 状态机 stepStatuses（agent i ↔ step i 1:1 映射），不再从 step 派生
  const agentStatuses: AgentStatus[] = ([1, 2, 3, 4, 5] as WorkbenchStep[]).map(
    (i) => state.stepStatuses[i]
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* 顶部固定进度条：仅显示 5 步流程 */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <ProgressBar currentStep={state.step} onStepClick={setStep} />
        </div>
      </div>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {/* 主体 + 侧边栏布局：大屏左右分栏，小屏上下堆叠 */}
        <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-6">
          {/* 主体区域：用户当前要完成的操作 */}
          <div className="min-w-0">
            {/* Step 1：选择产品 + 编辑资料 */}
            {state.step === 1 && (
              <ProductStep
                brand={state.brand}
                product={state.product}
                onProductSelect={setProduct}
                onBrandChange={updateBrand}
                onProductChange={updateProduct}
                onNext={() => setStep(2)}
              />
            )}

            {/* Step 2：选择发布平台 */}
            {state.step === 2 && (
              <PlatformStep
                selectedPlatformId={state.platform.id}
                onSelect={setPlatform}
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
              />
            )}

            {/* Step 3：选择内容目标 */}
            {state.step === 3 && (
              <GoalStep
                selectedGoalId={state.goal.id}
                onSelect={setGoal}
                onNext={() => setStep(4)}
                onBack={() => setStep(2)}
              />
            )}

            {/* Step 4：生成内容 */}
            {state.step === 4 && (
              <GenerateStep
                loading={state.loading}
                content={state.generatedContent}
                error={state.error}
                brand={state.brand}
                product={state.product}
                platform={state.platform}
                goal={state.goal}
                onGenerate={generate}
                onRegenerate={generate}
                onBack={() => setStep(3)}
                onNext={() => setStep(5)}
              />
            )}

            {/* Step 5：发布前审核 */}
            {state.step === 5 && (
              <ReviewStep
                reviewResult={state.reviewResult}
                sessionId={state.generatedContent?.sessionId || ''}
                onBack={() => setStep(4)}
                onRestart={reset}
              />
            )}

            {/* 底部轻量 Agent 进度摘要（折叠） */}
            <AgentProgressSummary statuses={agentStatuses} />
          </div>

          {/* 侧边栏：当前步骤对应 Agent 的轻量辅助卡片 */}
          <aside className="mt-6 lg:mt-0 lg:sticky lg:top-32 lg:self-start">
            <CurrentAgentCard
              step={state.step}
              brand={state.brand}
              product={state.product}
              platform={state.platform}
              goal={state.goal}
              statuses={agentStatuses}
            />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
