import { useMemo } from 'react';
import { Brand, ContentGoal, GeneratedContent, Platform, Product } from '@/engine/types';
import ContentResultCard from '@/components/result/ContentResultCard';
import RegenerateButton from '@/components/result/RegenerateButton';
import AgentExecutionChain from '@/components/workbench/AgentExecutionChain';
import { buildAgentRunNodes } from '@/data/agents';

interface GenerateStepProps {
  loading: boolean;
  content: GeneratedContent | null;
  error: string | null;
  brand: Brand;
  product: Product;
  platform: Platform;
  goal: ContentGoal;
  onGenerate: () => void;
  onRegenerate: () => void;
  onBack: () => void;
  onNext: () => void;  // 进入审核步
}

// Step 4：生成内容
// 生成完成后停留在本步，展示生成结果与 Agent 执行链路，由用户点击「查看审核结果」进入第五步
export default function GenerateStep({
  loading,
  content,
  error,
  brand,
  product,
  platform,
  goal,
  onGenerate,
  onRegenerate,
  onBack,
  onNext,
}: GenerateStepProps) {
  // 根据当前 Prompt 上下文构建 Agent 执行链路节点
  const agentNodes = useMemo(
    () => buildAgentRunNodes(brand, product, platform, goal),
    [brand, product, platform, goal]
  );
  return (
    <div>
      {/* 标题 + 副标题 */}
      <h2 className="text-xl font-bold text-gray-900">第四步：生成内容</h2>
      <p className="mt-1 text-sm text-gray-500">
        基于产品资料、平台风格和内容目标生成文案
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
            <span>正在生成内容...</span>
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

        {/* 已生成内容：展示卡片 + Agent 执行链路 + 底部按钮栏 */}
        {!loading && content !== null && (
          <>
            <ContentResultCard content={content} />

            {/* Agent 执行链路：展示本次生成背后的多 Agent 编排 */}
            <AgentExecutionChain nodes={agentNodes} />

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
