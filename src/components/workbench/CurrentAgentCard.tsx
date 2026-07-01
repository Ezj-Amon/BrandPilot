import { useMemo } from 'react';
import { Brand, Product, Platform, ContentGoal } from '@/engine/types';
import { WorkbenchStep } from '@/store/workbenchStore';
import { AgentRunNode, getAgentStatuses, buildAgentRunNodes } from '@/data/agents';

interface CurrentAgentCardProps {
  step: WorkbenchStep;
  brand: Brand;
  product: Product;
  platform: Platform;
  goal: ContentGoal;
  contentGenerated: boolean;
}

// 状态徽章样式映射
const STATUS_BADGE: Record<AgentRunNode['status'], { label: string; className: string }> = {
  pending: {
    label: '等待中',
    className: 'bg-gray-100 text-gray-500',
  },
  running: {
    label: '运行中',
    className: 'bg-amber-100 text-amber-700',
  },
  completed: {
    label: '已完成',
    className: 'bg-emerald-100 text-emerald-700',
  },
};

// 左侧状态色边框
const BORDER_CLASS: Record<AgentRunNode['status'], string> = {
  pending: 'border-l-gray-300',
  running: 'border-l-amber-400',
  completed: 'border-l-emerald-400',
};

// 当前步骤对应的 Agent 详情卡片
// 在工作台每个步骤内容区顶部展示，让用户感知到当前步骤背后运行的 Agent
export default function CurrentAgentCard({
  step,
  brand,
  product,
  platform,
  goal,
  contentGenerated,
}: CurrentAgentCardProps) {
  const node = useMemo(() => {
    const statuses = getAgentStatuses(step, contentGenerated);
    const nodes = buildAgentRunNodes(brand, product, platform, goal, statuses);
    return nodes[step - 1];
  }, [step, brand, product, platform, goal, contentGenerated]);

  const badge = STATUS_BADGE[node.status];

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 border-l-4 shadow-sm px-5 py-4 ${BORDER_CLASS[node.status]}`}
    >
      {/* 标题行：Agent 名称 + 状态徽章 */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <span className="text-base font-semibold text-gray-900">
            {node.name}
          </span>
          <span className="ml-2 text-sm text-gray-500">
            {node.nameZh}
          </span>
        </div>
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${badge.className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
          {badge.label}
        </span>
      </div>

      {/* 职责 */}
      <p className="mt-2 text-sm text-gray-700 leading-relaxed">
        <span className="text-gray-500">职责：</span>
        {node.role}
      </p>

      {/* 示例输出 */}
      <div className="mt-3 bg-indigo-50/60 rounded border border-indigo-100 p-3">
        <div className="text-xs font-medium text-indigo-600 uppercase mb-1">
          示例输出
        </div>
        <p className="text-sm text-gray-800 leading-relaxed">{node.sample}</p>
      </div>

      {/* 简短说明 */}
      <p className="mt-2 text-xs text-gray-400 leading-relaxed">
        {node.note}
      </p>
    </div>
  );
}
