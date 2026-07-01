import { AgentStatus, AGENT_DEFINITIONS } from '@/data/agents';

// 双轨进度条组件：上行显示工作台步骤，下行显示对应 Agent 节点的动态状态
interface ProgressBarProps {
  currentStep: 1 | 2 | 3 | 4 | 5
  agentStatuses: AgentStatus[]
}

// 5 个步骤标签
const STEPS = [
  '产品资料',
  '选择平台',
  '内容目标',
  '生成内容',
  '发布前审核',
]

// Agent 状态对应的圆点样式
function agentDotClass(status: AgentStatus): string {
  switch (status) {
    case 'completed':
      return 'bg-emerald-500'
    case 'running':
      return 'bg-amber-500 animate-pulse'
    default:
      return 'bg-gray-300'
  }
}

// Agent 状态对应的文字样式
function agentLabelClass(status: AgentStatus): string {
  switch (status) {
    case 'completed':
      return 'text-emerald-600'
    case 'running':
      return 'text-amber-600 font-medium'
    default:
      return 'text-gray-400'
  }
}

export default function ProgressBar({ currentStep, agentStatuses }: ProgressBarProps) {
  return (
    <div className="w-full space-y-2">
      {/* 上行：工作台步骤 */}
      <div className="flex items-center">
        {STEPS.map((label, index) => {
          const step = (index + 1) as 1 | 2 | 3 | 4 | 5
          const isCurrent = step === currentStep
          const isCompleted = step < currentStep

          const circleClass = isCurrent
            ? 'bg-indigo-600 text-white'
            : isCompleted
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-gray-100 text-gray-400'

          const labelClass = isCurrent
            ? 'text-indigo-600 font-medium'
            : isCompleted
              ? 'text-indigo-700'
              : 'text-gray-400'

          return (
            <div
              key={label}
              className="flex items-center"
              style={{ flex: index === STEPS.length - 1 ? '0 0 auto' : '1 1 auto' }}
            >
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${circleClass}`}
                >
                  {step}
                </div>
                <span className={`text-xs whitespace-nowrap ${labelClass}`}>
                  {label}
                </span>
              </div>

              {index < STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-3 mb-5 ${
                    isCompleted ? 'bg-indigo-200' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* 下行：Agent 节点（与步骤列对齐） */}
      <div className="flex items-center">
        {AGENT_DEFINITIONS.map((agent, index) => {
          const status = agentStatuses[index]
          const isLast = index === AGENT_DEFINITIONS.length - 1
          const prevCompleted = index > 0 && agentStatuses[index - 1] === 'completed'

          return (
            <div
              key={agent.id}
              className="flex items-center"
              style={{ flex: isLast ? '0 0 auto' : '1 1 auto' }}
            >
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${agentDotClass(status)}`}
                />
                <span className={`text-[10px] whitespace-nowrap ${agentLabelClass(status)}`}>
                  {agent.nameZh}
                </span>
              </div>

              {!isLast && (
                <div
                  className={`h-0.5 flex-1 mx-3 mb-3.5 ${
                    prevCompleted ? 'bg-emerald-200' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
