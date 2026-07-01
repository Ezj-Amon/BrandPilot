import { useMemo } from 'react';
import { Brand, Product, Platform, ContentGoal } from '@/engine/types';
import { WorkbenchStep } from '@/store/workbenchStore';
import { AgentStatus, buildAgentRunNodes } from '@/data/agents';

interface CurrentAgentCardProps {
  step: WorkbenchStep;
  brand: Brand;
  product: Product;
  platform: Platform;
  goal: ContentGoal;
  statuses: AgentStatus[]; // 来自 per-step 状态机（唯一真相源）
}

// 状态徽章样式映射（5 态）
const STATUS_BADGE: Record<AgentStatus, { label: string; dotClass: string; badgeClass: string }> = {
  pending: {
    label: '未开始',
    dotClass: 'bg-gray-300',
    badgeClass: 'bg-gray-100 text-gray-500',
  },
  pending_confirm: {
    label: '待确认',
    dotClass: 'bg-gray-400',
    badgeClass: 'bg-gray-100 text-gray-600',
  },
  ready: {
    label: '输入就绪',
    dotClass: 'bg-indigo-500',
    badgeClass: 'bg-indigo-100 text-indigo-700',
  },
  running: {
    label: '运行中',
    dotClass: 'bg-amber-500 animate-pulse',
    badgeClass: 'bg-amber-100 text-amber-700',
  },
  completed: {
    label: '已完成',
    dotClass: 'bg-emerald-500',
    badgeClass: 'bg-emerald-100 text-emerald-700',
  },
};

// 当前步骤对应 Agent 的轻量辅助卡片（侧边栏）
// 仅作为辅助说明，不抢占主体视觉；状态来自 store 的 stepStatuses
export default function CurrentAgentCard({
  step,
  brand,
  product,
  platform,
  goal,
  statuses,
}: CurrentAgentCardProps) {
  const node = useMemo(() => {
    const nodes = buildAgentRunNodes(brand, product, platform, goal, statuses);
    return nodes[step - 1];
  }, [step, brand, product, platform, goal, statuses]);

  const badge = STATUS_BADGE[node.status];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
      {/* 标题行：Agent 名称 + 状态徽章 */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-gray-900 truncate">
            {node.name}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            {node.nameZh}
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${badge.badgeClass}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${badge.dotClass}`} />
          {badge.label}
        </span>
      </div>

      {/* 职责 */}
      <div className="mt-3">
        <div className="text-xs font-medium text-gray-400">职责</div>
        <p className="mt-0.5 text-xs text-gray-700 leading-relaxed">{node.role}</p>
      </div>

      {/* 输入 / 输出 */}
      <div className="mt-2 space-y-1.5">
        <div>
          <span className="text-xs font-medium text-gray-400">输入：</span>
          <span className="text-xs text-gray-600">{node.input}</span>
        </div>
        <div>
          <span className="text-xs font-medium text-gray-400">输出：</span>
          <span className="text-xs text-gray-600">{node.output}</span>
        </div>
      </div>

      {/* 简短说明 */}
      <p className="mt-2 text-[11px] text-gray-400 leading-relaxed border-t border-gray-100 pt-2">
        {node.note}
      </p>
    </div>
  );
}
