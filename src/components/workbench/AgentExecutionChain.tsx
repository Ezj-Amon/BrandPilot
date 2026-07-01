import { AgentRunNode } from '@/data/agents';

interface AgentExecutionChainProps {
  nodes: AgentRunNode[];
}

// 状态徽章样式映射
const STATUS_BADGE: Record<AgentRunNode['status'], { label: string; className: string }> = {
  pending: {
    label: 'Pending',
    className: 'bg-gray-100 text-gray-500',
  },
  waiting: {
    label: 'Waiting',
    className: 'bg-gray-100 text-gray-600',
  },
  running: {
    label: 'Running',
    className: 'bg-amber-100 text-amber-700',
  },
  completed: {
    label: 'Completed',
    className: 'bg-emerald-100 text-emerald-700',
  },
};

// Agent 执行链路：在第四步「生成内容」结果区下方展示
// 以时间线形式展示 5 个 Agent 的职责、输入、输出、状态与示例输出
export default function AgentExecutionChain({ nodes }: AgentExecutionChainProps) {
  return (
    <section className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* 模块头部 */}
      <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Agent 执行链路
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Content Agent Workflow · 当前 MVP 使用静态示例数据模拟 Agent 工作流，未接入真实大模型 API
          </p>
        </div>
        <span className="text-xs text-gray-400 whitespace-nowrap">
          共 {nodes.length} 个 Agent · {nodes.filter(n => n.status === 'completed').length} 已完成 / {nodes.filter(n => n.status === 'running').length} 进行中
        </span>
      </div>

      {/* 时间线主体 */}
      <ol className="relative px-6 py-6 space-y-6">
        {/* 左侧贯穿的时间轴线 */}
        <span
          aria-hidden
          className="absolute left-[34px] top-8 bottom-8 w-px bg-gray-200"
        />

        {nodes.map((node, index) => {
          const badge = STATUS_BADGE[node.status];
          return (
            <li key={node.id} className="relative pl-12">
              {/* 圆形节点编号 */}
              <span
                className={`absolute left-0 top-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 border-white shadow-sm ${
                  node.status === 'completed'
                    ? 'bg-emerald-600 text-white'
                    : node.status === 'running'
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                }`}
              >
                {index + 1}
              </span>

              {/* 单个 Agent 卡片 */}
              <div className="bg-gray-50 rounded-lg border border-gray-100 p-4">
                {/* 标题行：名称 + 状态 */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <div className="text-base font-semibold text-gray-900">
                      {node.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {node.nameZh}
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${badge.className}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                    {badge.label}
                  </span>
                </div>

                {/* 职责 */}
                <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                  <span className="text-gray-500">职责：</span>
                  {node.role}
                </p>

                {/* 输入 / 输出：两列 */}
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-white rounded border border-gray-100 p-3">
                    <div className="text-xs font-medium text-gray-500 uppercase mb-1">
                      输入
                    </div>
                    <p className="text-sm text-gray-700">{node.input}</p>
                  </div>
                  <div className="bg-white rounded border border-gray-100 p-3">
                    <div className="text-xs font-medium text-gray-500 uppercase mb-1">
                      输出
                    </div>
                    <p className="text-sm text-gray-700">{node.output}</p>
                  </div>
                </div>

                {/* 示例输出 */}
                <div className="mt-3 bg-indigo-50/60 rounded border border-indigo-100 p-3">
                  <div className="text-xs font-medium text-indigo-600 uppercase mb-1">
                    示例输出
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed">{node.sample}</p>
                </div>

                {/* 简短说明（模拟状态提示） */}
                <p className="mt-3 text-xs text-gray-400 leading-relaxed">
                  {node.note}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      {/* 底部说明条 */}
      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/60 rounded-b-lg">
        <p className="text-xs text-gray-500 leading-relaxed">
          说明：上述 Agent 执行链路为 BrandPilot 内部 Agent 编排的可视化呈现，状态随工作台步骤动态变化。当前 MVP
          版本未接入真实大模型 API，示例输出基于静态数据模拟；后续可在此基础上接入真实
          大模型 API，扩展为真实的多 Agent 内容运营系统。
        </p>
      </div>
    </section>
  );
}
