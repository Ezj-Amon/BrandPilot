import { useState } from 'react';
import { ReviewItem as ReviewItemType } from '@/engine/types';

interface ReviewItemProps {
  item: ReviewItemType;
}

// 单条审核结果卡片，可展开查看命中证据与修改建议
export default function ReviewItem({ item }: ReviewItemProps) {
  const [expanded, setExpanded] = useState(false);
  const { severity, ruleName, message, suggestion, evidence } = item;

  // 根据严重程度确定边框颜色
  const borderClass: Record<typeof severity, string> = {
    pass: 'border-emerald-200',
    warning: 'border-amber-200',
    error: 'border-red-200',
  };

  // 圆点颜色
  const dotClass: Record<typeof severity, string> = {
    pass: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
  };

  // 右侧标签样式
  const labelClass: Record<typeof severity, string> = {
    pass: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    error: 'bg-red-100 text-red-700',
  };

  // 标签文案
  const labelText: Record<typeof severity, string> = {
    pass: '通过',
    warning: '建议',
    error: '严重',
  };

  // 非 pass 且存在 suggestion 或 evidence 时才显示展开按钮
  const hasDetail = severity !== 'pass' && (!!(suggestion || evidence));

  return (
    <div className={`bg-white border rounded-lg p-4 ${borderClass[severity]}`}>
      {/* 顶部行：左侧圆点 + 规则名，右侧严重程度标签 */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${dotClass[severity]}`}></span>
          <span className="font-medium text-gray-900">{ruleName}</span>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded ${labelClass[severity]}`}>
          {labelText[severity]}
        </span>
      </div>

      {/* 审核消息 */}
      <p className="text-sm text-gray-700 mt-2">{message}</p>

      {/* 展开按钮 */}
      {hasDetail && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-indigo-600 mt-2 hover:underline"
        >
          {expanded ? '收起详情' : '查看详情'}
        </button>
      )}

      {/* 展开后的详情内容 */}
      {expanded && hasDetail && (
        <div className="mt-3 space-y-2">
          {evidence && (
            <div>
              <div className="text-xs text-gray-500 mb-1">命中证据</div>
              <div className="bg-gray-50 p-2 rounded font-mono text-sm text-red-600">
                {evidence}
              </div>
            </div>
          )}
          {suggestion && (
            <div>
              <div className="text-xs text-gray-500 mb-1">修改建议</div>
              <p className="text-sm text-gray-600">{suggestion}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
