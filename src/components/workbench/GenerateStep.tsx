import { Brand, ContentGoal, GeneratedContent, Platform, Product } from '@/engine/types';
import { ProductBrief, PlatformBrief, ContentStrategy } from '@/agents/types';
import ContentResultCard from '@/components/result/ContentResultCard';
import RegenerateButton from '@/components/result/RegenerateButton';

interface GenerateStepProps {
  loading: boolean;
  content: GeneratedContent | null;
  error: string | null;
  brand: Brand;
  product: Product;
  platform: Platform;
  goal: ContentGoal;
  productBrief: ProductBrief | null;
  platformBrief: PlatformBrief | null;
  contentStrategy: ContentStrategy | null;
  onGenerate: () => void;
  onRegenerate: () => void;
  onBack: () => void;
  onNext: () => void;  // 进入审核步
}

// Step 4：生成内容
// ContentGenerationAgent 综合上游 Product Brief / Platform Brief / Content Strategy 生成文案
export default function GenerateStep({
  loading,
  content,
  error,
  productBrief,
  platformBrief,
  contentStrategy,
  onGenerate,
  onRegenerate,
  onBack,
  onNext,
}: GenerateStepProps) {
  return (
    <div>
      {/* 标题 + 副标题 */}
      <h2 className="text-xl font-bold text-gray-900">第四步：生成内容</h2>
      <p className="mt-1 text-sm text-gray-500">
        ContentGenerationAgent 基于 Product Brief、Platform Brief 与 Content Strategy 生成文案
      </p>

      <div className="mt-6">
        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded">{error}</div>
        )}

        {/* loading 状态 */}
        {loading && (
          <div className="flex items-center gap-3 text-gray-600">
            <div className="inline-block w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <span>ContentGenerationAgent 正在生成内容...</span>
          </div>
        )}

        {/* 初始态：content 为 null 且非 loading，显示生成按钮 */}
        {!loading && content === null && (
          <div className="flex justify-center py-8">
            <button
              type="button"
              onClick={onGenerate}
              className="px-8 py-3 bg-indigo-600 text-white text-lg rounded-md hover:bg-indigo-700"
            >
              生成内容
            </button>
          </div>
        )}

        {/* 已生成内容：上游输入摘要 + 生成结果 + 底部按钮栏 */}
        {!loading && content !== null && (
          <>
            {/* 上游输入摘要：展示真实 Agent 输出摘要 */}
            <div className="mb-4 bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-xs font-medium text-gray-500 uppercase mb-2">ContentGenerationAgent 上游输入</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <UpstreamItem
                  label="Product Brief"
                  ok={!!productBrief}
                  summary={productBrief ? `${productBrief.coreSellingPoints.length} 个卖点 · ${productBrief.scenarios.length} 个场景` : '未生成'}
                />
                <UpstreamItem
                  label="Platform Brief"
                  ok={!!platformBrief}
                  summary={platformBrief ? `${platformBrief.styleKeywords.slice(0, 2).join('·')}` : '未生成'}
                />
                <UpstreamItem
                  label="Content Strategy"
                  ok={!!contentStrategy}
                  summary={contentStrategy ? contentStrategy.angle : '未生成'}
                />
              </div>
            </div>

            {/* 生成结果 */}
            <ContentResultCard content={content} />

            {/* 底部按钮栏：左侧重新生成 + 上一步，右侧查看审核结果 */}
            <div className="mt-8 flex items-center justify-between">
              <div className="flex gap-3">
                <RegenerateButton onClick={onRegenerate} disabled={loading} />
                <button
                  type="button"
                  onClick={onBack}
                  disabled={loading}
                  className="px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  上一步
                </button>
              </div>
              <button
                type="button"
                onClick={onNext}
                disabled={loading}
                className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
              >
                查看审核结果
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// 上游输入项
function UpstreamItem({ label, ok, summary }: { label: string; ok: boolean; summary: string }) {
  return (
    <div className={`rounded border p-2.5 ${ok ? 'border-emerald-200 bg-emerald-50/50' : 'border-gray-200 bg-gray-50'}`}>
      <div className="flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full ${ok ? 'bg-emerald-500' : 'bg-gray-300'}`} />
        <span className="text-xs font-medium text-gray-700">{label}</span>
      </div>
      <p className="mt-1 text-xs text-gray-500 leading-relaxed">{summary}</p>
    </div>
  );
}
