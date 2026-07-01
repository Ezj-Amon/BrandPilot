import { ReviewResult } from '@/engine/types';

interface ReviewSummaryProps {
  summary: { pass: number; warning: number; error: number };
  result?: ReviewResult | null;
}

// 审核结果汇总：显示总分/状态 + pass/warning/error 计数
export default function ReviewSummary({ summary, result }: ReviewSummaryProps) {
  const { pass, warning, error } = summary;
  const score = result?.score;
  const status = result?.status;

  // 状态文案
  const statusText = status === 'error' ? '未通过' : status === 'warning' ? '需修改' : '已通过';
  const statusClass =
    status === 'error'
      ? 'bg-red-50 text-red-700'
      : status === 'warning'
        ? 'bg-amber-50 text-amber-700'
        : 'bg-emerald-50 text-emerald-700';

  return (
    <div>
      {/* 顶部提示条：根据严重程度展示不同提示 */}
      {error > 0 && (
        <div className="bg-red-50 text-red-700 p-3 rounded">
          发现 {error} 个严重问题，建议修改后再发布
        </div>
      )}
      {error === 0 && warning > 0 && (
        <div className="bg-amber-50 text-amber-700 p-3 rounded">
          发现 {warning} 个建议修改项，可酌情优化后发布
        </div>
      )}
      {error === 0 && warning === 0 && (
        <div className="bg-emerald-50 text-emerald-700 p-3 rounded">
          内容审核通过，可以发布
        </div>
      )}

      {/* 总分 + 状态 */}
      {typeof score === 'number' && (
        <div className={`mt-3 flex items-center justify-between p-4 rounded-lg ${statusClass}`}>
          <div>
            <div className="text-xs font-medium opacity-80">审核总分</div>
            <div className="text-3xl font-bold">{score}<span className="text-base font-normal opacity-70"> / 100</span></div>
          </div>
          <div className="text-right">
            <div className="text-xs font-medium opacity-80">总体状态</div>
            <div className="text-lg font-semibold">{statusText}</div>
          </div>
        </div>
      )}

      {/* 三个统计卡片横向排列 */}
      <div className="flex gap-4 mt-3">
        {/* 通过 */}
        <div className="flex-1 bg-emerald-50 border border-emerald-200 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-emerald-700">{pass}</div>
          <div className="text-sm text-gray-600 mt-1">通过</div>
        </div>
        {/* 建议修改 */}
        <div className="flex-1 bg-amber-50 border border-amber-200 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-amber-700">{warning}</div>
          <div className="text-sm text-gray-600 mt-1">建议修改</div>
        </div>
        {/* 严重问题 */}
        <div className="flex-1 bg-red-50 border border-red-200 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-red-700">{error}</div>
          <div className="text-sm text-gray-600 mt-1">严重问题</div>
        </div>
      </div>

      {/* 修改建议汇总 */}
      {result?.suggestions && result.suggestions.length > 0 && (
        <div className="mt-3 bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-xs font-medium text-gray-500 uppercase mb-2">修改建议</div>
          <ul className="space-y-1.5 text-sm text-gray-700 list-disc pl-5">
            {result.suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
