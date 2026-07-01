import { ReviewResult } from '@/engine/types';
import ReviewSummary from '@/components/review/ReviewSummary';
import ReviewPanel from '@/components/review/ReviewPanel';

interface ReviewStepProps {
  reviewResult: ReviewResult | null;
  sessionId: string;
  reviewing: boolean;
  onBack: () => void;
  onRestart: () => void; // 重新开始
}

// Step 5：发布前审核
export default function ReviewStep({
  reviewResult,
  sessionId,
  reviewing,
  onBack,
  onRestart,
}: ReviewStepProps) {
  return (
    <div>
      {/* 标题 + 副标题 */}
      <h2 className="text-xl font-bold text-gray-900">第五步：发布前审核</h2>
      <p className="mt-1 text-sm text-gray-500">
        ReviewAgent 基于生成内容做规则审核：品牌一致性、平台风格、卖点数量、事实风险、CTA、标签
      </p>

      <div className="mt-6">
        {/* 审核中 */}
        {reviewing && (
          <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-4 rounded">
            <div className="inline-block w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <span>ReviewAgent 正在审核生成内容…</span>
          </div>
        )}

        {/* 未生成内容时的提示 */}
        {!reviewing && reviewResult === null ? (
          <div className="bg-gray-50 text-gray-600 p-4 rounded">请先生成内容</div>
        ) : null}

        {/* 审核结果 */}
        {!reviewing && reviewResult !== null && (
          <>
            {/* 审核汇总 */}
            <ReviewSummary summary={reviewResult.summary} result={reviewResult} />

            {/* 分组审核明细 */}
            <div className="mt-6">
              <ReviewPanel items={reviewResult.items} />
            </div>

            {/* 底部信息区：Session ID 留档追溯 */}
            <div className="border-t border-gray-100 pt-4 mt-6">
              <div className="text-xs font-medium text-gray-500 uppercase">Session ID</div>
              <div className="mt-1 font-mono text-sm text-gray-600">{sessionId}</div>
              <p className="mt-1 text-xs text-gray-500">
                本次审核的 Session ID，可用于留档追溯
              </p>
            </div>

            {/* 底部按钮栏：左侧上一步，右侧重新开始 */}
            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                上一步
              </button>
              <button
                type="button"
                onClick={onRestart}
                className="px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                重新开始
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
