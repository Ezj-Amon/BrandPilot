import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProgressBar from '@/components/layout/ProgressBar';
import ProductStep from '@/components/workbench/ProductStep';
import PlatformStep from '@/components/workbench/PlatformStep';
import GoalStep from '@/components/workbench/GoalStep';
import GenerateStep from '@/components/workbench/GenerateStep';
import ReviewStep from '@/components/workbench/ReviewStep';
import { useWorkbench } from '@/hooks/useWorkbench';

// 工作台页面：5 步流程的容器组件
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* 顶部固定进度条：紧贴 Header（h-16 = 64px）下方 */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <ProgressBar currentStep={state.step} />
        </div>
      </div>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
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
      </main>

      <Footer />
    </div>
  );
}
