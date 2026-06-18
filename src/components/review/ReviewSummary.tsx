interface ReviewSummaryProps {
  summary: { pass: number; warning: number; error: number };
}

// 审核结果汇总：显示 pass/warning/error 计数
export default function ReviewSummary({ summary }: ReviewSummaryProps) {
  const { pass, warning, error } = summary;

  return (
    <div>
      {/* 顶部提示条：根据严重程度展示不同提示 */}
      {error > 0 && (
        <div className="bg-red-50 text-red-700 p-3 rounded">
          发现 {error} 个严重问题，建议修改后再发布
        </div>
      )}
      {error === 0 && warning === 0 && (
        <div className="bg-emerald-50 text-emerald-700 p-3 rounded">
          内容审核通过，可以发布
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
    </div>
  );
}
