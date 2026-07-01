import { useState } from 'react';
import { AGENT_DEFINITIONS, AgentStatus } from '@/data/agents';

interface AgentProgressSummaryProps {
  statuses: AgentStatus[];
}

// 状态对应的圆点与文字样式
const STATUS_META: Record<AgentStatus, { label: string; dot: string; text: string }> = {
  pending: { label: '待处理', dot: 'bg-gray-300', text: 'text-gray-400' },
  ready: { label: '输入就绪', dot: 'bg-blue-500', text: 'text-blue-600' },
  waiting: { label: '等待输入', dot: 'bg-gray-400', text: 'text-gray-500' },
  running: { label: '运行中', dot: 'bg-amber-500 animate-pulse', text: 'text-amber-600' },
  completed: { label: '已完成', dot: 'bg-emerald-500', text: 'text-emerald-600' },
};

// 轻量 Agent 进度摘要：底部折叠模块，不占据主体视觉
export default function AgentProgressSummary({ statuses }: AgentProgressSummaryProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-8 border-t border-gray-100 pt-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
      >
        <svg
          className={`w-4 h-4 transition-transform ${open ? 'rotate-90' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        Agent 执行进度
      </button>

      {open && (
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
          {AGENT_DEFINITIONS.map((agent, i) => {
            const status = statuses[i];
            const meta = STATUS_META[status];
            return (
              <div key={agent.id} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
                <span className="text-xs text-gray-600">{agent.nameZh}</span>
                <span className={`text-xs ${meta.text}`}>· {meta.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
